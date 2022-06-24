import { reactive, ref, unref, onMounted, Ref } from 'vue';
import { buildShortUUID } from '/@/utils/uuid';

const SvgIdMap = new Map();

interface currentParams {
  svgElement?: SVGElement;
  paintArea?: Ref<HTMLElement | undefined>;
}

function parseDom(arg: string) {
  const div = document.createElement('div');
  div.innerHTML = arg;
  return div.children[0].cloneNode(true);
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

interface setArrowParams {
  x: number;
  y: number;
  paintArea?: Ref<HTMLElement | undefined>;
}

type setLineParams = setArrowParams;

type usePaintResult = [
  Ref<HTMLDivElement | undefined>,
  Ref<paintTypeEnum>,
  { switchType: (type: paintTypeEnum) => void },
];
interface LineInfo {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export enum paintTypeEnum {
  line = 'line',
  select = 'select',
  arrow = 'arrow',
  text = 'text',
  pencil = 'pencil',
  rect = 'rect',
}

export function usePaint(): usePaintResult {
  const paintArea = ref<HTMLDivElement>();
  const paintType = ref<paintTypeEnum>(paintTypeEnum.arrow);

  const paintStatus = ref(false);

  const current: currentParams = reactive({});
  // 设置箭头起点
  function setArrowStart({ x, y }: setArrowParams) {
    const svgId = buildShortUUID('mark');
    const arrow = makeArrowLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(arrow);
    current.svgElement = arrow;
    return arrow;
  }
  // 设置箭头终点
  function setArrowEnd({ x, y }: setArrowParams) {
    const arrow = current.svgElement!.querySelector('line')!;
    const x1 = parseFloat(arrow.getAttribute('x1')!);
    const y1 = parseFloat(arrow.getAttribute('y1')!);
    const len = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) + 3;
    const linePath = current.svgElement?.querySelector('path');
    current.svgElement!.querySelector('marker')!.setAttribute('markerWidth', len.toString());
    linePath?.setAttribute('d', `M0,4 L${len - 4},1 L${len},5 L${len - 4},9 L0,6 z`);
    arrow?.setAttribute('x2', x.toString());
    arrow?.setAttribute('y2', y.toString());
  }
  // 箭头绘制模式
  function paintArrow() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setArrowStart({ x: e.offsetX, y: e.offsetY, paintArea });
      paintStatus.value = true;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value) return;
        setArrowEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        paintStatus.value = false;
      };
    };
  }
  // 设置直线起点
  function setLineStart({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const line = makeLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(line);
    current.svgElement = line;
    return line;
  }
  // 设置直线终点
  function setLineEnd({ x, y }: setLineParams) {
    const line = current.svgElement!.querySelector('line')!;
    line?.setAttribute('x2', x.toString());
    line?.setAttribute('y2', y.toString());
  }
  // 直线绘制模式
  function paintLine() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setLineStart({ x: e.offsetX, y: e.offsetY, paintArea });
      paintStatus.value = true;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value) return;
        setLineEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        paintStatus.value = false;
      };
    };
  }

  // 设置矩形起点
  function setRectStart({ x, y }: setLineParams) {
    const svgId = buildShortUUID('mark');
    const line = makeLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(line);
    current.svgElement = line;
    return line;
  }
  // 设置矩形终点
  function setRectEnd({ x, y }: setLineParams) {
    const line = current.svgElement!.querySelector('line')!;
    line?.setAttribute('x2', x.toString());
    line?.setAttribute('y2', y.toString());
  }
  // 矩形绘制模式
  function paintRect() {
    const area = unref(paintArea)!;
    area.onmousedown = (e: MouseEvent) => {
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      setLineStart({ x: e.offsetX, y: e.offsetY, paintArea });
      paintStatus.value = true;
      area.onmousemove = (e: MouseEvent) => {
        if (!paintStatus.value) return;
        setLineEnd({ x: e.offsetX, y: e.offsetY });
      };
      area.onmouseup = () => {
        paintStatus.value = false;
      };
    };
  }

  function paintText() {}

  const paintTypeFn = {
    [paintTypeEnum.line]: paintLine,
    [paintTypeEnum.arrow]: paintArrow,
    [paintTypeEnum.text]: paintText,
    [paintTypeEnum.rect]: paintRect(),
  };

  function switchType(type: paintTypeEnum) {
    paintType.value = type;
    paintTypeFn[type]();
  }

  onMounted(() => {
    // paintLine();
  });
  return [paintArea, paintType, { switchType }];
}
