import dayjs from 'dayjs';
import type {
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  SeriesOption,
  TitleComponentOption,
  ToolboxComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { round } from 'lodash-es';
import { useAddGraphicElement, useHighestQuotaData, useLastestQuotaData } from './helper';
import { chartConfigType, normalChartConfigType, seasonalChartConfigType } from '/#/chart';
import { getQuotaData, quotaDataExportTypeEnum } from '/@/api/quota';
import { getQuotaDataParams } from '/@/api/quota/model';
import { formatToDate } from '/@/utils/dateUtil';

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

export async function useSeasonalChart(
  chartConfig: seasonalChartConfigType
): Promise<EChartsOption> {
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
  };

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

export async function useNormalChart(chartConfig: normalChartConfigType): Promise<EChartsOption> {
  const fetchParams: getQuotaDataParams = {
    startDate: chartConfig.timeConfig.startDate,
    endDate: chartConfig.timeConfig.endDate,
    exportPara: quotaDataExportTypeEnum.JSON,
    rows: chartConfig.quotaList!,
  };

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
