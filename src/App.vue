<template>
  <ConfigProvider :locale="getAntdLocale" size="small">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  useTitle();
</script>

<style>
  @font-face {
    font-family: '思源黑体';
    src: url('./assets/cn2.otf');

    /* src:url('https://imgs.zixinco.com/pingfang.otf') */
  }

  body {
    font-family: '思源黑体' !important;
  }
</style>
