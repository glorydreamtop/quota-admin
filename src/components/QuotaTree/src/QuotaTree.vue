<template>
  <div class="bg-white">
    <Tabs v-model:activeKey="treeType" class="h-full" centered>
      <TabPane :key="CategoryTreeType.sysQuota" :tab="t('quota.sysQuota')" class="h-full"
        ><BasicTree v-bind="treeProps[CategoryTreeType.sysQuota]">
          <template #folder>
            <Icon icon="ant-design:folder-outlined" />
          </template>
          <template #quota>
            <Icon icon="tabler:letter-q" />
          </template>
        </BasicTree>
      </TabPane>
      <TabPane :key="CategoryTreeType.userQuota" :tab="t('quota.userQuota')" class="h-full"
        ><BasicTree v-bind="treeProps[CategoryTreeType.userQuota]">
          <template #folder>
            <Icon icon="ant-design:folder-outlined" />
          </template>
          <template #quota>
            <Icon icon="tabler:letter-q" />
          </template> </BasicTree
      ></TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTree, ReplaceFields, TreeItem } from '/@/components/Tree/index';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { getQuotaTree } from '/@/api/quota';
  import type { CategoryTreeModel } from '/#/quota';
  import { CategoryTreeType } from '/@/enums/quotaEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Icon } from '/@/components/Icon';
  import { forEach } from '/@/utils/helper/treeHelper';

  type treeProp = Partial<{
    treeData: TreeItem[];
    replaceFields: ReplaceFields;
    blockNode: boolean;
    toolbar: boolean;
  }>;
  interface treePropsModel {
    [CategoryTreeType.sysQuota]: treeProp;
    [CategoryTreeType.userQuota]: treeProp;
  }

  const { t } = useI18n();

  const treeType = ref<CategoryTreeType>(CategoryTreeType.sysQuota);

  const treeProps: treePropsModel = reactive({
    [CategoryTreeType.sysQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      loadData,
    },
    [CategoryTreeType.userQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      loadData,
    },
  });

  async function getData(type: CategoryTreeType.sysQuota | CategoryTreeType.userQuota) {
    const res = (await getQuotaTree({ type })) as Partial<CategoryTreeModel & TreeItem>[];
    forEach(res, (item) => {
      item.icon = item.folder ? 'ant-design:folder-outlined' : 'tabler:letter-q';
    });
    treeProps[type].treeData = res;
  }
  getData(CategoryTreeType.sysQuota);
  getData(CategoryTreeType.userQuota);

  async function loadData(node) {
    console.log(node);
    res = await getDirQuota({ categoryId: node.dataRef.id });
  }
</script>

<style lang="less" scoped></style>
