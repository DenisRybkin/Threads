import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface IProfileHeaderProps {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | 'Community';
}

export const ProfileHeader = (props: IProfileHeaderProps) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={props.imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {props.name}
            </h2>
            <p className="text-base-medium text-gray-1">@{props.username}</p>
          </div>
        </div>
        {props.accountId == props.authUserId && props.type != 'Community' && (
          <Link href="/profile/edit">
            <Button
              variant="default"
              data={{
                leftIcon: (
                  <Image
                    src="/assets/edit.svg"
                    alt="logout"
                    width={16}
                    height={16}
                  />
                ),
              }}
            >
              Edit
            </Button>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">
        {props.bio}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};
