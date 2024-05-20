precision mediump float;

uniform vec3 uTipColor1;
uniform vec3 uTipColor2;
uniform vec3 uTipColor3;
uniform vec3 uBaseColor1;
uniform vec3 uBaseColor2;


uniform sampler2D uNoiseTexture;

varying float vVertexHeight;
varying vec2 vUv;

void main() 
{
    float testTexture = texture2D(uNoiseTexture, vUv).r;

    vec3 grassColor = mix(uBaseColor1, uTipColor3, vVertexHeight);
    gl_FragColor = vec4(0.0, vUv, 1.0);
}