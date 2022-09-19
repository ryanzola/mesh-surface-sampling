uniform sampler2D uFBOTexture;
uniform sampler2D uMaskTexture;
uniform float uSize;

attribute vec2 aFboUv;
attribute float aSize;
attribute float aAlpha;

varying float vAlpha;
varying vec2 vUv;

void main()
{
  vAlpha = aAlpha;
  vUv = uv;
    vec4 fboColor = texture2D(uFBOTexture, aFboUv);

    vec4 modelPosition = modelMatrix * vec4(fboColor.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float lifeSize = min((1.0 - fboColor.a) * 10.0, fboColor.a * 2.0);
    lifeSize = clamp(lifeSize, 0.0, 1.0);

    gl_PointSize = uSize * lifeSize * aSize * 50.0;
    gl_PointSize *= (1.0 / - viewPosition.z);

}