uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;
uniform float uStrength;

attribute vec3 offset; // Offset for instancing
attribute vec3 position;

varying vec3 vWorldPos;

void main() 
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}

// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

// uniform float time; // Time for wind animation

// attribute vec3 position;
// attribute vec3 offset; // Offset for instancing

// varying vec3 vWorldPos;

// void main() 
// {
//     vWorldPos = (modelMatrix * vec4(position + offset, 1.0)).xyz;
//     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position + offset, 1.0);

//     // Animate grass blades based on time and position
//     float angle = sin(time + vWorldPos.x) * sin(time + vWorldPos.z);
//     vec3 bent = vec3(sin(angle), 0.0, cos(angle));
//     gl_Position.xyz += bent;
// }