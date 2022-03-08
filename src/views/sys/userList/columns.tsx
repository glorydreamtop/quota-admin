import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { isNull } from '/@/utils/is';

const { t } = useI18n();

export function getColumns(): BasicColumn[] {
  return [
    {
      title: t('sys.user.userName'),
      dataIndex: 'username',
      width: 160,
      edit: true,
      editComponent: 'Input',
    },
    {
      title: t('sys.user.role'),
      dataIndex: 'roleList',
      width: 300,
      slots: {
        customRender: 'roleList',
      },
    },
    {
      title: t('sys.user.mail'),
      dataIndex: 'wechatUsername',
      width: 250,
      edit: true,
      editComponent: 'Input',
      customRender: ({ record }) => {
        const str = record.wechatUsername;
        const vaild = !isNull(str);
        return vaild ? (
          <a href={`mailto:${record.wechatUsername}`}>{record.wechatUsername}</a>
        ) : (
          <span class="text-gray-400">{t('sys.user.noEmail')}</span>
        );
      },
    },
    {
      title: t('sys.user.createTime'),
      dataIndex: 'createTime',
      width: 250,
    },
  ];
}
