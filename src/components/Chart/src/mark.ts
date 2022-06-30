import { reactive, ref, unref, onMounted, Ref } from 'vue';
import { buildShortUUID } from '/@/utils/uuid';

const SvgIdMap = new Map<string, SVGGElement>();

interface currentParams {
  svgElement: SVGElement[];
  svgId?: string;
  paintArea?: Ref<SVGElement | undefined>;
}

interface setSvgIdParams {
  g: SVGGElement;
  svgId: string;
  current: currentParams;
}

function setSvgId({ svgId, g, current }: setSvgIdParams) {
  if (g.getAttribute('mark-type') === 'text') {
  }
  SvgIdMap.set(svgId, g);
  current.svgId = svgId;
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

interface makeShadowParams {
  g: SVGGElement;
}

type groupType = 'text' | 'rect' | 'line' | 'path' | 'arrow';

function stopPaint(paintStatus: Ref<boolean>, current: currentParams) {
  paintStatus.value = false;
  const g = SvgIdMap.get(current.svgId!)!;
  const { width, height } = g.getBoundingClientRect();
  if (width < 4 && height < 4) {
    removeGroup(current.svgId!);
  }
  current.svgElement = [];
}

function removeGroup(svgId: string) {
  if (SvgIdMap.has(svgId)) {
    SvgIdMap.get(svgId)!.remove();
    SvgIdMap.delete(svgId);
  }
}

function createGroup(svgId: string) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  return group;
}

export function usePaint(): usePaintResult {
  const paintArea = ref<SVGElement>();
  const paintType = ref<paintTypeEnum>(paintTypeEnum.select);

  const paintStatus = ref(false);

  const current: currentParams = reactive({
    svgElement: [],
    svgId: '',
  });
  function makeArrowLine(LineInfo: LineInfo, svgId: string) {
    const { x1, x2, y1, y2 } = LineInfo;
    const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' class='arrow-line' marker-start='url(#${svgId}-l)' marker-end='url(#arrow)' />`;
    const linePath = `<defs><marker id='${svgId}-l' markerHeight='10' refX='0' refY='5' orient='auto' markerUnits='userSpaceOnUse' >
      <path d='M0,5 L5,0 L10,5 L5,10 z' class='arrow-path' />
    </marker></defs>`;
    const group = createGroup(svgId);
    group.innerHTML = linePath + line;
    group.setAttribute('mark-type', 'arrow');
    SvgIdMap.set(svgId, group);
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
    group.setAttribute('id', svgId);
    group.setAttribute('mark-type', 'text');
    group.appendChild(foreignObject);
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
        removeGroup(group.getAttribute('id')!);
      } else {
        text.setAttribute('contenteditable', 'false');
        text.classList.add('w-fit');
        text.classList.replace('border-gray-300', 'border-transparent');
        const { width } = text.getBoundingClientRect();
        group.setAttribute('width', `${width}`);
        foreignObject.setAttribute('width', `${width}`);
      }
    };
    return { group, text };
  }
  // 设置箭头起点
  function setArrowStart({ x, y }: setArrowParams) {
    const svgId = buildShortUUID('mark');
    const arrow = makeArrowLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
    paintArea.value!.appendChild(arrow);
    current.svgElement = [
      arrow.querySelector('.arrow-line')!,
      arrow.querySelector('path')!,
      arrow.querySelector('marker')!,
    ];
    setSvgId({ g: arrow, svgId, current });
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
    setSvgId({ g: line, svgId, current });
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
    setSvgId({ g: rect, svgId, current });
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
    setSvgId({ g: pencil, svgId, current });
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

  function paintText() {
    const area = unref(paintArea)!;
    area.onclick = (e: MouseEvent) => {
      if ((e.target as Element).hasAttribute('contenteditable')) return;
      if (e.ctrlKey || e.altKey || e.button > 0 || paintStatus.value) return;
      const svgId = buildShortUUID('mark');
      const { group, text } = makeText({ x: e.offsetX, y: e.offsetY }, svgId);
      setSvgId({ g: group, svgId, current });
      area.appendChild(group);
      Promise.resolve().then(() => text.focus());
    };
  }

  function makeShadow({ g }: makeShadowParams) {
    function textShadow() {
      // 不用
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

  const moveStatus = ref(false);
  const moveType = ref<groupType | ''>('');
  const moveTarget = ref<SVGElement>();

  function getMoveTarget(g: SVGGElement) {
    const selector = {
      text: '.text',
      arrow: '.arrow-line',
      line: '.line',
      rect: '.rect',
      pencil: '.pencil',
    };
    const target: SVGElement = g.querySelector(selector[moveType.value])!;
    return target;
  }

  function removeShadow(svg: SVGGElement) {
    ['.arrow-line-shadow', '.line-shadow', '.rect-shadow', '.pencil-shadow'].forEach((selector) =>
      svg.querySelector(selector)?.remove(),
    );
  }

  function selectMode() {
    const start = { x: 0, y: 0 };
    const area = unref(paintArea)!;
    area.onmousemove = (e) => {
      if (!moveStatus.value) return;
      moveTarget.value?.setAttribute(
        'transform',
        `translate(${e.offsetX - start.x},${e.offsetY - start.y})`,
      );
    };

    SvgIdMap.forEach((svg) => {
      svg.classList.add('selected-light');
      makeShadow({ g: svg });
      svg.onmousedown = (e) => {
        moveStatus.value = true;
        moveType.value = svg.getAttribute('mark-type') as groupType;
        moveTarget.value = getMoveTarget(svg);
        const [x, y] = (moveTarget.value.getAttribute('transform') ?? '0,0')
          .match(/\-?\d+/g)!
          .map((str) => parseFloat(str));
        console.log(x, y);

        start.x = e.offsetX - x;
        start.y = e.offsetY - y;
        removeShadow(svg);
        area.onmouseup = () => {
          moveStatus.value = false;
          makeShadow({ g: svg });
          moveTarget.value = void 0;
          moveType.value = '';
        };
      };
    });
  }

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
    SvgIdMap.forEach((svg) => {
      svg.classList.remove('selected-light');
      // 移除影子
      removeShadow(svg);
    });
    paintArea.value!.onmousedown = null;
    paintArea.value!.onmousemove = null;
    paintArea.value!.onclick = null;
    paintArea.value!.onmouseup = null;
    paintTypeFn[type]();
  }

  onMounted(() => {
    switchType(paintTypeEnum.arrow);
    paintArea.value!.onmouseleave = () => {
      if (paintStatus.value) {
        stopPaint(paintStatus, current);
      }
    };
  });
  return [paintArea, paintType, { switchType, removeGroup }];
}
