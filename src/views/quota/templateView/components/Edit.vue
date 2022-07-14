<template>
  <BarDrawer
    width="300px"
    :style="{
      top: '8rem',
      height: '400px',
      right: '2rem',
    }"
    v-bind="$attrs"
  >
    <Advance v-if="props.temp.type === 'Chart'" />
  </BarDrawer>
</template>

<script lang="ts" setup>
  import Advance from '../../quotaView/components/Advance.vue';
  import { BarDrawer } from '/@/components/Drawer';
  import { TemplateDOM } from '/#/template';

  const props = defineProps<{
    temp: TemplateDOM;
  }>();
</script>

<style lang="less" scoped></style>
