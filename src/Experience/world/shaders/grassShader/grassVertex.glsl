
uniform float uTime;
uniform float uStrength;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;

attribute vec3 offset; // Offset for instancing

varying float vVertexHeight;
varying vec3 vColor;
varying vec2 vGlobalUV;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vWindColor;

void main() 
{
    // Wind variables
    vec2 uWindDirection = vec2(1.0,1.0);
    float uWindAmp = 0.1;
    float uWindFreq = 50.;
    float uSpeed = 1.0;
    float uNoiseFactor = 5.50;
    float uNoiseSpeed = 0.001;

    vec2 windDirection = normalize(uWindDirection); // Normalize the wind direction
    vec4 modelPosition = modelMatrix  * vec4(position, 1.0); // (* instanceMatrix) removed for no instacne yet

    float terrainSize = 100.;
    vGlobalUV = (terrainSize-vec2(modelPosition.xz))/terrainSize;

    vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

    float sinWave = sin(uWindFreq*dot(windDirection, vGlobalUV) + noise.g*uNoiseFactor + uTime * uSpeed) * uWindAmp * (uv.y);

    float xDisp = sinWave;
    float zDisp = sinWave;
    modelPosition.x += xDisp;
    modelPosition.z += zDisp;

    // use perlinNoise to vary the terrainHeight of the grass
    //modelPosition.y += exp(texture2D(uNoiseTexture,vGlobalUV * uNoiseScale).r) * 0.5 * (1.0 - uv.y);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // assign varyings
    // vUv = vec2(uv.x,1.-uv.y);
    // vNormal = normalize(normalMatrix * normal);
    // vWindColor = vec2(xDisp,zDisp);
    // vViewPosition = mvPosition.xyz;
    vVertexHeight = modelPosition.y * 3.0;
}

// PREVIOUSLT WORKING CODE
// void main() 
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;

//     vVertexHeight = modelPosition.y * 3.0;
// }