import type { App } from 'vue';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
  Input,
  Layout,
} from 'ant-design-vue';
import { Icon } from '/@/components/Icon';

const compList = [AntButton.Group, Icon];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app.use(Input).use(Button).use(Layout);
}
