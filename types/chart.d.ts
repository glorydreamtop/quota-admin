import { QuotaItem } from './quota';
import { chartTypeEnum, timeConfigEnum } from '/@/enums/chartEnum';

export type typeOptionsType = seasonalChartOptions | normalChartOptions;

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

export interface baseQuotaSettingType {
  yAxisIndex: number;
}

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
  // 图表参数
  typeOptions: typeOptionsType;
}

export interface seasonalChartOptions {
  quota: Nullable<QuotaItem>;
  showLastest: boolean;
}

export interface normalChartOptions {
  quotaList: Nullable<QuotaItem[]>;
  showLastest: boolean;
}
