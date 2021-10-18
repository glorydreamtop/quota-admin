import { chartConfigType } from './chart';
import { versionEnum } from '/@/enums/chartEnum';

export interface TemplateItem {
  [key: string]: any;
  version: versionEnum;
  config: chartConfigType;
  categoryId: number;
}
