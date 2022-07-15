import { createLocalStorage } from '/@/utils/cache/storageCache';

const tempSavePathHistroy = createLocalStorage();

export function getPathHistory() {
  return tempSavePathHistroy.get('tempSavePathHistroy');
}

export function setPathHistory(path: string[]) {
  return tempSavePathHistroy.set('tempSavePathHistroy', path);
}
