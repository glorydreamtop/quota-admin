import{_ as p,a as d}from"./index.b82b58bf.js";import{b as m}from"./index.b61b5166.js";import{D as l,bK as f,a2 as u,F as t,G as n,ab as _,ac as C,N as a,Z as j,v as b}from"./vendor.1ce5b3a9.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";import"./index.f22418d6.js";/* empty css               */import"./useTimeout.9c582638.js";import"./index.f2f6fea5.js";import"./index.9ee0272d.js";import"./useWindowSizeFn.31db8a65.js";import"./useContentViewHeight.0badcf2d.js";/* empty css               */import"./useSortable.8646d18e.js";import"./sortable.esm.c79628ac.js";import"./lock.68546d85.js";/* empty css                */const k=l({name:"ThemeColorPicker",components:{CheckOutlined:f},props:{colorList:{type:Array,defualt:[]},event:{type:Number},def:{type:String}},setup(e){const{prefixCls:i}=d("setting-theme-picker");function o(r){e.event&&m(e.event,r)}return{prefixCls:i,handleClick:o}}}),h=["onClick"];function v(e,i,o,r,x,y){const c=u("CheckOutlined");return t(),n("div",{class:a(e.prefixCls)},[(t(!0),n(_,null,C(e.colorList||[],s=>(t(),n("span",{key:s,onClick:g=>e.handleClick(s),class:a([`${e.prefixCls}__item`,{[`${e.prefixCls}__item--active`]:e.def===s}]),style:j({background:s})},[b(c)],14,h))),128))],2)}var E=p(k,[["render",v]]);export{E as default};