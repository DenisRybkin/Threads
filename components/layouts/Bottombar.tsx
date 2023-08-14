'use client';

import { sidebarLinks } from '@/constants/navigation';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';
import { cn } from '@/lib/utils/classNames';

export function Bottombar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(link => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={cn('bottombar_link', isActive && 'bg-primary-500')}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(' ')[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
