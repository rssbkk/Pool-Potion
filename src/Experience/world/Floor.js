import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Floor
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.createMesh()
    }

    createMesh()
    {
        const groundGeometry = new THREE.CircleGeometry( 10, 8 );
        const groundMaterial = new THREE.MeshStandardMaterial();
        this.groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
        
        this.groundMesh.rotation.x = - Math.PI / 2;
        this.groundMesh.material.color = new THREE.Color( 0x159947 );
        
        this.scene.add( this.groundMesh );
    }

    getGeometry()
    {
        if(this.groundMesh)
        {
            return this.groundMesh
        }
    }
}