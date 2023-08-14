import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/api/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchThreadById } from '@/lib/api/actions/thread.actions';
import { ThreadCard } from '@/components/cards/ThreadCard';
import { CommentForm } from '@/components/forms/CommentForm';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id.toString()}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={{
            id: thread.author.id,
            name: thread.author.name,
            image: thread.author.image,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children.map((item: any) => ({
            author: { image: item.author.image },
          }))}
        />
      </div>

      <div className="mt-7">
        <CommentForm
          threadId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children?.map((childItem: any) => (
          <ThreadCard
            key={childItem._id.toString()}
            id={childItem._id.toString()}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={{
              id: childItem.author.id,
              name: childItem.author.name,
              image: childItem.author.image,
            }}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children.map((item: any) => ({
              author: { image: item.author.image },
            }))}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
