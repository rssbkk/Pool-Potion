precision mediump float;

// void main() 
// {
//     gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // Red color
// }

uniform vec3 uTipColor1;
uniform vec3 uTipColor2;
uniform vec3 uTipColor3;
uniform vec3 uBaseColor1;
uniform vec3 uBaseColor2;

varying float vVertexHeight;

void main() 
{
    // Blend grass color based on height (y position)
    
    vec3 grassColor = mix(uBaseColor1, uTipColor3, vVertexHeight);
    gl_FragColor = vec4(grassColor, 1.0);
}