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

export interface pageSettingType {
  pageType?: string;
  pagination: boolean;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  horizontal: boolean;
  header: {
    show: boolean;
    left: string;
    center: string;
    right: string;
  };
  footer: {
    show: true;
    left: string;
    center: string;
    right: string;
    pageNum: boolean;
  };
  showElementborder: boolean;
}
