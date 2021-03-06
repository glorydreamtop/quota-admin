import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
// import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { setupAegisSDK } from '/@/utils/lib/aegis';
import { registerGlobComp } from '/@/components/registerGlobComp';
import { setupVxeTable } from './utils/lib/vxetable';
import { setupAutoAnimate } from './utils/lib/animate';

async function bootstrap() {
  const app = createApp(App);
  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  // setupErrorHandle(app);

  setupVxeTable(app);

  setupAegisSDK(app);

  setupAutoAnimate(app);

  app.mount('#app');
  return true;
}

bootstrap();
