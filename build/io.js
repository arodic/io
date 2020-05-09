class ProtoChain extends Array{constructor(e){for(super();e&&e.constructor!==HTMLElement&&e.constructor!==Object&&e.constructor!==Array;)this.push(e),e=e.__proto__}}class ProtoFunctions extends Array{constructor(e){super();for(let t=e.length;t--;){const s=Object.getOwnPropertyNames(e[t]);for(let i=0;i<s.length;i++){if("constructor"===s[i])continue;const n=Object.getOwnPropertyDescriptor(e[t],s[i]);n.get||n.set||"function"==typeof e[t][s[i]]&&-1===this.indexOf(s[i])&&(s[i].startsWith("_")||s[i].startsWith("on"))&&this.push(s[i])}}}bind(e){for(let t=this.length;t--;)Object.defineProperty(e,this[t],{value:e[this[t]].bind(e)})}}class Binding{constructor(e,t){Object.defineProperty(this,"source",{value:e,configurable:!0}),Object.defineProperty(this,"sourceProp",{value:t,configurable:!0}),Object.defineProperty(this,"targets",{value:[],configurable:!0}),Object.defineProperty(this,"targetProps",{value:new WeakMap,configurable:!0}),this._onTargetChanged=this._onTargetChanged.bind(this),this._onSourceChanged=this._onSourceChanged.bind(this),this.source.addEventListener(this.sourceProp+"-changed",this._onSourceChanged)}set value(e){this.source[this.sourceProp]=e}get value(){return this.source[this.sourceProp]}addTarget(e,t){const s=e.__properties;if(s&&(s[t].binding=this,s.set(t,this.source[this.sourceProp])),-1===this.targets.indexOf(e)&&this.targets.push(e),this.targetProps.has(e)){const s=this.targetProps.get(e);-1===s.indexOf(t)&&(s.push(t),e.addEventListener(t+"-changed",this._onTargetChanged))}else this.targetProps.set(e,[t]),e.addEventListener(t+"-changed",this._onTargetChanged)}removeTarget(e,t){if(this.targetProps.has(e)){const s=this.targetProps.get(e);if(t){const i=s.indexOf(t);-1!==i&&s.splice(i,1),e.removeEventListener(t+"-changed",this._onTargetChanged)}else{for(let t=s.length;t--;)e.removeEventListener(s[t]+"-changed",this._onTargetChanged);s.length=0}0===s.length&&this.targets.splice(this.targets.indexOf(e),1)}}_onTargetChanged(e){if(-1===this.targets.indexOf(e.target))return;const t=this.source[this.sourceProp],s=e.detail.value;if(t!==s){if("number"==typeof s&&isNaN(s)&&"number"==typeof t&&isNaN(t))return;this.source[this.sourceProp]=s}}_onSourceChanged(e){if(e.target!=this.source)return;const t=e.detail.value;for(let e=this.targets.length;e--;){const s=this.targetProps.get(this.targets[e]);for(let i=s.length;i--;){const n=this.targets[e][s[i]];if(n!==t){if("number"==typeof t&&isNaN(t)&&"number"==typeof n&&isNaN(n))continue;this.targets[e][s[i]]=t}}}}dispose(){this.source.removeEventListener(this.sourceProp+"-changed",this._onSourceChanged);for(let e in this.targets)this.removeTarget(this.targets[e]),delete this.targets[e];delete this.source,delete this.sourceProp,delete this.targets,delete this.targetProps,delete this._onTargetChanged,delete this._onSourceChanged}}class Bindings{constructor(e){Object.defineProperty(this,"__node",{enumerable:!1,configurable:!0,value:e})}bind(e){return this[e]=this[e]||new Binding(this.__node,e),this[e]}unbind(e){this[e]&&this[e].dispose(),delete this[e]}dispose(){for(let e in this)this[e].dispose(),delete this[e];delete this.__node}}class Queue{constructor(e){Object.defineProperty(this,"__array",{enumerable:!1,configurable:!0,value:new Array}),Object.defineProperty(this,"__node",{enumerable:!1,configurable:!0,value:e})}queue(e,t,s){const i=this.__array.indexOf(e);-1===i?this.__array.push(e,{property:e,value:t,oldValue:s}):this.__array[i+1].value=t}dispatch(){if(!0===this._dispatchInProgress)return;if(!this.__node.__connected)return;this._dispatchInProgress=!0;const e=this.__node;let t=!1;for(;this.__array.length;){const s=this.__array.length-2,i=this.__array[s],n=this.__array[s+1],o={detail:n};n.value!==n.oldValue&&(t=!0,e[i+"Changed"]&&e[i+"Changed"](o),e.dispatchEvent(i+"-changed",o.detail)),this.__array.splice(s,2)}t&&e.dispatchChange(),this._dispatchInProgress=!1,this.__array.length&&this.dispatch()}dispose(){this.__array.length=0,delete this.__node,delete this.__array}}class ProtoProperty{constructor(e,t){return t||(this.value=void 0,this.type=void 0,this.notify=!0,this.reflect=0,this.observe=!1,this.strict=!1,this.enumerable=!0,this.binding=void 0),void 0===e||null===e?e={value:e}:"function"==typeof e?e={type:e}:e instanceof Binding?e={binding:e}:e&&e.constructor===Object||(e={value:e}),void 0===e.type&&void 0!==e.value&&null!==e.value&&(e.type=e.value.constructor),void 0!==e.value&&(this.value=e.value),"function"==typeof e.type&&(this.type=e.type),"boolean"==typeof e.notify&&(this.notify=e.notify),"number"==typeof e.reflect&&(this.reflect=e.reflect),"boolean"==typeof e.observe&&(this.observe=e.observe),"boolean"==typeof e.strict&&(this.strict=e.strict),"boolean"==typeof e.enumerable&&(this.enumerable=e.enumerable),e.binding instanceof Binding&&(this.binding=e.binding),this}}class Property{constructor(e){this.value=e.value,this.notify=e.notify,this.reflect=e.reflect,this.observe=e.observe,this.strict=e.strict,this.enumerable=e.enumerable,this.type=e.type,this.binding=e.binding,this.binding instanceof Binding?this.value=this.binding.value:void 0===this.value?"function"==typeof this.type&&(this.type===Boolean?this.value=!1:this.type===String?this.value="":this.type===Number?this.value=0:this.type===Array?this.value=[]:this.type===Object?this.value={}:this.value=new this.type):this.type===Array&&this.value instanceof Array?this.value=[...this.value]:this.type===Object&&this.value instanceof Object&&(this.value=Object.assign({},this.value))}}class ProtoProperties{constructor(e){for(let t=e.length;t--;){const s=e[t].constructor.Properties;for(let e in s)this[e]?Object.assign(this[e],new ProtoProperty(s[e],!0)):this[e]=new ProtoProperty(s[e]),"_"===e.charAt(0)&&(this[e].notify=!1,this[e].enumerable=!1)}}}class Properties{constructor(e,t){Object.defineProperty(this,"__node",{enumerable:!1,configurable:!0,value:e}),Object.defineProperty(this,"__connected",{enumerable:!1,writable:!0,value:!1});for(let s in t){Object.defineProperty(this,s,{value:new Property(t[s]),enumerable:t[s].enumerable,configurable:!0});const i=this[s].value;void 0!==i&&null!==i&&("object"==typeof i?(e.queue(s,i,void 0),i.__isNode&&e.__connected&&i.connect(e)):this[s].reflect>=1&&e.__isIoElement&&e.setAttribute(s,i));const n=this[s].binding;n&&n.addTarget(e,s)}Object.defineProperty(this,"__keys",{enumerable:!1,configurable:!0,value:Object.keys(this)})}get(e){return this[e].value}set(e,t,s){const i=this[e],n=i.value;if(t!==n){const o=this.__node,r=t instanceof Binding?t:void 0;if(r){const s=i.binding;s&&r!==s&&s.removeTarget(o,e),r.addTarget(o,e),t=r.source[r.sourceProp]}else!i.strict||!i.type||t instanceof i.type||(t=new i.type(t)),i.value=t;t&&t.__isNode&&!t.__isIoElement&&t.connect(o),n&&n.__isNode&&n.__connected&&!n.__isIoElement&&n.disconnect(o),i.notify&&n!==t&&(o.queue(e,t,n),o.__connected&&!s&&o.queueDispatch()),i.reflect>=1&&o.__isIoElement&&o.setAttribute(e,t)}}connect(){this.__connected=!0;for(let e=this.__keys.length;e--;){const t=this.__keys[e];this[t].binding&&this[t].binding.addTarget(this.__node,t),this[t].value&&this[t].value.__isNode&&!this[t].value.__connected&&!this[t].value.__isIoElement&&this[t].value.connect(this.__node)}}disconnect(){this.__connected=!1;for(let e=this.__keys.length;e--;){const t=this.__keys[e];this[t].binding&&this[t].binding.removeTarget(this.__node,t),this[t].value&&this[t].value.__isNode&&!this[t].value.__isIoElement&&this[t].value.disconnect(this.__node)}}dispose(){this.disconnect();for(let e=this.__keys.length;e--;){const t=this.__keys[e];this[t].binding&&(this[t].binding.removeTarget(this.__node,t),delete this[t].binding),delete this[t]}delete this.__node,delete this.__keys}}class ProtoListeners{constructor(e){for(let t=e.length;t--;){const s=e[t].constructor.Listeners;for(let e in s)this[e]=s[e]}}}class Listeners{constructor(e,t){Object.defineProperty(this,"node",{value:e}),Object.defineProperty(this,"propListeners",{value:{}}),Object.defineProperty(this,"activeListeners",{value:{}}),Object.defineProperty(this,"__connected",{enumerable:!1,writable:!0,value:!1});for(let e in t)this[e]=t[e]}setPropListeners(e){const t=this.propListeners,s=this.node,i={};for(let t in e)t.startsWith("on-")&&(i[t.slice(3,t.length)]=e[t]);for(let e in i){if(t[e])if(t[e]instanceof Array){const i="function"==typeof t[e][0]?t[e][0]:s[t[e][0]];s.removeEventListener(e,i,t[e][1])}else{const i="function"==typeof t[e]?t[e]:s[t[e]];s.removeEventListener(e,i)}if(t[e]=i[e],this.__connected)if(i[e]instanceof Array){const t="function"==typeof i[e][0]?i[e][0]:s[i[e][0]];s.addEventListener(e,t,i[e][1])}else{const t="function"==typeof i[e]?i[e]:s[i[e]];s.addEventListener(e,t)}}}connect(){this.__connected=!0;const e=this.node,t=this.propListeners;for(let t in this)this[t]instanceof Array?this.addEventListener(t,e[this[t][0]],this[t][1]):this.addEventListener(t,e[this[t]]);for(let s in t)if(t[s]instanceof Array){const i="function"==typeof t[s][0]?t[s][0]:e[t[s][0]];this.addEventListener(s,i,t[s][1])}else{const i="function"==typeof t[s]?t[s]:e[t[s]];this.addEventListener(s,i)}}disconnect(){this.__connected=!1;const e=this.node,t=this.propListeners;for(let t in this)this[t]instanceof Array?this.removeEventListener(t,e[this[t][0]],this[t][1]):this.removeEventListener(t,e[this[t]]);for(let s in t)if(t[s]instanceof Array){const i="function"==typeof t[s][0]?t[s][0]:e[t[s][0]];this.removeEventListener(s,i,t[s][1])}else{const i="function"==typeof t[s]?t[s]:e[t[s]];this.removeEventListener(s,i)}}dispose(){this.disconnect();const e=this.activeListeners;for(let t in e)for(let s=e[t].length;s--;)this.node.__isIoElement&&HTMLElement.prototype.removeEventListener.call(this.node,t,e[t][s]),e[t].splice(s,1)}addEventListener(e,t,s){const i=this.activeListeners;i[e]=i[e]||[],-1===i[e].indexOf(t)&&(this.node.__isIoElement&&HTMLElement.prototype.addEventListener.call(this.node,e,t,s),i[e].push(t))}removeEventListener(e,t,s){const i=this.activeListeners;if(void 0!==i[e]){const n=i[e].indexOf(t);-1===n&&void 0!==t||(this.node.__isIoElement&&HTMLElement.prototype.removeEventListener.call(this.node,e,t,s),i[e].splice(n,1))}}dispatchEvent(e,t={},s=!0,i=this.node){if(i instanceof HTMLElement||i===window)HTMLElement.prototype.dispatchEvent.call(i,new CustomEvent(e,{type:e,detail:t,bubbles:s,composed:!0,cancelable:!0}));else{const s=this.activeListeners;if(void 0!==s[e]){const n=s[e].slice(0);for(let e=0;e<n.length;e++)n[e].call(i,{detail:t,target:i,path:[i]})}}}}const NodeMixin=e=>{const t=class extends e{static get Properties(){return{lazy:Boolean}}get compose(){return null}constructor(e={},...t){super(...t);const s=this.__proto__.constructor;s.__registeredAs,s.name,this.__protoFunctions.bind(this),Object.defineProperty(this,"__bindings",{enumerable:!1,value:new Bindings(this)}),Object.defineProperty(this,"__queue",{enumerable:!1,value:new Queue(this)}),Object.defineProperty(this,"__listeners",{enumerable:!1,value:new Listeners(this,this.__protoListeners)}),Object.defineProperty(this,"__properties",{enumerable:!1,value:new Properties(this,this.__protoProperties)}),Object.defineProperty(this,"objectMutated",{enumerable:!1,value:this.objectMutated.bind(this)}),Object.defineProperty(this,"objectMutatedThrottled",{enumerable:!1,value:this.objectMutatedThrottled.bind(this)}),Object.defineProperty(this,"queueDispatchLazy",{enumerable:!1,value:this.queueDispatchLazy.bind(this)}),Object.defineProperty(this,"__connected",{enumerable:!1,writable:!0,value:!1}),this.__proto__.__isIoElement||Object.defineProperty(this,"__connections",{enumerable:!1,value:[]}),this.setProperties(e)}connect(e){this.__connections.push(e),this.__connected||this.connectedCallback()}disconnect(e){this.__connections.splice(this.__connections.indexOf(e),1),0===this.__connections.length&&this.__connected&&this.disconnectedCallback()}connectedCallback(){this.__connected=!0,this.__listeners.connect(),this.__properties.connect(),this.__observedObjects.length&&window.addEventListener("object-mutated",this.objectMutated),this.queueDispatch()}disconnectedCallback(){this.__connected=!1,this.__listeners.disconnect(),this.__properties.disconnect(),this.__observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}dispose(){this.__connected=!1,this.__connections.length=0,this.__queue.dispose(),this.__bindings.dispose(),this.__listeners.dispose(),this.__properties.dispose(),this.__observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}changed(){}dispatchChange(){if(this.compose)for(let e in this.compose){const t=this.__properties[e].value;if(t.__isNode)t.setProperties(this.compose[e]);else for(let s in this.compose[e])t[s]=this.compose[e][s]}this.changed()}queue(e,t,s){this.__queue.queue(e,t,s)}queueDispatch(){this.lazy?(preThrottleQueue.push(this.queueDispatchLazy),this.throttle(this.queueDispatchLazy)):this.__queue.dispatch()}queueDispatchLazy(){this.__queue.dispatch()}objectMutated(e){for(let t=this.__observedObjects.length;t--;){const s=this.__observedObjects[t],i=this.__properties[s].value;if(i===e.detail.object)return void this.throttle(this.objectMutatedThrottled,s);if(e.detail.objects&&-1!==e.detail.objects.indexOf(i))return void this.throttle(this.objectMutatedThrottled,s)}}objectMutatedThrottled(e){this.propMutated&&this.propMutated(e),this[e+"Mutated"]&&this[e+"Mutated"](),this.dispatchChange()}bind(e){if(this.__properties[e])return this.__bindings.bind(e)}unbind(e){this.__bindings.unbind(e);const t=this.__properties[e].binding;t&&t.removeTarget(this,e)}set(e,t,s){if(this[e]!==t||s){const s=this[e];this[e]=t,this.dispatchEvent("value-set",{property:e,value:t,oldValue:s},!1)}}setProperties(e){for(let t in e)void 0!==this.__properties[t]&&this.__properties.set(t,e[t],!0);this.__listeners.setPropListeners(e,this),this.__connected&&this.queueDispatch()}addEventListener(e,t,s){"function"==typeof t&&this.__listeners.addEventListener(e,t,s)}removeEventListener(e,t,s){this.__listeners.removeEventListener(e,t,s)}dispatchEvent(e,t,s=!1,i){this.__listeners.dispatchEvent(e,t,s,i)}throttle(e,t,s){if(-1!==preThrottleQueue.indexOf(e)||(preThrottleQueue.push(e),s))if(-1===throttleQueue.indexOf(e)&&throttleQueue.push(e),argQueue.has(e)&&"object"!=typeof t){const s=argQueue.get(e);-1===s.indexOf(t)&&s.push(t)}else argQueue.set(e,[t]);else e(t)}requestAnimationFrameOnce(e){requestAnimationFrameOnce(e)}filterObject(e,t,s=5,i=[],n=0){if(-1===i.indexOf(e)&&(i.push(e),!(n>s))){if(n++,t(e))return e;for(let o in e){const r=e[o]instanceof Binding?e[o].value:e[o];if(t(r))return r;if("object"==typeof r){const e=this.filterObject(r,t,s,i,n);if(e)return e}}}}filterObjects(e,t,s=5,i=[],n=0){const o=[];if(-1!==i.indexOf(e))return o;if(i.push(e),n>s)return o;n++,t(e)&&-1===o.indexOf(e)&&o.push(e);for(let r in e){const c=e[r]instanceof Binding?e[r].value:e[r];if(t(c)&&-1===o.indexOf(c)&&o.push(c),"object"==typeof c){const e=this.filterObjects(c,t,s,i,n);for(let t=0;t<e.length;t++)-1===o.indexOf(e[t])&&o.push(e[t])}}return o}import(e){const t=new URL(e,window.location).href;return new Promise(s=>{!e||IMPORTED_PATHS[t]?s(t):import(t).then(()=>{IMPORTED_PATHS[t]=!0,s(t)})})}preventDefault(e){e.preventDefault()}stopPropagation(e){e.stopPropagation()}};return t.Register=Register,t},Register=function(){const e=new ProtoChain(this.prototype);let t=this.prototype;Object.defineProperty(t,"__isNode",{value:!0}),Object.defineProperty(t.constructor,"__registeredAs",{value:t.constructor.name}),Object.defineProperty(t,"__protochain",{value:e}),Object.defineProperty(t,"__protoFunctions",{value:new ProtoFunctions(e)}),Object.defineProperty(t,"__protoProperties",{value:new ProtoProperties(e)}),Object.defineProperty(t,"__protoListeners",{value:new ProtoListeners(e)}),Object.defineProperty(t,"__observedObjects",{value:[]});for(let e in t.__protoProperties)t.__protoProperties[e].observe&&t.__observedObjects.push(e);for(let e in t.__protoProperties)Object.defineProperty(t,e,{get:function(){return this.__properties.get(e)},set:function(t){this.__properties.set(e,t)},enumerable:!!t.__protoProperties[e].enumerable,configurable:!0})};NodeMixin.Register=Register;class Node extends(NodeMixin(Object)){}Node.Register();const IMPORTED_PATHS={},preThrottleQueue=new Array,throttleQueue=new Array,argQueue=new WeakMap,funcQueue=new Array,animate=function(){requestAnimationFrame(animate);for(let e=preThrottleQueue.length;e--;)preThrottleQueue.splice(preThrottleQueue.indexOf(preThrottleQueue[e]),1);for(let e=throttleQueue.length;e--;){const t=argQueue.get(throttleQueue[e]);for(let s=t.length;s--;)throttleQueue[e](t[s]),t.splice(t.indexOf(s),1);throttleQueue.splice(throttleQueue.indexOf(throttleQueue[e]),1)}for(let e=funcQueue.length;e--;){const t=funcQueue[e];funcQueue.splice(funcQueue.indexOf(t),1),t()}};function requestAnimationFrameOnce(e){-1===funcQueue.indexOf(e)&&funcQueue.push(e)}
/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */requestAnimationFrame(animate);const isString=e=>"string"==typeof e,isArray=Array.isArray,isObject=e=>"object"==typeof e&&!isArray(e),clense=(e,t)=>t?isString(t[0])?[...e,t]:[...e,...t]:e,buildTree=()=>e=>e&&isObject(e[1])?{name:e[0],props:e[1],children:isArray(e[2])?e[2].reduce(clense,[]).map(buildTree()):e[2]}:buildTree()([e[0],{},e[1]]);class IoElement extends(NodeMixin(HTMLElement)){static get Style(){return"\n    :host[hidden] {\n      display: none;\n    }\n    :host[disabled] {\n      pointer-events: none;\n      opacity: 0.5;\n    }\n    "}static get Properties(){return{$:{type:Object,notify:!1},tabindex:{type:String,reflect:1},contenteditable:{type:Boolean,reflect:1},class:{type:String,reflect:1},role:{type:String,reflect:1},label:{type:String,reflect:1},id:{type:String,reflect:-1},hidden:{type:Boolean,reflect:1},disabled:{type:Boolean,reflect:1}}}static get Listeners(){return{"focus-to":"_onFocusTo"}}static get observedAttributes(){const e=[];for(let t in this.prototype.__protoProperties){const s=this.prototype.__protoProperties[t].reflect;-1!==s&&2!==s||e.push(t)}return e}attributeChangedCallback(e,t,s){const i=this.__properties[e].type;i===Boolean?null===s?this[e]=!1:""===s&&(this[e]=!0):i===Number||i===String?this[e]=i(s):i===Object||i===Array?this[e]=JSON.parse(s):this[e]="function"==typeof i?new i(JSON.parse(s)):isNaN(Number(s))?s:Number(s)}connectedCallback(){super.connectedCallback(),"function"==typeof this.onResized&&(ro?ro.observe(this):(window.addEventListener("resize",this.onResized),setTimeout(()=>{this.onResized()})))}disconnectedCallback(){super.disconnectedCallback(),"function"==typeof this.onResized&&(ro?ro.unobserve(this):window.removeEventListener("resize",this.onResized))}template(e,t){const s=buildTree()(["root",e]).children;(t=t||this)===this&&(this.__properties.$.value={}),this.traverse(s,t)}traverse(e,t){const s=t.children;for(;s.length>e.length;){const e=s[s.length-1];t.removeChild(e)}if(s.length<e.length){const i=document.createDocumentFragment();for(let t=s.length;t<e.length;t++){const s=constructElement(e[t]);i.appendChild(s)}t.appendChild(i)}for(let i=0;i<s.length;i++)if(s[i].localName!==e[i].name){const n=s[i],o=constructElement(e[i]);t.insertBefore(o,n),t.removeChild(n)}else s[i].removeAttribute("className"),s[i].__isIoElement?s[i].setProperties(e[i].props):setNativeElementProps(s[i],e[i].props);for(let t=0;t<e.length;t++)e[t].props.id&&(this.$[e[t].props.id]=s[t]),void 0!==e[t].children&&("string"==typeof e[t].children?(this.flattenTextNode(s[t]),s[t].__textNode.nodeValue=String(e[t].children)):"object"==typeof e[t].children&&this.traverse(e[t].children,s[t]))}flattenTextNode(e){if(0===e.childNodes.length&&e.appendChild(document.createTextNode("")),"#text"!==e.childNodes[0].nodeName&&(e.innerHTML="",e.appendChild(document.createTextNode(""))),e.__textNode=e.childNodes[0],e.childNodes.length>1){const t=e.textContent;for(let t=e.childNodes.length;t--;)0!==t&&e.removeChild(e.childNodes[t]);e.__textNode.nodeValue=t}}get textNode(){return this.flattenTextNode(this),this.__textNode.nodeValue}set textNode(e){this.flattenTextNode(this),this.__textNode.nodeValue=String(e)}setProperties(e){if(super.setProperties(e),e.style)for(let t in e.style)this.style[t]=e.style[t]}setAttribute(e,t){!0===t?HTMLElement.prototype.setAttribute.call(this,e,""):!1===t||""===t?this.removeAttribute(e):"string"!=typeof t&&"number"!=typeof t||this.getAttribute(e)!==String(t)&&HTMLElement.prototype.setAttribute.call(this,e,t)}dispatchChange(){super.dispatchChange(),this.setAria()}setAria(){this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"),this.disabled?this.setAttribute("aria-disabled",!0):this.removeAttribute("aria-disabled")}_onFocusTo(e){const t=e.composedPath()[0],s=e.detail.dir,i=e.detail.rect;if(i.center={x:i.x+i.width/2,y:i.y+i.height/2},t!==this){let n=t,o=1/0,r=1/0;const c=this.querySelectorAll('[tabindex="0"]:not([disabled])');for(let e=c.length;e--;){if(!c[e].offsetParent)continue;if("visible"!==window.getComputedStyle(c[e]).visibility)continue;const t=c[e].getBoundingClientRect();switch(t.center={x:t.x+t.width/2,y:t.y+t.height/2},s){case"right":if(t.left>=i.right-1){const s=Math.abs(t.left-i.right),h=Math.abs(t.center.y-i.center.y);s<o||h<r/3?(n=c[e],o=s,r=h):s===o&&h<r&&(n=c[e],r=h)}break;case"left":if(t.right<=i.left+1){const s=Math.abs(t.right-i.left),h=Math.abs(t.center.y-i.center.y);s<o||h<r/3?(n=c[e],o=s,r=h):s===o&&h<r&&(n=c[e],r=h)}break;case"down":if(t.top>=i.bottom-1){const s=Math.abs(t.center.x-i.center.x),h=Math.abs(t.top-i.bottom);h<r||s<o/3?(n=c[e],o=s,r=h):h===r&&s<o&&(n=c[e],o=s)}break;case"up":if(t.bottom<=i.top+1){const s=Math.abs(t.center.x-i.center.x),h=Math.abs(t.bottom-i.top);h<r||s<o/3?(n=c[e],o=s,r=h):h===r&&s<o&&(n=c[e],o=s)}}}n!==t&&(n.focus(),e.stopPropagation())}}focusTo(e){const t=this.getBoundingClientRect();this.dispatchEvent("focus-to",{dir:e,rect:t},!0)}}const warning=document.createElement("div");let ro;warning.innerHTML='\nNo support for custom elements detected! <br />\nSorry, modern browser is required to view this page.<br />\nPlease try <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,\n<a href="https://www.google.com/chrome/">Chrome</a> or\n<a href="https://www.apple.com/lae/safari/">Safari</a>',IoElement.Register=function(){NodeMixin.Register.call(this);const e=this.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();Object.defineProperty(this,"localName",{value:e}),Object.defineProperty(this.prototype,"localName",{value:e}),Object.defineProperty(this,"__isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(this.prototype,"__isIoElement",{enumerable:!1,value:!0}),void 0!==window.customElements?(window.customElements.define(e,this),_initProtoStyle(this.prototype.__protochain)):document.body.insertBefore(warning,document.body.children[0])},void 0!==window.ResizeObserver&&(ro=new ResizeObserver(e=>{for(let t of e)t.target.onResized()}));const constructElement=function(e){const t=window.customElements?window.customElements.get(e.name):null;if(t&&t.__isIoElement)return new t(e.props);const s=document.createElement(e.name);return setNativeElementProps(s,e.props),s},superCreateElement=document.createElement;document.createElement=function(){const e=arguments[0];if(e.startsWith("io-")){const t=customElements.get(e);return t?new t:superCreateElement.apply(this,arguments)}return superCreateElement.apply(this,arguments)};const setNativeElementProps=function(e,t){for(let s in t){const i=t[s];if(s.startsWith("@"))e.setAttribute(s.substr(1),i);else if("style"===s)for(let t in i)e.style.setProperty(t,i[t]);else"class"===s?e.className=i:"id"!==s&&(e[s]=i);"name"===s&&e.setAttribute("name",i)}e.__listeners||(Object.defineProperty(e,"__listeners",{value:new Listeners(e)}),e.__listeners.connect()),e.__listeners.setPropListeners(t,e)},mixinDB={},commentsRegex=new RegExp("(\\/\\*[\\s\\S]*?\\*\\/)","gi"),keyframeRegex=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mediaQueryRegex=new RegExp("((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mixinRegex=new RegExp("((--[\\s\\S]*?): {([\\s\\S]*?)})","gi"),applyRegex=new RegExp("(@apply\\s.*?;)","gi"),cssRegex=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi");function _initProtoStyle(e){const t=e[0].constructor.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),s="io-style-"+t.replace("io-","");let i="",n=e[0].constructor.Style;if(n){const s=n.match(mixinRegex);if(s)for(let e=0;e<s.length;e++){const t=s[e].split(": {"),n=t[0],o=t[1].replace(/}/g,"").trim().replace(/^ +/gm,"");mixinDB[n]=o,i+=s[e].replace("--",".").replace(": {"," {")}for(let s=e.length;s--;){let n=e[s].constructor.Style;if(n){const e=(n=n.replace(mixinRegex,"")).match(applyRegex);if(e)for(let t=0;t<e.length;t++){const s=e[t].split("@apply ")[1].replace(";","");mixinDB[s]&&(n=n.replace(e[t],mixinDB[s]))}{let e=n;const t=(e=(e=(e=e.replace(commentsRegex,"")).replace(keyframeRegex,"")).replace(mediaQueryRegex,"")).match(cssRegex);t&&t.map(e=>{(e=e.trim()).startsWith(":host")})}i+=n.replace(new RegExp(":host","g"),t)}}}if(i){const e=document.createElement("style");e.innerHTML=i,e.setAttribute("id",s),document.head.appendChild(e)}}IoElement.Register();class Options extends(NodeMixin(Array)){static get Properties(){return{selectedPath:{type:Array,strict:!0},selectedRoot:String,selectedLeaf:String}}constructor(e=[],t={}){super(t);for(let t=0;t<e.length;t++){let s;s=e[t]instanceof OptionItem?e[t]:"object"==typeof e[t]?new OptionItem(e[t]):new OptionItem({value:e[t]}),this.push(s),s.addEventListener("selected-changed",this.onOptionItemSelectedChanged),s.addEventListener("selectedPath-changed",this.onOptionItemSelectedPathChanged),s.connect(this)}}option(e){for(let t=0;t<this.length;t++)if(this[t].value===e)return this[t];return null}selectedPathChanged(){if(this.selectedPath.length){this.setSelectedPath(this.selectedPath);const e=this.selectedPath[0];for(let t=0;t<this.length;t++)if("pick"===this[t].select&&this[t].value===e){const e=[...this.selectedPath];return e.shift(),void this[t].setSelectedPath(!0,e)}}else for(let e=0;e<this.length;e++)"pick"===this[e].select&&this[e].setSelectedPath(!1,[])}onOptionItemSelectedPathChanged(e){const t=e.target;"pick"===t.select&&t.selectedPath.length&&this.setSelectedPath([t.value,...t.selectedPath])}onOptionItemSelectedChanged(e){const t=e.target;if("pick"===t.select)if(t.selected){for(let e=0;e<this.length;e++)"pick"===this[e].select&&this[e]!==t&&this[e].setSelectedPath(!1,[]);this.setSelectedPath([t.value,...t.selectedPath])}else{let e=!1;for(let t=0;t<this.length;t++)this[t].selected&&(e=!0);e||this.setSelectedPath([])}}setSelectedPath(e=[]){this.setProperties({selectedPath:e,selectedRoot:e[0]||"",selectedLeaf:e[e.length-1]||""})}selectDefault(){for(let e=0;e<this.length;e++)if("pick"===this[e].select){if(!this[e].hasmore)return this[e].setSelectedPath(!0,[]),!0;if(this[e].options.selectDefault())return!0}return!1}changed(){this.dispatchEvent("changed")}}Options.Register();class OptionItem extends Node{static get Properties(){return{value:void 0,label:"",icon:"",hint:"",action:void 0,select:"pick",selected:Boolean,selectedPath:{type:Array,strict:!0},selectedRoot:String,selectedLeaf:String,options:{type:Options,strict:!0}}}get compose(){return{options:{"on-selectedPath-changed":this.onOptionsSelectedPathChanged}}}constructor(e){"object"==typeof e&&null!==e||(e={value:e,label:e}),e.options&&(e.options instanceof Options||(e.options=new Options(e.options))),e.label||("object"==typeof e.value?e.label=e.value.constructor.name:e.label=String(e.value)),"toggle"===e.select&&e.options&&e.options.length&&(e.options=new Options),"pick"===e.select&&e.options.length&&(e.selected=!!e.options.selectedPath.length,e.selectedPath=[...e.options.selectedPath]),super(e),"pick"===this.select&&this.options.length&&this.setSelectedPath(!!this.options.selectedPath.length,[...this.options.selectedPath])}get hasmore(){return!!this.options.length}option(e){return this.options.option(e)}onOptionsSelectedPathChanged(){"pick"===this.select&&this.setSelectedPath(!!this.options.selectedPath.length,[...this.options.selectedPath])}selectedChanged(){"pick"===this.select&&(this.selected||(this.options.setSelectedPath([]),this.setSelectedPath(!1,[])))}setSelectedPath(e,t=[]){this.setProperties({selected:e,selectedPath:t,selectedRoot:t[0]||"",selectedLeaf:t[t.length-1]||""})}changed(){this.dispatchEvent("changed")}}OptionItem.Register();export{Binding,IoElement,Node,NodeMixin,OptionItem,Options,Properties,Property,ProtoChain,ProtoProperties,ProtoProperty};