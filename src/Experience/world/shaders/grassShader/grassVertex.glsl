
uniform float uTime;
uniform float uStrength;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;

varying float vVertexHeight;
varying vec3 vColor;
varying vec2 vGlobalUV;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vWindColor;

// void main() 
// {
//     // Wind variables
//     vec2 uWindDirection = vec2(1.0,1.0);
//     float uWindAmp = 0.1;
//     float uWindFreq = 50.;
//     float uSpeed = 1.0;
//     float uNoiseFactor = 5.50;
//     float uNoiseSpeed = 0.001;

//     vec2 windDirection = normalize(uWindDirection); // Normalize the wind direction
//     vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0); // (* instanceMatrix)

//     float terrainSize = 100.;
//     // vGlobalUV = (terrainSize-vec2(modelPosition.xz))/terrainSize;
//     vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

//     float sinWaveX = sin(uWindFreq*dot(windDirection, vGlobalUV) + noise.g*uNoiseFactor + uTime * uSpeed) * uWindAmp * (uv.y);
//     float cosWaveZ = cos(uWindFreq*dot(windDirection, vGlobalUV) + noise.b*uNoiseFactor + uTime * uSpeed) * uWindAmp * (uv.y);

//     float xDisp = sinWaveX;
//     float zDisp = cosWaveZ;
//     modelPosition.x += xDisp;
//     modelPosition.z += zDisp;

//     // use perlinNoise to vary the terrainHeight of the grass
//     // modelPosition.y += exp(texture2D(uNoiseTexture,vGlobalUV * uNoiseScale).r) * 0.5 * (uv.y);

//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;
//     gl_Position = projectedPosition;

//     // assign varyings
//     // vUv = vec2(uv.x,1.-uv.y);
//     // vNormal = normalize(normalMatrix * normal);
//     // vWindColor = vec2(xDisp,zDisp);
//     // vViewPosition = mvPosition.xyz;
//     vVertexHeight = modelPosition.y * 3.0;
// }

void main()
{
    float uWindStrength = 4.5;
    float uGrassBend = 1.85;
    float uNoiseSpeed = 0.01;
    float terrainSize = 400.;
    
    vec3 newPosition = position;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0); // (* instanceMatrix)
    vGlobalUV = (terrainSize-vec2(modelPosition.xz))/terrainSize;
    vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

    vec2 windOffset = vec2(
        texture(uNoiseTexture, vec2(0.25, uTime * 0.05) + noise.xz).r - 0.25,
        texture(uNoiseTexture, vec2(0.75, uTime * 0.025) + noise.xz).r - 0.5
    );
    windOffset *= pow(uv.y, uGrassBend) / uWindStrength;
    newPosition.xz += windOffset;

    vec4 worldPosition = instanceMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}