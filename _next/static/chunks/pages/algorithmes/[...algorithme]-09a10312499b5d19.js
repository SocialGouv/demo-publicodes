(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[504],{3602:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/algorithmes/[...algorithme]",function(){return n(4237)}])},4237:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return a},default:function(){return c}});var l=n(2322),u=n(2784),r=n(6906),s=n(3262),i=n(6254),o=n(1608),a=!0;function c(e){var t;let{algorithme:n}=e,[a,c]=(0,u.useState)({}),[_,f]=(0,u.useState)(null),[h,d]=(0,u.useState)(null),g=s.Z[(0,r.Z)(n)];(0,u.useEffect)(()=>{let e=new i.ZP(g);e.setSituation(a),f(e)},[n,a]),(0,u.useEffect)(()=>{d(null)},[n]);let x=_&&_.evaluate("r\xe9sultat"),j=x&&Object.entries(x.missingVariables)||[],p=e=>t=>{let n=t.currentTarget.value||"";if(console.log("onInputChange",n),n=isNaN(n)?"'".concat(n,"'"):parseFloat(n)){let l={...a,[e]:n};c(l)}};null===h&&j.length&&d(Object.values(j).map(e=>{let[t]=e;return t}));let v=e=>{let t=_&&_.getRule(e);return t&&t.rawNode.question||null};return console.log({rules:g,missingVariables:j,evaluated:x,situation:a}),(0,l.jsxs)("div",{children:[(0,l.jsx)("br",{}),(0,l.jsx)("h2",{children:n}),(0,l.jsx)("br",{}),h&&h.length&&h.map(e=>(0,l.jsxs)("div",{children:[v(e)||e,(0,l.jsx)("br",{}),(0,l.jsx)(o.TextInput,{type:"text",style:{textAlign:"center"},onBlur:p(e)}),(0,l.jsx)("hr",{})]},e))||null,(0,l.jsx)("h3",{dangerouslySetInnerHTML:{__html:(null==x?void 0:null===(t=x.nodeValue)||void 0===t?void 0:t.toString().replace(/\n/g,"<br/>"))||""}})]})}}},function(e){e.O(0,[661,774,888,179],function(){return e(e.s=3602)}),_N_E=e.O()}]);