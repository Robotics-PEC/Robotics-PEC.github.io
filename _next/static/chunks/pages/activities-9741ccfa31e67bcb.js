(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5539],{727:(e,t,a)=>{"use strict";a.d(t,{BT:()=>o,Wu:()=>d,ZB:()=>c,Zp:()=>n,aR:()=>l,wL:()=>m});var i=a(7876),r=a(4232),s=a(612);let n=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...r})});n.displayName="Card";let l=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",a),...r})});l.displayName="CardHeader";let c=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("h3",{ref:t,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",a),...r})});c.displayName="CardTitle";let o=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",a),...r})});o.displayName="CardDescription";let d=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",a),...r})});d.displayName="CardContent";let m=r.forwardRef((e,t)=>{let{className:a,...r}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",a),...r})});m.displayName="CardFooter"},2436:(e,t,a)=>{"use strict";a.d(t,{a:()=>s});var i=a(7876);a(4232);var r=a(612);let s=e=>{let{size:t="md",text:a,className:s,variant:n="spinner",isLoading:l,children:c}=e,o={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,i.jsx)(i.Fragment,{children:l?(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(n){case"spinner":return(0,i.jsx)("div",{className:(0,r.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",o[t],s)});case"pulse":return(0,i.jsxs)("div",{className:(0,r.cn)("relative flex items-center justify-center",o[t],s),children:[(0,i.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,i.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,i.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,i.jsx)("div",{className:(0,r.cn)("flex space-x-2",s),children:[0,1,2].map(e=>(0,i.jsx)("div",{className:(0,r.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),a&&(0,i.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:a})]}),(0,i.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):c})}},2812:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>h});var i=a(7876),r=a(4522),s=a(727),n=a(3654),l=a(7396),c=a(4232),o=a(3476),d=a(2436),m=a(2898),u=a(7341),f=a(2817),x=a(8230),p=a.n(x);let h=()=>{let[e,t]=(0,c.useState)([]),[a,x]=(0,c.useState)(!0);return(0,c.useEffect)(()=>{(async()=>{t(await (0,o.r4)()),x(!1)})()},[]),(0,i.jsx)(u.A,{children:(0,i.jsxs)(d.a,{isLoading:a,children:[(0,i.jsx)(m.A,{title:"Robotics Society | Punjab Engineering College",description:"Join us in our robotics journey. Explore our activities and be part of our community."}),(0,i.jsx)("section",{className:"py-24",id:"events",children:(0,i.jsx)(f.A,{title:"Our Activities",subtitle:"Join us in our robotics journey",children:e.length>0?(0,i.jsx)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.4},children:(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:e.map(e=>(0,i.jsx)(r.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},whileHover:{y:-5},children:(0,i.jsx)(p(),{href:"/activities/".concat(e.id),children:(0,i.jsx)(s.Zp,{className:"overflow-hidden hover:shadow-lg transition-all duration-300",children:(0,i.jsxs)("div",{className:"p-6",children:[(0,i.jsx)("div",{className:"flex justify-between items-start mb-4",children:(0,i.jsx)("h3",{className:"text-xl font-semibold",children:e.title})}),(0,i.jsx)("p",{className:"text-gray-600 mb-4",children:e.description}),(0,i.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[(0,i.jsxs)("div",{className:"flex items-center gap-1",children:[(0,i.jsx)(n.A,{className:"h-4 w-4"}),(0,i.jsx)("span",{children:e.date})]}),(0,i.jsxs)("div",{className:"flex items-center gap-1",children:[(0,i.jsx)(l.A,{className:"h-4 w-4"}),(0,i.jsxs)("span",{children:[e.participants," Participants"]})]})]})]})})})},e.id))})}):(0,i.jsx)("div",{className:"text-center mb-16",children:(0,i.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"No Activities as of now!"})})})})]})})}},2817:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});var i=a(7876),r=a(4522);let s=e=>{let{title:t,subtitle:a,children:s}=e;return(0,i.jsxs)("div",{className:"container mx-auto px-6",children:[(0,i.jsxs)(r.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,i.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,i.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:a})]}),(0,i.jsx)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:s})]})}},3476:(e,t,a)=>{"use strict";a.d(t,{$y:()=>c,J0:()=>n,LT:()=>l,r4:()=>s});var i=a(5263),r=a(5495);let s=async()=>{let{data:e,error:t}=await i.S.from("activities").select("*");if(t&&console.log(t),!e)throw Error("Could not fetch Activies");return JSON.parse(JSON.stringify(e))},n=async e=>{let{id:t,longDescription:a,...s}=e;await (0,r.VM)("".concat(t,".md"),"activities"),await (0,r.jW)("".concat(t,".md"),"activities",a);let{error:n}=await i.S.from("activities").update(s).eq("id",e.id);return n&&console.log(n),n},l=async e=>{let{id:t,longDescription:a,...s}=e,{data:n,error:l}=await i.S.from("activities").insert(s).select().single();return(await (0,r.jW)("".concat(n.id,".md"),"activities",a),l)?(console.log(l),{error:l}):{error:null}},c=async e=>{if(!await (0,r.xp)(e,"activities"))throw Error("Markdown file of ".concat(e," in activities folder could not be deleted"));return await i.S.from("activities").delete().eq("id",e)}},4473:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/activities",function(){return a(2812)}])},5495:(e,t,a)=>{"use strict";a.d(t,{Se:()=>o,V6:()=>l,VM:()=>f,jW:()=>d,ts:()=>n,vS:()=>c,xp:()=>u});var i=a(612),r=a(5263);let s=async e=>{let{data:t,error:a}=await r.S.storage.from("media").list(e);return a?(console.log(a),[]):null==t?void 0:t.map(e=>e.name)},n=async e=>{let t=await s(e),a=[];for(let i=0;i<t.length;i++){let{data:s}=r.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(t[i]));a.push(s.publicUrl)}return a},l=async(e,t,a)=>{let s=t.split(".")[t.split(".").length-1],n="image/".concat(s),l=a.replace(/^data:image\/\w+;base64,/,""),c=(0,i.i)(l,n),o="".concat(e,"/").concat(t),{data:d,error:m}=await r.S.storage.from("media").upload(o,c,{contentType:n,upsert:!0});return m&&console.log(m),d},c=async e=>{let{data:t,error:a}=await r.S.storage.from("media").remove(e);if(a){console.log(a);return}return t},o=async(e,t)=>{let{data:a,error:i}=await r.S.storage.from("media").download("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e));return i?(console.log(i),null):await a.text()},d=async(e,t,a)=>{let s="text/markdown",n=new File([(0,i.OO)(a)],e,{type:s});await r.S.storage.from("media").upload("markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e),n,{contentType:s,upsert:!0})},m=async e=>{let t=[],{data:a,error:i}=await r.S.storage.from("media").list(e,{limit:1e3});if(i)return console.error("Error listing files:",i),[];for(let i of a){var s;if(i.name&&(null===(s=i.metadata)||void 0===s?void 0:s.mimetype)!=="inode/directory"&&t.push("".concat(e?e+"/":"").concat(i.name)),i.name&&null===i.metadata){let a="".concat(e?e+"/":"").concat(i.name),r=await m(a);t.push(...r)}}return t},u=async(e,t)=>{let a=await m("markdown/".concat(t,"/").concat(e));if(a.length>0){let{data:e,error:t}=await r.S.storage.from("media").remove(a);if(t){console.log(t);return}return e}throw Error('No files in the folder "markdown/'.concat(t,"/").concat(e,'"'))},f=async(e,t)=>{let{data:a,error:i}=await r.S.storage.from("media").remove(["markdown/".concat(t,"/").concat(e.split(".")[0],"/").concat(e)]);if(i){console.log(i);return}return a}}},e=>{var t=t=>e(e.s=t);e.O(0,[3466,4522,4587,8230,1936,1216,636,6593,8792],()=>t(4473)),_N_E=e.O()}]);