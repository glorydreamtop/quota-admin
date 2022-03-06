<template>
  <div class="h-layout-full p-4 flex flex-col gap-4">
    <BasicTable @register="registerTable">
      <template #roleList="{ record }">
        <span class="flex gap-1 justify-center">
          <Tag v-for="(roleId, index) in record.roleIdList" :key="roleId" :color="colors[index]">{{
            roleNameFilter(roleId)
          }}</Tag>
        </span>
      </template>
      <template #action>
        <TableAction :actions="actions" />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { getUserList } from '/@/api/sys/user';
  import { getRoleListById } from '/@/api/sys/role';
  import { UserInfo } from '/#/store';
  import type { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { Icon } from '/@/components/Icon';
  import { Tag } from 'ant-design-vue';
  import { getColumns } from './columns';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { RoleItem } from '/@/api/sys/model';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { fade } from '/@/utils/color';

  const { t } = useI18n();
  const userListResult = reactive<BasicFetchResult<UserInfo>>({
    list: [],
    totalCount: 0,
    totalPage: 0,
    currPage: 1,
    pageSize: 100,
  });
  const [registerTable, { setPagination }] = useTable({
    columns: getColumns(),
    api: getUserListData,
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
  const roleList = ref<RoleItem[]>([]);
  async function getUserListData(pageParams: BasicPageParams) {
    const res = await getUserList(pageParams);
    Object.assign(userListResult, res);
    setPagination({
      pageSize: res.pageSize,
      current: res.currPage,
      total: res.totalCount,
    });
    return res;
  }
  async function updateRoleNameList() {
    const { list } = await getRoleListById();
    roleList.value = list;
  }
  // id翻译成角色名字
  function roleNameFilter(id: number) {
    return roleList.value.find((role) => role.roleId === id)?.roleName || null;
  }
  const { getColorScheme } = useRootSetting();

  const colors = computed(() => {
    return getColorScheme.value.map((color) => fade(color, 60));
  });
  onMountedOrActivated(async () => {
    await updateRoleNameList();
  });
</script>

<style lang="less" scoped>
  .user-card {
    @apply border border-primary-100 relative shadow-sm shadow-primary-100 overflow-hidden w-50 bg-primary-50 p-2 flex flex-col gap-1;

    aspect-ratio: 16/9;

    .edit {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    &:hover {
      .edit {
        opacity: 1;
      }
    }
  }

  .contact {
    .mail {
      @apply overflow-hidden;

      height: 0;
      transition: height 0.2s ease-in-out 0.2s;

      & > span {
        transform: translateY(-1em);
        transition: transform 0.2s ease-in-out 0.2s;
      }
    }

    &:hover {
      .mail {
        height: 1.2em;

        & > span {
          transform: translateY(0);
        }
      }
    }
  }
</style>
