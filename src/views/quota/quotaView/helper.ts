import type { normalChartConfigType, normalQuotaSettingType } from '/#/chart';
import { today, yearsAgo } from '/@/utils/dateUtil';
import { timeConfigEnum, chartTypeEnum } from '/@/enums/chartEnum';

export function getNormalChartDefaultConfig(): normalChartConfigType {
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
    showLastest: true,
    showHighest: false,
    quotaList: [],
    valueFormatter: {
      afterDot: 2,
      scientificNotation: false,
    },
    yAxis: [
      {
        min: undefined,
        max: undefined,
        inverse: false,
        position: 'left',
      },
    ],
  };
}
export function getNormalQuotaDefaultSetting(): normalQuotaSettingType {
  return {
    yAxisIndex: 0,
    type: 'line',
  };
}
