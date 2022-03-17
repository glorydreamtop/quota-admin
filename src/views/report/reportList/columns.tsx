import { BasicColumn } from '/@/components/Table';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { isEmpty, isNull } from '/@/utils/is';
import { Icon } from '/@/components/Icon';
import { openWindow } from '/@/utils';
import { downloadByUrl } from '/@/utils/file/download';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { generatePDF } from '/@/api/report';
import { ref } from 'vue';

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
      className: 'report-id',
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
      className: 'report-pdf',
      customRender: ({ record }) => {
        const url = record.reportFile;
        if (!isNull(url) && !isEmpty(url)) {
          return (
            <>
              <Icon
                class="pdf-file"
                icon="ant-design:file-pdf-twotone"
                color={pdfColor}
                onClick={downloadByUrl.bind(null, {
                  url,
                  fileName: `${record.reportName}.pdf`,
                  sameSite: false,
                })}
                size={28}
              />
              <Tooltip title={t('report.reportList.actions.redoPDF')}>
                <div class="pdf-redo">
                  <Icon
                    icon="ant-design:redo-outlined"
                    spin={Reflect.has(makePDFTaskPool.value, record.id)}
                    size={22}
                    onClick={makePDF.bind(null, record.id)}
                  />
                </div>
              </Tooltip>
            </>
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
            <div class="text-center w-3/5 mx-auto cursor-pointer">
              <Icon
                icon="ant-design:file-image-twotone"
                color={jpgColor}
                onClick={openWindow.bind(null, url)}
                size={28}
              />
            </div>
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

const makePDFTaskPool = ref<{ [id: number]: Symbol }>({});

async function makePDF(id: number) {
  if (makePDFTaskPool.value[id]) return;
  try {
    makePDFTaskPool.value[id] = Symbol();
    await generatePDF({ id });
  } catch {
  } finally {
    Reflect.deleteProperty(makePDFTaskPool.value, id);
  }
}
