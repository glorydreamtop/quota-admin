import { cloneDeep, remove } from 'lodash-es';
import { CSSProperties, reactive, ref, Ref } from 'vue';
import { VxeGridInstance, VxeTableDefines } from 'vxe-table';
import { tableConfigType } from '/#/table';
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';

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
      header: 'normal-title-text',
      default: 'normal-cell-text',
      edit: 'normal-cell-text-editor',
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
interface cellPosition {
  col: number;
  row: number;
}
export function useAreaSelect(
  xGrid: Ref<VxeGridInstance>,
  onAreaSelect: (cell: cellPosition[]) => void
) {
  const areaCells = ref<cellPosition[]>([]);
  onMountedOrActivated(() => {
    const tableDOM = xGrid.value.$el as HTMLElement;
    const tbody = tableDOM.getElementsByTagName('tbody')[0];
    const areaSelectorDOM = document.createElement('div');
    Object.assign(areaSelectorDOM.style, {
      position: 'absolute',
      zIndex: 999,
      backgroundColor: 'rgba(64,158,255,0.4)',
      pointerEvents: 'none',
    } as CSSProperties);
    const showAreaSelector = ref(false);
    const rectInfo = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      toRight: true,
      toBottom: true,
    };
    // 判断元素重叠
    function isOverlap(node: HTMLElement) {
      const rect1 = node.getBoundingClientRect();
      const rect2 = areaSelectorDOM.getBoundingClientRect();
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    }
    // 鼠标按下开始绘制选区
    function mousedownListener(e: MouseEvent) {
      if (e.button !== 0) return;
      remove(areaCells.value, (_) => _);
      rectInfo.startX = e.clientX;
      rectInfo.startY = e.clientY;
      rectInfo.endX = e.clientX;
      rectInfo.endY = e.clientY;
      showAreaSelector.value = true;
      areaSelectorDOM.style.left = `${rectInfo.startX}px`;
      areaSelectorDOM.style.top = `${rectInfo.startY}px`;
      Object.assign(areaSelectorDOM.style, {
        left: `${rectInfo.startX}px`,
        top: `${rectInfo.startY}px`,
        width: `0px`,
        height: `0px`,
      });
      document.body.appendChild(areaSelectorDOM);
      tbody.addEventListener('mousemove', mousemoveListener);
      tbody.addEventListener('mouseup', mouseupListener);
    }
    // 鼠标移动开始缩放选区
    function mousemoveListener(e: MouseEvent) {
      rectInfo.endX = e.clientX;
      rectInfo.endY = e.clientY;

      Object.assign(areaSelectorDOM.style, {
        left: `${Math.min(rectInfo.startX, rectInfo.endX)}px`,
        top: `${Math.min(rectInfo.startY, rectInfo.endY)}px`,
        width: `${Math.abs(rectInfo.endX - rectInfo.startX)}px`,
        height: `${Math.abs(rectInfo.endY - rectInfo.startY)}px`,
      });
    }
    // 鼠标弹起结束选取
    function mouseupListener() {
      tbody.removeEventListener('mousemove', mousemoveListener);
      tbody.removeEventListener('mouseup', mouseupListener);
      showAreaSelector.value = false;
      tbody.querySelectorAll('td').forEach((td) => {
        if (isOverlap(td)) {
          const col = xGrid.value.getColumnNode(td)!.index;
          const row = xGrid.value.getRowNode(td.parentNode!)!.index;
          areaCells.value.push({ col, row });
        }
      });
      document.body.removeChild(areaSelectorDOM);
      onAreaSelect(areaCells.value);
    }
    tbody.addEventListener('mousedown', mousedownListener);
  });
  function getAreaCells() {
    return areaCells;
  }
  function setAreaCells(cells: cellPosition[]) {
    remove(areaCells.value, (_) => _);
    areaCells.value.push(...cells);
  }
  return { getAreaCells, setAreaCells };
}
