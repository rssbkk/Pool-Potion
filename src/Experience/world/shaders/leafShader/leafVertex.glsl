
uniform float uTime;

attribute vec3 translate; // positions

void main() 
{
    float angle = sin(uTime * 0.001);
    float cosRoll = cos(angle);
    float sinRoll = sin(angle);

    mat4 rollMatrix = mat4(
        cosRoll, -sinRoll, 0.0, 0.0,
        sinRoll, cosRoll, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    vec4 rotatedPosition = rollMatrix * vec4(position, 1.0);

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(translate, 1.0);
    mvPosition.xyz += position;
    mvPosition += rotatedPosition;

    gl_Position = projectionMatrix * mvPosition;
}
            