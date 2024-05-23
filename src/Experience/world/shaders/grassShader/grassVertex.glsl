
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uPerlinRange;
uniform float uNoiseScale;
uniform float uTextureScale;
uniform float uWindStrength;
uniform float uGrassBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;

attribute vec3 instancePosition;

varying float vVertexHeight;
varying vec2 vGlobalUV;
varying vec2 vUv;
varying vec2 vGuv;
varying vec4 vNoise;
varying vec3 textureColor;
varying float noiseControl;


void main()
{
    vec3 newPosition = position;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0); // (* instanceMatrix)
    vGlobalUV = (uTerrainSize-vec2(modelPosition.xz)) / uTerrainSize;
    vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

    vec2 windOffset = vec2(
        texture(uNoiseTexture, vec2(0.25, uTime * 0.05) + noise.xz).r - 0.25,
        texture(uNoiseTexture, vec2(0.75, uTime * 0.025) + noise.xz).r - 0.5
    );
    windOffset *= pow(uv.y, uGrassBend) / uWindStrength;
    newPosition.xz += windOffset;


    vec4 worldPosition = instanceMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;

    // Varyings
    vVertexHeight = modelPosition.y;
    vVertexHeight *= uColorOffset;

    vec4 vNoise = texture2D(uNoiseTexture, instancePosition.xz * uTextureScale);
    textureColor = pow(vNoise.rgb, vec3(uPerlinRange));
    noiseControl = clamp(textureColor.r * 10.5 - 1.25, 0.0, 1.0);

}