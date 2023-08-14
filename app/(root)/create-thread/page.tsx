import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/api/actions/user.actions';
import { redirect } from 'next/navigation';
import { PostThreadForm } from '@/components/forms/PostThreadForm';

export default async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className="head-text">Create thread</h1>

      <PostThreadForm userId={userInfo._id} />
    </>
  );
}
