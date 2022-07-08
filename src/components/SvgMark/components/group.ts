import { getAreaInfo } from './utils';

export enum paintTypeEnum {
  line = 'line',
  select = 'select',
  arrow = 'arrow',
  text = 'text',
  pencil = 'pencil',
  rect = 'rect',
}

export function removeGroup(svgId: string, area: SVGElement) {
  const { svgIdMap } = getAreaInfo(area);
  if (svgIdMap.has(svgId)) {
    svgIdMap.get(svgId)!.remove();
    svgIdMap.delete(svgId);
  }
}

export function createGroup(svgId: string) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', svgId);
  return group;
}

export function clearAll(area: SVGElement) {
  getAreaInfo(area).svgIdMap.forEach((svg) => {
    svg.remove();
  });
  getAreaInfo(area).svgIdMap.clear();
}
