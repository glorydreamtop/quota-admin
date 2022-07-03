import { useMagicKeys } from '@vueuse/core';
import { ref, unref, onMounted, Ref, watchEffect } from 'vue';
import { buildShortUUID } from '/@/utils/uuid';

const areaMap = new Map<SVGElement, areaParams>();

interface areaParams {
  paintArea?: Ref<SVGElement | undefined>;
  paintType: Ref<paintTypeEnum>;
  paintStatus: Ref<boolean>;
  currentTarget: { svgElement: SVGElement[]; svgId?: string };
  moveStatus: Ref<boolean>;
  moveTarget: Ref<SVGElement | undefined>;
  moveType: Ref<groupType | undefined>;
  svgIdMap: Map<string, SVGGElement>;
}

interface setSvgIdParams {
  g: SVGGElement;
  svgId: string;
  area: SVGElement;
}

function setSvgId({ svgId, g, area }: setSvgIdParams) {
  const { svgIdMap, currentTarget } = getAreaInfo(area);
  svgIdMap.set(svgId, g);
  currentTarget.svgId = svgId;
}

interface setArrowParams {
  x: number;
  y: number;
  area: SVGElement;
}

type setLineParams = setArrowParams;
type setRectParams = setArrowParams;
type setPencilParams = setArrowParams;

type usePaintResult = [
  {
    paintArea: Ref<SVGElement | undefined>;
    paintType: Ref<paintTypeEnum>;
    toolbar: Ref<HTMLElement | undefined>;
  },
  { switchType: (type: paintTypeEnum) => void; clearAll: (area: SVGElement) => void },
];
interface LineInfo {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RectInfo {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface PencilInfo {
  mx: number;
  my: number;
  drest?: string;
}

export enum paintTypeEnum {
  line = 'line',
  select = 'select',
  arrow = 'arrow',
  text = 'text',
  pencil = 'pencil',
  rect = 'rect',
}

interface makeShadowParams {
  g: SVGGElement;
}

type groupType = 'text' | 'rect' | 'line' | 'path' | 'arrow';

function warn(info: string) {
  console.error(`[svg-mark warn]:${info}`);
}

function getAreaInfo(area: SVGElement) {
  return areaMap.get(area)!;
}

function stopPaint(area: SVGElement) {
  const { paintStatus, svgIdMap, currentTarget } = getAreaInfo(area);
  paintStatus.value = false;
  const g = svgIdMap.get(currentTarget.svgId!)!;
  const { width, height } = g.getBoundingClientRect();
  if (width < 4 && height < 4) {
    removeGroup(currentTarget.svgId!, area);
  }
  currentTarget.svgElement = [];
}

function removeGroup(svgId: string, area: SVGElement) {
  const { svgIdMap } = getAreaInfo(area);
  if (svgIdMap.has(svgId)) {
    svgIdMap.get(svgId)!.remove();
    svgIdMap.delete(svgId);
  }
}

function createGroup(svgId: string) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  return group;
}

function clearAll(area: SVGElement) {
  getAreaInfo(area).svgIdMap.forEach((svg) => {
    svg.remove();
  });
  getAreaInfo(area).svgIdMap.clear();
}

function makeShadow({ g }: makeShadowParams) {
  function textShadow() {
    const rectShadow = g.querySelector('.text')!.cloneNode() as SVGRectElement;
    rectShadow.classList.replace('text', 'rect-shadow');
    g.appendChild(rectShadow);
  }
  function arrowLineShadow() {
    const lineShadow = g.querySelector('.arrow-line')!.cloneNode(true) as SVGLineElement;
    const x2 = lineShadow.getAttribute('x2')!;
    const y2 = lineShadow.getAttribute('y2')!;
    lineShadow.classList.replace('arrow-line', 'arrow-line-shadow');
    lineShadow.setAttribute('x2', `${parseInt(x2) + 4}`);
    lineShadow.setAttribute('y2', `${parseInt(y2) + 4}`);
    lineShadow.removeAttribute('marker-start');
    lineShadow.removeAttribute('marker-end');
    g.appendChild(lineShadow);
  }
  function lineShadow() {
    const lineShadow = g.querySelector('.line')!.cloneNode(true) as SVGLineElement;
    lineShadow.classList.replace('line', 'line-shadow');
    g.appendChild(lineShadow);
  }
  function rectShadow() {
    const rectShadow = g.querySelector('.rect')!.cloneNode(true) as SVGRectElement;
    rectShadow.classList.replace('rect', 'rect-shadow');
    g.appendChild(rectShadow);
  }
  function pencilShadow() {
    const pencilShadow = g.querySelector('.pencil')!.cloneNode(true) as SVGPathElement;
    pencilShadow.classList.replace('pencil', 'pencil-shadow');
    g.appendChild(pencilShadow);
  }
  const fns = {
    text: textShadow,
    arrow: arrowLineShadow,
    line: lineShadow,
    rect: rectShadow,
    pencil: pencilShadow,
  };
  const type = g.getAttribute('mark-type')!;
  fns[type]();
}

function removeShadow(svg: SVGGElement) {
  ['.arrow-line-shadow', '.line-shadow', '.rect-shadow', '.pencil-shadow'].forEach((selector) =>
    svg.querySelector(selector)?.remove(),
  );
}

function makeArrowLine(LineInfo: LineInfo, svgId: string) {
  const { x1, x2, y1, y2 } = LineInfo;
  const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' class='arrow-line' marker-start='url(#${svgId}-l)' marker-end='url(#arrow)' />`;
  const linePath = `<defs><marker id='${svgId}-l' markerHeight='10' refX='0' refY='5' orient='auto' markerUnits='userSpaceOnUse' >
    <path d='M0,5 L5,0 L10,5 L5,10 z' class='arrow-path' />
  </marker></defs>`;
  const group = createGroup(svgId);
  group.innerHTML = linePath + line;
  group.setAttribute('mark-type', 'arrow');
  return group;
}

function makeLine(LineInfo: LineInfo, svgId: string) {
  const { x1, x2, y1, y2 } = LineInfo;
  const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' class='line' />`;
  const group = createGroup(svgId);
  group.innerHTML = line;
  group.setAttribute('mark-type', 'line');
  return group;
}

function makeRect(RectInfo: RectInfo, svgId: string) {
  const { x, y } = RectInfo;
  const rect = `<rect start='${x},${y}' x='${x}' y='${y}' width='1' height='1' class='rect' />`;
  const group = createGroup(svgId);
  group.innerHTML = rect;
  group.setAttribute('mark-type', 'rect');
  return group;
}

function makePencil(PencilInfo: PencilInfo, svgId: string) {
  const { mx, my } = PencilInfo;
  const path = `<path d='M${mx},${my} L${mx},${my}' class='pencil' />`;
  const group = createGroup(svgId);
  group.innerHTML = path;
  group.setAttribute('mark-type', 'pencil');
  return group;
}

function makeText(RectInfo: RectInfo, svgId: string) {
  const { x, y } = RectInfo;
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', '16');
  foreignObject.setAttribute('height', '24');
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const text = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  text.setAttribute('contenteditable', 'true');
  text.className +=
    'text-red-600 min-w-4 w-fit border border-transparent inline-block border-animation';
  foreignObject.appendChild(text);
  foreignObject.setAttribute('x', x.toString());
  foreignObject.setAttribute('y', y.toString());
  foreignObject.classList.add('text');
  group.setAttribute('id', svgId);
  group.setAttribute('mark-type', 'text');
  group.appendChild(foreignObject);
  return { group, text, foreignObject };
}

// 设置箭头起点
function setArrowStart({ x, y, area }: setArrowParams) {
  const svgId = buildShortUUID('mark');
  const arrow = makeArrowLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
  area.appendChild(arrow);
  getAreaInfo(area).currentTarget.svgElement = [
    arrow.querySelector('.arrow-line')!,
    arrow.querySelector('path')!,
    arrow.querySelector('marker')!,
  ];
  setSvgId({ g: arrow, svgId, area });
  return arrow;
}
// 设置箭头终点
function setArrowEnd({ x, y, area }: setArrowParams) {
  const { currentTarget } = getAreaInfo(area);
  const arrow = currentTarget.svgElement[0];
  const x1 = parseFloat(arrow.getAttribute('x1')!);
  const y1 = parseFloat(arrow.getAttribute('y1')!);
  const len = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) + 3;
  const linePath = currentTarget.svgElement[1];
  currentTarget.svgElement[2].setAttribute('markerWidth', len.toString());
  linePath?.setAttribute('d', `M0,4 L${len - 4},1 L${len},5 L${len - 4},9 L0,6 z`);
  arrow?.setAttribute('x2', x.toString());
  arrow?.setAttribute('y2', y.toString());
}

// 箭头绘制模式
function paintArrow(area: SVGElement) {
  const { paintStatus } = getAreaInfo(area);
  area.onmousedown = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
    setArrowStart({ x: e.offsetX, y: e.offsetY, area });
    paintStatus.value = true;
    // 节流一半的move事件
    let step = 1;
    area.onmousemove = (e: MouseEvent) => {
      if (!paintStatus.value || step++ < 3) return;
      step = 1;
      setArrowEnd({ x: e.offsetX, y: e.offsetY, area });
    };
    area.onmouseup = () => {
      stopPaint(area);
    };
  };
}

// 设置直线起点
function setLineStart({ x, y, area }: setLineParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const line = makeLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
  area.appendChild(line);
  currentTarget.svgElement = [line.querySelector('line')!];
  setSvgId({ g: line, svgId, area });
  return line;
}
// 设置直线终点
function setLineEnd({ x, y, area }: setLineParams) {
  const { currentTarget } = getAreaInfo(area);
  const line = currentTarget.svgElement[0];
  line?.setAttribute('x2', x.toString());
  line?.setAttribute('y2', y.toString());
}
// 直线绘制模式
function paintLine(area: SVGElement) {
  const { paintStatus } = getAreaInfo(area);
  area.onmousedown = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
    setLineStart({ x: e.offsetX, y: e.offsetY, area });
    paintStatus.value = true;
    // 节流一半的move事件
    let step = 1;
    area.onmousemove = (e: MouseEvent) => {
      if (!paintStatus.value || step++ < 3) return;
      step = 1;
      setLineEnd({ x: e.offsetX, y: e.offsetY, area });
    };
    area.onmouseup = () => {
      stopPaint(area);
    };
  };
}

// 设置矩形起点
function setRectStart({ x, y, area }: setRectParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const rect = makeRect({ x, y, width: 1, height: 1 }, svgId);
  area.appendChild(rect);
  currentTarget.svgElement = [rect.querySelector('rect')!];
  setSvgId({ g: rect, svgId, area });
  return rect;
}
// 设置矩形终点
function setRectEnd({ x, y, area }: setRectParams) {
  const { currentTarget } = getAreaInfo(area);
  const rect = currentTarget.svgElement[0];
  const [x1, y1] = rect
    .getAttribute('start')!
    .split(',')
    .map((n) => parseFloat(n));
  rect.setAttribute('x', Math.min(x1, x).toString());
  rect.setAttribute('y', Math.min(y1, y).toString());
  rect.setAttribute('width', Math.abs(x1 - x).toString());
  rect.setAttribute('height', Math.abs(y1 - y).toString());
}
// 矩形绘制模式
function paintRect(area: SVGElement) {
  const { paintStatus } = getAreaInfo(area);
  area.onmousedown = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
    setRectStart({ x: e.offsetX, y: e.offsetY, area });
    paintStatus.value = true;
    // 节流一半的move事件
    let step = 1;
    area.onmousemove = (e: MouseEvent) => {
      if (!paintStatus.value || step++ < 3) return;
      step = 1;
      setRectEnd({ x: e.offsetX, y: e.offsetY, area });
    };
    area.onmouseup = () => {
      stopPaint(area);
    };
  };
}

// 设置线条起点
function setPencilStart({ x, y, area }: setPencilParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const pencil = makePencil({ mx: x, my: y }, svgId);
  area.appendChild(pencil);
  currentTarget.svgElement = [pencil.querySelector('path')!];
  setSvgId({ g: pencil, svgId, area });
  return pencil;
}
// 设置线条终点
function setPencilEnd({ x, y, area }: setPencilParams) {
  const { currentTarget } = getAreaInfo(area);
  const line = currentTarget.svgElement[0];
  let d = line.getAttribute('d')!;
  d += ` L${x},${y}`;
  line.setAttribute('d', d);
}
// 线条绘制模式
function paintPencil(area: SVGElement) {
  const { paintStatus } = getAreaInfo(area);
  area.onmousedown = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
    setPencilStart({ x: e.offsetX, y: e.offsetY, area });
    paintStatus.value = true;
    // 节流一半的move事件
    let step = 1;
    area.onmousemove = (e: MouseEvent) => {
      if (!paintStatus.value || step++ < 3) return;
      step = 1;
      setPencilEnd({ x: e.offsetX, y: e.offsetY, area });
    };
    area.onmouseup = () => {
      stopPaint(area);
    };
  };
}
function paintText(area: SVGElement) {
  const { paintStatus, paintType } = getAreaInfo(area);
  area.onclick = (e: MouseEvent) => {
    if ((e.target as Element).hasAttribute('contenteditable')) return;
    if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
    const svgId = buildShortUUID('mark');
    const { group, text, foreignObject } = makeText({ x: e.offsetX, y: e.offsetY }, svgId);
    text.oninput = () => {
      const { height } = text.getBoundingClientRect();
      foreignObject.setAttribute('height', `${height}`);
    };
    // 不取消可编辑性的话偶发错误，点击别的地方这里先focus了
    text.onmouseenter = () => {
      if (paintType.value !== paintTypeEnum.text) return;
      text.setAttribute('contenteditable', 'true');
      text.classList.remove('select-none');
    };
    text.onmouseleave = (e) => {
      if ((e.target as HTMLDivElement) === document.activeElement) return;
      text.setAttribute('contenteditable', 'false');
      text.classList.add('select-none');
    };
    text.onfocus = () => {
      text.classList.replace('border-transparent', 'border-gray-300');
      foreignObject.setAttribute('width', '100%');
    };
    text.onblur = () => {
      if (text.textContent?.length === 0) {
        // 没字就删掉
        removeGroup(group.getAttribute('id')!, area);
      } else {
        text.setAttribute('contenteditable', 'false');
        text.classList.add('w-fit');
        text.classList.replace('border-gray-300', 'border-transparent');
        const { width } = text.getBoundingClientRect();
        group.setAttribute('width', `${width}`);
        foreignObject.setAttribute('width', `${width}`);
      }
    };
    setSvgId({ g: group, svgId, area });
    area.appendChild(group);
    Promise.resolve().then(() => text.focus());
  };
}

function getMoveTarget(g: SVGGElement, area: SVGElement) {
  const { moveType } = getAreaInfo(area);
  const selector = {
    text: '.text',
    arrow: '.arrow-line',
    line: '.line',
    rect: '.rect',
    pencil: '.pencil',
  };
  const target: SVGElement = g.querySelector(selector[moveType.value!])!;
  return target;
}

function selectMode(area: SVGElement) {
  const { svgIdMap, moveStatus, moveTarget, moveType, currentTarget, paintType } =
    getAreaInfo(area);
  const start = { x: 0, y: 0 };
  area.onmousedown = (e) => {
    const svg = (e.target as SVGElement).closest('g');
    if (!svg?.hasAttribute('mark-type')) {
      return;
    }
    moveType.value = svg.getAttribute('mark-type') as groupType;
    moveTarget.value = getMoveTarget(svg, area);
    const [x, y] = (moveTarget.value.getAttribute('transform') ?? '0,0')
      .match(/\-?\d+/g)!
      .map((str) => parseFloat(str));
    start.x = e.offsetX - x;
    start.y = e.offsetY - y;
    area.onmousemove = (e) => {
      moveStatus.value = true;
      moveTarget.value?.setAttribute(
        'transform',
        `translate(${e.offsetX - start.x},${e.offsetY - start.y})`,
      );
      moveType.value === 'text' &&
        moveTarget.value?.nextElementSibling?.setAttribute(
          'transform',
          `translate(${e.offsetX - start.x},${e.offsetY - start.y})`,
        );
    };
    area.onmouseup = () => {
      if (moveStatus.value) {
        moveType.value !== 'text' && removeShadow(svg);
        moveType.value !== 'text' && makeShadow({ g: svg });
      }
      moveStatus.value = false;
      moveTarget.value = void 0;
      moveType.value = void 0;
      area.onmousemove = null;
      area.onmouseup = null;
    };
    area.onclick = (e) => {
      const svg = (e.target as SVGElement).closest('g');
      currentTarget.svgElement.forEach((svg) => svg.classList.remove('mark-selected'));
      if (!svg) {
        // 点到空白区
        currentTarget.svgElement.length = 0;
        return;
      }
      currentTarget.svgElement.push(svg);
      svg?.classList.add('mark-selected');
    };
  };
  const { Delete, Backspace } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        paintType.value === paintTypeEnum.select
      ) {
        e.preventDefault();
      }
    },
  });
  watchEffect(() => {
    if (Backspace.value || Delete.value) {
      currentTarget.svgElement.forEach((svg) => removeGroup(svg.id, area));
    }
  });

  svgIdMap.forEach((svg) => {
    svg.classList.add('selected-light');
    makeShadow({ g: svg });
  });
}

export function usePaint(): usePaintResult {
  const paintArea = ref<SVGElement | undefined>();
  const paintType = ref<paintTypeEnum>(paintTypeEnum.select);
  const paintStatus = ref(false);
  const toolbar = ref<HTMLElement>();
  const svgIdMap = new Map<string, SVGGElement>();

  const moveStatus = ref(false);
  const moveType = ref<groupType | undefined>();
  const moveTarget = ref<SVGElement>();

  const paintTypeFn = {
    [paintTypeEnum.line]: paintLine,
    [paintTypeEnum.arrow]: paintArrow,
    [paintTypeEnum.text]: paintText,
    [paintTypeEnum.rect]: paintRect,
    [paintTypeEnum.pencil]: paintPencil,
    [paintTypeEnum.select]: selectMode,
  };

  function switchType(type: paintTypeEnum) {
    if (paintType.value === type) return;
    paintType.value = type;
    areaMap.get(paintArea.value!)!.svgIdMap.forEach((svg) => {
      svg.classList.remove('selected-light');
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
    if (areaMap.has(paintArea.value!)) {
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
    areaMap.set(unref(paintArea)!, areaParams);

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
