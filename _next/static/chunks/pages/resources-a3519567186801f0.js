(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1119],{1345:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/resources",function(){return s(2960)}])},2436:(e,t,s)=>{"use strict";s.d(t,{a:()=>i});var a=s(7876);s(4232);var r=s(612);let i=e=>{let{size:t="md",text:s,className:i,variant:n="spinner",isLoading:l,children:c}=e,o={sm:"w-8 h-8",md:"w-12 h-12",lg:"w-16 h-16"};return(0,a.jsx)(a.Fragment,{children:l?(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center p-6 bg-background border w-full h-full min-h-screen",children:[(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(()=>{switch(n){case"spinner":return(0,a.jsx)("div",{className:(0,r.cn)("relative animate-spin rounded-full border-4 border-primary/30 border-t-primary",o[t],i)});case"pulse":return(0,a.jsxs)("div",{className:(0,r.cn)("relative flex items-center justify-center",o[t],i),children:[(0,a.jsx)("div",{className:"absolute w-full h-full rounded-full bg-primary/20 animate-ping"}),(0,a.jsx)("div",{className:"absolute w-3/4 h-3/4 rounded-full bg-primary/40 animate-pulse"}),(0,a.jsx)("div",{className:"w-1/2 h-1/2 rounded-full bg-primary"})]});case"dots":return(0,a.jsx)("div",{className:(0,r.cn)("flex space-x-2",i),children:[0,1,2].map(e=>(0,a.jsx)("div",{className:(0,r.cn)("rounded-full bg-primary","sm"===t?"w-2 h-2":"md"===t?"w-3 h-3":"w-4 h-4","animate-bounce",0===e?"animate-delay-0":1===e?"animate-delay-150":"animate-delay-300")},e))});default:return null}})(),s&&(0,a.jsx)("p",{className:"text-foreground/80 animate-pulse text-sm md:text-base",children:s})]}),(0,a.jsx)("span",{className:"mt-4 font-medium",children:"Loading..."})]}):c})}},2512:(e,t,s)=>{"use strict";s.d(t,{o8:()=>n,uk:()=>i,xF:()=>r});var a=s(5263);let r=async()=>{let{data:e,error:t}=await a.S.from("resources").select("*");return t&&console.log(t),{data:e,error:t}},i=async e=>{let{id:t,...s}=e,{error:r}=await a.S.from("resources").insert(s);return r&&console.log(r),r},n=async e=>await a.S.from("projects").delete().eq("id",e.id)},2817:(e,t,s)=>{"use strict";s.d(t,{A:()=>i});var a=s(7876),r=s(4522);let i=e=>{let{title:t,subtitle:s,children:i}=e;return(0,a.jsxs)("div",{className:"container mx-auto px-6",children:[(0,a.jsxs)(r.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,a.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,a.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:s})]}),(0,a.jsx)(r.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:i})]})}},2960:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var a=s(7876),r=s(7341),i=s(4232),n=s(5654),l=s(2898),c=s(2512),o=s(4725),d=s(2436),u=s(2817);let m=()=>{let[e,t]=(0,i.useState)([]),[s,m]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{(async()=>{let{data:e,error:s}=await (0,c.xF)();if(console.log(e),s){(0,o.oR)({title:"Error",description:s.message,variant:"destructive"});return}if(!e){(0,o.oR)({title:"Error",description:"Could not fetch data",variant:"destructive"});return}t(e),m(!1)})()},[]),(0,a.jsx)(r.A,{children:(0,a.jsxs)(d.a,{isLoading:s,children:[(0,a.jsx)(l.A,{title:"Robotics Society | Punjab Engineering College",description:"PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."}),(0,a.jsx)("section",{className:"py-24",id:"events",children:(0,a.jsx)(u.A,{title:"Resources",subtitle:"Feel Free to look at the resources",children:e.length>0&&e.map(e=>(0,a.jsx)(n.default,{resource:e},e.name))})})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[3466,4522,4587,8230,1936,1216,5654,636,6593,8792],()=>t(1345)),_N_E=e.O()}]);