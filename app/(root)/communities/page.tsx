import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/api/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchCommunities } from '@/lib/api/actions/community.actions';
import { Searchbar } from '@/components/shared/Searchbar';
import { CommunityCard } from '@/components/cards/CommunityCard';
import { Pagination } from '@/components/shared/Pagination';

export default async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pagingOpts: {
      page: searchParams?.page ? +searchParams.page : 1,
      pageSize: 25,
    },
  });

  return (
    <>
      <h1 className="head-text">Communities</h1>

      <div className="mt-5">
        <Searchbar currentUrl="/communities" placeholder="Search communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.items.length == 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.items.map(community => (
              <CommunityCard
                key={community.id.toString()}
                id={community.id.toString()}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        currentUrl="/communities"
        page={searchParams?.page ? +searchParams.page : 1}
        hasNext={result.hasNext}
      />
    </>
  );
};
