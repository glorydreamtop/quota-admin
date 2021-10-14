import { getQuotaData } from '/@/api/quota';
import { getQuotaDataParams, getQuotaDataResult } from '/@/api/quota/model';
import { Popover, Input } from 'ant-design-vue';
import { h, ref, render } from 'vue';
import { chartConfigType, normalChartConfigType } from '/#/chart';
import { EChartsOption, GraphicComponentOption, SeriesOption } from 'echarts';
import { last, maxBy, nth, round } from 'lodash-es';
import { chartTypeEnum } from '/@/enums/chartEnum';
import { daysAgo, formatToDate } from '/@/utils/dateUtil';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import YAxisEdit from './src/YAxisEditor.vue';

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
  const left = lastGraphicGroup ? lastGraphicGroup.left + lastGraphicGroup.shape.width + 10 : 40;
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
                chartConfig.valueFormatter.afterDot
              ),
            });
            break;
          }
        }
      });
    } else {
      function getDate(str: number | string) {
        if (chartConfig.type === chartTypeEnum.structural) {
          str = str === 'Today' ? 0 : parseInt(str);
          return daysAgo(str, chartConfig.timeConfig.endDate);
        } else {
          return str;
        }
      }
      quotaDataList.forEach((quotaData) => {
        const l = last(quotaData.data)!;
        console.log(l[0]);

        lastestData.push({
          name: quotaData.name,
          date: formatToDate(getDate(l[0]), 'MM-DD'),
          value: l[1],
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
    createRichText(lastestData, options, t('page.quotaView.advance.rectSetting.lastest'));
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
    createRichText(highestData, options, t('page.quotaView.advance.rectSetting.highest'));
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
