import { cloneDeep } from 'lodash-es';
import { computed, unref, watch, nextTick } from 'vue';
import type { Ref } from 'vue';
import { SourceTypeEnum, SourceTypeNameEnum } from '/@/enums/quotaEnum';

export function useWatchArray<T>(arr: Ref<T[]>, callBack: (arr: T[], pre: T[]) => void) {
  let stopWatch = false;
  const cloneArr = computed(() => cloneDeep(unref(arr)));

  watch(
    cloneArr,
    async (_, pre) => {
      if (stopWatch) return;
      stopWatch = true;
      callBack && callBack(arr.value, pre);
      await nextTick();
      stopWatch = false;
    },
    { deep: true },
  );
}

export function typeFomatter(str: SourceTypeEnum) {
  return SourceTypeNameEnum[str] || '其他';
}
