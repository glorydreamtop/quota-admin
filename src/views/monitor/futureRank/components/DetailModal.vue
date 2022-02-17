<template>
  <BasicModal @register="registerModal">
    <div class="grid-cols-3 grid-rows-2">
      <div class="col-span-1 row-span-1" ref="buyChart"></div>
      <div class="col-span-1 row-span-1" ref="saleChart"></div>
      <div class="col-span-1 row-span-1" ref="doneChart"></div>
      <div class="col-span-1 row-span-1" ref="lineChart"></div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  // import { reactive, ref } from 'vue';
  import { getHoldShares } from '/@/api/future';
  import { useModalInner, BasicModal } from '/@/components/Modal';
  // import { useECharts } from '/@/hooks/web/useECharts';
  // import { useI18n } from '/@/hooks/web/useI18n';

  // const { t } = useI18n();

  // const chartData = reactive({
  //   buy: {
  //     title: '',
  //     data: [],
  //   },
  //   sale: {
  //     title: '',
  //     data: [],
  //   },
  //   done: {
  //     title: '',
  //     data: [],
  //   },
  //   line: {
  //     title: '',
  //     data: [],
  //   },
  // });
  const buyChart = ref();
  const saleChart = ref();
  const doneChart = ref();
  const lineChart = ref();

  // const { setOptions: setBuyChartOptions } = useECharts(buyChart);
  // const { setOptions: setSaleChartOptions } = useECharts(saleChart);
  // const { setOptions: setDoneChartOptions } = useECharts(doneChart);
  // const { setOptions: setLineChartOptions } = useECharts(lineChart);

  // function makeChartOptions() {
  //   const baseOptions = {
  //     title: {
  //       text: t('monitor.futureRank.modal.buychartTtile'),
  //       left: 'center',
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{b}<br/>{c} ({d}%)',
  //     },
  //     label: {
  //       formatter: ({ name, percent }) => {
  //         return `${name}\n${percent}%`;
  //       },
  //     },
  //     legend: {
  //       top: 'bottom',
  //       data: [t('monitor.futureRank.openBuy'), t('monitor.futureRank.change')],
  //     },
  //     color: ['#c23531', '#2f4554', '#31868f', '#4FCBBF', '#5BDC61', '#5BB3DC', '#AD6EE4'],
  //     series: [
  //       {
  //         name: t('monitor.futureRank.modal.buychartTtile'),
  //         type: 'pie',
  //         radius: '60%',
  //         data: perData
  //           .filter((item) => {
  //             return item.rankType == 1;
  //           })
  //           .map((item_1) => {
  //             return { name: item_1.contract, value: item_1.volume };
  //           }),
  //       },
  //     ],
  //   };
  // }
  const [registerModal] = useModalInner(async (params) => {
    const res = await getHoldShares(params);
    for (let i = 0; i < res.length; i++) {
      const data = res[i];
      switch (data.rankType) {
        case 0:
          break;

        default:
          break;
      }
    }
    // setBuyChartOptions({});
  });
</script>

<style lang="less" scoped></style>
