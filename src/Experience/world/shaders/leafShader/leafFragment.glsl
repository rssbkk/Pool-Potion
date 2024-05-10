varying float vHeightFactor;

uniform vec3 uLeafColor1;
uniform vec3 uLeafColor2;
uniform vec3 uLeafColor3;

// void main() {
//     float randomFactor = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
//     vec3 color = mix(mix(uLeafColor3, uLeafColor2, smoothstep(0.3, 0.5, vHeightFactor)), uLeafColor1, smoothstep(0.5, 0.7, vHeightFactor));
//     color = mix(color, vec3(randomFactor), 0.1); // Adding slight randomness
//     gl_FragColor = vec4(color, 1.0);
// }

void main()
{
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}