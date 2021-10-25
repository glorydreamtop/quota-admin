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
      <template #normal-title-text="{ column }">
        <div>{{ column.title }}</div>
      </template>
      <template #normal-title-text-editor="{ column, columnIndex }">
        <div class="flex items-center justify-center">
          <Input
            v-if="tableConfig.columns[columnIndex].headerType === 0"
            class="text-center flex-grow"
            size="small"
            v-model:value="column.title"
          />
          <DatePicker
            v-if="tableConfig.columns[columnIndex].headerType === 1"
            v-model:value="column.title"
            size="small"
            valueFormat="YYYY-MM-DD"
          />
          <div class="w-1/3 gap-1 border border-gray-300 header-icons-box pl-1">
            <Icon
              icon="ant-design:setting-outlined"
              @click="showHeaderCellModal({ column, columnIndex })"
            />
            <Icon
              icon="ant-design:check-outlined"
              @click="closeTitleEditor({ column, columnIndex })"
            />
          </div>
        </div>
      </template>
      <template #normal-cell-text="{ row, column }">
        <div class="select-none">{{ row[column.property] }}</div>
      </template>
      <template #normal-cell-text-editor="{ row, column }">
        <Input class="text-center" v-model:value="row[column.property]" />
      </template>
    </VxeGrid>
    <HeaderCellSetting @register="registerHeaderCellSettingModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick } from 'vue';
  import type {
    VxeGridProps,
    VxeGridInstance,
    VxeGridEventProps,
    VxeTableDefines,
    VxeGridDefines,
  } from 'vxe-table';
  import { Button, Popover, Input, DatePicker } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createTableConfigContext, useAddCol, useAddRow, useAreaSelect } from './helper';
  import type { TableConfigType } from '/#/table';
  import { maxBy, minBy } from 'lodash';
  import { useModal } from '/@/components/Modal';
  import HeaderCellSetting from './HeaderCellSetting.vue';
  import Icon from '/@/components/Icon';

  const [registerHeaderCellSettingModal, { openModal: openHeaderCellSettingModal }] = useModal();
  const { t } = useI18n();
  const xGrid = ref({} as VxeGridInstance);
  const gridOptions = reactive<VxeGridProps & VxeGridEventProps>({
    border: true,
    resizable: true,
    height: 600,
    align: 'center',
    columns: [
      {
        title: '测试1',
        field: 'a',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      },
      {
        title: '测试2',
        field: 'b',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      },
      {
        title: '测试3',
        field: 'c',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      },
      {
        title: '测试4',
        field: 'd',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          edit: 'normal-cell-text-editor',
        },
      },
      {
        title: '测试5',
        field: 'e',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      },
      {
        title: '测试6',
        field: 'f',
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      },
    ],
    toolbarConfig: {
      slots: {
        buttons: 'toolbar-buttons',
      },
    },
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showIcon: false,
    },
    data: [
      { a: 'a1', b: 'b1', c: 'c1', d: 'd1', e: 'e1', f: 'f1' },
      { a: 'a2', b: 'b2', c: 'c2', d: 'd2', e: 'e2', f: 'f2' },
      { a: 'a3', b: 'b3', c: 'c3', d: 'd3', e: 'e3', f: 'f3' },
      { a: 'a4', b: 'b4', c: 'c4', d: 'd4', e: 'e4', f: 'f4' },
      { a: 'a5', b: 'b5', c: 'c5', d: 'd5', e: 'e5', f: 'f5' },
      { a: 'a6', b: 'b6', c: 'c6', d: 'd6', e: 'e6', f: 'f6' },
      { a: 'a7', b: 'b7', c: 'c7', d: 'd7', e: 'e7', f: 'f7' },
    ],
    mergeCells: [],
    cellClassName: ({ rowIndex, columnIndex }) => {
      if (selectedCells.value.find((cell) => cell.row === rowIndex && cell.col === columnIndex)) {
        return 'area-cells';
      }
      return null;
    },
    menuConfig: {
      body: {
        options: [
          [
            {
              code: 'mergeCells',
              name: t('table.contextmenu.mergeCells'),
              disabled: false,
            },
            {
              code: 'splitCells',
              name: t('table.contextmenu.splitCells'),
              disabled: false,
            },
          ],
        ],
      },
    },
    onMenuClick: ({ menu, rowIndex, columnIndex }) => {
      const $table = xGrid.value;
      switch (menu.code) {
        case 'mergeCells':
          const cells = getAreaCells().value;
          const minRow = minBy(cells, (cell) => cell.row)!.row;
          const maxRow = maxBy(cells, (cell) => cell.row)!.row;
          const minCol = minBy(cells, (cell) => cell.col)!.col;
          const maxCol = maxBy(cells, (cell) => cell.col)!.col;
          const info = {
            row: minBy(cells, (cell) => cell.row)!.row,
            col: minBy(cells, (cell) => cell.col)!.col,
            rowspan: maxRow - minRow + 1,
            colspan: maxCol - minCol + 1,
          };
          $table.setMergeCells([info]);
          break;
        case 'splitCells':
          $table.removeMergeCells({
            row: rowIndex,
            col: columnIndex,
          } as VxeTableDefines.MergeOptions);
          break;
      }
    },
    onHeaderCellDblclick: async ({ column, $event }) => {
      const headerCellDOM = ($event.target as HTMLElement).parentNode!;
      column.slots.header = 'normal-title-text-editor';
      await nextTick();
      (headerCellDOM.querySelector('input') as HTMLInputElement).focus();
    },
  });

  const tableConfig: TableConfigType = reactive({
    title: '',
    columns: [
      { title: '测试1', field: 'a', headerType: 0 },
      { title: '测试2', field: 'b', headerType: 0 },
    ],
    mergeCells: [],
  });
  createTableConfigContext(tableConfig);
  const [colValue, { addCol }] = useAddCol(xGrid, tableConfig);
  const { addSpaceRow } = useAddRow(xGrid, tableConfig);
  const { getAreaCells } = useAreaSelect(xGrid, (cells) => {
    selectedCells.value = cells;
  });
  const selectedCells = ref<any[]>([]);
  function showHeaderCellModal({
    column,
    columnIndex,
  }: Partial<VxeGridDefines.HeaderCellClickEventParams>) {
    openHeaderCellSettingModal(true, { column, columnIndex });
  }
  function closeTitleEditor({ column }: Partial<VxeGridDefines.HeaderCellClickEventParams>) {
    column.slots.header = 'normal-title-text';
  }
</script>

<style lang="less" scoped>
  ::v-deep(.area-cells) {
    background-color: rgba(64, 158, 255, 0.3);
  }

  .header-icons-box {
    height: 23.6px;
    border-left: none;
    display: flex;
    align-items: center;
    margin-left: -1px;
  }
</style>
