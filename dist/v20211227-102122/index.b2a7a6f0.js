var g=Object.defineProperty,Q=Object.defineProperties;var p=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable;var s=(t,e,a)=>e in t?g(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,i=(t,e)=>{for(var a in e||(e={}))D.call(e,a)&&s(t,a,e[a]);if(d)for(var a of d(e))y.call(e,a)&&s(t,a,e[a]);return t},c=(t,e)=>Q(t,p(e));import{aj as r,ao as x}from"./index.86e9d70c.js";import{C as u}from"./quotaEnum.42e6645f.js";import{d as m}from"./vendor.2e1d877b.js";var o;(function(t){t.GetCategoryTree="/updatemonitor/dict-index/categoryTree",t.UpdateCategoryTree="/updatemonitor/dict-index/categorySaveOrUpdate",t.DelCategoryTree="/updatemonitor/dict-index/categoryDelete",t.GetDirQuota="/index/index",t.SearchQuota="/updatemonitor/dict-index/searchIndex",t.GetQuotaData="/updatemonitor/dict-index/exportData",t.GetQuotaInfo="/updatemonitor/dict-index/queryDictIndex",t.RequestUpdateQuotaData="/dataUpdater/updateIndex",t.MoveQuota="/category/indexMove",t.SortQuota="/category/categorySorting",t.UpdateCategory="/updatemonitor/dict-index/categorySaveOrUpdate",t.SaveQuota="/updatemonitor/dict-index/saveOrUpdateDictIndex",t.DelQuota="/updatemonitor/dict-index/deleteDictIndex",t.DelQuotaData="/updatemonitor/dict-index/deleteDictIndexData",t.ImportQuotaData="/updatemonitor/dict-index/importJson",t.NOCSearch="/updatemonitor/dict-index/getNoCategoryIndex"})(o||(o={}));var l;(function(t){t[t.sys=0]="sys",t[t.user=1]="user",t[t.all=2]="all"})(l||(l={}));var n;(function(t){t.JSON="0",t.XLSX="1",t.CSV="2"})(n||(n={}));var f;(function(t){t.day="\u65E5",t.last="\u671F",t.month="\u6708"})(f||(f={}));function I(t){return r.get({url:o.GetCategoryTree,params:t})}function O(t){return r.get({url:o.GetDirQuota,params:t})}function G(t){return t.flag||(t.flag=2),r.get({url:o.SearchQuota,params:t})}function U(t){return r.request({url:o.NOCSearch,method:"GET",params:t})}function N(t){t.pastValue===0&&(Reflect.deleteProperty(t,"pastValue"),Reflect.deleteProperty(t,"pastUnit"));const e=t.rows.map(a=>m(a,["sourceCode","name","sourceType",a.id?/formula/i.test(a.id.toString())?"":"id":""]));return r.post({url:o.GetQuotaData,responseType:t.exportPara!==n.JSON?"arraybuffer":"json",params:c(i({},t),{rows:e})},{isReturnNativeResponse:t.exportPara!==n.JSON})}function R({id:t,date:e}){const a=[{id:t}];return r.post({url:o.GetQuotaData,params:{endDate:e,lastFlag:!0,rows:a}})}function h(t){return r.request({url:o.GetQuotaInfo,method:"GET",params:t})}function q(t){return r.post({url:o.RequestUpdateQuotaData,params:t},{isTransformResponse:!1})}function j(t){return r.post({url:o.MoveQuota,params:t})}function J(t){const e={[u.sysQuota]:1,[u.userQuota]:1,[u.sysTemplate]:2,[u.userTemplate]:2,[u.folder]:0};return t.type=e[t.type],r.post({url:o.SortQuota,params:t})}function E(t){return r.post({url:o.UpdateCategory,params:t})}function M(t){return r.get({url:o.DelCategoryTree,params:t})}function P(t){return r.post({url:o.SaveQuota,params:t})}function b(t){return r.get({url:o.DelQuota,params:t})}function w(t){return r.request({url:o.ImportQuotaData,method:"POST",params:t,headers:{"Content-Type":x.FORM_URLENCODED}})}function F(t){return r.get({url:o.DelQuotaData,params:t})}export{b as a,I as b,J as c,F as d,P as e,M as f,O as g,U as h,h as i,R as j,N as k,n as l,j as m,w as n,f as q,q as r,G as s,E as u};
