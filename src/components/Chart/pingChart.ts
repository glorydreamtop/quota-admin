import { YAXisComponentOption } from 'echarts';
import { difference } from 'lodash-es';
import {
  barChartConfigType,
  chartConfigType,
  normalChartConfigType,
  seasonalChartConfigType,
  structuralChartConfigType,
} from '/#/chart';
import { quotaDataPastUnitTypeEnum } from '/@/api/quota';
import { structuralOffsetUnitEnum, timeConfigEnum } from '/@/enums/chartEnum';
import { formatToDate } from '/@/utils/dateUtil';

interface chartTemplateModel {
  config: chartConfigType;
  category_id: number;
}

// 图表颜色列表
const chart_colors_list = [
  {
    name: '默认配色',
    colors: [
      '#85c1e9',
      '#b2b4c3',
      '#1f74ad',
      '#ee8f71',
      '#a5251c',
      '#f15c80',
      '#e4d354',
      '#8085e8',
      '#8d4653',
      '#91e8e1',
    ],
  },
  {
    name: 'Hichart配色',
    colors: [
      '#7cb5ec',
      '#90ed7d',
      '#f7a35c',
      '#8085e9',
      '#f15c80',
      '#e4d354',
      '#8085e8',
      '#8d4653',
      '#91e8e1',
    ],
  },
  {
    name: 'MX Gray', // 明 曦灰
    colors: ['#bdbdbd', '#747474', '#bd9c5e', '#d2826d', '#731714'],
  },
  {
    name: 'MX Blue', // 明 曦蓝
    colors: ['#bdbdbd', '#75b9e6', '#003661', '#eb815f'],
  },
  {
    name: '碧海蓝天', // http://www.sohu.com/a/148389742_417040
    colors: ['#0f6fc6', '#009dd9', '#0bd0d9', '#eb815f', '#7cca62', '#f49100'],
  },
  {
    name: '数据蓝灰', // http://www.sohu.com/a/148389742_417040
    colors: ['#2a3d52', '#c4af99', '#5b6c83', '#d7ccb8', '#38526e', '#bfbfbf'],
  },
  {
    name: '安全色', // http://www.sohu.com/a/148389742_417040
    colors: ['#e6836d', '#2a3d52', '#bfbfbf', '#a5c3c3', '#dcd0a8', '#a1797f', '#0b81c9'],
  },
  {
    name: '热季风', // http://www.sohu.com/a/148389742_417040
    colors: ['#a53005', '#e19825', '#d55816', '#b18c7d', '#7f5f52', '#b27d49'],
  },
  {
    name: '清淡色',
    colors: [
      '#bfbfbf',
      '#dcd0a8',
      '#91e8e1',
      '#e4d354',
      '#91e8e1',
      '#85c1e9',
      '#8085e8',
      '#a1797f',
    ],
  },
];

// 图表类型对应
const chart_types_map = {
  series: 'normal', //数据序列
  season: 'seasonal', //季节性序列
  curve: 'structural', //曲线结构
  polar_quantile: 'quantile', //雷达图(分位数)
  polar: 'radar', //雷达图
  pie: 'pie', // 饼图
  column: 'bar', //柱状图
  boxplot: 'boxplot', // 箱线图
  datatable: '', // '数据表格'
};

// 线形类型对应
const line_types_map = {
  line: 'line',
  spline: 'smoothLine',
  area: 'area',
  column: 'bar',
  bar: 'bar',
  pie: 'line',
  treemap: 'line',
  scatter: 'scatter',
};

export function pingChart(options) {
  const rows = options['rows'];
  const o: chartTemplateModel = {
    category_id: options['category_id'],
    config: {
      name: options['template_name'],
      type: chart_types_map[options['option_template_type']],
      title: options['chart_title'],
      quotaList: [],
      colorSchemeId: 0,
      colors: chart_colors_list[options['option_chart_color']]['colors'].join(','),
      valueFormatter: {
        normalized: options['option_normalize'],
        afterDot: 2,
        scientificNotation: false,
        sortMonth: [],
      },
      showLastest: true,
      showHighest: false,
      timeConfig: {
        startDate: '2015-01-01',
        endDate: formatToDate(),
        type: timeConfigEnum.default,
      },
      yAxis: [],
    } as chartConfigType,
  };

  if (o.config.type == 'seasonal') {
    // 季节性
    const b = options['season_begin_month'] ? +options['season_begin_month'] : 1;
    o.config.timeConfig.startMonth = b;
    const all = new Array(12).map((_, i) => i + 1);
    const l =
      options['season_months'] && options['season_months'].length > 0
        ? options['season_months']
        : new Array(12).map((_, i) => i + 1);
    o.config.timeConfig.sortMonth = difference(all, l);
  } else if (o.config.type == 'structural') {
    // 结构曲线
    (o.config as structuralChartConfigType).structuralOffset = '30,15,7,1,0';
    (o.config as structuralChartConfigType).structuralOffsetUnit =
      structuralOffsetUnitEnum.natureDay;
  } else if (o.config.type == 'quantileRadar') {
    // 分位数
    // let l =
    //   options['quantile_years'] && options['quantile_years'].length > 0
    //     ? options['quantile_years']
    //     : [1, 3, 5, 10];
    // o.config.quantile = {
    //   ifQuantile: true,
    //   list: l.map((v, i) => {
    //     return { name: v + '年', value: v };
    //   }),
    // };
  } else if (['radar', 'bar'].includes(o.config.type)) {
    o.config.timeConfig.pastValue = 3;
    o.config.timeConfig.pastUnit = quotaDataPastUnitTypeEnum.last;
  } else if (o.config.type === 'pie') {
    o.config.timeConfig.pastValue = 1;
    o.config.timeConfig.pastUnit = quotaDataPastUnitTypeEnum.last;
  }

  let yaxis_list: YAXisComponentOption[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (Reflect.has(row, 'formula')) {
      Reflect.deleteProperty(row, 'formula');
    }
    //Y轴处理
    if (row['yaxis'] == 1 || row['yaxis'] == 2) {
      yaxis_list =
        yaxis_list.length > 0
          ? yaxis_list
          : [{ position: 'left', max: undefined, min: undefined, offset: 0, inverse: false }];
      yaxis_list.push({
        position: 'right',
        min: !row['ymin'] ? undefined : +row['ymin'],
        max: !row['ymax'] ? undefined : +row['ymax'],
        offset: 0,
        inverse: row['yaxis'] == 2,
      });
    }
    o.config.quotaList?.push({
      name: row['name'],
      sourceCode: row['source_code'],
      sourceType: row['source_type'],
      dateLast: row['date_first'],
      frequency: row['frequency'],
      unit: row['unit'],
      shortName: row['shortName'],
      selected: true,
      id: row.id,
      setting: {
        type: line_types_map[row['chart_type']],
        yAxisIndex: row['yaxis'] == 1 || row['yaxis'] == 2 ? yaxis_list.length - 1 : 0,
        lineWidth: 2,
      },
    });
    if (row.id && row.id > 100000000) {
      Reflect.deleteProperty(row, 'id');
    }
  }

  //Y轴设置
  if (yaxis_list.length > 0) {
    (o.config as normalChartConfigType | seasonalChartConfigType | barChartConfigType).yAxis =
      yaxis_list;
  }
  return o.config;
}

// let tmpl_opt5 = {
//   season_begin_month: '1',
//   option_template_type: 'polar',
//   option_period_end_date: '',
//   option_normalize: false,
//   option_latest_label: '0',
//   option_chart_color: '0',
//   option_pct_width: '',
//   quantile_years: [1, 3, 5, 10],
//   chart_title: 'SHFE：螺纹钢05合约：收盘价（日）',
//   option_period_date: '2015-01-01',
//   season_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   option_period_unit: 'w',
//   rows: [
//     {
//       date_last: '2021-01-22 00:00:00',
//       code: 'RB_JY',
//       description: '期货',
//       source_type: 'mysteel',
//       yaxis: 0,
//       parentId: 39095,
//       frequency: '日',
//       unit: '元/吨',
//       chart_type: 'line',
//       name: 'SHFE：螺纹钢05合约：收盘价（日）',
//       date_first: '2009-05-18 00:00:00',
//       ids: true,
//       id: 103946,
//       class: 'DictIndex',
//       source_code: 'FU_0000813462',
//     },
//     {
//       date_last: '2021-01-22 00:00:00',
//       code: 'RB_JY',
//       description: '期货',
//       source_type: 'mysteel',
//       yaxis: 0,
//       parentId: 39095,
//       frequency: '日',
//       unit: '元/吨',
//       chart_type: 'line',
//       name: 'SHFE：螺纹钢01合约：收盘价（日）',
//       date_first: '2009-03-27 00:00:00',
//       ids: true,
//       id: 103945,
//       class: 'DictIndex',
//       source_code: 'FU_0000813434',
//     },
//     {
//       date_last: '2021-01-22 00:00:00',
//       code: 'RB_JY',
//       description: '期货',
//       source_type: 'mysteel',
//       yaxis: 0,
//       parentId: 39095,
//       frequency: '日',
//       unit: '元/吨',
//       chart_type: 'line',
//       name: 'SHFE：螺纹钢10合约：收盘价（日）',
//       date_first: '2009-03-27 00:00:00',
//       ids: true,
//       id: 103947,
//       class: 'DictIndex',
//       source_code: 'FU_0000813497',
//     },
//   ],
//   template_name: 'SHFE：螺纹钢05合约：收盘价（日）',
//   category_id: '38488',
//   option_period_no: '1',
//   option_chart_period: '',
// };
