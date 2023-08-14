import { AccountProfileForm } from '@/components/forms/AccountProfileForm';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/api/actions/user.actions';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect('/');

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl justify-start flex-col px-10 py-20 rounded-md">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Treads
      </p>
      <section className="mt-9 bg-dark-2 rounded-md p-10 max-sm:p-5">
        <AccountProfileForm userData={userData} submitLabel="Continue" />
      </section>
    </main>
  );
}
