import { remove } from 'lodash-es';
import { TreeItem } from '../Tree';

export function useHighLight(
  HIGHTLIGHT: string
): [TreeItem[], { setHighLight: Fn; clearHightLight: Fn; insertHightListNode: Fn }] {
  const hightlightList: TreeItem[] = [];
  function setHighLight(parentNode: TreeItem, id: number) {
    const node = parentNode.children!.find((item) => {
      Reflect.deleteProperty(item, 'class');
      return item.id === id;
    })!;
    node.class = HIGHTLIGHT;
    hightlightList.push(node);
  }
  function clearHightLight() {
    hightlightList.forEach((item) => {
      Reflect.deleteProperty(item, 'class');
    });
    remove(hightlightList, (_) => _);
  }
  function insertHightListNode(node: TreeItem) {
    node.class = HIGHTLIGHT;
    hightlightList.push(node);
  }
  return [hightlightList, { setHighLight, clearHightLight, insertHightListNode }];
}
