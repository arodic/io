import {html, IoElement, debounce} from "../core.js";

const selection = window.getSelection();
const range = document.createRange();

export class IoString extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
      }
    </style>`;
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
      'focus': '_onFocus',
      'blur': '_onBlur',
      'keydown': '_onKeydown'
    };
  }
  _onFocus() {
    debounce(this._select);
  }
  _select() {
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
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