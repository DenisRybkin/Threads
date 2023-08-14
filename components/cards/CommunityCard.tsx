'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/classNames';
import Image from 'next/image';
import Link from 'next/link';

interface ICommunityCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    image: string;
  }[];
}

export const CommunityCard = (props: ICommunityCardProps) => {
  const communityLink = `/communities/${props.id}`;

  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={communityLink} className="relative h-12 w-12">
          <Image
            src={props.imgUrl}
            alt="community_logo"
            fill
            className="rounded-full object-cover"
          />
        </Link>

        <div>
          <Link href={communityLink}>
            <h4 className="text-base-semibold text-light-1">{props.name}</h4>
          </Link>
          <p className="text-small-medium text-gray-1">@{props.username}</p>
        </div>
      </div>

      <p className="mt-4 text-subtle-medium text-gray-1">{props.bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={communityLink}>
          <Button size="sm" variant="primary" className="community-card_btn">
            View
          </Button>
        </Link>

        {props.members.length > 0 && (
          <div className="flex items-center">
            {props.members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={cn(
                  'rounded-full object-cover h-[28px] w-[28px]',
                  index != 0 && '-ml-2'
                )}
              />
            ))}
            {props.members.length > 3 && (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {props.members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
