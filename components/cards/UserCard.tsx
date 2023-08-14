'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type PersonType = 'Community' | 'User';

interface IUserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: PersonType;
}

export const UserCard = (props: IUserCardProps) => {
  const router = useRouter();

  const isCommunity = props.personType == 'Community';

  const handleView = () =>
    isCommunity
      ? router.push(`/communities/${props.id}`)
      : router.push(`/profile/${props.id}`);

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <Image
            src={props.imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{props.name}</h4>
          <p className="text-small-medium text-gray-1">@{props.username}</p>
        </div>
      </div>

      <Button className="user-card_btn" variant="primary" onClick={handleView}>
        View
      </Button>
    </article>
  );
};
