import { VxeTableDefines, VxeTablePropTypes } from 'vxe-table';

export enum headerCellType {
  normal,
  date,
}

export interface TableConfigType {
  title: string;
  columns: (VxeTableDefines.ColumnOptions & { headerType: headerCellType })[];
  mergeCells?: VxeTablePropTypes.MergeCell[];
}
