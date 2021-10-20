<template>
  <div class="p-4 bg-white">
    <VxeGrid v-bind="gridOptions" ref="xGrid">
      <template #toolbar-buttons>
        <div class="flex gap-2">
          <Popover trigger="click">
            <template #content>
              <div class="flex gap-1">
                <Input size="small" v-model:value="colValue.title" />
                <Button size="small" type="primary" @click="addCol">{{
                  t('common.okText')
                }}</Button>
              </div>
            </template>
            <Button size="small">{{ t('page.quotaTable.addCol') }}</Button>
          </Popover>

          <Button size="small" @click="addSpaceRow">{{ t('page.quotaTable.addRow') }}</Button>
        </div>
      </template>
      <template #normal-text="{ row, column }">
        <span>{{ row[column.property] }}</span>
      </template>
      <template #normal-text-editor="{ row, column }">
        <Input v-model:value="row[column.property]" />
      </template>
    </VxeGrid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { VxeGridProps, VxeGridInstance } from 'vxe-table';
  import { Button, Popover, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAddCol, useAddRow } from './helper';
  import { tableConfigType } from '/#/table';

  const { t } = useI18n();
  const xGrid = ref({} as VxeGridInstance);
  const gridOptions = reactive<VxeGridProps>({
    border: true,
    resizable: true,
    height: 600,
    align: 'center',
    columns: [{ type: 'seq', width: 50 }],
    toolbarConfig: {
      slots: {
        buttons: 'toolbar-buttons',
      },
    },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    data: [],
  });

  const tableConfig: tableConfigType = reactive({
    title: '',
    columns: [],
  });

  const [colValue, { addCol }] = useAddCol(xGrid, tableConfig);
  const { addSpaceRow } = useAddRow(xGrid, tableConfig);
</script>

<style lang="less" scoped></style>
