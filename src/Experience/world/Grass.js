import * as THREE from 'three';
import Experience from '../Experience.js';
import Floor from './Floor.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

export default class Grass
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        this.floor = new Floor();

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Grass');
            this.debugObject = {};
        }

        this.createInstance();
    }

    createInstance()
    {
        const sampler = new MeshSurfaceSampler(this.floor.groundMesh).build();

        const testSphereGeometry = new THREE.BoxGeometry( 1, 5);
        const testSphereMaterial = new THREE.MeshBasicMaterial();

        const instanceCount = 200;

        // Create an instanced mesh with the given geometry and material
        const instancedMesh = new THREE.InstancedMesh( testSphereGeometry, testSphereMaterial, instanceCount);
    
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const normal = new THREE.Vector3();
    
        // Sample positions on the surface of the geometry for each instance
        for (let i = 0; i < instanceCount; i++) {
            sampler.sample(position, normal);
    
            // Optionally, align the instance with the normal
            dummy.position.copy(position);
            // dummy.lookAt(normal.add(position));
            dummy.updateMatrix();
            dummy.scale.setScalar(Math.random() * 0.01 + 0.02);
    
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(instancedMesh);
    }
}

// // //sampler
// // const sampler = new MeshSurfaceSampler(leafShape).build();

// // // Define the material outside the loader if it's not dependent on the loaded model

// // // Function to create and add an instanced mesh to the scene using MeshSurfaceSampler
// // function createInstancedMesh(geometry, material, instanceCount) {
// //     // Create an instanced mesh with the given geometry and material
// //     const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

// //     const dummy = new THREE.Object3D();
// //     const position = new THREE.Vector3();
// //     const normal = new THREE.Vector3();

// //     // Sample positions on the surface of the geometry for each instance
// //     for (let i = 0; i < instanceCount; i++) {
// //         sampler.sample(position, normal);

// //         // Optionally, align the instance with the normal
// //         dummy.position.copy(position);
// //         dummy.lookAt(normal.add(position));
// //         dummy.updateMatrix();
// //         dummy.scale.setScalar(Math.random() * 0.01 + 0.02);

// //         instancedMesh.setMatrixAt(i, dummy.matrix);
// //     }

// //     // Add the instanced mesh to the scene
// //     scene.add(instancedMesh);
// // }



// // // Create a dummy Vector to store the sampled coordinates
// // const tempPosition = new THREE.Vector3();
// // // Create a dummy 3D object to generate the Matrix of each sphere
// // const tempObject = new THREE.Object3D();
// // // Loop as many spheres we have
// // for (let i = 0; i < 300; i++) {
// //   // Sample a random point on the surface of the cube
// //   sampler.sample(tempPosition);
// //   // Store that point coordinates in the dummy object
// //   tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
// //   // Define a random scale
// //   tempObject.scale.setScalar(Math.random() * 0.2 + 0.2);
// //   // Update the matrix of the object
// //   tempObject.updateMatrix();
// //   // Insert the object udpated matrix into our InstancedMesh Matrix
// //   leafMesh.setMatrixAt(i, tempObject.matrix);
// // }



// gltfLoader.load('/leaf-geometry.glb', (gltf) => 
// {
    
//     const materialChange = gltf.scene.children;
//     materialChange.forEach( (mesh) =>
//     {
//         mesh.material = sceneMaterial;
//     });
    
//     leafShape = gltf.scene.children[0];
    
//     leafShape.scale.set(0.25, 0.25, 0.25);
//     leafShape.position.set(1, 0, 1);

//     sampler = new MeshSurfaceSampler(leafShape).build();
//     console.log(sampler);

//     scene.add(leafShape);
// });

// // sampler
// // const sampler = new MeshSurfaceSampler(leafShape).build();

// // Define the material outside the loader if it's not dependent on the loaded model

// // Function to create and add an instanced mesh to the scene using MeshSurfaceSampler
// function createInstancedMesh(geometry, material, instanceCount) {
//     // Create an instanced mesh with the given geometry and material
//     const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

//     const dummy = new THREE.Object3D();
//     const position = new THREE.Vector3();
//     const normal = new THREE.Vector3();

//     // Sample positions on the surface of the geometry for each instance
//     for (let i = 0; i < instanceCount; i++) {
//         sampler.sample(position, normal);

//         // Optionally, align the instance with the normal
//         dummy.position.copy(position);
//         dummy.lookAt(normal.add(position));
//         dummy.scale.setScalar(Math.random() * 0.01 + 0.02);
//         dummy.updateMatrix();

//         instancedMesh.setMatrixAt(i, dummy.matrix);
//     }

//     instancedMesh.instanceMatrix.needsUpdate = true;
//     // Add the instanced mesh to the scene
//     scene.add(instancedMesh);
// }

// // Load the GLTF model
// gltfLoader.load('/Leaf-draft-one.glb', (gltf) => {

//     const leafGeometry = gltf.scene.children[0].geometry;

//     const numberOfInstances = 100;

//     createInstancedMesh(leafGeometry, sceneMaterial, numberOfInstances);
// });
