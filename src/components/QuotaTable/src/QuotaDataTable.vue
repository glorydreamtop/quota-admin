<template>
  <div class="h-full w-full">
    <BasicTable class="h-full w-full" @register="registerTable" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { chartConfigType } from '/#/chart';
  import { useDownloadXLSX } from '/@/views/quota/quotaView/helper';
  const props = defineProps<{
    config: chartConfigType;
  }>();

  const { config } = toRefs(props);
  const [registerTable, { setColumns, setTableData }] = useTable({
    canResize: true,
    maxHeight: 300,
  });
  watch(
    config,
    () => {
      getTableData();
    },
    {
      deep: true,
    },
  );
  const { getXLSX, getExcelData } = useDownloadXLSX();
  async function getTableData() {
    const rawData = await getXLSX(config.value.quotaList!, [
      config.value.timeConfig.startDate,
      config.value.timeConfig.endDate,
    ]);
    const { header, tableData } = await getExcelData(new Blob([rawData]));
    setColumns(header);
    setTableData(tableData);
  }
</script>

<style lang="less" scoped></style>
