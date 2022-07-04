import { Ref } from 'vue';

interface setSvgIdParams {
  g: SVGGElement;
  svgId: string;
  area: SVGElement;
}

export enum paintTypeEnum {
  line = 'line',
  select = 'select',
  arrow = 'arrow',
  text = 'text',
  pencil = 'pencil',
  rect = 'rect',
}

export type groupType = 'text' | 'rect' | 'line' | 'path' | 'arrow';

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
  textNode: Set<SVGElement>;
  svgDataInfo: Ref<svgDataInfo[]>;
}

export function getAreaInfo(area: SVGElement) {
  return areaMap.get(area)!;
}

export function hasAreaInfo(area: SVGElement) {
  return areaMap.has(area);
}

export function setAreaInfo(area: SVGElement, areaParams: areaParams) {
  return areaMap.set(area, areaParams);
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

export interface svgDataInfo {
  tag: string;
  attrs: Array<{ [x: string]: string }>;
  children: (svgDataInfo | string)[];
}

export function getNodeData(svg: SVGElement) {
  const svgDataInfo: svgDataInfo = {
    tag: svg.tagName,
    attrs: [],
    children: [],
  };
  if (svg.tagName === 'DIV') {
    svgDataInfo.children.push(svg.innerHTML);
    return svgDataInfo;
  } else {
    const children = Array.from(svg.children) as SVGElement[];
    const attrs = Array.from(svg.attributes);
    for (const attr of attrs) {
      svgDataInfo.attrs.push({ [attr.name]: attr.value });
    }
    if (children.length > 0) {
      children.forEach((node) => {
        const info = getNodeData(node);
        svgDataInfo.children.push(info);
      });
    }
  }
  return svgDataInfo;
}
