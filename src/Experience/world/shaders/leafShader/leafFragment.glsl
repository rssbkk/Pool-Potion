uniform sampler2D uFoliageImage;
uniform vec3 uLeafColor1;
uniform vec3 uLeafColor2;
uniform vec3 uLeafColor3;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    // Fresnel
    // vec3 viewDirection = normalize(vPosition - cameraPosition);
    // float fresnel = dot(viewDirection, vNormal) + 1.0;

    // Foliage Alpha
    vec4 textureColor = texture2D(uFoliageImage, vUv);

    // Final Color
    gl_FragColor = vec4(vec3(1.0), textureColor);
    if (gl_FragColor.a < 0.95) discard;
}