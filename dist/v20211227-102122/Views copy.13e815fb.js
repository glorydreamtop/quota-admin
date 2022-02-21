import{D as K,j as W,r as G,V as B,m as J,cj as L,R as Y,a1 as Z,bW as N,aD as Q,ct as X,ba as ee,F as h,G as w,ab as te,ac as se,N as C,u as n,Z as D,ad as M,H as m,J as j,K as p,L as x,v as z,a9 as ae,a3 as ie,b8 as oe,O as ne,P as re,cu as O,cv as de,bv as F}from"./vendor.1ce5b3a9.js";import{u as le,e as pe,f as ce,g as fe}from"./hooks.e92893b8.js";import{B as ge}from"./BasicChart.42d6a2fb.js";import ue from"./Text.6ea16aef.js";import he from"./Image.dd3bd536.js";import{_ as me,I as xe}from"./index.b82b58bf.js";import{o as be}from"./onMountedOrActivated.3ab72fe6.js";import{u as ve}from"./commonHelper.56e6e834.js";import{f as _e}from"./helper.8f4ed6e2.js";import{D as we}from"./vuedraggable.umd.672f7f32.js";import"./useECharts.3cfbc595.js";import"./useTimeout.9c582638.js";import"./chartEnum.d23a2dc2.js";import"./index.ed64d4ee.js";import"./quotaEnum.42e6645f.js";import"./YAxisEditor.773797a7.js";/* empty css                *//* empty css                *//* empty css                *//* empty css              */import"./index.975ea0d3.js";/* empty css               */import"./uuid.4c14c5c2.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";/* empty css                */import"./useContextMenu.cb81dada.js";/* empty css                */import"./sortable.esm.c79628ac.js";const P=b=>(ne("data-v-5241b616"),b=b(),re(),b),je={class:"w-full overflow-y-scroll p-2",id:"page-box"},Ie=["data-pageid"],ye={class:"pb-1 border-b page-header"},Ce={class:"flex gap-1"},qe=P(()=>p("img",{class:"w-3.5 h-3.5",src:"http://121.4.186.36:23587/favicon.ico"},null,-1)),ke=["onClick","data-uniqid"],Ee={class:"pt-1 border-t page-footer"},Te={class:"flex gap-1"},Se=P(()=>p("img",{class:"w-3.5 h-3.5",src:"http://121.4.186.36:23587/favicon.ico"},null,-1)),Be=K({setup(b){const o=le(),q=pe(),H=W(()=>({paddingTop:`${o.paddingTop}px`,paddingBottom:`${o.paddingBottom}px`,paddingLeft:`${o.paddingLeft}px`,paddingRight:`${o.paddingRight}px`,aspectRatio:o.pagination?o.horizontal?"297/210":"210/297":"unset"})),I=G(!1);B(()=>o.pagination,()=>{const s=J(g.value);I.value=!0,g.value=[],i.pages=[{list:[],id:v()}],I.value=!1;for(let e=0;e<s.length;e++)L(()=>{g.value.push(s[e])},30*e)});const g=ce(),R={Chart:ge,Text:ue,Img:he},{insertSelectKey:U,clearSelectKey:y}=fe(g,q);function V(s,e){U(s,e)}const i=Y({pages:[],totalPage:1}),{getUniqueField:v}=_e();ve(g,(s,e)=>{if(!I.value){if(e.length<s.length){const r=O(s,e,a=>a.uniqId);for(let a=0;a<r.length;a++){const c=de(s,t=>t.uniqId===r[a].uniqId);if(c===0)i.pages[0].list.unshift(r[a]);else{const t=s[c-1];for(let d=0;d<i.pages.length;d++){const _=i.pages[d],f=_.list.findIndex(u=>u.uniqId===t.uniqId);if(f>-1){_.list.splice(f+1,0,r[a]);break}}}}}else if(e.length>s.length){const r=O(e,s,a=>a.uniqId).map(a=>a.uniqId);for(let a=0;a<i.pages.length;a++){const c=i.pages[a];F(c.list,t=>r.includes(t.uniqId))}F(i.pages,a=>a.list.length===0),i.pages.length===0&&(i.pages=[{list:[],id:v()}])}}});function $(s){for(let e=0;e<s.childElementCount;e++){const r=s.children[e];if(r.offsetTop+r.offsetHeight>s.offsetTop+s.offsetHeight||r.offsetLeft+r.offsetWidth>s.offsetLeft+s.offsetWidth)return e}return!1}B(()=>i.totalPage,async()=>{await Z()});function k(s,e){o.header[s]=e.target.innerText}function E(s,e){o.footer[s]=e.target.innerText}return be(()=>{const s=document.getElementById("page-box");N(s,e=>{e.forEach(r=>{r.addedNodes.length!==0&&r.addedNodes.forEach(a=>{N(a.children[1],c=>{c.forEach(t=>{t.addedNodes.length!==0&&t.addedNodes.forEach(d=>{Q(d,_=>{const f=_[0].target;if(X(f.parentElement))return;const u=g.value.find(T=>T.uniqId===f.dataset.uniqid);if(u){if(u.pageConfig.width=f.style.width,u.pageConfig.height=f.style.height,!o.pagination)return;if($(f.parentElement)){const S=a.nextElementSibling;if(S){for(let l=0;l<i.pages.length;l++)if(i.pages[l].id===S.dataset.pageid){i.pages[l].list.unshift(i.pages[l-1].list.pop());break}}else i.pages.push({list:[],id:v()}),i.totalPage++,L(()=>{for(let l=0;l<i.pages.length;l++)if(i.pages[l].id===a.nextElementSibling.dataset.pageid){i.pages[l].list.unshift(i.pages[l-1].list.pop());break}},100)}}})})})},{childList:!0})})})},{childList:!0}),i.pages.push({list:[],id:v()})}),(s,e)=>{const r=ee("resizeable");return h(),w("div",je,[(h(!0),w(te,null,se(n(i).pages,(a,c)=>(h(),w("div",{class:C(["pages bg-white overflow-hidden shadow-lg shadow-gray-700 flex flex-col items-center gap-4",n(o).pagination?"mb-8":""]),key:a.id,"data-pageid":a.id,style:D(n(H)),onClick:e[4]||(e[4]=M((...t)=>n(y)&&n(y)(...t),["self"]))},[m(p("div",ye,[p("span",{contenteditable:"",onInput:e[0]||(e[0]=t=>k("left",t))},x(n(o).header.left),33),p("span",Ce,[qe,p("span",{contenteditable:"",onInput:e[1]||(e[1]=t=>k("right",t)),class:"text-right"},x(n(o).header.right),33)])],512),[[j,n(o).header.show]]),z(n(we),{class:"flex flex-wrap content-start flex-grow w-full overflow-hidden",onClick:M(n(y),["self"]),list:a.list,group:"page",handle:".drag-handler",animation:200,itemKey:"uniqId"},{item:ae(({element:t})=>[m((h(),w("div",{onClick:d=>V(t,d),"data-uniqid":t.uniqId,class:C(["border rounded-sm overflow-hidden sortable relative",n(q).find(d=>d.uniqId===t.uniqId)?"selected":"",n(o).showElementborder?"":"border-light-50"]),style:D({width:t.pageConfig.width,height:t.pageConfig.height})},[z(n(xe),{icon:"akar-icons:drag-horizontal",class:"drag-handler cursor-move pl-1 pt-1 !text-primary"}),(h(),ie(oe(R[t.type]),{config:t.config,"onUpdate:config":d=>t.config=d,class:C(["w-full h-full text-base",t.type==="Chart"?"py-2":""])},null,8,["config","onUpdate:config","class"]))],14,ke)),[[r,"xy","hidden"]])]),_:2},1032,["onClick","list"]),p("div",Ee,[m(p("span",{contenteditable:"",onInput:e[2]||(e[2]=t=>E("left",t))},x(n(o).footer.left),545),[[j,n(o).footer.show]]),m(p("span",{class:"footer-page-num"},x(c+1),513),[[j,n(o).footer.pageNum]]),m(p("span",Te,[Se,p("span",{contenteditable:"",onInput:e[3]||(e[3]=t=>E("right",t))},x(n(o).footer.right),33)],512),[[j,n(o).footer.show]])])],14,Ie))),128))])}}});var nt=me(Be,[["__scopeId","data-v-5241b616"]]);export{nt as default};
