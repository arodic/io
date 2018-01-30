import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoInspectorProp extends IoObjectProperty {
  static get style() {
    return html`
      <style>
        :host > .io-link {
          color: #fc8;
        }
        :host io-boolean {
          color: #9c8;
        }
        :host io-string {
          background: #555;
          color: #f9e;
        }
        :host io-number {
          background: #555;
          color: #bef;
        }
        :host io-vector > io-object-prop > io-number,
        :host io-color > io-object-prop > io-number {
          background: #555;
          margin-right: 2px;
        }
        :host io-color > io-object-prop > io-number:last-of-type,
        :host io-vector > io-object-prop > io-number:last-of-type {
          margin-right: 0;
        }
      </style>
    `;
  }
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          padding: 1px 0;
          font-weight: lighter;
        }
        ::slotted(:nth-child(2)) {
          margin: 0 2px 0 0;
          flex: 1;
        }
        ::slotted(.io-link),
        ::slotted(.io-label) {
          display: inline-block;
          width: 8em;
          text-align: right;
          margin: 0 2px 0 2px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        ::slotted(.io-link) {
          color: blue;
          cursor: pointer;
        }
        ::slotted(.io-link):after,
        ::slotted(.io-label):after {
          content: ":";
        }
      </style>
    `;
  }
  _update() {
    let isObject = typeof this.value[this.key] === 'object' && this.value[this.key] !== null;
    this.render([
      ['span', {className: isObject ? 'io-link' : 'io-label'}, this.key],
      [this.config.tag, Object.assign({value: this.value[this.key], label: this.config.tag !== 'io-object' ? this.key : null, listeners: {'value-set': this._valueSetHandler}}, this.config.props) ]
      // this.config.tag !== 'io-object' ? [this.config.tag, Object.assign({value: this.value[this.key], label: this.key, listeners: {'value-set': this._valueSetHandler}}, this.config.props) ] : null
    ]);
  }
}


window.customElements.define('io-inspector-prop', IoInspectorProp);
