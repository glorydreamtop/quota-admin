import{D as r,ah as i,a2 as l,F as s,G as a,ab as d,ac as c,N as o,a3 as _,a9 as u,K as n,O as f,P as m}from"./vendor.2e1d877b.js";import{_ as y,a as v}from"./index.86e9d70c.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const h=r({name:"MenuTypePicker",components:{Tooltip:i},props:{menuTypeList:{type:Array,defualt:()=>[]},handler:{type:Function,default:()=>({})},def:{type:String,default:""}},setup(){const{prefixCls:e}=v("setting-menu-type-picker");return{prefixCls:e}}}),C=e=>(f("data-v-119d0732"),e=e(),m(),e),k=["onClick"],$=C(()=>n("div",{class:"mix-sidebar"},null,-1)),T=[$];function g(e,x,b,j,B,I){const p=l("Tooltip");return s(),a("div",{class:o(e.prefixCls)},[(s(!0),a(d,null,c(e.menuTypeList||[],t=>(s(),_(p,{key:t.title,title:t.title,placement:"bottom"},{default:u(()=>[n("div",{onClick:P=>e.handler(t),class:o([`${e.prefixCls}__item`,`${e.prefixCls}__item--${t.type}`,{[`${e.prefixCls}__item--active`]:e.def===t.type}])},T,10,k)]),_:2},1032,["title"]))),128))],2)}var w=y(h,[["render",g],["__scopeId","data-v-119d0732"]]);export{w as default};
