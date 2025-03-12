(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[263],{1161:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>g});var r=s(7876),a=s(7041),l=s(2963),i=s(6108),n=s(9099),o=s(7212),c=s(4522),d=s(4587),m=s.n(d),u=s(4232),p=s(2832),x=s(2436),f=s(2898),h=s(7341);let g=()=>{var e;let t=(0,n.useRouter)(),s=t.query.id,[d,g]=(0,u.useState)(),[j,w]=(0,u.useState)(0),[y,v]=(0,u.useState)([]),b=0,[N,S]=(0,u.useState)(!0);(0,u.useEffect)(()=>{(async()=>{if(t.isReady){let e=await (0,p.G6)(s),t=await (0,p.JQ)(),r=t.length;e.technologies=e.technologies.split(","),g(e),w(r),v(t),S(!1)}})()},[t.isReady,t.query]);for(let e=0;e<j;e++)if(y[e].id==(null==d?void 0:d.id)){b=e;break}return(0,r.jsx)(x.a,{isLoading:N,children:(0,r.jsxs)(h.A,{children:[(0,r.jsx)(f.A,{title:"Robotics Society | Punjab Engineering College",description:"PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."}),d?(0,r.jsx)(o.N,{mode:"wait",children:(0,r.jsx)(c.P.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5},className:"pt-20 pb-10 px-4 sm:px-6",children:(0,r.jsxs)("div",{className:"container mx-auto",children:[(0,r.jsxs)("div",{className:"flex flex-col items-center mb-8",children:[(0,r.jsx)("span",{className:"text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800",children:d.category}),(0,r.jsx)("h1",{className:"text-3xl sm:text-4xl md:text-5xl font-medium text-center max-w-3xl mb-3",children:d.title}),(0,r.jsx)("p",{className:"text-base sm:text-lg text-gray-600 text-center max-w-2xl",children:d.description}),(0,r.jsx)("div",{className:"flex flex-wrap justify-center gap-2 mt-4",children:null===(e=d.technologies)||void 0===e?void 0:e.map((e,t)=>(0,r.jsx)("span",{className:"text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600",children:e},t))})]}),(0,r.jsx)("div",{className:"relative rounded-xl overflow-hidden aspect-video mb-12 shadow-lg",children:(0,r.jsx)(m(),{src:d.image,alt:d.title,fill:!0,className:"object-cover"})}),(0,r.jsxs)("div",{className:"max-w-3xl mx-auto mb-12 px-4 sm:px-0",children:[(0,r.jsx)("h2",{className:"text-xl sm:text-2xl font-medium mb-4",children:"About this project"}),(0,r.jsx)("p",{className:"text-base sm:text-lg text-gray-700 leading-relaxed",children:d.longDescription})]}),(0,r.jsxs)("div",{className:"flex flex-nowrap justify-center sm:justify-between items-center max-w-5xl mx-auto gap-2 mt-12 overflow-hidden",children:[(0,r.jsxs)(a.$,{onClick:()=>{let e=b-1;0===e&&(e=j-1),t.push("/project/".concat(y[e].id))},className:"w-full sm:w-auto max-w-[110px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap",children:[(0,r.jsx)(l.A,{size:12,className:"mr-1 sm:mr-2"}),(0,r.jsx)("span",{children:"Previous"})]}),(0,r.jsx)(a.$,{onClick:()=>t.push("/projects"),className:"w-full sm:w-auto max-w-[140px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap",children:"View all"}),(0,r.jsxs)(a.$,{onClick:()=>{let e=b+1;e>=j&&(e=0),t.push("/project/".concat(y[e].id))},className:"w-full sm:w-auto max-w-[110px] px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm md:text-base  text-white flex items-center justify-center whitespace-nowrap",children:[(0,r.jsx)("span",{children:"Next"}),(0,r.jsx)(i.A,{size:12,className:"ml-1 sm:ml-2"})]})]})]})},d.id)}):(0,r.jsxs)("div",{className:"text-center mb-12 py-10",children:[(0,r.jsx)("h1",{className:"text-3xl sm:text-4xl font-bold mb-4",children:"Incorrect Project ID"}),(0,r.jsxs)(a.$,{className:"px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full  text-white transition-all duration-300 ease-in-out hover:scale-105",onClick:()=>{t.push("/#projects")},children:["Explore Our Projects ",(0,r.jsx)(i.A,{className:"ml-2"})]})]})]})})}},2436:(e,t,s)=>{"use strict";s.d(t,{a:()=>l});var r=s(7876);s(4232);var a=s(4317);let l=e=>{let{size:t="md",text:s,className:l,variant:i="spinner",isLoading:n,children:o}=e,c={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,r.jsx)(r.Fragment,{children:n?(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(i){case"spinner":return(0,r.jsx)("div",{className:(0,a.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",c[t],l)});case"pulse":return(0,r.jsxs)("div",{className:(0,a.cn)("relative flex items-center justify-center",c[t],l),children:[(0,r.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,r.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,r.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,r.jsx)("div",{className:(0,a.cn)("flex space-x-2",l),children:[0,1,2].map(e=>(0,r.jsx)("div",{className:(0,a.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),s&&(0,r.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:s})]}),(0,r.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):o})}},2832:(e,t,s)=>{"use strict";s.d(t,{G6:()=>o,JQ:()=>n,nz:()=>c,vr:()=>m,xx:()=>d});var r=s(5263),a=s(5495),l=s(4317),i=s(5668);let n=async()=>{let{data:e,error:t}=await r.S.from("projects").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Projects");return JSON.parse(JSON.stringify(e))},o=async e=>{let{data:t,error:s}=await r.S.from("projects").select().eq("id",e);if(s&&console.log(s),!t)throw Error("Project with this id doesn't exist");return JSON.parse(JSON.stringify(t[0]))},c=async(e,t)=>{await (0,a.V6)("projects",t,e.image);let{data:s}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{id:l,...i}=e,{error:n}=await r.S.from("projects").insert({...i,image:s.publicUrl});return n?(console.log(n),{error:n}):{error:null}},d=async e=>(await (0,a.vS)(["projects/".concat(e.image.split("/").pop())]),await r.S.from("projects").delete().eq("id",e.id)),m=async(e,t)=>{let s=await o(e.id);await (0,a.vS)(["projects/".concat(s.image.split("/").pop())]);let{id:n,...c}=e;if(!await (0,a.V6)("projects",t,e.image))return new i.kf({message:"Image upload fail",details:"",hint:"",code:""});let{data:d}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{error:m}=await r.S.from("projects").update({...c,image:d.publicUrl}).eq("id",e.id);if(m){let e=await (0,l.W6)(s.image);await (0,a.V6)("projects",s.image.split("/").pop(),e),console.log(m)}return m}},2963:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(1713).A)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},5495:(e,t,s)=>{"use strict";s.d(t,{V6:()=>n,ts:()=>i,vS:()=>o});var r=s(4317),a=s(5263);let l=async e=>{let{data:t,error:s}=await a.S.storage.from("media").list(e);return s?(console.log(s),[]):null==t?void 0:t.map(e=>e.name)},i=async e=>{let t=await l(e),s=[];for(let r=0;r<t.length;r++){let{data:l}=a.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[r]));s.push(l.publicUrl)}return s},n=async(e,t,s)=>{let l=t.split(".")[t.split(".").length-1],i="image/".concat(l),n=s.replace(/^data:image\/\w+;base64,/,""),o=(0,r.i)(n,i),c="".concat(e,"/").concat(t),{data:d,error:m}=await a.S.storage.from("media").upload(c,o,{contentType:i,upsert:!0});return m&&console.log(m),d},o=async e=>{let{data:t,error:s}=await a.S.storage.from("media").remove(e);if(s){console.log(s);return}return t}},7212:(e,t,s)=>{"use strict";s.d(t,{N:()=>g});var r=s(7876),a=s(4232),l=s(5048),i=s(1200),n=s(3866),o=s(9751);class c extends a.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=t.offsetParent,s=e instanceof HTMLElement&&e.offsetWidth||0,r=this.props.sizeRef.current;r.height=t.offsetHeight||0,r.width=t.offsetWidth||0,r.top=t.offsetTop,r.left=t.offsetLeft,r.right=s-r.width-r.left}return null}componentDidUpdate(){}render(){return this.props.children}}function d({children:e,isPresent:t,anchorX:s}){let l=(0,a.useId)(),i=(0,a.useRef)(null),n=(0,a.useRef)({width:0,height:0,top:0,left:0,right:0}),{nonce:d}=(0,a.useContext)(o.Q);return(0,a.useInsertionEffect)(()=>{let{width:e,height:r,top:a,left:o,right:c}=n.current;if(t||!i.current||!e||!r)return;let m="left"===s?`left: ${o}`:`right: ${c}`;i.current.dataset.motionPopId=l;let u=document.createElement("style");return d&&(u.nonce=d),document.head.appendChild(u),u.sheet&&u.sheet.insertRule(`
          [data-motion-pop-id="${l}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${r}px !important;
            ${m}px !important;
            top: ${a}px !important;
          }
        `),()=>{document.head.removeChild(u)}},[t]),(0,r.jsx)(c,{isPresent:t,childRef:i,sizeRef:n,children:a.cloneElement(e,{ref:i})})}let m=({children:e,initial:t,isPresent:s,onExitComplete:l,custom:o,presenceAffectsLayout:c,mode:m,anchorX:p})=>{let x=(0,i.M)(u),f=(0,a.useId)(),h=(0,a.useCallback)(e=>{for(let t of(x.set(e,!0),x.values()))if(!t)return;l&&l()},[x,l]),g=(0,a.useMemo)(()=>({id:f,initial:t,isPresent:s,custom:o,onExitComplete:h,register:e=>(x.set(e,!1),()=>x.delete(e))}),c?[Math.random(),h]:[s,h]);return(0,a.useMemo)(()=>{x.forEach((e,t)=>x.set(t,!1))},[s]),a.useEffect(()=>{s||x.size||!l||l()},[s]),"popLayout"===m&&(e=(0,r.jsx)(d,{isPresent:s,anchorX:p,children:e})),(0,r.jsx)(n.t.Provider,{value:g,children:e})};function u(){return new Map}var p=s(3885);let x=e=>e.key||"";function f(e){let t=[];return a.Children.forEach(e,e=>{(0,a.isValidElement)(e)&&t.push(e)}),t}var h=s(181);let g=({children:e,custom:t,initial:s=!0,onExitComplete:n,presenceAffectsLayout:o=!0,mode:c="sync",propagate:d=!1,anchorX:u="left"})=>{let[g,j]=(0,p.xQ)(d),w=(0,a.useMemo)(()=>f(e),[e]),y=d&&!g?[]:w.map(x),v=(0,a.useRef)(!0),b=(0,a.useRef)(w),N=(0,i.M)(()=>new Map),[S,E]=(0,a.useState)(w),[P,C]=(0,a.useState)(w);(0,h.E)(()=>{v.current=!1,b.current=w;for(let e=0;e<P.length;e++){let t=x(P[e]);y.includes(t)?N.delete(t):!0!==N.get(t)&&N.set(t,!1)}},[P,y.length,y.join("-")]);let k=[];if(w!==S){let e=[...w];for(let t=0;t<P.length;t++){let s=P[t],r=x(s);y.includes(r)||(e.splice(t,0,s),k.push(s))}return"wait"===c&&k.length&&(e=k),C(f(e)),E(w),null}let{forceRender:R}=(0,a.useContext)(l.L);return(0,r.jsx)(r.Fragment,{children:P.map(e=>{let a=x(e),l=(!d||!!g)&&(w===P||y.includes(a));return(0,r.jsx)(m,{isPresent:l,initial:(!v.current||!!s)&&void 0,custom:t,presenceAffectsLayout:o,mode:c,onExitComplete:l?void 0:()=>{if(!N.has(a))return;N.set(a,!0);let e=!0;N.forEach(t=>{t||(e=!1)}),e&&(null==R||R(),C(b.current),d&&(null==j||j()),n&&n())},anchorX:u,children:e},a)})})}},9226:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/project/[id]",function(){return s(1161)}])}},e=>{var t=t=>e(e.s=t);e.O(0,[522,587,230,736,216,636,593,792],()=>t(9226)),_N_E=e.O()}]);