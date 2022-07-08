import { ref, unref, onMounted, Ref, watch } from 'vue';
import { removeShadow } from './components/mark';
import {
  paintArrow,
  paintLine,
  paintPencil,
  paintRect,
  paintText,
  selectMode,
} from './components/setMark';
import { removeGroup, clearAll, paintTypeEnum } from './components/group';
import {
  getAreaInfo,
  groupType,
  areaParams,
  hasAreaInfo,
  setAreaInfo,
  warn,
  getNodeData,
  svgDataInfo,
} from './components/utils';

type usePaintResult = [
  {
    paintArea: Ref<SVGElement | undefined>;
    paintType: Ref<paintTypeEnum>;
    toolbar: Ref<HTMLElement | undefined>;
  },
  {
    switchType: (type: paintTypeEnum) => void;
    clearAll: (area: SVGElement) => void;
    getData: () => any;
  },
];

export function stopPaint(area: SVGElement) {
  const { paintStatus, currentTarget, svgIdMap } = getAreaInfo(area);
  paintStatus.value = false;
  const g = svgIdMap.get(currentTarget.svgId!)!;
  const { width, height } = g.getBoundingClientRect();
  if (width < 4 && height < 4) {
    removeGroup(currentTarget.svgId!, area);
  }
  currentTarget.svgElement = [];
}

const paintTypeFn = {
  [paintTypeEnum.line]: paintLine,
  [paintTypeEnum.arrow]: paintArrow,
  [paintTypeEnum.text]: paintText,
  [paintTypeEnum.rect]: paintRect,
  [paintTypeEnum.pencil]: paintPencil,
  [paintTypeEnum.select]: selectMode,
};

export function usePaint(): usePaintResult {
  const paintArea = ref<SVGElement | undefined>();
  const paintType = ref<paintTypeEnum>(paintTypeEnum.select);
  const paintStatus = ref(false);
  const toolbar = ref<HTMLElement>();
  const svgIdMap = new Map<string, SVGGElement>();
  const svgDataInfo = ref<svgDataInfo[]>([]);
  const moveStatus = ref(false);
  const moveType = ref<groupType | undefined>();
  const moveTarget = ref<SVGElement>();

  function switchType(type: paintTypeEnum) {
    if (paintType.value === type) return;
    paintType.value = type;
  }

  function getData() {
    svgDataInfo.value = [];
    const markList = Array.from(paintArea.value!.children).filter(
      (node) => node.tagName === 'g',
    ) as SVGGElement[];
    markList.forEach((g) => {
      svgDataInfo.value.push(getNodeData(g));
    });
    console.log(svgDataInfo);
    return svgDataInfo;
  }

  watch(paintType, (type, oldType) => {
    const { svgIdMap, currentTarget, textNode } = getAreaInfo(paintArea.value!);
    if (oldType === paintTypeEnum.select) {
      svgIdMap.forEach((svg) => {
        svg.classList.remove('hover-light');
        svg.classList.remove('mark-selected');
        currentTarget.svgElement.length = 0;
        // 移除影子
        removeShadow(svg);
      });
      textNode.forEach((node) => {
        node.classList.add('pointer-events-none');
      });
    }
    if (type === paintTypeEnum.select) {
      textNode.forEach((node) => {
        node.classList.remove('pointer-events-none');
      });
    }
    if (oldType === paintTypeEnum.text) {
      textNode.forEach((node) => {
        node.children[0].setAttribute('contenteditable', 'false');
        node.classList.add('select-none');
        node.classList.add('pointer-events-none');
      });
    }
    if (type === paintTypeEnum.text) {
      textNode.forEach((node) => {
        node.children[0].setAttribute('contenteditable', 'true');
        node.classList.remove('select-none');
        node.classList.remove('pointer-events-none');
      });
    }
    paintArea.value!.onmousedown = null;
    paintArea.value!.onmousemove = null;
    paintArea.value!.onclick = null;
    paintArea.value!.onmouseup = null;
    paintTypeFn[type](paintArea.value!);
  });

  onMounted(() => {
    if (hasAreaInfo(paintArea.value!)) {
      warn('不能重复注册同一个DOM节点');
      return;
    }
    const areaParams: areaParams = {
      paintArea,
      paintStatus,
      paintType,
      moveStatus,
      moveTarget,
      moveType,
      svgIdMap,
      currentTarget: {
        svgElement: [],
        svgId: '',
      },
      textNode: new Set(),
      svgDataInfo,
    };
    setAreaInfo(unref(paintArea)!, areaParams);

    switchType(paintTypeEnum.arrow);
    paintArea.value!.onmouseleave = () => {
      if (paintStatus.value) {
        stopPaint(paintArea.value!);
      }
    };
  });
  return [
    { paintArea, paintType, toolbar },
    { switchType, clearAll, getData },
  ];
}
