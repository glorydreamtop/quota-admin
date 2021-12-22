import dayjs from 'dayjs';
import type {
  BarSeriesOption,
  DatasetComponentOption,
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  LineSeriesOption,
  RadarComponentOption,
  ScatterSeriesOption,
  SeriesOption,
  TitleComponentOption,
  ToolboxComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { cloneDeep, max, maxBy, min, minBy, remove, round, pick } from 'lodash-es';
import {
  useAddGraphicElement,
  useHighestQuotaData,
  useLastestQuotaData,
  useMultiPie,
  useRecentLegend,
  useSortMonth,
  useNormalized,
  useSortYear,
  useColor,
  useScientificNotation,
  selectSeriesType,
} from './helper';
import {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  pieChartConfigType,
  quantileRadarChartConfigType,
  radarChartConfigType,
  seasonalChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { getQuotaData, quotaDataExportTypeEnum, quotaDataPastUnitTypeEnum } from '/@/api/quota';
import { getQuotaDataParams, getQuotaDataResult } from '/@/api/quota/model';
import { structuralOffsetUnitEnum } from '/@/enums/chartEnum';
import { SourceTypeEnum } from '/@/enums/quotaEnum';
import { useI18n } from '/@/hooks/web/useI18n';
import { daysAgo, formatToDate } from '/@/utils/dateUtil';
import { SelectedQuotaItem } from '/@/views/quota/quotaView/components/hooks';

const { t } = useI18n();
function titleConfig(chartConfig: chartConfigType): TitleComponentOption {
  return {
    text: chartConfig.title,
    left: 'center',
    triggerEvent: true,
  };
}

const toolboxConfig: ToolboxComponentOption = {
  // feature: {
  //   saveAsImage: {
  //     show: true,
  //     type: 'jpg',
  //   },
  //   dataZoom: {
  //     show: true,
  //   },
  // },
  // right: '5%',
};

const gridConfig: GridComponentOption = {
  width: 'auto',
};
// 季节性序列
export async function useSeasonalChart(
  chartConfig: seasonalChartConfigType,
): Promise<EChartsOption> {
  const fetchParams: getQuotaDataParams = {
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
    ...pick(chartConfig.timeConfig, ['startDate', 'endDate']),
  };

  const quotaDataList = await getQuotaData(fetchParams);
  // 移除不展示的月份
  useSortMonth({ chartConfig, quotaDataList });
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [];
  const legend: LegendComponentOption = {
    data: [],
    top: 'bottom',
    icon: 'roundRect',
  };
  const quota = quotaDataList[0];
  const startMonth = chartConfig.timeConfig.startMonth!;
  const changeStart = startMonth > 1;
  quota.data.forEach((data) => {
    const time = data[0];
    const y = dayjs(time).year();
    const m = dayjs(time).month();
    const v = round(data[1], chartConfig.valueFormatter.afterDot);
    let year: number, name: string;
    // 如果变更了起始月份
    if (changeStart) {
      if (m < startMonth - 1) {
        year = 2020;
        name = `${y - 1}-${y}`;
      } else {
        year = 2019;
        name = `${y}-${y + 1}`;
      }
    } else {
      name = `${y}`;
      year = 2020;
    }
    const s = series.find((ser) => ser.name === name);
    if (s) {
      (s.data as [number, number][]).push([dayjs(time).year(year).hour(0).unix() * 1000, v]);
    } else {
      legend.data?.push(name);
      series.push({
        name: name,
        symbol: 'none',
        type: 'line',
        connectNulls: false,
        // ...selectSeriesType(quotaDataList, color, seriesSetting),
        triggerLineEvent: true,
        data: [[dayjs(time).year(year).hour(0).unix() * 1000, v]],
      });
    }
  });
  const color = (await useColor({ chartConfig })).slice(0, series.length).reverse();
  for (let i = 0; i < 3; i++) {
    series[series.length - i - 1].lineStyle = {
      width: 3,
      shadowBlur: 4,
      shadowColor: color[series.length - i - 1],
      shadowOffsetX: 0,
      shadowOffsetY: 2,
    };
  }
  useSortYear({ chartConfig, series, legend });

  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: '{MM}/{dd}',
      },
      triggerEvent: true,
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const _y = useScientificNotation(y);
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, _y);
      return base;
    }),
    legend,
    color: color,
    series,
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        label: {
          formatter: ({ value }) => {
            return formatToDate(value, 'MM/DD');
          },
        },
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  useHighestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}
// 普通数据序列
export async function useNormalChart(chartConfig: normalChartConfigType): Promise<EChartsOption> {
  const fetchParams: getQuotaDataParams = {
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
    ...pick(chartConfig.timeConfig, ['startDate', 'endDate', 'pastValue', 'pastUnit']),
  };

  const quotaDataList = await getQuotaData(fetchParams);
  useSortMonth({ chartConfig, quotaDataList });
  useNormalized({ chartConfig, quotaDataList });
  const legend: LegendComponentOption = {
    data: [],
    top: 'bottom',
    icon: 'roundRect',
  };
  type NormalChartSeriesOption = LineSeriesOption | BarSeriesOption | ScatterSeriesOption;
  const series: NormalChartSeriesOption[] = [];

  const color = await useColor({ chartConfig });
  quotaDataList.forEach((quota) => {
    legend.data!.push(quota.name);
    const seriesSetting = chartConfig.seriesSetting.find((ser) => ser.name === quota.name);
    quota.data.forEach((item) => (item[1] = round(item[1], chartConfig.valueFormatter.afterDot)));
    series.push({
      name: quota.name,
      ...selectSeriesType(quotaDataList, color, seriesSetting),
      data: quota.data,
    });
  });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'time',
      triggerEvent: true,
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const _y = useScientificNotation(y);
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, _y);
      return base;
    }),
    color,
    legend,
    series,
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'axis',
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  useHighestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}
// 柱状图最近N期序列
export async function useBarChart(chartConfig: barChartConfigType) {
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
    pastUnit: quotaDataPastUnitTypeEnum.last,
    pastValue: chartConfig.timeConfig.pastValue,
  };

  const quotaDataList = await getQuotaData(fetchParams);
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [];
  const dataset: DatasetComponentOption = {
    source: [],
  };

  let maxLength = 0;
  for (let index = 0; index < quotaDataList.length; index++) {
    maxLength = max([quotaDataList[index].data.length, maxLength])!;
  }
  const firstLine = ['qoutaName'];
  for (let index = 0; index < maxLength; index++) {
    series.push({
      type: 'bar',
      seriesLayoutBy: 'column',
    });
    firstLine.push(useRecentLegend(maxLength, index));
  }
  dataset.source = [firstLine];
  quotaDataList.forEach((quota) => {
    const source = [
      quota.name,
      ...quota.data.map((item) => round(item[1], chartConfig.valueFormatter.afterDot)),
    ];
    (dataset.source as any[]).push(source);
  });
  const color = await useColor({ chartConfig });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      triggerEvent: true,
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const _y = useScientificNotation(y);
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, _y);
      return base;
    }),
    dataset,
    color,
    series,
    legend: {
      top: 'bottom',
      icon: 'roundRect',
    },
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  useHighestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}

// 雷达图图最近N期序列
export async function useRadarChart(chartConfig: radarChartConfigType) {
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
    pastUnit: quotaDataPastUnitTypeEnum.last,
    pastValue: chartConfig.timeConfig.pastValue,
  };

  const quotaDataList = await getQuotaData(fetchParams);
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [
    {
      type: 'radar',
      data: [],
    },
  ];
  for (let index = 0; index < chartConfig.timeConfig.pastValue!; index++) {
    (series[0].data as any[]).push({
      value: [] as number[],
      name: useRecentLegend(chartConfig.timeConfig.pastValue!, index),
    });
  }
  const radar: RadarComponentOption = {
    indicator: [],
    axisTick: {
      show: true,
    },
    axisLabel: {
      show: true,
      formatter: function (value) {
        return round(value, chartConfig.valueFormatter.afterDot).toString();
      },
    },
  };
  // 创建雷达指示器，并使各个方向的最大值是数据最大值的1.02倍，最小值是数据最小值的0.95倍
  for (let index = 0; index < quotaDataList.length; index++) {
    const quota = quotaDataList[index];
    radar.indicator!.push({
      text: quota.name,
      max: (maxBy(quota.data, (d) => d[1]) ?? [0, 0])[1] * 1.02,
      min: (minBy(quota.data, (d) => d[1]) ?? [0, 0])[1] * 0.95,
    });
    for (let index = 0; index < quota.data.length; index++) {
      const data = quota.data[index];
      (series[0].data as any[])[index].value.push(data[1]);
    }
  }
  const color = await useColor({ chartConfig });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    radar,
    series,
    color,
    legend: {
      top: 'bottom',
      icon: 'roundRect',
    },
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}

// 曲线结构序列
export async function useStructuralChart(chartConfig: structuralChartConfigType) {
  const structuralOffsetArr = chartConfig.structuralOffset.split(',').map((item) => parseInt(item));
  const quotaDataList: getQuotaDataResult[] = [];
  if (chartConfig.structuralOffsetUnit === structuralOffsetUnitEnum.natureDay) {
    for (let index = 0; index < structuralOffsetArr.length; index++) {
      const offset = structuralOffsetArr[index];
      const fetchParams: getQuotaDataParams = {
        startDate: chartConfig.timeConfig.startDate,
        endDate: daysAgo(offset, chartConfig.timeConfig.endDate),
        exportPara: quotaDataExportTypeEnum.JSON,
        rows: chartConfig.quotaList!,
        pastUnit: quotaDataPastUnitTypeEnum.last,
        pastValue: 1,
      };
      const singleQuotaDataList = await getQuotaData(fetchParams);
      singleQuotaDataList.forEach((quota) => {
        // @ts-ignore
        quota.data[0][0] = `-${offset}D`;
      });
      if (quotaDataList.length === 0) {
        quotaDataList.push(...singleQuotaDataList);
      } else {
        quotaDataList.forEach((quota, index) => {
          quota.data.push(singleQuotaDataList[index].data[0]);
        });
      }
    }
  } else {
    const maxOffset = max(structuralOffsetArr)!;
    const fetchParams: getQuotaDataParams = {
      startDate: chartConfig.timeConfig.startDate,
      endDate: chartConfig.timeConfig.endDate,
      exportPara: quotaDataExportTypeEnum.JSON,
      rows: chartConfig.quotaList!,
      pastUnit: quotaDataPastUnitTypeEnum.last,
      pastValue: maxOffset + 1,
    };
    const res = await getQuotaData(fetchParams);
    res.forEach((quota) => {
      remove(quota.data, (data, index) => {
        const idx = quota.data.length - index - 1;
        // @ts-ignore
        data[0] = `-${idx}D`;
        return !structuralOffsetArr.includes(idx);
      });
    });
    quotaDataList.push(...res);
  }
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [];
  const dataset: DatasetComponentOption = {
    source: [],
  };
  const firstLine = ['qoutaName'];
  for (let index = 0; index < structuralOffsetArr.length; index++) {
    series.push({
      type: 'line',
      seriesLayoutBy: 'column',
    });
    firstLine.push(`-${structuralOffsetArr[index]}D`);
  }
  dataset.source = [firstLine];
  quotaDataList.forEach((quota) => {
    const source = [
      quota.name,
      ...quota.data.map((item) => round(item[1], chartConfig.valueFormatter.afterDot)),
    ];
    (dataset.source as any[]).push(source);
  });
  const color = await useColor({ chartConfig });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      triggerEvent: true,
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const _y = useScientificNotation(y);
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, _y);
      return base;
    }),
    dataset,
    color,
    series,
    legend: {
      top: 'bottom',
      icon: 'roundRect',
    },
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  useHighestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}

// 饼图最近N期序列
export async function usePieChart(chartConfig: pieChartConfigType) {
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
    pastUnit: quotaDataPastUnitTypeEnum.last,
    pastValue: chartConfig.timeConfig.pastValue,
  };

  const quotaDataList = await getQuotaData(fetchParams);
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [];
  const dataset: DatasetComponentOption = {
    source: [],
  };

  let maxLength = 0;
  for (let index = 0; index < quotaDataList.length; index++) {
    maxLength = max([quotaDataList[index].data.length, maxLength])!;
  }
  const firstLine = ['qoutaName'];
  for (let index = 0; index < maxLength; index++) {
    series.push({
      type: 'pie',
      radius: `${min([90 / maxLength, 60])}%`,
      center: [`${(100 / (maxLength + 1)) * (index + 1)}%`, '50%'],
      encode: {
        itemName: 'qoutaName',
        value: useRecentLegend(maxLength, index),
      },
      seriesLayoutBy: 'column',
    });
    firstLine.push(useRecentLegend(maxLength, index));
  }
  dataset.source = [firstLine];
  quotaDataList.forEach((quota) => {
    const source = [
      quota.name,
      ...quota.data.map((item) => round(item[1], chartConfig.valueFormatter.afterDot)),
    ];
    (dataset.source as any[]).push(source);
  });
  const color = await useColor({ chartConfig });
  const options: EChartsOption = {
    title: useMultiPie({ chartConfig }).title,
    dataset,
    color,
    series,
    legend: {
      top: 'bottom',
      icon: 'roundRect',
    },
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  useHighestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}

// 分位数雷达图图最近N期序列
export async function useQuantileRadarChart(chartConfig: quantileRadarChartConfigType) {
  const quotaList: SelectedQuotaItem[] = [];
  const quantileOffset = chartConfig.quantileOffset.split(',');
  for (let index = 0; index < quantileOffset.length; index++) {
    const offset = quantileOffset[index];
    chartConfig.quotaList!.forEach((quota) => {
      const formulaQuota = cloneDeep(quota);
      formulaQuota.sourceType = SourceTypeEnum.formula;
      formulaQuota.sourceCode = `pct(idx(${quota.id}),${parseInt(offset) * 250})`;
      Reflect.deleteProperty(formulaQuota, 'id');
      quotaList.push(formulaQuota);
    });
  }
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: quotaList,
    lastFlag: true,
  };

  const quotaDataList = await getQuotaData(fetchParams);
  quotaDataList.forEach((quota) => {
    quota.data.forEach((item) => round(item[1], chartConfig.valueFormatter.afterDot));
  });
  useNormalized({ chartConfig, quotaDataList });
  const series: SeriesOption[] = [
    {
      type: 'radar',
      data: [],
    },
  ];
  for (let index = 0; index < quantileOffset.length; index++) {
    (series[0].data as any[]).push({
      value: [] as number[],
      name: `${quantileOffset[index]}${t('quotaView.chart.quantile')}`,
    });
  }
  const radar: RadarComponentOption = {
    indicator: [],
    axisTick: {
      show: true,
    },
    axisLabel: {
      show: true,
      formatter: function (value) {
        return round(value, chartConfig.valueFormatter.afterDot).toString();
      },
    },
  };
  // 创建雷达指示器，并使各个方向的最大值是数据最大值的1.02倍，最小值是数据最小值的0.95倍
  const len = chartConfig.quotaList!.length;
  const maxVal: number[] = new Array(len).fill(-1);
  const minVal: number[] = new Array(len).fill(Infinity);
  const arr = series[0].data as any[];
  for (let index = 0; index < quotaDataList.length; index++) {
    const quota = quotaDataList[index];
    const data = quota.data[0];
    data[1] = round(data[1], chartConfig.valueFormatter.afterDot);
    const idx = index % len;
    maxVal[idx] = max([(data ?? [0, 0])[1] * 1.02, maxVal[idx]])!;
    minVal[idx] = min([(data ?? [0, 0])[1] * 0.95, minVal[idx]])!;

    for (let i = 0; arr.length; i++) {
      if (arr[i].value.length < len) {
        arr[i].value.push(data[1]);
        break;
      }
    }
  }
  for (let index = 0; index < len; index++) {
    radar.indicator!.push({
      text: chartConfig.quotaList![index].name,
      max: maxVal[index],
      min: minVal[index],
    });
  }
  const color = await useColor({ chartConfig });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    radar,
    color,
    series,
    legend: {
      top: 'bottom',
      icon: 'roundRect',
    },
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    grid: gridConfig,
  };
  useAddGraphicElement({ options });
  // 最新值模块
  useLastestQuotaData({ chartConfig, options, quotaDataList });
  return options;
}
