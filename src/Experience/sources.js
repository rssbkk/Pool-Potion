export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'potionGeometry',
        type: 'gltf',
        path: 'models/potionGeometry.glb'
    },
    {
        name: 'landscape',
        type: 'gltf',
        path: 'models/ruin-scene-draft-two.glb'
    },
    {
        name: 'tree',
        type: 'gltf',
        path: 'models/tree.glb'
    },
    {
        name: 'perlinNoiseImage',
        type: 'image',
        path: 'images/perlin.png'
    },
    {
        name: 'foliageImage',
        type: 'image',
        path: 'images/foliage.png'
    }
]