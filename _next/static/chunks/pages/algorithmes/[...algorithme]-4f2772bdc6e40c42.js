(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[504],{3602:function(e,t,l){(window.__NEXT_P=window.__NEXT_P||[]).push(["/algorithmes/[...algorithme]",function(){return l(3389)}])},3389:function(e,t,l){"use strict";l.r(t),l.d(t,{__N_SSG:function(){return j},default:function(){return x}});var n=l(2322),r=l(6906),s=l(3262),i=l(1608),u=l(7273),a=l(5145),c=l(2784),o=l(6254);let d=e=>{let t=null==e?void 0:e.situation,l=e.rule,n=e.rules,[r,s]=(0,c.useState)(null),[i,u]=(0,c.useState)(t),[a,d]=(0,c.useState)(null);(0,c.useEffect)(()=>{u({}),s(null);let e=new o.ZP(n);d(e)},[n]);let h=(e,t)=>{if(isNaN(t)?"oui"===t||"non"===t||(t="'".concat(t,"'")):t=parseFloat(t),t){let l={...i,[e]:t};u(l),a&&a.setSituation(l)}},j=a&&a.evaluate(l),x=j&&Object.entries(j.missingVariables)||[];return null===r&&Object.values(x).length&&s(Object.values(x).map(e=>{let[t]=e;return t})),{engine:a,evaluated:j,situation:i,setSituationValue:h,allMissingVariables:r}},h=e=>{let{meta:t}=e;return t&&(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{children:t.titre}),(0,n.jsx)("p",{children:t.description}),t.références&&(0,n.jsxs)("div",{children:[(0,n.jsxs)("b",{children:["Source",Object.keys(t.références).length>1?"s":"",":"]})," ",Object.keys(t.références).map(e=>(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:t.références[e],children:e})},e))]})]})};var j=!0;function x(e){var t,l,c;let{algorithme:o}=e,j=s.Z[(0,r.Z)(o[0])],x=j.rules,b=j.yaml,{engine:f,evaluated:v,setSituationValue:_,allMissingVariables:g}=d({rules:x,rule:"r\xe9sultat",situation:{}}),m=e=>t=>{_(e,t.currentTarget.value||"")},p=e=>{let t=f&&f.getRule(e);return t&&t.rawNode.question||null},T=f&&(null===(t=f.getParsedRules())||void 0===t?void 0:null===(l=t.meta)||void 0===l?void 0:l.rawNode);return(0,n.jsxs)("div",{children:[(0,n.jsx)("br",{}),(0,n.jsx)(h,{meta:T}),(0,n.jsx)("br",{}),(0,n.jsxs)(i.Tabs,{defaultActiveTab:0,children:[(0,n.jsx)(i.Tab,{label:"Formulaire",children:g&&g.length&&g.map(e=>(0,n.jsxs)("div",{children:[p(e)||e,(0,n.jsx)("br",{}),(0,n.jsx)(i.TextInput,{type:"text",style:{textAlign:"center",width:100},onBlur:m(e)},"".concat(o,"-").concat(e)),(0,n.jsx)("hr",{})]},e))||null}),(0,n.jsx)(i.Tab,{label:"Algorithme",children:(0,n.jsx)(u.Z,{language:"yaml",style:a.rJ,children:b})}),(0,n.jsx)(i.Tab,{label:"Tests",children:"Todo: lancer les tests unitaires"})]}),(0,n.jsx)("h3",{dangerouslySetInnerHTML:{__html:(null==v?void 0:null===(c=v.nodeValue)||void 0===c?void 0:c.toString().replace(/\n/g,"<br/>"))||""}})]})}}},function(e){e.O(0,[578,774,888,179],function(){return e(e.s=3602)}),_N_E=e.O()}]);