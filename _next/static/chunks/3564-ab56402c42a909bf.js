"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3564],{452:(t,e,i)=>{i.d(e,{A:()=>r});var n=i(9492),s=i(1772),o=i(8306);let r=n.YY.create({name:"placeholder",addOptions:()=>({emptyEditorClass:"is-editor-empty",emptyNodeClass:"is-empty",placeholder:"Write something …",showOnlyWhenEditable:!0,considerAnyAsEmpty:!1,showOnlyCurrent:!0,includeChildren:!1}),addProseMirrorPlugins(){return[new s.k_({key:new s.hs("placeholder"),props:{decorations:({doc:t,selection:e})=>{var i;let n=this.editor.isEditable||!this.options.showOnlyWhenEditable,{anchor:s}=e,r=[];if(!n)return null;let{firstChild:l}=t.content,a=l&&l.type.isLeaf,p=l&&l.isAtom,d=!!this.options.considerAnyAsEmpty||l&&l.type.name===(null===(i=t.type.contentMatch.defaultType)||void 0===i?void 0:i.name),h=t.content.childCount<=1&&l&&d&&l.nodeSize<=2&&(!a||!p);return t.descendants((t,e)=>{let i=s>=e&&s<=e+t.nodeSize,n=!t.isLeaf&&!t.childCount;if((i||!this.options.showOnlyCurrent)&&n){let n=[this.options.emptyNodeClass];h&&n.push(this.options.emptyEditorClass);let s=o.NZ.node(e,e+t.nodeSize,{class:n.join(" "),"data-placeholder":"function"==typeof this.options.placeholder?this.options.placeholder({editor:this.editor,node:t,pos:e,hasAnchor:i}):this.options.placeholder});r.push(s)}return this.options.includeChildren}),o.zF.create(t,r)}}})]}})},2561:(t,e,i)=>{i.d(e,{A:()=>ty});var n=i(9492);let s=/^\s*>\s$/,o=n.bP.create({name:"blockquote",addOptions:()=>({HTMLAttributes:{}}),content:"block+",group:"block",defining:!0,parseHTML:()=>[{tag:"blockquote"}],renderHTML({HTMLAttributes:t}){return["blockquote",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setBlockquote:()=>({commands:t})=>t.wrapIn(this.name),toggleBlockquote:()=>({commands:t})=>t.toggleWrap(this.name),unsetBlockquote:()=>({commands:t})=>t.lift(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-b":()=>this.editor.commands.toggleBlockquote()}},addInputRules(){return[(0,n.tG)({find:s,type:this.type})]}}),r=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/,l=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g,a=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/,p=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g,d=n.CU.create({name:"bold",addOptions:()=>({HTMLAttributes:{}}),parseHTML(){return[{tag:"strong"},{tag:"b",getAttrs:t=>"normal"!==t.style.fontWeight&&null},{style:"font-weight=400",clearMark:t=>t.type.name===this.name},{style:"font-weight",getAttrs:t=>/^(bold(er)?|[5-9]\d{2,})$/.test(t)&&null}]},renderHTML({HTMLAttributes:t}){return["strong",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setBold:()=>({commands:t})=>t.setMark(this.name),toggleBold:()=>({commands:t})=>t.toggleMark(this.name),unsetBold:()=>({commands:t})=>t.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-b":()=>this.editor.commands.toggleBold(),"Mod-B":()=>this.editor.commands.toggleBold()}},addInputRules(){return[(0,n.OX)({find:r,type:this.type}),(0,n.OX)({find:a,type:this.type})]},addPasteRules(){return[(0,n.Zc)({find:l,type:this.type}),(0,n.Zc)({find:p,type:this.type})]}}),h="textStyle",u=/^\s*([-+*])\s$/,c=n.bP.create({name:"bulletList",addOptions:()=>({itemTypeName:"listItem",HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}),group:"block list",content(){return`${this.options.itemTypeName}+`},parseHTML:()=>[{tag:"ul"}],renderHTML({HTMLAttributes:t}){return["ul",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{toggleBulletList:()=>({commands:t,chain:e})=>this.options.keepAttributes?e().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes("listItem",this.editor.getAttributes(h)).run():t.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-8":()=>this.editor.commands.toggleBulletList()}},addInputRules(){let t=(0,n.tG)({find:u,type:this.type});return(this.options.keepMarks||this.options.keepAttributes)&&(t=(0,n.tG)({find:u,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:()=>this.editor.getAttributes(h),editor:this.editor})),[t]}}),m=/(^|[^`])`([^`]+)`(?!`)/,f=/(^|[^`])`([^`]+)`(?!`)/g,g=n.CU.create({name:"code",addOptions:()=>({HTMLAttributes:{}}),excludes:"_",code:!0,exitable:!0,parseHTML:()=>[{tag:"code"}],renderHTML({HTMLAttributes:t}){return["code",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setCode:()=>({commands:t})=>t.setMark(this.name),toggleCode:()=>({commands:t})=>t.toggleMark(this.name),unsetCode:()=>({commands:t})=>t.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-e":()=>this.editor.commands.toggleCode()}},addInputRules(){return[(0,n.OX)({find:m,type:this.type})]},addPasteRules(){return[(0,n.Zc)({find:f,type:this.type})]}});var y=i(1772);let v=/^```([a-z]+)?[\s\n]$/,b=/^~~~([a-z]+)?[\s\n]$/,M=n.bP.create({name:"codeBlock",addOptions:()=>({languageClassPrefix:"language-",exitOnTripleEnter:!0,exitOnArrowDown:!0,defaultLanguage:null,HTMLAttributes:{}}),content:"text*",marks:"",group:"block",code:!0,defining:!0,addAttributes(){return{language:{default:this.options.defaultLanguage,parseHTML:t=>{var e;let{languageClassPrefix:i}=this.options,n=[...(null===(e=t.firstElementChild)||void 0===e?void 0:e.classList)||[]].filter(t=>t.startsWith(i)).map(t=>t.replace(i,""))[0];return n||null},rendered:!1}}},parseHTML:()=>[{tag:"pre",preserveWhitespace:"full"}],renderHTML({node:t,HTMLAttributes:e}){return["pre",(0,n.KV)(this.options.HTMLAttributes,e),["code",{class:t.attrs.language?this.options.languageClassPrefix+t.attrs.language:null},0]]},addCommands(){return{setCodeBlock:t=>({commands:e})=>e.setNode(this.name,t),toggleCodeBlock:t=>({commands:e})=>e.toggleNode(this.name,"paragraph",t)}},addKeyboardShortcuts(){return{"Mod-Alt-c":()=>this.editor.commands.toggleCodeBlock(),Backspace:()=>{let{empty:t,$anchor:e}=this.editor.state.selection,i=1===e.pos;return!!t&&e.parent.type.name===this.name&&(!!i||!e.parent.textContent.length)&&this.editor.commands.clearNodes()},Enter:({editor:t})=>{if(!this.options.exitOnTripleEnter)return!1;let{state:e}=t,{selection:i}=e,{$from:n,empty:s}=i;if(!s||n.parent.type!==this.type)return!1;let o=n.parentOffset===n.parent.nodeSize-2,r=n.parent.textContent.endsWith("\n\n");return!!o&&!!r&&t.chain().command(({tr:t})=>(t.delete(n.pos-2,n.pos),!0)).exitCode().run()},ArrowDown:({editor:t})=>{if(!this.options.exitOnArrowDown)return!1;let{state:e}=t,{selection:i,doc:n}=e,{$from:s,empty:o}=i;if(!o||s.parent.type!==this.type||s.parentOffset!==s.parent.nodeSize-2)return!1;let r=s.after();return void 0!==r&&(n.nodeAt(r)?t.commands.command(({tr:t})=>(t.setSelection(y.LN.near(n.resolve(r))),!0)):t.commands.exitCode())}}},addInputRules(){return[(0,n.JJ)({find:v,type:this.type,getAttributes:t=>({language:t[1]})}),(0,n.JJ)({find:b,type:this.type,getAttributes:t=>({language:t[1]})})]},addProseMirrorPlugins(){return[new y.k_({key:new y.hs("codeBlockVSCodeHandler"),props:{handlePaste:(t,e)=>{if(!e.clipboardData||this.editor.isActive(this.type.name))return!1;let i=e.clipboardData.getData("text/plain"),n=e.clipboardData.getData("vscode-editor-data"),s=n?JSON.parse(n):void 0,o=null==s?void 0:s.mode;if(!i||!o)return!1;let{tr:r,schema:l}=t.state,a=l.text(i.replace(/\r\n?/g,"\n"));return r.replaceSelectionWith(this.type.create({language:o},a)),r.selection.$from.parent.type!==this.type&&r.setSelection(y.U3.near(r.doc.resolve(Math.max(0,r.selection.from-2)))),r.setMeta("paste",!0),t.dispatch(r),!0}}})]}}),k=n.bP.create({name:"doc",topNode:!0,content:"block+"});var w=i(788);class A{constructor(t,e){var i;this.editorView=t,this.cursorPos=null,this.element=null,this.timeout=-1,this.width=null!==(i=e.width)&&void 0!==i?i:1,this.color=!1===e.color?void 0:e.color||"black",this.class=e.class,this.handlers=["dragover","dragend","drop","dragleave"].map(e=>{let i=t=>{this[e](t)};return t.dom.addEventListener(e,i),{name:e,handler:i}})}destroy(){this.handlers.forEach(({name:t,handler:e})=>this.editorView.dom.removeEventListener(t,e))}update(t,e){null!=this.cursorPos&&e.doc!=t.state.doc&&(this.cursorPos>t.state.doc.content.size?this.setCursor(null):this.updateOverlay())}setCursor(t){t!=this.cursorPos&&(this.cursorPos=t,null==t?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let t,e,i=this.editorView.state.doc.resolve(this.cursorPos),n=!i.parent.inlineContent,s;if(n){let t=i.nodeBefore,e=i.nodeAfter;if(t||e){let i=this.editorView.nodeDOM(this.cursorPos-(t?t.nodeSize:0));if(i){let n=i.getBoundingClientRect(),o=t?n.bottom:n.top;t&&e&&(o=(o+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2),s={left:n.left,right:n.right,top:o-this.width/2,bottom:o+this.width/2}}}}if(!s){let t=this.editorView.coordsAtPos(this.cursorPos);s={left:t.left-this.width/2,right:t.left+this.width/2,top:t.top,bottom:t.bottom}}let o=this.editorView.dom.offsetParent;if(!this.element&&(this.element=o.appendChild(document.createElement("div")),this.class&&(this.element.className=this.class),this.element.style.cssText="position: absolute; z-index: 50; pointer-events: none;",this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle("prosemirror-dropcursor-block",n),this.element.classList.toggle("prosemirror-dropcursor-inline",!n),o&&(o!=document.body||"static"!=getComputedStyle(o).position)){let i=o.getBoundingClientRect();t=i.left-o.scrollLeft,e=i.top-o.scrollTop}else t=-pageXOffset,e=-pageYOffset;this.element.style.left=s.left-t+"px",this.element.style.top=s.top-e+"px",this.element.style.width=s.right-s.left+"px",this.element.style.height=s.bottom-s.top+"px"}scheduleRemoval(t){clearTimeout(this.timeout),this.timeout=setTimeout(()=>this.setCursor(null),t)}dragover(t){if(!this.editorView.editable)return;let e=this.editorView.posAtCoords({left:t.clientX,top:t.clientY}),i=e&&e.inside>=0&&this.editorView.state.doc.nodeAt(e.inside),n=i&&i.type.spec.disableDropCursor,s="function"==typeof n?n(this.editorView,e,t):n;if(e&&!s){let t=e.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let e=(0,w.Um)(this.editorView.state.doc,t,this.editorView.dragging.slice);null!=e&&(t=e)}this.setCursor(t),this.scheduleRemoval(5e3)}}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(t){t.target!=this.editorView.dom&&this.editorView.dom.contains(t.relatedTarget)||this.setCursor(null)}}let T=n.YY.create({name:"dropCursor",addOptions:()=>({color:"currentColor",width:1,class:void 0}),addProseMirrorPlugins(){return[function(t={}){return new y.k_({view:e=>new A(e,t)})}(this.options)]}});var C=i(6517),L=i(3656),H=i(8306);class S extends y.LN{constructor(t){super(t,t)}map(t,e){let i=t.resolve(e.map(this.head));return S.valid(i)?new S(i):y.LN.near(i)}content(){return L.Ji.empty}eq(t){return t instanceof S&&t.head==this.head}toJSON(){return{type:"gapcursor",pos:this.head}}static fromJSON(t,e){if("number"!=typeof e.pos)throw RangeError("Invalid input for GapCursor.fromJSON");return new S(t.resolve(e.pos))}getBookmark(){return new x(this.anchor)}static valid(t){let e=t.parent;if(e.isTextblock||!function(t){for(let e=t.depth;e>=0;e--){let i=t.index(e),n=t.node(e);if(0==i){if(n.type.spec.isolating)return!0;continue}for(let t=n.child(i-1);;t=t.lastChild){if(0==t.childCount&&!t.inlineContent||t.isAtom||t.type.spec.isolating)return!0;if(t.inlineContent)return!1}}return!0}(t)||!function(t){for(let e=t.depth;e>=0;e--){let i=t.indexAfter(e),n=t.node(e);if(i==n.childCount){if(n.type.spec.isolating)return!0;continue}for(let t=n.child(i);;t=t.firstChild){if(0==t.childCount&&!t.inlineContent||t.isAtom||t.type.spec.isolating)return!0;if(t.inlineContent)return!1}}return!0}(t))return!1;let i=e.type.spec.allowGapCursor;if(null!=i)return i;let n=e.contentMatchAt(t.index()).defaultType;return n&&n.isTextblock}static findGapCursorFrom(t,e,i=!1){t:for(;;){if(!i&&S.valid(t))return t;let n=t.pos,s=null;for(let i=t.depth;;i--){let o=t.node(i);if(e>0?t.indexAfter(i)<o.childCount:t.index(i)>0){s=o.child(e>0?t.indexAfter(i):t.index(i)-1);break}if(0==i)return null;n+=e;let r=t.doc.resolve(n);if(S.valid(r))return r}for(;;){let o=e>0?s.firstChild:s.lastChild;if(!o){if(s.isAtom&&!s.isText&&!y.nh.isSelectable(s)){t=t.doc.resolve(n+s.nodeSize*e),i=!1;continue t}break}s=o,n+=e;let r=t.doc.resolve(n);if(S.valid(r))return r}return null}}}S.prototype.visible=!1,S.findFrom=S.findGapCursorFrom,y.LN.jsonID("gapcursor",S);class x{constructor(t){this.pos=t}map(t){return new x(t.map(this.pos))}resolve(t){let e=t.resolve(this.pos);return S.valid(e)?new S(e):y.LN.near(e)}}let I=(0,C.K)({ArrowLeft:O("horiz",-1),ArrowRight:O("horiz",1),ArrowUp:O("vert",-1),ArrowDown:O("vert",1)});function O(t,e){let i="vert"==t?e>0?"down":"up":e>0?"right":"left";return function(t,n,s){let o=t.selection,r=e>0?o.$to:o.$from,l=o.empty;if(o instanceof y.U3){if(!s.endOfTextblock(i)||0==r.depth)return!1;l=!1,r=t.doc.resolve(e>0?r.after():r.before())}let a=S.findGapCursorFrom(r,e,l);return!!a&&(n&&n(t.tr.setSelection(new S(a))),!0)}}function P(t,e,i){if(!t||!t.editable)return!1;let n=t.state.doc.resolve(e);if(!S.valid(n))return!1;let s=t.posAtCoords({left:i.clientX,top:i.clientY});return!(s&&s.inside>-1&&y.nh.isSelectable(t.state.doc.nodeAt(s.inside)))&&(t.dispatch(t.state.tr.setSelection(new S(n))),!0)}function E(t,e){if("insertCompositionText"!=e.inputType||!(t.state.selection instanceof S))return!1;let{$from:i}=t.state.selection,n=i.parent.contentMatchAt(i.index()).findWrapping(t.state.schema.nodes.text);if(!n)return!1;let s=L.FK.empty;for(let t=n.length-1;t>=0;t--)s=L.FK.from(n[t].createAndFill(null,s));let o=t.state.tr.replace(i.pos,i.pos,new L.Ji(s,0,0));return o.setSelection(y.U3.near(o.doc.resolve(i.pos+1))),t.dispatch(o),!1}function $(t){if(!(t.selection instanceof S))return null;let e=document.createElement("div");return e.className="ProseMirror-gapcursor",H.zF.create(t.doc,[H.NZ.widget(t.selection.head,e,{key:"gapcursor"})])}let _=n.YY.create({name:"gapCursor",addProseMirrorPlugins:()=>[new y.k_({props:{decorations:$,createSelectionBetween:(t,e,i)=>e.pos==i.pos&&S.valid(i)?new S(i):null,handleClick:P,handleKeyDown:I,handleDOMEvents:{beforeinput:E}}})],extendNodeSchema(t){var e;let i={name:t.name,options:t.options,storage:t.storage};return{allowGapCursor:null!==(e=(0,n.gk)((0,n.iI)(t,"allowGapCursor",i)))&&void 0!==e?e:null}}}),R=n.bP.create({name:"hardBreak",addOptions:()=>({keepMarks:!0,HTMLAttributes:{}}),inline:!0,group:"inline",selectable:!1,linebreakReplacement:!0,parseHTML:()=>[{tag:"br"}],renderHTML({HTMLAttributes:t}){return["br",(0,n.KV)(this.options.HTMLAttributes,t)]},renderText:()=>"\n",addCommands(){return{setHardBreak:()=>({commands:t,chain:e,state:i,editor:n})=>t.first([()=>t.exitCode(),()=>t.command(()=>{let{selection:t,storedMarks:s}=i;if(t.$from.parent.type.spec.isolating)return!1;let{keepMarks:o}=this.options,{splittableMarks:r}=n.extensionManager,l=s||t.$to.parentOffset&&t.$from.marks();return e().insertContent({type:this.name}).command(({tr:t,dispatch:e})=>{if(e&&l&&o){let e=l.filter(t=>r.includes(t.type.name));t.ensureMarks(e)}return!0}).run()})])}},addKeyboardShortcuts(){return{"Mod-Enter":()=>this.editor.commands.setHardBreak(),"Shift-Enter":()=>this.editor.commands.setHardBreak()}}}),B=n.bP.create({name:"heading",addOptions:()=>({levels:[1,2,3,4,5,6],HTMLAttributes:{}}),content:"inline*",group:"block",defining:!0,addAttributes:()=>({level:{default:1,rendered:!1}}),parseHTML(){return this.options.levels.map(t=>({tag:`h${t}`,attrs:{level:t}}))},renderHTML({node:t,HTMLAttributes:e}){let i=this.options.levels.includes(t.attrs.level)?t.attrs.level:this.options.levels[0];return[`h${i}`,(0,n.KV)(this.options.HTMLAttributes,e),0]},addCommands(){return{setHeading:t=>({commands:e})=>!!this.options.levels.includes(t.level)&&e.setNode(this.name,t),toggleHeading:t=>({commands:e})=>!!this.options.levels.includes(t.level)&&e.toggleNode(this.name,"paragraph",t)}},addKeyboardShortcuts(){return this.options.levels.reduce((t,e)=>({...t,[`Mod-Alt-${e}`]:()=>this.editor.commands.toggleHeading({level:e})}),{})},addInputRules(){return this.options.levels.map(t=>(0,n.JJ)({find:RegExp(`^(#{${Math.min(...this.options.levels)},${t}})\\s$`),type:this.type,getAttributes:{level:t}}))}});var N=function(){};N.prototype.append=function(t){return t.length?(t=N.from(t),!this.length&&t||t.length<200&&this.leafAppend(t)||this.length<200&&t.leafPrepend(this)||this.appendInner(t)):this},N.prototype.prepend=function(t){return t.length?N.from(t).append(this):this},N.prototype.appendInner=function(t){return new V(this,t)},N.prototype.slice=function(t,e){return(void 0===t&&(t=0),void 0===e&&(e=this.length),t>=e)?N.empty:this.sliceInner(Math.max(0,t),Math.min(this.length,e))},N.prototype.get=function(t){if(!(t<0)&&!(t>=this.length))return this.getInner(t)},N.prototype.forEach=function(t,e,i){void 0===e&&(e=0),void 0===i&&(i=this.length),e<=i?this.forEachInner(t,e,i,0):this.forEachInvertedInner(t,e,i,0)},N.prototype.map=function(t,e,i){void 0===e&&(e=0),void 0===i&&(i=this.length);var n=[];return this.forEach(function(e,i){return n.push(t(e,i))},e,i),n},N.from=function(t){return t instanceof N?t:t&&t.length?new Y(t):N.empty};var Y=function(t){function e(e){t.call(this),this.values=e}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var i={length:{configurable:!0},depth:{configurable:!0}};return e.prototype.flatten=function(){return this.values},e.prototype.sliceInner=function(t,i){return 0==t&&i==this.length?this:new e(this.values.slice(t,i))},e.prototype.getInner=function(t){return this.values[t]},e.prototype.forEachInner=function(t,e,i,n){for(var s=e;s<i;s++)if(!1===t(this.values[s],n+s))return!1},e.prototype.forEachInvertedInner=function(t,e,i,n){for(var s=e-1;s>=i;s--)if(!1===t(this.values[s],n+s))return!1},e.prototype.leafAppend=function(t){if(this.length+t.length<=200)return new e(this.values.concat(t.flatten()))},e.prototype.leafPrepend=function(t){if(this.length+t.length<=200)return new e(t.flatten().concat(this.values))},i.length.get=function(){return this.values.length},i.depth.get=function(){return 0},Object.defineProperties(e.prototype,i),e}(N);N.empty=new Y([]);var V=function(t){function e(e,i){t.call(this),this.left=e,this.right=i,this.length=e.length+i.length,this.depth=Math.max(e.depth,i.depth)+1}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},e.prototype.getInner=function(t){return t<this.left.length?this.left.get(t):this.right.get(t-this.left.length)},e.prototype.forEachInner=function(t,e,i,n){var s=this.left.length;if(e<s&&!1===this.left.forEachInner(t,e,Math.min(i,s),n)||i>s&&!1===this.right.forEachInner(t,Math.max(e-s,0),Math.min(this.length,i)-s,n+s))return!1},e.prototype.forEachInvertedInner=function(t,e,i,n){var s=this.left.length;if(e>s&&!1===this.right.forEachInvertedInner(t,e-s,Math.max(i,s)-s,n+s)||i<s&&!1===this.left.forEachInvertedInner(t,Math.min(e,s),i,n))return!1},e.prototype.sliceInner=function(t,e){if(0==t&&e==this.length)return this;var i=this.left.length;return e<=i?this.left.slice(t,e):t>=i?this.right.slice(t-i,e-i):this.left.slice(t,i).append(this.right.slice(0,e-i))},e.prototype.leafAppend=function(t){var i=this.right.leafAppend(t);if(i)return new e(this.left,i)},e.prototype.leafPrepend=function(t){var i=this.left.leafPrepend(t);if(i)return new e(i,this.right)},e.prototype.appendInner=function(t){return this.left.depth>=Math.max(this.right.depth,t.depth)+1?new e(this.left,new e(this.right,t)):new e(this,t)},e}(N);class K{constructor(t,e){this.items=t,this.eventCount=e}popEvent(t,e){let i,n,s,o;if(0==this.eventCount)return null;let r=this.items.length;for(;;r--)if(this.items.get(r-1).selection){--r;break}e&&(n=(i=this.remapping(r,this.items.length)).maps.length);let l=t.tr,a=[],p=[];return this.items.forEach((t,e)=>{if(!t.step){i||(n=(i=this.remapping(r,e+1)).maps.length),n--,p.push(t);return}if(i){p.push(new D(t.map));let e=t.step.map(i.slice(n)),s;e&&l.maybeStep(e).doc&&(s=l.mapping.maps[l.mapping.maps.length-1],a.push(new D(s,void 0,void 0,a.length+p.length))),n--,s&&i.appendMap(s,n)}else l.maybeStep(t.step);if(t.selection)return s=i?t.selection.map(i.slice(n)):t.selection,o=new K(this.items.slice(0,r).append(p.reverse().concat(a)),this.eventCount-1),!1},this.items.length,0),{remaining:o,transform:l,selection:s}}addTransform(t,e,i,n){var s,o;let r,l=[],a=this.eventCount,p=this.items,d=!n&&p.length?p.get(p.length-1):null;for(let i=0;i<t.steps.length;i++){let s=t.steps[i].invert(t.docs[i]),o=new D(t.mapping.maps[i],s,e),r;(r=d&&d.merge(o))&&(o=r,i?l.pop():p=p.slice(0,p.length-1)),l.push(o),e&&(a++,e=void 0),n||(d=o)}let h=a-i.depth;return h>q&&(s=p,o=h,s.forEach((t,e)=>{if(t.selection&&0==o--)return r=e,!1}),p=s.slice(r),a-=h),new K(p.append(l),a)}remapping(t,e){let i=new w.X9;return this.items.forEach((e,n)=>{let s=null!=e.mirrorOffset&&n-e.mirrorOffset>=t?i.maps.length-e.mirrorOffset:void 0;i.appendMap(e.map,s)},t,e),i}addMaps(t){return 0==this.eventCount?this:new K(this.items.append(t.map(t=>new D(t))),this.eventCount)}rebased(t,e){if(!this.eventCount)return this;let i=[],n=Math.max(0,this.items.length-e),s=t.mapping,o=t.steps.length,r=this.eventCount;this.items.forEach(t=>{t.selection&&r--},n);let l=e;this.items.forEach(e=>{let n=s.getMirror(--l);if(null==n)return;o=Math.min(o,n);let a=s.maps[n];if(e.step){let o=t.steps[n].invert(t.docs[n]),p=e.selection&&e.selection.map(s.slice(l+1,n));p&&r++,i.push(new D(a,o,p))}else i.push(new D(a))},n);let a=[];for(let t=e;t<o;t++)a.push(new D(s.maps[t]));let p=new K(this.items.slice(0,n).append(a).append(i),r);return p.emptyItemCount()>500&&(p=p.compress(this.items.length-i.length)),p}emptyItemCount(){let t=0;return this.items.forEach(e=>{!e.step&&t++}),t}compress(t=this.items.length){let e=this.remapping(0,t),i=e.maps.length,n=[],s=0;return this.items.forEach((o,r)=>{if(r>=t)n.push(o),o.selection&&s++;else if(o.step){let t=o.step.map(e.slice(i)),r=t&&t.getMap();if(i--,r&&e.appendMap(r,i),t){let l=o.selection&&o.selection.map(e.slice(i));l&&s++;let a=new D(r.invert(),t,l),p,d=n.length-1;(p=n.length&&n[d].merge(a))?n[d]=p:n.push(a)}}else o.map&&i--},this.items.length,0),new K(N.from(n.reverse()),s)}}K.empty=new K(N.empty,0);class D{constructor(t,e,i,n){this.map=t,this.step=e,this.selection=i,this.mirrorOffset=n}merge(t){if(this.step&&t.step&&!t.selection){let e=t.step.merge(this.step);if(e)return new D(e.getMap().invert(),e,this.selection)}}}class z{constructor(t,e,i,n,s){this.done=t,this.undone=e,this.prevRanges=i,this.prevTime=n,this.prevComposition=s}}let q=20;function G(t){let e=[];for(let i=t.length-1;i>=0&&0==e.length;i--)t[i].forEach((t,i,n,s)=>e.push(n,s));return e}function U(t,e){if(!t)return null;let i=[];for(let n=0;n<t.length;n+=2){let s=e.map(t[n],1),o=e.map(t[n+1],-1);s<=o&&i.push(s,o)}return i}let Q=!1,J=null;function j(t){let e=t.plugins;if(J!=e){Q=!1,J=e;for(let t=0;t<e.length;t++)if(e[t].spec.historyPreserveItems){Q=!0;break}}return Q}let F=new y.hs("history"),W=new y.hs("closeHistory");function X(t,e){return(i,n)=>{let s=F.getState(i);if(!s||0==(t?s.undone:s.done).eventCount)return!1;if(n){let o=function(t,e,i){let n=j(e),s=F.get(e).spec.config,o=(i?t.undone:t.done).popEvent(e,n);if(!o)return null;let r=o.selection.resolve(o.transform.doc),l=(i?t.done:t.undone).addTransform(o.transform,e.selection.getBookmark(),s,n),a=new z(i?l:o.remaining,i?o.remaining:l,null,0,-1);return o.transform.setSelection(r).setMeta(F,{redo:i,historyState:a})}(s,i,t);o&&n(e?o.scrollIntoView():o)}return!0}}let Z=X(!1,!0),tt=X(!0,!0);X(!1,!1),X(!0,!1);let te=n.YY.create({name:"history",addOptions:()=>({depth:100,newGroupDelay:500}),addCommands:()=>({undo:()=>({state:t,dispatch:e})=>Z(t,e),redo:()=>({state:t,dispatch:e})=>tt(t,e)}),addProseMirrorPlugins(){return[function(t={}){return t={depth:t.depth||100,newGroupDelay:t.newGroupDelay||500},new y.k_({key:F,state:{init:()=>new z(K.empty,K.empty,null,0,-1),apply:(e,i,n)=>(function(t,e,i,n){let s=i.getMeta(F),o;if(s)return s.historyState;i.getMeta(W)&&(t=new z(t.done,t.undone,null,0,-1));let r=i.getMeta("appendedTransaction");if(0==i.steps.length)return t;if(r&&r.getMeta(F))return r.getMeta(F).redo?new z(t.done.addTransform(i,void 0,n,j(e)),t.undone,G(i.mapping.maps),t.prevTime,t.prevComposition):new z(t.done,t.undone.addTransform(i,void 0,n,j(e)),null,t.prevTime,t.prevComposition);if(!1===i.getMeta("addToHistory")||r&&!1===r.getMeta("addToHistory"))return(o=i.getMeta("rebased"))?new z(t.done.rebased(i,o),t.undone.rebased(i,o),U(t.prevRanges,i.mapping),t.prevTime,t.prevComposition):new z(t.done.addMaps(i.mapping.maps),t.undone.addMaps(i.mapping.maps),U(t.prevRanges,i.mapping),t.prevTime,t.prevComposition);{let s=i.getMeta("composition"),o=0==t.prevTime||!r&&t.prevComposition!=s&&(t.prevTime<(i.time||0)-n.newGroupDelay||!function(t,e){if(!e)return!1;if(!t.docChanged)return!0;let i=!1;return t.mapping.maps[0].forEach((t,n)=>{for(let s=0;s<e.length;s+=2)t<=e[s+1]&&n>=e[s]&&(i=!0)}),i}(i,t.prevRanges)),l=r?U(t.prevRanges,i.mapping):G(i.mapping.maps);return new z(t.done.addTransform(i,o?e.selection.getBookmark():void 0,n,j(e)),K.empty,l,i.time,null==s?t.prevComposition:s)}})(i,n,e,t)},config:t,props:{handleDOMEvents:{beforeinput(t,e){let i=e.inputType,n="historyUndo"==i?Z:"historyRedo"==i?tt:null;return!!n&&(e.preventDefault(),n(t.state,t.dispatch))}}}})}(this.options)]},addKeyboardShortcuts(){return{"Mod-z":()=>this.editor.commands.undo(),"Shift-Mod-z":()=>this.editor.commands.redo(),"Mod-y":()=>this.editor.commands.redo(),"Mod-я":()=>this.editor.commands.undo(),"Shift-Mod-я":()=>this.editor.commands.redo()}}}),ti=n.bP.create({name:"horizontalRule",addOptions:()=>({HTMLAttributes:{}}),group:"block",parseHTML:()=>[{tag:"hr"}],renderHTML({HTMLAttributes:t}){return["hr",(0,n.KV)(this.options.HTMLAttributes,t)]},addCommands(){return{setHorizontalRule:()=>({chain:t,state:e})=>{let{selection:i}=e,{$from:s,$to:o}=i,r=t();return 0===s.parentOffset?r.insertContentAt({from:Math.max(s.pos-1,0),to:o.pos},{type:this.name}):(0,n.BQ)(i)?r.insertContentAt(o.pos,{type:this.name}):r.insertContent({type:this.name}),r.command(({tr:t,dispatch:e})=>{var i;if(e){let{$to:e}=t.selection,n=e.end();if(e.nodeAfter)e.nodeAfter.isTextblock?t.setSelection(y.U3.create(t.doc,e.pos+1)):e.nodeAfter.isBlock?t.setSelection(y.nh.create(t.doc,e.pos)):t.setSelection(y.U3.create(t.doc,e.pos));else{let s=null===(i=e.parent.type.contentMatch.defaultType)||void 0===i?void 0:i.create();s&&(t.insert(n,s),t.setSelection(y.U3.create(t.doc,n+1)))}t.scrollIntoView()}return!0}).run()}}},addInputRules(){return[(0,n.jT)({find:/^(?:---|—-|___\s|\*\*\*\s)$/,type:this.type})]}}),tn=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/,ts=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g,to=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/,tr=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g,tl=n.CU.create({name:"italic",addOptions:()=>({HTMLAttributes:{}}),parseHTML(){return[{tag:"em"},{tag:"i",getAttrs:t=>"normal"!==t.style.fontStyle&&null},{style:"font-style=normal",clearMark:t=>t.type.name===this.name},{style:"font-style=italic"}]},renderHTML({HTMLAttributes:t}){return["em",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setItalic:()=>({commands:t})=>t.setMark(this.name),toggleItalic:()=>({commands:t})=>t.toggleMark(this.name),unsetItalic:()=>({commands:t})=>t.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-i":()=>this.editor.commands.toggleItalic(),"Mod-I":()=>this.editor.commands.toggleItalic()}},addInputRules(){return[(0,n.OX)({find:tn,type:this.type}),(0,n.OX)({find:to,type:this.type})]},addPasteRules(){return[(0,n.Zc)({find:ts,type:this.type}),(0,n.Zc)({find:tr,type:this.type})]}}),ta=n.bP.create({name:"listItem",addOptions:()=>({HTMLAttributes:{},bulletListTypeName:"bulletList",orderedListTypeName:"orderedList"}),content:"paragraph block*",defining:!0,parseHTML:()=>[{tag:"li"}],renderHTML({HTMLAttributes:t}){return["li",(0,n.KV)(this.options.HTMLAttributes,t),0]},addKeyboardShortcuts(){return{Enter:()=>this.editor.commands.splitListItem(this.name),Tab:()=>this.editor.commands.sinkListItem(this.name),"Shift-Tab":()=>this.editor.commands.liftListItem(this.name)}}}),tp="textStyle",td=/^(\d+)\.\s$/,th=n.bP.create({name:"orderedList",addOptions:()=>({itemTypeName:"listItem",HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}),group:"block list",content(){return`${this.options.itemTypeName}+`},addAttributes:()=>({start:{default:1,parseHTML:t=>t.hasAttribute("start")?parseInt(t.getAttribute("start")||"",10):1},type:{default:void 0,parseHTML:t=>t.getAttribute("type")}}),parseHTML:()=>[{tag:"ol"}],renderHTML({HTMLAttributes:t}){let{start:e,...i}=t;return 1===e?["ol",(0,n.KV)(this.options.HTMLAttributes,i),0]:["ol",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{toggleOrderedList:()=>({commands:t,chain:e})=>this.options.keepAttributes?e().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes("listItem",this.editor.getAttributes(tp)).run():t.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-7":()=>this.editor.commands.toggleOrderedList()}},addInputRules(){let t=(0,n.tG)({find:td,type:this.type,getAttributes:t=>({start:+t[1]}),joinPredicate:(t,e)=>e.childCount+e.attrs.start===+t[1]});return(this.options.keepMarks||this.options.keepAttributes)&&(t=(0,n.tG)({find:td,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:t=>({start:+t[1],...this.editor.getAttributes(tp)}),joinPredicate:(t,e)=>e.childCount+e.attrs.start===+t[1],editor:this.editor})),[t]}}),tu=n.bP.create({name:"paragraph",priority:1e3,addOptions:()=>({HTMLAttributes:{}}),group:"block",content:"inline*",parseHTML:()=>[{tag:"p"}],renderHTML({HTMLAttributes:t}){return["p",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setParagraph:()=>({commands:t})=>t.setNode(this.name)}},addKeyboardShortcuts(){return{"Mod-Alt-0":()=>this.editor.commands.setParagraph()}}}),tc=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/,tm=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g,tf=n.CU.create({name:"strike",addOptions:()=>({HTMLAttributes:{}}),parseHTML:()=>[{tag:"s"},{tag:"del"},{tag:"strike"},{style:"text-decoration",consuming:!1,getAttrs:t=>!!t.includes("line-through")&&{}}],renderHTML({HTMLAttributes:t}){return["s",(0,n.KV)(this.options.HTMLAttributes,t),0]},addCommands(){return{setStrike:()=>({commands:t})=>t.setMark(this.name),toggleStrike:()=>({commands:t})=>t.toggleMark(this.name),unsetStrike:()=>({commands:t})=>t.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-s":()=>this.editor.commands.toggleStrike()}},addInputRules(){return[(0,n.OX)({find:tc,type:this.type})]},addPasteRules(){return[(0,n.Zc)({find:tm,type:this.type})]}}),tg=n.bP.create({name:"text",group:"inline"}),ty=n.YY.create({name:"starterKit",addExtensions(){var t,e,i,n,s,r,l,a,p,h,u,m,f,y,v,b,w,A;let C=[];return!1!==this.options.blockquote&&C.push(o.configure(null===(t=this.options)||void 0===t?void 0:t.blockquote)),!1!==this.options.bold&&C.push(d.configure(null===(e=this.options)||void 0===e?void 0:e.bold)),!1!==this.options.bulletList&&C.push(c.configure(null===(i=this.options)||void 0===i?void 0:i.bulletList)),!1!==this.options.code&&C.push(g.configure(null===(n=this.options)||void 0===n?void 0:n.code)),!1!==this.options.codeBlock&&C.push(M.configure(null===(s=this.options)||void 0===s?void 0:s.codeBlock)),!1!==this.options.document&&C.push(k.configure(null===(r=this.options)||void 0===r?void 0:r.document)),!1!==this.options.dropcursor&&C.push(T.configure(null===(l=this.options)||void 0===l?void 0:l.dropcursor)),!1!==this.options.gapcursor&&C.push(_.configure(null===(a=this.options)||void 0===a?void 0:a.gapcursor)),!1!==this.options.hardBreak&&C.push(R.configure(null===(p=this.options)||void 0===p?void 0:p.hardBreak)),!1!==this.options.heading&&C.push(B.configure(null===(h=this.options)||void 0===h?void 0:h.heading)),!1!==this.options.history&&C.push(te.configure(null===(u=this.options)||void 0===u?void 0:u.history)),!1!==this.options.horizontalRule&&C.push(ti.configure(null===(m=this.options)||void 0===m?void 0:m.horizontalRule)),!1!==this.options.italic&&C.push(tl.configure(null===(f=this.options)||void 0===f?void 0:f.italic)),!1!==this.options.listItem&&C.push(ta.configure(null===(y=this.options)||void 0===y?void 0:y.listItem)),!1!==this.options.orderedList&&C.push(th.configure(null===(v=this.options)||void 0===v?void 0:v.orderedList)),!1!==this.options.paragraph&&C.push(tu.configure(null===(b=this.options)||void 0===b?void 0:b.paragraph)),!1!==this.options.strike&&C.push(tf.configure(null===(w=this.options)||void 0===w?void 0:w.strike)),!1!==this.options.text&&C.push(tg.configure(null===(A=this.options)||void 0===A?void 0:A.text)),C}})},3468:(t,e,i)=>{i.d(e,{A:()=>n});let n=(0,i(1713).A)("Redo",[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]])},4646:(t,e,i)=>{i.d(e,{Ay:()=>L});var n=i(9492);let s=t=>(0,n.Yp)({find:/--$/,replace:null!=t?t:"—"}),o=t=>(0,n.Yp)({find:/\.\.\.$/,replace:null!=t?t:"…"}),r=t=>(0,n.Yp)({find:/(?:^|[\s{[(<'"\u2018\u201C])(")$/,replace:null!=t?t:"“"}),l=t=>(0,n.Yp)({find:/"$/,replace:null!=t?t:"”"}),a=t=>(0,n.Yp)({find:/(?:^|[\s{[(<'"\u2018\u201C])(')$/,replace:null!=t?t:"‘"}),p=t=>(0,n.Yp)({find:/'$/,replace:null!=t?t:"’"}),d=t=>(0,n.Yp)({find:/<-$/,replace:null!=t?t:"←"}),h=t=>(0,n.Yp)({find:/->$/,replace:null!=t?t:"→"}),u=t=>(0,n.Yp)({find:/\(c\)$/,replace:null!=t?t:"\xa9"}),c=t=>(0,n.Yp)({find:/\(tm\)$/,replace:null!=t?t:"™"}),m=t=>(0,n.Yp)({find:/\(sm\)$/,replace:null!=t?t:"℠"}),f=t=>(0,n.Yp)({find:/\(r\)$/,replace:null!=t?t:"\xae"}),g=t=>(0,n.Yp)({find:/(?:^|\s)(1\/2)\s$/,replace:null!=t?t:"\xbd"}),y=t=>(0,n.Yp)({find:/\+\/-$/,replace:null!=t?t:"\xb1"}),v=t=>(0,n.Yp)({find:/!=$/,replace:null!=t?t:"≠"}),b=t=>(0,n.Yp)({find:/<<$/,replace:null!=t?t:"\xab"}),M=t=>(0,n.Yp)({find:/>>$/,replace:null!=t?t:"\xbb"}),k=t=>(0,n.Yp)({find:/\d+\s?([*x])\s?\d+$/,replace:null!=t?t:"\xd7"}),w=t=>(0,n.Yp)({find:/\^2$/,replace:null!=t?t:"\xb2"}),A=t=>(0,n.Yp)({find:/\^3$/,replace:null!=t?t:"\xb3"}),T=t=>(0,n.Yp)({find:/(?:^|\s)(1\/4)\s$/,replace:null!=t?t:"\xbc"}),C=t=>(0,n.Yp)({find:/(?:^|\s)(3\/4)\s$/,replace:null!=t?t:"\xbe"}),L=n.YY.create({name:"typography",addInputRules(){let t=[];return!1!==this.options.emDash&&t.push(s(this.options.emDash)),!1!==this.options.ellipsis&&t.push(o(this.options.ellipsis)),!1!==this.options.openDoubleQuote&&t.push(r(this.options.openDoubleQuote)),!1!==this.options.closeDoubleQuote&&t.push(l(this.options.closeDoubleQuote)),!1!==this.options.openSingleQuote&&t.push(a(this.options.openSingleQuote)),!1!==this.options.closeSingleQuote&&t.push(p(this.options.closeSingleQuote)),!1!==this.options.leftArrow&&t.push(d(this.options.leftArrow)),!1!==this.options.rightArrow&&t.push(h(this.options.rightArrow)),!1!==this.options.copyright&&t.push(u(this.options.copyright)),!1!==this.options.trademark&&t.push(c(this.options.trademark)),!1!==this.options.servicemark&&t.push(m(this.options.servicemark)),!1!==this.options.registeredTrademark&&t.push(f(this.options.registeredTrademark)),!1!==this.options.oneHalf&&t.push(g(this.options.oneHalf)),!1!==this.options.plusMinus&&t.push(y(this.options.plusMinus)),!1!==this.options.notEqual&&t.push(v(this.options.notEqual)),!1!==this.options.laquo&&t.push(b(this.options.laquo)),!1!==this.options.raquo&&t.push(M(this.options.raquo)),!1!==this.options.multiplication&&t.push(k(this.options.multiplication)),!1!==this.options.superscriptTwo&&t.push(w(this.options.superscriptTwo)),!1!==this.options.superscriptThree&&t.push(A(this.options.superscriptThree)),!1!==this.options.oneQuarter&&t.push(T(this.options.oneQuarter)),!1!==this.options.threeQuarters&&t.push(C(this.options.threeQuarters)),t}})},6257:(t,e,i)=>{i.d(e,{A:()=>n});let n=(0,i(1713).A)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]])},6924:(t,e,i)=>{i.d(e,{b:()=>p});var n=i(4232),s=i(6326),o=i(7876),r="horizontal",l=["horizontal","vertical"],a=n.forwardRef((t,e)=>{var i;let{decorative:n,orientation:a=r,...p}=t,d=(i=a,l.includes(i))?a:r;return(0,o.jsx)(s.sG.div,{"data-orientation":d,...n?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"},...p,ref:e})});a.displayName="Separator";var p=a},7948:(t,e,i)=>{i.d(e,{Ay:()=>o});var n=i(9492);let s=/(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/,o=n.bP.create({name:"image",addOptions:()=>({inline:!1,allowBase64:!1,HTMLAttributes:{}}),inline(){return this.options.inline},group(){return this.options.inline?"inline":"block"},draggable:!0,addAttributes:()=>({src:{default:null},alt:{default:null},title:{default:null}}),parseHTML(){return[{tag:this.options.allowBase64?"img[src]":'img[src]:not([src^="data:"])'}]},renderHTML({HTMLAttributes:t}){return["img",(0,n.KV)(this.options.HTMLAttributes,t)]},addCommands(){return{setImage:t=>({commands:e})=>e.insertContent({type:this.name,attrs:t})}},addInputRules(){return[(0,n.jT)({find:s,type:this.type,getAttributes:t=>{let[,,e,i,n]=t;return{src:i,alt:e,title:n}}})]}})},7978:(t,e,i)=>{i.d(e,{A:()=>n});let n=(0,i(1713).A)("FileImage",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["circle",{cx:"10",cy:"12",r:"2",key:"737tya"}],["path",{d:"m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",key:"wt3hpn"}]])},9773:(t,e,i)=>{i.d(e,{b:()=>l});var n=i(4232),s=i(6326),o=i(7876),r=n.forwardRef((t,e)=>(0,o.jsx)(s.sG.label,{...t,ref:e,onMouseDown:e=>{e.target.closest("button, input, select, textarea")||(t.onMouseDown?.(e),!e.defaultPrevented&&e.detail>1&&e.preventDefault())}}));r.displayName="Label";var l=r},9986:(t,e,i)=>{i.d(e,{A:()=>n});let n=(0,i(1713).A)("Undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]])}}]);