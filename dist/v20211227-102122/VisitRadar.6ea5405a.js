import{D as i,r as s,V as r,F as u,a3 as d,a9 as n,K as l,Z as m,u as c,c4 as f}from"./vendor.2e1d877b.js";/* empty css                *//* empty css               *//* empty css               */import{u as h}from"./useECharts.5b02ea72.js";import"./useTimeout.534f4a33.js";import"./index.86e9d70c.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const S=i({props:{loading:Boolean,width:{type:String,default:"100%"},height:{type:String,default:"300px"}},setup(t){const e=t,a=s(null),{setOptions:o}=h(a);return r(()=>e.loading,()=>{e.loading||o({legend:{bottom:0,data:["\u8BBF\u95EE","\u8D2D\u4E70"]},tooltip:{},radar:{radius:"60%",splitNumber:8,indicator:[{text:"\u7535\u8111",max:100},{text:"\u5145\u7535\u5668",max:100},{text:"\u8033\u673A",max:100},{text:"\u624B\u673A",max:100},{text:"Ipad",max:100},{text:"\u8033\u673A",max:100}]},series:[{type:"radar",symbolSize:0,areaStyle:{shadowBlur:0,shadowColor:"rgba(0,0,0,.2)",shadowOffsetX:0,shadowOffsetY:10,opacity:1},data:[{value:[90,50,86,40,50,20],name:"\u8BBF\u95EE",itemStyle:{color:"#b6a2de"}},{value:[70,75,70,76,20,85],name:"\u8D2D\u4E70",itemStyle:{color:"#5ab1ef"}}]}]})},{immediate:!0}),(p,x)=>(u(),d(c(f),{title:"\u8F6C\u5316\u7387",loading:t.loading},{default:n(()=>[l("div",{ref_key:"chartRef",ref:a,style:m({width:t.width,height:t.height})},null,4)]),_:1},8,["loading"]))}});export{S as default};
