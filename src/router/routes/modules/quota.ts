import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const quota: AppRouteModule = {
  path: '/quota',
  name: 'Quota',
  component: LAYOUT,
  redirect: '/quota/quotaView',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.route.quota'),
  },
  children: [
    {
      path: 'quotaView',
      name: 'QuotaView',
      component: () => import('/@/views/quota/quotaView/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.route.quotaView'),
      },
    },
  ],
};

export default quota;
