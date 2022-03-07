import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getColumns(): BasicColumn[] {
  return [
    {
      title: t('sys.user.userName'),
      dataIndex: 'username',
    },
    {
      title: t('sys.user.role'),
      dataIndex: 'roleList',
      slots: {
        customRender: 'roleList',
      },
    },
    {
      title: t('sys.user.mail'),
      dataIndex: 'wechatUsername',
      customRender: ({ record }) => {
        return record.wechatUsername || t('sys.user.noEmail');
      },
    },
    {
      title: t('sys.user.createTime'),
      dataIndex: 'createTime',
    },
  ];
}
