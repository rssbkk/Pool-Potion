precision mediump float;

// void main() 
// {
//     gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // Red color
// }

uniform vec3 topColor;
uniform vec3 bottomColor;

varying vec3 vWorldPos;

void main() 
{
    // Blend grass color based on height (y position)
    float height = vWorldPos.y;
    vec3 grassColor = mix(bottomColor, topColor, height);
    gl_FragColor = vec4(grassColor, 1.0);
}