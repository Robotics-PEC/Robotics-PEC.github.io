"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4775],{345:(t,e,r)=>{r.d(e,{A:()=>n});let n=(0,r(1713).A)("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]])},1354:(t,e,r)=>{r.d(e,{A:()=>n});let n=(0,r(1713).A)("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]])},3178:(t,e,r)=>{r.d(e,{UC:()=>X,ZL:()=>B,bL:()=>j,l9:()=>G});var n=r(4232),a=r(3716),i=r(714),o=r(1844),s=r(3520),u=r(2658),d=r(870),c=r(294),l=r(2981),h=r(1893),w=r(6822),p=r(6326),f=r(2987),m=r(8162),g=r(4769),v=r(2634),x=r(7876),y="Popover",[b,k]=(0,o.A)(y,[l.Bk]),T=(0,l.Bk)(),[D,M]=b(y),P=t=>{let{__scopePopover:e,children:r,open:a,defaultOpen:i,onOpenChange:o,modal:s=!1}=t,u=T(e),d=n.useRef(null),[h,w]=n.useState(!1),[p=!1,f]=(0,m.i)({prop:a,defaultProp:i,onChange:o});return(0,x.jsx)(l.bL,{...u,children:(0,x.jsx)(D,{scope:e,contentId:(0,c.B)(),triggerRef:d,open:p,onOpenChange:f,onOpenToggle:n.useCallback(()=>f(t=>!t),[f]),hasCustomAnchor:h,onCustomAnchorAdd:n.useCallback(()=>w(!0),[]),onCustomAnchorRemove:n.useCallback(()=>w(!1),[]),modal:s,children:r})})};P.displayName=y;var q="PopoverAnchor";n.forwardRef((t,e)=>{let{__scopePopover:r,...a}=t,i=M(q,r),o=T(r),{onCustomAnchorAdd:s,onCustomAnchorRemove:u}=i;return n.useEffect(()=>(s(),()=>u()),[s,u]),(0,x.jsx)(l.Mz,{...o,...a,ref:e})}).displayName=q;var H="PopoverTrigger",N=n.forwardRef((t,e)=>{let{__scopePopover:r,...n}=t,o=M(H,r),s=T(r),u=(0,i.s)(e,o.triggerRef),d=(0,x.jsx)(p.sG.button,{type:"button","aria-haspopup":"dialog","aria-expanded":o.open,"aria-controls":o.contentId,"data-state":F(o.open),...n,ref:u,onClick:(0,a.m)(t.onClick,o.onOpenToggle)});return o.hasCustomAnchor?d:(0,x.jsx)(l.Mz,{asChild:!0,...s,children:d})});N.displayName=H;var O="PopoverPortal",[S,Y]=b(O,{forceMount:void 0}),R=t=>{let{__scopePopover:e,forceMount:r,children:n,container:a}=t,i=M(O,e);return(0,x.jsx)(S,{scope:e,forceMount:r,children:(0,x.jsx)(w.C,{present:r||i.open,children:(0,x.jsx)(h.Z,{asChild:!0,container:a,children:n})})})};R.displayName=O;var C="PopoverContent",E=n.forwardRef((t,e)=>{let r=Y(C,t.__scopePopover),{forceMount:n=r.forceMount,...a}=t,i=M(C,t.__scopePopover);return(0,x.jsx)(w.C,{present:n||i.open,children:i.modal?(0,x.jsx)(I,{...a,ref:e}):(0,x.jsx)(L,{...a,ref:e})})});E.displayName=C;var I=n.forwardRef((t,e)=>{let r=M(C,t.__scopePopover),o=n.useRef(null),s=(0,i.s)(e,o),u=n.useRef(!1);return n.useEffect(()=>{let t=o.current;if(t)return(0,g.Eq)(t)},[]),(0,x.jsx)(v.A,{as:f.DX,allowPinchZoom:!0,children:(0,x.jsx)(Q,{...t,ref:s,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.m)(t.onCloseAutoFocus,t=>{t.preventDefault(),u.current||r.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.m)(t.onPointerDownOutside,t=>{let e=t.detail.originalEvent,r=0===e.button&&!0===e.ctrlKey;u.current=2===e.button||r},{checkForDefaultPrevented:!1}),onFocusOutside:(0,a.m)(t.onFocusOutside,t=>t.preventDefault(),{checkForDefaultPrevented:!1})})})}),L=n.forwardRef((t,e)=>{let r=M(C,t.__scopePopover),a=n.useRef(!1),i=n.useRef(!1);return(0,x.jsx)(Q,{...t,ref:e,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:e=>{t.onCloseAutoFocus?.(e),e.defaultPrevented||(a.current||r.triggerRef.current?.focus(),e.preventDefault()),a.current=!1,i.current=!1},onInteractOutside:e=>{t.onInteractOutside?.(e),e.defaultPrevented||(a.current=!0,"pointerdown"!==e.detail.originalEvent.type||(i.current=!0));let n=e.target;r.triggerRef.current?.contains(n)&&e.preventDefault(),"focusin"===e.detail.originalEvent.type&&i.current&&e.preventDefault()}})}),Q=n.forwardRef((t,e)=>{let{__scopePopover:r,trapFocus:n,onOpenAutoFocus:a,onCloseAutoFocus:i,disableOutsidePointerEvents:o,onEscapeKeyDown:c,onPointerDownOutside:h,onFocusOutside:w,onInteractOutside:p,...f}=t,m=M(C,r),g=T(r);return(0,u.Oh)(),(0,x.jsx)(d.n,{asChild:!0,loop:!0,trapped:n,onMountAutoFocus:a,onUnmountAutoFocus:i,children:(0,x.jsx)(s.qW,{asChild:!0,disableOutsidePointerEvents:o,onInteractOutside:p,onEscapeKeyDown:c,onPointerDownOutside:h,onFocusOutside:w,onDismiss:()=>m.onOpenChange(!1),children:(0,x.jsx)(l.UC,{"data-state":F(m.open),role:"dialog",id:m.contentId,...g,...f,ref:e,style:{...f.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),A="PopoverClose";function F(t){return t?"open":"closed"}n.forwardRef((t,e)=>{let{__scopePopover:r,...n}=t,i=M(A,r);return(0,x.jsx)(p.sG.button,{type:"button",...n,ref:e,onClick:(0,a.m)(t.onClick,()=>i.onOpenChange(!1))})}).displayName=A,n.forwardRef((t,e)=>{let{__scopePopover:r,...n}=t,a=T(r);return(0,x.jsx)(l.i3,{...a,...n,ref:e})}).displayName="PopoverArrow";var j=P,G=N,B=R,X=E},6785:(t,e,r)=>{r.d(e,{qg:()=>tx});var n=r(2716),a=r(7959),i=r(7359),o=r(6876),s=r(7825),u=r(9266);class d{validate(t,e){return!0}constructor(){this.subPriority=0}}class c extends d{validate(t,e){return this.validateValue(t,this.value,e)}set(t,e,r){return this.setValue(t,e,this.value,r)}constructor(t,e,r,n,a){super(),this.value=t,this.validateValue=e,this.setValue=r,this.priority=n,a&&(this.subPriority=a)}}class l extends d{set(t,e){return e.timestampIsSet?t:(0,n.w)(t,function(t,e){let r=e instanceof Date?(0,n.w)(e,0):new e(0);return r.setFullYear(t.getFullYear(),t.getMonth(),t.getDate()),r.setHours(t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()),r}(t,Date))}constructor(...t){super(...t),this.priority=10,this.subPriority=-1}}class h{run(t,e,r,n){let a=this.parse(t,e,r,n);return a?{setter:new c(a.value,this.validate,this.set,this.priority,this.subPriority),rest:a.rest}:null}validate(t,e,r){return!0}}class w extends h{parse(t,e,r){switch(e){case"G":case"GG":case"GGG":return r.era(t,{width:"abbreviated"})||r.era(t,{width:"narrow"});case"GGGGG":return r.era(t,{width:"narrow"});default:return r.era(t,{width:"wide"})||r.era(t,{width:"abbreviated"})||r.era(t,{width:"narrow"})}}set(t,e,r){return e.era=r,t.setFullYear(r,0,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=140,this.incompatibleTokens=["R","u","t","T"]}}var p=r(6148);let f={month:/^(1[0-2]|0?\d)/,date:/^(3[0-1]|[0-2]?\d)/,dayOfYear:/^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,week:/^(5[0-3]|[0-4]?\d)/,hour23h:/^(2[0-3]|[0-1]?\d)/,hour24h:/^(2[0-4]|[0-1]?\d)/,hour11h:/^(1[0-1]|0?\d)/,hour12h:/^(1[0-2]|0?\d)/,minute:/^[0-5]?\d/,second:/^[0-5]?\d/,singleDigit:/^\d/,twoDigits:/^\d{1,2}/,threeDigits:/^\d{1,3}/,fourDigits:/^\d{1,4}/,anyDigitsSigned:/^-?\d+/,singleDigitSigned:/^-?\d/,twoDigitsSigned:/^-?\d{1,2}/,threeDigitsSigned:/^-?\d{1,3}/,fourDigitsSigned:/^-?\d{1,4}/},m={basicOptionalMinutes:/^([+-])(\d{2})(\d{2})?|Z/,basic:/^([+-])(\d{2})(\d{2})|Z/,basicOptionalSeconds:/^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,extended:/^([+-])(\d{2}):(\d{2})|Z/,extendedOptionalSeconds:/^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/};function g(t,e){return t?{value:e(t.value),rest:t.rest}:t}function v(t,e){let r=e.match(t);return r?{value:parseInt(r[0],10),rest:e.slice(r[0].length)}:null}function x(t,e){let r=e.match(t);if(!r)return null;if("Z"===r[0])return{value:0,rest:e.slice(1)};let n="+"===r[1]?1:-1,a=r[2]?parseInt(r[2],10):0,i=r[3]?parseInt(r[3],10):0,o=r[5]?parseInt(r[5],10):0;return{value:n*(a*p.s0+i*p.Cg+o*p._m),rest:e.slice(r[0].length)}}function y(t){return v(f.anyDigitsSigned,t)}function b(t,e){switch(t){case 1:return v(f.singleDigit,e);case 2:return v(f.twoDigits,e);case 3:return v(f.threeDigits,e);case 4:return v(f.fourDigits,e);default:return v(RegExp("^\\d{1,"+t+"}"),e)}}function k(t,e){switch(t){case 1:return v(f.singleDigitSigned,e);case 2:return v(f.twoDigitsSigned,e);case 3:return v(f.threeDigitsSigned,e);case 4:return v(f.fourDigitsSigned,e);default:return v(RegExp("^-?\\d{1,"+t+"}"),e)}}function T(t){switch(t){case"morning":return 4;case"evening":return 17;case"pm":case"noon":case"afternoon":return 12;default:return 0}}function D(t,e){let r;let n=e>0,a=n?e:1-e;if(a<=50)r=t||100;else{let e=a+50;r=t+100*Math.trunc(e/100)-100*(t>=e%100)}return n?r:1-r}function M(t){return t%400==0||t%4==0&&t%100!=0}class P extends h{parse(t,e,r){let n=t=>({year:t,isTwoDigitYear:"yy"===e});switch(e){case"y":return g(b(4,t),n);case"yo":return g(r.ordinalNumber(t,{unit:"year"}),n);default:return g(b(e.length,t),n)}}validate(t,e){return e.isTwoDigitYear||e.year>0}set(t,e,r){let n=t.getFullYear();if(r.isTwoDigitYear){let e=D(r.year,n);return t.setFullYear(e,0,1),t.setHours(0,0,0,0),t}let a="era"in e&&1!==e.era?1-r.year:r.year;return t.setFullYear(a,0,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=130,this.incompatibleTokens=["Y","R","u","w","I","i","e","c","t","T"]}}var q=r(856),H=r(7540);class N extends h{parse(t,e,r){let n=t=>({year:t,isTwoDigitYear:"YY"===e});switch(e){case"Y":return g(b(4,t),n);case"Yo":return g(r.ordinalNumber(t,{unit:"year"}),n);default:return g(b(e.length,t),n)}}validate(t,e){return e.isTwoDigitYear||e.year>0}set(t,e,r,n){let a=(0,q.h)(t,n);if(r.isTwoDigitYear){let e=D(r.year,a);return t.setFullYear(e,0,n.firstWeekContainsDate),t.setHours(0,0,0,0),(0,H.k)(t,n)}let i="era"in e&&1!==e.era?1-r.year:r.year;return t.setFullYear(i,0,n.firstWeekContainsDate),t.setHours(0,0,0,0),(0,H.k)(t,n)}constructor(...t){super(...t),this.priority=130,this.incompatibleTokens=["y","R","u","Q","q","M","L","I","d","D","i","t","T"]}}var O=r(5153);class S extends h{parse(t,e){return"R"===e?k(4,t):k(e.length,t)}set(t,e,r){let a=(0,n.w)(t,0);return a.setFullYear(r,0,4),a.setHours(0,0,0,0),(0,O.b)(a)}constructor(...t){super(...t),this.priority=130,this.incompatibleTokens=["G","y","Y","u","Q","q","M","L","w","d","D","e","c","t","T"]}}class Y extends h{parse(t,e){return"u"===e?k(4,t):k(e.length,t)}set(t,e,r){return t.setFullYear(r,0,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=130,this.incompatibleTokens=["G","y","Y","R","w","I","i","e","c","t","T"]}}class R extends h{parse(t,e,r){switch(e){case"Q":case"QQ":return b(e.length,t);case"Qo":return r.ordinalNumber(t,{unit:"quarter"});case"QQQ":return r.quarter(t,{width:"abbreviated",context:"formatting"})||r.quarter(t,{width:"narrow",context:"formatting"});case"QQQQQ":return r.quarter(t,{width:"narrow",context:"formatting"});default:return r.quarter(t,{width:"wide",context:"formatting"})||r.quarter(t,{width:"abbreviated",context:"formatting"})||r.quarter(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=1&&e<=4}set(t,e,r){return t.setMonth((r-1)*3,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=120,this.incompatibleTokens=["Y","R","q","M","L","w","I","d","D","i","e","c","t","T"]}}class C extends h{parse(t,e,r){switch(e){case"q":case"qq":return b(e.length,t);case"qo":return r.ordinalNumber(t,{unit:"quarter"});case"qqq":return r.quarter(t,{width:"abbreviated",context:"standalone"})||r.quarter(t,{width:"narrow",context:"standalone"});case"qqqqq":return r.quarter(t,{width:"narrow",context:"standalone"});default:return r.quarter(t,{width:"wide",context:"standalone"})||r.quarter(t,{width:"abbreviated",context:"standalone"})||r.quarter(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=1&&e<=4}set(t,e,r){return t.setMonth((r-1)*3,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=120,this.incompatibleTokens=["Y","R","Q","M","L","w","I","d","D","i","e","c","t","T"]}}class E extends h{parse(t,e,r){let n=t=>t-1;switch(e){case"M":return g(v(f.month,t),n);case"MM":return g(b(2,t),n);case"Mo":return g(r.ordinalNumber(t,{unit:"month"}),n);case"MMM":return r.month(t,{width:"abbreviated",context:"formatting"})||r.month(t,{width:"narrow",context:"formatting"});case"MMMMM":return r.month(t,{width:"narrow",context:"formatting"});default:return r.month(t,{width:"wide",context:"formatting"})||r.month(t,{width:"abbreviated",context:"formatting"})||r.month(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=11}set(t,e,r){return t.setMonth(r,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.incompatibleTokens=["Y","R","q","Q","L","w","I","D","i","e","c","t","T"],this.priority=110}}class I extends h{parse(t,e,r){let n=t=>t-1;switch(e){case"L":return g(v(f.month,t),n);case"LL":return g(b(2,t),n);case"Lo":return g(r.ordinalNumber(t,{unit:"month"}),n);case"LLL":return r.month(t,{width:"abbreviated",context:"standalone"})||r.month(t,{width:"narrow",context:"standalone"});case"LLLLL":return r.month(t,{width:"narrow",context:"standalone"});default:return r.month(t,{width:"wide",context:"standalone"})||r.month(t,{width:"abbreviated",context:"standalone"})||r.month(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=0&&e<=11}set(t,e,r){return t.setMonth(r,1),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=110,this.incompatibleTokens=["Y","R","q","Q","M","w","I","D","i","e","c","t","T"]}}var L=r(2498);class Q extends h{parse(t,e,r){switch(e){case"w":return v(f.week,t);case"wo":return r.ordinalNumber(t,{unit:"week"});default:return b(e.length,t)}}validate(t,e){return e>=1&&e<=53}set(t,e,r,n){return(0,H.k)(function(t,e,r){let n=(0,o.a)(t),a=(0,L.N)(n,r)-e;return n.setDate(n.getDate()-7*a),n}(t,r,n),n)}constructor(...t){super(...t),this.priority=100,this.incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","i","t","T"]}}var A=r(9470);class F extends h{parse(t,e,r){switch(e){case"I":return v(f.week,t);case"Io":return r.ordinalNumber(t,{unit:"week"});default:return b(e.length,t)}}validate(t,e){return e>=1&&e<=53}set(t,e,r){return(0,O.b)(function(t,e){let r=(0,o.a)(t),n=(0,A.s)(r)-e;return r.setDate(r.getDate()-7*n),r}(t,r))}constructor(...t){super(...t),this.priority=100,this.incompatibleTokens=["y","Y","u","q","Q","M","L","w","d","D","e","c","t","T"]}}let j=[31,28,31,30,31,30,31,31,30,31,30,31],G=[31,29,31,30,31,30,31,31,30,31,30,31];class B extends h{parse(t,e,r){switch(e){case"d":return v(f.date,t);case"do":return r.ordinalNumber(t,{unit:"date"});default:return b(e.length,t)}}validate(t,e){let r=M(t.getFullYear()),n=t.getMonth();return r?e>=1&&e<=G[n]:e>=1&&e<=j[n]}set(t,e,r){return t.setDate(r),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.subPriority=1,this.incompatibleTokens=["Y","R","q","Q","w","I","D","i","e","c","t","T"]}}class X extends h{parse(t,e,r){switch(e){case"D":case"DD":return v(f.dayOfYear,t);case"Do":return r.ordinalNumber(t,{unit:"date"});default:return b(e.length,t)}}validate(t,e){return M(t.getFullYear())?e>=1&&e<=366:e>=1&&e<=365}set(t,e,r){return t.setMonth(0,r),t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.subpriority=1,this.incompatibleTokens=["Y","R","q","Q","M","L","w","I","d","E","i","e","c","t","T"]}}var _=r(31);function Z(t,e,r){var n,i,s,u,d,c,l,h;let w=(0,a.q)(),p=null!==(h=null!==(l=null!==(c=null!==(d=null==r?void 0:r.weekStartsOn)&&void 0!==d?d:null==r?void 0:null===(i=r.locale)||void 0===i?void 0:null===(n=i.options)||void 0===n?void 0:n.weekStartsOn)&&void 0!==c?c:w.weekStartsOn)&&void 0!==l?l:null===(u=w.locale)||void 0===u?void 0:null===(s=u.options)||void 0===s?void 0:s.weekStartsOn)&&void 0!==h?h:0,f=(0,o.a)(t),m=f.getDay(),g=7-p,v=e<0||e>6?e-(m+g)%7:((e%7+7)%7+g)%7-(m+g)%7;return(0,_.f)(f,v)}class K extends h{parse(t,e,r){switch(e){case"E":case"EE":case"EEE":return r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"});case"EEEEE":return r.day(t,{width:"narrow",context:"formatting"});case"EEEEEE":return r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"});default:return r.day(t,{width:"wide",context:"formatting"})||r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=6}set(t,e,r,n){return(t=Z(t,r,n)).setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.incompatibleTokens=["D","i","e","c","t","T"]}}class V extends h{parse(t,e,r,n){let a=t=>{let e=7*Math.floor((t-1)/7);return(t+n.weekStartsOn+6)%7+e};switch(e){case"e":case"ee":return g(b(e.length,t),a);case"eo":return g(r.ordinalNumber(t,{unit:"day"}),a);case"eee":return r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"});case"eeeee":return r.day(t,{width:"narrow",context:"formatting"});case"eeeeee":return r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"});default:return r.day(t,{width:"wide",context:"formatting"})||r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=6}set(t,e,r,n){return(t=Z(t,r,n)).setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","E","i","c","t","T"]}}class W extends h{parse(t,e,r,n){let a=t=>{let e=7*Math.floor((t-1)/7);return(t+n.weekStartsOn+6)%7+e};switch(e){case"c":case"cc":return g(b(e.length,t),a);case"co":return g(r.ordinalNumber(t,{unit:"day"}),a);case"ccc":return r.day(t,{width:"abbreviated",context:"standalone"})||r.day(t,{width:"short",context:"standalone"})||r.day(t,{width:"narrow",context:"standalone"});case"ccccc":return r.day(t,{width:"narrow",context:"standalone"});case"cccccc":return r.day(t,{width:"short",context:"standalone"})||r.day(t,{width:"narrow",context:"standalone"});default:return r.day(t,{width:"wide",context:"standalone"})||r.day(t,{width:"abbreviated",context:"standalone"})||r.day(t,{width:"short",context:"standalone"})||r.day(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=0&&e<=6}set(t,e,r,n){return(t=Z(t,r,n)).setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","E","i","e","t","T"]}}class z extends h{parse(t,e,r){let n=t=>0===t?7:t;switch(e){case"i":case"ii":return b(e.length,t);case"io":return r.ordinalNumber(t,{unit:"day"});case"iii":return g(r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"}),n);case"iiiii":return g(r.day(t,{width:"narrow",context:"formatting"}),n);case"iiiiii":return g(r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"}),n);default:return g(r.day(t,{width:"wide",context:"formatting"})||r.day(t,{width:"abbreviated",context:"formatting"})||r.day(t,{width:"short",context:"formatting"})||r.day(t,{width:"narrow",context:"formatting"}),n)}}validate(t,e){return e>=1&&e<=7}set(t,e,r){return(t=function(t,e){let r;let n=(0,o.a)(t),a=(0===(r=(0,o.a)(n).getDay())&&(r=7),r);return(0,_.f)(n,e-a)}(t,r)).setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=90,this.incompatibleTokens=["y","Y","u","q","Q","M","L","w","d","D","E","e","c","t","T"]}}class U extends h{parse(t,e,r){switch(e){case"a":case"aa":case"aaa":return r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"});case"aaaaa":return r.dayPeriod(t,{width:"narrow",context:"formatting"});default:return r.dayPeriod(t,{width:"wide",context:"formatting"})||r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,r){return t.setHours(T(r),0,0,0),t}constructor(...t){super(...t),this.priority=80,this.incompatibleTokens=["b","B","H","k","t","T"]}}class $ extends h{parse(t,e,r){switch(e){case"b":case"bb":case"bbb":return r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"});case"bbbbb":return r.dayPeriod(t,{width:"narrow",context:"formatting"});default:return r.dayPeriod(t,{width:"wide",context:"formatting"})||r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,r){return t.setHours(T(r),0,0,0),t}constructor(...t){super(...t),this.priority=80,this.incompatibleTokens=["a","B","H","k","t","T"]}}class J extends h{parse(t,e,r){switch(e){case"B":case"BB":case"BBB":return r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"});case"BBBBB":return r.dayPeriod(t,{width:"narrow",context:"formatting"});default:return r.dayPeriod(t,{width:"wide",context:"formatting"})||r.dayPeriod(t,{width:"abbreviated",context:"formatting"})||r.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,r){return t.setHours(T(r),0,0,0),t}constructor(...t){super(...t),this.priority=80,this.incompatibleTokens=["a","b","t","T"]}}class tt extends h{parse(t,e,r){switch(e){case"h":return v(f.hour12h,t);case"ho":return r.ordinalNumber(t,{unit:"hour"});default:return b(e.length,t)}}validate(t,e){return e>=1&&e<=12}set(t,e,r){let n=t.getHours()>=12;return n&&r<12?t.setHours(r+12,0,0,0):n||12!==r?t.setHours(r,0,0,0):t.setHours(0,0,0,0),t}constructor(...t){super(...t),this.priority=70,this.incompatibleTokens=["H","K","k","t","T"]}}class te extends h{parse(t,e,r){switch(e){case"H":return v(f.hour23h,t);case"Ho":return r.ordinalNumber(t,{unit:"hour"});default:return b(e.length,t)}}validate(t,e){return e>=0&&e<=23}set(t,e,r){return t.setHours(r,0,0,0),t}constructor(...t){super(...t),this.priority=70,this.incompatibleTokens=["a","b","h","K","k","t","T"]}}class tr extends h{parse(t,e,r){switch(e){case"K":return v(f.hour11h,t);case"Ko":return r.ordinalNumber(t,{unit:"hour"});default:return b(e.length,t)}}validate(t,e){return e>=0&&e<=11}set(t,e,r){return t.getHours()>=12&&r<12?t.setHours(r+12,0,0,0):t.setHours(r,0,0,0),t}constructor(...t){super(...t),this.priority=70,this.incompatibleTokens=["h","H","k","t","T"]}}class tn extends h{parse(t,e,r){switch(e){case"k":return v(f.hour24h,t);case"ko":return r.ordinalNumber(t,{unit:"hour"});default:return b(e.length,t)}}validate(t,e){return e>=1&&e<=24}set(t,e,r){return t.setHours(r<=24?r%24:r,0,0,0),t}constructor(...t){super(...t),this.priority=70,this.incompatibleTokens=["a","b","h","H","K","t","T"]}}class ta extends h{parse(t,e,r){switch(e){case"m":return v(f.minute,t);case"mo":return r.ordinalNumber(t,{unit:"minute"});default:return b(e.length,t)}}validate(t,e){return e>=0&&e<=59}set(t,e,r){return t.setMinutes(r,0,0),t}constructor(...t){super(...t),this.priority=60,this.incompatibleTokens=["t","T"]}}class ti extends h{parse(t,e,r){switch(e){case"s":return v(f.second,t);case"so":return r.ordinalNumber(t,{unit:"second"});default:return b(e.length,t)}}validate(t,e){return e>=0&&e<=59}set(t,e,r){return t.setSeconds(r,0),t}constructor(...t){super(...t),this.priority=50,this.incompatibleTokens=["t","T"]}}class to extends h{parse(t,e){return g(b(e.length,t),t=>Math.trunc(t*Math.pow(10,-e.length+3)))}set(t,e,r){return t.setMilliseconds(r),t}constructor(...t){super(...t),this.priority=30,this.incompatibleTokens=["t","T"]}}var ts=r(3425);class tu extends h{parse(t,e){switch(e){case"X":return x(m.basicOptionalMinutes,t);case"XX":return x(m.basic,t);case"XXXX":return x(m.basicOptionalSeconds,t);case"XXXXX":return x(m.extendedOptionalSeconds,t);default:return x(m.extended,t)}}set(t,e,r){return e.timestampIsSet?t:(0,n.w)(t,t.getTime()-(0,ts.G)(t)-r)}constructor(...t){super(...t),this.priority=10,this.incompatibleTokens=["t","T","x"]}}class td extends h{parse(t,e){switch(e){case"x":return x(m.basicOptionalMinutes,t);case"xx":return x(m.basic,t);case"xxxx":return x(m.basicOptionalSeconds,t);case"xxxxx":return x(m.extendedOptionalSeconds,t);default:return x(m.extended,t)}}set(t,e,r){return e.timestampIsSet?t:(0,n.w)(t,t.getTime()-(0,ts.G)(t)-r)}constructor(...t){super(...t),this.priority=10,this.incompatibleTokens=["t","T","X"]}}class tc extends h{parse(t){return y(t)}set(t,e,r){return[(0,n.w)(t,1e3*r),{timestampIsSet:!0}]}constructor(...t){super(...t),this.priority=40,this.incompatibleTokens="*"}}class tl extends h{parse(t){return y(t)}set(t,e,r){return[(0,n.w)(t,r),{timestampIsSet:!0}]}constructor(...t){super(...t),this.priority=20,this.incompatibleTokens="*"}}let th={G:new w,y:new P,Y:new N,R:new S,u:new Y,Q:new R,q:new C,M:new E,L:new I,w:new Q,I:new F,d:new B,D:new X,E:new K,e:new V,c:new W,i:new z,a:new U,b:new $,B:new J,h:new tt,H:new te,K:new tr,k:new tn,m:new ta,s:new ti,S:new to,X:new tu,x:new td,t:new tc,T:new tl},tw=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,tp=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,tf=/^'([^]*?)'?$/,tm=/''/g,tg=/\S/,tv=/[a-zA-Z]/;function tx(t,e,r,d){var c,h,w,p,f,m,g,v,x,y,b,k,T,D,M,P,q,H;let N=Object.assign({},(0,a.q)()),O=null!==(y=null!==(x=null==d?void 0:d.locale)&&void 0!==x?x:N.locale)&&void 0!==y?y:i.c,S=null!==(D=null!==(T=null!==(k=null!==(b=null==d?void 0:d.firstWeekContainsDate)&&void 0!==b?b:null==d?void 0:null===(h=d.locale)||void 0===h?void 0:null===(c=h.options)||void 0===c?void 0:c.firstWeekContainsDate)&&void 0!==k?k:N.firstWeekContainsDate)&&void 0!==T?T:null===(p=N.locale)||void 0===p?void 0:null===(w=p.options)||void 0===w?void 0:w.firstWeekContainsDate)&&void 0!==D?D:1,Y=null!==(H=null!==(q=null!==(P=null!==(M=null==d?void 0:d.weekStartsOn)&&void 0!==M?M:null==d?void 0:null===(m=d.locale)||void 0===m?void 0:null===(f=m.options)||void 0===f?void 0:f.weekStartsOn)&&void 0!==P?P:N.weekStartsOn)&&void 0!==q?q:null===(v=N.locale)||void 0===v?void 0:null===(g=v.options)||void 0===g?void 0:g.weekStartsOn)&&void 0!==H?H:0;if(""===e)return""===t?(0,o.a)(r):(0,n.w)(r,NaN);let R={firstWeekContainsDate:S,weekStartsOn:Y,locale:O},C=[new l],E=e.match(tp).map(t=>{let e=t[0];return e in s.m?(0,s.m[e])(t,O.formatLong):t}).join("").match(tw),I=[];for(let a of E){!(null==d?void 0:d.useAdditionalWeekYearTokens)&&(0,u.xM)(a)&&(0,u.Ss)(a,e,t),!(null==d?void 0:d.useAdditionalDayOfYearTokens)&&(0,u.ef)(a)&&(0,u.Ss)(a,e,t);let i=a[0],o=th[i];if(o){let{incompatibleTokens:e}=o;if(Array.isArray(e)){let t=I.find(t=>e.includes(t.token)||t.token===i);if(t)throw RangeError("The format string mustn't contain `".concat(t.fullToken,"` and `").concat(a,"` at the same time"))}else if("*"===o.incompatibleTokens&&I.length>0)throw RangeError("The format string mustn't contain `".concat(a,"` and any other token at the same time"));I.push({token:i,fullToken:a});let s=o.run(t,a,O.match,R);if(!s)return(0,n.w)(r,NaN);C.push(s.setter),t=s.rest}else{if(i.match(tv))throw RangeError("Format string contains an unescaped latin alphabet character `"+i+"`");if("''"===a?a="'":"'"===i&&(a=a.match(tf)[1].replace(tm,"'")),0!==t.indexOf(a))return(0,n.w)(r,NaN);t=t.slice(a.length)}}if(t.length>0&&tg.test(t))return(0,n.w)(r,NaN);let L=C.map(t=>t.priority).sort((t,e)=>e-t).filter((t,e,r)=>r.indexOf(t)===e).map(t=>C.filter(e=>e.priority===t).sort((t,e)=>e.subPriority-t.subPriority)).map(t=>t[0]),Q=(0,o.a)(r);if(isNaN(Q.getTime()))return(0,n.w)(r,NaN);let A={};for(let t of L){if(!t.validate(Q,R))return(0,n.w)(r,NaN);let e=t.set(Q,A,R);Array.isArray(e)?(Q=e[0],Object.assign(A,e[1])):Q=e}return(0,n.w)(r,Q)}}}]);