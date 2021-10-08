import { defHttp } from '/@/utils/http/axios';
import type { CategoryTreeModel, QuotaItem } from '/#/quota';
import { CategoryTreeType, SourceTypeEnum } from '/@/enums/quotaEnum';
import { getQuotaDataParams, getQuotaDataResult } from './model';
import { pick } from 'lodash-es';

enum Api {
  GetCategoryTree = '/updatemonitor/dict-index/categoryTree',
  UpdateCategoryTree = '/updatemonitor/dict-index/categorySaveOrUpdate',
  DelCategoryTree = '/updatemonitor/dict-index/categoryDelete',
  GetDirQuota = '/index/index',
  SearchQuota = '/updatemonitor/dict-index/searchIndex',
  GetQuotaData = '/updatemonitor/dict-index/exportData',
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
    return pick(item, ['sourceCode', 'id', 'name']);
  });
  return defHttp.post<getQuotaDataResult[]>({
    url: Api.GetQuotaData,
    params: {
      ...params,
      rows,
    },
  });
}
