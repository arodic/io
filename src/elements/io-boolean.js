import {IoButton} from "./io-button.js";

export class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'yes',
      false: 'no'
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
