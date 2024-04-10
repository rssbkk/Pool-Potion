import * as THREE from 'three';
import Experience from '../Experience.js';

import grassVertexShader from "./shaders/grassShader/grassVertex.glsl";
import grassFragmentShader from "./shaders/grassShader/grassFragment.glsl";

export default class Grass
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
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Grass',
                expanded: false
            });
            this.debugObject = {};
        }

        this.instanceCount = 200;
        this.grassPositions = [];
        this.mesh = null;

        this.createGrass();
    }

    createGrass()
    {
        let peakWidth = 0.01;
        let baseWidth = 0.02;
        let height = 0.25;

        this.geometry = new THREE.CylinderGeometry(peakWidth, baseWidth, height, 3, 4);
        this.material = new THREE.RawShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uStrength: { value: 10 },
                topColor: { value: new THREE.Color(0xffff00) }, // Bright yellow
                bottomColor: { value: new THREE.Color(0x228b22) }, // Darker green
            }
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material )
        this.mesh.position.x = 2;
        this.mesh.position.y = 0.1;
        this.mesh.position.z = 0;

        this.scene.add(this.mesh)
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}
