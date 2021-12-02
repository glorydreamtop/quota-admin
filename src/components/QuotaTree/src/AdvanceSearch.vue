<template>
  <BasicModal @register="registerModal" v-bind="modalProps">
    <div>
      <Input>
        <template #suffix>
          <Icon icon="ic:twotone-search" />
        </template>
      </Input>
      <VScroll :itemHeight="40" :items="searchResult" :height="300" :width="600">
        <template #default="{ item }">
          <div class="virtual-scroll-demo__item">{{ item.name }}</div>
        </template>
      </VScroll>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Input, ModalProps } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { VScroll } from '/@/components/VirtualScroll';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerModal] = useModalInner();
  const searchResult = ref([]);
  const modalProps: Partial<ModalProps> = reactive({
    title: t('quotaView.management.search.title'),
  });
</script>

<style lang="less" scoped></style>
