import{u as _,a as h,L as F,_ as R,b as S}from"./LoginFormTitle.b6c76195.js";import{D as z,aR as p,aJ as c,r as f,R as I,j as L,u as e,F as P,G as U,v as s,a9 as t,aT as B,aU as d,L as u,aH as g,ab as T,ae as E}from"./vendor.1ce5b3a9.js";/* empty css               *//* empty css               *//* empty css              */import{S as N}from"./index.a19561bc.js";import{C as V}from"./index.6b5e08fe.js";import{b as D}from"./index.b82b58bf.js";import"http://at.alicdn.com/t/font_2948274_sdqssf53jp.js";const W=z({setup(G){const r=p.Item,x=c.Password,{t:n}=D(),{handleBackLogin:v,getLoginState:b}=_(),m=f(),y=f(!1),a=I({account:"",password:"",confirmPassword:"",mobile:"",sms:"",policy:!1}),{getFormRules:w}=h(a),{validForm:k}=S(m),j=L(()=>e(b)===F.REGISTER);async function C(){const i=await k();!i||console.log(i)}return(i,o)=>e(j)?(P(),U(T,{key:0},[s(R,{class:"enter-x"}),s(e(p),{class:"p-4 enter-x",model:e(a),rules:e(w),ref_key:"formRef",ref:m},{default:t(()=>[s(e(r),{name:"account",class:"enter-x"},{default:t(()=>[s(e(c),{class:"fix-auto-fill",size:"large",value:e(a).account,"onUpdate:value":o[0]||(o[0]=l=>e(a).account=l),placeholder:e(n)("sys.login.userName")},null,8,["value","placeholder"])]),_:1}),s(e(r),{name:"mobile",class:"enter-x"},{default:t(()=>[s(e(c),{size:"large",value:e(a).mobile,"onUpdate:value":o[1]||(o[1]=l=>e(a).mobile=l),placeholder:e(n)("sys.login.mobile"),class:"fix-auto-fill"},null,8,["value","placeholder"])]),_:1}),s(e(r),{name:"sms",class:"enter-x"},{default:t(()=>[s(e(V),{size:"large",class:"fix-auto-fill",value:e(a).sms,"onUpdate:value":o[2]||(o[2]=l=>e(a).sms=l),placeholder:e(n)("sys.login.smsCode")},null,8,["value","placeholder"])]),_:1}),s(e(r),{name:"password",class:"enter-x"},{default:t(()=>[s(e(N),{size:"large",value:e(a).password,"onUpdate:value":o[3]||(o[3]=l=>e(a).password=l),placeholder:e(n)("sys.login.password")},null,8,["value","placeholder"])]),_:1}),s(e(r),{name:"confirmPassword",class:"enter-x"},{default:t(()=>[s(e(x),{size:"large",visibilityToggle:"",value:e(a).confirmPassword,"onUpdate:value":o[4]||(o[4]=l=>e(a).confirmPassword=l),placeholder:e(n)("sys.login.confirmPassword")},null,8,["value","placeholder"])]),_:1}),s(e(r),{class:"enter-x",name:"policy"},{default:t(()=>[s(e(B),{checked:e(a).policy,"onUpdate:checked":o[5]||(o[5]=l=>e(a).policy=l),size:"small"},{default:t(()=>[d(u(e(n)("sys.login.policy")),1)]),_:1},8,["checked"])]),_:1}),s(e(g),{type:"primary",class:"enter-x",size:"large",block:"",onClick:C,loading:y.value},{default:t(()=>[d(u(e(n)("sys.login.registerButton")),1)]),_:1},8,["loading"]),s(e(g),{size:"large",block:"",class:"mt-4 enter-x",onClick:e(v)},{default:t(()=>[d(u(e(n)("sys.login.backSignIn")),1)]),_:1},8,["onClick"])]),_:1},8,["model","rules"])],64)):E("",!0)}});export{W as default};
