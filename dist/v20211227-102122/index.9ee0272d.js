import{D as h,r as s,j as v,u as e,F as x,G as y,v as j,a9 as w,K as H,N as f,Z as l,a_ as b}from"./vendor.1ce5b3a9.js";/* empty css               */import{u as S}from"./useWindowSizeFn.31db8a65.js";import{p as z,a as C,_ as R}from"./index.b82b58bf.js";import{a as F}from"./useContentViewHeight.0badcf2d.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const k=["src"],B=h({props:{frameSrc:z.string.def("")},setup(p){const n=s(!0),u=s(50),i=s(window.innerHeight),o=s(),{headerHeightRef:m}=F(),{prefixCls:r}=C("iframe-page");S(d,150,{immediate:!0});const c=v(()=>({height:`${e(i)}px`}));function d(){const a=e(o);if(!a)return;const t=m.value;u.value=t,i.value=window.innerHeight-t;const g=document.documentElement.clientHeight-t;a.style.height=`${g}px`}function _(){n.value=!1,d()}return(a,t)=>(x(),y("div",{class:f(e(r)),style:l(e(c))},[j(e(b),{spinning:n.value,size:"large",style:l(e(c))},{default:w(()=>[H("iframe",{src:p.frameSrc,class:f(`${e(r)}__main`),ref_key:"frameRef",ref:o,onLoad:_},null,42,k)]),_:1},8,["spinning","style"])],6))}});var E=R(B,[["__scopeId","data-v-7cb5d70d"]]);export{E as default};
