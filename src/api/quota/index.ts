import { defHttp } from '/@/utils/http/axios';
import type { CategoryTreeModel, QuotaItem } from '/#/quota';
import { CategoryTreeType, SourceTypeEnum } from '/@/enums/quotaEnum';

enum Api {
  GetCategoryTree = '/updatemonitor/dict-index/categoryTree',
  UpdateCategoryTree = '/updatemonitor/dict-index/categorySaveOrUpdate',
  DelCategoryTree = '/updatemonitor/dict-index/categoryDelete',
  GetDirQuota = '/index/index',
  SearchQuota = '/updatemonitor/dict-index/searchIndex',
}

export enum searchType {
  sys = 0,
  user = 1,
  all = 2,
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
