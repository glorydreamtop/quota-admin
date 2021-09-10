import { defHttp } from '/@/utils/http/axios';
import type { CategoryTreeModel } from '/#/quota';
import { CategoryTreeType } from '/@/enums/quotaEnum';

enum Api {
  GetCategoryTree = '/updatemonitor/dict-index/categoryTree',
  UpdateCategoryTree = '/updatemonitor/dict-index/categorySaveOrUpdate',
  DelCategoryTree = '/updatemonitor/dict-index/categoryDelete',
  GetDirQuota = '/index/index',
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

export function getDirQuota() {
  return defHttp.get<QuotaItem[]>({
    url: Api.GetDirQuota,
    params,
  });
}
