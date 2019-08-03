import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSliderSv extends IoColorSlider {
  static get Style() {
    return html`<style>
      :host {
        cursor: move !important;
      }
    </style>`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // SV gradient
        vec2 axis = (uHorizontal == 1) ? vec2(vUv.y, vUv.x) : vec2(vUv.x, vUv.y);
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], axis.x, axis.y));

        // Marker
        vec2 markerPos = translateSlider(position, vec2(uHsv[2], uHsv[1]));
        vec4 slider = paintSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(_x, _y) {
    this.valueChanged();
    const x = Math.max(0, Math.min(1, this.horizontal ? (1 - _y) : _x));
    const y = Math.max(0, Math.min(1, this.horizontal ? _x : (1 - _y)));
    switch (this.mode) {
      case 0:
        this.hsv[1] = x;
        this.hsv[2] = y;
        const rgb = convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]);
        this.value[this.components[0]] = rgb[0] / 255;
        this.value[this.components[1]] = rgb[1] / 255;
        this.value[this.components[2]] = rgb[2] / 255;
        break;
      case 3:
        this.hsv[1] = x;
        this.hsv[2] = y;
        const cmyk = convert.rgb.cmyk(convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = cmyk[0] / 100;
        this.value[this.components[1]] = cmyk[1] / 100;
        this.value[this.components[2]] = cmyk[2] / 100;
        this.value[this.components[3]] = cmyk[3] / 100;
        break;
      case 1:
        this.value[this.components[1]] = x;
        this.value[this.components[2]] = y;
        break;
      case 2:
        this.hsv[1] = x;
        this.hsv[2] = y;
        const hsl = convert.rgb.hsl(convert.hsv.rgb([
          this.hsv[0] * 100,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = hsl[0] / 100;
        this.value[this.components[1]] = hsl[1] / 100;
        this.value[this.components[2]] = hsl[2] / 100;
        break;
    }
  }
}

IoColorSliderSv.Register();
