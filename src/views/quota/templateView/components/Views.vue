<template>
  <div>
    <div v-for="temp in templateList" :key="temp.id">
      <component :is="compTypeMap[temp.version]" :config="temp.config" class="w-1/2" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useTemplateListContext } from '../hooks';
  import { BasicChart } from '/@/components/Chart';
  const templateList = useTemplateListContext();

  const compTypeMap = [BasicChart, BasicChart];
</script>

<style lang="less" scoped></style>
