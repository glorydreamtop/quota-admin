<template>
  <div class="border-l-gray-300 w-380px overflow-x-hidden relative select-none">
    <Collapse
      class="overflow-x-hidden overflow-y-scroll drawer-main"
      v-model:activeKey="collapseKey"
      :bordered="false"
    >
      <CollapsePanel :key="item.key" v-for="item in collapseList">
        <template #header>
          <Divider orientation="left">{{ item.title }}</Divider>
        </template>
        <Component :is="item.content" :key="item.key" />
      </CollapsePanel>
    </Collapse>
    <div class="actions bg-white">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Divider, Collapse } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { ref, shallowRef } from 'vue';
  import { Model, Axis, DataSource, Formatter, Base } from './advance';

  const CollapsePanel = Collapse.Panel;

  const { t } = useI18n();
  const collapseKey = ref('base');

  const collapseList = shallowRef([
    {
      key: 'base',
      title: t('quotaView.advance.baseSetting.title'),
      content: Base,
    },
    {
      key: 'datasourceSetting',
      title: t('quotaView.advance.datasourceSetting.title'),
      content: DataSource,
    },
    {
      key: 'rectSetting',
      title: t('quotaView.advance.rectSetting.title'),
      content: Model,
    },
    {
      key: 'valueFormatter',
      title: t('quotaView.advance.valueFormatter.title'),
      content: Formatter,
    },
    {
      key: 'axisSetting',
      title: t('quotaView.advance.axisSetting.title'),
      content: Axis,
    },
  ]);
</script>

<style lang="less" scoped>
  @actions-height: 40px;

  ::v-deep(.label) {
    @apply flex items-center gap-2;
  }

  .ant-collapse {
    background-color: transparent !important;

    &-item {
      border: none;
    }
  }

  .ant-divider {
    margin: 0;

    ::v-deep(.ant-divider-horizontal.ant-divider-with-text-left::before) {
      display: none;
    }
  }

  ::v-deep(.anticon.anticon-close) {
    vertical-align: middle;
    color: @primary-color;
    font-size: 12px;
    margin-top: -2px;
    margin-right: -4px;
  }

  // 收起配置界面用的css

  .drawer-main {
    transition: opacity 0.2s ease;
    padding-left: 20px;
    height: calc(100% - @actions-height - 16px);
    position: absolute;
    left: 0;
    right: 0;
  }

  ::v-deep(.line) {
    transition: background-color 0.3s;
    width: 20px;
    min-width: 20px;
    height: 100%;
    position: absolute;
    top: 0;

    .arrow-icon {
      color: rgba(156, 163, 175, 1) !important;
      transition: transform 0.5s;
      position: absolute;
      top: 50%;
      font-size: 20px;

      &.rotate {
        transform: rotate(180deg);
      }
    }

    &.hover-gray-shadow:hover {
      background-color: rgba(243, 244, 246, 1);
      border-left-color: rgba(243, 244, 246, 1);
    }

    &.gray-shadow {
      background-color: rgba(243, 244, 246, 1);
      border-left-color: rgba(243, 244, 246, 1);
    }
  }

  .actions {
    @apply flex items-end justify-center border-t border-gray-200;
    position: absolute;
    bottom: 0;
    left: 36px;
    width: calc(100% - 56px);
    height: @actions-height + 16px;
    z-index: 9;

    .ant-btn {
      height: @actions-height;
    }
  }
</style>
