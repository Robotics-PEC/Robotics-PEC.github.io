(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[787],{727:(e,t,a)=>{"use strict";a.d(t,{Zp:()=>o});var i=a(7876),n=a(4232),s=a(4317);let o=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...n})});o.displayName="Card",n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",a),...n})}).displayName="CardHeader",n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("h3",{ref:t,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",a),...n})}).displayName="CardTitle",n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",a),...n})}).displayName="CardDescription",n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",a),...n})}).displayName="CardContent",n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,i.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",a),...n})}).displayName="CardFooter"},729:(e,t,a)=>{"use strict";a.d(t,{A9:()=>s,KD:()=>n,dt:()=>i,x1:()=>o});let i=[{id:1,title:"CanSat",description:"CanSat by AAS is a mini satellite competition for educational purposes",image:"/projects/cansat.jpg",longDescription:"The CanSat competition by the American Astronautical Society (AAS) is an annual student design-build-launch competition that challenges teams to develop a small satellite system within a soda can-sized container. Participants must design a payload capable of executing a specific mission, including telemetry transmission, deployment mechanisms, and sensor data collection during descent. The competition simulates a real satellite mission, incorporating constraints on size, weight, and functionality. It fosters skills in engineering, programming, and teamwork while providing hands-on aerospace experience. CanSat is an excellent platform for students to gain practical knowledge in space technology and systems engineering.",category:"Aerospace",technologies:["Telemetry","Sensors","Embedded Systems"]},{id:2,title:"Robo Wars",description:"Robo Wars is a combat competition where robots fight for victory.",image:"/projects/robowars.jpg",longDescription:"Robo Wars is a thrilling combat robotics competition where teams design, build, and battle remote-controlled robots in an enclosed arena. The objective is to disable opponents using weapons, strategy, and durability while adhering to weight and safety regulations. These battles test engineering skills, innovation, and teamwork as participants develop robots with powerful weaponry like spinners, flippers, and hammers. Popular worldwide, Robo Wars fosters STEM learning by encouraging mechanical design, electronics, and programming. Events range from university contests to global championships, captivating audiences with intense robot duels. The competition showcases cutting-edge technology and pushes the boundaries of robotic combat engineering.",category:"Combat Robotics",technologies:["Mechanical Design","Electronics","Remote Control"]},{id:3,title:"Robotic Arm",description:"A mechanical arm mimicking human motion for automation and precision tasks.",image:"/projects/roboticarm.jpg",longDescription:"A robotic arm is a programmable mechanical device designed to mimic the movements of a human arm. It consists of interconnected segments, joints, and actuators that enable precise motion and manipulation of objects. Controlled via computers, sensors, or AI, robotic arms are widely used in industries such as manufacturing, healthcare, and space exploration. They perform tasks like welding, assembly, surgery, and material handling with high accuracy and efficiency. Advanced models incorporate machine learning and vision systems for autonomous operation. Robotic arms enhance productivity, reduce human effort in hazardous environments, and play a crucial role in automation and modern robotics.",category:"Automation",technologies:["AI","Control Systems","Sensors"]}],n=[{id:1,title:"Building from Scratch",description:"A hands-on event to help participants take the first step toward creating something amazing. Whether you have an idea or just want to build, this event will guide you in getting started.",date:"2025-03-06",time:"17:00",location:"L26-27, New Academic Block",capacity:100}],s=[{id:1,title:"Getting started with Git and Docker",description:"A introductory workshop on basics of Git and Docker with a little of C programming",date:"05/09/2024",participants:60},{id:2,title:"Introduction to CAD",description:"A introductory workshop on basics of CAD",date:"22/10/2024",participants:55},{id:3,title:"Python Programming for Machine Learning",description:"Introduction to Machine Learning using Python",date:"28/12/2024",participants:60}],o=[{id:1,firstName:"Lalit",lastName:"Kumar",role:"Secretary",image:"/team/lalitsir.png"},{id:2,firstName:"Shashank",lastName:"Agarwal",role:"Joint Secretary",image:"/team/shashanksir.jpg"}]},3332:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>E});var i=a(7876),n=a(7328),s=a.n(n),o=a(4522),r=a(727),c=a(3654),l=a(710),d=a(9652),m=a(7396),p=a(6625),g=a(283),h=a(4232),x=a(2963),u=a(6108),y=a(6895),f=a(4317),b=a(7041);function j(e){let{className:t,classNames:a,showOutsideDays:n=!0,...s}=e;return(0,i.jsx)(y.hv,{showOutsideDays:n,className:(0,f.cn)("p-3",t),classNames:{months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",month:"space-y-4",caption:"flex justify-center pt-1 relative items-center",caption_label:"text-sm font-medium",nav:"space-x-1 flex items-center",nav_button:(0,f.cn)((0,b.r)({variant:"outline"}),"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),nav_button_previous:"absolute left-1",nav_button_next:"absolute right-1",table:"w-full border-collapse space-y-1",head_row:"flex",head_cell:"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",row:"flex w-full mt-2",cell:"h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",day:(0,f.cn)((0,b.r)({variant:"ghost"}),"h-9 w-9 p-0 font-normal aria-selected:opacity-100"),day_range_end:"day-range-end",day_selected:"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",day_today:"bg-accent text-accent-foreground",day_outside:"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",day_disabled:"text-muted-foreground opacity-50",day_range_middle:"aria-selected:bg-accent aria-selected:text-accent-foreground",day_hidden:"invisible",...a},components:{IconLeft:e=>{let{...t}=e;return(0,i.jsx)(x.A,{className:"h-4 w-4"})},IconRight:e=>{let{...t}=e;return(0,i.jsx)(u.A,{className:"h-4 w-4"})}},...s})}j.displayName="Calendar";var w=a(5167),v=a(4725),N=a(8471);let C=e=>{let{events:t}=e,[a,n]=(0,h.useState)(new Date),{toast:s}=(0,v.dj)(),l=t.reduce((e,t)=>{let a=t.date;return e[a]||(e[a]=[]),e[a].push(t),e},{}),p=l[a?(0,N.GP)(a,"yyyy-MM-dd"):""]||[],g=e=>{let t=new Date("".concat(e.date,"T").concat(e.time)),a=new Date(t.getTime()+72e5),i="https://calendar.google.com/calendar/render?action=TEMPLATE&text=".concat(encodeURIComponent(e.title),"&details=").concat(encodeURIComponent(e.description),"&location=").concat(encodeURIComponent(e.location),"&dates=").concat(t.toISOString().replace(/[-:]/g,"").split(".")[0],"Z/").concat(a.toISOString().replace(/[-:]/g,"").split(".")[0],"Z");window.open(i,"_blank"),s({title:"Event Added to Google Calendar",description:"".concat(e.title," has been added to your calendar")})},x=e=>{let t=new Date("".concat(e.date,"T").concat(e.time)),a=new Date(t.getTime()+72e5),i=new Blob([["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","SUMMARY:".concat(e.title),"DESCRIPTION:".concat(e.description),"LOCATION:".concat(e.location),"DTSTART:".concat(t.toISOString().replace(/[-:]/g,"").split(".")[0],"Z"),"DTEND:".concat(a.toISOString().replace(/[-:]/g,"").split(".")[0],"Z"),"END:VEVENT","END:VCALENDAR"].join("\n")],{type:"text/calendar;charset=utf-8"}),n=URL.createObjectURL(i),o=document.createElement("a");o.href=n,o.download="".concat(e.title,".ics"),document.body.appendChild(o),o.click(),document.body.removeChild(o),s({title:"Event Added to Apple Calendar",description:"".concat(e.title," has been downloaded as an ICS file")})},u=e=>!!l[(0,N.GP)(e,"yyyy-MM-dd")];return(0,i.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[(0,i.jsx)(o.P.div,{className:"md:col-span-1",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.5},children:(0,i.jsxs)(r.Zp,{className:"p-4 bg-white shadow-md rounded-lg w-full",children:[(0,i.jsx)(j,{mode:"single",selected:a,onSelect:n,className:"h-full w-full flex",classNames:{months:"flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",month:"space-y-4 w-full flex flex-col",table:"w-full h-full border-collapse space-y-1",head_row:"",row:"w-full mt-2"},modifiers:{hasEvent:e=>u(e)},modifiersStyles:{selected:{backgroundColor:"#2563eb"},hasEvent:{backgroundColor:"#e0f2fe",borderRadius:"0.375rem",fontWeight:"bold"}}}),(0,i.jsx)("div",{className:"mt-4 text-sm text-gray-500",children:(0,i.jsxs)("div",{className:"flex items-center",children:[(0,i.jsx)("div",{className:"w-4 h-4 rounded-sm bg-blue-100 mr-2"}),(0,i.jsx)("span",{children:"Events scheduled"})]})})]})}),(0,i.jsx)(o.P.div,{className:"md:col-span-2",initial:{opacity:0,x:20},animate:{opacity:1,x:0},transition:{duration:.5,delay:.2},children:(0,i.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-md",children:[(0,i.jsx)("h2",{className:"text-xl font-semibold mb-4",children:a?(0,N.GP)(a,"MMMM d, yyyy"):"Select a date"}),p.length>0?(0,i.jsx)("div",{className:"space-y-4",children:p.map(e=>(0,i.jsxs)(o.P.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3},className:"border border-gray-200 rounded-lg p-4",children:[(0,i.jsx)("h3",{className:"text-lg font-medium mb-2",children:e.title}),(0,i.jsx)("p",{className:"text-gray-600 mb-3",children:e.description}),(0,i.jsxs)("div",{className:"grid grid-cols-2 gap-2 mb-3",children:[(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(c.A,{className:"h-4 w-4 mr-2"}),(0,i.jsx)("span",{children:e.time})]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(d.A,{className:"h-4 w-4 mr-2"}),(0,i.jsx)("span",{children:e.location})]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(m.A,{className:"h-4 w-4 mr-2"}),(0,i.jsxs)("span",{children:["Capacity: ",e.capacity]})]})]}),(0,i.jsxs)("div",{className:"grid grid-row max-sm:gap-6 md:flex md:space-x-2 lg:flex lg:space-x-2",children:[(0,i.jsxs)(b.$,{size:"sm",className:"bg-blue-500 hover:bg-blue-600 text-white",onClick:()=>g(e),children:[(0,i.jsx)(w.A,{className:"h-4 w-4 mr-2"}),"Google Calendar"]}),(0,i.jsxs)(b.$,{size:"sm",className:"bg-gray-700 hover:bg-gray-800 text-white",onClick:()=>x(e),children:[(0,i.jsx)(w.A,{className:"h-4 w-4 mr-2"}),"Apple Calendar"]})]})]},e.id))}):(0,i.jsx)("div",{className:"text-center py-8 text-gray-500",children:a?"No events scheduled for this date":"Select a date to view events"})]})})]})};var A=a(729);let E=()=>(0,i.jsxs)("div",{className:"min-h-screen flex flex-col bg-[#F6F6F7]",children:[(0,i.jsxs)(s(),{children:[(0,i.jsx)("title",{children:"Robotics Society | Punjab Engineering College"}),(0,i.jsx)("link",{rel:"icon",href:"/favicon.png"}),(0,i.jsx)("meta",{name:"description",content:"PEC Robotics Society at Punjab Engineering College is dedicated to innovation in robotics and automation. Explore our projects and join our team."}),(0,i.jsx)("meta",{name:"keywords",content:"PEC Robotics, Punjab Engineering College, Robotics Society, Innovation, Automation, Engineering Projects"}),(0,i.jsx)("meta",{name:"author",content:"PEC Robotics Society"}),(0,i.jsx)("meta",{property:"og:title",content:"PEC Robotics Society - Punjab Engineering College"}),(0,i.jsx)("meta",{property:"og:description",content:"Discover groundbreaking robotics projects and cutting-edge automation innovations at PEC Robotics Society."}),(0,i.jsx)("meta",{property:"og:image",content:"/images/robotics-banner.jpg"}),(0,i.jsx)("meta",{property:"og:type",content:"website"}),(0,i.jsx)("meta",{property:"og:url",content:"https://roboticspec.com"}),(0,i.jsx)("link",{rel:"canonical",href:"https://roboticspec.com"})]}),(0,i.jsx)(g.A,{}),(0,i.jsx)("main",{className:"flex-grow py-24",children:(0,i.jsxs)("div",{className:"container mx-auto px-6",children:[(0,i.jsxs)(o.P.div,{className:"text-center mb-16",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,i.jsx)("h1",{className:"text-5xl font-medium mb-4",children:"Upcoming Events"}),(0,i.jsx)("p",{className:"text-xl text-gray-600 max-w-2xl mx-auto",children:"Join us at our upcoming events and be part of our community."})]}),(0,i.jsx)(o.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.2},className:"mb-16",children:(0,i.jsx)(C,{events:A.KD})}),A.KD.length>0&&(0,i.jsxs)(o.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.4},children:[(0,i.jsx)("h2",{className:"text-2xl font-medium mb-6 text-center",children:"List View"}),(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:A.KD.map(e=>(0,i.jsx)(o.P.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5},whileHover:{y:-5},children:(0,i.jsx)(r.Zp,{className:"overflow-hidden hover:shadow-lg transition-all duration-300",children:(0,i.jsxs)("div",{className:"p-6",children:[(0,i.jsx)("h3",{className:"text-xl font-semibold mb-3",children:e.title}),(0,i.jsx)("p",{className:"text-gray-600 mb-4",children:e.description}),(0,i.jsxs)("div",{className:"space-y-2 mb-4",children:[(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(c.A,{className:"h-4 w-4 mr-2"}),(0,i.jsx)("span",{children:new Date(e.date).toLocaleDateString()})]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(l.A,{className:"h-4 w-4 mr-2"}),(0,i.jsx)("span",{children:e.time})]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(d.A,{className:"h-4 w-4 mr-2"}),(0,i.jsx)("span",{children:e.location})]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-gray-500",children:[(0,i.jsx)(m.A,{className:"h-4 w-4 mr-2"}),(0,i.jsxs)("span",{children:["Capacity: ",e.capacity]})]})]})]})})},e.id))})]})]})}),(0,i.jsx)(p.A,{})]})},4550:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/events",function(){return a(3332)}])}},e=>{var t=t=>e(e.s=t);e.O(0,[240,543,467,636,593,792],()=>t(4550)),_N_E=e.O()}]);