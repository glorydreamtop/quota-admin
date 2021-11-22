<template>
  <Popover placement="bottom" trigger="click" @visibleChange="updateConfig">
    <Button size="small">{{ t('templateView.toolbar.paperSize.btn') }}</Button>
    <template #content>
      <div class="flex items-start gap-4">
        <div>
          <div class="flex justify-center w-full">
            <Input size="small" suffix="px" v-model:value="pageConfig.paddingTop" />
          </div>
          <div class="flex items-center justify-center w-full gap-1 my-1">
            <Input size="small" suffix="px" v-model:value="pageConfig.paddingLeft" />
            <div
              :class="[
                'mini-page border border-gray-300 shadow shadow-gray-700',
                pageConfig.horizontal ? 'horizontal' : 'vertical',
              ]"
              :style="miniPageStyle"
            >
              <span
                class="cursor-pointer"
                @click="pageConfig.horizontal = !pageConfig.horizontal"
                >{{
                  t(
                    `templateView.toolbar.paperSize.${
                      pageConfig.horizontal ? 'horizontal' : 'vertical'
                    }`,
                  )
                }}</span
              >
            </div>
            <Input size="small" suffix="px" v-model:value="pageConfig.paddingRight" />
          </div>
          <div class="flex justify-center w-full">
            <Input size="small" suffix="px" v-model:value="pageConfig.paddingBottom" />
          </div>
        </div>
        <div class="flex flex-col gap-1 children:flex children:items-center children:gap-1">
          <div>
            <RadioGroup button-style="solid" size="small" v-model:value="pageConfig.pagination">
              <RadioButton :value="true">{{ t('templateView.toolbar.pagination.t') }}</RadioButton>
              <RadioButton :value="false">{{ t('templateView.toolbar.pagination.f') }}</RadioButton>
            </RadioGroup>
            <Tooltip>
              <template #title>
                {{ t('templateView.toolbar.paperSize.tip') }}
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </div>
          <div>
            <Switch size="small" v-model:checked="pageConfig.header.show" />
            <span>{{ t('templateView.toolbar.paperSize.showHeader') }}</span>
          </div>
          <div>
            <Switch size="small" v-model:checked="pageConfig.footer.show" />
            <span>{{ t('templateView.toolbar.paperSize.showFooter') }}</span>
          </div>
          <div>
            <Switch size="small" v-model:checked="pageConfig.footer.pageNum" />
            <span>{{ t('templateView.toolbar.paperSize.showPageNum') }}</span>
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script lang="ts" setup>
  import { computed, ComputedRef, CSSProperties, reactive, toRaw } from 'vue';
  import { Switch, Popover, Button, Tooltip, Radio, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { usePageSettingContext } from '../hooks';

  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const { t } = useI18n();

  // 页面设置
  const pageSetting = usePageSettingContext();
  const pageConfig = reactive({
    ...cloneDeep(toRaw(pageSetting)),
  });
  // 页面模型的样式
  const miniPageStyle: ComputedRef<CSSProperties> = computed(() => {
    return {
      padding: `${pageConfig.paddingTop / 10}px ${pageConfig.paddingRight / 10}px ${
        pageConfig.paddingBottom / 10
      }px ${pageConfig.paddingLeft / 10}px`,
    };
  });
  function updateConfig() {
    Object.assign(pageSetting, cloneDeep(pageConfig));
  }
</script>

<style lang="less" scoped>
  .mini-page {
    background-color: lighten(@primary-color, 35%);
    background-clip: content-box;
    color: @primary-color;
    display: flex;
    align-items: center;
    justify-content: center;

    &.vertical {
      width: 3.5rem;
      height: 4.95rem;
    }

    &.horizontal {
      width: 4.95rem;
      height: 3.5rem;
    }
  }

  ::v-deep(.ant-input-affix-wrapper) {
    width: auto !important;

    .ant-input {
      width: 2em !important;
      text-align: center;
    }
  }
</style>
