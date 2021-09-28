import { YAXisComponentOption } from 'echarts';
import { chartTypeEnum, timeConfigEnum } from '/@/enums/chartEnum';
import { SelectedQuotaItem } from '/@/views/quota/quotaView/components/hooks';

export interface timeConfigType {
  startDate: string;
  endDate: string;
  type: timeConfigEnum;
  /**
   * 当type是recent时，需要一个规则来计算开始日期，
   * 数量|单位|周期或自然日，单位有days/weeks/months/years，周期cycle，自然日nature
   */
  timeRule?: string;
}

// export interface baseQuotaSettingType {}
export interface baseChartConfigType {
  // 图表标题
  title: string;
  // 配色方案Id
  colorSchemeId: number;
  // 自有配色方案
  selfColorScheme?: string;
  // 图表类型
  type: chartTypeEnum;
  // 时间相关配置
  timeConfig: timeConfigType;
  // 数据格式化方式
  valueFormatter: {
    afterDot: number;
    scientificNotation: boolean;
  };
}

export interface reactSettingType {
  showLastest: boolean;
  showHighest: boolean;
}

export interface seasonalChartConfigType extends reactSettingType, baseChartConfigType {
  quotaList: Nullable<SelectedQuotaItem[]>;
}

export interface normalChartConfigType extends reactSettingType, baseChartConfigType {
  [x: string]: any;
  quotaList: Nullable<SelectedQuotaItem[]>;
  yAxis: YAXisComponentOption[];
}

export type chartConfigType = seasonalChartConfigType | normalChartConfigType;
export interface normalQuotaSettingType {
  yAxisIndex: number;
  type: 'line' | 'bar';
}
