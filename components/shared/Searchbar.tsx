'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/lib/hooks/useDebounce';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

interface ISearchbarProps {
  currentUrl: string;
  placeholder: string;
}

export const Searchbar = (props: ISearchbarProps) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDebounce(search);

  const handlerSearchParams = () =>
    router.push(
      props.currentUrl + (debouncedSearch && `?q=${debouncedSearch}`)
    );

  useEffect(handlerSearchParams, [debouncedSearch, props.currentUrl]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={props.placeholder}
        className="no-focus searchbar_input"
      />
    </div>
  );
};
