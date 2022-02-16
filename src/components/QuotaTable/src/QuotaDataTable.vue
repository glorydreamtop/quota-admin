<template>
  <div class="h-full w-full overflow-x-hidden" v-loading="info.loading">
    <div class="overflow-x-scroll h-full">
      <div class="bg-gray-100 flex items-center justify-start min-w-full w-fit">
        <div class="title" v-for="name in info.header" :key="name">
          <span>{{ name }}</span>
          <Icon
            v-if="name !== dateKey"
            icon="ant-design:plus-square-outlined"
            @click="addData(name)"
            class="!text-gray-400"
          />
        </div>
      </div>
      <VScroll
        class="vscroll"
        :style="{ width: `calc(${8 * info.header.length}rem + 8px)` }"
        :itemHeight="40"
        :items="info.quotaDataLine"
      >
        <template #default="{ item }">
          <div class="vscroll-item">
            <div v-for="name in info.header" :key="name" class="relative">
              <span @dblclick="showEdit(item, name)">{{ item[name] }}</span>
              <Input
                @blur="updateQuotaData(item)"
                class="edit-data"
                v-if="editData.name === name && editData.date === item[editData.dateColName]"
                size="small"
                v-model:value="editData.value"
              />
            </div>
          </div>
        </template>
      </VScroll>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toRefs, watch, reactive, h, computed } from 'vue';
  import { VScroll } from '/@/components/VirtualScroll';
  import { chartConfigType } from '/#/chart';
  import { useDownloadXLSX } from './helper';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { Input, Modal, DatePicker } from 'ant-design-vue';
  import { importJson } from '/@/api/quota';
  import { useMessage } from '/@/hooks/web/useMessage';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import { formatToDate } from '/@/utils/dateUtil';
  import dayjs from 'dayjs';

  interface quotaDataType {
    header: string[];
    quotaDataLine: Recordable<any>[];
    loading: boolean;
    ids: number[];
  }
  const props = defineProps<{
    config: chartConfigType;
  }>();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { config } = toRefs(props);
  const dateKey = t('quotaView.toolbar.quotaDataTableHeader.date');
  watch(
    config,
    () => {
      setQuotaDataTableData();
    },
    {
      deep: true,
    },
  );
  const info: quotaDataType = reactive({
    header: [],
    quotaDataLine: [],
    loading: false,
    ids: [],
  });
  const { fetchData, getTableData, downloadXLSX } = useDownloadXLSX();
  async function setQuotaDataTableData() {
    info.loading = true;
    await fetchData(config.value.quotaList!, [
      config.value.timeConfig.startDate,
      config.value.timeConfig.endDate,
    ]);
    const { names, tableData, ids } = await getTableData();
    info.header = names;
    info.quotaDataLine = tableData;
    info.loading = false;
    info.ids = ids;
  }
  function download() {
    downloadXLSX();
  }
  defineExpose({
    download,
  });
  const editData = reactive({
    name: '',
    value: '',
    date: '',
    dateColName: dateKey,
  });
  function showEdit(data: Recordable<any>, name: string) {
    editData.name = name;
    editData.value = data[name];
    editData.date = data[dateKey];
  }
  async function updateQuotaData(rowData: Recordable<any>) {
    const jsonObj = JSON.stringify([
      {
        id: info.ids[info.header.indexOf(editData.name) - 1],
        rows: [[editData.date, editData.value]],
      },
    ]).toUpperCase();

    try {
      info.loading = true;
      await importJson({ jsonObj, importPara: 0 });
      rowData[editData.name] = editData.value;
      editData.name = '';
      editData.value = '';
      editData.date = '';
      info.loading = false;
      createMessage.success(t('quotaView.toolbar.realTimeSave'));
    } catch (error) {
      createMessage.error(error);
    }
  }
  async function addData(name: string) {
    const data = reactive({
      value: '',
      date: formatToDate(),
    });
    const disabled = computed(() => {
      return data.value.length === 0 || !/\d{4}-\d{2}-\d{2}/i.test(data.date);
    });
    Modal.confirm({
      title: t('quotaView.toolbar.addData.title'),
      content: h(
        'div',
        {
          className: 'flex items-center flex-col gap-2',
        },
        [
          h('div', { className: 'flex items-center justify-between gap-2' }, [
            h(
              'span',
              { className: 'whitespace-nowrap w-4em text-center' },
              t('quotaView.toolbar.addData.dataValue'),
            ),
            h(Input, {
              class: '!w-30',
              size: 'small',
              onInput: ({ target }: { target: HTMLInputElement }) => {
                data.value = target.value.trim();
              },
            }),
          ]),
          h('div', { className: 'flex items-center justify-between gap-2' }, [
            h(
              'span',
              { className: 'whitespace-nowrap w-4em text-center' },
              t('quotaView.toolbar.addData.dataDate'),
            ),
            h(DatePicker, {
              locale,
              class: '!w-30',
              size: 'small',
              defaultValue: data.date,
              valueFormat: 'YYYY-MM-DD',
              onChange: (value: string) => {
                data.date = value;
              },
            }),
          ]),
        ],
      ),
      okType: 'primary',
      okText: t('quotaView.toolbar.addData.confirm'),
      okButtonProps: {
        disabled: disabled,
      },
      onOk: async () => {
        const jsonObj = JSON.stringify([
          {
            id: info.ids[info.header.indexOf(name) - 1],
            rows: [[data.date, data.value]],
          },
        ]).toUpperCase();

        try {
          info.loading = true;
          await importJson({ jsonObj, importPara: 0 });
          const line = info.quotaDataLine.sort((a, b) => a[dateKey] - b[dateKey]);
          for (let i = 1; i < line.length; i++) {
            const e = line[i];
            if (
              dayjs(line[i - 1][dateKey]).isAfter(dayjs(data.date)) &&
              dayjs(e[dateKey]).isBefore(dayjs(data.date))
            ) {
            }
          }
          info.loading = false;
          createMessage.success(t('quotaView.toolbar.realTimeSave'));
        } catch (error) {}
      },
    });
  }
</script>

<style lang="less" scoped>
  @column-width: 8rem;
  @column-height: 40px;

  .title {
    text-align: center;
    width: @column-width;
    min-width: @column-width;
    height: @column-height;
    line-height: @column-height;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .vscroll {
    height: calc(100% - @column-height);
    // width: 100%;
    max-width: unset !important;
    min-width: 100%;
  }

  .vscroll-item {
    @apply flex items-center border-b border-light-700 text-gray-600;

    height: @column-height;
    line-height: @column-height;
    position: relative !important;

    & > div {
      width: @column-width;
      min-width: @column-width;
      text-align: center;
      user-select: none;
    }
  }

  .edit-data {
    position: absolute;
    width: @column-width;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .value-input {
    @apply !w-16;
  }
</style>
