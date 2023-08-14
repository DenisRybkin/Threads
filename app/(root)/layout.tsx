import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Topbar from '@/components/layouts/Topbar';
import { LeftSidebar } from '@/components/layouts/LeftSidebar';
import RightSidebar from '@/components/layouts/RightSidebar';
import { Bottombar } from '@/components/layouts/Bottombar';
import { MyClerkProvider } from '@/providers/ClerkProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Threads application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyClerkProvider>
      <html lang="en">
        <body className={inter.className + ' dark'}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </MyClerkProvider>
  );
}
