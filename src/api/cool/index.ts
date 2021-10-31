import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetOneSentence = 'https://v1.hitokoto.cn',
}

export function oneSentence() {
  return defHttp.get(
    {
      url: Api.GetOneSentence,
      params: {
        c: 'k',
      },
    },
    {
      isTransformResponse: false,
    }
  );
}
