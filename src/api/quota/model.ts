import { quotaDataExportTypeEnum, quotaDataPastUnitTypeEnum } from '.';
import { QuotaItem } from '/#/quota';

export interface getQuotaDataParams {
  startDate: string;
  endDate: string;
  exportPara: quotaDataExportTypeEnum;
  lastFlag?: boolean;
  pastUnit?: quotaDataPastUnitTypeEnum;
  pastValue?: number;
  rows: QuotaItem[];
}

export type getQuotaDataResult = { id: number; name: string; data: Array<[number, number]> };
