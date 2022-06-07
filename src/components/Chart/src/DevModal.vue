<template>
  <BasicModal @register="register">
    <JsonPreview />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '../../Modal';
  import { JsonPreview } from '../../CodeEditor';

  // const data

  const [register, { closeModal, setModalProps }] = useModalInner();
</script>

<style lang="less" scoped></style>
