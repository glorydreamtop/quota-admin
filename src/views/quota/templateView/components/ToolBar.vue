<template>
  <div class="flex items-center justify-between border p-2 hover:shadow mb-2 toolbar bg-white">
    <div class="flex flex-wrap flex-grow gap-1">
      <Popover
        placement="bottom"
        trigger="click"
        @visibleChange="updateConfig('pageSetting', $event)"
      >
        <Button size="small">{{ t('templateView.toolbar.paperSize.btn') }}</Button>
        <template #content>
          <div class="flex items-start gap-4">
            <div>
              <div class="flex w-full justify-center">
                <Input size="small" suffix="px" v-model:value="pageConfig.paddingTop" />
              </div>
              <div class="flex gap-1 my-1 items-center w-full justify-center">
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
              <div class="flex w-full justify-center">
                <Input size="small" suffix="px" v-model:value="pageConfig.paddingBottom" />
              </div>
            </div>
            <div class="flex flex-col gap-1 children:flex children:items-center children:gap-1">
              <div>
                <RadioGroup button-style="solid" size="small" v-model:value="pageConfig.pagination">
                  <RadioButton :value="true">{{
                    t('templateView.toolbar.pagination.t')
                  }}</RadioButton>
                  <RadioButton :value="false">{{
                    t('templateView.toolbar.pagination.f')
                  }}</RadioButton>
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

      <Popover placement="bottom" trigger="click" @visibleChange="updateConfig('baseSize', $event)">
        <Button size="small">{{ t('templateView.toolbar.baseSize') }}</Button>
        <template #content>
          <div class="flex gap-1 items-center">
            <Icon icon="ant-design:column-width-outlined" />
            <Input
              size="small"
              v-model:value="pageConfig.baseSize.width"
              class="!w-16 text-center"
            />
            <Icon icon="ant-design:column-height-outlined" />
            <Input
              size="small"
              v-model:value="pageConfig.baseSize.height"
              class="!w-16 text-center"
            />
            <Tooltip>
              <template #title>
                {{ t('templateView.toolbar.baseSizeTip') }}
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </div>
        </template>
      </Popover>
      <Popover placement="bottom" trigger="click" @visibleChange="updateConfig('date', $event)">
        <Button size="small">{{ t('templateView.toolbar.sameTimeRange') }}</Button>
        <template #content>
          <RangePicker
            size="small"
            class="w-200px"
            value-format="YYYY-MM-DD"
            v-model:value="pageConfig.date"
          />
        </template>
      </Popover>
      <Popover
        placement="bottom"
        trigger="click"
        @visibleChange="updateConfig('showLastest', $event)"
      >
        <Button size="small">{{ t('templateView.toolbar.showLastest.btn') }}</Button>
        <template #content>
          <Switch
            :checked-children="t('templateView.toolbar.showLastest.t')"
            :un-checked-children="t('templateView.toolbar.showLastest.f')"
            v-model:checked="pageConfig.showLastest"
          />
        </template>
      </Popover>
      <Button size="small" @click="dispatch('insertText')">{{
        t('templateView.toolbar.insertText.btn')
      }}</Button>
      <BasicUpload
        :maxSize="6"
        :maxNumber="12"
        @change="uploadFileChange"
        :api="uploadApi"
        size="small"
        v-model:value="imgList"
      >
        <template #btn="{ onClick }">
          <Button size="small" @click="onClick">{{
            t('templateView.toolbar.insertImg.btn')
          }}</Button>
        </template>
      </BasicUpload>
      <Button size="small" @click="dispatch('remove')">{{
        t('templateView.toolbar.removeNode.btn')
      }}</Button>
    </div>
    <!-- <div class="flex justify-between items-center gap-1">
      <Button
        :disabled="pageSetting.pagination"
        size="small"
        type="primary"
        :loading="saveImgLoading"
        @click="dispatch('saveImg')"
        >{{ t('templateView.toolbar.save.img') }}</Button
      >
      <Button
        size="small"
        :disabled="!pageSetting.pagination"
        type="primary"
        @click="dispatch('savePdf')"
        >{{ t('templateView.toolbar.save.pdf') }}</Button
      >
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { DatePicker, Button, Switch, Input, Tooltip, Popover, Radio } from 'ant-design-vue';
  import { cloneDeep, remove } from 'lodash-es';
  import { computed, ComputedRef, CSSProperties, reactive, ref, toRaw, nextTick } from 'vue';
  import { useUniqueField } from '../../quotaTable/components/helper';
  import {
    textTemplate,
    imgTemplate,
    useSelectTemplateListContext,
    useTemplateListContext,
    useUniqIdContext,
    insertDOM,
    usePageSettingContext,
  } from '../hooks';
  import type { chartConfigType } from '/#/chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { yearsAgo, formatToDate } from '/@/utils/dateUtil';
  import { dom2imgFile, fileType } from '/@/utils/domUtils';
  import { downloadByData } from '/@/utils/file/download';
  import { BasicUpload } from '/@/components/Upload';
  import { uploadApi } from '/@/api/sys/upload';
  import type { ImgConfig } from '/#/template';

  const RangePicker = DatePicker.RangePicker;
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const { t } = useI18n();
  const selectedTemplateList = useSelectTemplateListContext();
  const templateList = useTemplateListContext();
  const usedUniqId = useUniqIdContext();
  const { getUniqueField } = useUniqueField(usedUniqId.value);
  const pageSetting = usePageSettingContext();
  const pageConfig = reactive({
    date: [yearsAgo(5), formatToDate()],
    sameTimeRange: false,
    showLastest: false,
    baseSize: {
      width: '50%',
      height: '300',
    },
    ...cloneDeep(toRaw(pageSetting)),
  });
  const miniPageStyle: ComputedRef<CSSProperties> = computed(() => {
    return {
      padding: `${pageConfig.paddingTop / 10}px ${pageConfig.paddingRight / 10}px ${
        pageConfig.paddingBottom / 10
      }px ${pageConfig.paddingLeft / 10}px`,
    };
  });
  const saveImgLoading = ref(false);
  function updateConfig(configName: string, visible: boolean) {
    if (visible) return;
    const param = pageConfig[configName];
    switch (configName) {
      case 'baseSize':
        let { width, height } = param;
        if (/\%/i.test(width)) {
          width = width;
        } else if (parseInt(width).toString() === width) {
          width = `${width}px`;
        } else {
          width = '33.3%';
        }
        if (parseInt(height).toString() === height) {
          height = `${height}px`;
        } else {
          height = '300px';
        }
        selectedTemplateList.value.forEach((temp) => {
          temp.pageConfig.width = width;
          temp.pageConfig.height = height;
        });
        break;
      case 'date':
        selectedTemplateList.value.forEach((temp) => {
          if (temp.version! < 3) {
            [
              (temp.config as chartConfigType).timeConfig.startDate,
              (temp.config as chartConfigType).timeConfig.endDate,
            ] = [...param];
          }
        });
        break;
      case 'showLastest':
        selectedTemplateList.value.forEach((temp) => {
          if (temp.version! < 3) {
            (temp.config as chartConfigType).showLastest = param;
          }
        });
        break;
      case 'pageSetting':
        Object.assign(pageSetting, cloneDeep(pageConfig));
        break;
      default:
        break;
    }
  }
  async function dispatch(eventName: string) {
    switch (eventName) {
      case 'insertText':
        const text = cloneDeep(textTemplate);
        text.uniqId = getUniqueField();
        insertDOM(templateList, selectedTemplateList, text);
        break;
      case 'remove':
        remove(templateList.value, (t) => {
          if (t.type === 'Img') {
            remove(imgList.value, (url) => url === t.config.url);
          }
          return selectedTemplateList.value.some((temp) => t.uniqId === temp.uniqId);
        });
        break;
      case 'saveImg':
        selectedTemplateList.value = [];
        saveImgLoading.value = true;
        await nextTick();
        const blobObj = await dom2imgFile({
          dom: document.getElementById('page-box')!.getElementsByClassName('pages')[0]!,
          type: fileType.BLOB,
          scale: 4,
        });
        downloadByData(blobObj, 'report.jpg');
        saveImgLoading.value = false;
        break;
      case 'savePdf':
        break;
      case 'header':
        pageSetting.header = pageConfig.header;
      default:
        break;
    }
  }
  const imgList = ref<string[]>([]);
  function uploadFileChange(fileList: string[]) {
    fileList.forEach((url) => {
      const img = cloneDeep(imgTemplate);
      (img.config as ImgConfig).url = url;
      img.uniqId = getUniqueField();
      insertDOM(templateList, selectedTemplateList, img);
    });
  }
</script>

<style lang="less" scoped>
  .toolbar {
    transition-property: transform box-shadow;
    transition-duration: 0.2s;

    &:hover {
      transform: scale(1.001);
    }
  }

  ::v-deep(.ant-input-affix-wrapper) {
    width: auto !important;

    .ant-input {
      width: 2em !important;
      text-align: center;
    }
  }

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
</style>
