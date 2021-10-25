<template>
  <BasicModal @register="registerModal" v-bind="modalConfig">
    <div class="flex flex-col items-center">
      <div>
        <span class="mr-2">{{ t('table.headerCell.type') }}</span>
        <Select v-model:value="tableConfig.columns[info.columnIndex].headerType">
          <SelectOption :key="0">{{ t('table.headerCell.normal') }}</SelectOption>
          <SelectOption :key="1">{{ t('table.headerCell.date') }}</SelectOption>
        </Select>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { ModalProps, Select } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableConfigContext } from './helper';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { VxeTableDefines } from 'vxe-table';

  interface Info {
    column: VxeTableDefines.ColumnInfo;
    columnIndex: number;
  }
  const SelectOption = Select.Option;
  const { t } = useI18n();
  const tableConfig = useTableConfigContext();
  const info: Info = reactive({ column: {}, columnIndex: 0 });
  const [registerModal] = useModalInner(({ column, columnIndex }: Info) => {
    Object.assign(info, { column, columnIndex });
  });
  const modalConfig: Partial<ModalProps> = reactive({
    title: t('table.headerCell.modalTitle'),
    showOkBtn: false,
    showCancelBtn: false,
    width: 300,
  });
</script>

<style lang="less" scoped></style>
