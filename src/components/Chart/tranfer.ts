import dayjs from 'dayjs';
import type {
  DatasetComponentOption,
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  RadarComponentOption,
  SeriesOption,
  TitleComponentOption,
  ToolboxComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { max, maxBy, min, minBy, omit, remove, round } from 'lodash-es';
import {
  useAddGraphicElement,
  useHighestQuotaData,
  useLastestQuotaData,
  useMultiPie,
  useRecentLegend,
  useSortMonth,
  useNormalized,
} from './helper';
import {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  pieChartConfigType,
  radarChartConfigType,
  seasonalChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { getQuotaData, quotaDataExportTypeEnum, quotaDataPastUnitTypeEnum } from '/@/api/quota';
import { getQuotaDataParams, getQuotaDataResult } from '/@/api/quota/model';
import { echartSeriesTypeEnum, structuralOffsetUnitEnum } from '/@/enums/chartEnum';
import { daysAgo, formatToDate } from '/@/utils/dateUtil';

function titleConfig(chartConfig: chartConfigType): TitleComponentOption {
  return {
    text: chartConfig.title,
    left: 'center',
    triggerEvent: true,
  };
}

const toolboxConfig: ToolboxComponentOption = {
  feature: {
    saveAsImage: {
      show: true,
      type: 'jpg',
    },
    dataZoom: {
      show: true,
    },
  },
  right: '5%',
};

const gridConfig: GridComponentOption = {
  width: 'auto',
};
// 季节性序列
export async function useSeasonalChart(
  chartConfig: seasonalChartConfigType
): Promise<EChartsOption> {
  const fetchParams: getQuotaDataParams = omit(
    {
      exportPara: quotaDataExportTypeEnum.JSON,
      rows: chartConfig.quotaList!,
      ...chartConfig.timeConfig,
    },
    ['type', 'timeRule']
  );

  const quotaDataList = await getQuotaData(fetchParams);
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
    // 如果变更了起始月份
    if (changeStart) {
      const year = m < startMonth ? 2019 : 2020;
      const name = `${y - 1}-${y}`;
      const s = series.find((ser) => ser.name === name);
      if (s) {
        (s.data as [number, number][]).push([dayjs(time).year(year).hour(0).unix() * 1000, v]);
      } else {
        legend.data?.push(name);
        series.push({
          name: name,
          symbol: 'none',
          type: 'line',
          data: [[dayjs(time).year(year).hour(0).unix() * 1000, v]],
        });
      }
    } else {
      const name = `${y}`;
      const s = series.find((ser) => ser.name === name);
      if (s) {
        (s.data as [number, number][]).push([dayjs(time).year(2020).hour(0).unix() * 1000, v]);
      } else {
        legend.data?.push(name);
        series.push({
          name: name,
          symbol: 'none',
          type: 'line',
          data: [[dayjs(time).year(2020).hour(0).unix() * 1000, v]],
        });
      }
    }
  });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: '{MM}/{dd}',
      },
    },
    yAxis: [
      {
        type: 'value',
        scale: true,
        triggerEvent: true,
      },
    ],
    legend,
    series,
    toolbox: toolboxConfig,
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        label: {
          formatter: ({ value }) => {
            return formatToDate(value, 'YYYY/MM/DD');
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
  const fetchParams: getQuotaDataParams = omit(
    {
      exportPara: quotaDataExportTypeEnum.JSON,
      rows: chartConfig.quotaList!,
      ...chartConfig.timeConfig,
    },
    ['type', 'timeRule']
  );

  const quotaDataList = await getQuotaData(fetchParams);
  useSortMonth({ chartConfig, quotaDataList });
  useNormalized({ chartConfig, quotaDataList });
  const legend: LegendComponentOption = {
    data: [],
    top: 'bottom',
    icon: 'roundRect',
  };
  const series: SeriesOption[] = [];
  // 选择series类型
  function selectSeriesType(type: echartSeriesTypeEnum): SeriesOption {
    const typeMap = {
      [echartSeriesTypeEnum.line]: {
        type: 'line',
        symbol: 'none',
      },
      [echartSeriesTypeEnum.smoothLine]: {
        type: 'line',
        smooth: true,
        symbol: 'none',
      },
      [echartSeriesTypeEnum.area]: {
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
      },
      [echartSeriesTypeEnum.scatter]: {
        type: 'scatter',
      },
      [echartSeriesTypeEnum.bar]: {
        type: 'bar',
      },
    };
    return typeMap[type] as SeriesOption;
  }
  quotaDataList.forEach((quota) => {
    const quotaConfig = chartConfig.quotaList!.find((q) => q.id === quota.id)!;
    legend.data!.push(quota.name);
    quota.data.forEach((item) => (item[1] = round(item[1], chartConfig.valueFormatter.afterDot)));
    series.push({
      name: quota.name,
      ...selectSeriesType(quotaConfig.setting.type),

      data: quota.data,
      yAxisIndex: quotaConfig.setting.yAxisIndex,
    });
  });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'time',
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, y);
      return base;
    }),
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
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, y);
      return base;
    }),
    dataset,
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
        return value > 1 ? round(value, chartConfig.valueFormatter.afterDot) : value;
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
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    radar,
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
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: chartConfig.yAxis?.map((y) => {
      const base: YAXisComponentOption = {
        type: 'value',
        scale: true,
        show: true,
        triggerEvent: true,
      };
      Object.assign(base, y);
      return base;
    }),
    dataset,
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
  const options: EChartsOption = {
    title: useMultiPie({ chartConfig }).title,
    dataset,
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
