import React from 'react';
import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/onboarding');

  return <div></div>;
};

export default Page;
