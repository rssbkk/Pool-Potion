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

        this.instanceCount = 200;
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
            color: 0xff61d5
        });

        this.leafMesh = new THREE.InstancedMesh(this.leafGeometry, this.leafMaterial, this.instanceCount);
        this.scene.add(this.leafMesh);
    }
    
    createLeaves()
    {
        this.samplerMesh = this.experience.resources.items.leafRoot.scene.children[0];
        // this.samplerMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4));
        
        const sampler = new MeshSurfaceSampler(this.samplerMesh).build();

        // dependancies for the loop
        const tempPosition = new THREE.Vector3();
        const tempObject = new THREE.Object3D();

        for (let i = 0; i < this.instanceCount; i++)
        {
            sampler.sample(tempPosition);
            tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
            tempObject.updateMatrix();
            this.leafMesh.setMatrixAt(i, tempObject.matrix);
        }
    }
    
    update()
    {

    }
}
