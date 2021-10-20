import { YAXisComponentOption } from 'echarts';
import { quotaDataPastUnitTypeEnum } from '/@/api/quota';
import {
  chartTypeEnum,
  echartSeriesTypeEnum,
  structuralOffsetUnitEnum,
  timeConfigEnum,
} from '/@/enums/chartEnum';
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
  pastUnit?: quotaDataPastUnitTypeEnum;
  pastValue?: number;
  /**
   * 不要的月份
   */
  sortMonth?: number[];
  startMonth?: number;
}

// export interface baseQuotaSettingType {}
export interface baseChartConfigType {
  // 图表标题
  title: string;
  // 图表名字
  name?: string;
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
    normalized: boolean;
  };

  quotaList: Nullable<SelectedQuotaItem[]>;
}

export interface reactSettingType {
  showLastest: boolean;
  showHighest: boolean;
}

export interface seasonalChartConfigType extends reactSettingType, baseChartConfigType {
  yAxis: YAXisComponentOption[];
}

export interface normalChartConfigType extends reactSettingType, baseChartConfigType {
  [x: string]: any;
  yAxis: YAXisComponentOption[];
}

export interface barChartConfigType extends reactSettingType, baseChartConfigType {
  yAxis: YAXisComponentOption[];
}

export interface radarChartConfigType extends reactSettingType, baseChartConfigType {}

export interface quantileRadarChartConfigType extends reactSettingType, baseChartConfigType {
  quantileOffset: string;
}

export interface structuralChartConfigType extends reactSettingType, baseChartConfigType {
  yAxis: YAXisComponentOption[];
  structuralOffset: string;
  structuralOffsetUnit: structuralOffsetUnitEnum;
}

export interface pieChartConfigType extends reactSettingType, baseChartConfigType {}

export type chartConfigType =
  | seasonalChartConfigType
  | normalChartConfigType
  | barChartConfigType
  | radarChartConfigType
  | structuralChartConfigType
  | pieChartConfigType;
export interface normalQuotaSettingType {
  yAxisIndex: number;
  lineWidth: number;
  type: echartSeriesTypeEnum;
}
