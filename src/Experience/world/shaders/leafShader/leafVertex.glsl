
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uWindStrength;
uniform float uGrassBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;

attribute float instancePhase;

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

    vec4 worldPosition = instanceMatrix * vec4(newPosition, 1.0);

    worldPosition += sin(uTime * 5.0 + instancePhase) * 0.01;

    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;

}