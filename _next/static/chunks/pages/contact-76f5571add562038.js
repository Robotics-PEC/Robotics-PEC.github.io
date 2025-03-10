(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[364],{727:(e,t,s)=>{"use strict";s.d(t,{BT:()=>c,Wu:()=>d,ZB:()=>l,Zp:()=>n,aR:()=>o});var r=s(7876),a=s(4232),i=s(4317);let n=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",s),...a})});n.displayName="Card";let o=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",s),...a})});o.displayName="CardHeader";let l=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("h3",{ref:t,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",s),...a})});l.displayName="CardTitle";let c=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("p",{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",s),...a})});c.displayName="CardDescription";let d=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("p-6 pt-0",s),...a})});d.displayName="CardContent",a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("div",{ref:t,className:(0,i.cn)("flex items-center p-6 pt-0",s),...a})}).displayName="CardFooter"},1978:(e,t,s)=>{"use strict";s.d(t,{d:()=>r.dj,o:()=>r.oR});var r=s(4725)},2817:(e,t,s)=>{"use strict";s.d(t,{A:()=>i});var r=s(7876),a=s(4522);let i=e=>{let{title:t,subtitle:s,children:i}=e;return(0,r.jsxs)("div",{className:"container mx-auto px-6",children:[(0,r.jsxs)(a.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,r.jsx)("h1",{className:"text-5xl font-medium mb-4",children:t}),(0,r.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:s})]}),(0,r.jsx)(a.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:i})]})}},2898:(e,t,s)=>{"use strict";s.d(t,{A:()=>o});var r=s(7876),a=s(7328),i=s.n(a),n=s(9099);let o=e=>{let{title:t,description:s}=e,a=(0,n.useRouter)(),o="https://roboticspec.com".concat(a.asPath);return(0,r.jsxs)(i(),{children:[(0,r.jsx)("title",{children:t}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.png"}),s&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("meta",{name:"description",content:s}),(0,r.jsx)("meta",{property:"og:description",content:s})]}),(0,r.jsx)("meta",{name:"keywords",content:"PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects"}),(0,r.jsx)("meta",{name:"author",content:"PEC Robotics Society"}),(0,r.jsx)("meta",{property:"og:title",content:t}),(0,r.jsx)("meta",{property:"og:image",content:"/logo.png"}),(0,r.jsx)("meta",{property:"og:type",content:"website"}),(0,r.jsx)("meta",{property:"og:url",content:o}),(0,r.jsx)("link",{rel:"canonical",href:o})]})}},5276:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/contact",function(){return s(7530)}])},7530:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>f});var r=s(7876),a=s(4232),i=s(4522),n=s(727),o=s(7041),l=s(8971),c=s(7739),d=s(4398),u=s(1978),m=s(2817),x=s(7341),p=s(2898);let f=()=>{let{toast:e}=(0,u.d)(),[t,s]=(0,d.mN)("meoebydn");return(0,a.useEffect)(()=>{t.succeeded&&e({title:"Message Sent",description:"Thank you for reaching out! We will get back to you soon."})},[t.succeeded,e]),(0,r.jsxs)(x.A,{children:[(0,r.jsx)(p.A,{title:"Robotics Society | Punjab Engineering College",description:"Contact the Robotics Society at Punjab Engineering College. Get in touch with our team for collaborations, sponsorships, or any queries."}),(0,r.jsx)("section",{className:"py-24",id:"contact",children:(0,r.jsx)(m.A,{title:"Contact Us",subtitle:"Get in touch with our team",children:(0,r.jsx)("div",{className:"grid grid-cols-1 gap-12 lg:max-w-[50%] mx-auto justify-center",children:(0,r.jsx)(i.P.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.5},children:(0,r.jsxs)(n.Zp,{className:"glass-card p-8",children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold mb-6",children:"Send us a Message"}),t.succeeded?(0,r.jsx)("p",{className:"text-green-600 text-lg",children:"Thank you for your message! We’ll get back to you soon."}):(0,r.jsxs)("form",{onSubmit:s,className:"space-y-6",children:[(0,r.jsx)(l.p,{placeholder:"Your Name",name:"name",required:!0,className:"bg-white"}),(0,r.jsx)(l.p,{type:"email",placeholder:"Your Email",name:"email",required:!0,className:"bg-white"}),(0,r.jsx)(d.yI,{prefix:"Email",field:"email",errors:t.errors}),(0,r.jsx)(l.p,{placeholder:"Subject",name:"subject",required:!0,className:"bg-white"}),(0,r.jsx)(c.T,{placeholder:"Your Message",name:"message",required:!0,className:"min-h-[150px] bg-white"}),(0,r.jsx)(d.yI,{prefix:"Message",field:"message",errors:t.errors}),(0,r.jsx)(o.$,{type:"submit",className:"w-full  text-white",disabled:t.submitting,children:t.submitting?"Sending...":"Send Message"})]})]})})})})})]})}},7739:(e,t,s)=>{"use strict";s.d(t,{T:()=>n});var r=s(7876),a=s(4232),i=s(4317);let n=a.forwardRef((e,t)=>{let{className:s,...a}=e;return(0,r.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",s),ref:t,...a})});n.displayName="Textarea"},8971:(e,t,s)=>{"use strict";s.d(t,{p:()=>n});var r=s(7876),a=s(4232),i=s(4317);let n=a.forwardRef((e,t)=>{let{className:s,type:a,...n}=e;return(0,r.jsx)("input",{type:a,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",s),ref:t,...n})});n.displayName="Input"}},e=>{var t=t=>e(e.s=t);e.O(0,[522,92,491,495,341,636,593,792],()=>t(5276)),_N_E=e.O()}]);