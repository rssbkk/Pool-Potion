
uniform float uTime;

attribute vec3 translate; // positions

void main() 
{
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(translate, 1.0);
    mvPosition.xyz += position; // apply translation
    gl_Position = projectionMatrix * mvPosition;
}
            