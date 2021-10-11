// import { chartConfigType } from "/#/chart";

// interface chartTemplateModel{
//   config:chartConfigType;
//   category_id:number;
// }

// // 图表颜色列表
// const chart_colors_list = [
//   {
//     name: '默认配色',
//     colors: [
//       '#85c1e9',
//       '#b2b4c3',
//       '#1f74ad',
//       '#ee8f71',
//       '#a5251c',
//       '#f15c80',
//       '#e4d354',
//       '#8085e8',
//       '#8d4653',
//       '#91e8e1',
//     ],
//   },
//   {
//     name: 'Hichart配色',
//     colors: [
//       '#7cb5ec',
//       '#90ed7d',
//       '#f7a35c',
//       '#8085e9',
//       '#f15c80',
//       '#e4d354',
//       '#8085e8',
//       '#8d4653',
//       '#91e8e1',
//     ],
//   },
//   {
//     name: 'MX Gray', // 明 曦灰
//     colors: ['#bdbdbd', '#747474', '#bd9c5e', '#d2826d', '#731714'],
//   },
//   {
//     name: 'MX Blue', // 明 曦蓝
//     colors: ['#bdbdbd', '#75b9e6', '#003661', '#eb815f'],
//   },
//   {
//     name: '碧海蓝天', // http://www.sohu.com/a/148389742_417040
//     colors: ['#0f6fc6', '#009dd9', '#0bd0d9', '#eb815f', '#7cca62', '#f49100'],
//   },
//   {
//     name: '数据蓝灰', // http://www.sohu.com/a/148389742_417040
//     colors: ['#2a3d52', '#c4af99', '#5b6c83', '#d7ccb8', '#38526e', '#bfbfbf'],
//   },
//   {
//     name: '安全色', // http://www.sohu.com/a/148389742_417040
//     colors: ['#e6836d', '#2a3d52', '#bfbfbf', '#a5c3c3', '#dcd0a8', '#a1797f', '#0b81c9'],
//   },
//   {
//     name: '热季风', // http://www.sohu.com/a/148389742_417040
//     colors: ['#a53005', '#e19825', '#d55816', '#b18c7d', '#7f5f52', '#b27d49'],
//   },
//   {
//     name: '清淡色',
//     colors: [
//       '#bfbfbf',
//       '#dcd0a8',
//       '#91e8e1',
//       '#e4d354',
//       '#91e8e1',
//       '#85c1e9',
//       '#8085e8',
//       '#a1797f',
//     ],
//   },
// ];

// // 图表类型对应
// const chart_types_map = {
//   series: 'normal', //数据序列
//   season: 'seasonal', //季节性序列
//   curve: 'structural', //曲线结构
//   polar_quantile: 'quantile', //雷达图(分位数)
//   polar: 'radar', //雷达图
//   pie: 'pie', // 饼图
//   column: 'bar', //柱状图
//   boxplot: 'boxplot', // 箱线图
//   datatable: '', // '数据表格'
// };

// // 线形类型对应
// const line_types_map = {
//   line: 'line',
//   spline: 'smoothLine',
//   area: 'area',
//   column: 'bar',
//   bar: 'bar',
//   pie: 'line',
//   treemap: 'line',
//   scatter: 'scatter',
// };

// const formatter_map = {
//   normal: '{yyyy}/{MM}/{dd}',
//   seasonal: '{MM}/{dd}',
//   structural: '{value}',
// };

// export function transferOptions(options) {
//   const o:chartTemplateModel = {
//     category_id: options['category_id'],
//     config: {
//       name: options['template_name'],
//       type: chart_types_map[options['option_template_type']],
//       title: options['chart_title'],
//       quotaList: options['rows'],
//       normalized: options['option_normalize'],
//       colors: chart_colors_list[options['option_chart_color']]['colors'].join(','),

//       multiY: false,
//       yAxis: {},
//       sortMonth: { ifSortMonth: false, list: {} },
//       structXLabel: { ifStruct: false, list: {} },
//       quantile: { ifQuantile: false, list: {} },
//       lastMulti: { multi: false, number: 1 },
//       textRect: { showHighest: false, showLastest: false },

//       timeType: 'default',
//       startDate: '2015-01-01',
//       seriesCfgMap: {},
//     },
//   };

//   if (formatter_map[o.config.type]) {
//     o.config.xLabel = { formatter: formatter_map[o.config.type] };
//   }

//   if (o.config.type == 'seasonal') {
//     // 季节性
//     o.config.colors = '#FF0000,#000000,#008080,' + o['config']['colors']; //颜色指定
//     let b = options['season_begin_month'] ? +options['season_begin_month'] : 1;
//     let l =
//       options['season_months'] && options['season_months'].length > 0
//         ? options['season_months']
//         : new Array(12).map((_, i) => i + 1);
//     o.config.sortMonth = {
//       ifSortMonth: true,
//       list: l.slice(l.indexOf(b), l.length).concat(l.slice(0, l.indexOf(b))),
//     };
//   } else if (o.config.type == 'structural') {
//     // 结构曲线
//     o.config.colors = ['#5B9BD5', '#FFC000', '#008080', '#000000', '#FF0000'].join(','); //颜色指定
//     o.config.structXLabel = {
//       ifStruct: true,
//       list: [
//         { name: '-30D', value: 30 },
//         { name: '-15D', value: 15 },
//         { name: '-7D', value: 7 },
//         { name: '-1D', value: 1 },
//         { name: 'Today', value: 0 },
//       ],
//     };
//   } else if (o.config.type == 'quantile') {
//     // 分位数
//     let l =
//       options['quantile_years'] && options['quantile_years'].length > 0
//         ? options['quantile_years']
//         : [1, 3, 5, 10];
//     o.config.quantile = {
//       ifQuantile: true,
//       list: l.map((v, i) => {
//         return { name: v + '年', value: v };
//       }),
//     };
//   } else if (['radar', 'pie', 'bar'].includes(o.config.type)) {
//     o.config.lastMulti.multi = true;
//   }

//   let yaxis_list = [];
//   for (let i = 0; i < o.config.rows.length; i++) {
//     let row = o.config.rows[i];
//     if(Reflect.has(row,'formula')){
//       Reflect.deleteProperty(row,'formula')
//     }
//     //Y轴处理
//     if (row['yaxis'] == 1 || row['yaxis'] == 2) {
//       yaxis_list =
//         yaxis_list.length > 0
//           ? yaxis_list
//           : [{ position: 'left', max: null, min: null, offset: 0, inverse: false }];
//       yaxis_list.push({
//         position: 'right',
//         min: !row['ymin'] ? null : +row['ymin'],
//         max: !row['ymax'] ? null : +row['ymax'],
//         offset: 0,
//         inverse: row['yaxis'] == 2,
//       });
//     }
//     //序列配置
//     o.config.seriesCfgMap[row['name']] = {
//       title: row['name'],
//       type: line_types_map[row['chart_type']],
//       lineWidth: 2,
//       yAxisIndex: row['yaxis'] == 1 || row['yaxis'] == 2 ? yaxis_list.length - 1 : 0,
//     };
//     row['seriesCfg'] = o.config.seriesCfgMap[row['name']];
//     //字段名称处理
//     row['sourceType'] = row['source_type'];
//     row['sourceCode'] = row['source_code'];
//     if (row.id && row.id > 100000000) {
//       delete row.id;
//     }
//   }

//   //Y轴设置
//   if (yaxis_list.length > 0) {
//     o.config.multiY = true;
//     o.config.yAxis = yaxis_list;
//   }
//   return o.config;
// }

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
