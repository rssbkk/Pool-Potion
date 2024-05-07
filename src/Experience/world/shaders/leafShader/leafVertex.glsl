
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;
uniform float uWindStrength;
uniform float uLeafRootBend;
uniform float uNoiseSpeed;
uniform float uTerrainSize;
uniform float uColorOffset;
uniform vec3 uCameraPosition;

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
    vec3 viewPos = position * instancePhase;
    vec4 mvPosition = modelViewMatrix * vec4(viewPos, 1.0);
    mvPosition.xyz += cameraPosition - mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}