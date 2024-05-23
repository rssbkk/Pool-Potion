precision mediump float;

uniform sampler2D uNoiseTexture;
uniform vec3 uTipColor1;
uniform vec3 uTipColor2;
uniform vec3 uTipColor3;
uniform vec3 uBaseColor1;
uniform vec3 uBaseColor2;

varying float vVertexHeight;
varying vec4 vNoise;
varying vec3 textureColor;
varying float noiseControl;

void main() 
{
    vec3 tipColor = mix(uTipColor3, uTipColor1, noiseControl);
    vec3 grassColor = mix(uBaseColor1, tipColor, vVertexHeight);

    gl_FragColor = vec4(grassColor, 1.0);
}