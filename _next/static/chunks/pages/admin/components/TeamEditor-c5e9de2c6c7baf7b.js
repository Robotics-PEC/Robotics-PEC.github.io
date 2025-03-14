(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[139],{301:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>x});var s=t(7876),r=t(4232),i=t(7041),l=t(457),c=t(4725),n=t(345),o=t(5104),d=t(2671),m=t(3022),u=t(1354),g=t(727),p=t(857),f=t(8860),h=t(4317);let v={id:"",firstName:"",lastName:"",role:"",image:""},x=()=>{let{toast:e}=(0,c.dj)(),[a,t]=(0,r.useState)([]),[x,N]=(0,r.useState)(v),[b,y]=(0,r.useState)(null),[j,w]=(0,r.useState)("");(0,r.useEffect)(()=>{let e=localStorage.getItem("teamMembersData");if(e)try{t(JSON.parse(e))}catch(e){console.error("Failed to parse saved team members data:",e)}(async()=>{t(await (0,f.fP)())})()},[]);let S=async()=>{if(!x.firstName||!x.lastName||!x.role||!x.image){e({title:"Error",description:"All Fields are required",variant:"destructive"});return}let{error:a}=await (0,f.dr)(x,j);a?e({title:a.name,description:a.message,variant:"destructive"}):e({title:"Success",description:"Team Member has been Added"}),t(e=>[...e,{...x}]),N(v)},k=async()=>{if(!b)return;t(e=>e.map(e=>e.id===b?x:e));let a=await (0,f.jy)(x,j);x.image="https://bkbmdjdypixbskuvrkxi.supabase.co/storage/v1/object/public/media/team/".concat(j),N(v),y(null),a?e({title:a.name,description:a.message,variant:"destructive"}):e({title:"Success",description:"Team Member has been Updated"})},A=async e=>{w(e.image.split("/").pop()),e.image=await (0,h.W6)(e.image),N(e),y(e.id)},C=async a=>{t(e=>e.filter(e=>e.id!==a.id)),204==(await (0,f.ly)(a)).status?e({title:"Member Removed Successfully",description:"".concat(a.firstName," ").concat(a.lastName," was successfully deleted")}):e({title:"Member Couldn't be deleted",description:"".concat(a.firstName," ").concat(a.lastName," unable to be deleted")}),b===a.id&&(y(null),N(v))};return(0,s.jsxs)("div",{className:"space-y-8",children:[(0,s.jsxs)(g.Zp,{className:"p-6",children:[(0,s.jsx)("h3",{className:"text-lg font-medium mb-4",children:b?"Edit Team Member":"Add New Team Member"}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,s.jsx)(p.A,{id:"firstName",htmlFor:"firstName",onChange:N,placeholder:"First Name",value:x.firstName,title:"First Name",type:"TEXT"}),(0,s.jsx)(p.A,{id:"lastName",htmlFor:"lastName",onChange:N,placeholder:"Last Name",value:x.lastName,title:"Last Name",type:"TEXT"})]}),(0,s.jsx)(p.A,{id:"image",htmlFor:"image",onChange:N,placeholder:"Upload your image",value:x.role,title:"Upload your Image",type:"IMAGE",setFileName:w}),(0,s.jsx)(p.A,{id:"role",htmlFor:"role",onChange:N,placeholder:"Website Head",value:x.role,title:"Role",type:"TEXT"}),b?(0,s.jsxs)("div",{className:"flex gap-2",children:[(0,s.jsxs)(i.$,{onClick:k,className:"flex-1",children:[(0,s.jsx)(n.A,{className:"h-4 w-4 mr-2"})," Update Member"]}),(0,s.jsx)(i.$,{variant:"destructive",onClick:()=>{y(null),N(v)},children:"Cancel"})]}):(0,s.jsxs)(i.$,{onClick:S,className:"w-full",children:[(0,s.jsx)(o.A,{className:"h-4 w-4 mr-2"})," Add Team Member"]})]})]}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsx)("h3",{className:"text-lg font-medium",children:"Current Team Members"}),0===a.length?(0,s.jsx)("p",{className:"text-gray-500 italic",children:"No team members added yet."}):(0,s.jsx)(l.nD,{type:"single",collapsible:!0,className:"w-full",children:a.map(e=>(0,s.jsxs)(l.As,{value:e.id,children:[(0,s.jsx)(l.$m,{children:(0,s.jsxs)("div",{className:"flex justify-between items-center w-full pr-4",children:[(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)(d.A,{className:"h-4 w-4 mr-2 text-gray-500"}),(0,s.jsxs)("span",{children:[e.firstName," ",e.lastName]})]}),(0,s.jsx)("span",{className:"text-sm text-gray-500 mr-4",children:e.role})]})}),(0,s.jsx)(l.ub,{children:(0,s.jsxs)("div",{className:"p-4 space-y-4",children:[(0,s.jsx)("div",{className:"flex gap-4",children:e.image&&(0,s.jsx)("img",{src:e.image,alt:"".concat(e.firstName," ").concat(e.lastName),className:"w-24 h-24 object-cover rounded-full"})}),(0,s.jsxs)("div",{className:"flex gap-2 justify-end",children:[(0,s.jsxs)(i.$,{size:"sm",variant:"outline",onClick:()=>A(e),children:[(0,s.jsx)(m.A,{className:"h-4 w-4 mr-1"})," Edit"]}),(0,s.jsxs)(i.$,{size:"sm",variant:"destructive",onClick:()=>C(e),children:[(0,s.jsx)(u.A,{className:"h-4 w-4 mr-1"})," Delete"]})]})]})})]},e.id))}),(0,s.jsxs)(i.$,{onClick:()=>{localStorage.setItem("teamMembersData",JSON.stringify(a)),e({title:"Changes saved",description:"Team members have been updated successfully."})},className:"w-full mt-4",children:[(0,s.jsx)(n.A,{className:"h-4 w-4 mr-2"})," Save All Changes"]})]})]})}},2671:(e,a,t)=>{"use strict";t.d(a,{A:()=>s});let s=(0,t(1713).A)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},5495:(e,a,t)=>{"use strict";t.d(a,{V6:()=>c,ts:()=>l,vS:()=>n});var s=t(4317),r=t(5263);let i=async e=>{let{data:a,error:t}=await r.S.storage.from("media").list(e);return t?(console.log(t),[]):null==a?void 0:a.map(e=>e.name)},l=async e=>{let a=await i(e),t=[];for(let s=0;s<a.length;s++){let{data:i}=r.S.storage.from("media").getPublicUrl("".concat(e,"/").concat(a[s]));t.push(i.publicUrl)}return t},c=async(e,a,t)=>{let i=a.split(".")[a.split(".").length-1],l="image/".concat(i),c=t.replace(/^data:image\/\w+;base64,/,""),n=(0,s.i)(c,l),o="".concat(e,"/").concat(a),{data:d,error:m}=await r.S.storage.from("media").upload(o,n,{contentType:l,upsert:!0});return m&&console.log(m),d},n=async e=>{let{data:a,error:t}=await r.S.storage.from("media").remove(e);if(t){console.log(t);return}return a}},7041:(e,a,t)=>{"use strict";t.d(a,{$:()=>o,r:()=>n});var s=t(7876),r=t(4232),i=t(2987),l=t(9518),c=t(4317);let n=(0,l.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),o=r.forwardRef((e,a)=>{let{className:t,variant:r,size:l,asChild:o=!1,...d}=e,m=o?i.DX:"button";return(0,s.jsx)(m,{className:(0,c.cn)(n({variant:r,size:l,className:t})),ref:a,...d})});o.displayName="Button"},8860:(e,a,t)=>{"use strict";t.d(a,{dr:()=>n,fP:()=>l,jy:()=>d,ly:()=>o});var s=t(5263),r=t(5495),i=t(4317);let l=async()=>{let{data:e,error:a}=await s.S.from("team").select("*");if(a&&console.log(a),!e)throw Error("Could not fetch Team Members");return JSON.parse(JSON.stringify(e))},c=async e=>{let{data:a,error:t}=await s.S.from("team").select().eq("id",e);if(t&&console.log(t),!a)throw Error("Project with this id doesn't exist");return JSON.parse(JSON.stringify(a[0]))},n=async(e,a)=>{await (0,r.V6)("team",a,e.image);let{data:t}=s.S.storage.from("media").getPublicUrl("team/".concat(a)),{id:i,...l}=e,{error:c}=await s.S.from("team").insert({...l,image:t.publicUrl});return c?(console.log(c),{error:c}):{error:null}},o=async e=>(await (0,r.vS)(["projects/".concat(e.image.split("/").pop())]),await s.S.from("team").delete().eq("id",e.id)),d=async(e,a)=>{let t=await c(e.id);await (0,r.vS)(["team/".concat(t.image.split("/").pop())]);let{id:l,...n}=e;if(!await (0,r.V6)("team",a,e.image))return Error("Image Upload Failed");let{data:o}=s.S.storage.from("media").getPublicUrl("team/".concat(a)),{error:d}=await s.S.from("team").update({...n,image:o.publicUrl}).eq("id",e.id);if(d){let e=await (0,i.W6)(t.image);await (0,r.V6)("projects",t.image.split("/").pop(),e),console.log(d)}return d}},9216:(e,a,t)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/components/TeamEditor",function(){return t(301)}])}},e=>{var a=a=>e(e.s=a);e.O(0,[352,361,466,875,546,314,896,425,636,593,792],()=>a(9216)),_N_E=e.O()}]);