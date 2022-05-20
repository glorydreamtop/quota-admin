import { h, InjectionKey, onMounted, ref, Ref, render, unref, watchEffect } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { pageSettingType, TemplateDOM } from '/#/template';
import { remove } from 'lodash-es';
import { useActiveElement, useMagicKeys } from '@vueuse/core';
import interact from 'interactjs';
import { InteractEvent } from '@interactjs/types/index';
import Icon from '/@/components/Icon';

const templateKey: InjectionKey<Ref<TemplateDOM[]>> = Symbol();

export function createTemplateListContext(context: Ref<TemplateDOM[]>) {
  return createContext<Ref<TemplateDOM[]>>(context, templateKey, { native: true });
}

export function useTemplateListContext() {
  return useContext<Ref<TemplateDOM[]>>(templateKey);
}

const selectTemplateKey: InjectionKey<Ref<TemplateDOM[]>> = Symbol();

export function createSelectTemplateListContext(context: Ref<TemplateDOM[]>) {
  return createContext<Ref<TemplateDOM[]>>(context, selectTemplateKey, { native: true });
}

export function useSelectTemplateListContext() {
  return useContext<Ref<TemplateDOM[]>>(selectTemplateKey);
}

const uniqIdKey: InjectionKey<Ref<string[]>> = Symbol();

export function createUniqIdContext(context: Ref<string[]>) {
  return createContext<Ref<string[]>>(context, uniqIdKey, { native: true });
}

export function useUniqIdContext() {
  return useContext<Ref<string[]>>(uniqIdKey);
}

const pageSettingKey: InjectionKey<pageSettingType> = Symbol();

export function createPageSettingContext(context: pageSettingType) {
  return createContext<pageSettingType>(context, pageSettingKey, { native: true });
}

export function usePageSettingContext() {
  return useContext<pageSettingType>(pageSettingKey);
}

type useMultiSelectRes = {
  insertSelectKey: (temp: TemplateDOM, nativeEvent: PointerEvent) => void;
  clearSelectKey: () => void;
};

export function useMultiSelect(
  templateList: Ref<TemplateDOM[]>,
  selectTemplateList: Ref<TemplateDOM[]>,
): useMultiSelectRes {
  const activeElement = useActiveElement();
  const { Ctrl_A, Delete, Backspace } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (e.ctrlKey && e.key === 'a' && e.type === 'keydown') {
        e.preventDefault();
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (!activeElement.value!.hasAttribute('contentEditable')) {
          e.preventDefault();
        }
      }
    },
  });

  watchEffect(() => {
    if (Ctrl_A.value) selectTemplateList.value = templateList.value.map((temp) => temp);
    if (Backspace.value || Delete.value) {
      if (activeElement.value!.hasAttribute('contentEditable')) return;
      remove(templateList.value, (t) => {
        return selectTemplateList.value.some((temp) => t.uniqId === temp.uniqId);
      });
    }
  });

  function insertSelectKey(temp: TemplateDOM, nativeEvent: PointerEvent) {
    const list = selectTemplateList.value;
    if (nativeEvent.ctrlKey) {
      const idx = list.findIndex((t) => t.uniqId === temp.uniqId);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(temp);
      }
    } else if (nativeEvent.shiftKey) {
      // Shift多选
      let minIndex = Infinity;
      let maxIndex = 0;
      for (let i = 0; i < list.length; i++) {
        minIndex = Math.min(
          templateList.value.findIndex((item) => item.uniqId === list[i].uniqId),
          minIndex,
        );
        maxIndex = Math.max(
          templateList.value.findIndex((item) => item.uniqId === list[i].uniqId),
          maxIndex,
        );
      }
      const currentIndex = templateList.value.findIndex((item) => item.uniqId === temp.uniqId);
      if (currentIndex < minIndex) {
        minIndex = currentIndex;
      }
      if (currentIndex > maxIndex) {
        maxIndex = currentIndex;
      }
      console.log(templateList.value);

      for (let index = minIndex; index <= maxIndex; index++) {
        const key = templateList.value[index].uniqId;
        if (list.findIndex((t) => t.uniqId === key) === -1) {
          list.push(templateList.value[index]);
        }
      }
    } else {
      remove(list, (_) => _);
      list.push(temp);
    }
  }
  function clearSelectKey() {
    remove(selectTemplateList.value, (_) => _);
  }
  return { insertSelectKey, clearSelectKey };
}

export function insertDOM(
  templateList: Ref<TemplateDOM[]>,
  selectedTemplateList: Ref<TemplateDOM[]>,
  cfg: TemplateDOM,
) {
  if (selectedTemplateList.value.length === 1) {
    templateList.value.splice(
      templateList.value.findIndex((t) => t.uniqId === selectedTemplateList.value[0].uniqId) + 1,
      0,
      cfg,
    );
  } else {
    templateList.value.push(cfg);
  }
}

export const textTemplate: TemplateDOM = {
  uniqId: 'z',
  type: 'Text',
  pageConfig: {
    width: '33.3%',
    height: '400px',
  },
  config: {
    text: '这里你可以随意书写，并为其添加丰富的样式',
  },
};

export const imgTemplate: TemplateDOM = {
  uniqId: 'z',
  type: 'Img',
  pageConfig: {
    width: '33.3%',
    height: '400px',
  },
  config: {
    url: '',
    mode: 'fill',
  },
};

interface draggableOptions {
  handle?: string;
  items: string;
  restrict?: {
    restriction: string;
    elementRect: {
      top: string;
      left: string;
      bottom: string;
      right: string;
    };
  };
  onDraggleStart?: (e: InteractEvent) => void;
  onDraggleEnd?: (e: InteractEvent) => void;
  onDraggle?: (e: InteractEvent) => void;
  onResizeStart?: (e: InteractEvent) => void;
  onResizeEnd?: (e: InteractEvent) => void;
  onResize?: (e: InteractEvent) => void;
}

export function useDraggable({
  handle,
  items,
  onDraggleStart,
  onDraggle,
  onDraggleEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
}: draggableOptions) {
  const handler = handle ?? items;
  const allowDraggable = ref(true);

  interact(items)
    .draggable({
      modifiers: [
        // interact.modifiers.snap({
        //   targets: [interact.snappers.grid({ x: 30, y: 30 })],
        //   range: Infinity,
        //   relativePoints: [{ x: 0, y: 0 }],
        // }),
        interact.modifiers.restrict({
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: true,
        }),
      ],
    })
    .on('down', (event: InteractEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(items)?.contains(target.closest(handler)!)) {
        allowDraggable.value = false;
        return;
      } else {
        allowDraggable.value = true;
        onDraggleStart?.call(null, event);
      }
    })
    .on('dragstart', (event: InteractEvent) => {
      if (!allowDraggable.value) return;
    })
    .on('dragmove', (event: InteractEvent) => {
      if (!allowDraggable.value) return;
      onDraggle?.call(null, event);
    })
    .on('dragend', (event: InteractEvent) => {
      onDraggleEnd?.call(null, event);
    })
    .resizable({
      // 任意方向都能resize
      edges: { right: true, bottom: true },
    })
    .on('resizestart', (event: InteractEvent) => {
      onResizeStart?.call(null, event);
    })
    .on('resizemove', (event: InteractEvent) => {
      onResize?.call(null, event);
    })
    .on('resizeend', (event: InteractEvent) => {
      onResizeEnd?.call(null, event);
    });
}

export interface paginationInfoType {
  totalPage: number;
}

export function useDrawer(container: Ref<HTMLElement | undefined>) {
  const containerHidden = ref(false);
  const icon = h(Icon, {
    icon: 'ant-design:left-outlined',
    class: 'arrow-icon',
  });
  const tip = h(
    'span',
    {
      class: 'tip',
    },
    '模板树',
  );
  const line = h(
    'div',
    {
      onClick: hide,
      class: 'line hover-gray-shadow',
    },
    [icon, tip],
  );
  let main: HTMLElement;
  let startWidth: number;
  function init() {
    const parent = unref(container)!;
    render(line, parent);
    startWidth = parent.offsetWidth;
    Object.assign(parent.style, {
      width: `${startWidth}px`,
      transition: 'width .3s',
    });
    main = parent.getElementsByClassName('drawer-main')[0] as HTMLElement;
    Object.assign(main.style, {
      width: `${main.offsetWidth}px`,
    });
  }
  function hide() {
    const parent = unref(container)!;
    const line = parent.getElementsByClassName('line')[0] as HTMLElement;
    const remainWidth = line.offsetWidth;
    if (containerHidden.value) {
      parent.style.width = `${startWidth}px`;
    } else {
      parent.style.width = `${remainWidth}px`;
    }
    containerHidden.value = !containerHidden.value;
    line.classList.toggle('hover-gray-shadow');
    icon.el!.classList.toggle('rotate');
  }
  onMounted(init);
}
