var Ce=Object.defineProperty,Se=Object.defineProperties;var Ue=Object.getOwnPropertyDescriptors;var X=Object.getOwnPropertySymbols;var Pe=Object.prototype.hasOwnProperty,ke=Object.prototype.propertyIsEnumerable;var Y=(e,t,n)=>t in e?Ce(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,P=(e,t)=>{for(var n in t||(t={}))Pe.call(t,n)&&Y(e,n,t[n]);if(X)for(var n of X(t))ke.call(t,n)&&Y(e,n,t[n]);return e},E=(e,t)=>Se(e,Ue(t));import{b as O,I as J,aB as Ie,a0 as Le,p as z,a as Re,at as Te,_ as j,w as Ae,q as H,a9 as $e,h as Ne,ax as Fe,aa as ee,ab as Be}from"./index.86e9d70c.js";import{j as R,u as k,Q as De,T as Me,D,bA as Ee,bS as Oe,ah as te,t as ne,a2 as v,F as b,G as N,ab as M,ac as ze,a3 as T,a9 as _,v as d,N as W,ae as A,aU as F,L as B,ak as K,aI as je,aj as x,am as oe,bQ as xe,bT as Ge,bo as Z,V as q,a1 as Ve,bU as He,bV as We,R as Ke,r as G,Y as Ze,K as qe,o as Qe}from"./vendor.2e1d877b.js";/* empty css               */import{u as Xe,B as ae,b as le,a as se}from"./index.f3cbd9f4.js";/* empty css               *//* empty css                */import{c as Ye}from"./index.0fb85ddd.js";/* empty css                */import{b as Je}from"./uuid.4c14c5c2.js";import{d as et}from"./download.682bfe84.js";const{t:Q}=O();function tt({acceptRef:e,helpTextRef:t,maxNumberRef:n,maxSizeRef:i}){const l=R(()=>{const u=k(e);return u&&u.length>0?u:[]}),g=R(()=>k(l).map(u=>u.indexOf("/")>0||u.startsWith(".")?u:`.${u}`).join(",")),p=R(()=>{const u=k(t);if(u)return u;const r=[],a=k(e);a.length>0&&r.push(Q("component.upload.accept",[a.join(",")]));const o=k(i);o&&r.push(Q("component.upload.maxSize",[o]));const s=k(n);return s&&s!==1/0&&r.push(Q("component.upload.maxNumber",[s])),r.join("\uFF0C")});return{getAccept:l,getStringAccept:g,getHelpText:p}}var w;(function(e){e.SUCCESS="success",e.ERROR="error",e.UPLOADING="uploading"})(w||(w={}));const re={helpText:{type:String,default:""},maxSize:{type:Number,default:2},maxNumber:{type:Number,default:1/0},accept:{type:Array,default:()=>[]},multiple:{type:Boolean,default:!0},uploadParams:{type:Object,default:{}},api:{type:Function,default:null,required:!0},size:{type:String,default:""},name:{type:String,default:"files"},filename:{type:String,default:null}},nt=E(P({value:{type:Array,default:()=>[]}},re),{showPreviewNumber:{type:Boolean,default:!0},emptyHidePreview:{type:Boolean,default:!1}}),ot={value:{type:Array,default:()=>[]}},at={columns:{type:[Array],default:null},actionColumn:{type:Object,default:null},dataSource:{type:Array,default:null}};function lt(e,t){const n=t.join("|");return new RegExp("\\.("+n+")$","i").test(e.name)}function st(e){return ie(e.name)}function ie(e){return/\.(jpg|jpeg|png|gif)$/i.test(e)}function rt(e){return new Promise((t,n)=>{const i=new FileReader;i.readAsDataURL(e),i.onload=()=>t({result:i.result,file:e}),i.onerror=l=>n(l)})}const ue=Symbol("basic-table");function Kt(e){Me(ue,e)}function it(){return De(ue)}const{table:ut}=Ye,{pageSizeOptions:ct,defaultPageSize:dt,fetchSetting:pt,defaultSize:mt,defaultSortFn:ft,defaultFilterFn:gt}=ut,Zt="key",qt=ct,Qt=dt,Xt=pt,Yt=mt,Jt=ft,en=gt,tn="center",nn="INDEX",vt="ACTION";const ht=D({name:"TableAction",components:{Icon:J,PopConfirmButton:Ie,Divider:Ee,Dropdown:Le,MoreOutlined:Oe,Tooltip:te},props:{actions:{type:Array,default:null},dropDownActions:{type:Array,default:null},divider:z.bool.def(!0),outside:z.bool,stopButtonPropagation:z.bool.def(!1)},setup(e){const{prefixCls:t}=Re("basic-table-action");let n={};e.outside||(n=it());const{hasPermission:i}=Te();function l(o){const s=o.ifShow;let h=!0;return Ae(s)&&(h=s),H(s)&&(h=s(o)),h}const g=R(()=>(ne(e.actions)||[]).filter(o=>i(o.auth)&&l(o)).map(o=>{const{popConfirm:s}=o;return E(P(P({getPopupContainer:()=>{var h;return(h=k(n==null?void 0:n.wrapRef.value))!=null?h:document.body},type:"link",size:"small"},o),s||{}),{onConfirm:s==null?void 0:s.confirm,onCancel:s==null?void 0:s.cancel,enable:!!s})})),p=R(()=>(ne(e.dropDownActions)||[]).filter(o=>i(o.auth)&&l(o)).map((o,s)=>{const{label:h,popConfirm:c}=o;return E(P(P({},o),c),{onConfirm:c==null?void 0:c.confirm,onCancel:c==null?void 0:c.cancel,text:h,divider:s<e.dropDownActions.length-1?e.divider:!1})})),u=R(()=>{var h,c;const s=(((h=n==null?void 0:n.getColumns)==null?void 0:h.call(n))||[]).find(I=>I.flag===vt);return(c=s==null?void 0:s.align)!=null?c:"left"});function r(o){return P({getPopupContainer:()=>{var s;return(s=k(n==null?void 0:n.wrapRef.value))!=null?s:document.body},placement:"bottom"},$e(o)?{title:o}:o)}function a(o){if(!e.stopButtonPropagation)return;o.composedPath().find(c=>{var I;return((I=c.tagName)==null?void 0:I.toUpperCase())==="BUTTON"})&&o.stopPropagation()}return{prefixCls:t,getActions:g,getDropdownList:p,getAlign:u,onCellClick:a,getTooltip:r}}});function bt(e,t,n,i,l,g){const p=v("Icon"),u=v("PopConfirmButton"),r=v("Tooltip"),a=v("Divider"),o=v("MoreOutlined"),s=v("a-button"),h=v("Dropdown");return b(),N("div",{class:W([e.prefixCls,e.getAlign]),onClick:t[0]||(t[0]=(...c)=>e.onCellClick&&e.onCellClick(...c))},[(b(!0),N(M,null,ze(e.getActions,(c,I)=>(b(),N(M,{key:`${I}-${c.label}`},[c.tooltip?(b(),T(r,K(x({key:0},e.getTooltip(c.tooltip))),{default:_(()=>[d(u,K(je(c)),{default:_(()=>[c.icon?(b(),T(p,{key:0,icon:c.icon,class:W({"mr-1":!!c.label})},null,8,["icon","class"])):A("",!0),c.label?(b(),N(M,{key:1},[F(B(c.label),1)],64)):A("",!0)]),_:2},1040)]),_:2},1040)):(b(),T(u,K(x({key:1},c)),{default:_(()=>[c.icon?(b(),T(p,{key:0,icon:c.icon,class:W({"mr-1":!!c.label})},null,8,["icon","class"])):A("",!0),c.label?(b(),N(M,{key:1},[F(B(c.label),1)],64)):A("",!0)]),_:2},1040)),e.divider&&I<e.getActions.length-1?(b(),T(a,{key:2,type:"vertical",class:"action-divider"})):A("",!0)],64))),128)),e.dropDownActions&&e.getDropdownList.length>0?(b(),T(h,{key:0,trigger:["hover"],dropMenuList:e.getDropdownList,popconfirm:""},{default:_(()=>[oe(e.$slots,"more"),e.$slots.more?A("",!0):(b(),T(s,{key:0,type:"link",size:"small"},{default:_(()=>[d(o,{class:"icon-more"})]),_:1}))]),_:3},8,["dropMenuList"])):A("",!0)],2)}var ce=j(ht,[["render",bt]]);const yt=D({components:{Image:xe},props:{fileUrl:z.string.def(""),fileName:z.string.def("")}}),_t={class:"thumb"};function wt(e,t,n,i,l,g){const p=v("Image");return b(),N("span",_t,[e.fileUrl?(b(),T(p,{key:0,src:e.fileUrl,width:104},null,8,["src"])):A("",!0)])}var de=j(yt,[["render",wt]]);const{t:C}=O();function Ct(){return[{dataIndex:"thumbUrl",title:C("component.upload.legend"),width:100,customRender:({record:e})=>{const{thumbUrl:t}=e||{};return t&&d(de,{fileUrl:t},null)}},{dataIndex:"name",title:C("component.upload.fileName"),align:"left",customRender:({text:e,record:t})=>{const{percent:n,status:i}=t||{};let l="normal";return i===w.ERROR?l="exception":i===w.UPLOADING?l="active":i===w.SUCCESS&&(l="success"),d("span",null,[d("p",{class:"truncate mb-1",title:e},[e]),d(Ge,{percent:n,size:"small",status:l},null)])}},{dataIndex:"size",title:C("component.upload.fileSize"),width:100,customRender:({text:e=0})=>e&&(e/1024).toFixed(2)+"KB"},{dataIndex:"status",title:C("component.upload.fileStatue"),width:100,customRender:({text:e})=>e===w.SUCCESS?d(Z,{color:"green"},{default:()=>C("component.upload.uploadSuccess")}):e===w.ERROR?d(Z,{color:"red"},{default:()=>C("component.upload.uploadError")}):e===w.UPLOADING?d(Z,{color:"blue"},{default:()=>C("component.upload.uploading")}):e}]}function St(e){return{width:120,title:C("component.upload.operating"),dataIndex:"action",fixed:!1,customRender:({record:t})=>{const n=[{label:C("component.upload.del"),color:"error",onClick:e.bind(null,t)}];return d(ce,{actions:n,outside:!0},null)}}}function Ut(){return[{dataIndex:"url",title:C("component.upload.legend"),width:100,customRender:({record:e})=>{const{url:t}=e||{};return ie(t)&&d(de,{fileUrl:t},null)}},{dataIndex:"name",title:C("component.upload.fileName"),align:"left"}]}function Pt({handleRemove:e,handleDownload:t}){return{width:160,title:C("component.upload.operating"),dataIndex:"action",fixed:!1,customRender:({record:n})=>{const i=[{label:C("component.upload.del"),color:"error",onClick:e.bind(null,n)},{label:C("component.upload.download"),onClick:t.bind(null,n)}];return d(ce,{actions:i,outside:!0},null)}}}var pe=D({name:"FileList",props:at,setup(e){const t=Xe();return q(()=>e.dataSource,()=>{Ve(()=>{var n;(n=t==null?void 0:t.redoModalHeight)==null||n.call(t)})}),()=>{const{columns:n,actionColumn:i,dataSource:l}=e,g=[...n,i];return d("table",{class:"file-table"},[d("colgroup",null,[g.map(p=>{const{width:u=0,dataIndex:r}=p,a={width:`${u}px`,minWidth:`${u}px`};return d("col",{style:u?a:{},key:r},null)})]),d("thead",null,[d("tr",{class:"file-table-tr"},[g.map(p=>{const{title:u="",align:r="center",dataIndex:a}=p;return d("th",{class:["file-table-th",r],key:a},[u])})])]),d("tbody",null,[l.map((p={},u)=>d("tr",{class:"file-table-tr",key:`${u+p.name||""}`},[g.map(r=>{const{dataIndex:a="",customRender:o,align:s="center"}=r,h=o&&H(o);return d("td",{class:["file-table-td",s],key:a},[h?o==null?void 0:o({text:p[a],record:p}):p[a]])})]))])])}}});const kt=D({components:{BasicModal:ae,Upload:He,Alert:We,FileList:pe},props:E(P({},re),{previewFileList:{type:Array,default:()=>[]}}),emits:["change","register","delete"],setup(e,{emit:t}){const n=Ke({fileList:[]}),i=G(!1),l=G([]),{accept:g,helpText:p,maxNumber:u,maxSize:r}=Ze(e),{t:a}=O(),[o,{closeModal:s}]=le(),{getAccept:h,getStringAccept:c,getHelpText:I}=tt({acceptRef:g,helpTextRef:p,maxNumberRef:u,maxSizeRef:r}),{createMessage:f}=Ne(),me=R(()=>l.value.length>0&&!l.value.every(m=>m.status===w.SUCCESS)),fe=R(()=>{const m=l.value.some(y=>y.status===w.SUCCESS);return{disabled:i.value||l.value.length===0||!m}}),ge=R(()=>{const m=l.value.some(y=>y.status===w.ERROR);return i.value?a("component.upload.uploading"):a(m?"component.upload.reUploadFailed":"component.upload.startUpload")});function ve(m){const{size:y,name:S}=m,{maxSize:U}=e,$=k(h);if(U&&m.size/1024/1024>=U)return f.error(a("component.upload.maxSizeMultiple",[U])),!1;if($.length>0&&!lt(m,$))return f.error(a("component.upload.acceptUpload",[$.join(",")])),!1;const L={uuid:Je(),file:m,size:y,name:S,percent:0,type:S.split(".").pop()};return st(m)?rt(m).then(({result:V})=>{l.value=[...k(l),P({thumbUrl:V},L)]}):l.value=[...k(l),L],!1}function he(m){const y=l.value.findIndex(S=>S.uuid===m.uuid);y!==-1&&l.value.splice(y,1),t("delete",m)}async function be(m){var S;const{api:y}=e;if(!y||!H(y))return Fe("upload api must exist and be a function");try{m.status=w.UPLOADING;const{data:U}=await((S=e.api)==null?void 0:S.call(e,{data:P({},e.uploadParams||{}),file:m.file,name:e.name,filename:e.filename},function(L){const V=L.loaded/L.total*100|0;m.percent=V}));return m.status=w.SUCCESS,m.responseData=U,{success:!0,error:null}}catch(U){return console.log(U),m.status=w.ERROR,{success:!1,error:U}}}async function ye(){var y;const{maxNumber:m}=e;if(l.value.length+((y=e.previewFileList)==null?void 0:y.length)>m)return f.warning(a("component.upload.maxNumber",[m]));try{i.value=!0;const S=l.value.filter(L=>L.status!==w.SUCCESS)||[],U=await Promise.all(S.map(L=>be(L)));i.value=!1;const $=U.filter(L=>!L.success);if($.length>0)throw $}catch(S){throw i.value=!1,S}}function _e(){const{maxNumber:m}=e;if(l.value.length>m)return f.warning(a("component.upload.maxNumber",[m]));if(i.value)return f.warning(a("component.upload.saveWarn"));const y=[];for(const S of l.value){const{status:U,responseData:$}=S;U===w.SUCCESS&&$&&y.push($.info[0])}if(y.length<=0)return f.warning(a("component.upload.saveError"));l.value=[],s(),t("change",y)}async function we(){return i.value?(f.warning(a("component.upload.uploadWait")),!1):(l.value=[],!0)}return{columns:Ct(),actionColumn:St(he),register:o,closeModal:s,getHelpText:I,getStringAccept:c,getOkButtonProps:fe,beforeUpload:ve,fileListRef:l,state:n,isUploadingRef:i,handleStartUpload:ye,handleOk:_e,handleCloseFunc:we,getIsSelectFile:me,getUploadBtnText:ge,t:a}}}),It={class:"upload-modal-toolbar"};function Lt(e,t,n,i,l,g){const p=v("a-button"),u=v("Alert"),r=v("Upload"),a=v("FileList"),o=v("BasicModal");return b(),T(o,x({width:"800px",title:e.t("component.upload.upload"),okText:e.t("component.upload.save")},e.$attrs,{onRegister:e.register,onOk:e.handleOk,closeFunc:e.handleCloseFunc,maskClosable:!1,keyboard:!1,wrapClassName:"upload-modal",okButtonProps:e.getOkButtonProps,cancelButtonProps:{disabled:e.isUploadingRef}}),{centerFooter:_(()=>[d(p,{onClick:e.handleStartUpload,color:"success",disabled:!e.getIsSelectFile,loading:e.isUploadingRef},{default:_(()=>[F(B(e.getUploadBtnText),1)]),_:1},8,["onClick","disabled","loading"])]),default:_(()=>[qe("div",It,[d(u,{message:e.getHelpText,type:"info",banner:"",class:"upload-modal-toolbar__text"},null,8,["message"]),d(r,{accept:e.getStringAccept,multiple:e.multiple,"before-upload":e.beforeUpload,class:"upload-modal-toolbar__btn"},{default:_(()=>[d(p,{type:"primary"},{default:_(()=>[F(B(e.t("component.upload.choose")),1)]),_:1})]),_:1},8,["accept","multiple","before-upload"])]),d(a,{dataSource:e.fileListRef,columns:e.columns,actionColumn:e.actionColumn},null,8,["dataSource","columns","actionColumn"])]),_:1},16,["title","okText","onRegister","onOk","closeFunc","okButtonProps","cancelButtonProps"])}var Rt=j(kt,[["render",Lt]]);const Tt=D({components:{BasicModal:ae,FileList:pe},props:ot,emits:["list-change","register","delete"],setup(e,{emit:t}){const[n,{closeModal:i}]=le(),{t:l}=O(),g=G([]);q(()=>e.value,r=>{ee(r)||(r=[]),g.value=r.filter(a=>!!a).map(a=>({url:a,type:a.split(".").pop()||"",name:a.split("/").pop()||""}))},{immediate:!0});function p(r){const a=g.value.findIndex(o=>o.url===r.url);if(a!==-1){const o=g.value.splice(a,1);t("delete",o[0].url),t("list-change",g.value.map(s=>s.url))}}function u(r){const{url:a=""}=r;et({url:a})}return{t:l,register:n,closeModal:i,fileListRef:g,columns:Ut(),actionColumn:Pt({handleRemove:p,handleDownload:u})}}});function At(e,t,n,i,l,g){const p=v("FileList"),u=v("BasicModal");return b(),T(u,x({width:"800px",title:e.t("component.upload.preview"),wrapClassName:"upload-preview-modal"},e.$attrs,{onRegister:e.register,showOkBtn:!1}),{default:_(()=>[d(p,{dataSource:e.fileListRef,columns:e.columns,actionColumn:e.actionColumn},null,8,["dataSource","columns","actionColumn"])]),_:1},16,["title","onRegister"])}var $t=j(Tt,[["render",At]]);const Nt=D({name:"BasicUpload",components:{UploadModal:Rt,UploadPreviewModal:$t,Icon:J,Tooltip:te},props:nt,emits:["change","delete","preview-delete","update:value"],setup(e,{emit:t,attrs:n}){const{t:i}=O(),[l,{openModal:g}]=se(),[p,{openModal:u}]=se(),r=G([]),a=R(()=>{const{emptyHidePreview:f}=e;return f&&f?r.value.length>0:!0}),o=R(()=>{const f=P(P({},n),e);return Qe(f,"onChange")});q(()=>e.value,(f=[])=>{r.value=ee(f)?f:[]},{immediate:!0});function s(f){r.value=[...k(r),...f||[]],t("update:value",r.value),t("change",r.value)}function h(f){r.value=[...f||[]],t("update:value",r.value),t("change",r.value)}function c(f){t("delete",f)}function I(f){t("preview-delete",f)}return{registerUploadModal:l,openUploadModal:g,handleChange:s,handlePreviewChange:h,registerPreviewModal:p,openPreviewModal:u,fileList:r,showPreview:a,bindValue:o,handleDelete:c,handlePreviewDelete:I,t:i,size:e.size}}});function Ft(e,t,n,i,l,g){const p=v("a-button"),u=v("Icon"),r=v("Tooltip"),a=v("a-button-group"),o=v("UploadModal"),s=v("UploadPreviewModal");return b(),N("div",null,[d(a,null,{default:_(()=>[oe(e.$slots,"btn",{onClick:e.openUploadModal},()=>[d(p,{type:"primary",onClick:e.openUploadModal,preIcon:"carbon:cloud-upload"},{default:_(()=>[F(B(e.t("component.upload.upload")),1)]),_:1},8,["onClick"])]),e.showPreview?(b(),T(r,{key:0,placement:"bottom"},{title:_(()=>[F(B(e.t("component.upload.uploaded"))+" ",1),e.fileList.length?(b(),N(M,{key:0},[F(B(e.fileList.length),1)],64)):A("",!0)]),default:_(()=>[d(p,{size:e.size,onClick:e.openPreviewModal},{default:_(()=>[d(u,{icon:"bi:eye"}),e.fileList.length&&e.showPreviewNumber?(b(),N(M,{key:0},[F(B(e.fileList.length),1)],64)):A("",!0)]),_:1},8,["size","onClick"])]),_:1})):A("",!0)]),_:3}),d(o,x(e.bindValue,{previewFileList:e.fileList,onRegister:e.registerUploadModal,onChange:e.handleChange,onDelete:e.handleDelete}),null,16,["previewFileList","onRegister","onChange","onDelete"]),d(s,{value:e.fileList,onRegister:e.registerPreviewModal,onListChange:e.handlePreviewChange,onDelete:e.handlePreviewDelete},null,8,["value","onRegister","onListChange","onDelete"])])}var Bt=j(Nt,[["render",Ft]]);const on=Be(Bt);export{vt as A,on as B,tn as D,Xt as F,nn as I,Qt as P,Zt as R,ce as T,qt as a,Jt as b,en as c,Yt as d,Kt as e,it as u};
