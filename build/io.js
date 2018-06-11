// Get a list of io prototypes by walking down the inheritance chain. 
class Prototypes extends Array {
  constructor(_constructor) {
    super();
    let proto = _constructor.prototype;
    // Stop at HTMLElement for io-element and Object for io-node.
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}

// Creates a properties object with configurations inherited from prototype chain.

const illegalPropNames = ['style', 'className', 'listeners'];

class ProtoProperties {
  constructor(prototypes) {
    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.properties;
      for (let key in prop) {
        if (illegalPropNames.indexOf(key) !== -1) {
          console.warn('Illegal property name:', key);
        }
        let propDef = new Property(prop[key], true);
        if (propertyDefs[key]) propertyDefs[key].assign(propDef);
        else propertyDefs[key] = propDef;
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
  }
  // Instances should use this function to create unique clone of properties.
  clone() {
    let properties = new ProtoProperties([]);
    for (let prop in this) {
      properties[prop] = this[prop].clone();
    }
    return properties;
  }
}

function defineProperties(prototype) {
  for (let prop in prototype.__props) {
    Object.defineProperty(prototype, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        let oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].reflect) {
          this.setAttribute(prop, this.__props[prop].value);
        }
        if (this.__props[prop].observer) {
          this[this.__props[prop].observer](value, oldValue);
        }
        this.dispatchEvent(prop + '-changed', {value: value, oldValue: oldValue});
        this.update();
      },
      enumerable: true,
      configurable: true
    });
  }
}

/*
Creates a property object from properties defined in the prototype chain.
{
  value: <property value>
  type: <constructor of the value>
  observer: <neme of the vunction to be called when value changes>
  reflect: <reflection to HTML element attribute>
  binding: <binding object if bound>
  config: <optional configutation for GUI>
}
 */
class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {};
    } else if (typeof propDef === 'function') {
      // Shorthand property definition by constructor.
      propDef = {type: propDef};
    } else if (typeof propDef !== 'object') {
      // Shorthand property definition by value
      propDef = {value: propDef, type: propDef.constructor};
    }
    // Set default value if type is defined but value is not.
    if (propDef.value === undefined && propDef.type) {
      if (propDef.type === Boolean) propDef.value = false;
      else if (propDef.type === String) propDef.value = '';
      else if (propDef.type === Number) propDef.value = 0;
      else if (propDef.type === Array) propDef.value = [];
      else if (propDef.type === Object) propDef.value = {};
      else if (propDef.type !== HTMLElement && propDef.type !== Function) propDef.value = new propDef.type();
    }
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    this.config = propDef.config;
  }
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.observer !== undefined) this.observer = propDef.observer;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    if (propDef.config !== undefined) this.config = propDef.config;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
  clone() {
    let prop = new Property(this);
    if (prop.value instanceof Array) {
      prop.value = [ ...prop.value ];
    } else if (prop.value instanceof Object) {
      let value = prop.value;
      if (typeof value.clone === 'function') {
        prop.value = value.clone();
      } else {
        prop.value = prop.type ? new prop.type() : {};
        for (let p in value) prop.value[p] = value[p];
      }
    }
    return prop;
  }
}

// Creates a list of listeners defined in prototype chain.
class ProtoListeners {
  constructor(prototypes) {
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
  }
  connect(element) {
    for (let i in this) {
      HTMLElement.prototype.addEventListener.call(element, i, element[this[i]]);
    }
  }
  disconnect(element) {
    for (let i in this) {
      HTMLElement.prototype.removeEventListener.call(element, i, element[this[i]]);
    }
  }
}

// Creates a list of functions defined in prototype chain.
class ProtoFunctions extends Array {
  constructor(prototypes) {
    super();
    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        if (typeof prototypes[i][names[j]] !== 'function') continue;
        if (prototypes[i][names[j]].name === 'anonymous') {
          continue;
        }
        if (this.indexOf(names[j]) === -1) this.push(names[j]);
        if (names[j] === 'value') console.log(prototypes[i][names[j]]);
      }
    }
  }
  // Binds all functions to instance.
  bind(element) {
    for (let i = 0; i < this.length; i++) {
      element[this[i]] = element[this[i]].bind(element);
    }
  }
}

// Creates a list of listeners passed to element instance as arguments.
class InstanceListeners {
  setListeners(props) {
    for (let l in props['listeners']) {
      this[l] = props['listeners'][l];
    }
  }
  connect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.addEventListener(i, listener);
    }
  }
  disconnect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.removeEventListener(i, listener);
    }
  }
}

const _stagingElement = document.createElement('div');

function initStyle(prototypes) {
  let localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  for (let i = prototypes.length; i--;) {
    let style = prototypes[i].constructor.style;
    if (style) {
      if (i < prototypes.length - 1 && style == prototypes[i + 1].constructor.style) continue;
      style = style.replace(new RegExp(':host', 'g'), localName);
      _stagingElement.innerHTML = style;
      let element = _stagingElement.querySelector('style');
      element.setAttribute('id', 'io-style-' + localName + '-' + i);
      document.head.appendChild(element);
    }
  }
}

const renderNode = function(vDOMNode) {
  let ConstructorClass = customElements.get(vDOMNode.name);
  let element;
  if (ConstructorClass) {
    element = new ConstructorClass(vDOMNode.props);
  } else {
    element = document.createElement(vDOMNode.name);
    updateNode(element, vDOMNode);
  }
  return element;
};

const updateNode = function(element, vDOMNode) {
  for (let prop in vDOMNode.props) {
    element[prop] = vDOMNode.props[prop];
  }
  // TODO: handle special cases cleaner
  // TODO: use attributeStyleMap when implemented in browser
  // https://developers.google.com/web/updates/2018/03/cssom
  if (vDOMNode.props['style']) {
    for (let s in vDOMNode.props['style']) {
      element['style'][s] = vDOMNode.props['style'][s];
    }
  }
  return element;
};

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
// TODO: understand!
const buildTree = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2] || ''
  } : buildTree()([node[0], {}, node[1] || '']);

const IoBindingMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__bindings', {value: {}});
  }
  bind(prop) {
    this.__bindings[prop] = this.__bindings[prop] || new Binding(this, prop);
    return this.__bindings[prop];
  }
};

class Binding {
  constructor(source, sourceProp) {
    this.source = source;
    this.sourceProp = sourceProp;
    this.targets = [];
    this.targetsMap = new WeakMap();
    this.updateSource = this.updateSource.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.setSource(this.source);
  }
  setSource() {
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTargets);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        this.targets[i].__props[targetProps[j]].value = this.source[this.sourceProp];
        // TODO: test observers on binding hot-swap!
      }
    }
  }
  setTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      let targetProps = this.targetsMap.get(target);
      if (targetProps.indexOf(targetProp) === -1) { // safe check needed?
        targetProps.push(targetProp);
        target.addEventListener(targetProp + '-changed', this.updateSource);
      }
    } else {
      this.targetsMap.set(target, [targetProp]);
      target.addEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  removeTarget(target, targetProp) {
    if (this.targetsMap.has(target)) {
      let targetProps = this.targetsMap.get(target);
      let index = targetProps.indexOf(targetProp);
      if (index !== -1) {
        targetProps.splice(index, 1);
      }
      // TODO: remove from WeakMap?
      target.removeEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  updateSource(event) {
    if (this.targets.indexOf(event.srcElement) === -1) return;
    if (this.source[this.sourceProp] !== event.detail.value) {
      this.source[this.sourceProp] = event.detail.value;
    }
  }
  updateTargets(event) {
    if (event.srcElement != this.source) return;
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i][targetProps[j]] !== event.detail.value) {
          this.targets[i][targetProps[j]] = event.detail.value;
        }
      }
    }
  }
}

const IoElementListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === -1) {
      this.__listeners[type].push(listener);
      HTMLElement.prototype.addEventListener.call(this, type, listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== -1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== -1) {
        this.__listeners[type].splice(i, 1);
        HTMLElement.prototype.removeEventListener.call(this, type, listener);
      }
    }
  }
  dispatchEvent(type, detail, bubbles = true, src = this) {
    HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      composed: true
    }));
  }
};

const IoNodeListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === - 1) {
      this.__listeners[type].push(listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== - 1) {
        this.__listeners[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail, bubbles, path) {
    if (this.__listeners[type] !== undefined) {
      let array = this.__listeners[type].slice(0);
      for (let i = 0, l = array.length; i < l; i ++) {
        path = path || [this];
        array[i].call(this, {detail: detail, target: this, bubbles: bubbles, path: path});
        // TODO: test bubbling
        if (bubbles) {
          let parent = this.parent;
          while (parent) {
            path.push(parent);
            parent.dispatchEvent(type, detail, true, path);
            parent = parent.parent;
          }
        }
      }
    }
  }
};

function html() {return arguments[0][0];}

class IoElement extends IoBindingMixin(IoElementListenersMixin(HTMLElement)) {
  static get properties() {
    return {
      id: String,
      tabindex: {
        type: String,
        reflect: true
      },
      contenteditable: {
        type: Boolean,
        reflect: true
      }
    };
  }
  constructor(initProps = {}) {
    super();
    this.__protoFunctions.bind(this);

    Object.defineProperty(this, '__props', {value: this.__props.clone()});

    Object.defineProperty(this, '__observers', {value: []});
    Object.defineProperty(this, '__notifiers', {value: []});

    this.setProperties(initProps);

    Object.defineProperty(this, '__instaListeners', {value: new InstanceListeners()});
    this.__instaListeners.setListeners(initProps);

    Object.defineProperty(this, '$', {value: {}}); // TODO: consider clearing on update. possible memory leak!

    for (let prop in this.__props) {
      if (this.__props[prop].reflect) {
        this.setAttribute(prop, this.__props[prop].value);
      }
    }
  }
  connectedCallback() {
    this.__protoListeners.connect(this);
    this.__instaListeners.connect(this);

    this.triggerObservers();
    this.triggerNotifiers();

    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.setTarget(this, p); //TODO: test
      }
    }
  }
  disconnectedCallback() {
    this.__protoListeners.disconnect(this);
    this.__instaListeners.disconnect(this);

    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        delete this.__props[p].binding;
      }
    }
  }
  dispose() {
    // for (let id in this.$) {
    //   delete this.$[id];
    // }
  }

  update() {}

  render(children, host) {
    this.traverse(buildTree()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) host.removeChild(children[children.length - 1]);

    // create new elements after existing
    const frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(renderNode(vChildren[i]));
    }
    host.appendChild(frag);

    for (let i = 0; i < children.length; i++) {

      // replace existing elements
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        host.insertBefore(renderNode(vChildren[i]), oldElement);
        host.removeChild(oldElement);

      // update existing elements
      } else {
        // Io Elements
        if (children[i].hasOwnProperty('__props')) {
          children[i].setProperties(vChildren[i].props); // TODO: test
          children[i].triggerObservers();
          children[i].__instaListeners.setListeners(vChildren[i].props);
          children[i].__instaListeners.connect(children[i]);
          children[i].triggerNotifiers();
        // Native HTML Elements
        } else {
          updateNode(children[i], vChildren[i]);
        }
      }
    }

    for (let i = 0; i < vChildren.length; i++) {
      if (vChildren[i].props.id) {
        this.$[vChildren[i].props.id] = children[i];
      }
      if (vChildren[i].children && typeof vChildren[i].children === 'string') {
        children[i].innerText = vChildren[i].children;
      } else if (vChildren[i].children && typeof vChildren[i].children === 'object') {
        this.traverse(vChildren[i].children, children[i]);
      }
    }
  }
  triggerObservers() {
    // TODO: test
    // if (!this.__connected) return;
    for (let j = 0; j < this.__observers.length; j++) {
      this[this.__observers[j]]();
    }
    this.__observers.length = 0;
  }
  triggerNotifiers() {
    // if (!this.__connected) return;
    // TODO: test
    for (let j = 0; j < this.__notifiers.length; j++) {
      this.dispatchEvent(this.__notifiers[j][0], this.__notifiers[j][1]);
    }
    this.__notifiers.length = 0;
  }

  set(prop, value) {
    let oldValue = this[prop];
    this[prop] = value;
    this.dispatchEvent(prop + '-set', {value: value, oldValue: oldValue}, true);
  }

  setProperties(props) {

    this.__observers.length = 0;
    this.__notifiers.length = 0;

    this.__observers.push('update');

    for (let p in props) {

      if (this.__props[p] === undefined) continue;

      let oldBinding = this.__props[p].binding;
      let oldValue = this.__props[p].value;

      let binding;
      let value;

      if (props[p] instanceof Binding) {
        binding = props[p];
        value = props[p].source[props[p].sourceProp];
      } else {
        value = props[p];
      }

      this.__props[p].binding = binding;
      this.__props[p].value = value;

      if (value !== oldValue) {
        if (this.__props[p].reflect) {
          this.setAttribute(p, value);
        }
        if (this.__props[p].observer) {
          if (this.__observers.indexOf(this.__props[p].observer) === -1) {
            this.__observers.push(this.__props[p].observer);
          }
        }
        this.__notifiers.push(p + '-changed', {value: value, oldValue: oldValue});
      }

      if (binding !== oldBinding) {
        binding.setTarget(this, p);
        // TODO: test extensivly
        if (oldBinding) console.warn('Disconnect!', binding, oldBinding);
      }

    }

    if (props['className']) {
      this.className = props['className'];
    }

    // TODO: use attributeStyleMap when implemented in browser
    // https://developers.google.com/web/updates/2018/03/cssom
    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
      }
    }
  }

  // fixup for shitty setAttribute spec
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value == 'string' || typeof value == 'number') {
      HTMLElement.prototype.setAttribute.call(this, attr, value);
    }
  }
}

IoElement.Register = function() {
  const prototypes = new Prototypes(this);
  initStyle(prototypes);

  Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes)});
  Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new ProtoListeners(prototypes)});

  defineProperties(this.prototype);

  customElements.define(this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), this);
};

class IoNode extends IoBindingMixin(IoNodeListenersMixin(Object)) {
  constructor() {
    super();
    this.__proto__.constructor.Register();
    this.__proto__.__protoFunctions.bind(this);
    Object.defineProperty(this, '__props', {value: this.__props.clone()});
  }
  connectedCallback() {
    // TODO: implement connected
    this.__proto__.__protoListeners.connect(this);
  }
  disconnectedCallback() {
    // TODO: implement disconnected
    this.__proto__.__protoListeners.disconnect(this);
  }
  dispose() {
    // TODO test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
  setAttribute() {
    console.warn('io-node: setAttribute not suppoerted!');
  }
  update() {}
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);

    Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes) });
    Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});
    Object.defineProperty(this.prototype, '__protoListeners', { value: new ProtoListeners(prototypes) });

    defineProperties(this.prototype);

    // TODO: implement children io-nodes via properties
    // Object.defineProperty(this, 'parent', {value: null});
    // Object.defineProperty(this, 'children', {value: null});

  }
  this.registered = true;
};

class IoButton extends IoElement {
  static get style() {
    return html`<style>:host {cursor: pointer;white-space: nowrap;-webkit-tap-highlight-color: transparent;}:host:hover {background: rgba(255,255,255,0.1);}:host[pressed] {background: rgba(0,0,0,0.2);}</style>`;
  }
  static get properties() {
    return {
      value: null,
      label: String,
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'keydown': '_onDown',
      'mousedown': '_onDown',
      'touchstart': '_onDown'
    };
  }
  _onAction(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.pressed && typeof this.action === 'function') this.action(this.value);
      this.pressed = false;
      this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action});
    }
  }
  _onDown(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.pressed = true;
      document.addEventListener('mouseup', this._onUp);
      document.addEventListener('touchend', this._onUp);
      this.addEventListener('keyup', this._onAction);
      this.addEventListener('mouseup', this._onAction);
      this.addEventListener('touchend', this._onAction);
      this.addEventListener('mouseleave', this._onLeave);
    }
  }
  _onUp(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    this.removeEventListener('keyup', this._onAction);
    this.removeEventListener('mouseup', this._onAction);
    this.removeEventListener('touchend', this._onAction);
    this.removeEventListener('mouseleave', this._onLeave);
  }
  _onLeave() {
    this.pressed = false;
  }
  update() {
    this.render([['span', this.label]]);
  }
}

IoButton.Register();

class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'true',
      false: 'false'
    };
  }
  constructor(props) {
    super(props);
    this.__props.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

IoBoolean.Register();

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 120;
let lastFocus;

// TODO: make long (scrolling) menus work with touch
// TODO: implement search

class IoMenuLayer extends IoElement {
  static get style() {
    return html`<style>:host {display: block;visibility: hidden;position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 100000;background: rgba(0, 0, 0, 0.2);user-select: none;overflow: hidden;}:host[expanded] {visibility: visible;}</style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
        observer: '_onScrollAnimateGroup'
      },
      $groups: Array
    };
  }
  static get listeners() {
    return {
      'mouseup': '_onMouseup',
      'mousemove': '_onMousemove',
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredGroup = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('focusin', this._onWindowFocus);
  }
  registerGroup(group) {
    this.$groups.push(group);
    group.addEventListener('focusin', this._onMenuItemFocused);
    group.addEventListener('mouseup', this._onMouseup);
    group.addEventListener('keydown', this._onKeydown);
    group.addEventListener('expanded-changed', this._onExpandedChanged);
  }
  unregisterGroup(group) {
    this.$groups.splice(this.$groups.indexOf(group), 1);
    group.removeEventListener('focusin', this._onMenuItemFocused);
    group.removeEventListener('mouseup', this._onMouseup);
    group.removeEventListener('keydown', this._onKeydown);
    group.removeEventListener('expanded-changed', this._onExpandedChanged);
  }
  collapseAllGroups() {
    for (let i = this.$groups.length; i--;) {
      this.$groups[i].expanded = false;
    }
  }
  runAction(option) {
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      this.collapseAllGroups();
      if (lastFocus) lastFocus.focus();
    } else if (option.button) {
      option.button.click(); // TODO: test
      this.collapseAllGroups();
      if (lastFocus) lastFocus.focus();
    }
  }
  _onScroll() {
    this.collapseAllGroups();
    if (lastFocus) lastFocus.focus();
  }
  _onWindowFocus(event) {
    if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
  }
  _onMenuItemFocused(event) {
    let item = event.path[0];
    let expanded = [item.$group];
    let parent = item.$parent;
    while (parent) {
      expanded.push(parent);
      item.__menuroot = parent; // TODO: unhack
      parent = parent.$parent;
    }
    for (let i = this.$groups.length; i--;) {
      if (expanded.indexOf(this.$groups[i]) === -1) {
        this.$groups[i].expanded = false;
      }
    }
  }
  _onTouchmove(event) {
    this._onMousemove(event);
  }
  _onTouchend(event) {
    this._onMouseup(event);
  }
  _onMousemove(event) {
    this._x = event.clientX;
    this._y = event.clientY;
    this._v = Math.abs(event.movementY) - Math.abs(event.movementX);
    let groups = this.$groups;
    for (let i = groups.length; i--;) {
      if (groups[i].expanded) {
        let rect = groups[i].getBoundingClientRect();
        if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
          this._hover(groups[i]);
          this._hoveredGroup = groups[i];
          return groups[i];
        }
      }
    }
    this._hoveredItem = null;
    this._hoveredGroup = null;
  }
  _onMouseup(event) {
    let elem = event.path[0];
    if (elem.localName === 'io-menu-item') {
      this.runAction(elem.option);
      elem.__menuroot.dispatchEvent('io-menu-item-clicked', elem.option);
    } else if (elem === this) {
      if (this._hoveredItem) {
        this.runAction(this._hoveredItem.option);
        this._hoveredItem.__menuroot.dispatchEvent('io-menu-item-clicked', this._hoveredItem.option);
      } else if (!this._hoveredGroup) {
        this.collapseAllGroups();
        if (lastFocus) lastFocus.focus();
      }
    }
  }
  _onKeydown(event) {
    event.preventDefault();
    if (event.path[0].localName !== 'io-menu-item') return;

    let elem = event.path[0];
    let group = elem.$parent;
    let siblings = [...group.querySelectorAll('io-menu-item')] || [];
    let children = elem.$group ? [...elem.$group.querySelectorAll('io-menu-item')]  : [];
    let index = siblings.indexOf(elem);

    let command = '';

    if (!group.horizontal) {
      if (event.key == 'ArrowUp') command = 'prev';
      if (event.key == 'ArrowRight') command = 'in';
      if (event.key == 'ArrowDown') command = 'next';
      if (event.key == 'ArrowLeft') command = 'out';
    } else {
      if (event.key == 'ArrowUp') command = 'out';
      if (event.key == 'ArrowRight') command = 'next';
      if (event.key == 'ArrowDown') command = 'in';
      if (event.key == 'ArrowLeft') command = 'prev';
    }
    if (event.key == 'Tab') command = 'next';
    if (event.key == 'Escape') command = 'exit';
    if (event.key == 'Enter' || event.which == 32) command = 'action';

    switch (command) {
      case 'action':
        this._onMouseup(event); // TODO: test
        break;
      case 'prev':
        siblings[(index + siblings.length - 1) % (siblings.length)].focus();
        break;
      case 'next':
        siblings[(index + 1) % (siblings.length)].focus();
        break;
      case 'in':
        if (children.length) children[0].focus();
        break;
      case 'out':
        if (group && group.$parent) group.$parent.focus();
        break;
      case 'exit':
        this.collapseAllGroups();
        break;
      default:
        break;
    }
  }
  _hover(group) {
    let items = group.querySelectorAll('io-menu-item');
    for (let i = items.length; i--;) {
      let rect = items[i].getBoundingClientRect();
      if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
        let force = group.horizontal;
        this._focus(items[i], force);
        this._hoveredItem = items[i];
        return items[i];
      }
    }
    this._hoveredItem = null;
    this._hoveredItem = null;
  }
  _focus(item, force) {
    if (item !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this._v > 0 || item.parentNode !== previousParent || force || !item.option.options) {
        previousOption = item;
        item.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousOption = item;
          item.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = item.parentNode;
      timeoutReset = setTimeout(function() {
        previousOption = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _onExpandedChanged(event) {
    if (event.path[0].expanded) this._setGroupPosition(event.path[0]);
    for (let i = this.$groups.length; i--;) {
      if (this.$groups[i].expanded) {
        return this.expanded = true;
      }
    }
    return this.expanded = false;
  }
  _setGroupPosition(group) {
    if (!group.$parent) return;
    let rect = group.getBoundingClientRect();
    let pRect = group.$parent.getBoundingClientRect();
     // TODO: unhack horizontal long submenu bug.
    if (group.position === 'bottom' && rect.height > (window.innerHeight - this._y)) group.position = 'right';
    //
    switch (group.position) {
      case 'pointer':
        group._x = this._x - 2 || pRect.x;
        group._y = this._y - 2 || pRect.y;
        break;
      case 'bottom':
        group._x = pRect.x;
        group._y = pRect.bottom;
        break;
      case 'right':
      default:
        group._x = pRect.right;
        group._y = pRect.y;
        if (group._x + rect.width > window.innerWidth) {
          group._x = pRect.x - rect.width;
        }
        break;
    }
    group._x = Math.min(group._x, window.innerWidth - rect.width);
    group._y = Math.min(group._y, window.innerHeight - rect.height);
    group.style.left = group._x + 'px';
    group.style.top = group._y + 'px';
  }
  _onScrollAnimateGroup() {
    if (!this.expanded) return;
    let group = this._hoveredGroup;
    if (group) {
      let rect = group.getBoundingClientRect();
      if (rect.height > window.innerHeight) {
        if (this._y < 100 && rect.top < 0) {
          let scrollSpeed = (100 - this._y) / 5000;
          let overflow = rect.top;
          group._y = group._y - Math.ceil(overflow * scrollSpeed) + 1;
        } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
          let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
          let overflow = (rect.bottom - window.innerHeight);
          group._y = group._y - Math.ceil(overflow * scrollSpeed) - 1;
        }
        group.style.left = group._x + 'px';
        group.style.top = group._y + 'px';
      }
    }
    requestAnimationFrame(this._onScrollAnimateGroup);
  }
}

IoMenuLayer.Register();

IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);

class IoMenuItem extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;cursor: pointer;padding: 0.125em 0.5em 0.125em 1.7em;line-height: 1em;}:host > * {pointer-events: none;}:host > .menu-icon {width: 1.25em;margin-left: -1.25em;line-height: 1em;}:host > .menu-label {flex: 1}:host > .menu-hint {opacity: 0.5;padding: 0 0.5em;}:host > .menu-more {opacity: 0.5;margin: 0 -0.25em 0 0.25em;}</style>`;
  }
  static get properties() {
    return {
      option: Object,
      position: String,
      $parent: HTMLElement,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
      'touchstart': '_onTouchstart'
    };
  }
  static get menuroot() {
    return this;
  }
  update() {
    if (this.option.options) {
      let grpProps = {options: this.option.options, $parent: this, position: this.position};
      if (!this.$group) {
        this.$group = new IoMenuGroup(grpProps);
      } else {
        this.$group.setProperties(grpProps); // TODO: test
      }
    }
    this.render([
      this.option.icon ? ['span', {className: 'menu-icon'}] : null,
      ['span', {className: 'menu-label'}, this.option.label || this.option.value],
      this.option.hint ? ['span', {className: 'menu-hint'}] : null,
      this.option.options ? ['span', {className: 'menu-more'}, '▸'] : null,
    ]);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$group) {
      if (this.$group.parentNode) {
        IoMenuLayer.singleton.removeChild(this.$group);
      }
    }
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this.focus();
  }
  _onTouchmove(event) {
    event.preventDefault();
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  _onFocus() {
    if (this.$group) {
      if (!this.$group.parentNode) {
        IoMenuLayer.singleton.appendChild(this.$group);
      }
      this.$group.expanded = true;
    }
  }
}

IoMenuItem.Register();

class IoMenuGroup extends IoElement {
  static get style() {
    return html`<style>:host {display: none;flex-direction: column;white-space: nowrap;user-select: none;}:host[horizontal] {flex-direction: row;}:host:not([nested]) {background: white;padding: 0.125em 0 0.25em 0;border: 1px solid #666;box-shadow: 1px 1px 2px rgba(0,0,0,0.33);position: absolute;transform: translateZ(0);top: 0;left: 0;min-width: 6em;}:host[expanded],:host[nested] {display: flex;}:host[nested] > io-menu-item {padding: 0.25em 0.5em;}:host[nested] > io-menu-item > :not(.menu-label) {display: none;}</style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        type: Boolean,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      nested: {
        type: Boolean,
        reflect: true
      },
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus'
    };
  }
  update() {
    const Item = (elem, i) => ['io-menu-item', {
      $parent: this,
      option: typeof this.options[i] === 'object' ? this.options[i] : {value: this.options[i], label: this.options[i]},
      position: this.horizontal ? 'bottom' : 'right'
    }];
    this.render([this.options.map(Item)]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.nested = this.parentNode !== IoMenuLayer.singleton;
    IoMenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterGroup(this);
  }
  _onFocus(event) {
    let item = event.path[0];
    IoMenuLayer.singleton._hoveredGroup = this;
    if (item.localName === 'io-menu-item') {
      IoMenuLayer.singleton._hoveredItem = item;
      if (item.option.options) this.expanded = true;
    }
  }
}

IoMenuGroup.Register();

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      listener: 'click'
    };
  }
  constructor(props) {
    super(props);
    // BUG: bindings dont work in io-option sor some reason
    this.render([
      ['io-menu-group', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ]);
    this.$.group.__parent = this;
  }
  update() {
    // BUG: bindings dont work in io-option sor some reason
    this.$.group.options = this.options;
    this.$.group.position = this.position;
    this.$.group.expanded = this.expanded;
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.removeChild(this.$['group']);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onExpand(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    IoMenuLayer.singleton.collapseAllGroups();
    IoMenuLayer.singleton._x = evt.clientX;
    IoMenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();

class IoString extends IoElement {
  static get style() {
    return html`<style>:host {overflow: hidden;text-overflow: ellipsis;}:host:focus {overflow: hidden;text-overflow: clip;}</style>`;
  }
  static get properties() {
    return {
      value: String,
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'blur': '_onBlur',
      'keydown': '_onKeydown'
    };
  }
  _onBlur() {
    this.set('value', this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  update() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

IoString.Register();

class IoNumber extends IoString {
  static get properties() {
    return {
      value: Number,
      step: 0.001,
      min: -Infinity,
      max: Infinity
    };
  }
  _onBlur() {
    let value = Math.round(Number(this.innerText) / this.step) * this.step;
    if (!isNaN(value)) this.set('value', value);
    this.update();
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      let value = Math.round(Number(this.innerText) / this.step) * this.step;
      if (!isNaN(value)) this.set('value', value);
      this.update();
    }
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

IoNumber.Register();

class IoObject extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;flex: 0 0;line-height: 1em;}:host > div {display: flex;flex-direction: row;}:host > div > span {padding: 0 0.2em 0 0.5em;flex: 0 0 auto;}:host > io-number {color: rgb(28, 0, 207);}:host > io-string {color: rgb(196, 26, 22);}:host > io-boolean {color: rgb(170, 13, 145);}:host > io-option {color: rgb(32,135,0);}</style>`;
  }
  static get properties() {
    return {
      value: Object,
      props: Array,
      configs: Object,
      expanded: {
        type: Boolean,
        reflect: true
      },
      label: String
    };
  }
  static get listeners() {
    return {
      'value-set': '_onValueSet'
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].update();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].update();
        }
      }
    }
  }
  _onValueSet(event) {
    if (event.path[0] === this) return;
    if (event.detail.object) return; // TODO: fix
    event.stopPropagation();
    let key = event.path[0].id;
    if (key !== undefined) {
      if (this.value[key] !== event.detail.value) {
        this.value[key] = event.detail.value;
      }
      // console.log(event.detail);
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('io-object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, true); // TODO
    }
  }
  getPropConfigs(keys) {
    let configs = {};

    let proto = this.value.__proto__;
    while (proto) {
      let c = IoObjectConfig[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      c = this.configs[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = this.value[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      propConfigs[key] = {};

      if (configs.hasOwnProperty('type:' + type)) {
        propConfigs[key] = configs['type:' + type];
      }
      if (configs.hasOwnProperty('constructor:'+cstr)) {
        propConfigs[key] = configs['constructor:'+cstr];
      }
      if (configs.hasOwnProperty('key:' + key)) {
        propConfigs[key] = configs['key:' + key];
      }
      if (configs.hasOwnProperty('value:' + String(value))) {
        propConfigs[key] = configs['value:' + String(value)];
      }
    }
    return propConfigs;
  }
  update() {
    let label = this.label || this.value.constructor.name;
    let elements = [];
    if (this.expanded) {
      let keys = [...Object.keys(this.value), ...Object.keys(this.value.__proto__)];
      let proplist = this.props.length ? this.props : keys;
      let configs = this.getPropConfigs(proplist);
      for (let key in configs) {
        // TODO: remove props keyword
        let config = Object.assign({tag: configs[key].tag, value: this.value[key], id: key}, configs[key].props);
        if (this.value.__props && this.value.__props[key] && this.value.__props[key].config) {
          // TODO: test
          config = Object.assign(config, this.value.__props[key].config);
        }
        elements.push(['div', [['span', config.label || key + ':'], [config.tag, config]]]);
      }
    }
    this.render([['io-boolean', {true: '▾' + label, false: '▸' + label, value: this.bind('expanded')}], elements]);
  }
}

const IoObjectConfig = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.0001}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

IoObject.Register();

class IoOption extends IoButton {
  static get properties() {
    return {
      value: null,
      action: Function,
      options: Array
    };
  }
  _onAction(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
    }
  }
  _onUp(event) {
    super._onUp(event);
    this.$['menu'].expanded = true;
    let firstItem = this.$['menu'].$['group'].querySelector('io-menu-item');
    if (firstItem) firstItem.focus();
  }
  _onMenu(event) {
    // TODO: menu layer should close automatically
    // this.$['menu'].expanded = false;
    this.set('value', event.detail.value);
    if (typeof this.action === 'function') {
      this.action(this.value);
    }
  }
  update() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name;
    if (this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.__props.label.value = label;
    this.render([
      ['span', String(label)],
      ['io-menu', {
        id: 'menu',
        options: this.options,
        position: 'bottom',
        listener: 'click',
        listeners: {'io-menu-item-clicked': this._onMenu}}]
    ]);
  }
}

IoOption.Register();

const _clickmask = document.createElement('div');
_clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;";

let mousedownPath = null;

class Pointer {
  constructor(pointer = {}) {
    this.position = new Vector2(pointer.position);
    this.previous = new Vector2(pointer.previous);
    this.movement = new Vector2(pointer.movement);
    this.distance = new Vector2(pointer.distance);
    this.start = new Vector2(pointer.start);
  }
  getClosest(array) {
    let closest = array[0];
    for (let i = 1; i < array.length; i++) {
      if (this.position.distanceTo(array[i].position) < this.position.distanceTo(closest.position)) {
        closest = array[i];
      }
    }
    return closest;
  }
  update(pointer) {
    this.previous.set(this.position);
    this.movement.set(pointer.position).sub(this.position);
    this.distance.set(pointer.position).sub(this.start);
    this.position.set(pointer.position);
  }
}

class Vector2 {
  constructor(vector = {}) {
    this.x = vector.x || 0;
    this.y = vector.y || 0;
  }
  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  distanceTo(vector) {
    let dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  getClosest(array) {
    let closest = array[0];
    for (let i = 1; i < array.length; i++) {
      if (this.distanceTo(array[i]) < this.distanceTo(closest)) {
        closest = array[i];
      }
    }
    return closest;
  }
}

const IoPointerMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      pointers: Array,
      pointermode: 'relative'
    };
  }
  static get listeners() {
    return {
      'mousedown': '_onMousedown',
      'touchstart': '_onTouchstart',
      'mousemove': '_onMousehover'
    };
  }
  constructor(params) {
    super(params);
    this._clickmask = _clickmask;
  }
  getPointers(event, reset) {
    let touches = event.touches ? event.touches : [event];
    let foundPointers = [];
    let rect = this.getBoundingClientRect();
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].target === event.target || event.touches === undefined) {
        let position = new Vector2({
          x: touches[i].clientX,
          y: touches[i].clientY
        });
        if (this.pointermode === 'relative') {
          position.x -= rect.left;
          position.y -= rect.top;
        } else if (this.pointermode === 'viewport') {
          position.x = (position.x - rect.left) / rect.width * 2.0 - 1.0;
          position.y = (position.y - rect.top) / rect.height * 2.0 - 1.0;
        }
        if (this.pointers[i] === undefined) this.pointers[i] = new Pointer({start: position});
        let newPointer = new Pointer({position: position});
        let pointer = newPointer.getClosest(this.pointers);
        if (reset) pointer.start.set(position);
        pointer.update(newPointer);
        foundPointers.push(pointer);
      }
    }
    for (let i = this.pointers.length; i--;) {
      if(foundPointers.indexOf(this.pointers[i]) === -1) {
        this.pointers.splice(i, 1);
      }
    }
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    // TODO: fix
    mousedownPath = event.path;
    this.getPointers(event, true);
    this._fire('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    window.addEventListener('blur', this._onMouseup); //TODO: check pointer data
    // TODO: clickmask breaks scrolling
    if (_clickmask.parentNode !== document.body) {
      document.body.appendChild(_clickmask);
    }
  }
  _onMousemove(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers, mousedownPath);
  }
  _onMouseup(event) {
    this.getPointers(event);
    this._fire('io-pointer-end', event, this.pointers, mousedownPath);
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
    window.removeEventListener('blur', this._onMouseup);
    if (_clickmask.parentNode === document.body) {
      document.body.removeChild(_clickmask);
    }
  }
  _onMousehover(event) {
    this.getPointers(event);
    this._fire('io-pointer-hover', event, this.pointers);
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-hover', event, this.pointers);
    this._fire('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
  }
  _onTouchmove(event) {
    event.preventDefault();
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    this._fire('io-pointer-end', event, this.pointers);

  }
  _fire(eventName, event, pointer, path) {
    this.dispatchEvent(eventName, {event: event, pointer: pointer, path: path || event.path}, false);
  }
};

class IoSlider extends IoPointerMixin(IoElement) {
  static get style() {
    return html`<style>:host {display: inline-block;cursor: ew-resize;min-width: 6em;min-height: 1.22em;position: relative;vertical-align: bottom;}:host > .io-slider-slit {position: absolute;width: 100%;height: 0.2em;top: calc(50% - 0.1em);}:host > .io-slider-knob {position: absolute;width: 0.4em;margin-left: -0.2em;height: 100%;background: #999;left: calc(50%);}</style>`;
  }
  static get properties() {
    return {
      value: Number,
      step: 0.01,
      min: 0,
      max: 100,
      pointermode: 'relative',
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'io-pointer-move': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    let rect = this.getBoundingClientRect();
    let x = event.detail.pointer[0].position.x / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    // TODO: implement step
    this.set('value', this.min + (this.max - this.min) * pos);
  }
  update() {
    let pos = 100 * (this.value - this.min) / (this.max - this.min);
    this.render([
      ['div', {className: 'io-slider-slit', style: {
          background: 'linear-gradient(to right, #2cf, #2f6 ' + pos + '%, #333 ' + (pos + 1) + '%)'}}],
      ['div', {className: 'io-slider-knob', style: {left: pos + '%'}}]
    ]);
  }
}

IoSlider.Register();

const __debounceTimeout = new WeakMap();

function debounce(func, wait) {
  clearTimeout(__debounceTimeout.get(func));
  __debounceTimeout.set(func, setTimeout(func, wait));
}

function path(path, importurl) {
  return new URL(path, importurl).pathname;
}

export { html, IoElement, IoNode, IoBoolean, IoButton, IoMenu, IoNumber, IoObject, IoOption, IoSlider, IoString, Vector2, IoPointerMixin, debounce, path };
