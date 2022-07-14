<template>
  <Drawer
    :mask="false"
    :closable="false"
    :headerStyle="{ display: 'none' }"
    :style="{
      position: 'absolute',
      width: visible ? width : '1rem',
    }"
    :class="prefixCls"
    @afterVisibleChange="afterVisibleChange"
    v-bind="$attrs"
    v-model:visible="visible"
  >
    <slot></slot>
    <div
      ref="drawerBar"
      class="line-bar"
      :style="{ [$attrs.placement === 'left' ? 'right' : 'left']: 0 }"
      @click="toggleVisible"
    >
      <Icon
        :icon="
          visible
            ? $attrs.placement === 'left'
              ? 'ant-design:left-outlined'
              : 'ant-design:right-outlined'
            : $attrs.placement === 'left'
            ? 'ant-design:right-outlined'
            : 'ant-design:left-outlined'
        "
      />
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
  import { ref, useAttrs } from 'vue';
  import { Drawer } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { useDesign } from '/@/hooks/web/useDesign';

  const width = useAttrs().width as string;

  const visible = ref(true);

  const drawerBar = ref<ElRef>();

  const { prefixCls } = useDesign('bar-drawer');

  async function toggleVisible() {
    visible.value = !visible.value;
  }
  function afterVisibleChange(visible: boolean) {
    if (visible) {
    } else {
      (drawerBar.value?.closest('.ant-drawer-content-wrapper') as HTMLDivElement).style.transform =
        'translateX(0)';
    }
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-bar-drawer';

  .@{prefix-cls}{
    .line-bar {
    position: absolute;
    top: 0;
    width: 1rem;
    height: 100%;
    display: flex;
    align-items: center;
  }

   &:hover {
      @apply bg-gray-200;
    }

    &.ant-drawer {
      transition: width 0.3s;

      & .ant-drawer-content {
        overflow: hidden;
      }
    }
  }
</style>
