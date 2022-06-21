import { dateUtil, formatToDate } from '/@/utils/dateUtil';
import { cloneDeep } from 'lodash';
const defaultChartCfg = {
  startDate: '',
  endDate: '',
  recent: undefined,
  timeType: 'default',
  type: 'normal',
  title: '',
  ymin: null,
  ymax: null,
  rows: [],
  colors: '',
  colorsId: 0,
  xLabel: null,
  normalized: false,
  seriesCfgMap: {},
  textRect: { showLastest: false, showHighest: false },
  multiY: false,
  yAxis: undefined,
  lastMulti: {
    multi: false,
    number: 1,
  },
  decimal: 2,
  showXSplitLine: true,
  fixData: [],
};
const cfgTemp = { ...cloneDeep(defaultChartCfg), http: false, colorsId: 22, fixData: [] };

// 生成船期进出口图表配置
export function generateVesselImportConfig(res, params) {
  const configParams = cloneDeep(cfgTemp);
  configParams.title = params.chart_title == '' ? '船期数据展示' : params.chart_title;
  configParams.startDate = params.departure_date_from;
  configParams.endDate = params.departure_date_to;
  configParams.type = params.chart_type;
  configParams.seriesCfgMap = {
    船期数据: { title: '船期数据', type: 'line', lineWidth: 2, yAxisIndex: 0 },
  };
  if (params.group_frequency == 'month') {
    let resData = res.map((item) => {
      return {
        dt: dateUtil(`${item.year}-${item.month}-01`).valueOf(),
        val: item.standard_volume,
      };
    });
    resData = completeXAxis(resData, params);
    configParams.fixData = [
      {
        data: resData.map((item) => [item.dt, item.val]),
        id: 1,
        name: '船期数据',
      },
    ];
  } else if (params.group_frequency == 'week') {
    let resData = res.map((item) => {
      return {
        dt: dateUtil().year(item.year).week(item.week).valueOf(),
        val: item.standard_volume,
      };
    });
    resData = completeXAxis(resData, params);
    configParams.fixData = [
      {
        data: resData.map((item) => [item.dt, item.val]),
        id: 1,
        name: '船期数据',
      },
    ];
  } else if (params.group_frequency == 'year') {
    configParams.seriesCfgMap = {
      Total: { title: 'Total', type: 'line', lineWidth: 2, yAxisIndex: 0 },
    };
    configParams.fixData = [
      {
        data: res
          .map((item) => [
            item.year == dateUtil().year() ? formatToDate() : `${item.year}-12-31`,
            item.standard_volume,
          ])
          .reverse(),
        id: 1,
        name: 'Total',
      },
    ];
    configParams.type = 'bar';
  }
  configParams.fixData[0].data.sort((a, b) => a[0] - b[0]);
  return configParams;
}
// 生成船期报表图表配置
export function generateVesselReportConfig(res, params) {
  const configParams = cloneDeep(cfgTemp);
  configParams.title = params.chart_title == '' ? '船期数据展示' : params.chart_title;
  if (params.group_date_type == 'arrival_date') {
    configParams.startDate = params.arrival_date_from;
    configParams.endDate = params.arrival_date_to;
  } else if (params.group_date_type == 'departure_date') {
    configParams.startDate = params.departure_date_from;
    configParams.endDate = params.departure_date_to;
  }
  configParams.type = params.chart_type;
  configParams.seriesCfgMap = {
    船期数据: { title: '船期数据', type: 'line', lineWidth: 2, yAxisIndex: 0 },
  };
  if (params.group_frequency == 'month') {
    let resData = res.map((item) => {
      return {
        dt: dateUtil(`${item.year}-${item.month}-01`).valueOf(),
        val: getVesselValue(item, params.query_type),
      };
    });
    resData = completeXAxis(resData, params);
    configParams.fixData = [
      {
        data: resData.map((item) => [item.dt, item.val]),
        id: 1,
        name: '船期数据',
      },
    ];
    configParams.fixData[0].data.sort((a, b) => a[0] - b[0]);
  } else if (params.group_frequency == 'week') {
    let resData = res.map((item) => {
      return {
        dt: dateUtil().year(item.year).week(item.week).valueOf(),
        val: getVesselValue(item, params.query_type),
      };
    });
    resData = completeXAxis(resData, params);
    configParams.fixData = [
      {
        data: resData.map((item) => [item.dt, item.val]),
        id: 1,
        name: '船期数据',
      },
    ];
    configParams.fixData[0].data.sort((a, b) => a[0] - b[0]);
  } else if (params.group_frequency == 'year') {
    configParams.type = 'bar';
    if (params.group_load == '' && params.group_discharge == '') {
      configParams.seriesCfgMap = {
        Total: { title: 'Total', type: 'line', lineWidth: 2, yAxisIndex: 0 },
      };
      configParams.fixData = [
        {
          data: res
            .map((item) => [
              item.year == dateUtil().year() ? formatToDate() : `${item.year}-12-31`,
              getVesselValue(item, params.query_type),
            ])
            .reverse(),
          id: 1,
          name: 'Total',
        },
      ];
      configParams.fixData[0].data.sort((a, b) => a[0] - b[0]);
    } else {
      const curType = params.group_load == '' ? params.group_discharge : params.group_load;
      const dataObj = {};
      for (let i = 0; i < res.length; i++) {
        if (dataObj[res[i][curType]] == undefined) {
          dataObj[res[i][curType]] = [];
        }
        dataObj[res[i][curType]].push([
          res[i].year == dateUtil().year() ? formatToDate() : `${res[i].year}-12-31`,
          getVesselValue(res[i], params.query_type),
        ]);
      }
      configParams.seriesCfgMap = {};
      for (const key in dataObj) {
        configParams.seriesCfgMap[key] = { title: key, type: 'line', lineWidth: 2, yAxisIndex: 0 };
        configParams.fixData.push({ name: key, data: dataObj[key] });
      }
    }
  } else if (params.group_frequency == 'year%') {
    configParams.type = 'bar';
    configParams.yAxis = [
      {
        inverse: false,
        min: '0',
        offset: 0,
        max: '1',
        position: 'left',
        percent: true,
      },
    ];
    configParams.multiY = true;
    if (params.group_load == '' && params.group_discharge == '') {
      configParams.seriesCfgMap = {
        Total: { title: 'Total', type: 'line', lineWidth: 2, yAxisIndex: 0 },
      };
      configParams.fixData = [
        {
          data: res
            .map((item) => [
              item.year == dateUtil().year() ? formatToDate() : `${item.year}-12-31`,
              100,
            ])
            .reverse(),
          id: 1,
          name: 'Total',
        },
      ];
      configParams.fixData[0].data.sort((a, b) => a[0] - b[0]);
    } else {
      const curType = params.group_load == '' ? params.group_discharge : params.group_load;
      for (let i = 0; i < res.length; i++) {
        const curYear = res[i].year;
        const curVal = getVesselValue(res[i], params.query_type);
        let total = 0;
        for (let j = 0; j < res.length; j++) {
          if (res[j].year == curYear) {
            total = total + getVesselValue(res[j], params.query_type);
          }
        }
        const percent = (curVal / total).toFixed(2);
        res[i]['percent'] = percent;
      }
      const dataObj = {};
      for (let i = 0; i < res.length; i++) {
        if (dataObj[res[i][curType]] == undefined) {
          dataObj[res[i][curType]] = [];
        }
        dataObj[res[i][curType]].push([
          res[i].year == dateUtil().year() ? formatToDate() : `${res[i].year}-12-31`,
          res[i]['percent'],
        ]);
      }
      configParams.seriesCfgMap = {};
      for (const key in dataObj) {
        configParams.seriesCfgMap[key] = { title: key, type: 'line', lineWidth: 2, yAxisIndex: 0 };
        configParams.fixData.push({ name: key, data: dataObj[key] });
      }
    }
  }
  return configParams;
}
function getVesselValue(item, type) {
  if (type == 'basic') {
    return item.standard_volume;
  } else if (type == 'acc') {
    return item.cumulative_standard_volume;
  } else {
    return item.ratio;
  }
}
// 补全一月一号
export function completeXAxis(data, params) {
  if (data.length > 0) {
    if (dateUtil(data[0].dt).format('MM-DD') != '01-01' && params.chart_type == 'seasonal') {
      const year = dateUtil(data[0].dt).year();
      const timeVal = dateUtil(`${year}-01-01`).valueOf();
      data.unshift({ dt: timeVal, val: null });
      return data;
    } else {
      return data;
    }
  } else {
    return data;
  }
}
