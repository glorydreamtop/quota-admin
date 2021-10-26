import { VxeTableDefines, VxeTablePropTypes } from 'vxe-table';
import { CellTypeEnum, HeaderCellTypeEnum } from '/@/enums/tableEnum';

interface TableCol extends VxeTableDefines.ColumnOptions {
  headerType: HeaderCellTypeEnum;
}

interface TableCellData {
  type: CellTypeEnum;
  val: string;
  qData?: string;
}

interface RowData {
  [key: string]: TableCellData;
}

export interface TableConfigType {
  title: string;
  columns: TableCol[];
  mergeCells?: VxeTablePropTypes.MergeCell[];
  data: RowData[];
}
