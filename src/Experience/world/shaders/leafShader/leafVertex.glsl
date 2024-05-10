uniform float uEffectBlend;
uniform float uRemap;
uniform float uNormalize;

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float prevMin, float prevMax, float newMin, float newMax) {
  float t = inverseLerp(v, prevMin, prevMax);
  return mix(newMin, newMax, t);
}

void main() {
  vUv = uv;

  vec2 vertexOffset = vec2(
    remap(uv.x, 0.0, 1.0, -uRemap, 1.0),
    remap(uv.y, 0.0, 1.0, -uRemap, 1.0)
  );

  vertexOffset *= vec2(-1.0, 1.0);

  if (uRemap == 1.0) {
    vertexOffset = mix(vertexOffset, normalize(vertexOffset), uNormalize);
  }

  vec4 worldViewPosition = modelViewMatrix * vec4(position, 1.0);

  worldViewPosition += vec4(mix(vec3(0.0), vec3(vertexOffset, 1.0), uEffectBlend), 0.0);

  gl_Position = projectionMatrix * worldViewPosition;
}


// void main()
// {
//     vec4 localPosition = vec4(position, 1.0);

//     vec4 modelPosition = modelMatrix * instanceMatrix * localPosition; // (* instanceMatrix)
//     vGlobalUV = (uTerrainSize-vec2(modelPosition.xz)) / uTerrainSize;
//     vec4 noise = texture2D( uNoiseTexture, vGlobalUV + uTime * 0.0001 );
//     float noiseValue = noise.r;

//     float angle = mix(-2.14, 3.64, noiseValue);
//     float cosRoll = cos(angle);
//     float sinRoll = sin(angle);

//     mat4 rollMatrix = mat4(
//         cosRoll, -sinRoll, 0.0, 0.0,
//         sinRoll, cosRoll, 0.0, 0.0,
//         0.0, 0.0, 1.0, 0.0,
//         0.0, 0.0, 0.0, 1.0
//     );
    
//     vec4 rotatedPosition = rollMatrix * localPosition;

//     vec4 mvPosition = modelViewMatrix * instanceMatrix * rotatedPosition;
//     mvPosition.xyz += position;

//     gl_Position = projectionMatrix * mvPosition;

//     vHeightFactor = aHeightFactor;
// }

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
            