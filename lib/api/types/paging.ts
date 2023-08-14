export type OptionalPagingOptsOpts = { page?: number; pageSize?: number };

export type PagingOpts = Required<OptionalPagingOptsOpts>;

export type PagingDto = PagingOpts & { skip: number };

export type PagingModel<T> = {
  items: T[];
  totalItems: number;
  hasNext: boolean;
} & PagingOpts;
