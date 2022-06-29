<template>
  <div
    ref="doubleSideChart"
    :class="[isFullscreen ? 'fullscreen' : '', paintMode ? 'paint-mode' : '']"
  >
    <div
      :class="[
        'toolbar',
        inReport ? 'autohidden-toolbar gap-1' : 'gap-2',
        isFullscreen ? 'mt-4' : '',
      ]"
    >
      <Tooltip
        :title="
          showTable
            ? t('quotaView.doubleSideChart.downloadXLSX')
            : t('quotaView.doubleSideChart.downloadImg')
        "
      >
        <Icon
          :class="[
            'download-icon animate__animated',
            (config.title ?? '').length === 0 ? 'disabled' : '',
          ]"
          size="22"
          icon="xiazai|svg"
          @click="download"
        />
      </Tooltip>
      <Tooltip
        :title="
          showTable
            ? t('quotaView.doubleSideChart.chartView')
            : t('quotaView.doubleSideChart.tableView')
        "
      >
        <div
          class="relative w-24px h-24px"
          :class="[(config.title ?? '').length === 0 ? 'disabled' : '']"
          @click="handleEvent(showTable ? 'showChart' : 'showTable')"
        >
          <Icon
            :class="['chartmode-icon', showTable ? 'front' : 'back']"
            icon="fsux_tubiao_zhuzhuangtu|svg"
            size="24"
          />
          <Icon
            :class="['sheetmode-icon -mt-1px', !showTable ? 'front' : 'back']"
            icon="fsux_tubiao_biaoge|svg"
            size="24"
          />
        </div>
      </Tooltip>
      <Icon icon="quanping|svg" size="24" @click="handleEvent('fullscreen')" />
      <Tooltip
        :title="
          paintMode
            ? t('quotaView.doubleSideChart.paintModeOff')
            : t('quotaView.doubleSideChart.paintModeOn')
        "
      >
        <Icon
          icon="fabiao|svg"
          size="22"
          :class="['filter paint-mode-icon', paintMode ? '' : 'grayscale-75']"
          v-show="!inReport"
          @click="handleEvent('paintMode')"
        />
      </Tooltip>
    </div>
    <div
      class="w-full h-full preserve-3d box"
      :class="[isFullscreen ? 'pt-4' : '']"
      id="quota-view-chartbox"
    >
      <BasicChart
        :class="['chart-view w-full', showTable ? 'back' : 'front']"
        :config="config"
        :paintMode="paintMode"
        @update-config="updateConfig"
        @render-success="renderSuccess"
        ref="chartRef"
      />
      <QuotaDataTable
        v-if="loadTable"
        :class="['table-view', showTable ? 'front' : 'back']"
        :config="config"
        ref="tableRef"
      />
      <!-- 绘制墨迹的区域 -->
      <PaintArea :paint-mode="paintMode" />
      <div
        class="absolute flex items-center gap-4 top-2 right-2 cursor-pointer"
        v-if="isFullscreen"
        @click="handleEvent('fullscreen')"
      >
        <div class="text-white keybord">{{ t('quotaView.doubleSideChart.fullscreen') }}</div>
        <Icon icon="ant-design:close-circle-outlined" class="!text-gray-600 !text-3xl" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, toRefs, nextTick, onMounted } from 'vue';
  import BasicChart from './BasicChart.vue';
  import PaintArea from './PaintArea.vue';
  import { QuotaDataTable } from '/@/components/QuotaTable';
  import { useFullscreen, useMagicKeys } from '@vueuse/core';
  import { chartConfigType } from '../../../../types/chart';
  import { EChartsCoreOption, EChartsType } from 'echarts/core';
  import { downloadByBase64 } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Tooltip } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { useTimeoutFn } from '@vueuse/shared';

  const { t } = useI18n();

  const props = defineProps<{
    config: chartConfigType;
  }>();
  const emit = defineEmits<{
    (event: 'updateConfig', config: chartConfigType): void;
    (event: 'renderSuccess', options: EChartsCoreOption): void;
  }>();
  const { config } = toRefs(props);
  const doubleSideChart = ref<HTMLDivElement>();

  // 是否在报告中，显示工具栏,否则仅在鼠标移动到图表上显示
  const inReport = ref(false);
  onMounted(() => {
    inReport.value = doubleSideChart.value!.parentElement!.hasAttribute('data-uniqid');
  });
  const paintMode = ref(false);
  const showTable = ref(false);
  const loadTable = ref(false);
  const { Escape } = useMagicKeys();
  watchEffect(() => {
    // ESC键关闭全屏
    if (Escape.value) exitFullscreen();
  });

  function updateConfig(cfg: chartConfigType) {
    emit('updateConfig', cfg);
  }
  function renderSuccess(options: EChartsCoreOption) {
    emit('renderSuccess', options);
  }
  const chartRef = ref<
    {
      getInstance: () => EChartsType;
    } & ComponentRef
  >();
  const tableRef = ref<
    {
      download: () => void;
    } & ComponentRef
  >();
  async function download({ target }: { target: HTMLElement }) {
    target.parentElement!.parentElement!.classList.add('animate__bounce');
    useTimeoutFn(() => {
      target.parentElement!.parentElement!.classList.remove('animate__bounce');
      handleEvent(showTable.value ? 'xlsx' : 'screenshot');
    }, 1000);
  }
  const {
    isFullscreen,
    toggle: toggleFullscreen,
    exit: exitFullscreen,
  } = useFullscreen(doubleSideChart);
  // 响应工具栏事件
  async function handleEvent(type: string) {
    if (paintMode.value && type !== 'paintMode') return;
    switch (type) {
      case 'screenshot':
        // svg渲染器只能导出svg格式
        const url = (chartRef.value!.getInstance() as EChartsType).getDataURL({
          type: 'svg',
          pixelRatio: 2,
          backgroundColor: '#FFF',
        });
        // 创建一个canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = chartRef.value!.getInstance().getWidth() * 2;
        canvas.height = chartRef.value!.getInstance().getHeight() * 2;
        const img = new Image();
        img.onload = function () {
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          downloadByBase64(dataUrl, `${config.value.title}.png`);
        };
        const arr = url.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        img.src = `data:${mime};base64,${window.btoa(unescape(arr[1]))}`;
        break;
      case 'xlsx':
        tableRef.value!.download();
        break;
      case 'showTable':
        if (!loadTable.value) {
          loadTable.value = true;
          await nextTick();
        }
        showTable.value = true;
        break;
      case 'showChart':
        showTable.value = false;
        break;
      case 'fullscreen':
        toggleFullscreen();
      case 'paintMode':
        paintMode.value = !paintMode.value;
      default:
        break;
    }
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    .chart-view {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  .box {
    transition: width 0.3s ease;
  }

  .table-view {
    padding-top: 30px;
  }

  .chart-view,
  .table-view {
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition: all 1s;

    &.front {
      transform: rotateY(0);
    }

    &.back {
      transform: rotateY(180deg);
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 19;
    margin-left: 2rem;
    height: 1rem;
    width: fit-content;

    .disabled {
      pointer-events: none;
      transition: none;
    }

    .chartmode-icon,
    .sheetmode-icon {
      position: absolute;
      backface-visibility: hidden;
      transition: all 0.2s;
      perspective: 1000;

      &.front {
        transform: rotateY(-180deg);
      }

      &.back {
        transform: rotateY(-360deg);
      }
    }
  }

  .keybord {
    box-shadow: inset 0 -4px 0 darken(@primary-color, 10%);
    background-color: @primary-color;
    line-height: 1.2;
    border-radius: 6px;
    padding: 6px 10px 8px 10px;
  }

  .paint-mode {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    .chart-view {
      @apply bg-white;
    }
  }

  .paint-mode-icon {
    transition: filter 0.2s ease;
  }
</style>
