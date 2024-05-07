import * as THREE from 'three';

import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Experience from '../Experience.js';
import Landscape from './Landscape.js';

import leafVertexShader from"./shaders/leafShader/leafVertex.glsl";
import leafFragmentShader from "./shaders/leafShader/leafFragment.glsl";

import leafRootVertexShader from"./shaders/leafRootShader/leafRootVertex.glsl";
import leafRootFragmentShader from "./shaders/leafRootShader/leafRootFragment.glsl";

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

        this.instanceCount = 500;

        this.createLeaf();
        this.createLeaves();
        this.setupDebug();
    }


    createLeaf()
    {
        this.model = this.experience.resources.items.leaf.scene;

        this.leafGeometry = this.model.children[0].geometry;
        this.leafGeometry.scale(0.05, 0.05, 0.05);

        this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;

        const instancePhases = new Float32Array(this.instanceCount);
        const phaseAttribute = new THREE.InstancedBufferAttribute(instancePhases, 1);

        // Randomize phases for each instance
        for (let i = 0; i < this.instanceCount; i++) {
            instancePhases[i] = Math.random() * Math.PI * 2;
        }

        this.leafUniforms =
        {
            uTime: 0, 
            uWindStrength: 4.5 ,
            uGrassBend: 1.85 ,
            uNoiseSpeed: 0.01 ,
            uTerrainSize: 400. ,
            uLeafColor1: new THREE.Color(0x9bd38d),
            uLeafColor2: new THREE.Color(0x1f352a),
            uLeafColor3: new THREE.Color(0xffff00) ,
            uNoiseScale: 1.5
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(this.leafUniforms.uTime),
                uWindStrength: new THREE.Uniform(this.leafUniforms.uWindStrength),
                uleafBend: new THREE.Uniform(this.leafUniforms.uleafBend),
                uNoiseSpeed: new THREE.Uniform(this.leafUniforms.uNoiseSpeed),
                uTerrainSize: new THREE.Uniform(this.leafUniforms.uTerrainSize),
                uLeafColor1: new THREE.Uniform(this.leafUniforms.uLeafColor1),
                uLeafColor2: new THREE.Uniform(this.leafUniforms.uLeafColor2),
                uLeafColor3: new THREE.Uniform(this.leafUniforms.uLeafColor3),
                uNoiseTexture: new THREE.Uniform(this.perlinTexture),
                uNoiseScale: new THREE.Uniform(this.leafUniforms.uNoiseScale),
                uCameraPosition: new THREE.Uniform(0)
            },
            // wireframe: true,
            side: THREE.DoubleSide
        });

        this.leafMesh = new THREE.InstancedMesh(this.leafGeometry, this.material, this.instanceCount);
        this.leafMesh.geometry.setAttribute('instancePhase', phaseAttribute);
        this.leafMesh.position.y = 3;
        this.scene.add(this.leafMesh);
    }
    
    createLeaves()
    {
        this.leafRootUniforms =
        {
            uTime: 0, 
            uWindStrength: 1.2 ,
            uLeafRootBend: 2.0 ,
            uNoiseSpeed: 0.01 ,
            uTerrainSize: 400. ,
            uNoiseScale: 1.5,
            uColorOffset: 1
        }
        this.leafRootMaterial = new THREE.ShaderMaterial({
            vertexShader: leafRootVertexShader,
            fragmentShader: leafRootFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(this.leafRootUniforms.uTime),
                uWindStrength: new THREE.Uniform(this.leafRootUniforms.uWindStrength),
                uLeafRootBend: new THREE.Uniform(this.leafRootUniforms.uLeafRootBend),
                uNoiseSpeed: new THREE.Uniform(this.leafRootUniforms.uNoiseSpeed),
                uNoiseTexture: new THREE.Uniform(this.perlinTexture),
                uNoiseScale: new THREE.Uniform(this.leafRootUniforms.uNoiseScale),
                uColorOffset: new THREE.Uniform(this.leafRootUniforms.uColorOffset)
            },
            // wireframe: true
        });
        this.samplerMesh = new THREE.Mesh(new THREE.SphereGeometry( 0.75, 9, 7 ));

        this.exampleMesh = new THREE.Mesh(new THREE.SphereGeometry( 0.75, 9, 7 ), this.leafRootMaterial);
        this.exampleMesh.position.set(2, 2, 2)
        this.scene.add(this.exampleMesh)

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
                new THREE.Vector3(0.5, 0.5, 0.5)
            );
            this.leafMesh.setMatrixAt(i, matrix);
        }
        this.leafMesh.instanceMatrix.needsUpdate = true;
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Leaf Root',
                expanded: true
            });

            // Folder for shader properties
            const shaderFolder = this.debugFolder.addFolder({ title: 'Shader Properties' });

            shaderFolder.addBinding(this.leafRootUniforms, 'uNoiseScale', {
                label: 'Noise Scale',
                min: 0.1,
                max: 5,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });

            shaderFolder.addBinding(this.leafRootUniforms, 'uWindStrength', {
                min: 0,
                max: 10,
                step: 0.1,
                label: 'Wind Strength'
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.leafRootUniforms, 'uLeafRootBend', {
                min: 0,
                max: 5,
                step: 0.1,
                label: 'Leaf Root Bend'
            }).on('change', (value) => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.leafRootUniforms, 'uNoiseSpeed', {
                min: 0,
                max: 0.1,
                step: 0.001,
                label: 'Noise Speed'
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.leafRootUniforms, 'uTerrainSize', {
                min: 100,
                max: 1000,
                step: 10,
                label: 'Terrain Size'
            }).on('change', () => {
                this.updateMaterial();
            });

            this.updateMaterial = () => 
            {
                // Update only the uniform values directly instead of recreating the material
                Object.keys(this.leafRootUniforms).forEach(key => 
                {
                    if (key in this.leafRootMaterial.uniforms) 
                    {
                        this.leafRootMaterial.uniforms[key].value = this.leafRootUniforms[key];
                    }
                })
            };
        }
    }
    
    update()
    {
        this.material.uniforms.uTime.value = this.leafUniforms.uTime = this.time.elapsed * 0.001;
        this.leafRootMaterial.uniforms.uTime.value = this.leafRootUniforms.uTime = this.time.elapsed * 0.001;
        this.material.uniforms.uCameraPosition.value = this.camera.instance.position;
    }
}