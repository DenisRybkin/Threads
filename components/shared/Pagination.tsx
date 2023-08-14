'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface IPaginationProps {
  page: number;
  hasNext: boolean;
  currentUrl: string;
}

type PagingClickType = 'prev' | 'next';

export const Pagination = (props: IPaginationProps) => {
  const router = useRouter();

  const handleNavigation = (type: PagingClickType) => () => {
    let nextPageNumber = props.page;

    switch (type) {
      case 'next': {
        nextPageNumber = props.page + 1;
        break;
      }
      case 'prev':
        nextPageNumber = Math.max(1, props.page - 1);
    }

    router.push(
      props.currentUrl + (nextPageNumber && `+?page=${nextPageNumber}`)
    );
  };

  if (!props.hasNext && props.page == 1) return null;

  return (
    <div className="pagination">
      <Button
        onClick={handleNavigation('prev')}
        disabled={props.page == 1}
        className="!text-small-regular text-light-2"
      >
        Prev
      </Button>
      <p className="text-small-semibold text-light-1">{props.page}</p>
      <Button
        onClick={() => handleNavigation('next')}
        disabled={!props.hasNext}
        className="!text-small-regular text-light-2"
      >
        Next
      </Button>
    </div>
  );
};
