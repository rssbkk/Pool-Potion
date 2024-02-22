import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Floor
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setMesh()
    }

    setMesh()
    {
        const groundGeometry = new THREE.CircleGeometry( 10, 10 );
        const groundMaterial = new THREE.MeshStandardMaterial();
        const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
        
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.material.color = new THREE.Color( 0x00f00f );
        
        this.scene.add( groundMesh );
    }
}