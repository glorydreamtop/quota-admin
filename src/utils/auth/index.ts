import { webStorage, BasicKeys } from '/@/utils/cache/storageCache';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { TOKEN_KEY } from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  return webStorage[isLocal ? 'ls' : 'ss'].get(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  return webStorage[isLocal ? 'ls' : 'ss'].set(key, value);
}

export function clearAuthCache() {
  return webStorage[isLocal ? 'ls' : 'ss'].clear();
}
