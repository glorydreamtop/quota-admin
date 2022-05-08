<template>
  <div>
    <Teleport to="body" :disabled="!fullscreen">
      <div class="toolbar">
        <Tooltip>
          <template #title>
            <span>{{
              showTable ? t('quotaView.toolbar.downloadXLSX') : t('quotaView.toolbar.downloadImg')
            }}</span>
          </template>
          <Icon
            :class="[
              'download-icon animate__animated',
              (config.title ?? '').length === 0 ? 'disabled' : '',
            ]"
            size="24"
            icon="download_one|svg"
            @click="download"
          />
        </Tooltip>
        <Tooltip>
          <template #title>{{
            showTable ? t('quotaView.toolbar.chartView') : t('quotaView.toolbar.tableView')
          }}</template>
          <div
            class="relative w-29px h-29px"
            :class="[(config.title ?? '').length === 0 ? 'disabled' : '']"
            @click="handleEvent(showTable ? 'showChart' : 'showTable')"
          >
            <Icon
              :class="['chartmode-icon', showTable ? 'front' : 'back']"
              icon="barchart|svg"
              size="27"
            />
            <Icon
              :class="['sheetmode-icon -mt-1px', !showTable ? 'front' : 'back']"
              icon="data_sheet|svg"
              size="29"
            />
          </div>
        </Tooltip>
        <Icon icon="fullscreen|svg" size="20" @click="handleEvent('fullscreen')" />
      </div>
      <div
        class="w-full h-full preserve-3d box"
        :class="[fullscreen ? 'fullscreen' : '']"
        id="quota-view-chartbox"
      >
        <BasicChart
          :class="['chart-view w-full', showTable ? 'back' : 'front']"
          :config="config"
          @update-config="updateConfig"
          @paint-success="paintSuccess"
          ref="chartRef"
        />
        <QuotaDataTable
          :class="['table-view', showTable ? 'front' : 'back']"
          :config="config"
          ref="tableRef"
        />

        <div class="absolute flex gap-4 top-2 right-2">
          <Icon
            icon="ant-design:close-circle-filled"
            v-if="fullscreen"
            class="!text-gray-400 !text-3xl"
            @click="handleEvent('fullscreen')"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, toRefs } from 'vue';
  import BasicChart from './BasicChart.vue';
  import { QuotaDataTable } from '/@/components/QuotaTable';
  import { useMagicKeys } from '@vueuse/core';
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
    (event: 'paintSuccess', options: EChartsCoreOption): void;
  }>();
  const { config } = toRefs(props);

  const fullscreen = ref(false);
  const showTable = ref(false);
  const { Escape } = useMagicKeys();
  watchEffect(() => {
    // ESC键关闭全屏
    if (Escape.value) fullscreen.value = false;
  });

  function updateConfig(cfg: chartConfigType) {
    emit('updateConfig', cfg);
  }
  function paintSuccess(options: EChartsCoreOption) {
    emit('paintSuccess', options);
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
  // 响应工具栏事件
  async function handleEvent(type: string) {
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
          console.log('aaa');
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
        showTable.value = true;
        break;
      case 'showChart':
        showTable.value = false;
        break;
      case 'fullscreen':
        fullscreen.value = !fullscreen.value;
      default:
        break;
    }
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @white;
    z-index: 9999;

    .chart-view {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  .box {
    transition: width 0.3s ease;
  }

  .disabled {
    filter: grayscale(80%);
    pointer-events: none;
    transition: none;
  }

  .table-view {
    padding-top: 30px;
  }

  .chart-view,
  .table-view {
    position: absolute;
    backface-visibility: hidden;
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
    gap: 0.5rem;
    align-items: center;
    position: absolute;
    z-index: 19;

    .disabled {
      filter: grayscale(80%);
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
</style>
