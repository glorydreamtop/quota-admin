import type {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  normalQuotaSettingType,
  pieChartConfigType,
  quantileRadarChartConfigType,
  radarChartConfigType,
  seasonalChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { Ref, ref } from 'vue';
import { formatToDate, today, yearsAgo } from '/@/utils/dateUtil';
import {
  timeConfigEnum,
  chartTypeEnum,
  echartSeriesTypeEnum,
  structuralOffsetUnitEnum,
} from '/@/enums/chartEnum';
import { quotaDataPastUnitTypeEnum, getQuotaData, quotaDataExportTypeEnum } from '/@/api/quota';
import { SelectedQuotaItem } from './components/hooks';
import { downloadByData } from '/@/utils/file/download';
import { AxiosResponse } from 'axios';

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
      },

      selfColorScheme: '',
      type: chartTypeEnum.normal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: 0,
        normalized: false,
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
        sortYear: [],
      },

      selfColorScheme: '',
      type: chartTypeEnum.seasonal,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: 0,
        normalized: false,
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
        scientificNotation: 0,
        normalized: false,
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

      selfColorScheme: '',
      type: chartTypeEnum.normalRadar,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: 0,
        normalized: false,
      },
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
        scientificNotation: 0,
        normalized: false,
      },
      quantileOffset: '1,2,3,5',
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
        scientificNotation: 0,
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

      selfColorScheme: '',
      type: chartTypeEnum.pie,
      showLastest: true,
      showHighest: false,
      quotaList: [],
      valueFormatter: {
        afterDot: 2,
        scientificNotation: 0,
        normalized: false,
      },
    } as pieChartConfigType,
  };
  return defaultConfig[type];
}
export function getNormalQuotaDefaultSetting(): normalQuotaSettingType {
  return {
    yAxisIndex: 0,
    type: echartSeriesTypeEnum.line,
    lineWidth: 2,
  };
}

type useDownloadXLSXRes = [
  Ref<string[]>,
  { getXLSX: (rows: SelectedQuotaItem[]) => Promise<void> },
];
export function useDownloadXLSX(): useDownloadXLSXRes {
  const dateStr = ref([yearsAgo(1), formatToDate()]);
  async function getXLSX(rows: SelectedQuotaItem[]) {
    const response = (await getQuotaData({
      startDate: dateStr.value[0],
      endDate: dateStr.value[1],
      exportPara: quotaDataExportTypeEnum.XLSX,
      rows,
      exportConfig: JSON.stringify({ ID: 'ID', NAME: 'NAME' }),
    })) as unknown;
    const { data, headers } = response as AxiosResponse;
    const filename = headers['content-disposition'].split(';')[1].split('filename=')[1];
    downloadByData(data, decodeURI(filename));
  }
  return [dateStr, { getXLSX }];
}
