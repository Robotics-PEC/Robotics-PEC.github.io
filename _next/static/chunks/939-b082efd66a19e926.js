"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[939],{727:(e,a,t)=>{t.d(a,{BT:()=>i,Wu:()=>o,ZB:()=>c,Zp:()=>n,aR:()=>r,wL:()=>m});var l=t(7876),s=t(4232),d=t(4317);let n=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("div",{ref:a,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",t),...s})});n.displayName="Card";let r=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("div",{ref:a,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",t),...s})});r.displayName="CardHeader";let c=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("h3",{ref:a,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",t),...s})});c.displayName="CardTitle";let i=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("p",{ref:a,className:(0,d.cn)("text-sm text-muted-foreground",t),...s})});i.displayName="CardDescription";let o=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("div",{ref:a,className:(0,d.cn)("p-6 pt-0",t),...s})});o.displayName="CardContent";let m=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("div",{ref:a,className:(0,d.cn)("flex items-center p-6 pt-0",t),...s})});m.displayName="CardFooter"},3939:(e,a,t)=>{t.r(a),t.d(a,{default:()=>h});var l=t(7876),s=t(4232),d=t(4522),n=t(8671),r=t(727),c=t(7041),i=t(3654),o=t(9652),m=t(7396);let x=(0,t(1713).A)("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);var p=t(4725),u=t(8070);let h=e=>{let{events:a}=e,[t,h]=(0,s.useState)(new Date),{toast:f}=(0,p.dj)(),y=(null==a?void 0:a.reduce((e,a)=>{let t=null==a?void 0:a.date;return e[t]||(e[t]=[]),e[t].push(a),e},{}))||[],g=y[t?(0,u.GP)(t,"yyyy-MM-dd"):""]||[],v=e=>{let a=new Date("".concat(null==e?void 0:e.date,"T").concat(null==e?void 0:e.time)),t=new Date(a.getTime()+72e5),l="https://calendar.google.com/calendar/render?action=TEMPLATE&text=".concat(encodeURIComponent(null==e?void 0:e.title),"&details=").concat(encodeURIComponent(null==e?void 0:e.description),"&location=").concat(encodeURIComponent(null==e?void 0:e.location),"&dates=").concat(a.toISOString().replace(/[-:]/g,"").split(".")[0],"Z/").concat(t.toISOString().replace(/[-:]/g,"").split(".")[0],"Z");window.open(l,"_blank"),f({title:"Event Added to Google Calendar",description:"".concat(null==e?void 0:e.title," has been added to your calendar")})},N=e=>{let a=new Date("".concat(null==e?void 0:e.date,"T").concat(null==e?void 0:e.time)),t=new Date(a.getTime()+72e5),l=new Blob([["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","SUMMARY:".concat(null==e?void 0:e.title),"DESCRIPTION:".concat(null==e?void 0:e.description),"LOCATION:".concat(null==e?void 0:e.location),"DTSTART:".concat(a.toISOString().replace(/[-:]/g,"").split(".")[0],"Z"),"DTEND:".concat(t.toISOString().replace(/[-:]/g,"").split(".")[0],"Z"),"END:VEVENT","END:VCALENDAR"].join("\n")],{type:"text/calendar;charset=utf-8"}),s=URL.createObjectURL(l),d=document.createElement("a");d.href=s,d.download="".concat(null==e?void 0:e.title,".ics"),document.body.appendChild(d),d.click(),document.body.removeChild(d),f({title:"Event Added to Apple Calendar",description:"".concat(null==e?void 0:e.title," has been downloaded as an ICS file")})},w=e=>!!y[(0,u.GP)(e,"yyyy-MM-dd")];return(0,l.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[(0,l.jsx)(d.P.div,{className:"md:col-span-1",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.5},children:(0,l.jsxs)(r.Zp,{className:"p-4 bg-white shadow-md rounded-lg w-full",children:[(0,l.jsx)(n.V,{mode:"single",selected:t,onSelect:h,className:"h-full w-full flex",classNames:{months:"flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",month:"space-y-4 w-full flex flex-col",table:"w-full h-full border-collapse space-y-1",head_row:"",row:"w-full mt-2"},modifiers:{hasEvent:e=>w(e)},modifiersStyles:{selected:{backgroundColor:"#2563eb"},hasEvent:{backgroundColor:"#e0f2fe",borderRadius:"0.375rem",fontWeight:"bold"}}}),(0,l.jsx)("div",{className:"mt-4 text-sm text-gray-500",children:(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"w-4 h-4 rounded-sm bg-blue-100 mr-2"}),(0,l.jsx)("span",{children:"Events scheduled"})]})})]})}),(0,l.jsx)(d.P.div,{className:"md:col-span-2",initial:{opacity:0,x:20},animate:{opacity:1,x:0},transition:{duration:.5,delay:.2},children:(0,l.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-md",children:[(0,l.jsx)("h2",{className:"text-xl font-semibold mb-4",children:t?(0,u.GP)(t,"MMMM d, yyyy"):"Select a date"}),g.length>0?(0,l.jsx)("div",{className:"space-y-4",children:g.map(e=>(0,l.jsxs)(d.P.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3},className:"border border-gray-200 rounded-lg p-4",children:[(0,l.jsx)("h3",{className:"text-lg font-medium mb-2",children:null==e?void 0:e.title}),(0,l.jsx)("p",{className:"text-gray-600 mb-3",children:null==e?void 0:e.description}),(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-2 mb-3",children:[(0,l.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,l.jsx)(i.A,{className:"h-4 w-4 mr-2"}),(0,l.jsx)("span",{children:null==e?void 0:e.time})]}),(0,l.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,l.jsx)(o.A,{className:"h-4 w-4 mr-2"}),(0,l.jsx)("span",{children:null==e?void 0:e.location})]}),(0,l.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,l.jsx)(m.A,{className:"h-4 w-4 mr-2"}),(0,l.jsxs)("span",{children:["Capacity: ",null==e?void 0:e.capacity]})]})]}),(0,l.jsxs)("div",{className:"grid grid-row max-sm:gap-6 md:flex md:space-x-2 lg:flex lg:space-x-2",children:[(0,l.jsxs)(c.$,{size:"sm",className:" text-white",onClick:()=>v(e),children:[(0,l.jsx)(x,{className:"h-4 w-4 mr-2"}),"Google Calendar"]}),(0,l.jsxs)(c.$,{size:"sm",className:"bg-gray-700 hover:bg-gray-800 text-white",onClick:()=>N(e),children:[(0,l.jsx)(x,{className:"h-4 w-4 mr-2"}),"Apple Calendar"]})]})]},null==e?void 0:e.id))}):(0,l.jsx)("div",{className:"text-center py-8 text-gray-500",children:t?"No events scheduled for this date":"Select a date to view events"})]})})]})}},8671:(e,a,t)=>{t.d(a,{V:()=>i});var l=t(7876);t(4232);var s=t(2963),d=t(6108),n=t(6120),r=t(4317),c=t(7041);function i(e){let{className:a,classNames:t,showOutsideDays:i=!0,...o}=e;return(0,l.jsx)(n.hv,{showOutsideDays:i,className:(0,r.cn)("p-3",a),classNames:{months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",month:"space-y-4",caption:"flex justify-center pt-1 relative items-center",caption_label:"text-sm font-medium",nav:"space-x-1 flex items-center",nav_button:(0,r.cn)((0,c.r)({variant:"outline"}),"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),nav_button_previous:"absolute left-1",nav_button_next:"absolute right-1",table:"w-full border-collapse space-y-1",head_row:"flex",head_cell:"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",row:"flex w-full mt-2",cell:"h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",day:(0,r.cn)((0,c.r)({variant:"ghost"}),"h-9 w-9 p-0 font-normal aria-selected:opacity-100"),day_range_end:"day-range-end",day_selected:"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",day_today:"bg-accent text-accent-foreground",day_outside:"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",day_disabled:"text-muted-foreground opacity-50",day_range_middle:"aria-selected:bg-accent aria-selected:text-accent-foreground",day_hidden:"invisible",...t},components:{IconLeft:e=>{let{...a}=e;return(0,l.jsx)(s.A,{className:"h-4 w-4"})},IconRight:e=>{let{...a}=e;return(0,l.jsx)(d.A,{className:"h-4 w-4"})}},...o})}i.displayName="Calendar"}}]);