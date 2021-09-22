export interface BasicPageParams {
  currPage: number;
  pageSize: number;
}

export interface BasicFetchResult<T extends any> {
  list: T[];
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
}

export interface IdModel {
  id: number;
}

export type BasicIdParams<T extends any> = IdModel & T;
