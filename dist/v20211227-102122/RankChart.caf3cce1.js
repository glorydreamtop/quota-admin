import{u as i}from"./useECharts.3cfbc595.js";import{D as p,Y as f,r as m,j as d,V as h,F as v,G as b,K as x}from"./vendor.1ce5b3a9.js";import"./useTimeout.9c582638.js";import"./index.b82b58bf.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const C={class:"h-full"},g=p({props:{dataList:null,title:null,size:null},setup(l){const c=l,{dataList:a,title:s,size:n}=f(c),o=m(),t=d(()=>a.value.slice(0,n.value)),{setOptions:r}=i(o);return r({title:{text:s.value,left:"center"}}),h(a,u=>{u.length>0&&r({color:["#31868f","#ffdb3f"],title:{text:s.value,left:"center"},tooltip:{trigger:"axis",axisPointer:{type:"cross",crossStyle:{color:"#999"}}},legend:{top:"bottom",data:["\u6301\u4E70\u4ED3\u91CF","\u589E\u51CF\u91CF"]},xAxis:{type:"category",data:t.value.map(e=>e.memberName)},yAxis:{type:"value"},series:[{name:"\u6301\u4E70\u4ED3\u91CF",type:"bar",data:t.value.map(e=>e.volume)},{name:"\u589E\u51CF\u91CF",type:"bar",data:t.value.map(e=>e.volumeChange)}]})},{deep:!0}),(u,e)=>(v(),b("div",C,[x("div",{ref_key:"chartRef",ref:o,class:"h-full"},null,512)]))}});export{g as default};