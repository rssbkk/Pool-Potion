import * as THREE from 'three';

import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Experience from '../Experience.js';
import Landscape from './Landscape.js';

export default class Leaf
{
    constructor()
    {
        this.Landscape = new Landscape();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Leaf',
                expanded: false
            });
            this.debugObject = {};
        }

        this.instanceCount = 250;
        this.leafPositions = [];
        this.mesh = null;

        this.createLeaf();
        this.createLeaves();
    }


    createLeaf()
    {
        this.model = this.experience.resources.items.leaf.scene;

        this.leafGeometry = this.model.children[0].geometry;
        this.leafGeometry.scale(0.05, 0.05, 0.05);

        this.leafMaterial = new THREE.MeshBasicMaterial({
            color: 0xff61d5,
            side: THREE.DoubleSide
        });

        this.leafMesh = new THREE.InstancedMesh(this.leafGeometry, this.leafMaterial, this.instanceCount);
        this.leafMesh.position.y = 3;
        this.scene.add(this.leafMesh);
    }
    
    createLeaves()
    {
        // this.samplerMesh = this.experience.resources.items.leafRoot.scene.children[0];
        this.samplerMesh = new THREE.Mesh(new THREE.SphereGeometry( 0.75, 9, 7 ));
        
        const sampler = new MeshSurfaceSampler(this.samplerMesh).build();

        // dependancies for the loop
        const tempPosition = new THREE.Vector3();
        const tempNormal = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const upVector = new THREE.Vector3(0, 1, 0); // Assuming Y is up in your world space

        const tempObject = new THREE.Object3D();

        for (let i = 0; i < this.instanceCount; i++)
        {
            sampler.sample(tempPosition, tempNormal);
            //tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
            quaternion.setFromUnitVectors(upVector, tempNormal.normalize());
            const matrix = new THREE.Matrix4();
                matrix.compose(
                tempPosition,
                quaternion,
                new THREE.Vector3(1, 1, 1) // scale
            );
            this.leafMesh.setMatrixAt(i, matrix);
        }
        for (let i = 0; i < this.instanceCount; i++)
        {
            sampler.sample(tempPosition, tempNormal);
            //tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
            quaternion.setFromUnitVectors(upVector, tempNormal.normalize());
            const matrix = new THREE.Matrix4();
                matrix.compose(
                tempPosition,
                quaternion,
                new THREE.Vector3(1, 1, 1) // scale
            );
            this.leafMesh.setMatrixAt(i, matrix);
        }
        this.leafMesh.instanceMatrix.needsUpdate = true;
    }
    
    update()
    {

    }
}
