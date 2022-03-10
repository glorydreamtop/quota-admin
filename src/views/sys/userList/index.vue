<template>
  <div class="h-layout-full p-4 flex flex-col gap-4">
    <div class="flex gap-4 bg-white p-4 shadow-md shadow-primary-50">
      <Button type="primary" disabled>
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
    </div>
    <div class="bg-white p-4 shadow-md shadow-primary-50">
      <BasicTable @register="registerTable" @edit-end="editCellEnd">
        <template #action="{ record }">
          <TableAction :actions="actions(record)" />
        </template>
      </BasicTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { getUserList, updateUserInfo } from '/@/api/sys/user';
  import { getRoleListById } from '/@/api/sys/role';
  import type { BasicPageParams } from '/@/api/model/baseModel';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { Input, Select, Button } from 'ant-design-vue';
  import { getColumns, userListEventBus } from './columns';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { getRem } from '/@/utils/domUtils';
  import { isEmpty, isNull } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UserInfo } from '/#/store';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const filterOptions = reactive({
    username: '',
    roleId: undefined,
  });

  const loadingState = reactive({
    roleSelect: false,
    userTable: false,
  });

  const [registerTable, { setPagination, reload }] = useTable({
    columns: getColumns(),
    api: getUserListData,
    bordered: true,
    pagination: {
      pageSize: 100,
    },
    resizeHeightOffset: getRem() * 1,
    actionColumn: {
      width: 160,
      title: t('common.action'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const actions = function (record: UserInfo): ActionItem[] {
    const resetPwdText = ref('');
    return [
      {
        icon: 'ant-design:lock-outlined',
        label: t('sys.user.resetPwd'),
        popConfirm: {
          title: () => {
            // @ts-ignore
            return h(Input, {
              type: 'text',
              size: 'small',
              defaultValue: resetPwdText,
              placeholder: t('sys.login.passwordPlaceholder'),
              onInput: ({ target }) => (resetPwdText.value = target.value),
            });
          },
          confirm: async () => {
            if (!resetPwdText.value) return;
            const msg = await updateUserInfo({
              userId: record.userId,
              password: resetPwdText.value,
            });
            createMessage.success(msg);
            resetPwdText.value = '';
          },
          cancel: () => {
            resetPwdText.value = '';
          },
        },
      },
      {
        icon: 'ant-design:delete-outlined',
        label: t('common.delText'),
      },
    ];
  };
  const roleList = ref<LabelValueOptions>([]);
  async function getUserListData(pageParams: BasicPageParams) {
    const res = await getUserList({
      ...pageParams,
      username: filterOptions.username,
      roleId: filterOptions.roleId,
    });
    setPagination({
      pageSize: res.pageSize,
      current: res.currPage,
      total: res.totalCount,
    });
    return res;
  }
  async function updateRoleNameList() {
    loadingState.roleSelect = true;
    try {
      const { list } = await getRoleListById();
      roleList.value = list.map((item) => ({ label: item.roleName, value: item.roleId }));
      userListEventBus.emit('roleListUpdate', roleList.value);
    } catch (error) {
      console.log(error);
    } finally {
      loadingState.roleSelect = false;
    }
  }
  async function editCellEnd({ key, value, record }) {
    if (isEmpty(value) || isNull(value)) return;
    // 带上userId，他们的token解不出来userId，绝了
    const msg = await updateUserInfo({ [key]: value, userId: record.userId });
    createMessage.success(msg);
  }
  async function filterUserList() {
    reload();
  }
  function resetFilter() {
    filterOptions.roleId = undefined;
    filterOptions.username = '';
    reload();
  }
  onMountedOrActivated(async () => {
    await updateRoleNameList();
  });
</script>

<style lang="less" scoped>
  .label {
    &::after {
      content: ':';
    }
  }
</style>
