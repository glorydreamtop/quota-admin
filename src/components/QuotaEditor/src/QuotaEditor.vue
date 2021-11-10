<template>
  <BasicModal v-bind="modalProps" @register="registerModal">
    <div> <BasicForm @register="registerForm" /> </div
  ></BasicModal>
</template>

<script lang="ts" setup>
  import { ModalProps } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useForm, BasicForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { schemas } from './schema';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { QuotaItem } from '/#/quota';
  const { t } = useI18n();
  const [registerModal, {}] = useModalInner(({ categoryId }: QuotaItem) => {
    setFieldsValue({ categoryId });
  });

  const [registerForm, { setFieldsValue }] = useForm({
    schemas: schemas,
    showAdvancedButton: true,
    autoAdvancedLine: 5,
    alwaysShowLines: 5,
    showResetButton: false,
    showSubmitButton: false,
  });

  const modalProps: Partial<ModalProps> = reactive({
    title: t('quota.quotaEditorModal.title'),
  });
</script>

<style lang="less" scoped></style>
