precision mediump float;

uniform vec3 uBaseColor;
uniform vec3 uTipColor;

varying vec2 vUv;

void main() 
{
    gl_FragColor = vec4( vUv.x * 0.15,vUv.y * 0.25, 0, 0.2);
}