import { chartConfigType } from './chart';
import { versionEnum } from '/@/enums/chartEnum';

export interface TemplateItem {
  [key: string]: any;
  version: versionEnum;
  config: chartConfigType;
  categoryId: number;
  id: number;
}

export interface TemplateDOM {
  [key: string]: any;
  version: versionEnum;
  config: chartConfigType;
  categoryId: number;
  id: number;
  uniqId: string;
  pageConfig: {
    width: string;
    height: string;
  };
}
