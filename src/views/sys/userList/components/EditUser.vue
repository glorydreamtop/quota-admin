<template>
  <BasicModal @register="registerModal">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useForm, BasicForm } from '/@/components/Form';
  import { useModalInner, BasicModal } from '/@/components/Modal';
  import { getSchemas } from './schema';

  const [registerModal] = useModalInner();
  const [registerForm] = useForm({
    schemas: getSchemas(),
  });
</script>

<style lang="less" scoped></style>
