/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigSrc = () => {
    return `${path || '/'}config/${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
            {
              tag: 'script',
              attrs: {
                src: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.5.1/highlight.min.js',
              },
            },
            {
              tag: 'link',
              attrs: {
                href: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.5.1/styles/lioshi.min.css',
                rel: 'stylesheet',
              },
            },
            {
              tag: 'script',
              attrs: {
                src: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.5.1/languages/javascript.min.js',
              },
            },
            {
              tag: 'script',
              attrs: {
                src: 'https://cdn.bootcdn.net/ajax/libs/tinymce/5.10.3/tinymce.min.js',
              },
            },
          ]
        : [],
    },
  });
  return htmlPlugin;
}
