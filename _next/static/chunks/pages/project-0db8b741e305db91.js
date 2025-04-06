(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7727],{727:(e,t,a)=>{"use strict";a.d(t,{BT:()=>c,Wu:()=>d,ZB:()=>o,Zp:()=>l,aR:()=>n,wL:()=>m});var r=a(7876),i=a(4232),s=a(612);let l=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("div",{ref:t,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...i})});l.displayName="Card";let n=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",a),...i})});n.displayName="CardHeader";let o=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("h3",{ref:t,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",a),...i})});o.displayName="CardTitle";let c=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",a),...i})});c.displayName="CardDescription";let d=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",a),...i})});d.displayName="CardContent";let m=i.forwardRef((e,t)=>{let{className:a,...i}=e;return(0,r.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",a),...i})});m.displayName="CardFooter"},2436:(e,t,a)=>{"use strict";a.d(t,{a:()=>s});var r=a(7876);a(4232);var i=a(612);let s=e=>{let{size:t="md",text:a,className:s,variant:l="spinner",isLoading:n,children:o}=e,c={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,r.jsx)(r.Fragment,{children:n?(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(l){case"spinner":return(0,r.jsx)("div",{className:(0,i.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",c[t],s)});case"pulse":return(0,r.jsxs)("div",{className:(0,i.cn)("relative flex items-center justify-center",c[t],s),children:[(0,r.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,r.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,r.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,r.jsx)("div",{className:(0,i.cn)("flex space-x-2",s),children:[0,1,2].map(e=>(0,r.jsx)("div",{className:(0,i.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),a&&(0,r.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:a})]}),(0,r.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):o})}},2817:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});var r=a(7876),i=a(4522);let s=e=>{let{title:t,subtitle:a,children:s}=e;return(0,r.jsxs)("div",{className:"container mx-auto px-6",children:[(0,r.jsxs)(i.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,r.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,r.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:a})]}),(0,r.jsx)(i.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:s})]})}},2832:(e,t,a)=>{"use strict";a.d(t,{G6:()=>o,JQ:()=>n,nz:()=>c,vr:()=>m,xx:()=>d});var r=a(5263),i=a(5495),s=a(612),l=a(5668);let n=async()=>{let{data:e,error:t}=await r.S.from("projects").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Projects");return JSON.parse(JSON.stringify(e))},o=async e=>{let{data:t,error:a}=await r.S.from("projects").select().eq("id",e);if(a&&console.log(a),!t)throw Error("Project with this id doesn't exist");return JSON.parse(JSON.stringify(t[0]))},c=async(e,t)=>{await (0,i.V6)("projects",t,e.image);let{data:a}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{id:s,...l}=e,{error:n}=await r.S.from("projects").insert({...l,image:a.publicUrl});return n?(console.log(n),{error:n}):{error:null}},d=async e=>(await (0,i.vS)(["projects/".concat(e.image.split("/").pop())]),await r.S.from("projects").delete().eq("id",e.id)),m=async(e,t)=>{let a=await o(e.id);await (0,i.vS)(["projects/".concat(a.image.split("/").pop())]);let{id:n,...c}=e;if(!await (0,i.V6)("projects",t,e.image))return new l.kf({message:"Image upload fail",details:"",hint:"",code:""});let{data:d}=r.S.storage.from("media").getPublicUrl("projects/".concat(t)),{error:m}=await r.S.from("projects").update({...c,image:d.publicUrl}).eq("id",e.id);if(m){let e=await (0,s.W6)(a.image);await (0,i.V6)("projects",a.image.split("/").pop(),e),console.log(m)}return m}},5495:(e,t,a)=>{"use strict";a.d(t,{Se:()=>c,V6:()=>n,VM:()=>p,jW:()=>d,ts:()=>l,vS:()=>o,xp:()=>u});var r=a(612),i=a(5263);let s=async e=>{let{data:t,error:a}=await i.S.storage.from("media").list(e);return a?(console.log(a),[]):null==t?void 0:t.map(e=>e.name)},l=async e=>{let t=await s(e),a=[];for(let r=0;r<t.length;r++){let{data:s}=i.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[r]));a.push(s.publicUrl)}return a},n=async(e,t,a)=>{let s=t.split(".")[t.split(".").length-1],l="image/".concat(s),n=a.replace(/^data:image\/\w+;base64,/,""),o=(0,r.i)(n,l),c="".concat(e,"/").concat(t),{data:d,error:m}=await i.S.storage.from("media").upload(c,o,{contentType:l,upsert:!0});return m&&console.log(m),d},o=async e=>{let{data:t,error:a}=await i.S.storage.from("media").remove(e);if(a){console.log(a);return}return t},c=async(e,t)=>{let{data:a,error:r}=await i.S.storage.from("media").download("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e));return r?(console.log(r),null):await a.text()},d=async(e,t,a)=>{let s="text/markdown",l=new File([(0,r.OO)(a)],e,{type:s});await i.S.storage.from("media").upload("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e),l,{contentType:s,upsert:!0})},m=async e=>{let t=[],{data:a,error:r}=await i.S.storage.from("media").list(e,{limit:1e3});if(r)return console.error("Error listing files:",r),[];for(let r of a){var s;if(r.name&&(null===(s=r.metadata)||void 0===s?void 0:s.mimetype)!=="inode/directory"&&t.push("".concat(e?e+"/":"").concat(r.name)),r.name&&null===r.metadata){let a="".concat(e?e+"/":"").concat(r.name),i=await m(a);t.push(...i)}}return t},u=async(e,t)=>{let a=await m("markdown/".concat(t,"/").concat(e));if(a.length>0){let{data:e,error:t}=await i.S.storage.from("media").remove(a);if(t){console.log(t);return}return e}throw Error('No files in the folder "markdown/'.concat(t,"/").concat(e,'"'))},p=async(e,t)=>{let{data:a,error:r}=await i.S.storage.from("media").remove(["markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e)]);if(r){console.log(r);return}return a}},6544:(e,t,a)=>{"use strict";a.r(t),a.d(t,{ProjectSection:()=>m,default:()=>u});var r=a(7876),i=a(4232),s=a(2832),l=a(2436),n=a(2898),o=a(7341),c=a(2817),d=a(7984);let m=e=>{let{projects:t}=e;return(0,r.jsx)("section",{className:"py-24",id:"projects",children:(0,r.jsx)(c.A,{title:"Our Projects",subtitle:"Discover our innovative robotics projects",children:(0,r.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:(0,r.jsx)(d.default,{projects:t})})})})},u=()=>{let[e,t]=(0,i.useState)(!0),[a,c]=(0,i.useState)([]);return(0,i.useEffect)(()=>{(async()=>{c(await (0,s.JQ)()),t(!1)})()},[]),(0,r.jsx)(o.A,{children:(0,r.jsxs)(l.a,{isLoading:e,children:[(0,r.jsx)(n.A,{title:"Robotics Society | Punjab Engineering",description:"Projects made by Robotics Society, Punjab Engineering College"}),(0,r.jsx)(m,{projects:a})]})})}},7984:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d});var r=a(7876),i=a(4522),s=a(727),l=a(4587),n=a.n(l),o=a(8230),c=a.n(o);let d=e=>{let{projects:t}=e;return null==t?void 0:t.map(e=>(0,r.jsx)(i.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},children:(0,r.jsx)(i.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},whileHover:{y:-5},children:(0,r.jsx)(c(),{href:"/project/".concat(e.id),children:(0,r.jsxs)(s.Zp,{className:"overflow-hidden hover:shadow-lg transition-all duration-300",children:[(0,r.jsx)("div",{className:"relative aspect-video bg-gray-100",children:(0,r.jsx)(n(),{src:e.image,alt:e.title,fill:!0,className:"object-contain"})}),(0,r.jsxs)("div",{className:"p-6",children:[(0,r.jsx)("div",{className:"flex justify-between items-start mb-4",children:(0,r.jsx)("h3",{className:"text-xl font-semibold",children:e.title})}),(0,r.jsx)("p",{className:"text-gray-600",children:e.description})]})]})})},e.id)},e.id))}},8945:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/project",function(){return a(6544)}])}},e=>{var t=t=>e(e.s=t);e.O(0,[3466,4522,4587,8230,1936,1216,636,6593,8792],()=>t(8945)),_N_E=e.O()}]);