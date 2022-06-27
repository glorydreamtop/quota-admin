import { reactive, ref, unref, onMounted, Ref } from 'vue';
import { buildShortUUID } from '/@/utils/uuid';

const SvgIdMap = new Map<string, SVGElement>();

interface currentParams {
  svgElement?: SVGElement[];
  paintArea?: Ref<SVGElement | undefined>;
}

function makeArrowLine(LineInfo: LineInfo, svgId: string) {
  const { x1, x2, y1, y2 } = LineInfo;
  const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke-width='0' marker-start='url(#${svgId}-l)' marker-end='url(#arrow)' />`;
  const linePath = `<marker id='${svgId}-l' markerHeight='10' refX='0' refY='5' orient='auto' markerUnits='userSpaceOnUse'>
    <path d='M0,5 L5,0 L10,5 L5,10 z' fill='#f00'/>
  </marker>`;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  group.innerHTML = linePath + line;
  SvgIdMap.set(svgId, group);
  return group;
}

function makeLine(LineInfo: LineInfo, svgId: string) {
  const { x1, x2, y1, y2 } = LineInfo;
  const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke-width='1' stroke='#f00' />`;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  group.innerHTML = line;
  SvgIdMap.set(svgId, group);
  return group;
}

function makeRect(RectInfo: RectInfo, svgId: string) {
  const { x, y } = RectInfo;
  const rect = `<rect start='${x},${y}' x='${x}' y='${y}' width='1' height='1' stroke-width='1' stroke='#f00' fill='none' />`;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  group.innerHTML = rect;
  SvgIdMap.set(svgId, group);
  return group;
}

function makePencil(PencilInfo: PencilInfo, svgId: string) {
  const { mx, my } = PencilInfo;
  const line = `<path d='M${mx},${my} L${mx},${my}' stroke-width='1' stroke='#f00' fill='none' />`;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  group.innerHTML = line;
  SvgIdMap.set(svgId, group);
  return group;
}

function makeText(RectInfo: RectInfo, svgId: string) {
  const { x, y } = RectInfo;
  const text = `<text x='${x}' y='${y}' />`;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  group.innerHTML = rect;
  SvgIdMap.set(svgId, group);
  return group;
}

function makeTextEditor(RectInfo: RectInfo, svgId: string, area: SVGElement) {
  const { x, y } = RectInfo;
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('x', x.toString());
  foreignObject.setAttribute('y', y.toString());
  foreignObject.classList.add('relative');

  const editor = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  editor.className += 'text-red-600 min-w-2 border border-gray-600 absolute z-99';
  editor.setAttribute('contenteditable', 'true');
  editor.setAttribute('id', `${svgId}-editor`);
  area.appendChild(foreignObject);
  foreignObject.append(editor);
  editor.focus();
  return editor;
}

interface setArrowParams {
  x: number;
  y: number;
  paintArea?: Ref<SVGElement | undefined>;
}

type setLineParams = setArrowParams;

type usePaintResult = [
  Ref<SVGElement | undefined>,
  Ref<paintTypeEnum>,
  { switchType: (type: paintTypeEnum) => void; removeGroup: (svgId: string) => void },
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

function stopPaint(paintStatus: Ref<boolean>, current: currentParams) {
  paintStatus.value = false;
  current.svgElement = [];
}

function removeGroup(svgId: string) {
  if (SvgIdMap.has(svgId)) {
    SvgIdMap.get(svgId)!.remove();
    SvgIdMap.delete(svgId);
  }
}

export function usePaint(): usePaintResult {
  const paintArea = ref<SVGElement>();
  const paintType = ref<paintTypeEnum>(paintTypeEnum.arrow);

  const paintStatus = ref(false);

  const current: currentParams = reactive({});
  // 设置箭头起点
  function setArrowStart({ x, y }: setArrowParams) {
    const svgId = buildShortUUID('mark');
    const arrow = makeArrowLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(arrow);
    current.svgElement = [
      arrow.querySelector('line')!,
      arrow.querySelector('path')!,
      arrow.querySelector('marker')!,
    ];
    return arrow;
  }
  // 设置箭头终点
  function setArrowEnd({ x, y }: setArrowParams) {
    const arrow = current.svgElement[0];
    const x1 = parseFloat(arrow.getAttribute('x1')!);
    const y1 = parseFloat(arrow.getAttribute('y1')!);
    const len = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) + 3;
    const linePath = current.svgElement[1];
    current.svgElement[2].setAttribute('markerWidth', len.toString());
    linePath?.setAttribute('d', `M0,4 L${len - 4},1 L${len},5 L${len - 4},9 L0,6 z`);
    arrow?.setAttribute('x2', x.toString());
    arrow?.setAttribute('y2', y.toString());
  }
  // 箭头绘制模式
  function paintArrow() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setArrowStart({ x: e.offsetX, y: e.offsetY });
      paintStatus.value = true;
      // 节流一半的move事件
      let step = 1;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value || step++ < 3) return;
        step = 1;
        setArrowEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        stopPaint(paintStatus, current);
      };
    };
  }
  // 设置直线起点
  function setLineStart({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const line = makeLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(line);
    current.svgElement = [line.querySelector('line')!];
    return line;
  }
  // 设置直线终点
  function setLineEnd({ x, y }: setLineParams) {
    const line = current.svgElement[0];
    line?.setAttribute('x2', x.toString());
    line?.setAttribute('y2', y.toString());
  }
  // 直线绘制模式
  function paintLine() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setLineStart({ x: e.offsetX, y: e.offsetY });
      paintStatus.value = true;
      // 节流一半的move事件
      let step = 1;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value || step++ < 3) return;
        step = 1;
        setLineEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        stopPaint(paintStatus, current);
      };
    };
  }

  // 设置矩形起点
  function setRectStart({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const rect = makeRect({ x, y, width: 1, height: 1 }, svgId);
    paintArea.value!.appendChild(rect);
    current.svgElement = [rect.querySelector('rect')!];
    return rect;
  }
  // 设置矩形终点
  function setRectEnd({ x, y }: setLineParams) {
    const rect = current.svgElement[0];
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
  function paintRect() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setRectStart({ x: e.offsetX, y: e.offsetY });
      paintStatus.value = true;
      // 节流一半的move事件
      let step = 1;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value || step++ < 3) return;
        step = 1;
        setRectEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        stopPaint(paintStatus, current);
      };
    };
  }
  // 设置线条起点
  function setPencilStart({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const pencil = makePencil({ mx: x, my: y }, svgId);
    paintArea.value!.appendChild(pencil);
    current.svgElement = [pencil.querySelector('path')!];
    return pencil;
  }
  // 设置线条终点
  function setPencilEnd({ x, y }: setLineParams) {
    const line = current.svgElement[0];
    let d = line.getAttribute('d')!;
    d += ` L${x},${y}`;
    line.setAttribute('d', d);
  }
  // 线条绘制模式
  function paintPencil() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setPencilStart({ x: e.offsetX, y: e.offsetY });
      paintStatus.value = true;
      // 节流一半的move事件
      let step = 1;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value || step++ < 3) return;
        step = 1;
        setPencilEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        stopPaint(paintStatus, current);
      };
    };
  }

  // 设置文字位置
  function setText({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const text = makeText({ mx: x, my: y }, svgId);
    paintArea.value!.appendChild(text);
    current.svgElement = [text.querySelector('path')!];
    return text;
  }

  function paintText() {
    const area = unref(paintArea)!;
    area.onclick = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      const svgId = buildShortUUID('mark');
      const editor = makeTextEditor({ x: e.offsetX, y: e.offsetY }, svgId, area);
    };
  }

  const paintTypeFn = {
    [paintTypeEnum.line]: paintLine,
    [paintTypeEnum.arrow]: paintArrow,
    [paintTypeEnum.text]: paintText,
    [paintTypeEnum.rect]: paintRect,
    [paintTypeEnum.pencil]: paintPencil,
  };

  function switchType(type: paintTypeEnum) {
    paintType.value = type;
    paintArea.value!.onmousedown = null;
    paintArea.value!.onmousemove = null;
    paintArea.value!.onclick = null;
    paintArea.value!.onmouseup = null;
    paintTypeFn[type]();
  }

  onMounted(() => {
    switchType(paintTypeEnum.arrow);
    paintArea.value!.onmouseleave = () => {
      stopPaint(paintStatus, current);
    };
  });
  return [paintArea, paintType, { switchType, removeGroup }];
}
