import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { isEmpty, isNull } from '/@/utils/is';
import { Icon } from '/@/components/Icon';
import { openWindow } from '/@/utils';
import { downloadByUrl } from '/@/utils/file/download';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

const { t } = useI18n();
const { getColorScheme } = useRootSetting();
const [, , jpgColor, , pdfColor] = getColorScheme.value;

export function getColumns(): BasicColumn[] {
  return [
    {
      title: t('report.reportList.list.id'),
      dataIndex: 'id',
      width: 120,
      fixed: 'left',
    },
    {
      title: t('report.reportList.list.reportName'),
      dataIndex: 'reportName',
      className: 'report-name',
    },
    {
      title: t('report.reportList.list.reportFile'),
      dataIndex: 'reportFile',
      width: 100,
      customRender: ({ record }) => {
        const url = record.reportFile;
        if (!isNull(url) && !isEmpty(url)) {
          return (
            <Icon
              icon="file-pdf-one"
              line={2}
              color={pdfColor}
              class="cursor-pointer"
              onClick={downloadByUrl.bind(null, {
                url,
                fileName: `${record.reportName}.pdf`,
                sameSite: false,
              })}
              size={28}
              park
            />
          );
        }
      },
    },
    {
      title: t('report.reportList.list.reportScreenshot'),
      dataIndex: 'reportScreenshot',
      width: 100,
      customRender: ({ record }) => {
        const url = record.reportScreenshot;
        if (!isNull(url) && !isEmpty(url)) {
          return (
            <Icon
              icon="picture"
              class="cursor-pointer"
              color={jpgColor}
              line={2}
              onClick={openWindow.bind(null, url)}
              size={28}
              park
            />
          );
        }
      },
    },
    {
      title: t('report.reportList.list.userName'),
      dataIndex: 'userName',
    },
    {
      title: t('report.reportList.list.productName'),
      dataIndex: 'productName',
      width: 120,
    },
    {
      title: t('report.reportList.list.createTime'),
      dataIndex: 'createTime',
      width: 160,
    },
  ];
}
