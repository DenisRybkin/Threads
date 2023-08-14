'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDateString } from '@/lib/utils/date';
import { cn } from '@/lib/utils/classNames';
import { Button } from '@/components/ui/button';

interface IThreadCardProps {
  id: string;
  currentUserId?: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

export const ThreadCard = (props: IThreadCardProps) => {
  const authorLink = `/profile/${props.author.id}`;

  const communityInfo =
    !props.isComment &&
    props.community &&
    `${formatDateString(props.createdAt)}  ${
      props.community?.name && `- ${props.community.name}`
    } Community`;

  return (
    <article
      className={cn(
        'flex w-full flex-col rounded-xl',
        props.isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-3 md:p-7'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={authorLink} className="relative h-11 w-11">
              <Image
                src={props.author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={authorLink} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {props.author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">
              {props.content}
            </p>

            <div
              className={`${
                props.isComment && 'mb-10'
              } mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Button variant="ghost" size="icon">
                  <Image
                    src="/assets/heart-gray.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Button>
                <Button variant="ghost" size="icon">
                  <Link href={`/thread/${props.id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="heart"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Image
                    src="/assets/repost.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image
                    src="/assets/share.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Button>
              </div>

              {props.isComment && props.comments.length > 0 && (
                <Link href={`/thread/${props.id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {props.comments.length} repl
                    {props.comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/*<DeleteThread
          threadId={JSON.stringify(props.id)}
          currentUserId={props.currentUserId}
          authorId={props.author.id}
          parentId={props.parentId}
          isComment={props.isComment}
        />*/}
      </div>

      {!props.isComment && props.comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {props.comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${
                index != 0 && '-ml-5'
              } rounded-full object-cover h-[24px] w-[24px]`}
            />
          ))}

          <Link href={`/thread/${props.id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {props.comments.length} repl
              {props.comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}

      {!props.isComment && props.community && (
        <Link
          href={`/communities/${props.community.id}`}
          className="mt-5 flex items-center"
        >
          <div className="text-subtle-medium text-gray-1">{communityInfo}</div>

          <Image
            src={props.community.image}
            alt={props.community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};
