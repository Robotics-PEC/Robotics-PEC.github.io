(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5938],{457:(e,t,r)=>{"use strict";r.d(t,{$m:()=>c,As:()=>d,nD:()=>l,ub:()=>u});var a=r(7876),n=r(4232),o=r(8221),i=r(822),s=r(612);let l=o.bL,d=n.forwardRef((e,t)=>{let{className:r,...n}=e;return(0,a.jsx)(o.q7,{ref:t,className:(0,s.cn)("border-b",r),...n})});d.displayName="AccordionItem";let c=n.forwardRef((e,t)=>{let{className:r,children:n,...l}=e;return(0,a.jsx)(o.Y9,{className:"flex",children:(0,a.jsxs)(o.l9,{ref:t,className:(0,s.cn)("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",r),...l,children:[n,(0,a.jsx)(i.A,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]})})});c.displayName=o.l9.displayName;let u=n.forwardRef((e,t)=>{let{className:r,children:n,...i}=e;return(0,a.jsx)(o.UC,{ref:t,className:"overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",...i,children:(0,a.jsx)("div",{className:(0,s.cn)("pb-4 pt-0",r),children:n})})});u.displayName=o.UC.displayName},822:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});let a=(0,r(1713).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},1184:(e,t,r)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/components/ProjectsEditor",function(){return r(8244)}])},2436:(e,t,r)=>{"use strict";r.d(t,{a:()=>o});var a=r(7876);r(4232);var n=r(612);let o=e=>{let{size:t="md",text:r,className:o,variant:i="spinner",isLoading:s,children:l}=e,d={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,a.jsx)(a.Fragment,{children:s?(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(i){case"spinner":return(0,a.jsx)("div",{className:(0,n.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",d[t],o)});case"pulse":return(0,a.jsxs)("div",{className:(0,n.cn)("relative flex items-center justify-center",d[t],o),children:[(0,a.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,a.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,a.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,a.jsx)("div",{className:(0,n.cn)("flex space-x-2",o),children:[0,1,2].map(e=>(0,a.jsx)("div",{className:(0,n.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),r&&(0,a.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:r})]}),(0,a.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):l})}},3022:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});let a=(0,r(1713).A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]])},4966:(e,t,r)=>{"use strict";r.d(t,{jH:()=>o});var a=r(4232);r(7876);var n=a.createContext(void 0);function o(e){let t=a.useContext(n);return e||t||"ltr"}},5104:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});let a=(0,r(1713).A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},5495:(e,t,r)=>{"use strict";r.d(t,{Se:()=>d,V6:()=>s,VM:()=>f,jW:()=>c,ts:()=>i,vS:()=>l,xp:()=>m});var a=r(612),n=r(5263);let o=async e=>{let{data:t,error:r}=await n.S.storage.from("media").list(e);return r?(console.log(r),[]):null==t?void 0:t.map(e=>e.name)},i=async e=>{let t=await o(e),r=[];for(let a=0;a<t.length;a++){let{data:o}=n.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[a]));r.push(o.publicUrl)}return r},s=async(e,t,r)=>{let o=t.split(".")[t.split(".").length-1],i="image/".concat(o),s=r.replace(/^data:image\/\w+;base64,/,""),l=(0,a.i)(s,i),d="".concat(e,"/").concat(t),{data:c,error:u}=await n.S.storage.from("media").upload(d,l,{contentType:i,upsert:!0});return u&&console.log(u),c},l=async e=>{let{data:t,error:r}=await n.S.storage.from("media").remove(e);if(r){console.log(r);return}return t},d=async(e,t)=>{let{data:r,error:a}=await n.S.storage.from("media").download("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e));return a?(console.log(a),null):await r.text()},c=async(e,t,r)=>{let o="text/markdown",i=new File([(0,a.OO)(r)],e,{type:o});await n.S.storage.from("media").upload("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e),i,{contentType:o,upsert:!0})},u=async e=>{let t=[],{data:r,error:a}=await n.S.storage.from("media").list(e,{limit:1e3});if(a)return console.error("Error listing files:",a),[];for(let a of r){var o;if(a.name&&(null===(o=a.metadata)||void 0===o?void 0:o.mimetype)!=="inode/directory"&&t.push("".concat(e?e+"/":"").concat(a.name)),a.name&&null===a.metadata){let r="".concat(e?e+"/":"").concat(a.name),n=await u(r);t.push(...n)}}return t},m=async(e,t)=>{let r=await u("markdown/".concat(t,"/").concat(e));if(r.length>0){let{data:e,error:t}=await n.S.storage.from("media").remove(r);if(t){console.log(t);return}return e}throw Error('No files in the folder "markdown/'.concat(t,"/").concat(e,'"'))},f=async(e,t)=>{let{data:r,error:a}=await n.S.storage.from("media").remove(["markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e)]);if(a){console.log(a);return}return r}},7041:(e,t,r)=>{"use strict";r.d(t,{$:()=>d,r:()=>l});var a=r(7876),n=r(4232),o=r(2987),i=r(9518),s=r(612);let l=(0,i.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=n.forwardRef((e,t)=>{let{className:r,variant:n,size:i,asChild:d=!1,...c}=e,u=d?o.DX:"button";return(0,a.jsx)(u,{className:(0,s.cn)(l({variant:n,size:i,className:r})),ref:t,...c})});d.displayName="Button"},8221:(e,t,r)=>{"use strict";r.d(t,{UC:()=>ei,Y9:()=>en,q7:()=>ea,bL:()=>er,l9:()=>eo});var a=r(4232),n=r(1844),o=r(8775),i=r(714),s=r(3716),l=r(8162),d=r(6326),c=r(1285),u=r(6822),m=r(294),f=r(7876),p="Collapsible",[h,v]=(0,n.A)(p),[g,b]=h(p),x=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,open:n,defaultOpen:o,disabled:i,onOpenChange:s,...c}=e,[u=!1,p]=(0,l.i)({prop:n,defaultProp:o,onChange:s});return(0,f.jsx)(g,{scope:r,disabled:i,contentId:(0,m.B)(),open:u,onOpenToggle:a.useCallback(()=>p(e=>!e),[p]),children:(0,f.jsx)(d.sG.div,{"data-state":A(u),"data-disabled":i?"":void 0,...c,ref:t})})});x.displayName=p;var w="CollapsibleTrigger",y=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,...a}=e,n=b(w,r);return(0,f.jsx)(d.sG.button,{type:"button","aria-controls":n.contentId,"aria-expanded":n.open||!1,"data-state":A(n.open),"data-disabled":n.disabled?"":void 0,disabled:n.disabled,...a,ref:t,onClick:(0,s.m)(e.onClick,n.onOpenToggle)})});y.displayName=w;var j="CollapsibleContent",N=a.forwardRef((e,t)=>{let{forceMount:r,...a}=e,n=b(j,e.__scopeCollapsible);return(0,f.jsx)(u.C,{present:r||n.open,children:({present:e})=>(0,f.jsx)(k,{...a,ref:t,present:e})})});N.displayName=j;var k=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,present:n,children:o,...s}=e,l=b(j,r),[u,m]=a.useState(n),p=a.useRef(null),h=(0,i.s)(t,p),v=a.useRef(0),g=v.current,x=a.useRef(0),w=x.current,y=l.open||u,N=a.useRef(y),k=a.useRef(void 0);return a.useEffect(()=>{let e=requestAnimationFrame(()=>N.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,c.N)(()=>{let e=p.current;if(e){k.current=k.current||{transitionDuration:e.style.transitionDuration,animationName:e.style.animationName},e.style.transitionDuration="0s",e.style.animationName="none";let t=e.getBoundingClientRect();v.current=t.height,x.current=t.width,N.current||(e.style.transitionDuration=k.current.transitionDuration,e.style.animationName=k.current.animationName),m(n)}},[l.open,n]),(0,f.jsx)(d.sG.div,{"data-state":A(l.open),"data-disabled":l.disabled?"":void 0,id:l.contentId,hidden:!y,...s,ref:h,style:{"--radix-collapsible-content-height":g?`${g}px`:void 0,"--radix-collapsible-content-width":w?`${w}px`:void 0,...e.style},children:y&&o})});function A(e){return e?"open":"closed"}var C=r(4966),_="Accordion",R=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[I,S,D]=(0,o.N)(_),[E,O]=(0,n.A)(_,[D,v]),P=v(),U=a.forwardRef((e,t)=>{let{type:r,...a}=e;return(0,f.jsx)(I.Provider,{scope:e.__scopeAccordion,children:"multiple"===r?(0,f.jsx)(G,{...a,ref:t}):(0,f.jsx)(F,{...a,ref:t})})});U.displayName=_;var[z,H]=E(_),[T,q]=E(_,{collapsible:!1}),F=a.forwardRef((e,t)=>{let{value:r,defaultValue:n,onValueChange:o=()=>{},collapsible:i=!1,...s}=e,[d,c]=(0,l.i)({prop:r,defaultProp:n,onChange:o});return(0,f.jsx)(z,{scope:e.__scopeAccordion,value:d?[d]:[],onItemOpen:c,onItemClose:a.useCallback(()=>i&&c(""),[i,c]),children:(0,f.jsx)(T,{scope:e.__scopeAccordion,collapsible:i,children:(0,f.jsx)(B,{...s,ref:t})})})}),G=a.forwardRef((e,t)=>{let{value:r,defaultValue:n,onValueChange:o=()=>{},...i}=e,[s=[],d]=(0,l.i)({prop:r,defaultProp:n,onChange:o}),c=a.useCallback(e=>d((t=[])=>[...t,e]),[d]),u=a.useCallback(e=>d((t=[])=>t.filter(t=>t!==e)),[d]);return(0,f.jsx)(z,{scope:e.__scopeAccordion,value:s,onItemOpen:c,onItemClose:u,children:(0,f.jsx)(T,{scope:e.__scopeAccordion,collapsible:!0,children:(0,f.jsx)(B,{...i,ref:t})})})}),[L,M]=E(_),B=a.forwardRef((e,t)=>{let{__scopeAccordion:r,disabled:n,dir:o,orientation:l="vertical",...c}=e,u=a.useRef(null),m=(0,i.s)(u,t),p=S(r),h="ltr"===(0,C.jH)(o),v=(0,s.m)(e.onKeyDown,e=>{if(!R.includes(e.key))return;let t=e.target,r=p().filter(e=>!e.ref.current?.disabled),a=r.findIndex(e=>e.ref.current===t),n=r.length;if(-1===a)return;e.preventDefault();let o=a,i=n-1,s=()=>{(o=a+1)>i&&(o=0)},d=()=>{(o=a-1)<0&&(o=i)};switch(e.key){case"Home":o=0;break;case"End":o=i;break;case"ArrowRight":"horizontal"===l&&(h?s():d());break;case"ArrowDown":"vertical"===l&&s();break;case"ArrowLeft":"horizontal"===l&&(h?d():s());break;case"ArrowUp":"vertical"===l&&d()}let c=o%n;r[c].ref.current?.focus()});return(0,f.jsx)(L,{scope:r,disabled:n,direction:o,orientation:l,children:(0,f.jsx)(I.Slot,{scope:r,children:(0,f.jsx)(d.sG.div,{...c,"data-orientation":l,ref:m,onKeyDown:n?void 0:v})})})}),$="AccordionItem",[V,X]=E($),K=a.forwardRef((e,t)=>{let{__scopeAccordion:r,value:a,...n}=e,o=M($,r),i=H($,r),s=P(r),l=(0,m.B)(),d=a&&i.value.includes(a)||!1,c=o.disabled||e.disabled;return(0,f.jsx)(V,{scope:r,open:d,disabled:c,triggerId:l,children:(0,f.jsx)(x,{"data-orientation":o.orientation,"data-state":et(d),...s,...n,ref:t,disabled:c,open:d,onOpenChange:e=>{e?i.onItemOpen(a):i.onItemClose(a)}})})});K.displayName=$;var Y="AccordionHeader",W=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=M(_,r),o=X(Y,r);return(0,f.jsx)(d.sG.h3,{"data-orientation":n.orientation,"data-state":et(o.open),"data-disabled":o.disabled?"":void 0,...a,ref:t})});W.displayName=Y;var J="AccordionTrigger",Q=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=M(_,r),o=X(J,r),i=q(J,r),s=P(r);return(0,f.jsx)(I.ItemSlot,{scope:r,children:(0,f.jsx)(y,{"aria-disabled":o.open&&!i.collapsible||void 0,"data-orientation":n.orientation,id:o.triggerId,...s,...a,ref:t})})});Q.displayName=J;var Z="AccordionContent",ee=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,n=M(_,r),o=X(Z,r),i=P(r);return(0,f.jsx)(N,{role:"region","aria-labelledby":o.triggerId,"data-orientation":n.orientation,...i,...a,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...e.style}})});function et(e){return e?"open":"closed"}ee.displayName=Z;var er=U,ea=K,en=W,eo=Q,ei=ee}},e=>{var t=t=>e(e.s=t);e.O(0,[5352,6361,3466,1875,9546,6991,5023,3958,3410,8244,636,6593,8792],()=>t(1184)),_N_E=e.O()}]);