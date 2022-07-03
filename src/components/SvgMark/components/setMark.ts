import { getAreaInfo, groupType, paintTypeEnum, removeGroup, setSvgId } from './group';
import {
  makeArrowLine,
  makeLine,
  makeRect,
  makeText,
  makePencil,
  removeShadow,
  makeShadow,
} from './mark';
import { buildShortUUID } from '/@/utils/uuid';
import { stopPaint } from '../mark';
import { useMagicKeys } from '@vueuse/core';
import { watchEffect } from 'vue';

interface setArrowParams {
  x: number;
  y: number;
  area: SVGElement;
}

type setLineParams = setArrowParams;
type setRectParams = setArrowParams;
type setPencilParams = setArrowParams;

// 设置箭头起点
export function setArrowStart({ x, y, area }: setArrowParams) {
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
export function setArrowEnd({ x, y, area }: setArrowParams) {
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
export function paintArrow(area: SVGElement) {
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
export function setLineStart({ x, y, area }: setLineParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const line = makeLine({ x1: x, x2: x, y1: y, y2: y }, svgId);
  area.appendChild(line);
  currentTarget.svgElement = [line.querySelector('line')!];
  setSvgId({ g: line, svgId, area });
  return line;
}
// 设置直线终点
export function setLineEnd({ x, y, area }: setLineParams) {
  const { currentTarget } = getAreaInfo(area);
  const line = currentTarget.svgElement[0];
  line?.setAttribute('x2', x.toString());
  line?.setAttribute('y2', y.toString());
}
// 直线绘制模式
export function paintLine(area: SVGElement) {
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
export function setRectStart({ x, y, area }: setRectParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const rect = makeRect({ x, y, width: 1, height: 1 }, svgId);
  area.appendChild(rect);
  currentTarget.svgElement = [rect.querySelector('rect')!];
  setSvgId({ g: rect, svgId, area });
  return rect;
}
// 设置矩形终点
export function setRectEnd({ x, y, area }: setRectParams) {
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
export function paintRect(area: SVGElement) {
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
export function setPencilStart({ x, y, area }: setPencilParams) {
  const { currentTarget } = getAreaInfo(area);
  const svgId = buildShortUUID('mark');
  const pencil = makePencil({ mx: x, my: y }, svgId);
  area.appendChild(pencil);
  currentTarget.svgElement = [pencil.querySelector('path')!];
  setSvgId({ g: pencil, svgId, area });
  return pencil;
}
// 设置线条终点
export function setPencilEnd({ x, y, area }: setPencilParams) {
  const { currentTarget } = getAreaInfo(area);
  const line = currentTarget.svgElement[0];
  let d = line.getAttribute('d')!;
  d += ` L${x},${y}`;
  line.setAttribute('d', d);
}
// 线条绘制模式
export function paintPencil(area: SVGElement) {
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
export function paintText(area: SVGElement) {
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

export function selectMode(area: SVGElement) {
  const { svgIdMap, moveStatus, moveTarget, moveType, currentTarget, paintType } =
    getAreaInfo(area);
  svgIdMap.forEach((svg) => {
    svg.classList.add('hover-light');
    makeShadow({ g: svg });
  });
  currentTarget.svgElement.length = 0;
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
  };
  area.onclick = (e) => {
    const multi = e.ctrlKey;
    const svg = (e.target as SVGElement).closest('g');
    // 多选不清除
    if (!multi) {
      currentTarget.svgElement.forEach((svg) => svg.classList.remove('mark-selected'));
      currentTarget.svgElement.length = 0;
    }
    if (!svg) {
      // 点到空白区
      return;
    }
    // 点中已有的就取消它的选中状态
    const index = currentTarget.svgElement.findIndex((_svg) => _svg === svg);
    if (index > -1) {
      currentTarget.svgElement.splice(index, 1);
    }
    currentTarget.svgElement.push(svg);
    svg?.classList.add('mark-selected');
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
}
