<template>
  <div class="flex gap-4 bg-white p-4 shadow-md shadow-primary-50">
    <Button type="primary" @click="createUser">
      <template #icon>
        <Icon icon="plus" park />
      </template>
      <span>{{ t('common.createText') }}</span>
    </Button>
    <span class="flex items-center gap-1">
      <span class="label">{{ t('sys.user.userName') }}</span>
      <Input allow-clear class="max-w-40" v-model:value="filterOptions.username" />
    </span>
    <span class="flex items-center gap-1">
      <span class="label">{{ t('sys.user.role') }}</span>
      <Select
        class="!w-40"
        v-model:value="filterOptions.roleId"
        :options="roleList"
        :loading="loadingState.roleSelect"
        option-label-prop="label"
        allow-clear
      />
    </span>
    <span class="flex gap-1 items-center">
      <Button @click="filterUserList" type="primary">
        <template #icon>
          <Icon icon="find" park />
        </template>
        <span>{{ t('common.queryText') }}</span>
      </Button>
      <Button @click="resetFilter">{{ t('common.resetText') }}</Button>
    </span>
    <EditUser @register="registerUserModal" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Button, Select, Input } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import EditUser from './EditUser.vue';

  const emits = defineEmits<{
    (event: 'updateUserList', options: typeof filterOptions): void;
  }>();

  const { t } = useI18n();

  const loadingState = reactive({
    roleSelect: false,
    userTable: false,
  });

  const filterOptions = reactive({
    username: '',
    roleId: undefined,
  });

  const roleList = ref<LabelValueOptions>([]);

  function resetFilter() {
    filterOptions.roleId = undefined;
    filterOptions.username = '';
    filterUserList();
  }

  function filterUserList() {
    emits('updateUserList', filterOptions);
  }

  const [registerUserModal, { openModal: openUserModal }] = useModal();
  function createUser() {
    openUserModal(true);
  }
</script>

<style lang="less" scoped></style>
