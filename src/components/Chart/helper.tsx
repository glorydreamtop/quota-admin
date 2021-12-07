import { getQuotaData } from '/@/api/quota';
import { getQuotaDataParams, getQuotaDataResult } from '/@/api/quota/model';
import { Popover, Input } from 'ant-design-vue';
import { h, ref, render } from 'vue';
import { chartConfigType, normalChartConfigType, seriesSettingType } from '/#/chart';
import {
  EChartsOption,
  GraphicComponentOption,
  LegendComponentOption,
  SeriesOption,
  YAXisComponentOption,
} from 'echarts';
import { last, maxBy, nth, remove, round, cloneDeep, has } from 'lodash-es';
import { chartTypeEnum, echartLineTypeEnum, echartSeriesTypeEnum } from '/@/enums/chartEnum';
import { daysAgo, formatToDate } from '/@/utils/dateUtil';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import YAxisEdit from './src/YAxisEditor.vue';
import XAxisEdit from './src/XAxisEditor.vue';
import SeriesEdit from './src/SeriesEditor.vue';
import { getColorScheme } from '/@/api/color';
import { QuotaItem } from '/#/quota';

const { t } = useI18n();
export async function fetchQuotaData(params: getQuotaDataParams) {
  const res = await getQuotaData(params);
  return res;
}

interface chartTitlePopoverParams {
  chartConfig: chartConfigType;
  onOk: (str: string) => void;
}

const MOUNTNODE = 'mount-node';

export function createMountNode(e) {
  const { clientX, clientY } = e.event?.event as MouseEvent;
  const dom = document.createElement('span');
  dom.className = MOUNTNODE;
  Object.assign(dom.style, {
    position: 'fixed',
    top: `${clientY}px`,
    left: `${clientX}px`,
    zIndex: '19',
  });
  document.body.appendChild(dom);
  return dom;
}

// 支持修改标题
export function useChartTitlePopover({ onOk, chartConfig }: chartTitlePopoverParams) {
  const title = ref('');
  return function (dom: HTMLElement) {
    title.value = chartConfig.title;
    function input() {
      // @ts-ignore
      return h(Input, {
        style: {
          width: '200px',
        },
        defaultValue: title,
        onChange: function (e) {
          title.value = e.target.value;
        },
      });
    }
    const pop = h(Popover, {
      content: input(),
      defaultVisible: true,
      trigger: 'click',
      destroyTooltipOnHide: true,
      getPopupContainer: (_) => dom,
      onVisibleChange: (visible: boolean) => {
        if (!visible) {
          onOk(title.value);
          if (dom.className === MOUNTNODE) {
            dom.remove();
          }
        }
      },
    });
    render(pop, dom);
  };
}

interface yAxixIndexEditParams {
  chartConfig: normalChartConfigType;
  onOk: (v: normalChartConfigType) => void;
}
// 支持Y轴编辑
export function useYAxisIndexEdit({ chartConfig, onOk }: yAxixIndexEditParams) {
  return function (dom: HTMLElement, { yAxisIndex }: any) {
    const idx = yAxisIndex;
    function YAxisEditComponent() {
      const editPopover = h(YAxisEdit, {
        chartConfig,
        idx,
        onVisibleChange: (v: boolean) => {
          // 关闭时销毁挂载点
          if (!v && dom.className === MOUNTNODE) {
            dom.remove();
          }
        },
        onUpdate: (v: any) => {
          onOk(v);
        },
        getPopupContainer: () => dom,
      });
      return editPopover;
    }
    const component = YAxisEditComponent();
    render(component, dom);
    // 外部触发气泡显示
    component.component!.exposed!.setVisible(true);
  };
}

// 支持X轴编辑
export function useXAxisIndexEdit({ chartConfig, onOk }: yAxixIndexEditParams) {
  return function (dom: HTMLElement, { xAxisIndex }: any) {
    const idx = xAxisIndex;
    function XAxisEditComponent() {
      const editPopover = h(XAxisEdit, {
        chartConfig,
        idx,
        onVisibleChange: (v: boolean) => {
          // 关闭时销毁挂载点
          if (!v && dom.className === MOUNTNODE) {
            dom.remove();
          }
        },
        onUpdate: (v: any) => {
          onOk(v);
        },
        getPopupContainer: () => dom,
      });
      return editPopover;
    }
    const component = XAxisEditComponent();
    render(component, dom);
    // 外部触发气泡显示
    component.component!.exposed!.setVisible(true);
  };
}

function createRichText(data: lastestDataType[], options: EChartsOption, title: string) {
  const text =
    `${title}\n` +
    data
      .map((item) => {
        const DIFF = item.diff
          ? item.diff > 0
            ? `{more|${item.diff}}`
            : `{less|${item.diff}}`
          : '';
        const VALUE = `{val|${item.value}}`;
        return `${item.name} [${item.date}] ${VALUE} ${DIFF}`;
      })
      .join('\n');
  const container = document.createElement('div');
  Object.assign(container.style, {
    fontSize: '13px',
    fontFamily: 'Microsoft YaHei',
    lineHeight: '18px',
    position: 'absolute',
  });
  container.innerText = text.replaceAll(/\{|}|less|more|val|\|/g, '');
  document.getElementById('app')!.append(container);
  const width = container.clientWidth;
  const height = container.clientHeight;
  container.remove();
  // 找到图中存在的其他模块，方便给本模块设置初始定位
  //@ts-ignore
  const lastGraphicGroup = last((options.graphic as GraphicComponentOption).elements);
  //@ts-ignore
  const left = lastGraphicGroup ? lastGraphicGroup.left + lastGraphicGroup.shape.width + 10 : 80;
  const lastestConfig = {
    type: 'group',
    left,
    top: '10%',
    draggable: true,
    shape: {
      width: width + 10,
      height: height + 10,
    },
    children: [
      {
        type: 'rect',
        z: 100,
        left: 0,
        top: 0,
        shape: {
          x: 0,
          y: 0,
          width: width + 10,
          height: height + 10,
        },
        style: {
          fill: '#ffffff66',
          stroke: '#555',
          borderColor: '#ffffff99',
          borderWidth: 1,
          shadowBlur: 8,
          lineWidth: 0,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowColor: 'rgba(0,0,0,0.2)',
        },
      },
      {
        type: 'text',
        z: 100,
        left: 10,
        top: 10,
        style: {
          fill: '#333',
          text,
          font: '12px Microsoft YaHei',
          rich: {
            val: {
              fill: '#000',
              fontWeight: 'bold',
              fontSize: '12px',
              height: 20,
            },
            more: {
              fill: '#DC143C',
              height: 20,
            },
            less: {
              fill: '#008000',
              height: 20,
            },
          },
        },
      },
    ],
  };
  // @ts-ignore
  options.graphic.elements.push(lastestConfig);
}
interface lastestQuotaDataParams extends baseHelperParams {
  options: EChartsOption;
}

interface lastestDataType {
  name: string;
  date: string;
  diff?: number;
  value: number;
}

// 最新值模块
export async function useLastestQuotaData({
  chartConfig,
  quotaDataList,
  options,
}: lastestQuotaDataParams) {
  // 单指标的图形
  const singleQuotaChartTypes = [chartTypeEnum.seasonal, chartTypeEnum.seasonalLunar];
  if (chartConfig.showLastest) {
    const lastestData: lastestDataType[] = [];
    if (singleQuotaChartTypes.includes(chartConfig.type)) {
      // 找到最新日期
      const lastDate = dayjs(last(quotaDataList[0].data)![0]).year(2020).unix() * 1000;
      const series = options.series as SeriesOption[];
      series.forEach((item, idx) => {
        const data = item.data as [number, number][];
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          // 查找每年的这一天，某年当天无数据则沿用前一天，或直到这年数据的最后一个
          if (e[0] <= lastDate && lastDate < (data[index + 1] || data[index])[0]) {
            lastestData.push({
              name: item.name as string,
              date: formatToDate(e[0], 'MM-DD'),
              value: e[1],
              // 计算差值，减去前一期，有可能是去年的最后一期并保留N位小数
              diff: round(
                index > 0
                  ? e[1] - data[index - 1][1]
                  : e[1] - last(series[idx - 1].data as [number, number][])![1],
                chartConfig.valueFormatter.afterDot,
              ),
            });
            break;
          }
        }
      });
    } else {
      function getDate(str: number | string) {
        if (chartConfig.type === chartTypeEnum.structural) {
          str = parseInt(str);
          return daysAgo(str, chartConfig.timeConfig.endDate);
        } else {
          return str;
        }
      }
      quotaDataList.forEach((quotaData) => {
        const l = last(quotaData.data)!;
        lastestData.push({
          name: quotaData.name,
          date: formatToDate(getDate(l[0]), 'MM-DD'),
          value: round(l[1], chartConfig.valueFormatter.afterDot),
          // 如果数据量不足无法计算差值则不显示
          diff: (function () {
            if (quotaData.data.length > 1) {
              return round(l[1] - nth(quotaData.data, -2)![1], chartConfig.valueFormatter.afterDot);
            } else {
              return NaN;
            }
          })(),
        });
      });
    }
    // 开始创建echart富文本
    createRichText(lastestData, options, t('quotaView.advance.rectSetting.lastest'));
  }
}
// 最高值模块
export async function useHighestQuotaData({
  chartConfig,
  quotaDataList,
  options,
}: lastestQuotaDataParams) {
  // 单指标的图形
  const singleQuotaChartTypes = [chartTypeEnum.seasonal, chartTypeEnum.seasonalLunar];
  if (chartConfig.showHighest) {
    const highestData: lastestDataType[] = [];
    if (singleQuotaChartTypes.includes(chartConfig.type)) {
      const series = options.series as SeriesOption[];
      series.forEach((item) => {
        const data = item.data as [number, number][];
        const m = maxBy(data, (_) => _[1])!;
        highestData.push({
          name: item.name as string,
          date: formatToDate(m[0], 'MM-DD'),
          value: m[1],
        });
      });
    } else {
      quotaDataList.forEach((quotaData) => {
        const m = maxBy(quotaData.data, (_) => _[1])!;
        highestData.push({
          name: quotaData.name,
          date: formatToDate(m[0], 'MM-DD'),
          value: m[1],
        });
      });
    }
    // 开始创建echart富文本
    createRichText(highestData, options, t('quotaView.advance.rectSetting.highest'));
  }
}

interface addGraphicElementParams {
  options: EChartsOption;
}
// 创建模块容器
export function useAddGraphicElement({ options }: addGraphicElementParams) {
  const graphic: GraphicComponentOption = {
    elements: [],
  };
  Object.assign(options, {
    graphic,
  });
}

interface baseHelperParams {
  quotaDataList: getQuotaDataResult[];
  chartConfig: chartConfigType;
}
// 月份过滤
export function useSortMonth({ chartConfig, quotaDataList }: baseHelperParams) {
  const sortMonth = chartConfig.timeConfig.sortMonth;
  if (!sortMonth || sortMonth.length === 0) {
    return;
  }
  quotaDataList.forEach((quota) => {
    quota.data = quota.data.filter((data) => {
      return !sortMonth.includes(dayjs(data[0]).month() + 1);
    });
  });
}

interface useSortYearParams {
  series: SeriesOption[];
  chartConfig: chartConfigType;
  legend: LegendComponentOption;
}
// 年份过滤
export function useSortYear({ chartConfig, series, legend }: useSortYearParams) {
  const sortYear = chartConfig.timeConfig.sortYear;
  if (!sortYear || sortYear.length === 0) {
    return;
  }
  remove(series, (s) => sortYear.includes(s.name as string));
  remove(legend.data!, (l) => sortYear.includes(l as string));
}

// 多个饼图子标题生成
export function useMultiPie({ chartConfig }: Omit<baseHelperParams, 'quotaDataList'>) {
  const title: any[] = [
    {
      text: chartConfig.title,
      left: 'center',
      triggerEvent: true,
    },
  ];
  const maxLen = chartConfig.timeConfig.pastValue!;
  for (let index = 0; index < maxLen; index++) {
    const subtitle = {
      subtext: useRecentLegend(maxLen, index),
      left: `${(100 / (maxLen + 1)) * (index + 1)}%`,
      top: '80%',
      textAlign: 'center',
    };
    title.push(subtitle);
  }
  return { title };
}

// 最近N期图例文本生成
export function useRecentLegend(len: number, index: number, inverse = true) {
  if (inverse) {
    const idx = len - index - 1;
    if (idx === 0) {
      return t('common.last');
    }
    return t('quotaView.chart.inserveIndex') + idx + t('quotaView.chart.unit');
  } else {
    return t('quotaView.chart.inserveIndex') + `${index + 1}` + t('quotaView.chart.unit');
  }
}

// 支持折线图series右键菜单
export function useLineChartContextMenu({ onOk, chartConfig }: chartTitlePopoverParams) {
  return function (dom: HTMLElement, e: any, options: EChartsOption) {
    console.log(e);
    // const idx = xAxisIndex;
    function SeriesEditComponent() {
      const editPopover = h(SeriesEdit, {
        chartConfig,
        seriesInfo: e,
        options,
        onVisibleChange: (v: boolean) => {
          // 关闭时销毁挂载点
          if (!v && dom.className === MOUNTNODE) {
            dom.remove();
          }
        },
        onUpdate: (v: any) => {
          onOk(v);
        },
        getPopupContainer: () => dom,
      });
      return editPopover;
    }
    const component = SeriesEditComponent();
    render(component, dom);
    // 外部触发气泡显示
    component.component!.exposed!.setVisible(true);
  };
}
// if (dom.className === MOUNTNODE) {
//   dom.remove();
// }

export function useNormalized({ chartConfig, quotaDataList }: baseHelperParams) {
  if (!chartConfig.valueFormatter.normalized) return;
  const afterDot = chartConfig.valueFormatter.afterDot;
  quotaDataList.forEach((quota) => {
    const base = quota.data[0][1];
    quota.data.forEach((data) => {
      data[1] = round(data[1] / base, afterDot);
    });
  });
}

// 合成颜色方案
export async function useColor({ chartConfig }: { chartConfig: chartConfigType }) {
  const id = chartConfig.colorSchemeId;
  const selfColors = chartConfig.selfColorScheme.split(',');
  if (id) {
    const { colors } = await getColorScheme({ id: id });
    // merge一下自有颜色和方案颜色，得到最终颜色
    const finalColor = colors.split(',').map((v, idx) => {
      const bool = selfColors[idx] === undefined || !selfColors[idx].includes('#');
      return bool ? v : selfColors[idx];
    });
    return finalColor;
  } else {
    return selfColors;
  }
}

// Y轴科学计数法
export function useScientificNotation(yAxis: YAXisComponentOption) {
  const y = cloneDeep(yAxis);
  const formatter = y.axisLabel!.formatter as string;
  if (/pow/i.test(formatter)) {
    const s = parseInt(formatter.match(/\d+/i)![0]);
    y.axisLabel!.formatter = (v) => {
      return v / Math.pow(10, s);
    };
    y.name = `10e${s}`;
    y.axisLine!.symbol = ['none', 'arrow'];
  }
  return y;
}

// 输出series信息
export function setSeriesInfo(
  info: seriesSettingType,
  type: chartTypeEnum,
  seriesInfo: any,
  options: EChartsOption,
) {
  const seriesIndex = seriesInfo.seriesIndex;
  const series = options.series![seriesIndex];
  switch (type) {
    case chartTypeEnum.normal:
      info.name = series.name;
      if (series.type === 'line') {
        if (has(series, 'areaStyle')) {
          info.seriesType = echartSeriesTypeEnum.area;
        } else if (series.smooth === true) {
          info.seriesType = echartSeriesTypeEnum.smoothLine;
        } else if (series.smooth === false) {
          info.seriesType = echartSeriesTypeEnum.line;
        }
        info.size = series.lineStyle.width;
        info.lineType = series.lineStyle.type;
        info.shadow = series.lineStyle.shadowColor !== undefined;
      } else if (series.type === 'bar') {
        info.seriesType = echartSeriesTypeEnum.bar;
      }
      info.yAxisIndex = series.yAxisIndex + 1;
      info.xAxisIndex = series.xAxisIndex + 1;
      break;
    case chartTypeEnum.seasonal:
      info.name = series.name;
      if (series.type === 'line') {
        if (has(series, 'areaStyle')) {
          info.seriesType = echartSeriesTypeEnum.area;
        } else if (series.smooth === true) {
          info.seriesType = echartSeriesTypeEnum.smoothLine;
        } else if (series.smooth === false) {
          info.seriesType = echartSeriesTypeEnum.line;
        }
        info.size = series.lineStyle.width;
        info.lineType = series.lineStyle.type;
        info.shadow = series.lineStyle.shadowColor !== undefined;
      } else if (series.type === 'bar') {
        info.seriesType = echartSeriesTypeEnum.bar;
      }
      info.yAxisIndex = (series.yAxisIndex ?? 0) + 1;
      info.xAxisIndex = (series.xAxisIndex ?? 0) + 1;
    case chartTypeEnum.bar:
      if (series.type === 'line') {
        if (has(series, 'areaStyle')) {
          info.seriesType = echartSeriesTypeEnum.area;
        } else if (series.smooth === true) {
          info.seriesType = echartSeriesTypeEnum.smoothLine;
        } else if (series.smooth === false) {
          info.seriesType = echartSeriesTypeEnum.line;
        }
        info.size = series.lineStyle.width;
        info.lineType = series.lineStyle.type;
        info.shadow = series.lineStyle.shadowColor !== undefined;
      } else if (series.type === 'bar') {
        info.name = seriesInfo.seriesName;
        info.seriesType = echartSeriesTypeEnum.bar;
        info.shadow = series.lineStyle.shadowColor !== undefined;
      }
      info.yAxisIndex = (series.yAxisIndex ?? 0) + 1;
      info.xAxisIndex = (series.xAxisIndex ?? 0) + 1;
    default:
      break;
  }
}

// 选择series类型
export function selectSeriesType(
  quotaDataList: getQuotaDataResult[],
  color:string[],
  seriesSetting?: seriesSettingType,
): NormalChartSeriesOption {
  function getLineStyle() {
    const lineStyle = {
      width: seriesSetting?.size ?? 2,
      type: seriesSetting?.lineType ?? echartLineTypeEnum.solid,
    };
    if (seriesSetting?.shadow) {
      Object.assign(lineStyle, {
        shadowBlur: 2,
        shadowColor: color[quotaDataList.findIndex((q) => q.name === seriesSetting?.name)],
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      });
    }
    return lineStyle;
  }
  function getAxisIndex() {
    return {
      xAxisIndex: seriesSetting?.xAxisIndex ?? 0,
      yAxisIndex: seriesSetting?.yAxisIndex ?? 0,
    };
  }
  const typeMap = {
    [echartSeriesTypeEnum.line]: {
      type: 'line',
      symbol: 'none',
      lineStyle: getLineStyle(),
      ...getAxisIndex(),
      triggerLineEvent: true,
    },
    [echartSeriesTypeEnum.smoothLine]: {
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: getLineStyle(),
      ...getAxisIndex(),
      triggerLineEvent: true,
    },
    [echartSeriesTypeEnum.area]: {
      type: 'line',
      smooth: false,
      symbol: 'none',
      areaStyle: {},
      lineStyle: getLineStyle(),
      ...getAxisIndex(),
      triggerLineEvent: true,
    },
    [echartSeriesTypeEnum.scatter]: {
      type: 'scatter',
    },
    [echartSeriesTypeEnum.bar]: {
      type: 'bar',
      ...getAxisIndex(),
    },
  };
  return typeMap[seriesSetting?.seriesType ?? echartSeriesTypeEnum.line] as NormalChartSeriesOption;
}
