import type { EChartsOption } from 'echarts';
import { baseChartConfigType } from '/#/chart';

export function useSeasonalChart(chartConfig: baseChartConfigType): EChartsOption {
  console.log(chartConfig);

  const options: EChartsOption = {
    xAxis: {
      type: 'time',
    },
  };
  return options;
}
