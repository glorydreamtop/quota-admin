import { baseChartConfigType, baseQuotaSettingType } from '/#/chart';
import { today, yearsAgo } from '/@/utils/dateUtil';
import { timeConfigEnum, chartTypeEnum } from '/@/enums/chartEnum';

export function getchartDefaultConfig(): baseChartConfigType {
  return {
    title: '',
    timeConfig: {
      startDate: yearsAgo(5),
      endDate: today(),
      type: timeConfigEnum.default,
    },
    colorSchemeId: 0,
    selfColorScheme: '',
    type: chartTypeEnum.normal,
    typeOptions: {
      showLastest: true,
      quotaList: [],
    },
  };
}
export function getquotaDefaultSetting(): baseQuotaSettingType {
  return {
    yAxisIndex: 0,
  };
}
