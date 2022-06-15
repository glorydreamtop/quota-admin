<template>
  <div class="border-l-gray-300 flex w-380px overflow-hidden relative select-none" ref="container">
    <Collapse
      class="overflow-x-hidden flex-grow overflow-y-scroll h-full drawer-main"
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
    <div class="save">
      <Tooltip title="暂不开放保存模板功能，期待你体验后的宝贵建议哦^_^">
        <Button block>
          <span>{{ t('quotaView.advance.saveBtn') }}</span>
        </Button>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Divider, Collapse, Button, Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDrawer } from '../helper';
  import { ref, shallowRef } from 'vue';
  import { Model, Axis, DataSource, Formatter, Base } from './advance';

  const CollapsePanel = Collapse.Panel;
  const container = ref<HTMLElement>();
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

  useDrawer(container);
</script>

<style lang="less" scoped>
  @save-button-size: 40px;

  ::v-deep(.label) {
    @apply flex items-center gap-2;
  }

  .ant-collapse {
    background-color: transparent !important;
    padding-bottom: @save-button-size + 16px;

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
  }

  ::v-deep(.line) {
    transition: background-color 0.3s;
    width: 20px;
    min-width: 20px;
    height: 100%;
    position: relative;
    border-left: 1px solid #e8e8e8;
    order: -1;

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

  .save {
    @apply flex items-end justify-center border-t border-gray-200;
    position: absolute;
    bottom: 0;
    left: 36px;
    background-color: @white;
    width: calc(100% - 56px);
    height: @save-button-size + 16px;
    z-index: 9;

    .ant-btn {
      height: @save-button-size;
    }
  }
</style>
