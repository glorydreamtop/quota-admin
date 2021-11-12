<template>
  <BasicModal v-bind="modalProps" @register="registerModal" @ok="updateQuotaInfo" @cancel="cancel">
    <div class="border-dashed border-2 w-40 h-10"> </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { ModalProps } from 'ant-design-vue';
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const loading = ref(false);
  const [registerModal, { closeModal }] = useModalInner(() => {});

  const modalProps: Partial<ModalProps> = reactive({
    title: t('quota.actions.importQuota'),
  });
  async function updateQuotaInfo() {
    try {
      cancel();
    } catch (error) {
      createMessage.error(error);
    } finally {
      loading.value = false;
    }
  }
  async function cancel() {
    closeModal();
  }
</script>

<style lang="less" scoped></style>
