import{b as S,v as b,t as l,s as m,h as Y}from"./index.b82b58bf.js";import{j as $,m as w,r as h,y as v}from"./vendor.1ce5b3a9.js";const{t:u}=S(),{createMessage:y}=Y(),A=Symbol();function D(t){return m(t,A,{native:!0})}function V(){return l(A)}const C=Symbol();function O(t){return m(t,C,{native:!0})}function Q(){return l(C)}const M=Symbol();function j(t){return m(t,M,{native:!0})}function K(){return l(M)}const I=Symbol();function N(t){return m(t,I,{native:!0})}const T=b();function E(t){const c=$(()=>Reflect.has(t,"yAxis")?t.yAxis.map((s,o)=>({label:`${o+1}/${u("quotaView.advance.axisSetting.yAxis.min")}[${s.min||u("common.auto")}]-${u("quotaView.advance.axisSetting.yAxis.max")}[${s.max||u("common.auto")}]/${u("quotaView.advance.axisSetting.yAxis."+s.position)}`,value:o,closable:!t.seriesSetting.some(r=>r.yAxisIndex===o)&&o>0})):[]);function f(s){const o=w(t),r=o.seriesSetting.find(d=>d.yAxisIndex-1===s);if(r){y.warn(`[${r.name}]`+u("quotaView.advance.axisSetting.yAxis.cannotdel"));return}if(o.yAxis.length===1){y.warn(u("quotaView.advance.axisSetting.yAxis.lastnotdel"));return}t.yAxis.splice(s,1)}return[c,{delYAxis:f}]}function R(t){const c=h([1,2,3,4,5,6,7,8,9,10,11,12]);function f({target:{value:a}}){if(!(parseInt(a)>0&&parseInt(a)<13)){setTimeout(()=>{t.timeConfig.startMonth=1},500),y.warn(u("quotaView.advance.datasourceSetting.startMonthTip"));return}t.timeConfig.startMonth=parseInt(a);const n=c.value.indexOf(parseInt(a)),[i,e]=[c.value.slice(0,n),c.value.slice(n)];c.value=[...e,...i],s()}function s(){const a=v(t.timeConfig.startDate).year(),n=v(t.timeConfig.endDate).year();r.value=[];const i=t.timeConfig.startMonth;for(let e=a;e<=n+1;e++)r.value.push(i!==1?`${e-1}-${e}`:`${e}`)}function o(a){var i,e,x,g;const n=parseInt((i=a.target.dataset.month)!=null?i:NaN);if(n){const p=t.timeConfig.sortMonth.indexOf(n);p!==-1?(e=t.timeConfig.sortMonth)==null||e.splice(p,1):((x=t.timeConfig.sortMonth)==null||x.push(n),(g=t.timeConfig.sortMonth)==null||g.sort())}}const r=h([]);s();function d(a){var i,e;const n=a.target.dataset.year;if(n){const x=t.timeConfig.sortYear.indexOf(n);x!==-1?(i=t.timeConfig.sortYear)==null||i.splice(x,1):(e=t.timeConfig.sortYear)==null||e.push(n)}}return[{monthList:c,yearList:r},{startMonthChange:f,sortYearChange:d,sortMonthChange:o,updateYears:s}]}export{O as a,j as b,D as c,N as d,Q as e,K as f,T as g,R as h,E as i,V as u};