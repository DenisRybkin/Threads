import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser, fetchUsers } from '@/lib/api/actions/user.actions';
import { redirect } from 'next/navigation';
import { Searchbar } from '@/components/shared/Searchbar';
import { UserCard } from '@/components/cards/UserCard';
import { Pagination } from '@/components/shared/Pagination';

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pagingOpts: {
      page: searchParams?.page ? +searchParams.page : 1,
      pageSize: 25,
    },
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar currentUrl="/search" placeholder="Search creators" />

      <div className="mt-14 flex flex-col gap-9">
        {result.items.length == 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.items.map(person => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        currentUrl="/search"
        page={searchParams?.page ? +searchParams.page : 1}
        hasNext={result.hasNext}
      />
    </section>
  );
};

export default Page;
