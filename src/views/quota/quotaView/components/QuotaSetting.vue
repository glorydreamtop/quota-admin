<template>
  <BasicModal @register="register">
    <div class="w-full">
      <BasicForm @register="registerForm">
        <template #sourceCode="{ model, field }">
          <FormItem :name="model[field]">
            <Row type="flex" justify="space-between" align="middle">
              <Col :span="16">
                <Input v-model:value="model[field]" />
              </Col>
              <Col :span="7">
                <Tag class="" size="small" :color="getThemeColor">{{
                  t(`quota.sourceType.${model['sourceType']}`)
                }}</Tag>
              </Col>
            </Row>
          </FormItem>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  import type { SelectedQuotaItem } from './hooks';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Tag, Form, Input, Row, Col } from 'ant-design-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  const { t } = useI18n();
  const FormItem = Form.Item;
  const { getThemeColor } = useRootSetting();
  const [registerForm, { setFieldsValue, getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'name',
        label: t('page.quotaView.quotaSetting.name'),
        component: 'Input',
      },
      {
        field: 'sourceCode',
        label: t('page.quotaView.quotaSetting.sourceCode'),
        component: 'Input',
        slot: 'sourceCode',
      },
      {
        field: 'sourceType',
        label: t('page.quotaView.quotaSetting.sourceType'),
        component: 'Input',
        ifShow: false,
      },
      {
        field: 'settting.yAxisIndex',
        label: t('page.quotaView.quotaSetting.setting.yAxisIndex'),
        component: 'Select',
      },
    ],
    showActionButtonGroup: false,
    compact: true,
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
    baseColProps: {
      span: 22,
      style: {},
    },
  });

  const [register] = useModalInner(({ record }: { record: SelectedQuotaItem; index?: number }) => {
    console.log(record);

    setFieldsValue(record);
    console.log(getFieldsValue());
  });
</script>

<style lang="less" scoped></style>
