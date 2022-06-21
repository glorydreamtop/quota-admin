<template>
  <div class="p-4 h-layout-full">
    <div class="h-full p-2 rounded-md shadow-md bg-white overflow-y-scroll" v-loading="loadingRef">
      <ARow class="w-full" :gutter="10">
        <ACol :span="4">
          <Select
            v-model:value="cTypeRef"
            :options="cTypeOptions"
            @change="cTypeChange"
            style="width: 100%"
          />
        </ACol>
        <ACol :span="4"
          ><DatePicker
            valueFormat="YYYY-MM-DD"
            v-model:value="tradeDateRef"
            @change="paramChange"
            :allowClear="false"
            :disabled-date="disabledDate"
            style="width: 100%"
        /></ACol>
        <ACol :span="4">
          <RadioGroup
            v-model:value="yearTypeRef"
            @change="chartTypeChange"
            button-style="solid"
            class="!ml-2 inline-block"
          >
            <RadioButton value="notYear">非年化</RadioButton>
            <RadioButton value="year">年化</RadioButton>
          </RadioGroup>
          <SettingOutlined
            class="cursor-pointer relative left-5 top-1"
            :style="{ fontSize: '24px', color: '#0d9488' }"
            @click="handleOpenParamModel"
          />
        </ACol>
        <ACol :offset="8" :span="4"
          ><a-button class="float-right" type="primary" @click="screenShot"
            >保存为图片</a-button
          ></ACol
        >
      </ARow>
      <div ref="imgContainer">
        <div class="flex" ref="el">
          <BasicTable @register="registerTable" class="w-0 flex-grow">
            <!-- <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex == 'comm'">
                <a class="text-primary" @click="handleOpenFutureModel(record.comm)">{{
                  record.comm
                }}</a>
              </template>
            </template> -->
            <template #comm="record">
              <a class="text-primary" @click="handleOpenFutureModel(record.comm)">{{
                record.comm
              }}</a>
            </template>
          </BasicTable>
        </div>
        <div class="flex flex-wrap">
          <div class="h-300px" :class="chartWidth" ref="chartRefE"></div>
          <div class="h-300px" :class="chartWidth" ref="chartRefF"></div>
        </div>
        <div class="flex flex-wrap">
          <div class="h-300px" :class="chartWidth" ref="chartRefG"></div>
          <div class="h-300px" :class="chartWidth" ref="chartRefH"></div>
        </div>
        <div class="flex flex-wrap">
          <div class="h-300px" :class="chartWidth" ref="chartRefA"></div>
          <div class="h-300px" :class="chartWidth" ref="chartRefB"></div>
        </div>
        <div class="flex flex-wrap">
          <div class="h-300px" :class="chartWidth" ref="chartRefC"></div>
          <div class="h-300px" :class="chartWidth" ref="chartRefD"></div>
        </div>
      </div>
    </div>
    <!-- 明细弹窗 -->
    <ModalFuture @register="registerModalFuture" />
    <!-- 设置弹窗 -->
    <ModalParam @register="registerModelParam" @on-param-change="paramChange" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, Ref, reactive, provide, watch, unref, nextTick } from 'vue';
  import { DatePicker, Row, Col, Select, Radio } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns } from './tableData';
  import { getCtypeOptions, getDtOptions, getCompareOptions } from '/@/api/future';
  import { useECharts } from '/@/hooks/web/useECharts';
  import ModalFuture from './components/ModalFuture.vue';
  import ModalParam from './components/ModalParam.vue';
  import { useModal } from '/@/components/Modal';
  import { formatToDate } from '/@/utils/dateUtil';
  import { cloneDeep } from 'lodash-es';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import { dom2imgFile, fileType } from '/@/utils/domUtils';
  import { downloadByData } from '/@/utils/file/download';
  export default defineComponent({
    name: 'CrossMonitor',
    components: {
      BasicTable,
      DatePicker,
      [Col.name]: Col,
      [Row.name]: Row,
      Select,
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
      ModalFuture,
      ModalParam,
      SettingOutlined,
    },
    setup() {
      const loadingRef = ref<boolean>(false);
      const chartWidth = ref<string>('w-1/2');
      const tradeDateRef = ref('');
      const validTradeDate: any = ref([]);
      const cTypeRef = ref('');
      const cTypeOptions = ref([]);
      const tableList = ref([]);
      const [registerTable, { redoHeight }] = useTable({
        dataSource: tableList,
        columns: getBasicColumns(),
        pagination: false,
        size: 'small',
        canResize: false,
        // showTableSetting: true,
        // tableSetting: {
        //   redo: false,
        //   size: false,
        //   setting: true,
        // },
      });
      const yearTypeRef = ref('notYear');
      //基差率同比分位数
      const chartRefA = ref<HTMLDivElement | null>(null);
      const ChartA = useECharts(chartRefA as Ref<HTMLDivElement>);
      //月差率同比分位数
      const chartRefB = ref<HTMLDivElement | null>(null);
      const ChartB = useECharts(chartRefB as Ref<HTMLDivElement>);
      //基差率环比分位数
      const chartRefC = ref<HTMLDivElement | null>(null);
      const ChartC = useECharts(chartRefC as Ref<HTMLDivElement>);
      //月差率环比分位数
      const chartRefD = ref<HTMLDivElement | null>(null);
      const ChartD = useECharts(chartRefD as Ref<HTMLDivElement>);
      //基差率日度变化
      const chartRefE = ref<HTMLDivElement | null>(null);
      const ChartE = useECharts(chartRefE as Ref<HTMLDivElement>);
      //月差率日度变化
      const chartRefF = ref<HTMLDivElement | null>(null);
      const ChartF = useECharts(chartRefF as Ref<HTMLDivElement>);
      //基差率周度变化
      const chartRefG = ref<HTMLDivElement | null>(null);
      const ChartG = useECharts(chartRefG as Ref<HTMLDivElement>);
      //月差率周度变化
      const chartRefH = ref<HTMLDivElement | null>(null);
      const ChartH = useECharts(chartRefH as Ref<HTMLDivElement>);
      let sourceData: any[] = [];
      paramInit();
      const disabledDate = (current) => {
        const date = current.format('YYYY-MM-DD');
        const index = validTradeDate.value.findIndex((value) => {
          return date == value;
        });
        return index == -1 ? true : false;
      };
      async function cTypeChange() {
        loadingRef.value = true;
        await validDateInit();
        await listInit();
        loadingRef.value = false;
      }
      async function paramChange() {
        loadingRef.value = true;
        await listInit();
        loadingRef.value = false;
      }
      async function paramInit() {
        loadingRef.value = true;
        let resCtype: string = await getCtypeOptions();
        const CtypeList = JSON.parse(resCtype);
        cTypeOptions.value = CtypeList.map((item) => {
          return {
            value: item.ctype,
            label: item.ctype,
          };
        });
        cTypeRef.value = CtypeList[1].ctype;
        await validDateInit();
        await listInit();
        loadingRef.value = false;
      }
      async function validDateInit() {
        let resDt: any = await getDtOptions({ ctype: cTypeRef.value });
        const resDate = JSON.parse(resDt.info);
        validTradeDate.value = resDate.map((item: any) => {
          return formatToDate(item.trade_dt);
        });
        if (tradeDateRef.value == '') {
          tradeDateRef.value = validTradeDate.value[validTradeDate.value.length - 1];
        }
      }
      async function listInit() {
        sourceData = await getCompareOptions({
          ctype: cTypeRef.value,
          dt: tradeDateRef.value,
          dt_type: crossMonitorParam.dt_type,
          mom_lag: crossMonitorParam.mom_lag,
          yoy_lag: crossMonitorParam.yoy_lag,
          yoy_window: crossMonitorParam.yoy_window,
        });
        tableList.value = JSON.parse(sourceData.table);
        chartWidth.value = tableList.value.length > 15 ? 'w-full' : 'w-1/2';
        await nextTick();
        initChart(sourceData);
      }
      function initChart(resData) {
        const curSVG =
          'path://m563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8L295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512L196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1l216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z';
        const chartBoxCofig = {
          title: {
            text: '',
            left: 'center',
            top: 10,
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
            },
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              splitLine: {
                show: false,
              },
            },
          ],
          yAxis: {
            type: 'value',
            splitArea: {
              show: true,
            },
            axisLabel: {
              formatter: (value) => {
                return `${value}%`;
              },
            },
          },
          color: ['#31868f', '#fd2621'],
          series: [
            {
              type: 'boxplot',
              data: [],
            },
            {
              type: 'scatter',
              symbol: curSVG,
              data: [],
              zlevel: 1,
            },
          ],
        };
        const chartBarCofig = {
          title: {
            text: '',
            left: 'center',
            top: 10,
          },
          legend: {
            top: 'bottom',
            data: ['较上期减', '较上期增', '当前值'],
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
            },
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              splitLine: {
                show: false,
              },
            },
          ],
          yAxis: {
            type: 'value',
            splitArea: {
              show: true,
            },
            axisLabel: {
              formatter: (value) => {
                return `${value}%`;
              },
            },
          },
          color: ['#8299b5', '#31868f', '#c0504d', '#fd2621'],
          series: [
            {
              name: '基差率',
              type: 'bar',
              stack: 'Ad',
              data: [],
            },
            {
              name: '较上期减',
              type: 'bar',
              stack: 'Ad',
              data: [],
            },
            {
              name: '较上期增',
              type: 'bar',
              stack: 'Ad',
              data: [],
            },
            {
              name: '当前值',
              type: 'scatter',
              symbol: curSVG,
              data: [],
              zlevel: 1,
            },
          ],
        };
        const chartYoyData = JSON.parse(resData['yoy']);
        const chartMomData = JSON.parse(resData['mom']);
        const chartDayChg = JSON.parse(resData['day_chg']);
        const chartWeekChg = JSON.parse(resData['week_chg']);
        /*********** 基差率同比分位数start *********/
        const configA = cloneDeep(chartBoxCofig);
        configA.title.text = `基差率同比分位数${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartYoyData.sort((a, b) => {
          return yearTypeRef.value == 'notYear' ? b.ba_r - a.ba_r : b.ba_ra - a.ba_ra;
        });
        chartYoyData.forEach((item) => {
          let boxplot = { name: item.comm, value: [] };
          let scatter = [];
          if (yearTypeRef.value == 'notYear') {
            boxplot.value = [
              item['ba_r_min'],
              item['ba_r_25%'],
              item['ba_r_50%'],
              item['ba_r_75%'],
              item['ba_r_max'],
            ];
            scatter = [item.comm, item.ba_r];
          } else {
            boxplot.value = [
              item['ba_ra_min'],
              item['ba_ra_25%'],
              item['ba_ra_50%'],
              item['ba_ra_75%'],
              item['ba_ra_max'],
            ];
            scatter = [item.comm, item.ba_ra];
          }
          configA.series[0].data.push(boxplot);
          configA.series[1].data.push(scatter);
          configA.xAxis[0].data.push(item.comm);
        });
        ChartA.setOptions(configA);
        /*********** 基差率同比分位数 end *********/

        /*********** 月差率同比分位数start *********/
        const configB = cloneDeep(chartBoxCofig);
        configB.title.text = `月差率同比分位数${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartYoyData.sort((a, b) => {
          return yearTypeRef.value == 'notYear' ? b.p12_r - a.p12_r : b.p12_ra - a.p12_ra;
        });
        chartYoyData.forEach((item) => {
          let boxplot = { name: item.comm, value: [] };
          let scatter = [];
          if (yearTypeRef.value == 'notYear') {
            boxplot.value = [
              item.p12_r_min,
              item['p12_r_25%'],
              item['p12_r_50%'],
              item['p12_r_75%'],
              item.p12_r_max,
            ];
            scatter = [item.comm, item.p12_r];
          } else {
            boxplot.value = [
              item.p12_ra_min,
              item['p12_ra_25%'],
              item['p12_ra_50%'],
              item['p12_ra_75%'],
              item.p12_ra_max,
            ];
            scatter = [item.comm, item.p12_ra];
          }
          configB.series[0].data.push(boxplot);
          configB.series[1].data.push(scatter);
          configB.xAxis[0].data.push(item.comm);
        });
        ChartB.setOptions(configB);
        /*********** 月差率同比分位数 end *********/

        /*********** 基差率环比分位数start *********/
        const configC = cloneDeep(chartBoxCofig);
        configC.title.text = `基差率环比分位数${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartMomData.sort((a, b) => {
          return yearTypeRef.value == 'notYear' ? b.ba_r - a.ba_r : b.ba_ra - a.ba_ra;
        });
        chartMomData.forEach((item) => {
          let boxplot = { name: item.comm, value: [] };
          let scatter = [];
          if (yearTypeRef.value == 'notYear') {
            boxplot.value = [
              item['ba_r_min'],
              item['ba_r_25%'],
              item['ba_r_50%'],
              item['ba_r_75%'],
              item['ba_r_max'],
            ];
            scatter = [item.comm, item.ba_r];
          } else {
            boxplot.value = [
              item['ba_ra_min'],
              item['ba_ra_25%'],
              item['ba_ra_50%'],
              item['ba_ra_75%'],
              item['ba_ra_max'],
            ];
            scatter = [item.comm, item.ba_ra];
          }
          configC.series[0].data.push(boxplot);
          configC.series[1].data.push(scatter);
          configC.xAxis[0].data.push(item.comm);
        });
        ChartC.setOptions(configC);
        /*********** 基差率环比分位数 end *********/

        /*********** 月差率环比分位数start *********/
        const configD = cloneDeep(chartBoxCofig);
        configD.title.text = `月差率环比分位数${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartMomData.sort((a, b) => {
          return yearTypeRef.value == 'notYear' ? b.p12_r - a.p12_r : b.p12_ra - a.p12_ra;
        });
        chartMomData.forEach((item) => {
          let boxplot = { name: item.comm, value: [] };
          let scatter = [];
          if (yearTypeRef.value == 'notYear') {
            boxplot.value = [
              item.p12_r_min,
              item['p12_r_25%'],
              item['p12_r_50%'],
              item['p12_r_75%'],
              item.p12_r_max,
            ];
            scatter = [item.comm, item.p12_r];
          } else {
            boxplot.value = [
              item.p12_ra_min,
              item['p12_ra_25%'],
              item['p12_ra_50%'],
              item['p12_ra_75%'],
              item.p12_ra_max,
            ];
            scatter = [item.comm, item.p12_ra];
          }
          configD.series[0].data.push(boxplot);
          configD.series[1].data.push(scatter);
          configD.xAxis[0].data.push(item.comm);
        });
        ChartD.setOptions(configD);
        /*********** 月差率环比分位数 end *********/

        /*********** 基差率日度变化start *********/
        const configE = cloneDeep(chartBarCofig);
        chartDayChg.sort((a, b) => {
          return yearTypeRef.value == 'notYear'
            ? b.ba_r_order - a.ba_r_order
            : b.ba_ra_order - a.ba_ra_order;
        });
        configE.title.text = `基差率日度变化${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartDayChg.forEach((item) => {
          configE.xAxis[0].data.push(item.comm);
          if (yearTypeRef.value == 'notYear') {
            configE.series[0].data.push(checkB(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
            if (item.ba_r_d < 0) {
              configE.series[1].data.push(checkD(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
              configE.series[2].data.push(null);
            } else {
              configE.series[1].data.push(null);
              configE.series[2].data.push(checkD(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
            }
            configE.series[3].data.push(item.ba_r_x);
          } else {
            configE.series[0].data.push(checkB(item.ba_ra_0, item.ba_ra_d, item.ba_ra_tag));
            if (item.ba_ra_d < 0) {
              configE.series[1].data.push(checkD(item.ba_ra_0, item.ba_ra_d, item.ba_r_tag));
              configE.series[2].data.push(null);
            } else {
              configE.series[1].data.push(null);
              configE.series[2].data.push(checkD(item.ba_ra_0, item.ba_ra_d, item.ba_r_tag));
            }
            configE.series[3].data.push(item.ba_ra_x);
          }
        });
        ChartE.setOptions(configE);
        /*********** 基差率日度变化 end *********/

        /*********** 月差率日度变化start *********/
        const configF = cloneDeep(chartBarCofig);
        chartDayChg.sort((a, b) => {
          return yearTypeRef.value == 'notYear'
            ? b.p12_r_order - a.p12_r_order
            : b.p12_ra_order - a.p12_ra_order;
        });
        configF.title.text = `月差率日度变化${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartDayChg.forEach((item) => {
          configF.xAxis[0].data.push(item.comm);
          if (yearTypeRef.value == 'notYear') {
            configF.series[0].data.push(checkB(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
            if (item.p12_r_d < 0) {
              configF.series[1].data.push(checkD(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
              configF.series[2].data.push(null);
            } else {
              configF.series[1].data.push(null);
              configF.series[2].data.push(checkD(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
            }
            configF.series[3].data.push(item.p12_r_x);
          } else {
            configF.series[0].data.push(checkB(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
            if (item.p12_ra_d < 0) {
              configF.series[1].data.push(checkD(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
              configF.series[2].data.push(null);
            } else {
              configF.series[1].data.push(null);
              configF.series[2].data.push(checkD(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
            }
            configF.series[3].data.push(item.p12_ra_x);
          }
        });
        ChartF.setOptions(configF);
        /*********** 月差率日度变化 end *********/

        /*********** 基差率周度变化start *********/
        const configG = cloneDeep(chartBarCofig);
        chartWeekChg.sort((a, b) => {
          return yearTypeRef.value == 'notYear'
            ? b.ba_r_order - a.ba_r_order
            : b.ba_ra_order - a.ba_ra_order;
        });
        configG.title.text = `基差率周度变化${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartWeekChg.forEach((item) => {
          configG.xAxis[0].data.push(item.comm);
          if (yearTypeRef.value == 'notYear') {
            configG.series[0].data.push(checkB(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
            if (item.ba_r_d < 0) {
              configG.series[1].data.push(checkD(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
              configG.series[2].data.push(null);
            } else {
              configG.series[1].data.push(null);
              configG.series[2].data.push(checkD(item.ba_r_0, item.ba_r_d, item.ba_r_tag));
            }
            configG.series[3].data.push(item.ba_r_x);
          } else {
            configG.series[0].data.push(checkB(item.ba_ra_0, item.ba_ra_d, item.ba_ra_tag));
            if (item.ba_ra_d < 0) {
              configG.series[1].data.push(checkD(item.ba_ra_0, item.ba_ra_d, item.ba_ra_tag));
              configG.series[2].data.push(null);
            } else {
              configG.series[1].data.push(null);
              configG.series[2].data.push(checkD(item.ba_ra_0, item.ba_ra_d, item.ba_ra_tag));
            }
            configG.series[3].data.push(item.ba_ra_x);
          }
        });
        ChartG.setOptions(configG);
        /*********** 基差率周度变化 end *********/

        /*********** 月差率周度变化start *********/
        const configH = cloneDeep(chartBarCofig);
        chartWeekChg.sort((a, b) => {
          return yearTypeRef.value == 'notYear'
            ? b.p12_r_order - a.p12_r_order
            : b.p12_ra_order - a.p12_ra_order;
        });
        configH.title.text = `月差率周度变化${
          yearTypeRef.value == 'notYear' ? '（非年化）' : '（年化）'
        }`;
        chartWeekChg.forEach((item) => {
          configH.xAxis[0].data.push(item.comm);
          if (yearTypeRef.value == 'notYear') {
            configH.series[0].data.push(checkB(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
            if (item.p12_r_d < 0) {
              configH.series[1].data.push(checkD(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
              configH.series[2].data.push(null);
            } else {
              configH.series[1].data.push(null);
              configH.series[2].data.push(checkD(item.p12_r_0, item.p12_r_d, item.p12_r_tag));
            }
            configH.series[3].data.push(item.p12_r_x);
          } else {
            configH.series[0].data.push(checkB(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
            if (item.p12_ra_d < 0) {
              configH.series[1].data.push(checkD(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
              configH.series[2].data.push(null);
            } else {
              configH.series[1].data.push(null);
              configH.series[2].data.push(checkD(item.p12_ra_0, item.p12_ra_d, item.p12_ra_tag));
            }
            configH.series[3].data.push(item.p12_ra_x);
          }
        });
        ChartH.setOptions(configH);
        /*********** 月差率周度变化 end *********/
        ChartA.resize();
        ChartB.resize();
        ChartC.resize();
        ChartD.resize();
        ChartE.resize();
        ChartF.resize();
        ChartG.resize();
        ChartH.resize();
      }
      function chartTypeChange() {
        initChart(sourceData);
      }
      function checkB(b, d, tag) {
        if (tag == 0) {
          if (d < 0) {
            return {
              value: b,
              itemStyle: {
                color: '#31868f',
              },
            };
          } else {
            return {
              value: b,
              itemStyle: {
                color: '#c0504d',
              },
            };
          }
        } else {
          return b;
        }
      }
      function checkD(b, d, tag) {
        if (tag) {
          if (b < 0) {
            return Math.abs(d) * -1;
          } else if (b == 0) {
            return d;
          } else {
            return Math.abs(d);
          }
        } else {
          return d;
        }
      }
      /**********品种明细start ************/
      const [registerModalFuture, { openModal: openFutureModal, setModalProps }] = useModal();
      function handleOpenFutureModel(text) {
        let title = `${text}明细`;
        setModalProps({
          title: title,
          canFullscreen: true,
        });
        openFutureModal(true, {
          comm: text,
          dt: tradeDateRef.value,
          dt_type: crossMonitorParam.dt_type,
          seasonal_lag: crossMonitorParam.seasonal_lag,
          yoy_lag: crossMonitorParam.yoy_lag,
          yoy_window: crossMonitorParam.yoy_window,
        });
      }
      /**********品种明细 end ************/
      /**********参数设置start ************/
      const [registerModelParam, { openModal: openParamModal }] = useModal();
      function handleOpenParamModel() {
        openParamModal(true, new Date().getTime());
      }
      // 编辑参数
      const crossMonitorParam = reactive({
        mom_lag: 20,
        yoy_lag: 3,
        yoy_window: 7,
        seasonal_lag: 5,
        dt_type: 'solar',
      });
      provide('crossMonitorParam', crossMonitorParam);
      /**********参数设置 end ************/
      /*********保存图片start *********/
      const imgContainer = ref<HTMLDivElement | null>(null);
      async function screenShot() {
        loadingRef.value = true;
        const screenshotBlob = await dom2imgFile({
          dom: unref(imgContainer)!,
          type: fileType.BLOB,
        });
        downloadByData(screenshotBlob as Blob, `横向监控.jpeg`);
        loadingRef.value = false;
      }
      /*********保存图片end *********/
      const el = ref();
      watch(tableList, (newValue) => {
        let height = newValue.length * 39 + 80;
        el.value.style.height = `${height}px`;
        redoHeight();
      });
      return {
        loadingRef,
        chartWidth,
        tradeDateRef,
        disabledDate,
        cTypeRef,
        cTypeOptions,
        cTypeChange,
        paramChange,
        registerTable,
        el,
        yearTypeRef,
        chartTypeChange,
        chartRefA,
        chartRefB,
        chartRefC,
        chartRefD,
        chartRefE,
        chartRefF,
        chartRefG,
        chartRefH,
        registerModalFuture,
        handleOpenFutureModel,
        registerModelParam,
        handleOpenParamModel,
        screenShot,
        imgContainer,
      };
    },
  });
</script>
<style scoped>
  ::v-deep(th.ant-table-row-cell-break-word) {
    padding: 0 0.5rem !important;
  }

  ::v-deep(.ant-table-header-column) {
    line-height: 39px;
  }
</style>
