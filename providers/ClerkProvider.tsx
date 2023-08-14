import React from 'react';
import { dark } from '@clerk/themes';
import { ClerkProvider } from '@clerk/nextjs';

export const MyClerkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#121417',
          colorPrimary: '#877EFF',
          colorInputBackground: '#000000',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};
