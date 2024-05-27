precision mediump float;

uniform vec3 uBaseColor;
uniform vec3 uTipColor;

varying float vVertexHeight;

void main() 
{
    vec3 shroomColor = mix(uBaseColor, uTipColor, vVertexHeight);
    float intensity = vVertexHeight;  

    gl_FragColor = vec4(intensity, 0.0, intensity, 1.0);
}