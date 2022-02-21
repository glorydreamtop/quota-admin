var ee=Object.defineProperty,te=Object.defineProperties;var oe=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,ae=Object.prototype.propertyIsEnumerable;var M=(e,t,a)=>t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,W=(e,t)=>{for(var a in t||(t={}))ne.call(t,a)&&M(e,a,t[a]);if(D)for(var a of D(t))ae.call(t,a)&&M(e,a,t[a]);return e},K=(e,t)=>te(e,oe(t));import{a as L,l as re,_ as U,af as se,a9 as ie,ag as le,p as u,ab as Z}from"./index.86e9d70c.js";import{D as q,F as B,G as V,K as z,am as C,N as T,Z as G,r as R,a1 as I,u as d,bp as ce,V as O,bq as ge,T as ue,j as F,o as X,a2 as J,a3 as Q,al as fe,ac as de,a9 as E,ak as pe,aI as he,ab as me,aU as He,L as Ce,aj as Fe,ae as Y}from"./vendor.2e1d877b.js";/* empty css               *//* empty css               */import{o as $e}from"./onMountedOrActivated.9356963a.js";import{u as be}from"./useWindowSizeFn.752f6aa7.js";import{a as ve}from"./useContentViewHeight.e14e287c.js";const ye=q({name:"PageFooter",inheritAttrs:!1,setup(){const{prefixCls:e}=L("page-footer"),{getCalcContentWidth:t}=re();return{prefixCls:e,getCalcContentWidth:t}}});function Pe(e,t,a,v,p,y){return B(),V("div",{class:T(e.prefixCls),style:G({width:e.getCalcContentWidth})},[z("div",{class:T(`${e.prefixCls}__left`)},[C(e.$slots,"left",{},void 0,!0)],2),C(e.$slots,"default",{},void 0,!0),z("div",{class:T(`${e.prefixCls}__right`)},[C(e.$slots,"right",{},void 0,!0)],2)],6)}var x=U(ye,[["render",Pe],["__scopeId","data-v-2c113217"]]);function _e(e,t,a,v,p=0,y=R(0)){const h=R(null),{footerHeightRef:g}=ve();let m={useLayoutFooter:!0};const k=n=>{m=n};function N(){I(()=>{_()})}function $(n,S="all"){var c,b,H,w;function f(o){return Number(o.replace(/[^\d]/g,""))}let l=0;const r="0px";if(n){const o=getComputedStyle(n),i=f((c=o==null?void 0:o.marginTop)!=null?c:r),s=f((b=o==null?void 0:o.marginBottom)!=null?b:r),j=f((H=o==null?void 0:o.paddingTop)!=null?H:r),A=f((w=o==null?void 0:o.paddingBottom)!=null?w:r);S==="all"?(l+=i,l+=s,l+=j,l+=A):S==="top"?(l+=i,l+=j):(l+=s,l+=A)}return l}function P(n){return n==null?null:n instanceof HTMLDivElement?n:n.$el}async function _(){var w;if(!e.value)return;await I();const n=P(d(t));if(!n)return;const{bottomIncludeBody:S}=se(n);let f=0;a.forEach(o=>{var i,s;f+=(s=(i=P(d(o)))==null?void 0:i.offsetHeight)!=null?s:0});let l=(w=$(n))!=null?w:0;v.forEach(o=>{l+=$(P(d(o)))});let r=0;function c(o,i){if(o&&i){const s=o.parentElement;s&&(ie(i)?s.classList.contains(i)?r+=$(s,"bottom"):(r+=$(s,"bottom"),c(s,i)):le(i)&&i>0&&(r+=$(s,"bottom"),c(s,--i)))}}ce(p)?c(n,d(p)):c(n,p);let b=S-d(g)-d(y)-f-l-r;const H=()=>{var o;(o=m.elements)==null||o.forEach(i=>{var s,j;b+=(j=(s=P(d(i)))==null?void 0:s.offsetHeight)!=null?j:0})};m.useLayoutFooter&&d(g)>0,H(),h.value=b}return $e(()=>{I(()=>{_()})}),be(()=>{_()},50,{immediate:!0}),O(()=>[g.value],()=>{_()},{flush:"post",immediate:!0}),{redoHeight:N,setCompensation:k,contentHeight:h}}const Se=q({name:"PageWrapper",components:{PageFooter:x,PageHeader:ge},inheritAttrs:!1,props:{title:u.string,dense:u.bool,ghost:u.bool,content:u.string,contentStyle:{type:Object},contentBackground:u.bool,contentFullHeight:u.bool,contentClass:u.string,fixedHeight:u.bool,upwardSpace:u.oneOfType([u.number,u.string]).def(0)},setup(e,{slots:t,attrs:a}){const v=R(null),p=R(null),y=R(null),h=R(null),{prefixCls:g}=L("page-wrapper");ue(we,F(()=>e.fixedHeight));const m=F(()=>e.contentFullHeight),k=F(()=>e.upwardSpace),{redoHeight:N,setCompensation:$,contentHeight:P}=_e(m,v,[p,h],[y],k);$({useLayoutFooter:!0,elements:[h]});const _=F(()=>{var r;return[g,{[`${g}--dense`]:e.dense},(r=a.class)!=null?r:{}]}),n=F(()=>(t==null?void 0:t.leftFooter)||(t==null?void 0:t.rightFooter)),S=F(()=>Object.keys(X(t,"default","leftFooter","rightFooter","headerContent"))),f=F(()=>{const{contentFullHeight:r,contentStyle:c,fixedHeight:b}=e;if(!r)return W({},c);const H=`${d(P)}px`;return W(K(W({},c),{minHeight:H}),b?{height:H}:{})}),l=F(()=>{const{contentBackground:r,contentClass:c}=e;return[`${g}-content`,c,{[`${g}-content-bg`]:r}]});return O(()=>[n.value],()=>{N()},{flush:"post",immediate:!0}),{getContentStyle:f,wrapperRef:v,headerRef:p,contentRef:y,footerRef:h,getClass:_,getHeaderSlots:S,prefixCls:g,getShowFooter:n,omit:X,getContentClass:l}}});function Re(e,t,a,v,p,y){const h=J("PageHeader"),g=J("PageFooter");return B(),V("div",{class:T(e.getClass),ref:"wrapperRef"},[e.content||e.$slots.headerContent||e.title||e.getHeaderSlots.length?(B(),Q(h,Fe({key:0,ghost:e.ghost,title:e.title},e.omit(e.$attrs,"class"),{ref:"headerRef"}),fe({default:E(()=>[e.content?(B(),V(me,{key:0},[He(Ce(e.content),1)],64)):C(e.$slots,"headerContent",{key:1})]),_:2},[de(e.getHeaderSlots,m=>({name:m,fn:E(k=>[C(e.$slots,m,pe(he(k||{})))])}))]),1040,["ghost","title"])):Y("",!0),z("div",{class:T(["overflow-hidden",e.getContentClass]),style:G(e.getContentStyle),ref:"contentRef"},[C(e.$slots,"default")],6),e.getShowFooter?(B(),Q(g,{key:1,ref:"footerRef"},{left:E(()=>[C(e.$slots,"leftFooter")]),right:E(()=>[C(e.$slots,"rightFooter")]),_:3},512)):Y("",!0)],2)}var ke=U(Se,[["render",Re]]);Z(x);const Ie=Z(ke),we="PageWrapperFixedHeight";export{Ie as P,we as a};
