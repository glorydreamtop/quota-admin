import { ref, unref, onMounted, Ref } from 'vue';
import { removeShadow } from './components/mark';
import {
  paintArrow,
  paintLine,
  paintPencil,
  paintRect,
  paintText,
  selectMode,
} from './components/setMark';
import {
  removeGroup,
  getAreaInfo,
  groupType,
  clearAll,
  areaParams,
  hasAreaInfo,
  setAreaInfo,
  warn,
  paintTypeEnum,
} from './components/group';

type usePaintResult = [
  {
    paintArea: Ref<SVGElement | undefined>;
    paintType: Ref<paintTypeEnum>;
    toolbar: Ref<HTMLElement | undefined>;
  },
  { switchType: (type: paintTypeEnum) => void; clearAll: (area: SVGElement) => void },
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

  const moveStatus = ref(false);
  const moveType = ref<groupType | undefined>();
  const moveTarget = ref<SVGElement>();

  function switchType(type: paintTypeEnum) {
    if (paintType.value === type) return;
    paintType.value = type;
    const { svgIdMap, currentTarget } = getAreaInfo(paintArea.value!);
    svgIdMap.forEach((svg) => {
      svg.classList.remove('hover-light');
      svg.classList.remove('mark-selected');
      currentTarget.svgElement.length = 0;
      // 移除影子
      removeShadow(svg);
    });
    paintArea.value!.onmousedown = null;
    paintArea.value!.onmousemove = null;
    paintArea.value!.onclick = null;
    paintArea.value!.onmouseup = null;
    paintTypeFn[type](paintArea.value!);
  }

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
    { switchType, clearAll },
  ];
}
