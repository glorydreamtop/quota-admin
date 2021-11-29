<template>
  <div class="p-4 bg-white">
    <VxeGrid v-bind="gridOptions" ref="xGrid">
      <template #toolbar-buttons>
        <div class="flex gap-2 items-center">
          <Popover trigger="click">
            <template #content>
              <div class="flex gap-1">
                <Input size="small" v-model:value="colValue.title" />
                <Button size="small" type="primary" @click="addCol(tableConfig.columns.length)">{{
                  t('common.okText')
                }}</Button>
              </div>
            </template>
            <Button size="small">{{ t('table.addCol') }}</Button>
          </Popover>
          <Button size="small" @click="addSpaceRow(tableConfig.data.length)">{{
            t('table.addRow')
          }}</Button>
          <DatePicker
            size="small"
            class="!w-auto"
            v-model:value="tableConfig.timeConfig.endDate"
            valueFormat="YYYY-MM-DD"
          >
            <Button class="flex items-center gap-1" size="small">
              <span>{{ t('table.endDate') }}：</span>
              <span class="flex items-center gap-1 cursor-pointer">
                <span>{{ tableConfig.timeConfig.endDate }}</span>
                <Icon class="!text-primary" icon="ant-design:field-time-outlined" />
              </span>
            </Button>
          </DatePicker>
          <Button size="small" type="primary" @click="saveTable">{{ t('common.saveText') }}</Button>
          <Popover trigger="click">
            <template #content>
              <div class="flex flex-col items-center">
                <div class="flex gap-2">
                  <div
                    v-for="item in tableConfigSchemaList"
                    :key="item.preview"
                    :class="[
                      'flex flex-col items-center gap-2 border',
                      defaultTableConfig.name === item.name ? ' border-primary' : '',
                    ]"
                    @click="defaultTableConfig = item"
                  >
                    <img class="w-70 h-40" :src="item.preview" alt="" />
                    <span class="text-gray-400">{{ item.name }}</span>
                  </div>
                </div>
                <Button size="small" class="w-60 mt-4" type="primary" @click="applyConfig">{{
                  t('common.okText')
                }}</Button>
              </div>
            </template>
            <Button size="small">{{ t('table.template') }}</Button>
          </Popover>
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
          <span class="text-gray-300">{{ column.property }}</span>
        </div>
      </template>
      <template #normal-title-text-editor="{ column, columnIndex }">
        <div class="flex items-center justify-center">
          <Input
            class="text-center flex-grow"
            size="small"
            v-model:value="column.title"
            @blur="titleChange(columnIndex, $event)"
          />

          <div class="w-auto flex items-center gap-1 border border-gray-300 header-icons-box pl-1">
            <Popover trigger="click">
              <template #content>
                <Input
                  size="small"
                  class="!w-34 !text-center"
                  v-model:value="tableConfig.columns[columnIndex].timeStr"
                  @input="timeStrChange(columnIndex, $event)"
                >
                  <template #addonAfter>
                    <Tooltip>
                      <Icon icon="ant-design:question-circle-outlined" />
                      <template #title>
                        <span>{{ t('table.headerCell.timeStrTip') }}</span>
                      </template>
                    </Tooltip>
                  </template>
                </Input>
                <div class="text-sm text-red-500">
                  {{ timeStrTip }}
                </div>
              </template>
              <Icon class="cursor-pointer" icon="ant-design:field-time-outlined" />
            </Popover>
            <Icon
              class="cursor-pointer"
              icon="ant-design:check-outlined"
              @click="closeTitleEditor({ column, columnIndex })"
            />
          </div>
        </div>
      </template>
      <template #normal-cell-text="{ row, column, rowIndex }">
        <div class="relative">
          <span v-if="tableConfig.data[rowIndex][column.property].type === 0" class="select-none">{{
            row[column.property]
          }}</span>
          <span v-else class="select-none flex items-center justify-center gap-1">
            <span>{{ tableConfig.data[rowIndex][column.property].qData }}</span
            ><Icon
              class="!text-primary"
              :icon="
                ['tabler:letter-q', 'carbon:function-math'][
                  tableConfig.data[rowIndex][column.property].type - 1
                ]
              "
            />
          </span>
          <span class="text-gray-300 leading-4 absolute right-0 top-0 select-none">{{
            rowIndex + 1
          }}</span>
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
    <CellSetting @register="registerCellSettingModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick, toRaw } from 'vue';
  import type {
    VxeGridProps,
    VxeGridInstance,
    VxeGridEventProps,
    VxeTableDefines,
    VxeGridDefines,
  } from 'vxe-table';
  import { Button, Popover, Input, DatePicker, Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    createTableConfigContext,
    useAddCol,
    useAddRow,
    useAreaSelect,
    useTimeStrFilter,
  } from './helper';
  import type { TableConfigType } from '/#/table';
  import { cloneDeep, maxBy, merge, minBy, parseInt, remove } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import CellSetting from './CellSetting.vue';
  import Icon from '/@/components/Icon';
  import { getSingleQuotaData } from '/@/api/quota';
  import { CellTypeEnum, HeaderCellTypeEnum } from '/@/enums/tableEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formatToDate } from '/@/utils/dateUtil';
  import { TableConfigSchema, tableConfigSchemaList } from './tableSchema';
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
    align: 'center',
    columns: [],
    toolbarConfig: {
      slots: {
        buttons: 'toolbar-buttons',
      },
    },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      showIcon: false,
    },
    data: [],
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
            {
              code: 'insertRowBefore',
              name: t('table.contextmenu.insertRowBefore'),
              disabled: false,
            },
            {
              code: 'insertRowAfter',
              name: t('table.contextmenu.insertRowAfter'),
              disabled: false,
            },
            {
              code: 'insertColLeft',
              name: t('table.contextmenu.insertColLeft'),
              disabled: false,
            },
            {
              code: 'insertColRight',
              name: t('table.contextmenu.insertColRight'),
              disabled: false,
            },
            {
              code: 'removeCol',
              name: t('table.contextmenu.removeCol'),
              disabled: false,
            },
            {
              code: 'removeRow',
              name: t('table.contextmenu.removeRow'),
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
          const oldMerge = gridOptions.mergeCells?.find((cellInfo) => {
            cellInfo.col === info.col;
            cellInfo.row === info.row;
          });
          if (oldMerge) {
            oldMerge.colspan = info.colspan;
            oldMerge.rowspan = info.rowspan;
          } else {
            gridOptions.mergeCells?.push(info);
          }
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
        case 'insertRowBefore':
          addSpaceRow(rowIndex);
          break;
        case 'insertRowAfter':
          const mergedRow = $table
            .getMergeCells()
            .find((cell) => cell.row === rowIndex && cell.rowspan > 1);
          const rowNum = mergedRow ? rowIndex + mergedRow.rowspan : rowIndex + 1;
          addSpaceRow(rowNum);
          break;
        case 'insertColLeft':
          addCol(columnIndex);
          break;
        case 'insertColRight':
          const mergedCol = $table
            .getMergeCells()
            .find((cell) => cell.row === columnIndex && cell.colspan > 1);
          const colNum = mergedCol ? columnIndex + mergedCol.colspan : columnIndex + 1;
          addCol(colNum);
          break;
        case 'removeCol':
          removeCol(columnIndex);
          break;
        case 'removeRow':
          removeRow(rowIndex);
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
    timeConfig: {
      endDate: formatToDate(),
    },
    columns: [],
    mergeCells: [],
    data: [],
  });
  createTableConfigContext(tableConfig);
  const [colValue, { addCol, removeCol }] = useAddCol(xGrid, tableConfig);
  const { addSpaceRow, removeRow } = useAddRow(xGrid, tableConfig);
  const [timeStrTip, { timeStrFilter, vaildTimeStr }] = useTimeStrFilter(tableConfig);
  const { getAreaCells } = useAreaSelect(xGrid, (cells) => {
    selectedCells.value = cells;
  });
  const selectedCells = ref<any[]>([]);

  // 关掉表头编辑
  function closeTitleEditor({
    column,
    columnIndex,
  }: Partial<VxeGridDefines.HeaderCellClickEventParams>) {
    column!.slots.header = 'normal-title-text';
    const col = tableConfig.columns[columnIndex!];
    // 时间字符串为空或不合法时，表头类型自动为普通文本
    if (col.timeStr?.trim().length === 0) {
      col.headerType === HeaderCellTypeEnum.normal;
    } else {
      col.headerType === HeaderCellTypeEnum.date;
    }
    if (col.headerType === HeaderCellTypeEnum.date) {
      tableConfig.data.forEach((data) => {
        data[col.field!].type = CellTypeEnum.quota;
        if (!isNaN(parseInt(data[col.field!].val))) {
          // 自动刷新指标值
        }
      });
    }
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
    if (tableConfig.data[rowIndex!][key].type !== CellTypeEnum.normal) {
      getSingleData({ column, rowIndex, row, columnIndex });
    }
  }
  //

  // 请求单个指标数据
  async function getSingleData({
    row,
    column,
    rowIndex,
    columnIndex,
  }: Partial<VxeGridDefines.EditClosedEventParams>) {
    const cell = tableConfig.data[rowIndex!][column!.property];
    if (cell.type === CellTypeEnum.formula) {
      // 四则运算公式解析
      const str: string = row[column!.property];
      const exp = str.replace(/([a-z])(\d+)/g, function (m) {
        const [field, rowIdx] = m.match(/([a-z]+)|(\d+)/g);
        const cell = tableConfig.data[rowIdx - 1][field];
        return cell.type === 0 ? cell.val : cell.qData;
      });
      cell.qData = eval(exp);
    } else if (cell.type === CellTypeEnum.quota) {
      if (tableConfig.columns[columnIndex!].headerType !== HeaderCellTypeEnum.date) {
        createMessage.warn(t('table.headerCell.isNotDateTip'));
        return;
      }
      const id = parseInt(row[column!.property]);
      if (isNaN(id) || id.toString() !== row[column!.property]) {
        createMessage.warn(t('table.cell.idError'));
        return;
      }
      const data = await getSingleQuotaData({
        id,
        date: timeStrFilter(tableConfig.columns[columnIndex!].timeStr!),
      });
      cell.qData = (data[0]?.data[0] ?? [0, t('common.noData')])[1].toString();
    }
  }
  // 监听表头文本变化
  function titleChange(columnIndex: number, e: FocusEvent) {
    tableConfig.columns[columnIndex].title = (e.target as HTMLInputElement).value;
  }
  function timeStrChange(columnIndex: number, e: InputEvent) {
    tableConfig.columns[columnIndex].timeStr = (e.target as HTMLInputElement).value;
    tableConfig.columns[columnIndex].headerType =
      (e.target as HTMLInputElement).value.length > 0
        ? HeaderCellTypeEnum.date
        : HeaderCellTypeEnum.normal;
    vaildTimeStr(e);
  }
  function saveTable() {
    const $table = xGrid.value;
    const mergeCells = $table.getMergeCells();
    tableConfig.mergeCells = cloneDeep(toRaw(mergeCells));
    console.log(tableConfig);
  }
  const defaultTableConfig = ref<TableConfigSchema>({});
  function transfer(table: TableConfigType) {
    const gridOptions: VxeGridProps & VxeGridEventProps = {
      columns: [],
      data: [],
    };
    for (let i = 0; i < table.columns.length; i++) {
      const col = table.columns[i];
      const column = {
        field: col.field,
        title: col.title,
        editRender: {
          name: 'input',
        },
        slots: {
          header: 'normal-title-text',
          default: 'normal-cell-text',
          edit: 'normal-cell-text-editor',
        },
      };
      gridOptions.columns?.push(column);
    }
    for (let i = 0; i < table.data.length; i++) {
      const data = {};
      const origin = table.data[i];
      Object.keys(origin).forEach((key) => {
        data[key] = origin[key].val;
      });
      gridOptions.data?.push(data);
    }
    return gridOptions;
  }
  async function applyConfig() {
    gridOptions.columns = [];
    gridOptions.data = [];
    tableConfig.columns = [];
    tableConfig.data = [];
    merge(gridOptions, cloneDeep(transfer(defaultTableConfig.value)));
    merge(tableConfig, cloneDeep(defaultTableConfig.value));
    console.log(gridOptions, tableConfig);
  }
</script>

<style lang="less" scoped>
  ::v-deep(.area-cells) {
    background-color: rgb(64 158 255 / 30%);
  }

  .header-icons-box {
    height: 23.6px;
    border-left: none;
    display: flex;
    align-items: center;
    margin-left: -1px;
  }
</style>
