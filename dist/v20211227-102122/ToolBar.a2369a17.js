var V=Object.defineProperty,F=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var z=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var _=(s,e,t)=>e in s?V(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,f=(s,e)=>{for(var t in e||(e={}))z.call(e,t)&&_(s,t,e[t]);if(j)for(var t of j(e))D.call(e,t)&&_(s,t,e[t]);return s},b=(s,e)=>F(s,S(e));import{D as E,bd as T,R as M,r as y,F as N,G as O,v as n,a9 as l,u as a,aH as k,aU as B,L as C,a1 as P,bv as w,m as I}from"./vendor.2e1d877b.js";/* empty css               */import{f as K}from"./helper.3f416d3d.js";import{e as A,f as G,h as H,t as $,i as h,j as R}from"./hooks.ef8c9d99.js";import{u as W,aj as J,aT as Q,_ as X,b as Y,aU as Z,aV as ee}from"./index.86e9d70c.js";import{b as te}from"./download.682bfe84.js";import{B as ae}from"./index.d3318532.js";import se from"./ToolBarPageConfig.1a022eca.js";import oe from"./ToolBarEdit.ba16b8bc.js";import"./onMountedOrActivated.9356963a.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";/* empty css               */import"./index.f3cbd9f4.js";import"./useTimeout.534f4a33.js";import"./useWindowSizeFn.752f6aa7.js";import"./index.0fb85ddd.js";/* empty css               *//* empty css                *//* empty css                */import"./uuid.4c14c5c2.js";/* empty css                *//* empty css                *//* empty css               */import"./ColorSchemeSelector.a4422011.js";/* empty css              */const{uploadUrl:ie=""}=W();function ne(s,e){return J.uploadFile({url:ie,onUploadProgress:e},b(f({name:"files"},s),{data:b(f({},s.data),{token:Q()})}))}const le={class:"flex items-center justify-between p-2 mb-2 bg-white border hover:shadow toolbar"},re=E({setup(s){const e=T.TabPane,{t}=Y(),g=M({list:["pageConfig","edit","insert","tool"],key:"edit"}),r=A(),m=G(),U=H(),{getUniqueField:x}=K(U.value),v=y(!1);async function q(d){switch(d){case"insertText":const i=I($);i.uniqId=x(),h(m,r,i);break;case"remove":w(m.value,c=>(c.type==="Img"&&w(p.value,u=>u===c.config.url),r.value.some(u=>c.uniqId===u.uniqId)));break;case"saveImg":r.value=[],v.value=!0,await P();const o=await Z({dom:document.getElementById("page-box").getElementsByClassName("pages")[0],type:ee.BLOB,scale:4});te(o,"report.jpg"),v.value=!1;break}}const p=y([]);function L(d){d.forEach(i=>{const o=I(R);o.config.url=i,o.uniqId=x(),h(m,r,o)})}return(d,i)=>(N(),O("div",le,[n(a(T),{activeKey:a(g).key,"onUpdate:activeKey":i[2]||(i[2]=o=>a(g).key=o),size:"small"},{default:l(()=>[n(a(e),{key:"pageConfig",tab:a(t)("templateView.toolbar.toolBarMenu.pageConfig"),class:"flex items-center gap-4"},{default:l(()=>[n(se)]),_:1},8,["tab"]),n(a(e),{key:"edit",tab:a(t)("templateView.toolbar.toolBarMenu.edit"),class:"flex gap-4"},{default:l(()=>[n(oe)]),_:1},8,["tab"]),n(a(e),{key:"insert",tab:a(t)("templateView.toolbar.toolBarMenu.insert"),class:"flex gap-4"},{default:l(()=>[n(a(k),{size:"small",onClick:i[0]||(i[0]=o=>q("insertText"))},{default:l(()=>[B(C(a(t)("templateView.toolbar.insertText.btn")),1)]),_:1}),n(a(ae),{maxSize:6,maxNumber:12,onChange:L,api:a(ne),size:"small",value:p.value,"onUpdate:value":i[1]||(i[1]=o=>p.value=o)},{btn:l(({onClick:o})=>[n(a(k),{size:"small",onClick:o},{default:l(()=>[B(C(a(t)("templateView.toolbar.insertImg.btn")),1)]),_:2},1032,["onClick"])]),_:1},8,["api","value"])]),_:1},8,["tab"])]),_:1},8,["activeKey"])]))}});var ze=X(re,[["__scopeId","data-v-4d6a4075"]]);export{ze as default};
