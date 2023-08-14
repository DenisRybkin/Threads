import { fetchPosts } from '@/lib/api/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import { ThreadCard } from '@/components/cards/ThreadCard';

export default async function Home() {
  const [user, threads] = await Promise.all([
    currentUser(),
    fetchPosts({ page: 1, pageSize: 30 }),
  ]);

  threads.items.forEach(post => post.community && console.log(post.community));

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {threads.items.length == 0 ? (
          <p className="no-relust">No threads found</p>
        ) : (
          <>
            {threads.items.map(post => (
              <ThreadCard
                key={post._id.toString()}
                id={post._id.toString()}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={{
                  id: post.author.id,
                  name: post.author.name,
                  image: post.author.image,
                }}
                community={
                  post.community && {
                    id: post.community.id,
                    name: post.community.name,
                    image: post.community.image,
                  }
                }
                createdAt={post.createdAt}
                comments={(post.children ?? []).map((item: any) => ({
                  author: { image: item.author.image },
                }))}
                isComment={false}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
