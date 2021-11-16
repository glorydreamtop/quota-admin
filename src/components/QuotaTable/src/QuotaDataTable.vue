<template>
  <div class="h-full w-full" ref="tableRef">
    <BasicTable class="h-full w-full" @register="registerTable" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs, watch, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { chartConfigType } from '/#/chart';
  import { useDownloadXLSX } from '/@/views/quota/quotaView/helper';
  import { useI18n } from '/@/hooks/web/useI18n';
  const props = defineProps<{
    config: chartConfigType;
  }>();
  const { t } = useI18n();
  const { config } = toRefs(props);
  const [registerTable, { setColumns, setTableData, setLoading }] = useTable({
    canResize: true,
  });
  const tableRef = ref<HTMLDivElement>();
  watch(
    config,
    () => {
      getTableData();
    },
    {
      deep: true,
    },
  );
  const { getXLSX, downloadXLSX, getExcelData } = useDownloadXLSX();
  async function getTableData() {
    setLoading(true);
    const rawData = await getXLSX(config.value.quotaList!, [
      config.value.timeConfig.startDate,
      config.value.timeConfig.endDate,
    ]);
    const { header, tableData } = await getExcelData(new Blob([rawData]));
    setColumns(
      header.map((title) => ({
        title: title === 'NAME' ? t('page.quotaView.toolbar.quotaDataTableHeader.date') : title,
        dataIndex: title,
        key: title,
      })),
    );
    setTableData(tableData.reverse());
    setLoading(false);
  }
  function download() {
    downloadXLSX();
  }
  defineExpose({
    download,
  });
</script>

<style lang="less" scoped>
</style>
