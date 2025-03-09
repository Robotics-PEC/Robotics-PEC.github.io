(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[309],{727:(e,r,t)=>{"use strict";t.d(r,{BT:()=>d,Wu:()=>c,ZB:()=>o,Zp:()=>n,aR:()=>l});var s=t(7876),a=t(4232),i=t(4317);let n=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",t),...a})});n.displayName="Card";let l=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",t),...a})});l.displayName="CardHeader";let o=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("h3",{ref:r,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",t),...a})});o.displayName="CardTitle";let d=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("p",{ref:r,className:(0,i.cn)("text-sm text-muted-foreground",t),...a})});d.displayName="CardDescription";let c=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,i.cn)("p-6 pt-0",t),...a})});c.displayName="CardContent",a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:(0,i.cn)("flex items-center p-6 pt-0",t),...a})}).displayName="CardFooter"},1978:(e,r,t)=>{"use strict";t.d(r,{d:()=>s.dj,o:()=>s.oR});var s=t(4725)},2410:(e,r,t)=>{"use strict";t.d(r,{S:()=>s});let s=(0,t(156).UU)("https://bkbmdjdypixbskuvrkxi.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYm1kamR5cGl4YnNrdXZya3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTEwNjIsImV4cCI6MjA1Njk4NzA2Mn0.pR0Ol1kQscGuPlEubKVbcKmX-_bDO3R1WkSIbAekssU")},4768:(e,r,t)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin",function(){return t(5602)}])},5602:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>I});var s=t(7876),a=t(4232),i=t(7041),n=t(8971),l=t(9773),o=t(9518),d=t(4317);let c=(0,o.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),u=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)(l.b,{ref:r,className:(0,d.cn)(c(),t),...a})});u.displayName=l.b.displayName;var f=t(2347),p=t(9239),m=t(7897),x=t(2341),g=t(4725),h=t(9099),v=t(1978),b=t(2410),y=t(3426),N=t.n(y),j=t(5364);let w=async(e,r)=>{if(N().createHash("sha256").update(r).digest("hex")!=j.env.NEXT_PUBLIC_PASSWORD_HASH||e!=j.env.NEXT_PUBLIC_ADMIN_EMAIL){(0,v.o)({title:"Error",description:"Email or password is incorrect",variant:"destructive"});return}let{data:t,error:s}=await b.S.auth.signInWithPassword({email:e,password:r});if(s){console.log(s),(0,v.o)({title:"Error",description:"Failed to log in. Please try again.",variant:"destructive"});return}return JSON.parse(JSON.stringify(t))},k=()=>{let[e,r]=(0,a.useState)(""),[t,l]=(0,a.useState)(""),[o,d]=(0,a.useState)(!1),[c,v]=(0,a.useState)(!1),{toast:b}=(0,g.dj)(),y=(0,h.useRouter)(),N=async r=>{if(r.preventDefault(),!e){b({title:"Error",description:"Please enter your email",variant:"destructive"});return}if(!t){b({title:"Error",description:"Please enter your password",variant:"destructive"});return}try{v(!0);let r=await w(e,t);if(!r)throw Error();r&&(document.cookie="sb-access-token=".concat(r.session.access_token,"; path=/; Secure"),document.cookie="sb-refresh-token=".concat(r.session.refresh_token,"; path=/; Secure"),y.push("/admin/page")),setTimeout(()=>{b({title:"Success",description:"You have successfully logged in!"}),v(!1)},1500)}catch(e){b({title:"Error",description:"Failed to log in. Please try again.",variant:"destructive"}),v(!1)}};return(0,s.jsxs)("form",{onSubmit:N,className:"space-y-4",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(u,{htmlFor:"email",children:"Email"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("div",{className:"absolute left-3 top-3 text-gray-400",children:(0,s.jsx)(f.A,{size:16})}),(0,s.jsx)(n.p,{id:"email",type:"email",placeholder:"name@example.com",value:e,onChange:e=>r(e.target.value),className:"pl-10"})]})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)("div",{className:"flex justify-between items-center",children:(0,s.jsx)(u,{htmlFor:"password",children:"Password"})}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("div",{className:"absolute left-3 top-3 text-gray-400",children:(0,s.jsx)(p.A,{size:16})}),(0,s.jsx)(n.p,{id:"password",type:o?"text":"password",placeholder:"••••••••",value:t,onChange:e=>l(e.target.value),className:"pl-10"}),(0,s.jsx)(i.$,{type:"button",variant:"ghost",size:"icon",className:"absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600",onClick:()=>d(!o),children:o?(0,s.jsx)(m.A,{size:16}):(0,s.jsx)(x.A,{size:16})})]})]}),(0,s.jsx)(i.$,{type:"submit",className:"w-full",disabled:c,children:c?"Logging in...":"Log in"})]})};var _=t(727);let I=()=>(0,s.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4",children:(0,s.jsx)("div",{className:"w-full max-w-md",children:(0,s.jsxs)(_.Zp,{className:"border-none shadow-lg",children:[(0,s.jsxs)(_.aR,{className:"space-y-1 text-center",children:[(0,s.jsx)(_.ZB,{className:"text-2xl font-bold tracking-tight",children:"Welcome back"}),(0,s.jsx)(_.BT,{children:"Enter your credentials to access your account"})]}),(0,s.jsx)(_.Wu,{children:(0,s.jsx)(k,{})})]})})})},7041:(e,r,t)=>{"use strict";t.d(r,{$:()=>d,r:()=>o});var s=t(7876),a=t(4232),i=t(2987),n=t(9518),l=t(4317);let o=(0,n.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=a.forwardRef((e,r)=>{let{className:t,variant:a,size:n,asChild:d=!1,...c}=e,u=d?i.DX:"button";return(0,s.jsx)(u,{className:(0,l.cn)(o({variant:a,size:n,className:t})),ref:r,...c})});d.displayName="Button"},8971:(e,r,t)=>{"use strict";t.d(r,{p:()=>n});var s=t(7876),a=t(4232),i=t(4317);let n=a.forwardRef((e,r)=>{let{className:t,type:a,...n}=e;return(0,s.jsx)("input",{type:a,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",t),ref:r,...n})});n.displayName="Input"}},e=>{var r=r=>e(e.s=r);e.O(0,[513,156,741,636,593,792],()=>r(4768)),_N_E=e.O()}]);