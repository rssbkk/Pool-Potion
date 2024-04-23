
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uWindStrength;
uniform float uGrassBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;

varying float vVertexHeight;
varying vec3 vColor;
varying vec2 vGlobalUV;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vWindColor;

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

}