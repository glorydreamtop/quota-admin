import { chartConfigType } from './chart';
import { versionEnum } from '/@/enums/chartEnum';

export interface TemplateItem {
  [key: string]: any;
  version: versionEnum;
  config: chartConfigType | TextConfig;
  categoryId: number;
  id: number;
}

export interface TemplateDOM {
  [key: string]: any;
  type: 'Chart' | 'Table' | 'Text' | 'Img';
  version?: versionEnum;
  config: chartConfigType | TextConfig | ImgConfig;
  categoryId?: number;
  id?: number;
  uniqId: string;
  pageConfig: {
    width: string;
    height: string;
  };
}

export interface TextConfig {
  text: string;
}

export interface ImgConfig {
  url: string;
  mode: string;
}
