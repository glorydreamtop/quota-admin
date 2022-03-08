<template>
  <div class="h-layout-full p-4 flex flex-col gap-4">
    <div class="flex gap-4 bg-white p-4 shadow-md shadow-primary-50">
      <Button type="primary">
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
        <template #roleList="{ record }">
          <span class="flex gap-1 justify-center">
            <Tag
              v-for="(roleId, index) in record.roleIdList"
              :key="roleId"
              :color="colors[index]"
              >{{ roleNameFilter(roleId) }}</Tag
            >
          </span>
        </template>
        <template #action>
          <TableAction :actions="actions" />
        </template>
      </BasicTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { getUserList, updateUserInfo } from '/@/api/sys/user';
  import { getRoleListById } from '/@/api/sys/role';
  import type { BasicPageParams } from '/@/api/model/baseModel';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { Tag, Input, Select, Button } from 'ant-design-vue';
  import { getColumns } from './columns';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { fade } from '/@/utils/color';
  import { getRem } from '/@/utils/domUtils';
  import { isEmpty, isNull } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';

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
  const actions = ref([
    {
      label: t('common.editText'),
    },
    {
      label: t('common.delText'),
    },
  ]);
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
    } catch (error) {
      console.log(error);
    } finally {
      loadingState.roleSelect = false;
    }
  }
  async function editCellEnd({ key, value }) {
    if (isEmpty(value) || isNull(value)) return;
    const msg = await updateUserInfo({ [key]: value });
    createMessage.success(msg);
  }
  // id翻译成角色名字
  function roleNameFilter(id: number) {
    return roleList.value.find((role) => role.value === id)?.label || null;
  }
  const { getColorScheme } = useRootSetting();

  const colors = computed(() => {
    return getColorScheme.value.map((color) => fade(color, 60));
  });
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
