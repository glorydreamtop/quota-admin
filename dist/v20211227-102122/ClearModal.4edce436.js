import{_ as B,I as E,h as x}from"./index.b82b58bf.js";import{D as v,bH as C,aH as D,ah as h,r as m,a2 as a,F as j,a3 as k,a9 as i,K as o,v as c,u as M,aU as f}from"./vendor.1ce5b3a9.js";/* empty css               *//* empty css               */import{B as b,b as R}from"./index.fa044461.js";import{d as A}from"./index.ed64d4ee.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";import"./useTimeout.9c582638.js";import"./useWindowSizeFn.31db8a65.js";import"./index.f2f6fea5.js";import"./quotaEnum.42e6645f.js";const w=v({components:{Icon:E,BasicModal:b,RangePicker:C.RangePicker,Button:D,Tooltip:h},setup(){const e=m([]),[n,{closeModal:l}]=R(s=>{e.value=s}),u=m([]),{createMessage:d}=x();async function p(){const[s,r]=M(u).map(t=>t.format("YYYY-MM-DD"));try{await A({indexList:e.value.map(t=>t.id).join(","),startDate:s,endDate:r}),u.value=[],d.success("\u6E05\u9664\u6210\u529F"),l()}catch{}}return{register:n,timeRange:u,del:p}}}),y={class:"flex flex-col items-center gap-4"},I=o("div",{class:"text-lg px-8 text-center flex flex-col"},[o("span",{class:"text-sm text-gray-600"},"\u6CE8\uFF1A\u6E05\u9664\u6570\u636E\u4E0D\u4F1A\u5220\u6389\u8FD9\u4E9B\u6307\u6807")],-1),P={class:"text-gray-500"},T=o("span",null,"\u8BF7\u9009\u62E9\u6E05\u9664\u533A\u95F4\uFF1A",-1),Y=f(" \u8BF7\u624B\u52A8\u5B8C\u6210\u9009\u62E9\uFF0C\u7CFB\u7EDF\u4E0D\u4F1A\u9884\u8BBE\u65E5\u671F "),$=f("\u6211\u5DF2\u786E\u8BA4\uFF0C\u6E05\u9664\u8FD9\u4E9B\u6307\u6807\u7684\u6570\u636E");function q(e,n,l,u,d,p){const s=a("Icon"),r=a("Tooltip"),t=a("RangePicker"),_=a("Button"),F=a("BasicModal");return j(),k(F,{onRegister:e.register,title:"\u8C28\u614E\u64CD\u4F5C","show-cancel-btn":!1,"show-ok-btn":!1},{default:i(()=>[o("div",y,[I,o("div",null,[o("div",P,[T,c(r,{placement:"right"},{title:i(()=>[Y]),default:i(()=>[c(s,{icon:"ant-design:question-circle-outlined"})]),_:1})]),c(t,{value:e.timeRange,"onUpdate:value":n[0]||(n[0]=g=>e.timeRange=g)},null,8,["value"])]),c(_,{type:"danger",size:"large",class:"mt-4",onClick:e.del},{default:i(()=>[$]),_:1},8,["onClick"])])]),_:1},8,["onRegister"])}var J=B(w,[["render",q]]);export{J as default};
