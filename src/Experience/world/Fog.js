import * as THREE from 'three';
import Experience from '../Experience.js';
import { label } from 'three/examples/jsm/nodes/Nodes.js';

export default class Fog
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;

        this.createFog();
    }

    createFog()
    {
        //this.fog = new THREE.Fog( 0xD9D9D9, 1, 10);
        this.scene.fog = new THREE.FogExp2( 0xc3b370, 0.0175);
        console.log(this.scene.fog);
    }  
}