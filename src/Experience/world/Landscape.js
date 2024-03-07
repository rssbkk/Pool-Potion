import * as THREE from 'three';

import Experience from '../Experience.js';
import ToonMaterial from './ToonMaterial.js';

export default class Landscape
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = new ToonMaterial().toonMaterial;

        if(this.debug.active)
        {
            this.LandscapeTweaks = this.debug.gui.addFolder('Landscape');
            this.debugObject = {};
            this.LandscapeTweaks.close();
        }

        this.createLandscape();
    }

    createLandscape()
    {
        this.model = this.experience.resources.items.landscape.scene
        this.model.scale.set(0.25, 0.25, 0.25);

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = this.toonMaterial;
            }
        })

        console.log(this.model);

        this.scene.add(this.model);
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