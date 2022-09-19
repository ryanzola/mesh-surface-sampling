uniform vec3 iResolution;
uniform sampler2D uTexture;

uniform sampler2D uMaskTexture;

varying float vAlpha;
varying vec2 vUv;

void main() {
  vec3 tex = texture2D(uTexture, vUv).rgb;
  float mask = texture2D(uMaskTexture, gl_PointCoord).r;

  gl_FragColor = vec4(tex, mask * vAlpha);
}
