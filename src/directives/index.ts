/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';
import { setupRepeatDirective } from './repeatClick';
import { setupResizeDirective } from './resizeable';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
  setupRepeatDirective(app);
  setupResizeDirective(app);
}
