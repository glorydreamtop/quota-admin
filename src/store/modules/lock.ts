import type { LockInfo } from '/#/store';

import { defineStore } from 'pinia';

import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { webStorage } from '/@/utils/cache/storageCache';
import { useUserStore } from './user';

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: webStorage.ls.get(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo;
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      webStorage.ls.set(LOCK_INFO_KEY, this.lockInfo, true);
    },
    resetLockInfo() {
      webStorage.ls.remove(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    // Unlock
    async unLock(password?: string) {
      const userStore = useUserStore();
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo();
        return true;
      }
      const tryLogin = async () => {
        try {
          const username = userStore.getUserInfo?.username;
          const res = await userStore.login({
            username,
            password: password!,
            goHome: false,
            mode: 'none',
          });
          if (res) {
            this.resetLockInfo();
          }
          return res;
        } catch (error) {
          return false;
        }
      };
      return await tryLogin();
    },
  },
});
