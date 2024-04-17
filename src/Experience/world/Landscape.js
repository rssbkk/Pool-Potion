import * as THREE from 'three';

import Experience from '../Experience.js';

export default class Landscape
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;

        if(this.debug.active)
        {
            this.LandscapeTweaks = this.debug.pane.addFolder({
                title: 'Landscape',
                expanded: false
            });
            this.debugObject = {};
        }
        this.createLandscape();
        this.seperateParts();
    }

    createLandscape()
    {
        this.model = this.experience.resources.items.landscape.scene;

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = this.toonMaterial;
            }
        })
        this.scene.add(this.model);
    }

    seperateParts()
    {
        this.leaves = [];

        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('leaf'))
            {
                this.leaves.push(child)
            }
        });

        this.leafRoot = this.leaves.shift();

        this.leaves.forEach((leaf, index) => 
        {
            // Generate a random color
            const color = new THREE.Color(Math.random(), 1, Math.random());
            
            // Create a new material with the random color
            const material = new THREE.MeshStandardMaterial({color: color});
          
            // Apply the new material to the leaf
            leaf.material = material;
        });
    }
}

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
// });