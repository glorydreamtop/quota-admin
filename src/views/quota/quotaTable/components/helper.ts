import { cloneDeep } from 'lodash-es';
import { reactive, Ref } from 'vue';
import { VxeGridInstance, VxeTableDefines } from 'vxe-table';
import { tableConfigType } from '/#/table';

type useAddColMethods = [VxeTableDefines.ColumnOptions, { addCol: () => void }];

export function useAddCol(
  xGrid: Ref<VxeGridInstance>,
  tableConfig: tableConfigType
): useAddColMethods {
  const col: VxeTableDefines.ColumnOptions = reactive({
    field: '',
    title: '',
    editRender: {
      name: 'input',
    },
    slots: {
      default: 'normal-text',
      edit: 'normal-text-editor',
    },
  });
  const { getUniqueField } = useUniqueField();
  function addCol() {
    col.field = getUniqueField();
    tableConfig.columns.push(cloneDeep(col));
    const $grid = xGrid.value;
    $grid.loadColumn(tableConfig.columns);
    col.field = '';
    col.title = '';
  }
  return [col, { addCol }];
}

type useAddSpaceRowMethods = { addSpaceRow: () => void };

export function useAddRow(
  xGrid: Ref<VxeGridInstance>,
  tableConfig: tableConfigType
): useAddSpaceRowMethods {
  function addSpaceRow() {
    const row = {};
    console.log(tableConfig.columns);

    tableConfig.columns.forEach((column) => {
      row[column.field!] = '-';
    });
    const $grid = xGrid.value;
    $grid.insertAt(row, -1);
  }
  return { addSpaceRow };
}

type useUniqueFieldMethods = { getUniqueField: () => string };
/**
 * @description:生成唯一字段
 */
export function useUniqueField(): useUniqueFieldMethods {
  const usedStr: string[] = [];
  // 可用字段
  const fieldStr = 'abcdefghijklmnopqrstuvwxyz';
  function getUniqueField(): string {
    const len = usedStr.length;
    let field = '';
    if (len === 0) {
      field = 'a';
      usedStr.push(field);
    } else {
      // 最后一个已用字段
      const last = usedStr[len - 1];
      const fieldLen = last.length;
      // 最后一个已用字段的最后一个字符在fieldStr中的序号
      const index = fieldStr.indexOf(last[fieldLen - 1]);
      if (index > -1 && index < 25) {
        // field = fieldStr.charAt(index + 1);
        field = last.slice(0, fieldLen - 1) + fieldStr.charAt(index + 1);
      } else {
        field = new Array(fieldLen + 1).fill('a').join('');
      }
    }
    usedStr.push(field);
    return field;
  }
  return { getUniqueField };
}
