import { cloneDeep } from 'lodash-es';
import { computed, unref, watch, nextTick } from 'vue';
import type { Ref } from 'vue';
import { SourceTypeEnum, SourceTypeNameEnum } from '/@/enums/quotaEnum';
import { useThrottleFn } from '@vueuse/shared';
import { isNullOrUnDef } from '/@/utils/is';

interface resizeContainerParams {
  container: HTMLElement;
  boxName: string;
  scaleName: string;
}

interface resizeParams {
  x?: boolean;
  y?: boolean;
  onEnd?: (dom: HTMLElement) => void;
}

interface scaleableParams extends resizeParams {
  staticMode: boolean;
}

export function useWatchArray<T extends any>(
  arr: Ref<T[]>,
  callBack: (arr: T[], pre: T[]) => void
) {
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
    { deep: true }
  );
}

export function typeFomatter(str: SourceTypeEnum) {
  return SourceTypeNameEnum[str] || '其他';
}

function resize(
  { container, boxName, scaleName }: resizeContainerParams,
  { x, y, onEnd }: resizeParams
) {
  if (isNullOrUnDef(x)) x = false;
  if (isNullOrUnDef(y)) y = false;
  // @ts-ignore
  const boxes: HTMLElement[] = container.querySelectorAll(boxName) as HTMLElement[];
  boxes.forEach((box) => {
    const scale = box.querySelector(scaleName)! as HTMLElement;
    scale.onmousedown = function (e) {
      // 阻止冒泡,避免缩放时触发移动事件
      e.stopPropagation();
      e.preventDefault();
      const pos = {
        w: box.offsetWidth,
        h: box.offsetHeight,
        x: e.clientX,
        y: e.clientY,
      };

      container.onmousemove = function (ev) {
        const throttleHandle = useThrottleFn(function () {
          ev.preventDefault();
          let w, h;
          if (x) {
            w = Math.max(30, ev.clientX - pos.x + pos.w);
            w =
              w >= container.offsetWidth - box.offsetLeft
                ? container.offsetWidth - box.offsetLeft
                : w;
          }
          if (y) {
            h = Math.max(30, ev.clientY - pos.y + pos.h);
          }
          box.style.width = w + 'px';
          box.style.height = h + 'px';
        }, 18);
        throttleHandle();
      };

      container.onmouseleave = function () {
        container.onmousemove = null;
        container.onmouseup = null;
        onEnd && onEnd(box);
      };
      container.onmouseup = function () {
        container.onmousemove = null;
        container.onmouseup = null;
        onEnd && onEnd(box);
      };
    };
  });
}

/**
 *
 * @param {Object} doms 相关DOM
 * @param {Object} doms.container 容器DOM
 * @param {Object} doms.boxName 可伸缩节点CSS选择器
 * @param {Object} doms.scaleName 控制节点CSS选择器
 * @param {Object} direction 允许变化方向
 * @param {Boolean} staticMode 是否只需要处理容器任初始化的子元素
 */
export function useScaleable(
  { container, boxName, scaleName }: resizeContainerParams,
  { x, y, staticMode, onEnd }: scaleableParams = {
    x: true,
    y: true,
    staticMode: false,
    onEnd: function (_) {},
  }
) {
  if (staticMode) {
    resize({ container, boxName, scaleName }, { x, y, onEnd });
  } else {
    // 创建观察者对象
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        resize({ container, boxName, scaleName }, { x, y, onEnd });
      });
    });
    const config = { childList: true };
    observer.observe(container, config);
  }
}
