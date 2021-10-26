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
      <template #normal-title-text="{ column, columnIndex }">
        <div class="flex items-center justify-center gap-1">
          <span>{{ column.title }}</span>
          <Icon
            class="ml-1 !text-primary"
            :icon="
              ['fluent:text-field-24-regular', 'ant-design:field-time-outlined'][
                tableConfig.columns[columnIndex].headerType
              ]
            "
          />
        </div>
      </template>
      <template #normal-title-text-editor="{ column, columnIndex }">
        <div class="flex items-center justify-center">
          <Input
            v-if="tableConfig.columns[columnIndex].headerType === 0"
            class="text-center flex-grow"
            size="small"
            v-model:value="column.title"
            @blur="titleChange(columnIndex, $event)"
          />
          <DatePicker
            v-if="tableConfig.columns[columnIndex].headerType === 1"
            v-model:value="column.title"
            size="small"
            valueFormat="YYYY-MM-DD"
          >
            <div class="border border-gray-300 flex items-center cursor-pointer"
              ><span class="mr-1 ml-2">{{ column.title }}</span
              ><Icon class="mr-1" icon="ant-design:caret-down-filled"
            /></div>
          </DatePicker>
          <div class="w-50px gap-1 border border-gray-300 header-icons-box pl-1">
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
      <template #normal-cell-text="{ row, column, rowIndex }">
        <div v-if="tableConfig.data[rowIndex][column.property].type === 0" class="select-none">{{
          row[column.property]
        }}</div>
        <div v-else class="select-none flex items-center justify-center gap-1">
          <span>{{ tableConfig.data[rowIndex][column.property].qData }}</span
          ><Icon class="!text-primary" icon="tabler:letter-q" />
        </div>
      </template>
      <template #normal-cell-text-editor="{ row, column, rowIndex, columnIndex }">
        <div class="flex items-center justify-center">
          <Input class="text-center" v-model:value="row[column.property]" />
          <div class="gap-1 border-gray-300 header-icons-box pl-1">
            <Icon
              icon="ant-design:setting-outlined"
              @click="showCellModal({ column, rowIndex, row, columnIndex })"
            />
          </div>
        </div>
      </template>
    </VxeGrid>
    <HeaderCellSetting @register="registerHeaderCellSettingModal" />
    <CellSetting @register="registerCellSettingModal" />
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
  import { maxBy, minBy, parseInt, remove } from 'lodash';
  import { useModal } from '/@/components/Modal';
  import HeaderCellSetting from './HeaderCellSetting.vue';
  import CellSetting from './CellSetting.vue';
  import Icon from '/@/components/Icon';
  import { getSingleQuotaData } from '/@/api/quota';
  import { CellTypeEnum, HeaderCellTypeEnum } from '/@/enums/tableEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const [registerHeaderCellSettingModal, { openModal: openHeaderCellSettingModal }] = useModal();
  const [
    registerCellSettingModal,
    { openModal: openCellSettingModal, setModalProps: setCellSettingModalProps },
  ] = useModal();
  const { t } = useI18n();
  const { createMessage } = useMessage();
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
    onCellMenu: ({ rowIndex, column }) => {
      const menuList = gridOptions.menuConfig!.body!.options![0];
      const updateCellDataMenu = {
        code: 'updateCellData',
        name: t('table.contextmenu.updateCellData'),
        disabled: false,
      };
      // 如果是指标数据单元格，添加“刷新数据”的右键菜单
      if (menuList.find((menu) => menu.code === updateCellDataMenu.code)) {
        remove(menuList, (menu) => menu.code === updateCellDataMenu.code);
        if (tableConfig.data[rowIndex!][column.property].type === CellTypeEnum.quota) {
          menuList.push(updateCellDataMenu);
        }
      }
    },
    onMenuClick: ({ menu, rowIndex, columnIndex, column, row }) => {
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
        case 'updateCellData':
          getSingleData({ rowIndex, columnIndex, column, row });
          break;
      }
    },
    onHeaderCellDblclick: async ({ column, $event }) => {
      const headerCellDOM = ($event.target as HTMLElement).parentNode!;
      column.slots.header = 'normal-title-text-editor';
      await nextTick();
      (headerCellDOM.querySelector('input') as HTMLInputElement).focus();
    },
    onEditClosed: updateCellData,
  });

  const tableConfig: TableConfigType = reactive({
    title: '',
    columns: [
      { title: '测试1', field: 'a', headerType: 0 },
      { title: '测试2', field: 'b', headerType: 0 },
      { title: '测试3', field: 'c', headerType: 0 },
      { title: '测试4', field: 'd', headerType: 0 },
      { title: '测试5', field: 'e', headerType: 0 },
      { title: '测试6', field: 'f', headerType: 0 },
    ],
    mergeCells: [],
    data: [
      {
        a: {
          val: 'a1',
          type: 0,
        },
        b: {
          val: 'b1',
          type: 0,
        },
        c: {
          val: 'c1',
          type: 0,
        },
        d: {
          val: 'd1',
          type: 0,
        },
        e: {
          val: 'e1',
          type: 0,
        },
        f: {
          val: 'f1',
          type: 0,
        },
      },
      {
        a: {
          val: 'a2',
          type: 0,
        },
        b: {
          val: 'b2',
          type: 0,
        },
        c: {
          val: 'c2',
          type: 0,
        },
        d: {
          val: 'd2',
          type: 0,
        },
        e: {
          val: 'e2',
          type: 0,
        },
        f: {
          val: 'f2',
          type: 0,
        },
      },
      {
        a: {
          val: 'a3',
          type: 0,
        },
        b: {
          val: 'b3',
          type: 0,
        },
        c: {
          val: 'c3',
          type: 0,
        },
        d: {
          val: 'd3',
          type: 0,
        },
        e: {
          val: 'e3',
          type: 0,
        },
        f: {
          val: 'f3',
          type: 0,
        },
      },
      {
        a: {
          val: 'a4',
          type: 0,
        },
        b: {
          val: 'b4',
          type: 0,
        },
        c: {
          val: 'c4',
          type: 0,
        },
        d: {
          val: 'd4',
          type: 0,
        },
        e: {
          val: 'e4',
          type: 0,
        },
        f: {
          val: 'f4',
          type: 0,
        },
      },
      {
        a: {
          val: 'a5',
          type: 0,
        },
        b: {
          val: 'b5',
          type: 0,
        },
        c: {
          val: 'c5',
          type: 0,
        },
        d: {
          val: 'd5',
          type: 0,
        },
        e: {
          val: 'e5',
          type: 0,
        },
        f: {
          val: 'f5',
          type: 0,
        },
      },
      {
        a: {
          val: 'a6',
          type: 0,
        },
        b: {
          val: 'b6',
          type: 0,
        },
        c: {
          val: 'c6',
          type: 0,
        },
        d: {
          val: 'd6',
          type: 0,
        },
        e: {
          val: 'e6',
          type: 0,
        },
        f: {
          val: 'f6',
          type: 0,
        },
      },
      {
        a: {
          val: 'a7',
          type: 0,
        },
        b: {
          val: 'b7',
          type: 0,
        },
        c: {
          val: 'c7',
          type: 0,
        },
        d: {
          val: 'd7',
          type: 0,
        },
        e: {
          val: 'e7',
          type: 0,
        },
        f: {
          val: 'f7',
          type: 0,
        },
      },
    ],
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
  // 关掉表头编辑
  function closeTitleEditor({ column }: Partial<VxeGridDefines.HeaderCellClickEventParams>) {
    column!.slots.header = 'normal-title-text';
  }
  // 单元格高级设置
  function showCellModal({
    column,
    rowIndex,
    row,
    columnIndex,
  }: Partial<VxeGridDefines.CellClickEventParams>) {
    openCellSettingModal(true, { rowIndex, column });
    setCellSettingModalProps({
      afterClose: updateCellData.bind(null, { column, rowIndex, row, columnIndex }),
    });
  }
  // 更新单元格内容
  function updateCellData({
    column,
    rowIndex,
    row,
    columnIndex,
  }: Partial<VxeGridDefines.EditClosedEventParams>) {
    const key = column!.property;
    tableConfig.data[rowIndex!][key].val = row[key];
    if (tableConfig.data[rowIndex!][key].type === CellTypeEnum.quota) {
      getSingleData({ column, rowIndex, row, columnIndex });
    }
  }
  // 请求单个指标数据
  async function getSingleData({
    row,
    column,
    rowIndex,
    columnIndex,
  }: Partial<VxeGridDefines.EditClosedEventParams>) {
    if (tableConfig.columns[columnIndex!].headerType !== HeaderCellTypeEnum.date) {
      createMessage.warn(t('table.headerCell.isNotDateTip'));
      return;
    }
    const data = await getSingleQuotaData({
      id: parseInt(row[column!.property]),
      date: column!.title,
    });
    tableConfig.data[rowIndex!][column!.property].qData = (data[0].data[0] ?? [
      0,
      t('common.noData'),
    ])[1].toString();
  }
  // 监听表头文本变化
  function titleChange(columnIndex: number, e: FocusEvent) {
    tableConfig.columns[columnIndex].title = (e.target as HTMLInputElement).value;
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
