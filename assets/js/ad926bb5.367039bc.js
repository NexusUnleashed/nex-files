"use strict";(self.webpackChunknexfiles=self.webpackChunknexfiles||[]).push([[5818],{6598:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>l,toc:()=>o});var r=t(4848),s=t(8453);const i={},a="API",l={id:"eventStream/api",title:"API",description:"stream",source:"@site/docs/eventStream/api.mdx",sourceDirName:"eventStream",slug:"/eventStream/api",permalink:"/nex-files/docs/eventStream/api",draft:!1,unlisted:!1,editUrl:"https://github.com/NexusUnleashed/nex-files/tree/main/docs/eventStream/api.mdx",tags:[],version:"current",frontMatter:{},sidebar:"eventStreamSidebar",previous:{title:"Installation",permalink:"/nex-files/docs/eventStream/installation"},next:{title:"Examples",permalink:"/nex-files/docs/eventStream/examples"}},c={},o=[{value:"stream",id:"stream",level:2},{value:"registerEvent",id:"registerevent",level:2},{value:"raiseEvent",id:"raiseevent",level:2},{value:"removeListener",id:"removelistener",level:2},{value:"purge",id:"purge",level:2}];function d(e){const n={blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components},{Details:t}=n;return t||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"api",children:"API"}),"\n",(0,r.jsx)(n.h2,{id:"stream",children:"stream"}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"stream"})," object holds the array of all registered events. Users can browse this object for all available events."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"eventStream.stream;\n"})}),"\n",(0,r.jsx)(n.h2,{id:"registerevent",children:"registerEvent"}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsx)("summary",{children:" Reference "}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"eventStream.registerEvent(event, callback, (once = false), (duration = false));\n"})}),(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Parameter"}),(0,r.jsx)(n.th,{children:"Type"}),(0,r.jsx)(n.th,{children:"Description"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"event"}),(0,r.jsx)(n.td,{children:"string"}),(0,r.jsxs)(n.td,{children:["Name of the event. ",(0,r.jsx)(n.em,{children:"example: GMCP.Item.Add"})]})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"callback"}),(0,r.jsx)(n.td,{children:"function"}),(0,r.jsx)(n.td,{children:"Callback function to fire when event is raised."})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"once"}),(0,r.jsx)(n.td,{children:"boolean"}),(0,r.jsx)(n.td,{children:"Listener will fire once and be removed (single fire)."})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"duration"}),(0,r.jsx)(n.td,{children:"miliseconds"}),(0,r.jsx)(n.td,{children:"Listener will be live and then removed after elapsed time."})]})]})]}),(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Users can register an anonymous function to the event. This can be useful for quick snippets or temporary event listeners."}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'eventStream.registerEvent("testEvent", () => {\r\n  console.log("arrow function");\r\n});\n'})}),(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Named functions can be more helpful for accessing the listener at a later time. Typically when a user wants to remove a listener from an event."}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'const testFunction = () => {\r\n  console.log("named arrow function");\r\n};\r\neventStream.registerEvent("testEvent", testFunction);\n'})}),(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Named functions can be more helpful for accessing the listener at a later time. Typically when a user wants to remove a listener from an event."}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'const singleFire = () => {\r\n  console.log("single fire event");\r\n};\r\neventStream.registerEvent("testEvent", testFunction, true);\r\n// Listener will only fire once after testEvent is raised. This listener will not be present for subsequent testEvent events.\n'})})]}),"\n",(0,r.jsx)(n.h2,{id:"raiseevent",children:"raiseEvent"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"eventStream.raiseEvent(event);\n"})}),"\n",(0,r.jsx)(n.p,{children:"Events are string ids used to flag all associated listener functions to fire. By default all GMCP received from the server are raised as events. Users can add any number of additional events."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'eventStream.raiseEvent("testEvent");\r\n/*\r\nExpected console output based on previous examples:\r\narrow function\r\nnamed arrow function\r\nsingle fire event\r\n*/\r\neventStream.raiseEvent("testEvent");\r\n/*\r\nExpected console output based on previous examples:\r\narrow function\r\nnamed arrow function\r\n*/\n'})}),"\n",(0,r.jsx)(n.h2,{id:"removelistener",children:"removeListener"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"eventStream.removeListener(event, callback id)\n"})}),"\n",(0,r.jsx)(n.p,{children:"Removes a listener from an event. Typical usage is by function name. Will also accept an integer representing the array position of the listener."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'eventStream.removeListener("testEvent", "testFunction");\r\neventStream.raiseEvent("testEvent");\r\n/*\r\nExpected console output based on previous examples:\r\narrow function\r\n*/\n'})}),"\n",(0,r.jsx)(n.h2,{id:"purge",children:"purge"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"eventStream.purge(event);\n"})}),"\n",(0,r.jsx)(n.p,{children:"Removes all listeners from an event."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'eventStream.purge("testEvent");\n'})})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>l});var r=t(6540);const s={},i=r.createContext(s);function a(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);