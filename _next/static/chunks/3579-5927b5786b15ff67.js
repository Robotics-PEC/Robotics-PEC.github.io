"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3579],{822:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},1340:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]])},1575:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]])},1592:(e,t,r)=>{r.d(t,{UC:()=>Z,B8:()=>V,bL:()=>$,l9:()=>Y});var a=r(4232),n=r(3716),o=r(1844),i=r(8775),l=r(714),s=r(294),d=r(6326),c=r(2146),u=r(8162),f=r(4966),p=r(7876),h="rovingFocusGroup.onEntryFocus",v={bubbles:!1,cancelable:!0},m="RovingFocusGroup",[b,y,w]=(0,i.N)(m),[x,A]=(0,o.A)(m,[w]),[g,k]=x(m),j=a.forwardRef((e,t)=>(0,p.jsx)(b.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,p.jsx)(b.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,p.jsx)(C,{...e,ref:t})})}));j.displayName=m;var C=a.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:r,orientation:o,loop:i=!1,dir:s,currentTabStopId:m,defaultCurrentTabStopId:b,onCurrentTabStopIdChange:w,onEntryFocus:x,preventScrollOnEntryFocus:A=!1,...k}=e,j=a.useRef(null),C=(0,l.s)(t,j),R=(0,f.jH)(s),[I=null,D]=(0,u.i)({prop:m,defaultProp:b,onChange:w}),[N,F]=a.useState(!1),T=(0,c.c)(x),_=y(r),E=a.useRef(!1),[H,G]=a.useState(0);return a.useEffect(()=>{let e=j.current;if(e)return e.addEventListener(h,T),()=>e.removeEventListener(h,T)},[T]),(0,p.jsx)(g,{scope:r,orientation:o,dir:R,loop:i,currentTabStopId:I,onItemFocus:a.useCallback(e=>D(e),[D]),onItemShiftTab:a.useCallback(()=>F(!0),[]),onFocusableItemAdd:a.useCallback(()=>G(e=>e+1),[]),onFocusableItemRemove:a.useCallback(()=>G(e=>e-1),[]),children:(0,p.jsx)(d.sG.div,{tabIndex:N||0===H?-1:0,"data-orientation":o,...k,ref:C,style:{outline:"none",...e.style},onMouseDown:(0,n.m)(e.onMouseDown,()=>{E.current=!0}),onFocus:(0,n.m)(e.onFocus,e=>{let t=!E.current;if(e.target===e.currentTarget&&t&&!N){let t=new CustomEvent(h,v);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=_().filter(e=>e.focusable);M([e.find(e=>e.active),e.find(e=>e.id===I),...e].filter(Boolean).map(e=>e.ref.current),A)}}E.current=!1}),onBlur:(0,n.m)(e.onBlur,()=>F(!1))})})}),R="RovingFocusGroupItem",I=a.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:r,focusable:o=!0,active:i=!1,tabStopId:l,...c}=e,u=(0,s.B)(),f=l||u,h=k(R,r),v=h.currentTabStopId===f,m=y(r),{onFocusableItemAdd:w,onFocusableItemRemove:x}=h;return a.useEffect(()=>{if(o)return w(),()=>x()},[o,w,x]),(0,p.jsx)(b.ItemSlot,{scope:r,id:f,focusable:o,active:i,children:(0,p.jsx)(d.sG.span,{tabIndex:v?0:-1,"data-orientation":h.orientation,...c,ref:t,onMouseDown:(0,n.m)(e.onMouseDown,e=>{o?h.onItemFocus(f):e.preventDefault()}),onFocus:(0,n.m)(e.onFocus,()=>h.onItemFocus(f)),onKeyDown:(0,n.m)(e.onKeyDown,e=>{if("Tab"===e.key&&e.shiftKey){h.onItemShiftTab();return}if(e.target!==e.currentTarget)return;let t=function(e,t,r){var a;let n=(a=e.key,"rtl"!==r?a:"ArrowLeft"===a?"ArrowRight":"ArrowRight"===a?"ArrowLeft":a);if(!("vertical"===t&&["ArrowLeft","ArrowRight"].includes(n))&&!("horizontal"===t&&["ArrowUp","ArrowDown"].includes(n)))return D[n]}(e,h.orientation,h.dir);if(void 0!==t){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let r=m().filter(e=>e.focusable).map(e=>e.ref.current);if("last"===t)r.reverse();else if("prev"===t||"next"===t){"prev"===t&&r.reverse();let a=r.indexOf(e.currentTarget);r=h.loop?function(e,t){return e.map((r,a)=>e[(t+a)%e.length])}(r,a+1):r.slice(a+1)}setTimeout(()=>M(r))}})})})});I.displayName=R;var D={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function M(e,t=!1){let r=document.activeElement;for(let a of e)if(a===r||(a.focus({preventScroll:t}),document.activeElement!==r))return}var N=r(6822),F="Tabs",[T,_]=(0,o.A)(F,[A]),E=A(),[H,G]=T(F),L=a.forwardRef((e,t)=>{let{__scopeTabs:r,value:a,onValueChange:n,defaultValue:o,orientation:i="horizontal",dir:l,activationMode:c="automatic",...h}=e,v=(0,f.jH)(l),[m,b]=(0,u.i)({prop:a,onChange:n,defaultProp:o});return(0,p.jsx)(H,{scope:r,baseId:(0,s.B)(),value:m,onValueChange:b,orientation:i,dir:v,activationMode:c,children:(0,p.jsx)(d.sG.div,{dir:v,"data-orientation":i,...h,ref:t})})});L.displayName=F;var K="TabsList",P=a.forwardRef((e,t)=>{let{__scopeTabs:r,loop:a=!0,...n}=e,o=G(K,r),i=E(r);return(0,p.jsx)(j,{asChild:!0,...i,orientation:o.orientation,dir:o.dir,loop:a,children:(0,p.jsx)(d.sG.div,{role:"tablist","aria-orientation":o.orientation,...n,ref:t})})});P.displayName=K;var S="TabsTrigger",q=a.forwardRef((e,t)=>{let{__scopeTabs:r,value:a,disabled:o=!1,...i}=e,l=G(S,r),s=E(r),c=U(l.baseId,a),u=O(l.baseId,a),f=a===l.value;return(0,p.jsx)(I,{asChild:!0,...s,focusable:!o,active:f,children:(0,p.jsx)(d.sG.button,{type:"button",role:"tab","aria-selected":f,"aria-controls":u,"data-state":f?"active":"inactive","data-disabled":o?"":void 0,disabled:o,id:c,...i,ref:t,onMouseDown:(0,n.m)(e.onMouseDown,e=>{o||0!==e.button||!1!==e.ctrlKey?e.preventDefault():l.onValueChange(a)}),onKeyDown:(0,n.m)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&l.onValueChange(a)}),onFocus:(0,n.m)(e.onFocus,()=>{let e="manual"!==l.activationMode;f||o||!e||l.onValueChange(a)})})})});q.displayName=S;var z="TabsContent",B=a.forwardRef((e,t)=>{let{__scopeTabs:r,value:n,forceMount:o,children:i,...l}=e,s=G(z,r),c=U(s.baseId,n),u=O(s.baseId,n),f=n===s.value,h=a.useRef(f);return a.useEffect(()=>{let e=requestAnimationFrame(()=>h.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,p.jsx)(N.C,{present:o||f,children:({present:r})=>(0,p.jsx)(d.sG.div,{"data-state":f?"active":"inactive","data-orientation":s.orientation,role:"tabpanel","aria-labelledby":c,hidden:!r,id:u,tabIndex:0,...l,ref:t,style:{...e.style,animationDuration:h.current?"0s":void 0},children:r&&i})})});function U(e,t){return`${e}-trigger-${t}`}function O(e,t){return`${e}-content-${t}`}B.displayName=z;var $=L,V=P,Y=q,Z=B},2671:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},2885:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},3022:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]])},4966:(e,t,r)=>{r.d(t,{jH:()=>o});var a=r(4232);r(7876);var n=a.createContext(void 0);function o(e){let t=a.useContext(n);return e||t||"ltr"}},5104:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},5390:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},5851:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]])},8221:(e,t,r)=>{r.d(t,{nD:()=>H,ub:()=>ee,As:()=>Y,$m:()=>W,UC:()=>ei,Y9:()=>en,q7:()=>ea,bL:()=>er,l9:()=>eo});var a=r(4232),n=r(1844),o=r(8775),i=r(714),l=r(3716),s=r(8162),d=r(6326),c=r(1285),u=r(6822),f=r(294),p=r(7876),h="Collapsible",[v,m]=(0,n.A)(h),[b,y]=v(h),w=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,open:n,defaultOpen:o,disabled:i,onOpenChange:l,...c}=e,[u=!1,h]=(0,s.i)({prop:n,defaultProp:o,onChange:l});return(0,p.jsx)(b,{scope:r,disabled:i,contentId:(0,f.B)(),open:u,onOpenToggle:a.useCallback(()=>h(e=>!e),[h]),children:(0,p.jsx)(d.sG.div,{"data-state":C(u),"data-disabled":i?"":void 0,...c,ref:t})})});w.displayName=h;var x="CollapsibleTrigger",A=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,...a}=e,n=y(x,r);return(0,p.jsx)(d.sG.button,{type:"button","aria-controls":n.contentId,"aria-expanded":n.open||!1,"data-state":C(n.open),"data-disabled":n.disabled?"":void 0,disabled:n.disabled,...a,ref:t,onClick:(0,l.m)(e.onClick,n.onOpenToggle)})});A.displayName=x;var g="CollapsibleContent",k=a.forwardRef((e,t)=>{let{forceMount:r,...a}=e,n=y(g,e.__scopeCollapsible);return(0,p.jsx)(u.C,{present:r||n.open,children:({present:e})=>(0,p.jsx)(j,{...a,ref:t,present:e})})});k.displayName=g;var j=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,present:n,children:o,...l}=e,s=y(g,r),[u,f]=a.useState(n),h=a.useRef(null),v=(0,i.s)(t,h),m=a.useRef(0),b=m.current,w=a.useRef(0),x=w.current,A=s.open||u,k=a.useRef(A),j=a.useRef(void 0);return a.useEffect(()=>{let e=requestAnimationFrame(()=>k.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,c.N)(()=>{let e=h.current;if(e){j.current=j.current||{transitionDuration:e.style.transitionDuration,animationName:e.style.animationName},e.style.transitionDuration="0s",e.style.animationName="none";let t=e.getBoundingClientRect();m.current=t.height,w.current=t.width,k.current||(e.style.transitionDuration=j.current.transitionDuration,e.style.animationName=j.current.animationName),f(n)}},[s.open,n]),(0,p.jsx)(d.sG.div,{"data-state":C(s.open),"data-disabled":s.disabled?"":void 0,id:s.contentId,hidden:!A,...l,ref:v,style:{"--radix-collapsible-content-height":b?`${b}px`:void 0,"--radix-collapsible-content-width":x?`${x}px`:void 0,...e.style},children:A&&o})});function C(e){return e?"open":"closed"}var R=r(4966),I="Accordion",D=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[M,N,F]=(0,o.N)(I),[T,_]=(0,n.A)(I,[F,m]),E=m(),H=a.forwardRef((e,t)=>{let{type:r,...a}=e;return(0,p.jsx)(M.Provider,{scope:e.__scopeAccordion,children:"multiple"===r?(0,p.jsx)(q,{...a,ref:t}):(0,p.jsx)(S,{...a,ref:t})})});H.displayName=I;var[G,L]=T(I),[K,P]=T(I,{collapsible:!1}),S=a.forwardRef((e,t)=>{let{value:r,defaultValue:n,onValueChange:o=()=>{},collapsible:i=!1,...l}=e,[d,c]=(0,s.i)({prop:r,defaultProp:n,onChange:o});return(0,p.jsx)(G,{scope:e.__scopeAccordion,value:d?[d]:[],onItemOpen:c,onItemClose:a.useCallback(()=>i&&c(""),[i,c]),children:(0,p.jsx)(K,{scope:e.__scopeAccordion,collapsible:i,children:(0,p.jsx)(U,{...l,ref:t})})})}),q=a.forwardRef((e,t)=>{let{value:r,defaultValue:n,onValueChange:o=()=>{},...i}=e,[l=[],d]=(0,s.i)({prop:r,defaultProp:n,onChange:o}),c=a.useCallback(e=>d((t=[])=>[...t,e]),[d]),u=a.useCallback(e=>d((t=[])=>t.filter(t=>t!==e)),[d]);return(0,p.jsx)(G,{scope:e.__scopeAccordion,value:l,onItemOpen:c,onItemClose:u,children:(0,p.jsx)(K,{scope:e.__scopeAccordion,collapsible:!0,children:(0,p.jsx)(U,{...i,ref:t})})})}),[z,B]=T(I),U=a.forwardRef((e,t)=>{let{__scopeAccordion:r,disabled:n,dir:o,orientation:s="vertical",...c}=e,u=a.useRef(null),f=(0,i.s)(u,t),h=N(r),v="ltr"===(0,R.jH)(o),m=(0,l.m)(e.onKeyDown,e=>{if(!D.includes(e.key))return;let t=e.target,r=h().filter(e=>!e.ref.current?.disabled),a=r.findIndex(e=>e.ref.current===t),n=r.length;if(-1===a)return;e.preventDefault();let o=a,i=n-1,l=()=>{(o=a+1)>i&&(o=0)},d=()=>{(o=a-1)<0&&(o=i)};switch(e.key){case"Home":o=0;break;case"End":o=i;break;case"ArrowRight":"horizontal"===s&&(v?l():d());break;case"ArrowDown":"vertical"===s&&l();break;case"ArrowLeft":"horizontal"===s&&(v?d():l());break;case"ArrowUp":"vertical"===s&&d()}let c=o%n;r[c].ref.current?.focus()});return(0,p.jsx)(z,{scope:r,disabled:n,direction:o,orientation:s,children:(0,p.jsx)(M.Slot,{scope:r,children:(0,p.jsx)(d.sG.div,{...c,"data-orientation":s,ref:f,onKeyDown:n?void 0:m})})})}),O="AccordionItem",[$,V]=T(O),Y=a.forwardRef((e,t)=>{let{__scopeAccordion:r,value:a,...n}=e,o=B(O,r),i=L(O,r),l=E(r),s=(0,f.B)(),d=a&&i.value.includes(a)||!1,c=o.disabled||e.disabled;return(0,p.jsx)($,{scope:r,open:d,disabled:c,triggerId:s,children:(0,p.jsx)(w,{"data-orientation":o.orientation,"data-state":et(d),...l,...n,ref:t,disabled:c,open:d,onOpenChange:e=>{e?i.onItemOpen(a):i.onItemClose(a)}})})});Y.displayName=O;var Z="AccordionHeader",J=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=B(I,r),o=V(Z,r);return(0,p.jsx)(d.sG.h3,{"data-orientation":n.orientation,"data-state":et(o.open),"data-disabled":o.disabled?"":void 0,...a,ref:t})});J.displayName=Z;var Q="AccordionTrigger",W=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=B(I,r),o=V(Q,r),i=P(Q,r),l=E(r);return(0,p.jsx)(M.ItemSlot,{scope:r,children:(0,p.jsx)(A,{"aria-disabled":o.open&&!i.collapsible||void 0,"data-orientation":n.orientation,id:o.triggerId,...l,...a,ref:t})})});W.displayName=Q;var X="AccordionContent",ee=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=B(I,r),o=V(X,r),i=E(r);return(0,p.jsx)(k,{role:"region","aria-labelledby":o.triggerId,"data-orientation":n.orientation,...i,...a,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...e.style}})});function et(e){return e?"open":"closed"}ee.displayName=X;var er=H,ea=Y,en=J,eo=W,ei=ee},9142:(e,t,r)=>{r.d(t,{A:()=>a});let a=(0,r(1713).A)("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]])}}]);