import { createGroup } from './group';

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

interface makeShadowParams {
  g: SVGGElement;
}

export function makeShadow({ g }: makeShadowParams) {
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

export function removeShadow(svg: SVGGElement) {
  ['.arrow-line-shadow', '.line-shadow', '.rect-shadow', '.pencil-shadow'].forEach((selector) =>
    svg.querySelector(selector)?.remove(),
  );
}

export function makeArrowLine(LineInfo: LineInfo, svgId: string) {
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

export function makeLine(LineInfo: LineInfo, svgId: string) {
  const { x1, x2, y1, y2 } = LineInfo;
  const line = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' class='line' />`;
  const group = createGroup(svgId);
  group.innerHTML = line;
  group.setAttribute('mark-type', 'line');
  return group;
}

export function makeRect(RectInfo: RectInfo, svgId: string) {
  const { x, y } = RectInfo;
  const rect = `<rect start='${x},${y}' x='${x}' y='${y}' width='1' height='1' class='rect' />`;
  const group = createGroup(svgId);
  group.innerHTML = rect;
  group.setAttribute('mark-type', 'rect');
  return group;
}

export function makePencil(PencilInfo: PencilInfo, svgId: string) {
  const { mx, my } = PencilInfo;
  const path = `<path d='M${mx},${my} L${mx},${my}' class='pencil' />`;
  const group = createGroup(svgId);
  group.innerHTML = path;
  group.setAttribute('mark-type', 'pencil');
  return group;
}

export function makeText(RectInfo: RectInfo, svgId: string) {
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
