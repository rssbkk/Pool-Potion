
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uWindStrength;
uniform float uGrassBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;

attribute vec3 translate; // positions
attribute float aHeightFactor; // positions

varying vec2 vGlobalUV;
varying float vHeightFactor;

void main()
{
    vec4 localPosition = vec4(position, 1.0);

    vec4 modelPosition = modelMatrix * instanceMatrix * localPosition; // (* instanceMatrix)
    vGlobalUV = (uTerrainSize-vec2(modelPosition.xz)) / uTerrainSize;
    vec4 noise = texture2D( uNoiseTexture, vGlobalUV + uTime * 0.0001 );
    float noiseValue = noise.r;

    float angle = mix(-2.14, 3.64, noiseValue);
    float cosRoll = cos(angle);
    float sinRoll = sin(angle);

    mat4 rollMatrix = mat4(
        cosRoll, -sinRoll, 0.0, 0.0,
        sinRoll, cosRoll, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    
    vec4 rotatedPosition = rollMatrix * localPosition;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * rotatedPosition;
    mvPosition.xyz += position;

    gl_Position = projectionMatrix * mvPosition;

    vHeightFactor = aHeightFactor;
}

// void main() 
// {
//     vec3 newPosition = position;

//     vec2 noisePos = newPosition.xy * 0.1 + vec2(uTime * 0.0005); // Adjust scale and time influence as needed
//     float noiseValue = texture2D(uNoiseTexture, noisePos).r; // Using red channel for noise

//     float angle = sin(uTime * 0.001 + noiseValue * 3.14);
//     float cosRoll = cos(angle);
//     float sinRoll = sin(angle);

//     mat4 rollMatrix = mat4(
//         cosRoll, -sinRoll, 0.0, 0.0,
//         sinRoll, cosRoll, 0.0, 0.0,
//         0.0, 0.0, 1.0, 0.0,
//         0.0, 0.0, 0.0, 1.0
//     );

//     vec4 rotatedPosition = rollMatrix * vec4(position, 1.0);

//     vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(translate, 1.0);
//     mvPosition.xyz += position;
//     mvPosition += rotatedPosition;

//     gl_Position = projectionMatrix * mvPosition;
// }
            