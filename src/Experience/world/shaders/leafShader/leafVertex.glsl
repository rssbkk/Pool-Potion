
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uWindStrength;
uniform float uGrassBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;

attribute vec3 translate; // positions

void main() 
{
    vec2 noisePos = position.xy * 0.1 + vec2(uTime * 0.0005); // Adjust scale and time influence as needed
    float noiseValue = texture2D(uNoiseTexture, noisePos).r; // Using red channel for noise

    float angle = sin(uTime * 0.001 + noiseValue * 3.14);
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
            