import { quotaDataExportTypeEnum, quotaDataPastUnitTypeEnum } from '.';

export interface getQuotaDataParams {
  startDate: string;
  endDate: string;
  exportPara: quotaDataExportTypeEnum;
  lastFlag: boolean;
  pastUnit: quotaDataPastUnitTypeEnum;
}
