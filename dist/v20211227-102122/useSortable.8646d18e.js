var i=Object.defineProperty;var r=Object.getOwnPropertySymbols;var c=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var o=(e,a,t)=>a in e?i(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,s=(e,a)=>{for(var t in a||(a={}))c.call(a,t)&&o(e,t,a[t]);if(r)for(var t of r(a))u.call(a,t)&&o(e,t,a[t]);return e};import{S as m}from"./sortable.esm.c79628ac.js";import{a1 as f,u as l}from"./vendor.1ce5b3a9.js";function S(e,a){async function t(){if(await f(),!e)return;const n=m.create(l(e),s({animation:150,delay:400,delayOnTouchOnly:!0},a));return n.doms=[],n}return{initSortable:t}}export{S as u};