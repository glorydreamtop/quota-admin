import Aegis from 'aegis-web-sdk';

export function setupAegisSDK() {
  return new Aegis({
    id: 'jyD6daAokR85AR4Wo1', // 上报 id
    uin: '', // 用户唯一 ID（可选）
    reportApiSpeed: true, // 接口测速
    reportAssetSpeed: true, // 静态资源测速
    spa: true, // spa 应用页面跳转的时候开启 pv 计算
  });
}
