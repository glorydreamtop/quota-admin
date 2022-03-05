import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export function configAutoCompontentPlugin() {
  return Components({
    dts: true,
    resolvers: [
      AntDesignVueResolver({
        importStyle: 'less',
      }),
    ],
  });
}
