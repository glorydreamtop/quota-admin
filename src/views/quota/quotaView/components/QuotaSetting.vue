<template>
  <BasicModal @register="register" @ok="ok" @cancel="close">
    <div class="w-full flex flex-col gap-4 children:flex children:gap-2 children:items-center">
      <div class="">
        <span class="min-w-4em">{{ t('quotaView.quotaSetting.name') }}</span>
        <Input class="!w-80" v-model:value="quotaSetting.name" />
      </div>
      <div v-show="quotaSetting.sourceType !== 'formula'">
        <span class="min-w-4em">{{ t('quotaView.quotaSetting.sourceCode') }}</span>
        <Input class="!w-80" v-model:value="quotaSetting.sourceCode">
          <template #suffix>
            <span class="text-primary">{{
              t(`quota.sourceType.${quotaSetting['sourceType']}`)
            }}</span>
          </template>
        </Input>
      </div>
      <template v-if="quotaSetting.sourceType === 'formula'">
        <div>
          <span class="min-w-4em">{{ t('quotaView.quotaSetting.formula') }}</span>
          <Editor
            class="w-80"
            v-model:formula="quotaSetting.sourceCode"
            @updateEndOffset="updateEndOffset"
          />
        </div>
        <div>
          <span>{{ t('quotaView.quotaSetting.autofill') }}</span>
          <div class="flex flex-wrap items-center gap-1 w-74">
            <span
              v-for="item in quotaList"
              :key="item.id"
              class="
                rounded-sm
                overflow-hidden
                cursor-pointer
                bg-purple-400
                text-white
                px-1
                relative
              "
            >
              <span @click="fillFormula(item, 'id')">{{ item.shortName || item.name }}</span>
              <span
                v-show="item.sourceType === 'formula'"
                @click="fillFormula(item, 'sourceCode')"
                class="
                  absolute
                  -left-1/5
                  top-0
                  w-7/10
                  bg-gray-100
                  h-full
                  opacity-45
                  skew-x-165
                  transform
                "
              ></span>
            </span>
            <Tooltip :title="t('quotaView.quotaSetting.autofillTip')">
              <Icon class="!text-gray-500" icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </div>
        </div>
      </template>

      <div>
        <span class="min-w-4em">{{ t('quotaView.quotaSetting.setting.yAxisIndex') }}</span>
        <Select
          class="w-80"
          v-model:value="quotaSetting.setting.yAxisIndex"
          :options="yAxisIndexList"
        />
      </div>
      <div>
        <span class="min-w-4em">{{ t('quotaView.quotaSetting.setting.type') }}</span>
        <Select class="w-80" v-model:value="quotaSetting.setting.type">
          <Option v-for="seriesType in seriesTypeList" :key="seriesType.value">
            <div>
              <Icon :color="getThemeColor" :icon="seriesType.icon" />
              <span class="ml-2">{{ seriesType.label }}</span>
            </div>
          </Option>
        </Select>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { SelectedQuotaItem, useSelectedQuotaListContext } from './hooks';
  import { useChartConfigContext } from './hooks';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Input, Select, Tooltip } from 'ant-design-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { computed, reactive, ref, nextTick } from 'vue';
  import Icon from '/@/components/Icon';
  import { echartSeriesTypeEnum } from '/@/enums/chartEnum';
  import { SourceTypeEnum } from '/@/enums/quotaEnum';
  import { cloneDeep } from 'lodash-es';
  import { Editor } from '/@/components/FormulaEditor';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { QuotaItem } from '/#/quota';

  const Option = Select.Option;
  const { t } = useI18n();
  const { getThemeColor } = useRootSetting();
  const chartConfig = useChartConfigContext();
  const quotaList = useSelectedQuotaListContext();
  const quotaIndex = ref(0);
  const defaultSetting = {
    name: '',
    sourceCode: '',
    sourceType: SourceTypeEnum.formula,
    setting: {
      yAxisIndex: 0,
      type: echartSeriesTypeEnum.line,
      lineWidth: 2,
    },
  };
  const { createMessage } = useMessage();
  const quotaSetting: Pick<SelectedQuotaItem, 'name' | 'sourceCode' | 'sourceType' | 'setting'> =
    reactive(cloneDeep(defaultSetting));
  // Y轴选择器
  const yAxisIndexList = computed(() => {
    return chartConfig.yAxis.map((item, index) => {
      return {
        label: `${index + 1}/${t('quotaView.advance.axisSetting.yAxis.min')}[${
          item.min || t('common.auto')
        }]-${t('quotaView.advance.axisSetting.yAxis.max')}[${
          item.max || t('common.auto')
        }]/${t('quotaView.advance.axisSetting.yAxis.' + item.position)}`,
        value: index,
      };
    });
  });
  const seriesTypeList = ref([
    {
      label: t('quotaView.seriesType.line'),
      value: echartSeriesTypeEnum.line,
      icon: 'carbon:chart-line',
    },
    {
      label: t('quotaView.seriesType.bar'),
      value: echartSeriesTypeEnum.bar,
      icon: 'carbon:chart-column',
    },
    {
      label: t('quotaView.seriesType.smoothLine'),
      value: echartSeriesTypeEnum.smoothLine,
      icon: 'carbon:chart-line-smooth',
    },
    {
      label: t('quotaView.seriesType.scatter'),
      value: echartSeriesTypeEnum.scatter,
      icon: 'carbon:chart-scatter',
    },
    {
      label: t('quotaView.seriesType.area'),
      value: echartSeriesTypeEnum.area,
      icon: 'mdi:chart-areaspline-variant',
    },
  ]);
  const [register, { closeModal }] = useModalInner(
    ({ record, index }: { record: SelectedQuotaItem; index?: number }) => {
      quotaIndex.value = index ?? quotaList.value.length;
      Object.assign(quotaSetting, record);
    },
  );
  function close() {
    for (const key in quotaSetting) {
      quotaSetting[key] = defaultSetting[key];
    }
    closeModal();
  }
  function ok() {
    if(quotaSetting.name.trim().length===0){
      createMessage.warn(t('quotaView.quotaSetting.noName'))
      return;
    }
    if (quotaIndex.value === quotaList.value.length) {
      quotaList.value.push(cloneDeep(quotaSetting) as SelectedQuotaItem);
    } else {
      Object.assign(quotaList.value[quotaIndex.value], quotaSetting);
    }
    close();
  }
  const endOffset = ref(0);
  function updateEndOffset(v) {
    endOffset.value = v;
  }
  async function fillFormula(item: QuotaItem, key: 'id' | 'sourceCode') {
    let str = '';
    if (key === 'id') {
      if (!!item.id) {
        str = `idx(${item.id})`;
      } else {
        createMessage.warn(t('quotaView.quotaSetting.formulaWithoutId'));
      }
    } else {
      str = item.sourceCode;
    }
    quotaSetting.sourceCode =
      quotaSetting.sourceCode.slice(0, endOffset.value) +
      str +
      quotaSetting.sourceCode.slice(endOffset.value);
    await nextTick();
    const dom = document.getElementsByClassName('formula-editor')[0] as HTMLInputElement;
    dom.focus();
    const focusDOM = window.getSelection()!.getRangeAt(0)!;
    // 设置光标位置
    focusDOM.setStart(dom.childNodes[0], endOffset.value + str.length);
    focusDOM.collapse(true);
  }
</script>

<style lang="less" scoped></style>
