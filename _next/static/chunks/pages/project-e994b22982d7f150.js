(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[727],{727:(e,t,a)=>{"use strict";a.d(t,{BT:()=>o,Wu:()=>d,ZB:()=>c,Zp:()=>l,aR:()=>n,wL:()=>m});var r=a(7876),s=a(4232),i=a(4317);let l=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...s})});l.displayName="Card";let n=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",a),...s})});n.displayName="CardHeader";let c=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("h3",{ref:t,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",a),...s})});c.displayName="CardTitle";let o=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("p",{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...s})});o.displayName="CardDescription";let d=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("p-6 pt-0",a),...s})});d.displayName="CardContent";let m=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("flex items-center p-6 pt-0",a),...s})});m.displayName="CardFooter"},2436:(e,t,a)=>{"use strict";a.d(t,{a:()=>i});var r=a(7876);a(4232);var s=a(4317);let i=e=>{let{size:t="md",text:a,className:i,variant:l="spinner",isLoading:n,children:c}=e,o={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,r.jsx)(r.Fragment,{children:n?(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(l){case"spinner":return(0,r.jsx)("div",{className:(0,s.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",o[t],i)});case"pulse":return(0,r.jsxs)("div",{className:(0,s.cn)("relative flex items-center justify-center",o[t],i),children:[(0,r.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,r.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,r.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,r.jsx)("div",{className:(0,s.cn)("flex space-x-2",i),children:[0,1,2].map(e=>(0,r.jsx)("div",{className:(0,s.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),a&&(0,r.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:a})]}),(0,r.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):c})}},2817:(e,t,a)=>{"use strict";a.d(t,{A:()=>i});var r=a(7876),s=a(4522);let i=e=>{let{title:t,subtitle:a,children:i}=e;return(0,r.jsxs)("div",{className:"container mx-auto px-6",children:[(0,r.jsxs)(s.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,r.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,r.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:a})]}),(0,r.jsx)(s.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:i})]})}},2832:(e,t,a)=>{"use strict";a.d(t,{G6:()=>c,JQ:()=>n,nz:()=>o,vr:()=>m,xx:()=>d});var r=a(5263),s=a(5495),i=a(4317),l=a(5668);let n=async()=>{let{data:e,error:t}=await r.S.from("projects").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Projects");return JSON.parse(JSON.stringify(e))},c=async e=>{let{data:t,error:a}=await r.S.from("projects").select().eq("id",e);if(a&&console.log(a),!t)throw Error("Project with this id doesn't exist");return JSON.parse(JSON.stringify(t[0]))},o=async(e,t)=>{await (0,s.V6)("projects",t,e.image);let{data:a}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{id:i,...l}=e,{error:n}=await r.S.from("projects").insert({...l,image:a.publicUrl});return n?(console.log(n),{error:n}):{error:null}},d=async e=>(await (0,s.vS)(["projects/".concat(e.image.split("/").pop())]),await r.S.from("projects").delete().eq("id",e.id)),m=async(e,t)=>{let a=await c(e.id);await (0,s.vS)(["projects/".concat(a.image.split("/").pop())]);let{id:n,...o}=e;if(!await (0,s.V6)("projects",t,e.image))return new l.kf({message:"Image upload fail",details:"",hint:"",code:""});let{data:d}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{error:m}=await r.S.from("projects").update({...o,image:d.publicUrl}).eq("id",e.id);if(m){let e=await (0,i.W6)(a.image);await (0,s.V6)("projects",a.image.split("/").pop(),e),console.log(m)}return m}},5495:(e,t,a)=>{"use strict";a.d(t,{V6:()=>n,ts:()=>l,vS:()=>c});var r=a(4317),s=a(5263);let i=async e=>{let{data:t,error:a}=await s.S.storage.from("media").list(e);return a?(console.log(a),[]):null==t?void 0:t.map(e=>e.name)},l=async e=>{let t=await i(e),a=[];for(let r=0;r<t.length;r++){let{data:i}=s.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[r]));a.push(i.publicUrl)}return a},n=async(e,t,a)=>{let i=t.split(".")[t.split(".").length-1],l="image/".concat(i),n=a.replace(/^data:image\/\w+;base64,/,""),c=(0,r.i)(n,l),o="".concat(e,"/").concat(t),{data:d,error:m}=await s.S.storage.from("media").upload(o,c,{contentType:l,upsert:!0});return m&&console.log(m),d},c=async e=>{let{data:t,error:a}=await s.S.storage.from("media").remove(e);if(a){console.log(a);return}return t}},6544:(e,t,a)=>{"use strict";a.r(t),a.d(t,{ProjectSection:()=>m,default:()=>u});var r=a(7876),s=a(4232),i=a(2832),l=a(2436),n=a(2898),c=a(7341),o=a(2817),d=a(7984);let m=e=>{let{projects:t}=e;return(0,r.jsx)("section",{className:"py-24",id:"projects",children:(0,r.jsx)(o.A,{title:"Our Projects",subtitle:"Discover our innovative robotics projects",children:(0,r.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:(0,r.jsx)(d.default,{projects:t})})})})},u=()=>{let[e,t]=(0,s.useState)(!0),[a,o]=(0,s.useState)([]);return(0,s.useEffect)(()=>{(async()=>{o(await (0,i.JQ)()),t(!1)})()},[]),(0,r.jsx)(l.a,{isLoading:e,children:(0,r.jsxs)(c.A,{children:[(0,r.jsx)(n.A,{title:"Robotics Society | Punjab Engineering",description:"Projects made by Robotics Society, Punjab Engineering College"}),(0,r.jsx)(m,{projects:a})]})})}},7984:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d});var r=a(7876),s=a(4522),i=a(727),l=a(4587),n=a.n(l),c=a(8230),o=a.n(c);let d=e=>{let{projects:t}=e;return null==t?void 0:t.map(e=>(0,r.jsx)(s.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},children:(0,r.jsx)(s.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},whileHover:{y:-5},children:(0,r.jsx)(o(),{href:"/project/".concat(e.id),children:(0,r.jsxs)(i.Zp,{className:"overflow-hidden hover:shadow-lg transition-all duration-300",children:[(0,r.jsx)("div",{className:"relative aspect-video bg-gray-100",children:(0,r.jsx)(n(),{src:e.image,alt:e.title,fill:!0,className:"object-contain"})}),(0,r.jsxs)("div",{className:"p-6",children:[(0,r.jsx)("div",{className:"flex justify-between items-start mb-4",children:(0,r.jsx)("h3",{className:"text-xl font-semibold",children:e.title})}),(0,r.jsx)("p",{className:"text-gray-600",children:e.description})]})]})})},e.id)},e.id))}},8945:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/project",function(){return a(6544)}])}},e=>{var t=t=>e(e.s=t);e.O(0,[522,92,736,216,636,593,792],()=>t(8945)),_N_E=e.O()}]);