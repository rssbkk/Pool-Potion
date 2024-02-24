uniform float uTime;

attribute vec3 aPosition;

void main() {
    vec3 pos = aPosition;
    
    // Simple wind effect
    float windStrength = sin(pos.x * 0.1 + uTime) * 0.1;
    pos.y += windStrength * sin(uTime);
    
    vec4 modelPosition = modelMatrix * vec4(position + pos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}