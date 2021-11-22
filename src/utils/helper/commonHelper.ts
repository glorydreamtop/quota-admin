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

export function useTaskPool() {
  function taskPool() {
    this.tasks = [];
    this.pool = [];
    this.limit = 5;
  }
  taskPool.prototype.addTask = function (task) {
    this.tasks.push(task);
    this.run();
  };
  taskPool.prototype.run = function () {
    if (this.tasks.length === 0) return;
    const min = Math.min(this.tasks.length, this.max - this.pool.length);
    for (let i = 0; i < min; i++) {
      const currTask = this.tasks.shift();
      this.pool.push(currTask);
      currTask()
        .then((res) => {
          console.log(new Date().getTime() - startTime);
        })
        .catch((err) => {})
        .finally(() => {
          this.pool.splice(this.pool.indexOf(currTask), 1);
          this.run();
        });
    }
  };
  return taskPool;
}
