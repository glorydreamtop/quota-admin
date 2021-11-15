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
import { today, yearsAgo } from '/@/utils/dateUtil';
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
import XLSX from 'xlsx';

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

type useDownloadXLSXRes = {
  getXLSX: (rows: SelectedQuotaItem[], dateStr: string[]) => Promise<Blob>;
  downloadXLSX: () => void;
  getExcelData: (rawFile: Blob) => Promise<{
    header: string[];
    tableData: object[];
  }>;
};
export function useDownloadXLSX(): useDownloadXLSXRes {
  let rawData: Blob;
  async function getXLSX(rows: SelectedQuotaItem[], dateStr: string[]) {
    const response = (await getQuotaData({
      startDate: dateStr[0],
      endDate: dateStr[1],
      exportPara: quotaDataExportTypeEnum.XLSX,
      rows,
      exportConfig: JSON.stringify({ ID: 'ID', NAME: 'NAME' }),
    })) as unknown;
    const { data } = response as AxiosResponse;
    rawData = data;
    return rawData;
  }
  async function downloadXLSX() {
    downloadByData(rawData, 'Data.xls');
  }

  function getExcelData(rawFile: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target && e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          // console.log(workbook);
          /* DO SOMETHING WITH workbook HERE */
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const header: string[] = getHeaderRow(worksheet);
          const tableData = XLSX.utils
            .sheet_to_json(worksheet, {
              header,
              raw: true,
            })
            .slice(2) as object[];
          resolve({
            header,
            tableData,
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(rawFile);
    });
  }
  function getHeaderRow(sheet: XLSX.WorkSheet) {
    if (!sheet || !sheet['!ref']) return [];
    const headers: string[] = [];
    // A1:c100=>{s:{c:0, r:0}, e:{c:2, r:99}}
    const range = XLSX.utils.decode_range(sheet['!ref']);
    // 从第二行开始
    const R = range.s.r + 1;
    for (let C = range.s.c; C <= range.e.c; ++C) {
      /* walk every column in the range */
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
      /* find the cell in the first row */
      let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }
  return { getXLSX, downloadXLSX, getExcelData };
}
