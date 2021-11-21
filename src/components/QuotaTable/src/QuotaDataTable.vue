<template>
  <div class="h-full w-full overflow-x-hidden" v-loading="info.loading">
    <div class="overflow-x-scroll h-full">
      <div class="bg-gray-100 flex items-center justify-start min-w-full w-fit">
        <div class="title" v-for="name in info.header" :key="name">
          <span>{{ name }}</span>
          <Icon
            v-if="name !== t('page.quotaView.toolbar.quotaDataTableHeader.date')"
            icon="ant-design:plus-square-outlined"
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
                @blur="updateQuotaData"
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
  import { toRefs, watch, reactive } from 'vue';
  import { VScroll } from '/@/components/VirtualScroll';
  import { chartConfigType } from '/#/chart';
  import { useDownloadXLSX } from './helper';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { Input } from 'ant-design-vue';

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
  const { config } = toRefs(props);
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
    dateColName: t('page.quotaView.toolbar.quotaDataTableHeader.date'),
  });
  function showEdit(data: Recordable<any>, name: string) {
    editData.name = name;
    editData.value = data[name];
    editData.date = data[t('page.quotaView.toolbar.quotaDataTableHeader.date')];
  }
  function updateQuotaData() {}
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

    & > div {
      width: @column-width;
      min-width: @column-width;
      text-align: center;
      user-select: none;
    }

    height: @column-height;
    line-height: @column-height;
    position: relative !important;
  }

  .edit-data {
    position: absolute;
    width: @column-width;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
