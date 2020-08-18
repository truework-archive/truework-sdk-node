import * as types from '../types';

export function createPaginatedResponse<T> (
  data: T,
  {
    limit,
    offset,
  }: {
    limit?: number;
    offset?: number;
  }
) {
  const results = [];

  for (let i = 0; i < (limit || 20); i++) {
    results.push(data);
  }

  const res: types.PaginatedResponse<T> = {
    results,
    next: '...',
    count: 40,
  };

  if (offset) {
    res.previous = '...';
  }

  return res;
}
