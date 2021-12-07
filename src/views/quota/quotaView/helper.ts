import type {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  pieChartConfigType,
  quantileRadarChartConfigType,
  radarChartConfigType,
  seasonalChartConfigType,
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
        sortYear: [],
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 0,
      },
      selfColorScheme: '',
      type: chartTypeEnum.normal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
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
        sortYear: [],
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 0,
      },
      selfColorScheme: '',
      type: chartTypeEnum.seasonal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
    } as seasonalChartConfigType,
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

      selfColorScheme: '',
      type: chartTypeEnum.bar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
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
      selfColorScheme: '',
      type: chartTypeEnum.normalRadar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      seriesSetting: [],
    } as radarChartConfigType,
    quantileRadar: {
      title: '',
      name: '',
      timeConfig: {
        startDate: yearsAgo(5),
        endDate: today(),
        type: timeConfigEnum.default,
      },

      selfColorScheme: '',
      type: chartTypeEnum.quantileRadar,
      showLastest: false,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      quantileOffset: '1,2,3,5',
      seriesSetting: [],
    } as quantileRadarChartConfigType,
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

      selfColorScheme: '',
      type: chartTypeEnum.structural,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      structuralOffset: '30,15,7,1,0',
      structuralOffsetUnit: structuralOffsetUnitEnum.natureDay,
      yAxis: [
        {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: 0,
          axisLine: {
            show: true,
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      seriesSetting: [],
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

      selfColorScheme: '',
      type: chartTypeEnum.pie,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        normalized: false,
      },
      seriesSetting: [],
    } as pieChartConfigType,
  };
  return defaultConfig[type];
}
