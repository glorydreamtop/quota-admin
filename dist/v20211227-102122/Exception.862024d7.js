import{D as N,r as O,aX as R,j as f,u as s,v as r,aH as S,aY as v}from"./vendor.1ce5b3a9.js";import{E as e,i as A,j as G,b as P,a as k,P as _}from"./index.b82b58bf.js";import{n as D}from"./no-data.4b8f3f08.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";var h="/v20211227-102122/net-error.61b7e6df.svg",L=N({name:"ErrorPage",props:{status:{type:Number,default:e.PAGE_NOT_FOUND},title:{type:String,default:""},subTitle:{type:String,default:""},full:{type:Boolean,default:!1}},setup(n){const a=O(new Map),{query:p}=R(),o=A(),c=G(),{t}=P(),{prefixCls:m}=k("app-exception-page"),x=f(()=>{const{status:l}=p,{status:i}=n;return Number(l)||i}),E=f(()=>s(a).get(s(x))),b=t("sys.exception.backLogin"),u=t("sys.exception.backHome");return s(a).set(e.PAGE_NOT_ACCESS,{title:"403",status:`${e.PAGE_NOT_ACCESS}`,subTitle:t("sys.exception.subTitle403"),btnText:n.full?b:u,handler:()=>n.full?o(_.BASE_LOGIN):o()}),s(a).set(e.PAGE_NOT_FOUND,{title:"404",status:`${e.PAGE_NOT_FOUND}`,subTitle:t("sys.exception.subTitle404"),btnText:n.full?b:u,handler:()=>n.full?o(_.BASE_LOGIN):o()}),s(a).set(e.ERROR,{title:"500",status:`${e.ERROR}`,subTitle:t("sys.exception.subTitle500"),btnText:u,handler:()=>o()}),s(a).set(e.PAGE_NOT_DATA,{title:t("sys.exception.noDataTitle"),subTitle:"",btnText:t("common.redo"),handler:()=>c(),icon:D}),s(a).set(e.NET_WORK_ERROR,{title:t("sys.exception.networkErrorTitle"),subTitle:t("sys.exception.networkErrorSubTitle"),btnText:t("common.redo"),handler:()=>c(),icon:h}),()=>{const{title:l,subTitle:i,btnText:T,icon:d,handler:g,status:y}=s(E)||{};return r(v,{class:m,status:y,title:n.title||l,"sub-title":n.subTitle||i},{extra:()=>T&&r(S,{type:"primary",onClick:g},{default:()=>T}),icon:()=>d?r("img",{src:d},null):null})}}});export{L as default};
