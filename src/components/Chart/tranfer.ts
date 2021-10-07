import dayjs from 'dayjs';
import type {
  DatasetComponentOption,
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  SeriesOption,
  TitleComponentOption,
  ToolboxComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { max, omit, round } from 'lodash-es';
import { useAddGraphicElement, useHighestQuotaData, useLastestQuotaData } from './helper';
import {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  seasonalChartConfigType,
} from '/#/chart';
import { getQuotaData, quotaDataExportTypeEnum, quotaDataPastUnitTypeEnum } from '/@/api/quota';
import { getQuotaDataParams } from '/@/api/quota/model';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDate } from '/@/utils/dateUtil';

const { t } = useI18n();
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
  const series: SeriesOption[] = [];
  const legend: LegendComponentOption = {
    data: [],
    top: 'bottom',
  };
  const quota = quotaDataList[0];
  const quotaConfig = chartConfig.quotaList!.find((q) => q.id === quota.id)!;
  quota.data.forEach((data) => {
    const time = data[0];
    const y = dayjs(time).year().toString();
    const v = round(data[1], chartConfig.valueFormatter.afterDot);
    if (legend.data?.includes(y)) {
      const s = series.find((series) => series.name === y)!;
      (s.data as [number, number][]).push([dayjs(time).year(2020).unix() * 1000, v]);
    } else {
      legend.data?.push(y);
      series.push({
        name: y,
        type: quotaConfig.setting.type,
        symbol: 'none',
        data: [],
      });
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
  const fetchParams: getQuotaDataParams = omit(
    {
      exportPara: quotaDataExportTypeEnum.JSON,
      rows: chartConfig.quotaList!,
      ...chartConfig.timeConfig,
    },
    ['type', 'timeRule']
  );

  const quotaDataList = await getQuotaData(fetchParams);
  const legend: LegendComponentOption = {
    data: [],
    top: 'bottom',
  };
  const series: SeriesOption[] = [];
  quotaDataList.forEach((quota) => {
    const quotaConfig = chartConfig.quotaList!.find((q) => q.id === quota.id)!;
    legend.data!.push(quota.name);
    quota.data.forEach((item) => (item[1] = round(item[1], chartConfig.valueFormatter.afterDot)));
    series.push({
      name: quota.name,
      type: quotaConfig.setting.type,
      symbol: 'none',
      data: quota.data,
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
    firstLine.push(t('page.chart.index') + (index + 1) + t('page.chart.unit'));
  }
  dataset.source = [firstLine];
  quotaDataList.forEach((quota) => {
    const source = [
      quota.name,
      ...quota.data.map((item) => round(item[1], chartConfig.valueFormatter.afterDot)),
    ];
    (dataset.source as any[]).push(source);
    series.push({
      type: 'bar',
      // seriesLayoutBy:'row',
    });
  });
  const options: EChartsOption = {
    title: titleConfig(chartConfig),
    xAxis: {
      type: 'category',
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
