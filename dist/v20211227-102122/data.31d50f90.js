import{v as o,bo as n}from"./vendor.1ce5b3a9.js";/* empty css               */import{b as d,aD as a}from"./index.b82b58bf.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const{t}=d();function s(){return[{dataIndex:"type",title:t("sys.errorLog.tableColumnType"),width:80,customRender:({text:e})=>{const r=e===a.VUE?"green":e===a.RESOURCE?"cyan":e===a.PROMISE?"blue":a.AJAX?"red":"purple";return o(n,{color:r},{default:()=>e})}},{dataIndex:"url",title:"URL",width:200},{dataIndex:"time",title:t("sys.errorLog.tableColumnDate"),width:160},{dataIndex:"file",title:t("sys.errorLog.tableColumnFile"),width:200},{dataIndex:"name",title:"Name",width:200},{dataIndex:"message",title:t("sys.errorLog.tableColumnMsg"),width:300},{dataIndex:"stack",title:t("sys.errorLog.tableColumnStackMsg")}]}function c(){return s().map(e=>({field:e.dataIndex,label:e.title}))}export{s as getColumns,c as getDescSchema};
