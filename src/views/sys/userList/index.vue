<template>
  <div class="h-layout-full p-4 flex flex-col gap-4">
    <div class="h-2/3 w-full bg-white shadow-md border flex flex-wrap gap-4 p-4 overflow-y-scroll">
      <div class="user-card" v-for="user in userListResult.list" :key="user.userId">
        <Icon icon="edit" park class="absolute top-2 right-2 edit" />
        <div
          class="bg-primary-200 text-xs text-white w-fit min-w-3em text-center px-2 py-2px -ml-2 -mt-2 rounded-br-md italic"
        >
          {{ user.userId }}
        </div>
        <div class="text-primary tracking-1px font-bold text-xl">
          {{ user.username }}
        </div>
        <div class="contact">
          <div class="flex items-center gap-1">
            <Icon icon="phone-telephone" size="14" class="!text-purple-600" park />
            <span class="truncate text-primary-300 select-all">{{
              user.mobile || t('sys.user.noPhone')
            }}</span>
          </div>
          <div class="flex items-center gap-1 mail">
            <Icon icon="mail" size="14" class="!text-purple-600" park />
            <span class="truncate text-primary-300 select-all">{{
              user.wechatUsername || t('sys.user.noEmail')
            }}</span>
          </div>
        </div>
        <div class="flex gap-1 flex-wrap">
          <Tag
            v-for="(roleId, index) in user.roleIdList"
            :key="roleId"
            :color="colors[index]"
            :class="[roleId === 1 ? 'font-bold' : '', 'tracking-1px']"
            >{{ roleNameFilter(roleId) }}</Tag
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { getUserList } from '/@/api/sys/user';
  import { getRoleListById } from '/@/api/sys/role';
  import { UserInfo } from '/#/store';
  import type { BasicFetchResult } from '/@/api/model/baseModel';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { Tag } from 'ant-design-vue';
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
  const roleList = ref<RoleItem[]>([]);
  async function updateUserList() {
    const res = await getUserList({
      pageSize: 100,
      currPage: 1,
    });
    Object.assign(userListResult, res);
  }
  async function updateRoleNameList() {
    const { list } = await getRoleListById();
    roleList.value = list;
  }
  function roleNameFilter(id: number) {
    return roleList.value.find((role) => role.roleId === id)?.roleName || null;
  }
  const { getColorScheme } = useRootSetting();

  const colors = computed(() => {
    return getColorScheme.value.map((color) => fade(color, 60));
  });
  onMountedOrActivated(async () => {
    await updateRoleNameList();
    await updateUserList();
  });
</script>

<style lang="less" scoped>
  .user-card {
    @apply border border-primary-100 relative shadow-sm shadow-primary-100 overflow-hidden w-1/8 min-w-30 bg-primary-50 p-2 flex flex-col gap-1;

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
