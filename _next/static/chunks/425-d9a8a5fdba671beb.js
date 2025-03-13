"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[425],{53:(e,t,a)=>{a.d(t,{J:()=>d});var s=a(7876),l=a(4232),i=a(9773),r=a(9518),n=a(4317);let o=(0,r.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)(i.b,{ref:t,className:(0,n.cn)(o(),a),...l})});d.displayName=i.b.displayName},457:(e,t,a)=>{a.d(t,{$m:()=>c,As:()=>d,nD:()=>o,ub:()=>u});var s=a(7876),l=a(4232),i=a(8221),r=a(822),n=a(4317);let o=i.bL,d=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)(i.q7,{ref:t,className:(0,n.cn)("border-b",a),...l})});d.displayName="AccordionItem";let c=l.forwardRef((e,t)=>{let{className:a,children:l,...o}=e;return(0,s.jsx)(i.Y9,{className:"flex",children:(0,s.jsxs)(i.l9,{ref:t,className:(0,n.cn)("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",a),...o,children:[l,(0,s.jsx)(r.A,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]})})});c.displayName=i.l9.displayName;let u=l.forwardRef((e,t)=>{let{className:a,children:l,...r}=e;return(0,s.jsx)(i.UC,{ref:t,className:"overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",...r,children:(0,s.jsx)("div",{className:(0,n.cn)("pb-4 pt-0",a),children:l})})});u.displayName=i.UC.displayName},727:(e,t,a)=>{a.d(t,{BT:()=>d,Wu:()=>c,ZB:()=>o,Zp:()=>r,aR:()=>n,wL:()=>u});var s=a(7876),l=a(4232),i=a(4317);let r=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...l})});r.displayName="Card";let n=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",a),...l})});n.displayName="CardHeader";let o=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("h3",{ref:t,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",a),...l})});o.displayName="CardTitle";let d=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("p",{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...l})});d.displayName="CardDescription";let c=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("p-6 pt-0",a),...l})});c.displayName="CardContent";let u=l.forwardRef((e,t)=>{let{className:a,...l}=e;return(0,s.jsx)("div",{ref:t,className:(0,i.cn)("flex items-center p-6 pt-0",a),...l})});u.displayName="CardFooter"},857:(e,t,a)=>{a.d(t,{A:()=>y});var s=a(7876),l=a(4232),i=a(53),r=a(8971),n=a(2669),o=a(9688),d=a(7041),c=a(727),u=a(6257),m=a(7978),f=a(672);let x=e=>{let{id:t,onChange:a,setFileName:i}=e,[r,n]=(0,l.useState)(null),[x,h]=(0,l.useState)(!1),p=(0,l.useRef)(null),v=e=>{if(!e.type.match("image.*")){o.oR.error("Please select an image file");return}let s=new FileReader;s.onload=s=>{var l,r;(null===(l=s.target)||void 0===l?void 0:l.result)&&(i(e.name),a(e=>{var a;return{...e,[t]:null===(a=s.target)||void 0===a?void 0:a.result}}),n({name:e.name,base64:null===(r=s.target)||void 0===r?void 0:r.result}),o.oR.success('Image "'.concat(e.name,'" loaded successfully')))},s.onerror=()=>{o.oR.error("Error reading file")},s.readAsDataURL(e)},g=()=>{var e;null===(e=p.current)||void 0===e||e.click()};return(0,s.jsx)("div",{className:"w-full max-w-3xl mx-auto p-4",children:r?(0,s.jsxs)(c.Zp,{children:[(0,s.jsx)(c.aR,{className:"pb-2",children:(0,s.jsxs)("div",{className:"flex justify-between items-center",children:[(0,s.jsxs)(c.ZB,{className:"flex items-center gap-2 text-xl",children:[(0,s.jsx)(m.A,{size:20}),"Image Blob Viewer"]}),(0,s.jsx)(d.$,{variant:"ghost",size:"icon",onClick:()=>{n(null),p.current&&(p.current.value="")},children:(0,s.jsx)(f.A,{size:18})})]})}),(0,s.jsxs)(c.Wu,{className:"p-4 space-y-4",children:[(0,s.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,s.jsx)("p",{className:"text-sm font-medium",children:"File Name:"}),(0,s.jsx)("p",{className:"text-sm bg-muted p-2 rounded",children:r.name})]}),(0,s.jsx)("div",{className:"overflow-hidden rounded-md border bg-white flex justify-center",children:(0,s.jsx)("img",{src:r.base64,alt:r.name,className:"object-contain max-h-[300px] w-auto"})})]}),(0,s.jsx)(c.wL,{className:"flex justify-end p-4",children:(0,s.jsx)(d.$,{onClick:g,children:"Upload New Image"})})]}):(0,s.jsx)(c.Zp,{className:"border-2 border-dashed ".concat(x?"border-primary bg-primary/5":"border-muted-foreground/20"," transition-colors duration-200"),children:(0,s.jsx)(c.Wu,{className:"p-6",children:(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center min-h-[300px] cursor-pointer",onDragOver:e=>{e.preventDefault(),h(!0)},onDragLeave:e=>{e.preventDefault(),h(!1)},onDrop:e=>{var t;e.preventDefault(),h(!1);let a=null===(t=e.dataTransfer.files)||void 0===t?void 0:t[0];a&&v(a)},onClick:g,children:[(0,s.jsx)(u.A,{size:48,className:"text-muted-foreground mb-4"}),(0,s.jsx)("h3",{className:"text-xl font-semibold mb-2",children:"Upload Image"}),(0,s.jsx)("p",{className:"text-muted-foreground text-sm text-center mb-4",children:"Drag & drop an image here, or click to browse"}),(0,s.jsx)(d.$,{variant:"secondary",children:"Browse Files"}),(0,s.jsx)("input",{type:"file",accept:"image/*",className:"hidden",onChange:e=>{var t;let a=null===(t=e.target.files)||void 0===t?void 0:t[0];a&&v(a)},ref:p})]})})})})};var h=a(8070),p=a(6785),v=a(3654),g=a(4317),j=a(8671),N=a(2588);let b=e=>{let{date:t,setDate:a,className:i,placeholder:n="Select date"}=e,[o,c]=l.useState(t?(0,h.GP)(t,"dd/MM/yyyy"):""),[u,m]=l.useState(!1),[f,x]=l.useState(null);return l.useEffect(()=>{t&&c((0,h.GP)(t,"dd/MM/yyyy"))},[t]),(0,s.jsx)("div",{className:(0,g.cn)("relative",i),children:(0,s.jsxs)(N.AM,{open:u,onOpenChange:m,children:[(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsxs)("div",{className:"relative flex-1",children:[(0,s.jsx)(r.p,{type:"text",placeholder:n,value:o,onChange:e=>{let t=e.target.value;if(c(t),x(null),!t.trim()){a(void 0);return}if(10===t.length)try{let e=(0,p.qg)(t,"dd/MM/yyyy",new Date);(0,h.GP)(e,"dd/MM/yyyy")===t?(a(e),x(null)):x("Invalid date")}catch(e){x("Invalid format (DD/MM/YYYY)")}},className:(0,g.cn)("pl-3 pr-10 py-2",f?"border-red-500 focus-visible:ring-red-500":"")}),f&&(0,s.jsx)("div",{className:"text-red-500 text-xs mt-1 absolute",children:f})]}),(0,s.jsx)(N.Wv,{asChild:!0,children:(0,s.jsx)(d.$,{variant:"outline",className:(0,g.cn)("px-3 h-10 w-10 flex items-center justify-center"),onClick:()=>m(!0),children:(0,s.jsx)(v.A,{className:"h-4 w-4"})})})]}),(0,s.jsx)(N.hl,{className:"w-auto p-0",align:"end",children:(0,s.jsx)(j.V,{mode:"single",selected:t,onSelect:e=>{a(e),e?c((0,h.GP)(e,"dd/MM/yyyy")):c(""),m(!1),x(null)},initialFocus:!0,className:(0,g.cn)("p-3 pointer-events-auto border rounded-md shadow-md")})})]})})},y=e=>{let{htmlFor:t,title:a,id:l,onChange:o,placeholder:d,value:c,type:u,setFileName:m,date:f,setDate:h}=e;switch(u){case"TEXT":return(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(i.J,{htmlFor:t,children:a}),(0,s.jsx)(r.p,{id:l,value:c,onChange:e=>o(t=>({...t,[l]:e.target.value})),placeholder:d})]});case"IMAGE":return(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(i.J,{htmlFor:t,children:"Upload Image"}),(0,s.jsx)(x,{id:l,onChange:o,setFileName:m})]});case"MARKDOWN":return(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(i.J,{htmlFor:t,children:a}),(0,s.jsx)(n.default,{value:c,onChange:e=>o(t=>({...t,[l]:e})),placeholder:d})]});case"DATE":return(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(i.J,{htmlFor:t,children:a}),(0,s.jsx)(b,{date:f,setDate:h})]});default:return(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(i.J,{htmlFor:t,children:a}),(0,s.jsx)(r.p,{id:l,value:c,onChange:e=>o(t=>({...t,image:e.target.value})),placeholder:d})]})}}},1338:(e,t,a)=>{a.r(t),a.d(t,{default:()=>h});var s=a(7876),l=a(4723),i=a(8148),r=a(9015),n=a(7952),o=a(2689),d=a(9072),c=a(605),u=a(6882),m=a(7832),f=a(2196),x=a(7216);let h=e=>{let{editor:t,...a}=e;return t?(0,s.jsxs)(l.mM,{editor:t,tippyOptions:{duration:200,animation:"fade",offset:[0,10]},className:"editor-bubble-menu",...a,children:[(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleBold().run(),icon:(0,s.jsx)(r.A,{className:"h-4 w-4"}),tooltip:"Bold (⌘+B)",isActive:t.isActive("bold")}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleItalic().run(),icon:(0,s.jsx)(n.A,{className:"h-4 w-4"}),tooltip:"Italic (⌘+I)",isActive:t.isActive("italic")}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleCode().run(),icon:(0,s.jsx)(o.A,{className:"h-4 w-4"}),tooltip:"Code (⌘+E)",isActive:t.isActive("code")}),(0,s.jsx)("div",{className:"h-4 w-[1px] bg-border mx-1"}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleHeading({level:1}).run(),icon:(0,s.jsx)(d.A,{className:"h-4 w-4"}),tooltip:"Heading 1 (⌘+Alt+1)",isActive:t.isActive("heading",{level:1})}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleHeading({level:2}).run(),icon:(0,s.jsx)(c.A,{className:"h-4 w-4"}),tooltip:"Heading 2 (⌘+Alt+2)",isActive:t.isActive("heading",{level:2})}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleHeading({level:3}).run(),icon:(0,s.jsx)(u.A,{className:"h-4 w-4"}),tooltip:"Heading 3 (⌘+Alt+3)",isActive:t.isActive("heading",{level:3})}),(0,s.jsx)("div",{className:"h-4 w-[1px] bg-border mx-1"}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleBulletList().run(),icon:(0,s.jsx)(m.A,{className:"h-4 w-4"}),tooltip:"Bullet List (⌘+Shift+8)",isActive:t.isActive("bulletList")}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleOrderedList().run(),icon:(0,s.jsx)(f.A,{className:"h-4 w-4"}),tooltip:"Ordered List (⌘+Shift+7)",isActive:t.isActive("orderedList")}),(0,s.jsx)(i.default,{onClick:()=>t.chain().focus().toggleBlockquote().run(),icon:(0,s.jsx)(x.A,{className:"h-4 w-4"}),tooltip:"Blockquote (⌘+Shift+B)",isActive:t.isActive("blockquote")})]}):null}},2588:(e,t,a)=>{a.d(t,{AM:()=>n,Wv:()=>o,hl:()=>d});var s=a(7876),l=a(4232),i=a(3178),r=a(4317);let n=i.bL,o=i.l9,d=l.forwardRef((e,t)=>{let{className:a,align:l="center",sideOffset:n=4,...o}=e;return(0,s.jsx)(i.ZL,{children:(0,s.jsx)(i.UC,{ref:t,align:l,sideOffset:n,className:(0,r.cn)("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...o})})});d.displayName=i.UC.displayName},2669:(e,t,a)=>{a.r(t),a.d(t,{default:()=>c});var s=a(7876),l=a(4723),i=a(2561),r=a(452),n=a(4646),o=a(1338),d=a(5511);let c=e=>{let{value:t,onChange:a,placeholder:c}=e,u=(0,l.hG)({extensions:[i.A.configure({heading:{levels:[1,2,3]}}),r.A.configure({placeholder:c}),n.Ay],content:t,editorProps:{attributes:{class:"prose prose-lg max-w-none focus:outline-none"}},onUpdate:e=>{let{editor:t}=e;a(t.getHTML())}});return(0,s.jsx)("div",{className:"my-8 animate-fade-in",children:(0,s.jsxs)("div",{className:"bg-card rounded-xl shadow-sm overflow-hidden border border-border transition-all duration-300",children:[(0,s.jsx)(d.default,{editor:u}),u&&(0,s.jsx)(o.default,{editor:u}),(0,s.jsx)(l.$Z,{editor:u,className:"animate-slide-up"})]})})}},5511:(e,t,a)=>{a.r(t),a.d(t,{default:()=>N});var s=a(7876),l=a(4232),i=a(9986),r=a(3468),n=a(9015),o=a(7952),d=a(2689),c=a(9072),u=a(605),m=a(6882),f=a(7832),x=a(2196),h=a(7216),p=a(8148),v=a(6924),g=a(4317);let j=l.forwardRef((e,t)=>{let{className:a,orientation:l="horizontal",decorative:i=!0,...r}=e;return(0,s.jsx)(v.b,{ref:t,decorative:i,orientation:l,className:(0,g.cn)("shrink-0 bg-border","horizontal"===l?"h-[1px] w-full":"h-full w-[1px]",a),...r})});j.displayName=v.b.displayName;let N=e=>{let{editor:t}=e;return t?(0,s.jsxs)("div",{className:"flex items-center gap-1 p-2 overflow-x-auto bg-card border-b border-border",children:[(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().undo().run(),icon:(0,s.jsx)(i.A,{className:"h-4 w-4"}),tooltip:"Undo (ctrl+Z)"}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().redo().run(),icon:(0,s.jsx)(r.A,{className:"h-4 w-4"}),tooltip:"Redo (ctrl+Shift+Z)"}),(0,s.jsx)(j,{orientation:"vertical",className:"h-6 mx-1"}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleBold().run(),icon:(0,s.jsx)(n.A,{className:"h-4 w-4"}),tooltip:"Bold (ctrl+B)",isActive:t.isActive("bold")}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleItalic().run(),icon:(0,s.jsx)(o.A,{className:"h-4 w-4"}),tooltip:"Italic (ctrl+I)",isActive:t.isActive("italic")}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleCode().run(),icon:(0,s.jsx)(d.A,{className:"h-4 w-4"}),tooltip:"Code (ctrl+E)",isActive:t.isActive("code")}),(0,s.jsx)(j,{orientation:"vertical",className:"h-6 mx-1"}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleHeading({level:1}).run(),icon:(0,s.jsx)(c.A,{className:"h-4 w-4"}),tooltip:"Heading 1 (ctrl+Alt+1)",isActive:t.isActive("heading",{level:1})}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleHeading({level:2}).run(),icon:(0,s.jsx)(u.A,{className:"h-4 w-4"}),tooltip:"Heading 2 (ctrl+Alt+2)",isActive:t.isActive("heading",{level:2})}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleHeading({level:3}).run(),icon:(0,s.jsx)(m.A,{className:"h-4 w-4"}),tooltip:"Heading 3 (ctrl+Alt+3)",isActive:t.isActive("heading",{level:3})}),(0,s.jsx)(j,{orientation:"vertical",className:"h-6 mx-1"}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleBulletList().run(),icon:(0,s.jsx)(f.A,{className:"h-4 w-4"}),tooltip:"Bullet List (ctrl+Shift+8)",isActive:t.isActive("bulletList")}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleOrderedList().run(),icon:(0,s.jsx)(x.A,{className:"h-4 w-4"}),tooltip:"Ordered List (ctrl+Shift+7)",isActive:t.isActive("orderedList")}),(0,s.jsx)(p.default,{onClick:()=>t.chain().focus().toggleBlockquote().run(),icon:(0,s.jsx)(h.A,{className:"h-4 w-4"}),tooltip:"Blockquote (ctrl+Shift+B)",isActive:t.isActive("blockquote")}),(0,s.jsx)("div",{className:"flex-1"})]}):null}},8148:(e,t,a)=>{a.r(t),a.d(t,{default:()=>r});var s=a(7876);a(4232);var l=a(4317),i=a(1777);let r=e=>{let{onClick:t,icon:a,tooltip:r,isActive:n=!1}=e;return(0,s.jsx)(i.Bc,{delayDuration:300,children:(0,s.jsxs)(i.m_,{children:[(0,s.jsx)(i.k$,{asChild:!0,children:(0,s.jsx)("button",{onClick:t,className:(0,l.cn)("format-button",n&&"active"),type:"button",children:a})}),(0,s.jsx)(i.ZI,{side:"bottom",children:(0,s.jsx)("p",{className:"text-xs",children:r})})]})})}},8671:(e,t,a)=>{a.d(t,{V:()=>d});var s=a(7876);a(4232);var l=a(2963),i=a(6108),r=a(6120),n=a(4317),o=a(7041);function d(e){let{className:t,classNames:a,showOutsideDays:d=!0,...c}=e;return(0,s.jsx)(r.hv,{showOutsideDays:d,className:(0,n.cn)("p-3",t),classNames:{months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",month:"space-y-4",caption:"flex justify-center pt-1 relative items-center",caption_label:"text-sm font-medium",nav:"space-x-1 flex items-center",nav_button:(0,n.cn)((0,o.r)({variant:"outline"}),"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),nav_button_previous:"absolute left-1",nav_button_next:"absolute right-1",table:"w-full border-collapse space-y-1",head_row:"flex",head_cell:"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",row:"flex w-full mt-2",cell:"h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",day:(0,n.cn)((0,o.r)({variant:"ghost"}),"h-9 w-9 p-0 font-normal aria-selected:opacity-100"),day_range_end:"day-range-end",day_selected:"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",day_today:"bg-accent text-accent-foreground",day_outside:"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",day_disabled:"text-muted-foreground opacity-50",day_range_middle:"aria-selected:bg-accent aria-selected:text-accent-foreground",day_hidden:"invisible",...a},components:{IconLeft:e=>{let{...t}=e;return(0,s.jsx)(l.A,{className:"h-4 w-4"})},IconRight:e=>{let{...t}=e;return(0,s.jsx)(i.A,{className:"h-4 w-4"})}},...c})}d.displayName="Calendar"},8971:(e,t,a)=>{a.d(t,{p:()=>r});var s=a(7876),l=a(4232),i=a(4317);let r=l.forwardRef((e,t)=>{let{className:a,type:l,...r}=e;return(0,s.jsx)("input",{type:l,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...r})});r.displayName="Input"}}]);