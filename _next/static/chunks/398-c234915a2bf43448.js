(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[398],{1902:function(e,t,r){!function(e,t){"use strict";function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function n(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach(function(t){i(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r,n,o=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null!=o){var i=[],a=!0,s=!1;try{for(o=o.call(e);!(a=(r=o.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){s=!0,n=e}finally{try{a||null==o.return||o.return()}finally{if(s)throw n}}return i}}(e,t)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if("Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return s(e,t)}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function c(){}function u(){}t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,u.resetWarningCache=c;var l,f,p=function(){function e(e,t,r,n,o,i){if("SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"!==i){var a=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var r={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:u,resetWarningCache:c};return r.PropTypes=r,r},d=(l=f={exports:{}},f.exports,l.exports=p(),f.exports),m=function(e){var r=t.useRef(e);return t.useEffect(function(){r.current=e},[e]),r.current},y=function(e){return null!==e&&"object"===o(e)},h="[object Object]",E=function e(t,r){if(!y(t)||!y(r))return t===r;var n=Array.isArray(t);if(n!==Array.isArray(r))return!1;var o=Object.prototype.toString.call(t)===h;if(o!==(Object.prototype.toString.call(r)===h))return!1;if(!o&&!n)return t===r;var i=Object.keys(t),a=Object.keys(r);if(i.length!==a.length)return!1;for(var s={},c=0;c<i.length;c+=1)s[i[c]]=!0;for(var u=0;u<a.length;u+=1)s[a[u]]=!0;var l=Object.keys(s);return l.length===i.length&&l.every(function(n){return e(t[n],r[n])})},g=function(e,t,r){return y(e)?Object.keys(e).reduce(function(o,a){var s=!y(t)||!E(e[a],t[a]);return r.includes(a)?(s&&console.warn("Unsupported prop change: options.".concat(a," is not a mutable property.")),o):s?n(n({},o||{}),{},i({},a,e[a])):o},null):null},b=function(e){if(null===e||y(e)&&"function"==typeof e.elements&&"function"==typeof e.createToken&&"function"==typeof e.createPaymentMethod&&"function"==typeof e.confirmCardPayment)return e;throw Error("Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.")},v=function(e){if(y(e)&&"function"==typeof e.then)return{tag:"async",stripePromise:Promise.resolve(e).then(b)};var t=b(e);return null===t?{tag:"empty"}:{tag:"sync",stripe:t}},S=t.createContext(null);S.displayName="ElementsContext";var C=function(e,t){if(!e)throw Error("Could not find Elements context; You need to wrap the part of your app that ".concat(t," in an <Elements> provider."));return e},O=t.createContext(null);O.displayName="CartElementContext";var _=function(e,t){if(!e)throw Error("Could not find Elements context; You need to wrap the part of your app that ".concat(t," in an <Elements> provider."));return e},w=function(e){var r=e.stripe,n=e.options,o=e.children,i=t.useMemo(function(){return v(r)},[r]),s=a(t.useState(null),2),c=s[0],u=s[1],l=a(t.useState(null),2),f=l[0],p=l[1],d=a(t.useState(function(){return{stripe:"sync"===i.tag?i.stripe:null,elements:"sync"===i.tag?i.stripe.elements(n):null}}),2),y=d[0],h=d[1];t.useEffect(function(){var e=!0,t=function(e){h(function(t){return t.stripe?t:{stripe:e,elements:e.elements(n)}})};return"async"!==i.tag||y.stripe?"sync"!==i.tag||y.stripe||t(i.stripe):i.stripePromise.then(function(r){r&&e&&t(r)}),function(){e=!1}},[i,y,n]);var E=m(r);t.useEffect(function(){null!==E&&E!==r&&console.warn("Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.")},[E,r]);var b=m(n);return t.useEffect(function(){if(y.elements){var e=g(n,b,["clientSecret","fonts"]);e&&y.elements.update(e)}},[n,b,y.elements]),t.useEffect(function(){var e=y.stripe;e&&e._registerWrapper&&e.registerAppInfo&&(e._registerWrapper({name:"react-stripe-js",version:"1.16.5"}),e.registerAppInfo({name:"react-stripe-js",version:"1.16.5",url:"https://stripe.com/docs/stripe-js/react"}))},[y.stripe]),t.createElement(S.Provider,{value:y},t.createElement(O.Provider,{value:{cart:c,setCart:u,cartState:f,setCartState:p}},o))};w.propTypes={stripe:d.any,options:d.object};var P=function(e){return C(t.useContext(S),e)},A=function(e){return _(t.useContext(O),e)},I=function(e){return(0,e.children)(P("mounts <ElementsConsumer>"))};I.propTypes={children:d.func.isRequired};var j=function(e,r,n){var o=!!n,i=t.useRef(n);t.useEffect(function(){i.current=n},[n]),t.useEffect(function(){if(!o||!e)return function(){};var t=function(){i.current&&i.current.apply(i,arguments)};return e.on(r,t),function(){e.off(r,t)}},[o,r,e,i])},T=function(e,r){var n="".concat(e.charAt(0).toUpperCase()+e.slice(1),"Element"),o=r?function(e){P("mounts <".concat(n,">")),A("mounts <".concat(n,">"));var r=e.id,o=e.className;return t.createElement("div",{id:r,className:o})}:function(r){var o,i=r.id,s=r.className,c=r.options,u=void 0===c?{}:c,l=r.onBlur,f=r.onFocus,p=r.onReady,d=r.onChange,y=r.onEscape,h=r.onClick,E=r.onLoadError,b=r.onLoaderStart,v=r.onNetworksChange,S=r.onCheckout,C=r.onLineItemClick,O=r.onConfirm,_=r.onCancel,w=r.onShippingAddressChange,I=r.onShippingRateChange,T=P("mounts <".concat(n,">")).elements,R=a(t.useState(null),2),k=R[0],F=R[1],x=t.useRef(null),N=t.useRef(null),D=A("mounts <".concat(n,">")),M=D.setCart,L=D.setCartState;j(k,"blur",l),j(k,"focus",f),j(k,"escape",y),j(k,"click",h),j(k,"loaderror",E),j(k,"loaderstart",b),j(k,"networkschange",v),j(k,"lineitemclick",C),j(k,"confirm",O),j(k,"cancel",_),j(k,"shippingaddresschange",w),j(k,"shippingratechange",I),"cart"===e?o=function(e){L(e),p&&p(e)}:p&&(o="payButton"===e?p:function(){p(k)}),j(k,"ready",o),j(k,"change","cart"===e?function(e){L(e),d&&d(e)}:d),j(k,"checkout","cart"===e?function(e){L(e),S&&S(e)}:S),t.useLayoutEffect(function(){if(null===x.current&&T&&null!==N.current){var t=T.create(e,u);"cart"===e&&M&&M(t),x.current=t,F(t),t.mount(N.current)}},[T,u,M]);var U=m(u);return t.useEffect(function(){if(x.current){var e=g(u,U,["paymentRequest"]);e&&x.current.update(e)}},[u,U]),t.useLayoutEffect(function(){return function(){x.current&&(x.current.destroy(),x.current=null)}},[]),t.createElement("div",{id:i,className:s,ref:N})};return o.propTypes={id:d.string,className:d.string,onChange:d.func,onBlur:d.func,onFocus:d.func,onReady:d.func,onEscape:d.func,onClick:d.func,onLoadError:d.func,onLoaderStart:d.func,onNetworksChange:d.func,onCheckout:d.func,onLineItemClick:d.func,onConfirm:d.func,onCancel:d.func,onShippingAddressChange:d.func,onShippingRateChange:d.func,options:d.object},o.displayName=n,o.__elementType=e,o},R="undefined"==typeof window,k=T("auBankAccount",R),F=T("card",R),x=T("cardNumber",R),N=T("cardExpiry",R),D=T("cardCvc",R),M=T("fpxBank",R),L=T("iban",R),U=T("idealBank",R),B=T("p24Bank",R),Y=T("epsBank",R),$=T("payment",R),W=T("payButton",R),K=T("paymentRequestButton",R),q=T("linkAuthentication",R),J=T("address",R),V=T("shippingAddress",R),z=T("cart",R),G=T("paymentMethodMessaging",R),Q=T("affirmMessage",R),Z=T("afterpayClearpayMessage",R);e.AddressElement=J,e.AffirmMessageElement=Q,e.AfterpayClearpayMessageElement=Z,e.AuBankAccountElement=k,e.CardCvcElement=D,e.CardElement=F,e.CardExpiryElement=N,e.CardNumberElement=x,e.CartElement=z,e.Elements=w,e.ElementsConsumer=I,e.EpsBankElement=Y,e.FpxBankElement=M,e.IbanElement=L,e.IdealBankElement=U,e.LinkAuthenticationElement=q,e.P24BankElement=B,e.PayButtonElement=W,e.PaymentElement=$,e.PaymentMethodMessagingElement=G,e.PaymentRequestButtonElement=K,e.ShippingAddressElement=V,e.useCartElement=function(){return A("calls useCartElement()").cart},e.useCartElementState=function(){return A("calls useCartElementState()").cartState},e.useElements=function(){return P("calls useElements()").elements},e.useStripe=function(){return P("calls useStripe()").stripe},Object.defineProperty(e,"__esModule",{value:!0})}(t,r(4232))},2152:(e,t,r)=>{r(2957)},2735:e=>{var t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,i=(e,t,r)=>new Promise((n,o)=>{var i=e=>{try{s(r.next(e))}catch(e){o(e)}},a=e=>{try{s(r.throw(e))}catch(e){o(e)}},s=e=>e.done?n(e.value):Promise.resolve(e.value).then(i,a);s((r=r.apply(e,t)).next())}),a={};((e,r)=>{for(var n in r)t(e,n,{get:r[n],enumerable:!0})})(a,{SubmissionError:()=>m,appendExtraData:()=>b,createClient:()=>O,getDefaultClient:()=>_,isSubmissionError:()=>d}),e.exports=((e,i,a,s)=>{if(i&&"object"==typeof i||"function"==typeof i)for(let c of n(i))o.call(e,c)||c===a||t(e,c,{get:()=>i[c],enumerable:!(s=r(i,c))||s.enumerable});return e})(t({},"__esModule",{value:!0}),a);var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,u=()=>navigator.webdriver||!!document.documentElement.getAttribute(function(e){if(e=String(e).replace(/[\t\n\f\r ]+/g,""),!c.test(e))throw TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");e+="==".slice(2-(3&e.length));for(var t,r,n,o="",i=0;i<e.length;)t=s.indexOf(e.charAt(i++))<<18|s.indexOf(e.charAt(i++))<<12|(r=s.indexOf(e.charAt(i++)))<<6|(n=s.indexOf(e.charAt(i++))),o+=64===r?String.fromCharCode(t>>16&255):64===n?String.fromCharCode(t>>16&255,t>>8&255):String.fromCharCode(t>>16&255,t>>8&255,255&t);return o}("d2ViZHJpdmVy"))||!!window.callPhantom||!!window._phantom,l=class{constructor(){this.loadedAt=Date.now(),this.webdriver=u()}data(){return{loadedAt:this.loadedAt,webdriver:this.webdriver}}},f=class{constructor(e){this.kind="success",this.next=e.next}},p=class{constructor(e,t){this.paymentIntentClientSecret=e,this.resubmitKey=t,this.kind="stripePluginPending"}};function d(e){return"error"===e.kind}var m=class{constructor(...e){var t;for(let r of(this.kind="error",this.formErrors=[],this.fieldErrors=new Map,e)){if(!r.field){this.formErrors.push({code:r.code&&r.code in y?r.code:"UNSPECIFIED",message:r.message});continue}let e=null!=(t=this.fieldErrors.get(r.field))?t:[];e.push({code:r.code&&r.code in h?r.code:"UNSPECIFIED",message:r.message}),this.fieldErrors.set(r.field,e)}}getFormErrors(){return[...this.formErrors]}getFieldErrors(e){var t;return null!=(t=this.fieldErrors.get(e))?t:[]}getAllFieldErrors(){return Array.from(this.fieldErrors)}},y={BLOCKED:"BLOCKED",EMPTY:"EMPTY",FILES_TOO_BIG:"FILES_TOO_BIG",FORM_NOT_FOUND:"FORM_NOT_FOUND",INACTIVE:"INACTIVE",NO_FILE_UPLOADS:"NO_FILE_UPLOADS",PROJECT_NOT_FOUND:"PROJECT_NOT_FOUND",TOO_MANY_FILES:"TOO_MANY_FILES"},h={REQUIRED_FIELD_EMPTY:"REQUIRED_FIELD_EMPTY",REQUIRED_FIELD_MISSING:"REQUIRED_FIELD_MISSING",STRIPE_CLIENT_ERROR:"STRIPE_CLIENT_ERROR",STRIPE_SCA_ERROR:"STRIPE_SCA_ERROR",TYPE_EMAIL:"TYPE_EMAIL",TYPE_NUMERIC:"TYPE_NUMERIC",TYPE_TEXT:"TYPE_TEXT"},E=e=>(function(e){e=String(e);for(var t,r,n,o,i="",a=0,c=e.length%3;a<e.length;){if((r=e.charCodeAt(a++))>255||(n=e.charCodeAt(a++))>255||(o=e.charCodeAt(a++))>255)throw TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");t=r<<16|n<<8|o,i+=s.charAt(t>>18&63)+s.charAt(t>>12&63)+s.charAt(t>>6&63)+s.charAt(63&t)}return c?i.slice(0,c-3)+"===".substring(c):i})(JSON.stringify(e)),g=e=>{let t="@formspree/core@3.0.4";return e?`${e} ${t}`:t};function b(e,t,r){e instanceof FormData?e.append(t,r):e[t]=r}var v=class{constructor(e={}){this.project=e.project,this.stripe=e.stripe,"undefined"!=typeof window&&(this.session=new l)}submitForm(e,t){return i(this,arguments,function*(e,t,r={}){let n=r.endpoint||"https://formspree.io",o=this.project?`${n}/p/${this.project}/f/${e}`:`${n}/f/${e}`,a={Accept:"application/json","Formspree-Client":g(r.clientName)};function s(e){return i(this,null,function*(){try{let t=yield(yield fetch(o,{method:"POST",mode:"cors",body:e instanceof FormData?e:JSON.stringify(e),headers:a})).json();if(null!==t&&"object"==typeof t){if("errors"in t&&Array.isArray(t.errors)&&t.errors.every(e=>"string"==typeof e.message)||"error"in t&&"string"==typeof t.error)return Array.isArray(t.errors)?new m(...t.errors):new m({message:t.error});if(function(e){if("stripe"in e&&"resubmitKey"in e&&"string"==typeof e.resubmitKey){let{stripe:t}=e;return"object"==typeof t&&null!=t&&"paymentIntentClientSecret"in t&&"string"==typeof t.paymentIntentClientSecret}return!1}(t))return new p(t.stripe.paymentIntentClientSecret,t.resubmitKey);if("next"in t&&"string"==typeof t.next)return new f({next:t.next})}return new m({message:"Unexpected response format"})}catch(e){return new m({message:e instanceof Error?e.message:`Unknown error while posting to Formspree: ${JSON.stringify(e)}`})}})}if(this.session&&(a["Formspree-Session-Data"]=E(this.session.data())),t instanceof FormData||(a["Content-Type"]="application/json"),this.stripe&&r.createPaymentMethod){let e=yield r.createPaymentMethod();if(e.error)return new m({code:"STRIPE_CLIENT_ERROR",field:"paymentMethod",message:"Error creating payment method"});b(t,"paymentMethod",e.paymentMethod.id);let n=yield s(t);if("error"===n.kind)return n;if("stripePluginPending"===n.kind){let e=yield this.stripe.handleCardAction(n.paymentIntentClientSecret);if(e.error)return new m({code:"STRIPE_CLIENT_ERROR",field:"paymentMethod",message:"Stripe SCA error"});t instanceof FormData?t.delete("paymentMethod"):delete t.paymentMethod,b(t,"paymentIntent",e.paymentIntent.id),b(t,"resubmitKey",n.resubmitKey);let r=yield s(t);return S(r),r}return n}let c=yield s(t);return S(c),c})}};function S(e){let{kind:t}=e;if("success"!==t&&"error"!==t)throw Error(`Unexpected submission result (kind: ${t})`)}var C,O=e=>new v(e),_=()=>(C||(C=O()),C)},2957:(e,t)=>{"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var n,o="https://js.stripe.com/v3",i=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,a="loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used",s=function(){for(var e=document.querySelectorAll('script[src^="'.concat(o,'"]')),t=0;t<e.length;t++){var r=e[t];if(i.test(r.src))return r}return null},c=function(e){var t=e&&!e.advancedFraudSignals?"?advancedFraudSignals=false":"",r=document.createElement("script");r.src="".concat(o).concat(t);var n=document.head||document.body;if(!n)throw Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return n.appendChild(r),r},u=function(e,t){e&&e._registerWrapper&&e._registerWrapper({name:"stripe-js",version:"1.54.2",startTime:t})},l=null,f=function(e,t,r){if(null===e)return null;var n=e.apply(void 0,t);return u(n,r),n},p=function(e){var t="invalid load parameters; expected object of shape\n\n    {advancedFraudSignals: boolean}\n\nbut received\n\n    ".concat(JSON.stringify(e),"\n");if(null===e||"object"!==r(e))throw Error(t);if(1===Object.keys(e).length&&"boolean"==typeof e.advancedFraudSignals)return e;throw Error(t)},d=!1},4398:(e,t,r)=>{"use strict";r.d(t,{mN:()=>c,yI:()=>a});var n=r(1902),o=r(4232),i=r(2735);function a(e){let{prefix:t,field:r,errors:n,...i}=e;if(null==n)return null;let a=r?n.getFieldErrors(r):n.getFormErrors();return 0===a.length?null:o.createElement("div",{...i},t?`${t} `:null,a.map(e=>e.message).join(", "))}r(2152);var s=o.createContext(null);function c(e,t={}){let[r,a]=(0,o.useState)(null),[u,l]=(0,o.useState)(null),[f,p]=(0,o.useState)(!1),[d,m]=(0,o.useState)(!1);if(!e)throw Error('You must provide a form key or hashid (e.g. useForm("myForm") or useForm("123xyz")');let y=function(e,t={}){let r=(0,o.useContext)(s)??{client:(0,i.getDefaultClient)()},{client:a=r.client,extraData:c,onError:u,onSuccess:l,origin:f}=t,{stripe:p}=a,d=(0,o.useMemo)(()=>p?.elements().getElement(n.CardElement),[p]);return async function(t){var r;let n="preventDefault"in(r=t)&&"function"==typeof r.preventDefault?function(e){e.preventDefault();let t=e.currentTarget;if("FORM"!=t.tagName)throw Error("submit was triggered for a non-form element");return new FormData(t)}(t):t;if("object"==typeof c)for(let[e,t]of Object.entries(c)){let r;void 0!==(r="function"==typeof t?await t():t)&&(0,i.appendExtraData)(n,e,r)}let o=await a.submitForm(e,n,{endpoint:f,clientName:"@formspree/react@2.5.4",createPaymentMethod:p&&d?()=>p.createPaymentMethod({type:"card",card:d,billing_details:function(e){let t={address:function(e){let t={};for(let[r,n]of[["address_line1","line1"],["address_line2","line2"],["address_city","city"],["address_country","country"],["address_state","state"],["address_postal_code","postal_code"]]){let o=e instanceof FormData?e.get(r):e[r];o&&"string"==typeof o&&(t[n]=o)}return t}(e)};for(let r of["name","email","phone"]){let n=e instanceof FormData?e.get(r):e[r];n&&"string"==typeof n&&(t[r]=n)}return t}(n)}):void 0});(0,i.isSubmissionError)(o)?u?.(o):l?.(o)}}(e,{client:t.client,extraData:t.data,onError(e){a(e),p(!1),m(!1)},onSuccess(e){a(null),l(e),p(!1),m(!0)},origin:t.endpoint});return[{errors:r,result:u,submitting:f,succeeded:d},async function(e){p(!0),await y(e)},function(){a(null),l(null),p(!1),m(!1)}]}}}]);