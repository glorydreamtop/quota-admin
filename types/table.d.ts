import { VxeTableDefines, VxeTablePropTypes } from 'vxe-table';

export enum headerCellType {
  normal,
  date,
}

export interface tableConfigType {
  title: string;
  columns: (VxeTableDefines.ColumnOptions & { headerType: headerCellType })[];
  mergeCells?: VxeTablePropTypes.MergeCell[];
}
