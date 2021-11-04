<template>
  <div class="flex items-center gap-4 h-14 p-2 flex-wrap border hover:shadow mb-2 toolbar bg-white">
    <Popover
      placement="bottom"
      trigger="click"
      @visibleChange="updateConfig('pageSetting', $event)"
    >
      <Button size="small">{{ t('templateView.toolbar.paperSize.btn') }}</Button>
      <template #content>
        <div class="flex gap-1 items-center flex-col">
          <span>{{ t('templateView.toolbar.paperSize.paddingTop') }}</span>
          <Input
            :disabled="!pageConfig.pagination"
            size="small"
            suffix="px"
            v-model:value="pageConfig.paddingTop"
            class="!w-16 text-center"
          />
          <span>{{ t('templateView.toolbar.paperSize.paddingBottom') }}</span>
          <Input
            :disabled="!pageConfig.pagination"
            size="small"
            suffix="px"
            v-model:value="pageConfig.paddingBottom"
            class="!w-16 text-center"
          />
          <span>{{ t('templateView.toolbar.paperSize.paddingLeft') }}</span>
          <Input
            size="small"
            suffix="px"
            v-model:value="pageConfig.paddingLeft"
            class="!w-16 text-center"
          />
          <span>{{ t('templateView.toolbar.paperSize.paddingRight') }}</span>
          <Input
            size="small"
            suffix="px"
            v-model:value="pageConfig.paddingRight"
            class="!w-16 text-center"
          />
          <Tooltip>
            <template #title>
              {{ t('templateView.toolbar.paperSize.tip') }}
            </template>
            <Icon icon="ant-design:question-circle-outlined" />
          </Tooltip>
        </div>
      </template>
    </Popover>

    <Popover placement="bottom" trigger="click" @visibleChange="updateConfig('baseSize', $event)">
      <Button size="small">{{ t('templateView.toolbar.baseSize') }}</Button>
      <template #content>
        <div class="flex gap-1 items-center">
          <Icon icon="ant-design:column-width-outlined" />
          <Input size="small" v-model:value="pageConfig.baseSize.width" class="!w-16 text-center" />
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
        <Button size="small" @click="onClick">{{ t('templateView.toolbar.insertImg.btn') }}</Button>
      </template>
    </BasicUpload>
    <Button size="small" @click="dispatch('remove')">{{
      t('templateView.toolbar.removeNode.btn')
    }}</Button>
    <div class="ml-auto flex gap-1 items-center">
      <Switch
        :checked-children="t('templateView.toolbar.pagination.t')"
        :un-checked-children="t('templateView.toolbar.pagination.f')"
        v-model:checked="pageConfig.pagination"
        @change="dispatch('pagination')"
      />
      <Button size="small" type="primary" :loading="saveImgLoading" @click="dispatch('saveImg')">{{
        t('templateView.toolbar.save.img')
      }}</Button>
      <Button size="small" disabled @click="dispatch('savePdf')">{{
        t('templateView.toolbar.save.pdf')
      }}</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DatePicker, Button, Switch, Input, Tooltip, Popover } from 'ant-design-vue';
  import { cloneDeep, remove } from 'lodash-es';
  import { reactive, ref, toRaw, watch } from 'vue';
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
  import { ImgConfig } from '/#/template';

  const RangePicker = DatePicker.RangePicker;
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
    ...toRaw(pageSetting),
  });
  watch(
    () => pageConfig.pagination,
    (v) => {
      if (v) {
        pageConfig.paddingTop = 32;
        pageConfig.paddingBottom = 32;
      } else {
        pageConfig.paddingTop = 0;
        pageConfig.paddingBottom = 0;
      }
    }
  );
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
        Object.assign(pageSetting, pageConfig);
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
        saveImgLoading.value = true;
        const blobObj = await dom2imgFile({
          dom: document.getElementById('page-box')!,
          type: fileType.BLOB,
          scale: 4,
        });
        downloadByData(blobObj, 'report.jpg');
        saveImgLoading.value = false;
        break;
      case 'pagination':
        pageSetting.pagination = pageConfig.pagination;
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
</style>
