import{bm as o,bn as d,W as a}from"./vendor.1ce5b3a9.js";function c(s,i=150,n){let e=()=>{s()};e=a(e,i);const t=()=>{n&&n.immediate&&e(),window.addEventListener("resize",e)},r=()=>{window.removeEventListener("resize",e)};return o(()=>{t()}),d(()=>{r()}),[t,r]}export{c as u};
