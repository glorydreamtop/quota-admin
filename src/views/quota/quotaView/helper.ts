import type {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  normalQuotaSettingType,
  pieChartConfigType,
  radarChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { today, yearsAgo } from '/@/utils/dateUtil';
import {
  timeConfigEnum,
  chartTypeEnum,
  echartSeriesTypeEnum,
  structuralOffsetUnitEnum,
} from '/@/enums/chartEnum';
import { quotaDataPastUnitTypeEnum } from '/@/api/quota';

export function getChartDefaultConfig(type: chartTypeEnum): chartConfigType {
  const defaultConfig = {
    normal: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
        sortMonth: [],
        startMonth: 1,
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
          offset: 0,
          position: 'left',
        },
      ],
    } as normalChartConfigType,
    seasonal: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
        sortMonth: [],
        startMonth: 1,
      },
      colorSchemeId: 0,
      selfColorScheme: '',
      type: chartTypeEnum.seasonal,
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
          offset: 0,
          position: 'left',
        },
      ],
    },
    bar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
        startMonth: 1,
      },
      colorSchemeId: 0,
      selfColorScheme: '',
      type: chartTypeEnum.bar,
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
          offset: 0,
          position: 'left',
        },
      ],
    } as barChartConfigType,
    normalRadar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
      },
      colorSchemeId: 0,
      selfColorScheme: '',
      type: chartTypeEnum.normalRadar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: false,
      },
    } as radarChartConfigType,
    structural: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 3,
      },
      colorSchemeId: 0,
      selfColorScheme: '',
      type: chartTypeEnum.structural,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: false,
      },
      structuralOffset: '30,15,7,1,0',
      structuralOffsetUnit: structuralOffsetUnitEnum.natureDay,
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          position: 'left',
        },
      ],
    } as structuralChartConfigType,
    pie: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(1),
        endDate: today(),
        type: timeConfigEnum.default,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 1,
      },
      colorSchemeId: 0,
      selfColorScheme: '',
      type: chartTypeEnum.pie,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: false,
      },
    } as pieChartConfigType,
  };
  return defaultConfig[type];
}
export function getNormalQuotaDefaultSetting(): normalQuotaSettingType {
  return {
    yAxisIndex: 0,
    type: echartSeriesTypeEnum.line,
  };
}
