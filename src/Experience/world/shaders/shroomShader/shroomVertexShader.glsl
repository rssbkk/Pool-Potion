varying float vVertexHeight;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Varyings
    vVertexHeight = position.y / 2000.0;

}