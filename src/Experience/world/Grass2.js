import * as THREE from 'three';
import Experience from '../Experience.js';

import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Floor from './Floor.js';

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
        this.floor = new Floor();

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
        this.createGrassInstaces();
    }

    createGrass()
    {
        // Create Textures
        const perlinTexture = this.experience.resources.items.perlinNoiseImage;
        perlinTexture.wrapS = perlinTexture.wrapT = THREE.RepeatWrapping;

        const noiseScale = 1.5;

        let peakWidth = 0.01;
        let baseWidth = 0.02;
        let height = 0.25;

        this.geometry = new THREE.CylinderGeometry(peakWidth, baseWidth, height, 3, 4);
        this.material1 = new THREE.MeshBasicMaterial();
        this.material = new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uStrength: { value: 10 },
                uTipColor1: { value: new THREE.Color(0x9bd38d)},
                uTipColor2: { value: new THREE.Color(0x1f352a)},
                uTipColor3: { value: new THREE.Color(0xffff00) }, // Bright yellow
                uBaseColor1: { value: new THREE.Color(0x228b22) }, // Darker green
                uBaseColor2: { value: new THREE.Color(0x313f1b) },
                uNoiseTexture: { value: perlinTexture },
                uNoiseScale: { value: noiseScale }
            },
            wireframe: true
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.x = 2
        this.mesh.position.y = 0.1
        this.mesh.position.z = 2
        this.scene.add(this.mesh);
    }

    createGrassInstaces()
    {
        this.instanceMesh = new THREE.InstancedMesh( this.geometry, this.material1, this.instanceCount );
        this.scene.add( this.instanceMesh );

        let planeSize = 5;
        for(let i = 0; i < this.instanceCount; i++)
        {
            let tempPositionX = Math.random() * planeSize - planeSize / 2;
            let tempPositionZ = Math.random() * planeSize - planeSize / 2;

            const matrix = new THREE.Matrix4();
            matrix.setPosition(tempPositionX, 0, tempPositionZ);
            this.instanceMesh.setMatrixAt(i, matrix);
        }
        this.instanceMesh.instanceMatrix.needsUpdate = true;
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
    }
}
