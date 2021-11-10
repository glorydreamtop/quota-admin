import { defineStore } from 'pinia';
import { CategoryTreeModel, QuotaItem } from '/#/quota';
import { TreeItem } from '/@/components/Tree';

type treeModel = Partial<CategoryTreeModel & TreeItem & QuotaItem>;

interface QuotaTreeState {
  sysQuotaTree: treeModel;
  userQuotaTree: treeModel;
}

export const useQuotaTreeStore = defineStore({
  id: 'app-quotaTree',
  state: (): QuotaTreeState => ({
    sysQuotaTree: [],
    userQuotaTree: [],
  }),
  getters: {
    geteSysQuotaTree(): treeModel {
      return this.sysQuotaTree;
    },
    geteUserQuotaTree(): treeModel {
      return this.userQuotaTree;
    },
  },
  actions: {
    setSysQuotaTree(treeData: treeModel) {
      this.sysQuotaTree = treeData;
    },
    setUserQuotaTree(treeData: treeModel) {
      this.userQuotaTree = treeData;
    },
  },
});
