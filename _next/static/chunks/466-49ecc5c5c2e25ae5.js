"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[466],{870:(e,t,n)=>{n.d(t,{n:()=>s});var r=n(4232),o=n(714),a=n(6326),c=n(2146),i=n(7876),u="focusScope.autoFocusOnMount",l="focusScope.autoFocusOnUnmount",d={bubbles:!1,cancelable:!0},s=r.forwardRef((e,t)=>{let{loop:n=!1,trapped:s=!1,onMountAutoFocus:m,onUnmountAutoFocus:g,...y}=e,[b,E]=r.useState(null),w=(0,c.c)(m),S=(0,c.c)(g),k=r.useRef(null),C=(0,o.s)(t,e=>E(e)),A=r.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;r.useEffect(()=>{if(s){let e=function(e){if(A.paused||!b)return;let t=e.target;b.contains(t)?k.current=t:p(k.current,{select:!0})},t=function(e){if(A.paused||!b)return;let t=e.relatedTarget;null===t||b.contains(t)||p(k.current,{select:!0})};document.addEventListener("focusin",e),document.addEventListener("focusout",t);let n=new MutationObserver(function(e){if(document.activeElement===document.body)for(let t of e)t.removedNodes.length>0&&p(b)});return b&&n.observe(b,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",e),document.removeEventListener("focusout",t),n.disconnect()}}},[s,b,A.paused]),r.useEffect(()=>{if(b){h.add(A);let e=document.activeElement;if(!b.contains(e)){let t=new CustomEvent(u,d);b.addEventListener(u,w),b.dispatchEvent(t),t.defaultPrevented||(function(e,{select:t=!1}={}){let n=document.activeElement;for(let r of e)if(p(r,{select:t}),document.activeElement!==n)return}(f(b).filter(e=>"A"!==e.tagName),{select:!0}),document.activeElement===e&&p(b))}return()=>{b.removeEventListener(u,w),setTimeout(()=>{let t=new CustomEvent(l,d);b.addEventListener(l,S),b.dispatchEvent(t),t.defaultPrevented||p(e??document.body,{select:!0}),b.removeEventListener(l,S),h.remove(A)},0)}}},[b,w,S,A]);let M=r.useCallback(e=>{if(!n&&!s||A.paused)return;let t="Tab"===e.key&&!e.altKey&&!e.ctrlKey&&!e.metaKey,r=document.activeElement;if(t&&r){let t=e.currentTarget,[o,a]=function(e){let t=f(e);return[v(t,e),v(t.reverse(),e)]}(t);o&&a?e.shiftKey||r!==a?e.shiftKey&&r===o&&(e.preventDefault(),n&&p(a,{select:!0})):(e.preventDefault(),n&&p(o,{select:!0})):r===t&&e.preventDefault()}},[n,s,A.paused]);return(0,i.jsx)(a.sG.div,{tabIndex:-1,...y,ref:C,onKeyDown:M})});function f(e){let t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>{let t="INPUT"===e.tagName&&"hidden"===e.type;return e.disabled||e.hidden||t?NodeFilter.FILTER_SKIP:e.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function v(e,t){for(let n of e)if(!function(e,{upTo:t}){if("hidden"===getComputedStyle(e).visibility)return!0;for(;e&&(void 0===t||e!==t);){if("none"===getComputedStyle(e).display)return!0;e=e.parentElement}return!1}(n,{upTo:t}))return n}function p(e,{select:t=!1}={}){if(e&&e.focus){var n;let r=document.activeElement;e.focus({preventScroll:!0}),e!==r&&(n=e)instanceof HTMLInputElement&&"select"in n&&t&&e.select()}}s.displayName="FocusScope";var h=function(){let e=[];return{add(t){let n=e[0];t!==n&&n?.pause(),(e=m(e,t)).unshift(t)},remove(t){e=m(e,t),e[0]?.resume()}}}();function m(e,t){let n=[...e],r=n.indexOf(t);return -1!==r&&n.splice(r,1),n}},2634:(e,t,n)=>{n.d(t,{A:()=>H});var r,o=function(){return(o=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function a(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&0>t.indexOf(r)&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)0>t.indexOf(r[o])&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n}Object.create;Object.create;var c=("function"==typeof SuppressedError&&SuppressedError,n(4232)),i="right-scroll-bar-position",u="width-before-scroll-bar";function l(e,t){return"function"==typeof e?e(t):e&&(e.current=t),e}var d="undefined"!=typeof window?c.useLayoutEffect:c.useEffect,s=new WeakMap;function f(e){return e}var v=function(e){void 0===e&&(e={});var t,n,r,a,c=(t=null,void 0===n&&(n=f),r=[],a=!1,{read:function(){if(a)throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return r.length?r[r.length-1]:null},useMedium:function(e){var t=n(e,a);return r.push(t),function(){r=r.filter(function(e){return e!==t})}},assignSyncMedium:function(e){for(a=!0;r.length;){var t=r;r=[],t.forEach(e)}r={push:function(t){return e(t)},filter:function(){return r}}},assignMedium:function(e){a=!0;var t=[];if(r.length){var n=r;r=[],n.forEach(e),t=r}var o=function(){var n=t;t=[],n.forEach(e)},c=function(){return Promise.resolve().then(o)};c(),r={push:function(e){t.push(e),c()},filter:function(e){return t=t.filter(e),r}}}});return c.options=o({async:!0,ssr:!1},e),c}(),p=function(){},h=c.forwardRef(function(e,t){var n,r,i,u,f=c.useRef(null),h=c.useState({onScrollCapture:p,onWheelCapture:p,onTouchMoveCapture:p}),m=h[0],g=h[1],y=e.forwardProps,b=e.children,E=e.className,w=e.removeScrollBar,S=e.enabled,k=e.shards,C=e.sideCar,A=e.noIsolation,M=e.inert,N=e.allowPinchZoom,L=e.as,x=e.gapMode,R=a(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),T=(n=[f,t],r=function(e){return n.forEach(function(t){return l(t,e)})},(i=(0,c.useState)(function(){return{value:null,callback:r,facade:{get current(){return i.value},set current(value){var e=i.value;e!==value&&(i.value=value,i.callback(value,e))}}}})[0]).callback=r,u=i.facade,d(function(){var e=s.get(u);if(e){var t=new Set(e),r=new Set(n),o=u.current;t.forEach(function(e){r.has(e)||l(e,null)}),r.forEach(function(e){t.has(e)||l(e,o)})}s.set(u,n)},[n]),u),O=o(o({},R),m);return c.createElement(c.Fragment,null,S&&c.createElement(C,{sideCar:v,removeScrollBar:w,shards:k,noIsolation:A,inert:M,setCallbacks:g,allowPinchZoom:!!N,lockRef:f,gapMode:x}),y?c.cloneElement(c.Children.only(b),o(o({},O),{ref:T})):c.createElement(void 0===L?"div":L,o({},O,{className:E,ref:T}),b))});h.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1},h.classNames={fullWidth:u,zeroRight:i};var m=function(e){var t=e.sideCar,n=a(e,["sideCar"]);if(!t)throw Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw Error("Sidecar medium not found");return c.createElement(r,o({},n))};m.isSideCarExport=!0;var g=function(){var e=0,t=null;return{add:function(o){if(0==e&&(t=function(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=r||n.nc;return t&&e.setAttribute("nonce",t),e}())){var a,c;(a=t).styleSheet?a.styleSheet.cssText=o:a.appendChild(document.createTextNode(o)),c=t,(document.head||document.getElementsByTagName("head")[0]).appendChild(c)}e++},remove:function(){--e||!t||(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},y=function(){var e=g();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},b=function(){var e=y();return function(t){return e(t.styles,t.dynamic),null}},E={left:0,top:0,right:0,gap:0},w=function(e){return parseInt(e||"",10)||0},S=function(e){var t=window.getComputedStyle(document.body),n=t["padding"===e?"paddingLeft":"marginLeft"],r=t["padding"===e?"paddingTop":"marginTop"],o=t["padding"===e?"paddingRight":"marginRight"];return[w(n),w(r),w(o)]},k=function(e){if(void 0===e&&(e="margin"),"undefined"==typeof window)return E;var t=S(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},C=b(),A="data-scroll-locked",M=function(e,t,n,r){var o=e.left,a=e.top,c=e.right,l=e.gap;return void 0===n&&(n="margin"),"\n  .".concat("with-scroll-bars-hidden"," {\n   overflow: hidden ").concat(r,";\n   padding-right: ").concat(l,"px ").concat(r,";\n  }\n  body[").concat(A,"] {\n    overflow: hidden ").concat(r,";\n    overscroll-behavior: contain;\n    ").concat([t&&"position: relative ".concat(r,";"),"margin"===n&&"\n    padding-left: ".concat(o,"px;\n    padding-top: ").concat(a,"px;\n    padding-right: ").concat(c,"px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(l,"px ").concat(r,";\n    "),"padding"===n&&"padding-right: ".concat(l,"px ").concat(r,";")].filter(Boolean).join(""),"\n  }\n  \n  .").concat(i," {\n    right: ").concat(l,"px ").concat(r,";\n  }\n  \n  .").concat(u," {\n    margin-right: ").concat(l,"px ").concat(r,";\n  }\n  \n  .").concat(i," .").concat(i," {\n    right: 0 ").concat(r,";\n  }\n  \n  .").concat(u," .").concat(u," {\n    margin-right: 0 ").concat(r,";\n  }\n  \n  body[").concat(A,"] {\n    ").concat("--removed-body-scroll-bar-size",": ").concat(l,"px;\n  }\n")},N=function(){var e=parseInt(document.body.getAttribute(A)||"0",10);return isFinite(e)?e:0},L=function(){c.useEffect(function(){return document.body.setAttribute(A,(N()+1).toString()),function(){var e=N()-1;e<=0?document.body.removeAttribute(A):document.body.setAttribute(A,e.toString())}},[])},x=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,o=void 0===r?"margin":r;L();var a=c.useMemo(function(){return k(o)},[o]);return c.createElement(C,{styles:M(a,!t,o,n?"":"!important")})},R=!1;if("undefined"!=typeof window)try{var T=Object.defineProperty({},"passive",{get:function(){return R=!0,!0}});window.addEventListener("test",T,T),window.removeEventListener("test",T,T)}catch(e){R=!1}var O=!!R&&{passive:!1},P=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return"hidden"!==n[t]&&(n.overflowY!==n.overflowX||"TEXTAREA"===e.tagName||"visible"!==n[t])},I=function(e,t){var n=t.ownerDocument,r=t;do{if("undefined"!=typeof ShadowRoot&&r instanceof ShadowRoot&&(r=r.host),W(e,r)){var o=F(e,r);if(o[1]>o[2])return!0}r=r.parentNode}while(r&&r!==n.body);return!1},W=function(e,t){return"v"===e?P(t,"overflowY"):P(t,"overflowX")},F=function(e,t){return"v"===e?[t.scrollTop,t.scrollHeight,t.clientHeight]:[t.scrollLeft,t.scrollWidth,t.clientWidth]},j=function(e,t,n,r,o){var a,c=(a=window.getComputedStyle(t).direction,"h"===e&&"rtl"===a?-1:1),i=c*r,u=n.target,l=t.contains(u),d=!1,s=i>0,f=0,v=0;do{var p=F(e,u),h=p[0],m=p[1]-p[2]-c*h;(h||m)&&W(e,u)&&(f+=m,v+=h),u=u instanceof ShadowRoot?u.host:u.parentNode}while(!l&&u!==document.body||l&&(t.contains(u)||t===u));return s&&(o&&1>Math.abs(f)||!o&&i>f)?d=!0:!s&&(o&&1>Math.abs(v)||!o&&-i>v)&&(d=!0),d},B=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},D=function(e){return[e.deltaX,e.deltaY]},K=function(e){return e&&"current"in e?e.current:e},_=0,X=[];let Y=(v.useMedium(function(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),o=c.useState(_++)[0],a=c.useState(b)[0],i=c.useRef(e);c.useEffect(function(){i.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var t=(function(e,t,n){if(n||2==arguments.length)for(var r,o=0,a=t.length;o<a;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))})([e.lockRef.current],(e.shards||[]).map(K),!0).filter(Boolean);return t.forEach(function(e){return e.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),t.forEach(function(e){return e.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var u=c.useCallback(function(e,t){if("touches"in e&&2===e.touches.length||"wheel"===e.type&&e.ctrlKey)return!i.current.allowPinchZoom;var o,a=B(e),c=n.current,u="deltaX"in e?e.deltaX:c[0]-a[0],l="deltaY"in e?e.deltaY:c[1]-a[1],d=e.target,s=Math.abs(u)>Math.abs(l)?"h":"v";if("touches"in e&&"h"===s&&"range"===d.type)return!1;var f=I(s,d);if(!f)return!0;if(f?o=s:(o="v"===s?"h":"v",f=I(s,d)),!f)return!1;if(!r.current&&"changedTouches"in e&&(u||l)&&(r.current=o),!o)return!0;var v=r.current||o;return j(v,t,e,"h"===v?u:l,!0)},[]),l=c.useCallback(function(e){if(X.length&&X[X.length-1]===a){var n="deltaY"in e?D(e):B(e),r=t.current.filter(function(t){var r;return t.name===e.type&&(t.target===e.target||e.target===t.shadowParent)&&(r=t.delta)[0]===n[0]&&r[1]===n[1]})[0];if(r&&r.should){e.cancelable&&e.preventDefault();return}if(!r){var o=(i.current.shards||[]).map(K).filter(Boolean).filter(function(t){return t.contains(e.target)});(o.length>0?u(e,o[0]):!i.current.noIsolation)&&e.cancelable&&e.preventDefault()}}},[]),d=c.useCallback(function(e,n,r,o){var a={name:e,delta:n,target:r,should:o,shadowParent:function(e){for(var t=null;null!==e;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}(r)};t.current.push(a),setTimeout(function(){t.current=t.current.filter(function(e){return e!==a})},1)},[]),s=c.useCallback(function(e){n.current=B(e),r.current=void 0},[]),f=c.useCallback(function(t){d(t.type,D(t),t.target,u(t,e.lockRef.current))},[]),v=c.useCallback(function(t){d(t.type,B(t),t.target,u(t,e.lockRef.current))},[]);c.useEffect(function(){return X.push(a),e.setCallbacks({onScrollCapture:f,onWheelCapture:f,onTouchMoveCapture:v}),document.addEventListener("wheel",l,O),document.addEventListener("touchmove",l,O),document.addEventListener("touchstart",s,O),function(){X=X.filter(function(e){return e!==a}),document.removeEventListener("wheel",l,O),document.removeEventListener("touchmove",l,O),document.removeEventListener("touchstart",s,O)}},[]);var p=e.removeScrollBar,h=e.inert;return c.createElement(c.Fragment,null,h?c.createElement(a,{styles:"\n  .block-interactivity-".concat(o," {pointer-events: none;}\n  .allow-interactivity-").concat(o," {pointer-events: all;}\n")}):null,p?c.createElement(x,{gapMode:e.gapMode}):null)}),m);var q=c.forwardRef(function(e,t){return c.createElement(h,o({},e,{ref:t,sideCar:Y}))});q.classNames=h.classNames;let H=q},2658:(e,t,n)=>{n.d(t,{Oh:()=>a});var r=n(4232),o=0;function a(){r.useEffect(()=>{let e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??c()),document.body.insertAdjacentElement("beforeend",e[1]??c()),o++,()=>{1===o&&document.querySelectorAll("[data-radix-focus-guard]").forEach(e=>e.remove()),o--}},[])}function c(){let e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}},3654:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(1713).A)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]])},4769:(e,t,n)=>{n.d(t,{Eq:()=>d});var r=function(e){return"undefined"==typeof document?null:(Array.isArray(e)?e[0]:e).ownerDocument.body},o=new WeakMap,a=new WeakMap,c={},i=0,u=function(e){return e&&(e.host||u(e.parentNode))},l=function(e,t,n,r){var l=(Array.isArray(e)?e:[e]).map(function(e){if(t.contains(e))return e;var n=u(e);return n&&t.contains(n)?n:(console.error("aria-hidden",e,"in not contained inside",t,". Doing nothing"),null)}).filter(function(e){return!!e});c[n]||(c[n]=new WeakMap);var d=c[n],s=[],f=new Set,v=new Set(l),p=function(e){!(!e||f.has(e))&&(f.add(e),p(e.parentNode))};l.forEach(p);var h=function(e){!(!e||v.has(e))&&Array.prototype.forEach.call(e.children,function(e){if(f.has(e))h(e);else try{var t=e.getAttribute(r),c=null!==t&&"false"!==t,i=(o.get(e)||0)+1,u=(d.get(e)||0)+1;o.set(e,i),d.set(e,u),s.push(e),1===i&&c&&a.set(e,!0),1===u&&e.setAttribute(n,"true"),c||e.setAttribute(r,"true")}catch(t){console.error("aria-hidden: cannot operate on ",e,t)}})};return h(t),f.clear(),i++,function(){s.forEach(function(e){var t=o.get(e)-1,c=d.get(e)-1;o.set(e,t),d.set(e,c),t||(a.has(e)||e.removeAttribute(r),a.delete(e)),c||e.removeAttribute(n)}),--i||(o=new WeakMap,o=new WeakMap,a=new WeakMap,c={})}},d=function(e,t,n){void 0===n&&(n="data-aria-hidden");var o=Array.from(Array.isArray(e)?e:[e]),a=t||r(e);return a?(o.push.apply(o,Array.from(a.querySelectorAll("[aria-live]"))),l(o,a,n,"aria-hidden")):function(){return null}}},6108:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(1713).A)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])}}]);