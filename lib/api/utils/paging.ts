import {
  OptionalPagingOptsOpts,
  PagingDto,
  PagingOpts,
} from '@/lib/api/types/paging';

export const transformPagingOpts = (
  opts?: OptionalPagingOptsOpts,
  toPage: number = 1,
  toPageSize: number = 25
): PagingOpts => ({ page: toPage, pageSize: toPageSize });

export const map2PagingDto = (opts: PagingOpts): PagingDto => ({
  ...opts,
  skip: (opts.page - 1) * opts.pageSize,
});
