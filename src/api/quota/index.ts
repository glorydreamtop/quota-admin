import { defHttp } from '/@/utils/http/axios';
import type { CategoryTreeModel, QuotaItem } from '/#/quota';
import { CategoryTreeType, SourceTypeEnum } from '/@/enums/quotaEnum';
import { getQuotaDataParams, getQuotaDataResult, requestUpdateParams } from './model';
import { pick } from 'lodash-es';
import { ResultEnum } from '/@/enums/httpEnum';

enum Api {
  GetCategoryTree = '/updatemonitor/dict-index/categoryTree',
  UpdateCategoryTree = '/updatemonitor/dict-index/categorySaveOrUpdate',
  DelCategoryTree = '/updatemonitor/dict-index/categoryDelete',
  GetDirQuota = '/index/index',
  SearchQuota = '/updatemonitor/dict-index/searchIndex',
  GetQuotaData = '/updatemonitor/dict-index/exportData',
  RequestUpdateQuotaData = '/dataUpdater/updateIndex',
  MoveQuota = '/category/indexMove',
  SortQuota = '/category/categorySorting',
  UpdateCategory = '/updatemonitor/dict-index/categorySaveOrUpdate',
  SaveQuota = '/updatemonitor/dict-index/saveOrUpdateDictIndex',
  DelQuota = '/updatemonitor/dict-index/deleteDictIndex',
}

export enum searchType {
  sys = 0,
  user = 1,
  all = 2,
}

export enum quotaDataExportTypeEnum {
  JSON = '0',
  XLSX = '1',
  CSV = '2',
}

export enum quotaDataPastUnitTypeEnum {
  day = '日',
  last = '期',
  month = '月',
}

/**
 * @description: getCategoryTree
 */
export function getQuotaTree(params: {
  type: CategoryTreeType.sysQuota | CategoryTreeType.userQuota;
}) {
  return defHttp.get<CategoryTreeModel[]>({
    url: Api.GetCategoryTree,
    params,
  });
}

export function getDirQuota(params: { categoryId: number }) {
  return defHttp.get<QuotaItem[]>({
    url: Api.GetDirQuota,
    params,
  });
}

export function searchQuota(params: {
  flag?: searchType;
  key: string;
  sourceType?: SourceTypeEnum;
}) {
  if (!params.flag) params.flag = searchType.all;
  return defHttp.get<QuotaItem[]>({
    url: Api.SearchQuota,
    params,
  });
}

export function getQuotaData(params: getQuotaDataParams) {
  const rows = params.rows.map((item) => {
    return pick(item, ['sourceCode', 'id', 'name', 'sourceType']);
  });
  return defHttp.post<getQuotaDataResult[]>({
    url: Api.GetQuotaData,
    params: {
      ...params,
      rows,
    },
  });
}

export function getSingleQuotaData({ id, date }: { id: number; date: string }) {
  const rows = [{ id }];
  return defHttp.post<getQuotaDataResult[]>({
    url: Api.GetQuotaData,
    params: {
      endDate: date,
      lastFlag: true,
      rows,
    },
  });
}

export function requestUpdateQuotaData(params: requestUpdateParams) {
  return defHttp.post<ResultEnum.TYPE>(
    {
      url: Api.RequestUpdateQuotaData,
      params,
    },
    {
      isTransformResponse: false,
    },
  );
}

export function moveQuota(params: requestUpdateParams) {
  return defHttp.post<ResultEnum.TYPE>({
    url: Api.MoveQuota,
    params,
  });
}

export function sortQuota(params: {
  type: CategoryTreeType;
  categorySortingList: { id: number; sorting: number }[];
}) {
  const types = {
    [CategoryTreeType.sysQuota]: 1,
    [CategoryTreeType.userQuota]: 1,
    [CategoryTreeType.sysTemplate]: 2,
    [CategoryTreeType.userTemplate]: 2,
    [CategoryTreeType.folder]: 0,
  };
  params.type = types[params.type];
  return defHttp.post<ResultEnum.TYPE>({
    url: Api.SortQuota,
    params,
  });
}

export function updateCategory(params: {
  id?: number;
  name: string;
  parentId: number;
  type?: CategoryTreeType;
}) {
  return defHttp.post<ResultEnum.TYPE>({
    url: Api.UpdateCategory,
    params,
  });
}

export function delCategory(params: { id: number }) {
  return defHttp.get<ResultEnum.TYPE>({
    url: Api.DelCategoryTree,
    params,
  });
}

export function saveQuota(params: Partial<QuotaItem>) {
  return defHttp.post<ResultEnum.TYPE>({
    url: Api.SaveQuota,
    params,
  });
}

export function delQuota(params: { indexId: number }) {
  return defHttp.get<ResultEnum.TYPE>({
    url: Api.DelQuota,
    params,
  });
}
