import { sourceTypeEnum } from '/@/enums/quotaEnum';

export interface CategoryTreeModel {
  folder: boolean;
  code: string;
  children?: CategoryTreeModel[];
  lazy: boolean;
  sorting: number;
  name: string;
  description: Nullable<string>;
  id: number;
  type: 'DictCategory';
  key: number;
  parentId: Nullable<number>;
  icon?: 'quota' | 'folder' | 'table' | 'chart' | 'oldChart' | 'sqlTable';
}

export interface QuotaItem {
  id: number;
  dateLast: string;
  name: string;
  sourceCode: string;
  sourceType: sourceTypeEnum;
  frequency: Nullable<'日' | '月' | '年' | '周' | '季'>;
  shortName: Nullable<string>;
  unit: Nullable<string>;
  categoryIdList?: number[];
  categoryId?: number;
  timeLastUpdate:string;
}
