import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

export class UiCollapsable extends Io {
  static get properties() {
    return {
      label: {
        type: String
      },
      expanded: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_update'
      },
      elements: {
        type: Array,
        observer: '_update'
      }
    }
  }
  _update() {
    this.render([
        ['io-boolean', {true: '▾' + this.label, false: '▸' + this.label, value: this.bind('expanded')}],
        this.expanded ? this.elements : null
    ]);
  }
}

window.customElements.define('io-collapsable', UiCollapsable);
