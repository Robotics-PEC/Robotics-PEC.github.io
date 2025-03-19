"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1140],{710:(e,r,t)=>{t.d(r,{A:()=>a});let a=(0,t(1713).A)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},822:(e,r,t)=>{t.d(r,{A:()=>a});let a=(0,t(1713).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},1575:(e,r,t)=>{t.d(r,{A:()=>a});let a=(0,t(1713).A)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]])},3022:(e,r,t)=>{t.d(r,{A:()=>a});let a=(0,t(1713).A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]])},4966:(e,r,t)=>{t.d(r,{jH:()=>o});var a=t(4232);t(7876);var n=a.createContext(void 0);function o(e){let r=a.useContext(n);return e||r||"ltr"}},5104:(e,r,t)=>{t.d(r,{A:()=>a});let a=(0,t(1713).A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},8221:(e,r,t)=>{t.d(r,{UC:()=>ei,Y9:()=>en,q7:()=>ea,bL:()=>et,l9:()=>eo});var a=t(4232),n=t(1844),o=t(8775),i=t(714),l=t(3716),d=t(8162),s=t(6326),c=t(1285),p=t(6822),u=t(294),f=t(7876),h="Collapsible",[v,b]=(0,n.A)(h),[m,x]=v(h),y=a.forwardRef((e,r)=>{let{__scopeCollapsible:t,open:n,defaultOpen:o,disabled:i,onOpenChange:l,...c}=e,[p=!1,h]=(0,d.i)({prop:n,defaultProp:o,onChange:l});return(0,f.jsx)(m,{scope:t,disabled:i,contentId:(0,u.B)(),open:p,onOpenToggle:a.useCallback(()=>h(e=>!e),[h]),children:(0,f.jsx)(s.sG.div,{"data-state":k(p),"data-disabled":i?"":void 0,...c,ref:r})})});y.displayName=h;var w="CollapsibleTrigger",A=a.forwardRef((e,r)=>{let{__scopeCollapsible:t,...a}=e,n=x(w,t);return(0,f.jsx)(s.sG.button,{type:"button","aria-controls":n.contentId,"aria-expanded":n.open||!1,"data-state":k(n.open),"data-disabled":n.disabled?"":void 0,disabled:n.disabled,...a,ref:r,onClick:(0,l.m)(e.onClick,n.onOpenToggle)})});A.displayName=w;var g="CollapsibleContent",C=a.forwardRef((e,r)=>{let{forceMount:t,...a}=e,n=x(g,e.__scopeCollapsible);return(0,f.jsx)(p.C,{present:t||n.open,children:({present:e})=>(0,f.jsx)(j,{...a,ref:r,present:e})})});C.displayName=g;var j=a.forwardRef((e,r)=>{let{__scopeCollapsible:t,present:n,children:o,...l}=e,d=x(g,t),[p,u]=a.useState(n),h=a.useRef(null),v=(0,i.s)(r,h),b=a.useRef(0),m=b.current,y=a.useRef(0),w=y.current,A=d.open||p,C=a.useRef(A),j=a.useRef(void 0);return a.useEffect(()=>{let e=requestAnimationFrame(()=>C.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,c.N)(()=>{let e=h.current;if(e){j.current=j.current||{transitionDuration:e.style.transitionDuration,animationName:e.style.animationName},e.style.transitionDuration="0s",e.style.animationName="none";let r=e.getBoundingClientRect();b.current=r.height,y.current=r.width,C.current||(e.style.transitionDuration=j.current.transitionDuration,e.style.animationName=j.current.animationName),u(n)}},[d.open,n]),(0,f.jsx)(s.sG.div,{"data-state":k(d.open),"data-disabled":d.disabled?"":void 0,id:d.contentId,hidden:!A,...l,ref:v,style:{"--radix-collapsible-content-height":m?`${m}px`:void 0,"--radix-collapsible-content-width":w?`${w}px`:void 0,...e.style},children:A&&o})});function k(e){return e?"open":"closed"}var R=t(4966),N="Accordion",_=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[I,D,H]=(0,o.N)(N),[O,P]=(0,n.A)(N,[H,b]),E=b(),G=a.forwardRef((e,r)=>{let{type:t,...a}=e;return(0,f.jsx)(I.Provider,{scope:e.__scopeAccordion,children:"multiple"===t?(0,f.jsx)(U,{...a,ref:r}):(0,f.jsx)(T,{...a,ref:r})})});G.displayName=N;var[q,z]=O(N),[M,S]=O(N,{collapsible:!1}),T=a.forwardRef((e,r)=>{let{value:t,defaultValue:n,onValueChange:o=()=>{},collapsible:i=!1,...l}=e,[s,c]=(0,d.i)({prop:t,defaultProp:n,onChange:o});return(0,f.jsx)(q,{scope:e.__scopeAccordion,value:s?[s]:[],onItemOpen:c,onItemClose:a.useCallback(()=>i&&c(""),[i,c]),children:(0,f.jsx)(M,{scope:e.__scopeAccordion,collapsible:i,children:(0,f.jsx)(F,{...l,ref:r})})})}),U=a.forwardRef((e,r)=>{let{value:t,defaultValue:n,onValueChange:o=()=>{},...i}=e,[l=[],s]=(0,d.i)({prop:t,defaultProp:n,onChange:o}),c=a.useCallback(e=>s((r=[])=>[...r,e]),[s]),p=a.useCallback(e=>s((r=[])=>r.filter(r=>r!==e)),[s]);return(0,f.jsx)(q,{scope:e.__scopeAccordion,value:l,onItemOpen:c,onItemClose:p,children:(0,f.jsx)(M,{scope:e.__scopeAccordion,collapsible:!0,children:(0,f.jsx)(F,{...i,ref:r})})})}),[B,L]=O(N),F=a.forwardRef((e,r)=>{let{__scopeAccordion:t,disabled:n,dir:o,orientation:d="vertical",...c}=e,p=a.useRef(null),u=(0,i.s)(p,r),h=D(t),v="ltr"===(0,R.jH)(o),b=(0,l.m)(e.onKeyDown,e=>{if(!_.includes(e.key))return;let r=e.target,t=h().filter(e=>!e.ref.current?.disabled),a=t.findIndex(e=>e.ref.current===r),n=t.length;if(-1===a)return;e.preventDefault();let o=a,i=n-1,l=()=>{(o=a+1)>i&&(o=0)},s=()=>{(o=a-1)<0&&(o=i)};switch(e.key){case"Home":o=0;break;case"End":o=i;break;case"ArrowRight":"horizontal"===d&&(v?l():s());break;case"ArrowDown":"vertical"===d&&l();break;case"ArrowLeft":"horizontal"===d&&(v?s():l());break;case"ArrowUp":"vertical"===d&&s()}let c=o%n;t[c].ref.current?.focus()});return(0,f.jsx)(B,{scope:t,disabled:n,direction:o,orientation:d,children:(0,f.jsx)(I.Slot,{scope:t,children:(0,f.jsx)(s.sG.div,{...c,"data-orientation":d,ref:u,onKeyDown:n?void 0:b})})})}),K="AccordionItem",[$,Y]=O(K),J=a.forwardRef((e,r)=>{let{__scopeAccordion:t,value:a,...n}=e,o=L(K,t),i=z(K,t),l=E(t),d=(0,u.B)(),s=a&&i.value.includes(a)||!1,c=o.disabled||e.disabled;return(0,f.jsx)($,{scope:t,open:s,disabled:c,triggerId:d,children:(0,f.jsx)(y,{"data-orientation":o.orientation,"data-state":er(s),...l,...n,ref:r,disabled:c,open:s,onOpenChange:e=>{e?i.onItemOpen(a):i.onItemClose(a)}})})});J.displayName=K;var Q="AccordionHeader",V=a.forwardRef((e,r)=>{let{__scopeAccordion:t,...a}=e,n=L(N,t),o=Y(Q,t);return(0,f.jsx)(s.sG.h3,{"data-orientation":n.orientation,"data-state":er(o.open),"data-disabled":o.disabled?"":void 0,...a,ref:r})});V.displayName=Q;var W="AccordionTrigger",X=a.forwardRef((e,r)=>{let{__scopeAccordion:t,...a}=e,n=L(N,t),o=Y(W,t),i=S(W,t),l=E(t);return(0,f.jsx)(I.ItemSlot,{scope:t,children:(0,f.jsx)(A,{"aria-disabled":o.open&&!i.collapsible||void 0,"data-orientation":n.orientation,id:o.triggerId,...l,...a,ref:r})})});X.displayName=W;var Z="AccordionContent",ee=a.forwardRef((e,r)=>{let{__scopeAccordion:t,...a}=e,n=L(N,t),o=Y(Z,t),i=E(t);return(0,f.jsx)(C,{role:"region","aria-labelledby":o.triggerId,"data-orientation":n.orientation,...i,...a,ref:r,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...e.style}})});function er(e){return e?"open":"closed"}ee.displayName=Z;var et=G,ea=J,en=V,eo=X,ei=ee}}]);