var tt=Object.defineProperty,nt=Object.defineProperties;var at=Object.getOwnPropertyDescriptors;var Ne=Object.getOwnPropertySymbols;var ot=Object.prototype.hasOwnProperty,st=Object.prototype.propertyIsEnumerable;var Ee=(e,s,r)=>s in e?tt(e,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[s]=r,S=(e,s)=>{for(var r in s||(s={}))ot.call(s,r)&&Ee(e,r,s[r]);if(Ne)for(var r of Ne(s))st.call(s,r)&&Ee(e,r,s[r]);return e},be=(e,s)=>nt(e,at(s));import{D as X,bX as ne,r as D,j as G,u as a,o as Oe,aq as ge,V as Y,bt as ae,a2 as V,F as N,a3 as H,a9 as _,G as ye,ac as Q,ab as ve,aU as J,L as Z,aj as x,bF as We,bY as Re,al as le,am as z,ak as oe,aI as ce,v as L,K as Pe,bZ as Ue,a0 as He,b_ as je,aJ as ue,bE as rt,bx as it,bG as lt,aT as qe,b$ as ct,c0 as ut,bH as Ae,bI as dt,bA as Ke,Y as ft,H as mt,J as pt,bs as ht,aV as Fe,aR as $e,m as Ie,c1 as bt,ae as we,Z as gt,s as yt,W as vt,t as Ye,b7 as At,a1 as Te,aW as Ft,R as xe,aS as wt,be as Ct}from"./vendor.1ce5b3a9.js";/* empty css               *//* empty css               *//* empty css                *//* empty css              *//* empty css                *//* empty css              *//* empty css               *//* empty css               *//* empty css               *//* empty css                *//* empty css                */import{p as F,ah as ke,b as de,q as E,_ as ee,a9 as fe,aa as me,ag as De,w as pe,a5 as ze,aE as Bt,t as St,s as Ot,aF as Rt,x as he,aG as se,aH as Pt,aI as jt,az as Le,aC as Je,a as $t,ai as It,ay as Tt}from"./index.b82b58bf.js";import{u as Ce,C as kt}from"./index.6b5e08fe.js";import{B as Dt}from"./index.497fafeb.js";import{S as Lt}from"./index.a19561bc.js";import{d as _t,B as Mt}from"./index.f2f6fea5.js";import{u as Vt}from"./index.fa044461.js";const Gt=X({name:"ApiRadioGroup",components:{RadioGroup:ne.Group,RadioButton:ne.Button,Radio:ne},props:{api:{type:Function,default:null},params:{type:[Object,String],default:()=>({})},value:{type:[String,Number,Boolean]},isBtn:{type:[Boolean],default:!1},numberToString:F.bool,resultField:F.string.def(""),labelField:F.string.def("label"),valueField:F.string.def("value"),immediate:F.bool.def(!0)},emits:["options-change","change"],setup(e,{emit:s}){const r=D([]),c=D(!1),m=D(!0),A=D([]),n=ke(),{t:i}=de(),[l]=Ce(e),d=G(()=>{const{labelField:B,valueField:t,numberToString:o}=e;return a(r).reduce((y,v)=>{if(v){const g=v[t];y.push(S({label:v[B],value:o?`${g}`:g},Oe(v,[B,t])))}return y},[])});ge(()=>{e.immediate&&b()}),Y(()=>e.params,()=>{!a(m)&&b()},{deep:!0});async function b(){const B=e.api;if(!(!B||!E(B))){r.value=[];try{c.value=!0;const t=await B(e.params);if(Array.isArray(t)){r.value=t,O();return}e.resultField&&(r.value=ae(t,e.resultField)||[]),O()}catch(t){console.warn(t)}finally{c.value=!1}}}function O(){s("options-change",a(d))}function h(B,...t){A.value=t}return{state:l,getOptions:d,attrs:n,loading:c,t:i,handleChange:h,props:e}}});function Nt(e,s,r,c,m,A){const n=V("RadioButton"),i=V("Radio"),l=V("RadioGroup");return N(),H(l,x(e.attrs,{value:e.state,"onUpdate:value":s[0]||(s[0]=d=>e.state=d),"button-style":"solid",onChange:e.handleChange}),{default:_(()=>[(N(!0),ye(ve,null,Q(e.getOptions,d=>(N(),ye(ve,{key:`${d.value}`},[e.props.isBtn?(N(),H(n,{key:0,value:d.value,disabled:d.disabled},{default:_(()=>[J(Z(d.label),1)]),_:2},1032,["value","disabled"])):(N(),H(i,{key:1,value:d.value,disabled:d.disabled},{default:_(()=>[J(Z(d.label),1)]),_:2},1032,["value","disabled"]))],64))),128))]),_:1},16,["value","onChange"])}var Et=ee(Gt,[["render",Nt]]);const Wt=X({name:"RadioButtonGroup",components:{RadioGroup:ne.Group,RadioButton:ne.Button},props:{value:{type:[String,Number,Boolean]},options:{type:Array,default:()=>[]}},setup(e){const s=ke(),[r]=Ce(e),c=G(()=>{const{options:m}=e;return!m||(m==null?void 0:m.length)===0?[]:m.some(n=>fe(n))?m.map(n=>({label:n,value:n})):m});return{state:r,getOptions:c,attrs:s}}});function Ut(e,s,r,c,m,A){const n=V("RadioButton"),i=V("RadioGroup");return N(),H(i,x(e.attrs,{value:e.state,"onUpdate:value":s[0]||(s[0]=l=>e.state=l),"button-style":"solid"}),{default:_(()=>[(N(!0),ye(ve,null,Q(e.getOptions,l=>(N(),H(n,{key:`${l.value}`,value:l.value,disabled:l.disabled},{default:_(()=>[J(Z(l.label),1)]),_:2},1032,["value","disabled"]))),128))]),_:1},16,["value"])}var Ht=ee(Wt,[["render",Ut]]);const qt=X({name:"ApiSelect",components:{Select:We,LoadingOutlined:Re},inheritAttrs:!1,props:{value:[Array,Object,String,Number],numberToString:F.bool,api:{type:Function,default:null},params:{type:Object,default:()=>({})},resultField:F.string.def(""),labelField:F.string.def("label"),valueField:F.string.def("value"),immediate:F.bool.def(!0)},emits:["options-change","change"],setup(e,{emit:s}){const r=D([]),c=D(!1),m=D(!0),A=D([]),n=ke(),{t:i}=de(),[l]=Ce(e,"value","change",A),d=G(()=>{const{labelField:t,valueField:o,numberToString:y}=e;return a(r).reduce((v,g)=>{if(g){const w=g[o];v.push(be(S({},Oe(g,[t,o])),{label:g[t],value:y?`${w}`:w}))}return v},[])});ge(()=>{e.immediate&&b()}),Y(()=>e.params,()=>{!a(m)&&b()},{deep:!0});async function b(){const t=e.api;if(!(!t||!E(t))){r.value=[];try{c.value=!0;const o=await t(e.params);if(Array.isArray(o)){r.value=o,h();return}e.resultField&&(r.value=ae(o,e.resultField)||[]),h()}catch(o){console.warn(o)}finally{c.value=!1}}}async function O(){!e.immediate&&a(m)&&(await b(),m.value=!1)}function h(){s("options-change",a(d))}function B(t,...o){A.value=o}return{state:l,attrs:n,getOptions:d,loading:c,t:i,handleFetch:O,handleChange:B}}});function Kt(e,s,r,c,m,A){const n=V("LoadingOutlined"),i=V("Select");return N(),H(i,x({onDropdownVisibleChange:e.handleFetch},e.$attrs,{onChange:e.handleChange,options:e.getOptions,value:e.state,"onUpdate:value":s[0]||(s[0]=l=>e.state=l)}),le({_:2},[Q(Object.keys(e.$slots),l=>({name:l,fn:_(d=>[z(e.$slots,l,oe(ce(d||{})))])})),e.loading?{name:"suffixIcon",fn:_(()=>[L(n,{spin:""})])}:void 0,e.loading?{name:"notFoundContent",fn:_(()=>[Pe("span",null,[L(n,{spin:"",class:"mr-1"}),J(" "+Z(e.t("component.form.apiSelectNotFound")),1)])])}:void 0]),1040,["onDropdownVisibleChange","onChange","options","value"])}var Yt=ee(qt,[["render",Kt]]);const xt=X({name:"ApiTreeSelect",components:{ATreeSelect:Ue,LoadingOutlined:Re},props:{api:{type:Function},params:{type:Object},immediate:{type:Boolean,default:!0},resultField:F.string.def("")},emits:["options-change","change"],setup(e,{attrs:s,emit:r}){const c=D([]),m=D(!1),A=D(!1),n=G(()=>S(S({},e.api?{treeData:a(c)}:{}),s));function i(...d){r("change",...d)}Y(()=>e.params,()=>{!a(m)&&l()},{deep:!0}),Y(()=>e.immediate,d=>{d&&!m.value&&l()}),He(()=>{e.immediate&&l()});async function l(){const{api:d}=e;if(!d||!E(d))return;A.value=!0,c.value=[];let b;try{b=await d(e.params)}catch(O){console.error(O)}A.value=!1,!!b&&(me(b)||(b=ae(b,e.resultField)),c.value=b||[],m.value=!0,r("options-change",c.value))}return{getAttrs:n,loading:A,handleChange:i}}});function zt(e,s,r,c,m,A){const n=V("LoadingOutlined"),i=V("a-tree-select");return N(),H(i,x(e.getAttrs,{onChange:e.handleChange}),le({_:2},[Q(Object.keys(e.$slots),l=>({name:l,fn:_(d=>[z(e.$slots,l,oe(ce(d||{})))])})),e.loading?{name:"suffixIcon",fn:_(()=>[L(n,{spin:""})])}:void 0]),1040,["onChange"])}var Jt=ee(xt,[["render",zt]]);const Xt=X({name:"ApiCascader",components:{LoadingOutlined:Re,[je.name]:je},props:{value:{type:Array},api:{type:Function,default:null},numberToString:F.bool,resultField:F.string.def(""),labelField:F.string.def("label"),valueField:F.string.def("value"),childrenField:F.string.def("children"),asyncFetchParamKey:F.string.def("parentCode"),immediate:F.bool.def(!0),initFetchParams:{type:Object,default:()=>({})},isLeaf:{type:Function,default:null},displayRenderArray:{type:Array}},emits:["change","defaultChange"],setup(e,{emit:s}){const r=D([]),c=D([]),m=D(!1),A=D([]),n=D(!0),[i]=Ce(e,"value","change",A);Y(r,B=>{const t=l(B);c.value=t},{deep:!0});function l(B){const{labelField:t,valueField:o,numberToString:y,childrenField:v,isLeaf:g}=e;return B.reduce((w,C)=>{if(C){const M=C[o],u=be(S({},Oe(C,[t,o])),{label:C[t],value:y?`${M}`:M,isLeaf:g&&typeof g=="function"?g(C):!1}),f=Reflect.get(C,v);f&&Reflect.set(u,v,l(f)),w.push(u)}return w},[])}async function d(){const B=e.api;if(!(!B||!E(B))){r.value=[],m.value=!0;try{const t=await B(e.initFetchParams);if(Array.isArray(t)){r.value=t;return}e.resultField&&(r.value=ae(t,e.resultField)||[])}catch(t){console.warn(t)}finally{m.value=!1}}}async function b(B){const t=B[B.length-1];t.loading=!0;const o=e.api;if(!(!o||!E(o)))try{const y=await o({[e.asyncFetchParamKey]:Reflect.get(t,"value")});if(Array.isArray(y)){const v=l(y);t.children=v;return}if(e.resultField){const v=l(ae(y,e.resultField)||[]);t.children=v}}catch(y){console.error(y)}finally{t.loading=!1}}ge(()=>{e.immediate&&d()}),Y(()=>e.initFetchParams,()=>{!a(n)&&d()},{deep:!0});function O(B,t){A.value=B,s("defaultChange",B,t)}function h({labels:B,selectedOptions:t}){return a(A).length===t.length?B.join(" / "):e.displayRenderArray?e.displayRenderArray.join(" / "):""}return{state:i,options:c,loading:m,handleChange:O,loadData:b,handleRenderDisplay:h}}});function Zt(e,s,r,c,m,A){const n=V("LoadingOutlined"),i=V("a-cascader");return N(),H(i,{value:e.state,"onUpdate:value":s[0]||(s[0]=l=>e.state=l),options:e.options,"load-data":e.loadData,"change-on-select":"",onChange:e.handleChange,displayRender:e.handleRenderDisplay},le({_:2},[e.loading?{name:"suffixIcon",fn:_(()=>[L(n,{spin:""})])}:void 0,e.loading?{name:"notFoundContent",fn:_(()=>[Pe("span",null,[L(n,{spin:"",class:"mr-1"}),J(" "+Z(e.t("component.form.apiSelectNotFound")),1)])])}:void 0]),1032,["value","options","load-data","onChange","displayRender"])}var Qt=ee(Xt,[["render",Zt]]);const R=new Map;R.set("Input",ue);R.set("InputGroup",ue.Group);R.set("InputPassword",ue.Password);R.set("InputSearch",ue.Search);R.set("InputTextArea",ue.TextArea);R.set("InputNumber",rt);R.set("AutoComplete",it);R.set("Select",We);R.set("ApiSelect",Yt);R.set("TreeSelect",Ue);R.set("ApiTreeSelect",Jt);R.set("ApiRadioGroup",Et);R.set("Switch",lt);R.set("RadioButtonGroup",Ht);R.set("RadioGroup",ne.Group);R.set("Checkbox",qe);R.set("CheckboxGroup",qe.Group);R.set("ApiCascader",Qt);R.set("Cascader",je);R.set("Slider",ct);R.set("Rate",ut);R.set("DatePicker",Ae);R.set("MonthPicker",Ae.MonthPicker);R.set("RangePicker",Ae.RangePicker);R.set("WeekPicker",Ae.WeekPicker);R.set("TimePicker",dt);R.set("StrengthMeter",Lt);R.set("InputCountDown",kt);R.set("Upload",Dt);R.set("Divider",Ke);const{t:_e}=de();function Xe(e){return e.includes("Input")||e.includes("Complete")?_e("common.inputText"):e.includes("Picker")||e.includes("Select")||e.includes("Cascader")||e.includes("Checkbox")||e.includes("Radio")||e.includes("Switch")?_e("common.chooseText"):""}const en=["DatePicker","MonthPicker","WeekPicker","TimePicker"];function tn(){return[...en,"RangePicker"]}function nn(e,s,r){["DatePicker","MonthPicker","WeekPicker","TimePicker"].includes(s)?e.type=r?"string":"object":["RangePicker","Upload","CheckboxGroup","TimePicker"].includes(s)?e.type="array":["InputNumber"].includes(s)&&(e.type="number")}function an(e,s){return e&&["Input","InputPassword","InputSearch","InputTextArea"].includes(e)&&s&&De(s)?`${s}`:s}const Ze=tn();function on(e,s){return G(()=>{const r=a(e),{labelCol:c={},wrapperCol:m={}}=r.itemProps||{},{labelWidth:A,disabledLabelWidth:n}=r,{labelWidth:i,labelCol:l,wrapperCol:d}=a(s);if(!i&&!A&&!l||n)return c.style={textAlign:"left"},{labelCol:c,wrapperCol:m};let b=A||i;const O=S(S({},l),c),h=S(S({},d),m);return b&&(b=De(b)?`${b}px`:b),{labelCol:S({style:{width:b}},O),wrapperCol:S({style:{width:`calc(100% - ${b})`}},h)}})}function Me(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!ht(e)}var sn=X({name:"BasicFormItem",inheritAttrs:!1,props:{schema:{type:Object,default:()=>({})},formProps:{type:Object,default:()=>({})},allDefaultValues:{type:Object,default:()=>({})},formModel:{type:Object,default:()=>({})},setFormModel:{type:Function,default:null},tableAction:{type:Object},formActionType:{type:Object}},setup(e,{slots:s}){const{t:r}=de(),{schema:c,formProps:m}=ft(e),A=on(c,m),n=G(()=>{const{allDefaultValues:t,formModel:o,schema:y}=e,{mergeDynamicData:v}=e.formProps;return{field:y.field,model:o,values:S(S(S({},v),t),o),schema:y}}),i=G(()=>{var w;const{schema:t,tableAction:o,formModel:y,formActionType:v}=e;let{componentProps:g={}}=t;return E(g)&&(g=(w=g({schema:t,tableAction:o,formModel:y,formActionType:v}))!=null?w:{}),t.component==="Divider"&&(g=Object.assign({type:"horizontal"},g,{orientation:"left",plain:!0})),g}),l=G(()=>{const{disabled:t}=e.formProps,{dynamicDisabled:o}=e.schema,{disabled:y=!1}=a(i);let v=!!t||y;return pe(o)&&(v=o),E(o)&&(v=o(a(n))),v});function d(){const{show:t,ifShow:o}=e.schema,{showAdvancedButton:y}=e.formProps,v=y&&pe(e.schema.isAdvanced)?e.schema.isAdvanced:!0;let g=!0,w=!0;return pe(t)&&(g=t),pe(o)&&(w=o),E(t)&&(g=t(a(n))),E(o)&&(w=o(a(n))),g=g&&v,{isShow:g,isIfShow:w}}function b(){var W;const{rules:t=[],component:o,rulesMessageJoinLabel:y,label:v,dynamicRules:g,required:w}=e.schema;if(E(g))return g(a(n));let C=Ie(t);const{rulesMessageJoinLabel:M}=e.formProps,u=Reflect.has(e.schema,"rulesMessageJoinLabel")?y:M,f=Xe(o)+`${u?v:""}`;function j($,P){const q=$.message||f;return P===void 0||Bt(P)||Array.isArray(P)&&P.length===0||typeof P=="string"&&P.trim()===""||typeof P=="object"&&Reflect.has(P,"checked")&&Reflect.has(P,"halfChecked")&&Array.isArray(P.checked)&&Array.isArray(P.halfChecked)&&P.checked.length===0&&P.halfChecked.length===0?Promise.reject(q):Promise.resolve()}const p=E(w)?w(a(n)):w;(!C||C.length===0)&&p&&(C=[{required:p,validator:j}]);const k=C.findIndex($=>Reflect.has($,"required")&&!Reflect.has($,"validator"));if(k!==-1){const $=C[k],{isShow:P}=d();if(P||($.required=!1),o){Reflect.has($,"type")||($.type=o==="InputNumber"?"number":"string"),$.message=$.message||f,(o.includes("Input")||o.includes("Textarea"))&&($.whitespace=!0);const q=(W=a(i))==null?void 0:W.valueFormat;nn($,o,q)}}const T=C.findIndex($=>$.max);return T!==-1&&!C[T].validator&&(C[T].message=C[T].message||r("component.form.maxTip",[C[T].max])),C}function O(){var P;const{renderComponentContent:t,component:o,field:y,changeEvent:v="change",valueField:g}=e.schema,w=o&&["Switch","Checkbox"].includes(o),C=`on${bt(v)}`,M={[C]:(...q)=>{const[re]=q;p[C]&&p[C](...q);const ie=re?re.target:null,Be=ie?w?ie.checked:ie.value:re;e.setFormModel(y,Be)}},u=R.get(o),{autoSetPlaceHolder:f,size:j}=e.formProps,p=be(S({allowClear:!0,getPopupContainer:q=>q.parentNode,size:j},a(i)),{disabled:a(l)});!p.disabled&&f&&o!=="RangePicker"&&o&&(p.placeholder=((P=a(i))==null?void 0:P.placeholder)||Xe(o)),p.codeField=y,p.formValues=a(n);const T={[g||(w?"checked":"value")]:ae(e.formModel,y)},W=S(S(S({},p),M),T);if(!t)return L(u,W,null);const $=E(t)?S({},t(a(n))):{default:()=>t};return L(u,W,Me($)?$:{default:()=>[$]})}function h(){const{label:t,helpMessage:o,helpComponentProps:y,subLabel:v}=e.schema,g=v?L("span",null,[t,J(" "),L("span",{class:"text-secondary"},[v])]):t,w=E(o)?o(a(n)):o;return!w||Array.isArray(w)&&w.length===0?g:L("span",null,[g,L(_t,x({placement:"top",class:"mx-1",text:w},y),null)])}function B(){const{itemProps:t,slot:o,render:y,field:v,suffix:g,component:w}=e.schema,{labelCol:C,wrapperCol:M}=a(A),{colon:u}=e.formProps;if(w==="Divider"){let f;return L(Fe,{span:24},{default:()=>[L(Ke,a(i),Me(f=h())?f:{default:()=>[f]})]})}else{const f=()=>o?ze(s,o,a(n)):y?y(a(n)):O(),j=!!g,p=E(g)?g(a(n)):g;return L($e.Item,x({name:v,colon:u,class:{"suffix-item":j}},t,{label:h(),rules:b(),labelCol:C,wrapperCol:M}),{default:()=>[L("div",{style:"display:flex"},[L("div",{style:"flex:1;"},[f()]),j&&L("span",{class:"suffix"},[p])])]})}}return()=>{let t;const{colProps:o={},colSlot:y,renderColContent:v,component:g}=e.schema;if(!R.has(g))return null;const{baseColProps:w={}}=e.formProps,C=S(S({},w),o),{isIfShow:M,isShow:u}=d(),f=a(n);return M&&mt(L(Fe,C,Me(t=(()=>y?ze(s,y,f):v?v(f):B())())?t:{default:()=>[t]}),[[pt,u]])}}});const Qe=Symbol();function rn(e){return Ot(e,Qe)}function ln(){return St(Qe)}const cn=X({name:"BasicFormAction",components:{FormItem:$e.Item,Button:Rt,BasicArrow:Mt,[Fe.name]:Fe},props:{showActionButtonGroup:F.bool.def(!0),showResetButton:F.bool.def(!0),showSubmitButton:F.bool.def(!0),showAdvancedButton:F.bool.def(!0),resetButtonOptions:{type:Object,default:()=>({})},submitButtonOptions:{type:Object,default:()=>({})},actionColOptions:{type:Object,default:()=>({})},actionSpan:F.number.def(6),isAdvanced:F.bool,hideAdvanceBtn:F.bool},emits:["toggle-advanced"],setup(e,{emit:s}){const{t:r}=de(),c=G(()=>{const{showAdvancedButton:i,actionSpan:l,actionColOptions:d}=e,b=24-l,O=i?{span:b<6?24:b}:{};return S(S({style:{textAlign:"right"},span:i?6:4},O),d)}),m=G(()=>Object.assign({text:r("common.resetText")},e.resetButtonOptions)),A=G(()=>Object.assign({text:r("common.queryText")},e.submitButtonOptions));function n(){s("toggle-advanced")}return S({t:r,actionColOpt:c,getResetBtnOptions:m,getSubmitBtnOptions:A,toggleAdvanced:n},ln())}});function un(e,s,r,c,m,A){const n=V("Button"),i=V("BasicArrow"),l=V("FormItem"),d=V("a-col");return e.showActionButtonGroup?(N(),H(d,oe(x({key:0},e.actionColOpt)),{default:_(()=>[Pe("div",{style:gt([{width:"100%"},{textAlign:e.actionColOpt.style.textAlign}])},[L(l,null,{default:_(()=>[z(e.$slots,"resetBefore"),e.showResetButton?(N(),H(n,x({key:0,type:"default",class:"mr-2"},e.getResetBtnOptions,{onClick:e.resetAction}),{default:_(()=>[J(Z(e.getResetBtnOptions.text),1)]),_:1},16,["onClick"])):we("",!0),z(e.$slots,"submitBefore"),e.showSubmitButton?(N(),H(n,x({key:1,type:"primary",class:"mr-2"},e.getSubmitBtnOptions,{onClick:e.submitAction}),{default:_(()=>[J(Z(e.getSubmitBtnOptions.text),1)]),_:1},16,["onClick"])):we("",!0),z(e.$slots,"advanceBefore"),e.showAdvancedButton&&!e.hideAdvanceBtn?(N(),H(n,{key:2,type:"link",size:"small",onClick:e.toggleAdvanced},{default:_(()=>[J(Z(e.isAdvanced?e.t("component.form.putAway"):e.t("component.form.unfold"))+" ",1),L(i,{class:"ml-1",expand:!e.isAdvanced,up:""},null,8,["expand"])]),_:1},8,["onClick"])):we("",!0),z(e.$slots,"advanceAfter")]),_:3})],4)]),_:3},16)):we("",!0)}var dn=ee(cn,[["render",un]]);function fn({defaultValueRef:e,getSchema:s,formModel:r,getProps:c}){function m(i){var d,b;if(!he(i))return{};const l={};for(const O of Object.entries(i)){let[,h]=O;const[B]=O;if(!B||me(h)&&h.length===0||E(h))continue;const t=a(c).transformDateFunc;he(h)&&(h=t==null?void 0:t(h)),me(h)&&((d=h[0])==null?void 0:d._isAMomentObject)&&((b=h[1])==null?void 0:b._isAMomentObject)&&(h=h.map(o=>t==null?void 0:t(o))),fe(h)&&(h=h.trim()),yt(l,B,h)}return A(l)}function A(i){const l=a(c).fieldMapToTime;if(!l||!Array.isArray(l))return i;for(const[d,[b,O],h="YYYY-MM-DD"]of l){if(!d||!b||!O||!i[d])continue;const[B,t]=i[d];i[b]=se(B).format(h),i[O]=se(t).format(h),Reflect.deleteProperty(i,d)}return i}function n(){const i=a(s),l={};i.forEach(d=>{const{defaultValue:b}=d;Pt(b)||(l[d.field]=b,r[d.field]=b)}),e.value=l}return{handleFormValues:m,initDefault:n}}const te=24;function mn({advanceState:e,emit:s,getProps:r,getSchema:c,formModel:m,defaultValueRef:A}){const{realWidthRef:n,screenEnum:i,screenRef:l}=jt(),d=G(()=>{if(!e.isAdvanced)return 0;const t=a(r).emptySpan||0;if(De(t))return t;if(he(t)){const{span:o=0}=t,y=a(l);return t[y.toLowerCase()]||o||0}return 0}),b=vt(h,30);Y([()=>a(c),()=>e.isAdvanced,()=>a(n)],()=>{const{showAdvancedButton:t}=a(r);t&&b()},{immediate:!0});function O(t,o=0,y=!1){const v=a(n),g=parseInt(t.md)||parseInt(t.xs)||parseInt(t.sm)||t.span||te,w=parseInt(t.lg)||g,C=parseInt(t.xl)||w,M=parseInt(t.xxl)||C;return v<=i.LG?o+=g:v<i.XL?o+=w:v<i.XXL?o+=C:o+=M,y?(e.hideAdvanceBtn=!1,o<=te*2?(e.hideAdvanceBtn=!0,e.isAdvanced=!0):o>te*2&&o<=te*(a(r).autoAdvancedLine||3)?e.hideAdvanceBtn=!1:e.isLoad||(e.isLoad=!0,e.isAdvanced=!e.isAdvanced),{isAdvanced:e.isAdvanced,itemColSum:o}):o>te*(a(r).alwaysShowLines||1)?{isAdvanced:e.isAdvanced,itemColSum:o}:{isAdvanced:!0,itemColSum:o}}function h(){let t=0,o=0;const{baseColProps:y={}}=a(r);for(const v of a(c)){const{show:g,colProps:w}=v;let C=!0;if(pe(g)&&(C=g),E(g)&&(C=g({schema:v,model:m,field:v.field,values:S(S({},a(A)),m)})),C&&(w||y)){const{itemColSum:M,isAdvanced:u}=O(S(S({},y),w),t);t=M||0,u&&(o=t),v.isAdvanced=u}}e.actionSpan=o%te+a(d),O(a(r).actionColOptions||{span:te},t,!0),s("advanced-change")}function B(){e.isAdvanced=!e.isAdvanced}return{handleToggleAdvanced:B}}function pn({emit:e,getProps:s,formModel:r,getSchema:c,defaultValueRef:m,formElRef:A,schemaRef:n,handleFormValues:i}){async function l(){const{resetFunc:u,submitOnReset:f}=a(s);u&&E(u)&&await u(),!!a(A)&&(Object.keys(r).forEach(p=>{r[p]=m.value[p]}),w(),e("reset",Ye(r)),f&&M())}async function d(u){const f=a(c).map(p=>p.field).filter(Boolean),j=[];Object.keys(u).forEach(p=>{const k=a(c).find($=>$.field===p);let T=u[p];const W=Reflect.has(u,p);if(T=an(k==null?void 0:k.component,T),W&&f.includes(p)){if(y(p))if(Array.isArray(T)){const $=[];for(const P of T)$.push(P?se(P):null);r[p]=$}else{const{componentProps:$}=k||{};let P=$;typeof $=="function"&&(P=P({formModel:r})),r[p]=T?(P==null?void 0:P.valueFormat)?T:se(T):null}else r[p]=T;j.push(p)}}),v(j).catch(p=>{})}async function b(u){const f=Ie(a(c));if(!u)return;let j=fe(u)?[u]:u;fe(u)&&(j=[u]);for(const p of j)O(p,f);n.value=f}function O(u,f){if(fe(u)){const j=f.findIndex(p=>p.field===u);j!==-1&&(delete r[u],f.splice(j,1))}}async function h(u,f,j=!1){const p=Ie(a(c)),k=p.findIndex(W=>W.field===f);if(!!p.some(W=>W.field===f||u.field)){if(!f||k===-1||j){j?p.unshift(u):p.push(u),n.value=p;return}k!==-1&&p.splice(k+1,0,u),n.value=p}}async function B(u){let f=[];if(he(u)&&f.push(u),me(u)&&(f=[...u]),!f.every(p=>p.component==="Divider"||Reflect.has(p,"field")&&p.field)){Le("All children of the form Schema array that need to be updated must contain the `field` field");return}n.value=f}async function t(u){let f=[];if(he(u)&&f.push(u),me(u)&&(f=[...u]),!f.every(k=>k.component==="Divider"||Reflect.has(k,"field")&&k.field)){Le("All children of the form Schema array that need to be updated must contain the `field` field");return}const p=[];f.forEach(k=>{a(c).forEach(T=>{if(T.field===k.field){const W=Je(T,k);p.push(W)}else p.push(T)})}),n.value=At(p,"field")}function o(){return a(A)?i(Ye(a(r))):{}}function y(u){return a(c).some(f=>f.field===u?Ze.includes(f.component):!1)}async function v(u){var f;return(f=a(A))==null?void 0:f.validateFields(u)}async function g(u){var f;return await((f=a(A))==null?void 0:f.validate(u))}async function w(u){var f;await((f=a(A))==null?void 0:f.clearValidate(u))}async function C(u,f){var j;await((j=a(A))==null?void 0:j.scrollToField(u,f))}async function M(u){u&&u.preventDefault();const{submitFunc:f}=a(s);if(f&&E(f)){await f();return}if(!!a(A))try{const p=await g(),k=i(p);e("submit",k)}catch(p){throw new Error(p)}}return{handleSubmit:M,clearValidate:w,validate:g,validateFields:v,getFieldsValue:o,updateSchema:t,resetSchema:B,appendSchemaByField:h,removeSchemaByFiled:b,resetFields:l,setFieldsValue:d,scrollToField:C}}async function hn({getSchema:e,getProps:s,formElRef:r,isInitedDefault:c}){ge(async()=>{if(a(c)||!a(s).autoFocusFirstItem)return;await Te();const m=a(e),A=a(r),n=A==null?void 0:A.$el;if(!A||!n||!m||m.length===0||!m[0].component.includes("Input"))return;const l=n.querySelector(".ant-row:first-child input");!l||l==null||l.focus()})}const bn={model:{type:Object,default:{}},labelWidth:{type:[Number,String],default:0},fieldMapToTime:{type:Array,default:()=>[]},compact:F.bool,schemas:{type:[Array],default:()=>[]},mergeDynamicData:{type:Object,default:null},baseRowStyle:{type:Object},baseColProps:{type:Object},autoSetPlaceHolder:F.bool.def(!0),autoSubmitOnEnter:F.bool.def(!1),submitOnReset:F.bool,size:F.oneOf(["default","small","large"]).def("default"),disabled:F.bool,emptySpan:{type:[Number,Object],default:0},showAdvancedButton:F.bool,transformDateFunc:{type:Function,default:e=>e._isAMomentObject?e==null?void 0:e.format("YYYY-MM-DD HH:mm:ss"):e},rulesMessageJoinLabel:F.bool.def(!0),autoAdvancedLine:F.number.def(3),alwaysShowLines:F.number.def(1),showActionButtonGroup:F.bool.def(!0),actionColOptions:Object,showResetButton:F.bool.def(!0),autoFocusFirstItem:F.bool,resetButtonOptions:Object,showSubmitButton:F.bool.def(!0),submitButtonOptions:Object,resetFunc:Function,submitFunc:Function,hideRequiredMark:F.bool,labelCol:Object,layout:F.oneOf(["horizontal","vertical","inline"]).def("horizontal"),tableAction:{type:Object},wrapperCol:Object,colon:F.bool,labelAlign:F.string,rowProps:Object};const gn=X({name:"BasicForm",components:{FormItem:sn,Form:$e,Row:Ft,FormAction:dn},props:bn,emits:["advanced-change","reset","submit","register"],setup(e,{emit:s,attrs:r}){const c=xe({}),m=Vt(),A=xe({isAdvanced:!0,hideAdvanceBtn:!1,isLoad:!1,actionSpan:6}),n=D({}),i=D(!1),l=D({}),d=D(null),b=D(null),{prefixCls:O}=$t("basic-form"),h=G(()=>S(S({},e),a(l))),B=G(()=>[O,{[`${O}--compact`]:a(h).compact}]),t=G(()=>{const{baseRowStyle:I={},rowProps:U}=a(h);return S({style:I},U)}),o=G(()=>S(S(S({},r),e),a(h))),y=G(()=>{const I=a(d)||a(h).schemas;for(const U of I){const{defaultValue:K,component:Ve}=U;if(K&&Ze.includes(Ve))if(!Array.isArray(K))U.defaultValue=se(K);else{const Ge=[];K.forEach(et=>{Ge.push(se(et))}),U.defaultValue=Ge}}return a(h).showAdvancedButton?I.filter(U=>U.component!=="Divider"):I}),{handleToggleAdvanced:v}=mn({advanceState:A,emit:s,getProps:h,getSchema:y,formModel:c,defaultValueRef:n}),{handleFormValues:g,initDefault:w}=fn({getProps:h,defaultValueRef:n,getSchema:y,formModel:c});hn({getSchema:y,getProps:h,isInitedDefault:i,formElRef:b});const{handleSubmit:C,setFieldsValue:M,clearValidate:u,validate:f,validateFields:j,getFieldsValue:p,updateSchema:k,resetSchema:T,appendSchemaByField:W,removeSchemaByFiled:$,resetFields:P,scrollToField:q}=pn({emit:s,getProps:h,formModel:c,getSchema:y,defaultValueRef:n,formElRef:b,schemaRef:d,handleFormValues:g});rn({resetAction:P,submitAction:C}),Y(()=>a(h).model,()=>{const{model:I}=a(h);!I||M(I)},{immediate:!0}),Y(()=>a(h).schemas,I=>{T(I!=null?I:[])}),Y(()=>y.value,I=>{Te(()=>{var U;(U=m==null?void 0:m.redoModalHeight)==null||U.call(m)}),!a(i)&&(I==null?void 0:I.length)&&(w(),i.value=!0)});async function re(I){l.value=Je(a(l)||{},I)}function ie(I,U){c[I]=U;const{validateTrigger:K}=a(o);(!K||K==="change")&&j([I]).catch(Ve=>{})}function Be(I){const{autoSubmitOnEnter:U}=a(h);if(!!U&&I.key==="Enter"&&I.target&&I.target instanceof HTMLElement){const K=I.target;K&&K.tagName&&K.tagName.toUpperCase()=="INPUT"&&C()}}const Se={getFieldsValue:p,setFieldsValue:M,resetFields:P,updateSchema:k,resetSchema:T,setProps:re,removeSchemaByFiled:$,appendSchemaByField:W,clearValidate:u,validateFields:j,validate:f,submit:C,scrollToField:q};return He(()=>{w(),s("register",Se)}),S({getBindValue:o,handleToggleAdvanced:v,handleEnterPress:Be,formModel:c,defaultValueRef:n,advanceState:A,getRow:t,getProps:h,formElRef:b,getSchema:y,formActionType:Se,setFormModel:ie,getFormClass:B,getFormActionBindProps:G(()=>S(S({},h.value),A))},Se)}});function yn(e,s,r,c,m,A){const n=V("FormItem"),i=V("FormAction"),l=V("Row"),d=V("Form");return N(),H(d,x(e.getBindValue,{class:e.getFormClass,ref:"formElRef",model:e.formModel,onKeypress:wt(e.handleEnterPress,["enter"])}),{default:_(()=>[L(l,oe(ce(e.getRow)),{default:_(()=>[z(e.$slots,"formHeader"),(N(!0),ye(ve,null,Q(e.getSchema,b=>(N(),H(n,{key:b.field,tableAction:e.tableAction,formActionType:e.formActionType,schema:b,formProps:e.getProps,allDefaultValues:e.defaultValueRef,formModel:e.formModel,setFormModel:e.setFormModel},le({_:2},[Q(Object.keys(e.$slots),O=>({name:O,fn:_(h=>[z(e.$slots,O,oe(ce(h||{})))])}))]),1032,["tableAction","formActionType","schema","formProps","allDefaultValues","formModel","setFormModel"]))),128)),L(i,x(e.getFormActionBindProps,{onToggleAdvanced:e.handleToggleAdvanced}),le({_:2},[Q(["resetBefore","submitBefore","advanceBefore","advanceAfter"],b=>({name:b,fn:_(O=>[z(e.$slots,b,oe(ce(O||{})))])}))]),1040,["onToggleAdvanced"]),z(e.$slots,"formFooter")]),_:3},16)]),_:3},16,["class","model","onKeypress"])}var Vn=ee(gn,[["render",yn]]);function Gn(e){const s=D(null),r=D(!1);async function c(){const n=a(s);return n||Le("The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!"),await Te(),n}function m(n){Ct(()=>{s.value=null,r.value=null}),!(a(r)&&It()&&n===a(s))&&(s.value=n,r.value=!0,Y(()=>e,()=>{e&&n.setProps(Tt(e))},{immediate:!0,deep:!0}))}return[m,{scrollToField:async(n,i)=>{(await c()).scrollToField(n,i)},setProps:async n=>{(await c()).setProps(n)},updateSchema:async n=>{(await c()).updateSchema(n)},resetSchema:async n=>{(await c()).resetSchema(n)},clearValidate:async n=>{(await c()).clearValidate(n)},resetFields:async()=>{c().then(async n=>{await n.resetFields()})},removeSchemaByFiled:async n=>{var i;(i=a(s))==null||i.removeSchemaByFiled(n)},getFieldsValue:()=>{var n;return(n=a(s))==null?void 0:n.getFieldsValue()},setFieldsValue:async n=>{(await c()).setFieldsValue(n)},appendSchemaByField:async(n,i,l)=>{(await c()).appendSchemaByField(n,i,l)},submit:async()=>(await c()).submit(),validate:async n=>(await c()).validate(n),validateFields:async n=>(await c()).validateFields(n)}]}export{Yt as A,Vn as B,Jt as a,Gn as u};