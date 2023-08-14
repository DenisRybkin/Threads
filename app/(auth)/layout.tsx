import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../globals.css';
import { MyClerkProvider } from '@/providers/ClerkProvider';
export const metadata: Metadata = {
  title: 'Threads',
  description: 'Threads application',
};

const inter = Inter({ subsets: ['latin'] });

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <MyClerkProvider>
      <html lang="en">
        <body className={inter.className + ' bg-dark-1'}>
          <div className="w-full min-h-screen flex flex-col justify-center items-center">
            {children}
          </div>
        </body>
      </html>
    </MyClerkProvider>
  );
}
