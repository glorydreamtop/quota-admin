import{T as d}from"./index.8d549ca9.js";import{D as p,R as f,Y as m,r as g,F as h,G as v,v as b,u as n}from"./vendor.2e1d877b.js";import"./index.86e9d70c.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";/* empty css               */import"./uuid.4c14c5c2.js";import"./onMountedOrActivated.9356963a.js";const j={class:"h-full p-4"},B=p({props:{config:null},emits:["update:config"],setup(s,{emit:a}){const i=s,l=f({elementpath:!1,toolbar:!1,menubar:!1,plugins:["quickbars"],resize:!1,inline:!0,statusbar:!1,quickbars_selection_toolbar:"bold italic underline lineheight alignleft aligncenter alignright fontsizeselect indent outdent removeformat"}),{config:r}=m(i),t=g(r.value.text);function c(e){console.log(e),a("update:config",{text:e})}return(e,o)=>(h(),v("div",j,[b(n(d),{value:t.value,"onUpdate:value":o[0]||(o[0]=u=>t.value=u),onChange:c,width:"100%",options:n(l),showImageUpload:!1},null,8,["value","options"])]))}});export{B as default};
