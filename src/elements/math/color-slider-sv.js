import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";
import {chunk} from "../../io-elements-core.js";

export class IoColorSliderSv extends IoColorSlider {
  static get Style() {
    return html`<style>
      :host {
        cursor: move;
      }
    </style>`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}
      ${chunk.translate}
      ${chunk.checker}
      ${chunk.circle}

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));
        vec3 finalColor = alphaPattern;

        vec3 currentColor = hsv2rgb(uValue.xyz);

        // SV gradient
        finalColor = hsv2rgb(vec3(uValue[0], vUv.x, vUv.y));

        // Marker
        float posX = uSize.x * uValue[1];
        float posY = uSize.y * uValue[2];
        float radius = cssItemHeight / 2.5;

        vec2 markerPos = translate(position, posX, posY);

        float circleStrokeShape = circle(markerPos, radius + cssStrokeWidth);
        finalColor = mix(cssColor.rgb, finalColor, circleStrokeShape);

        float circleShape = circle(markerPos, radius);
        finalColor = mix(cssBackgroundColor.rgb, finalColor, circleShape);

        float circleInnerShape = circle(markerPos, radius - cssStrokeWidth);
        finalColor = mix(mix(alphaPattern, currentColor.rgb, saturate(uValue.a)), finalColor, circleInnerShape);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.value[this._c[1]] = Math.max(0, Math.min(1, x));
    this.value[this._c[2]] = Math.max(0, Math.min(1, 1 - y));
  }
}

IoColorSliderSv.Register();