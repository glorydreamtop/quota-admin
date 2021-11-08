import { TableConfigType } from '/#/table';
import { formatToDate } from '/@/utils/dateUtil';

interface TableConfigSchema extends TableConfigType {
  name: string;
  preview: string;
}

export const tableConfigSchemaList: TableConfigSchema[] = [
  {
    title: '',
    preview: 'http://121.4.186.36:23588/cms/downloadFile?fileKey=files/table1.png',
    name: '模板1',
    timeConfig: {
      endDate: formatToDate(),
    },
    columns: [
      { title: '分类', field: 'a', headerType: 0, timeStr: '0' },
      { title: '指标名称', field: 'b', headerType: 0, timeStr: '0' },
      { title: '前值', field: 'c', headerType: 1, timeStr: '-1' },
      { title: '最新值', field: 'd', headerType: 1, timeStr: '0' },
      { title: '变化', field: 'e', headerType: 0, timeStr: '0' },
    ],
    data: [
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
    ],
  },
  {
    title: '',
    preview: 'http://121.4.186.36:23588/cms/downloadFile?fileKey=files/table1.png',
    name: '模板1',
    timeConfig: {
      endDate: formatToDate(),
    },
    columns: [
      { title: '分类', field: 'a', headerType: 0, timeStr: '0' },
      { title: '指标名称', field: 'b', headerType: 0, timeStr: '0' },
      { title: '前值', field: 'c', headerType: 1, timeStr: '-1' },
      { title: '最新值', field: 'd', headerType: 1, timeStr: '0' },
      { title: '变化', field: 'e', headerType: 0, timeStr: '0' },
    ],
    data: [
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
      {
        a: {
          val: '-',
          type: 0,
        },
        b: {
          val: '指标名称',
          type: 0,
        },
        c: {
          val: '指标ID',
          type: 1,
        },
        d: {
          val: '指标ID',
          type: 1,
        },
        e: {
          val: '-',
          type: 2,
        },
      },
    ],
  },
  {},
];
