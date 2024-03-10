export default [
    {
        name: 'background',
        type: 'gltf',
        path: 'models/ruin-scene-draft-one.glb'
    },
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
        name: 'grass',
        type: 'gltf',
        path: 'models/gass-anim-draft-two.glb'
    },
    {
        name: 'landscape',
        type: 'gltf',
        path: 'models/ruin-scene-draft-one.glb'
    }
]

// // BACKGROUND SCENE

// gltfLoader.load('/ruin-scene-draft-one.glb', (gltf) => 
// {
//     gltf.scene.scale.set(0.25, 0.25, 0.25);

//     const materialChange = gltf.scene.children;
//     materialChange.forEach( (mesh) =>
//     {
//         mesh.material = sceneMaterial;
//     });

//     // gltf.scene.children[0].material.color = new THREE.Color( 0xffffff );
//     // gltf.scene.children[1].material.color = new THREE.Color( 0xff000 );
//     // gltf.scene.children[2].material.color = new THREE.Color( 0xfff );
//     // gltf.scene.children[3].material.color = new THREE.Color( 0xfff );
//     // gltf.scene.children[4].material.color = new THREE.Color( 0xfff );
//     // gltf.scene.children[5].material.color = new THREE.Color( 0xfff );
//     // gltf.scene.children[6].material.color = new THREE.Color( 0xfff );
//     // gltf.scene.children[7].material.color = new THREE.Color( 0xfff );

//     // scene.add(gltf.scene);