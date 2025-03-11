(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[332],{727:(e,t,a)=>{"use strict";a.d(t,{BT:()=>c,Wu:()=>d,ZB:()=>o,Zp:()=>l,aR:()=>n});var s=a(7876),r=a(4232),i=a(4317);let l=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...r})});l.displayName="Card";let n=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",a),...r})});n.displayName="CardHeader";let o=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("h3",{ref:t,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",a),...r})});o.displayName="CardTitle";let c=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("p",{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...r})});c.displayName="CardDescription";let d=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("p-6 pt-0",a),...r})});d.displayName="CardContent",r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("flex items-center p-6 pt-0",a),...r})}).displayName="CardFooter"},2436:(e,t,a)=>{"use strict";a.d(t,{a:()=>i});var s=a(7876);a(4232);var r=a(4317);let i=e=>{let{size:t="md",text:a,className:i,variant:l="spinner",isLoading:n,children:o}=e,c={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,s.jsx)(s.Fragment,{children:n?(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(l){case"spinner":return(0,s.jsx)("div",{className:(0,r.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",c[t],i)});case"pulse":return(0,s.jsxs)("div",{className:(0,r.cn)("relative flex items-center justify-center",c[t],i),children:[(0,s.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,s.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,s.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,s.jsx)("div",{className:(0,r.cn)("flex space-x-2",i),children:[0,1,2].map(e=>(0,s.jsx)("div",{className:(0,r.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),a&&(0,s.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:a})]}),(0,s.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):o})}},2817:(e,t,a)=>{"use strict";a.d(t,{A:()=>i});var s=a(7876),r=a(4522);let i=e=>{let{title:t,subtitle:a,children:i}=e;return(0,s.jsxs)("div",{className:"container mx-auto px-6",children:[(0,s.jsxs)(r.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,s.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,s.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:a})]}),(0,s.jsx)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:i})]})}},2832:(e,t,a)=>{"use strict";a.d(t,{G6:()=>n,JQ:()=>l,nz:()=>o,vr:()=>d,xx:()=>c});var s=a(1763),r=a(5495),i=a(4317);let l=async()=>{let{data:e,error:t}=await s.S.from("projects").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Projects");return JSON.parse(JSON.stringify(e))},n=async e=>{let{data:t,error:a}=await s.S.from("projects").select().eq("id",e);if(a&&console.log(a),!t)throw Error("Project with this id doesn't exist");return JSON.parse(JSON.stringify(t[0]))},o=async(e,t)=>{await (0,r.V6)("projects",t,e.image);let{data:a}=s.S.storage.from("media").getPublicUrl("projects/".concat(t)),{id:i,...l}=e,{error:n}=await s.S.from("projects").insert({...l,image:a.publicUrl});return n?(console.log(n),{error:n}):{error:null}},c=async e=>(console.log(e),await (0,r.vS)(["projects/".concat(e.image.split("/").pop())]),await s.S.from("projects").delete().eq("id",e.id)),d=async(e,t)=>{console.log(e);let a=await n(e.id);await (0,r.vS)(["projects/".concat(a.image.split("/").pop())]);let{id:l,...o}=e;await (0,r.V6)("projects",t,e.image);let{data:c}=s.S.storage.from("media").getPublicUrl("projects/".concat(t)),{error:d}=await s.S.from("projects").update({...o,image:c.publicUrl}).eq("id",e.id);if(d){let e=await (0,i.W6)(a.image);await (0,r.V6)("projects",a.image.split("/").pop(),e),console.log(d)}}},5495:(e,t,a)=>{"use strict";a.d(t,{V6:()=>n,ts:()=>l,vS:()=>o});var s=a(4317),r=a(1763);let i=async e=>{let{data:t,error:a}=await r.S.storage.from("media").list(e);return a?(console.log(a),[]):null==t?void 0:t.map(e=>e.name)},l=async e=>{let t=await i(e),a=[];for(let s=0;s<t.length;s++){let{data:i}=r.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[s]));a.push(i.publicUrl)}return a},n=async(e,t,a)=>{let i=t.split(".")[t.split(".").length-1],l="image/".concat(i),n=a.replace(/^data:image\/\w+;base64,/,""),o=(0,s.i)(n,l),c="".concat(e,"/").concat(t),{data:d,error:u}=await r.S.storage.from("media").upload(c,o,{contentType:l,upsert:!0});return u&&console.log(u),d},o=async e=>{let{data:t,error:a}=await r.S.storage.from("media").remove(e);if(a){console.log(a);return}return t}},6544:(e,t,a)=>{"use strict";a.r(t),a.d(t,{ProjectSection:()=>u,default:()=>m});var s=a(7876),r=a(4232),i=a(2832),l=a(2436),n=a(2898),o=a(7341),c=a(2817),d=a(7984);let u=e=>{let{projects:t}=e;return(0,s.jsx)("section",{className:"py-24",id:"projects",children:(0,s.jsx)(c.A,{title:"Our Projects",subtitle:"Discover our innovative robotics projects",children:(0,s.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:(0,s.jsx)(d.default,{projects:t})})})})},m=()=>{let[e,t]=(0,r.useState)(!0),[a,c]=(0,r.useState)([]);return(0,r.useEffect)(()=>{(async()=>{c(await (0,i.JQ)()),t(!1)})()},[]),(0,s.jsx)(l.a,{isLoading:e,children:(0,s.jsxs)(o.A,{children:[(0,s.jsx)(n.A,{title:"Robotics Society | Punjab Engineering",description:"Projects made by Robotics Society, Punjab Engineering College"}),(0,s.jsx)(u,{projects:a})]})})}},6760:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return a(7288)}])},7212:(e,t,a)=>{"use strict";a.d(t,{N:()=>g});var s=a(7876),r=a(4232),i=a(5048),l=a(1200),n=a(3866),o=a(9751);class c extends r.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=t.offsetParent,a=e instanceof HTMLElement&&e.offsetWidth||0,s=this.props.sizeRef.current;s.height=t.offsetHeight||0,s.width=t.offsetWidth||0,s.top=t.offsetTop,s.left=t.offsetLeft,s.right=a-s.width-s.left}return null}componentDidUpdate(){}render(){return this.props.children}}function d({children:e,isPresent:t,anchorX:a}){let i=(0,r.useId)(),l=(0,r.useRef)(null),n=(0,r.useRef)({width:0,height:0,top:0,left:0,right:0}),{nonce:d}=(0,r.useContext)(o.Q);return(0,r.useInsertionEffect)(()=>{let{width:e,height:s,top:r,left:o,right:c}=n.current;if(t||!l.current||!e||!s)return;let u="left"===a?`left: ${o}`:`right: ${c}`;l.current.dataset.motionPopId=i;let m=document.createElement("style");return d&&(m.nonce=d),document.head.appendChild(m),m.sheet&&m.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${s}px !important;
            ${u}px !important;
            top: ${r}px !important;
          }
        `),()=>{document.head.removeChild(m)}},[t]),(0,s.jsx)(c,{isPresent:t,childRef:l,sizeRef:n,children:r.cloneElement(e,{ref:l})})}let u=({children:e,initial:t,isPresent:a,onExitComplete:i,custom:o,presenceAffectsLayout:c,mode:u,anchorX:p})=>{let h=(0,l.M)(m),f=(0,r.useId)(),x=(0,r.useCallback)(e=>{for(let t of(h.set(e,!0),h.values()))if(!t)return;i&&i()},[h,i]),g=(0,r.useMemo)(()=>({id:f,initial:t,isPresent:a,custom:o,onExitComplete:x,register:e=>(h.set(e,!1),()=>h.delete(e))}),c?[Math.random(),x]:[a,x]);return(0,r.useMemo)(()=>{h.forEach((e,t)=>h.set(t,!1))},[a]),r.useEffect(()=>{a||h.size||!i||i()},[a]),"popLayout"===u&&(e=(0,s.jsx)(d,{isPresent:a,anchorX:p,children:e})),(0,s.jsx)(n.t.Provider,{value:g,children:e})};function m(){return new Map}var p=a(3885);let h=e=>e.key||"";function f(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}var x=a(181);let g=({children:e,custom:t,initial:a=!0,onExitComplete:n,presenceAffectsLayout:o=!0,mode:c="sync",propagate:d=!1,anchorX:m="left"})=>{let[g,j]=(0,p.xQ)(d),y=(0,r.useMemo)(()=>f(e),[e]),v=d&&!g?[]:y.map(h),w=(0,r.useRef)(!0),b=(0,r.useRef)(y),N=(0,l.M)(()=>new Map),[S,P]=(0,r.useState)(y),[E,C]=(0,r.useState)(y);(0,x.E)(()=>{w.current=!1,b.current=y;for(let e=0;e<E.length;e++){let t=h(E[e]);v.includes(t)?N.delete(t):!0!==N.get(t)&&N.set(t,!1)}},[E,v.length,v.join("-")]);let R=[];if(y!==S){let e=[...y];for(let t=0;t<E.length;t++){let a=E[t],s=h(a);v.includes(s)||(e.splice(t,0,a),R.push(a))}return"wait"===c&&R.length&&(e=R),C(f(e)),P(y),null}let{forceRender:k}=(0,r.useContext)(i.L);return(0,s.jsx)(s.Fragment,{children:E.map(e=>{let r=h(e),i=(!d||!!g)&&(y===E||v.includes(r));return(0,s.jsx)(u,{isPresent:i,initial:(!w.current||!!a)&&void 0,custom:t,presenceAffectsLayout:o,mode:c,onExitComplete:i?void 0:()=>{if(!N.has(r))return;N.set(r,!0);let e=!0;N.forEach(t=>{t||(e=!1)}),e&&(null==k||k(),C(b.current),d&&(null==j||j()),n&&n())},anchorX:m,children:e},r)})})}},7288:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>b});var s=a(7876),r=a(4232),i=a(7212),l=a(4522),n=a(7041),o=a(6108),c=a(5495),d=a(2436);let u=e=>{let{handleClick:t}=e,[a,u]=(0,r.useState)(0),[m,p]=(0,r.useState)([]),[h,f]=(0,r.useState)(!0);return(0,r.useEffect)(()=>{(async()=>{p(await (0,c.ts)("hero")),f(!1)})()},[]),(0,r.useEffect)(()=>{let e=setInterval(()=>{m&&0!==m.length&&u(e=>(e+1)%m.length)},5e3);return()=>clearInterval(e)},[m]),(0,s.jsx)(d.a,{isLoading:h,children:(0,s.jsxs)("section",{className:"relative w-full h-screen overflow-hidden",children:[(0,s.jsx)("div",{className:"absolute inset-0 w-full h-full",children:(0,s.jsx)(i.N,{initial:!1,children:(0,s.jsx)(l.P.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:1.5,ease:"easeInOut"},className:"absolute inset-0 w-full h-full",children:(0,s.jsx)("div",{className:"w-full h-full bg-cover bg-center",style:{backgroundImage:"url(".concat(m[a],")"),filter:"brightness(0.5)"}})},a)})}),(0,s.jsxs)("div",{className:"relative z-10 h-full w-full flex flex-col items-center justify-center",children:[(0,s.jsx)("div",{className:"container mx-auto px-4 text-center",children:(0,s.jsxs)(l.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},className:"space-y-8",children:[(0,s.jsx)("h1",{className:"text-6xl md:text-7xl font-bold tracking-tight text-white",children:"PEC Robotics Society"}),(0,s.jsx)("p",{className:"text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto",children:"Pushing the boundaries of innovation through robotics and automation"}),(0,s.jsx)("div",{className:"mt-12",children:(0,s.jsxs)(n.$,{className:"px-8 py-6 text-lg rounded-full  text-white transition-all duration-300 ease-in-out hover:scale-105 backdrop-blur-sm bg-opacity-80",onClick:t,children:["Explore Our Projects ",(0,s.jsx)(o.A,{className:"ml-2"})]})})]})}),(0,s.jsx)("div",{className:"absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3",children:m.map((e,t)=>(0,s.jsx)("button",{onClick:()=>u(t),className:"w-3 h-3 rounded-full transition-all duration-300 ".concat(t===a?"bg-white scale-110 w-4":"bg-white/50 hover:bg-white/70"),"aria-label":"Go to slide ".concat(t+1)},t))})]})]})})};var m=a(4587),p=a.n(m),h=a(2817);let f=e=>{let{teamMembers:t}=e;return(0,s.jsx)("section",{className:"py-24",id:"team",children:(0,s.jsx)(h.A,{title:"Our Team",subtitle:"Meet the minds behind the innovation",children:(0,s.jsx)("div",{className:t.length>=4?"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8":"flex justify-center items-center gap-8",children:null==t?void 0:t.map((e,t)=>(0,s.jsxs)(l.P.div,{initial:{opacity:0,scale:.9},whileInView:{opacity:1,scale:1},transition:{duration:.4},className:"glass-card p-6 text-center",children:[(0,s.jsx)("div",{className:"relative w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4",children:(0,s.jsx)(p(),{src:e.image,alt:e.firstName,fill:!0,className:"object-contain rounded-[50px]"})}),(0,s.jsxs)("p",{className:"text-gray-600",children:["Name : ",e.firstName," ",e.lastName]}),(0,s.jsxs)("p",{className:"text-gray-600",children:["Role : ",e.role]})]},t))})})})};var x=a(2898),g=a(7341),j=a(2832),y=a(1763);let v=async()=>{let{data:e,error:t}=await y.S.from("team").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Team Members");return JSON.parse(JSON.stringify(e))};var w=a(6544);let b=()=>{let[e,t]=(0,r.useState)([]),[a,i]=(0,r.useState)([]),[l,n]=(0,r.useState)(!0);return(0,r.useEffect)(()=>{(async()=>{let e=await v(),a=await (0,j.JQ)();t(e),i(a),n(!1)})()},[]),(0,s.jsx)(d.a,{isLoading:l,children:(0,s.jsxs)(g.A,{children:[(0,s.jsx)(x.A,{title:"Robotics Society | Punjab Engineering College",description:"PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."}),(0,s.jsx)(u,{handleClick:()=>{var e;null===(e=document.getElementById("projects"))||void 0===e||e.scrollIntoView({behavior:"smooth"})}}),(0,s.jsx)(w.ProjectSection,{projects:a}),(0,s.jsx)(f,{teamMembers:e})]})})}},7984:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d});var s=a(7876),r=a(4522),i=a(727),l=a(4587),n=a.n(l),o=a(8230),c=a.n(o);let d=e=>{let{projects:t}=e;return null==t?void 0:t.map(e=>(0,s.jsx)(r.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},children:(0,s.jsx)(r.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},whileHover:{y:-5},children:(0,s.jsx)(c(),{href:"/project/".concat(e.id),children:(0,s.jsxs)(i.Zp,{className:"overflow-hidden hover:shadow-lg transition-all duration-300",children:[(0,s.jsx)("div",{className:"relative aspect-video bg-gray-100",children:(0,s.jsx)(n(),{src:e.image,alt:e.title,fill:!0,className:"object-contain"})}),(0,s.jsxs)("div",{className:"p-6",children:[(0,s.jsx)("div",{className:"flex justify-between items-start mb-4",children:(0,s.jsx)("h3",{className:"text-xl font-semibold",children:e.title})}),(0,s.jsx)("p",{className:"text-gray-600",children:e.description})]})]})})},e.id)},e.id))}}},e=>{var t=t=>e(e.s=t);e.O(0,[522,92,736,216,636,593,792],()=>t(6760)),_N_E=e.O()}]);