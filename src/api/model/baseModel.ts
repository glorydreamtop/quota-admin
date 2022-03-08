export interface BasicPageParams {
  currPage: number;
  pageSize: number;
  [key: string]: any;
}

export interface BasicFetchResult<T> {
  list: T[];
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
}

export interface IdModel {
  id: number;
}

export type BasicIdParams<T> = IdModel & T;
