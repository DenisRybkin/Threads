import React from 'react';
import { redirect } from 'next/navigation';
import { fetchThreadsByUserId } from '@/lib/api/actions/thread.actions';
import { ThreadCard } from '@/components/cards/ThreadCard';

interface IResult {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

type AccountType = 'Community' | 'User';

interface IThreadsTabContentProps {
  currentUserId: string;
  accountId: string;
  accountType: AccountType;
}

export const ThreadsTabContent = async (props: IThreadsTabContentProps) => {
  let result: IResult;

  if (props.accountType == 'User')
    result = await fetchThreadsByUserId(props.accountId);
  //else result = undefined; // await fetchUserPosts(accountId);

  // @ts-ignore
  if (!result) return redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map(thread => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={props.currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            props.accountType == 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            props.accountType == 'Community'
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children.map((item: any) => ({
            author: { image: item.author.image },
          }))}
        />
      ))}
    </section>
  );
};
