import { Ref } from 'vue';

const areaMap = new Map<SVGElement, areaParams>();

export interface areaParams {
  paintArea?: Ref<SVGElement | undefined>;
  paintType: Ref<paintTypeEnum>;
  paintStatus: Ref<boolean>;
  currentTarget: { svgElement: SVGElement[]; svgId?: string };
  moveStatus: Ref<boolean>;
  moveTarget: Ref<SVGElement | undefined>;
  moveType: Ref<groupType | undefined>;
  svgIdMap: Map<string, SVGGElement>;
}

export enum paintTypeEnum {
  line = 'line',
  select = 'select',
  arrow = 'arrow',
  text = 'text',
  pencil = 'pencil',
  rect = 'rect',
}

interface setSvgIdParams {
  g: SVGGElement;
  svgId: string;
  area: SVGElement;
}

export type groupType = 'text' | 'rect' | 'line' | 'path' | 'arrow';

export function getAreaInfo(area: SVGElement) {
  return areaMap.get(area)!;
}

export function hasAreaInfo(area: SVGElement) {
  return areaMap.has(area);
}

export function setAreaInfo(area: SVGElement, areaParams: areaParams) {
  return areaMap.set(area, areaParams);
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

export function setSvgId({ svgId, g, area }: setSvgIdParams) {
  const { svgIdMap, currentTarget } = getAreaInfo(area);
  svgIdMap.set(svgId, g);
  currentTarget.svgId = svgId;
}

export function warn(info: string) {
  console.warn(`[svg-mark warn]:${info}`);
}
