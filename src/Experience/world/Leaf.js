import * as THREE from 'three';

import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Experience from '../Experience.js';
import Landscape from './Landscape.js';

import leafVertexShader from"./shaders/leafShader/leafVertex.glsl";
import leafFragmentShader from "./shaders/leafShader/leafFragment.glsl";

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

        this.instanceCount = 50;

        this.createLeaf();
        this.createLeaves();
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
                uNoiseScale: new THREE.Uniform(this.leafUniforms.uNoiseScale)
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
        this.leafMesh.instanceMatrix.needsUpdate = true;
    }
    
    update()
    {
        this.material.uniforms.uTime.value = this.leafUniforms.uTime = this.time.elapsed * 0.001;
    }
}

// createGrassBlade()
//     {
//         // Create Textures
//         this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
//         this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;

//         this.grassDimentions =
//         {
//             peakWidth: 0.005,
//             baseWidth: 0.02,
//             height: 0.25,
//             heightSegments: 4
//         }

//         this.grassUniforms =
//         {
//             uTime: 0, 
//             uWindStrength: 4.5 ,
//             uGrassBend: 1.85 ,
//             uNoiseSpeed: 0.01 ,
//             uTerrainSize: 400. ,
//             uTipColor1: new THREE.Color(0x9bd38d),
//             uTipColor2: new THREE.Color(0x1f352a),
//             uTipColor3: new THREE.Color(0xffff00) ,
//             uBaseColor1: new THREE.Color(0x228b22) ,
//             uBaseColor2: new THREE.Color(0x313f1b) ,
//             uNoiseScale: 1.5,
//             uColorOffset: 1
//         }

//         this.geometry = new THREE.CylinderGeometry( this.grassDimentions.peakWidth, this.grassDimentions.baseWidth, this.grassDimentions.height, 3, this.grassDimentions.heightSegments, true);
//         this.material1 = new THREE.MeshBasicMaterial();
//         this.material = new THREE.ShaderMaterial({
//             vertexShader: grassVertexShader,
//             fragmentShader: grassFragmentShader,
//             uniforms: {
//                 uTime: new THREE.Uniform(this.grassUniforms.uTime),
//                 uWindStrength: new THREE.Uniform(this.grassUniforms.uWindStrength),
//                 uGrassBend: new THREE.Uniform(this.grassUniforms.uGrassBend),
//                 uNoiseSpeed: new THREE.Uniform(this.grassUniforms.uNoiseSpeed),
//                 uTerrainSize: new THREE.Uniform(this.grassUniforms.uTerrainSize),
//                 uTipColor1: new THREE.Uniform(this.grassUniforms.uTipColor1),
//                 uTipColor2: new THREE.Uniform(this.grassUniforms.uTipColor2),
//                 uTipColor3: new THREE.Uniform(this.grassUniforms.uTipColor3),
//                 uBaseColor1: new THREE.Uniform(this.grassUniforms.uBaseColor1),
//                 uBaseColor2: new THREE.Uniform(this.grassUniforms.uBaseColor2),
//                 uNoiseTexture: new THREE.Uniform(this.perlinTexture),
//                 uNoiseScale: new THREE.Uniform(this.grassUniforms.uNoiseScale),
//                 uColorOffset: new THREE.Uniform(this.grassUniforms.uColorOffset)
//             },
//             // wireframe: true
//         });

//         this.mesh = new THREE.Mesh( this.geometry, this.material );
//         // this.mesh.position.x = 2
//         // this.mesh.position.y = 0.1
//         // this.mesh.position.z = 2
//         // this.scene.add(this.mesh);
//     }

//     createGrassField()
//     {
//         this.instanceMesh = new THREE.InstancedMesh( this.geometry, this.material, this.instanceCount );
//         this.scene.add( this.instanceMesh );

//         let planeSize = 8.0;
//         for(let i = 0; i < this.instanceCount; i++)
//         {
//             let tempPositionX = (Math.random() * planeSize - planeSize / 2);
//             let tempPositionZ = (Math.random() * planeSize - planeSize / 2);

//             const matrix = new THREE.Matrix4();
//             matrix.setPosition(tempPositionX, 0, tempPositionZ);
//             this.instanceMesh.setMatrixAt(i, matrix);
//         }
//         this.instanceMesh.instanceMatrix.needsUpdate = true;
//     }

//     setupDebug()
//     {
//         if(this.debug.active)
//         {
//             this.debugFolder = this.debug.pane.addFolder({
//                 title: 'Grass',
//                 expanded: false
//             });

//         // Folder for geometry properties
//         const grassGeometry = this.debugFolder.addFolder({ title: 'Geometry Properties' });

//         grassGeometry.addBinding(this.grassDimentions, 'peakWidth', {
//             label: 'Peak Width',
//             min: 0.001,
//             max: 0.1,
//             step: 0.001
//         }).on('change', (value) => {
//             this.updateGeometry();
//         });

//         grassGeometry.addBinding(this.grassDimentions, 'baseWidth', {
//             label: 'Base Width',
//             min: 0.01,
//             max: 0.1,
//             step: 0.001
//         }).on('change', (value) => {
//             this.updateGeometry();
//         });

//         grassGeometry.addBinding(this.grassDimentions, 'height', {
//             label: 'Height',
//             min: 0.1,
//             max: 1.0,
//             step: 0.01
//         }).on('change', (value) => {
//             this.updateGeometry();
//         });
        
//         grassGeometry.addBinding(this.grassDimentions, 'heightSegments', {
//             label: 'Height Segments',
//             min: 1,
//             max: 20,
//             step: 1
//         }).on('change', (value) => {
//             this.updateGeometry();
//         });

//         this.updateGeometry = () => {
//             const newGeometry = new THREE.CylinderGeometry(this.grassDimentions.peakWidth, this.grassDimentions.baseWidth, this.grassDimentions.height, 3, this.grassDimentions.heightSegments, true);
//             this.instanceMesh.geometry.dispose();
//             this.instanceMesh.geometry = newGeometry;
//         };

//         // // Folder for shader properties
//         const shaderFolder = this.debugFolder.addFolder({ title: 'Shader Properties' });

//         shaderFolder.addBinding(this.grassUniforms, 'uNoiseScale', {
//             label: 'Noise Scale',
//             min: 0.1,
//             max: 5,
//             step: 0.1
//         }).on('change', () => {
//             this.updateMaterial();
//         });

//         shaderFolder.addBinding(this.grassUniforms, 'uWindStrength', {
//             min: 0,
//             max: 10,
//             step: 0.1,
//             label: 'Wind Strength'
//         }).on('change', () => {
//             this.updateMaterial();
//         });
        
//         shaderFolder.addBinding(this.grassUniforms, 'uGrassBend', {
//             min: 0,
//             max: 5,
//             step: 0.1,
//             label: 'Grass Bend'
//         }).on('change', (value) => {
//             this.updateMaterial();
//         });
        
//         shaderFolder.addBinding(this.grassUniforms, 'uNoiseSpeed', {
//             min: 0,
//             max: 0.1,
//             step: 0.001,
//             label: 'Noise Speed'
//         }).on('change', () => {
//             this.updateMaterial();
//         });
        
//         shaderFolder.addBinding(this.grassUniforms, 'uTerrainSize', {
//             min: 100,
//             max: 1000,
//             step: 10,
//             label: 'Terrain Size'
//         }).on('change', () => {
//             this.updateMaterial();
//         });
        
//         // // Folder for grass color properties
//         const colorFolder = this.debugFolder.addFolder({ title: 'Color Properties' });

//         colorFolder.addBinding(this.grassUniforms, 'uColorOffset', {
//             min: 0,
//             max: 5,
//             step: 0.1
//         }).on('change', () => {
//             this.updateMaterial();
//         });

//         colorFolder.addBinding(this.grassUniforms, 'uTipColor1', {
//             view: 'color',
//             label: 'Tip Color 1',
//             format: 'hex'
//         }).on('change', () => {
//             this.updateMaterialColor();
//         });
        
//         colorFolder.addBinding(this.grassUniforms, 'uTipColor2', {
//             view: 'color',
//             label: 'Tip Color 2',
//             format: 'hex'
//         }).on('change', () => {
//             this.updateMaterialColor();
//         });
        
//         colorFolder.addBinding(this.grassUniforms, 'uTipColor3', {
//             view: 'color',
//             label: 'Tip Color 3',
//             format: 'hex'
//         }).on('change', () => {
//             this.updateMaterialColor();
//         });
        
//         colorFolder.addBinding(this.grassUniforms, 'uBaseColor1', {
//             view: 'color',
//             label: 'Base Color 1',
//             format: 'hex'
//         }).on('change', () => {
//             this.updateMaterialColor();
//         });
        
//         colorFolder.addBinding(this.grassUniforms, 'uBaseColor2', {
//             view: 'color',
//             label: 'Base Color 2',
//             format: 'hex'
//         }).on('change', () => {
//             this.updateMaterialColor();
//         });

//         this.updateMaterial = () => 
//         {
//             // Update only the uniform values directly instead of recreating the material
//             Object.keys(this.grassUniforms).forEach(key => 
//             {
//                 if (key in this.material.uniforms) 
//                 {
//                     this.material.uniforms[key].value = this.grassUniforms[key];
//                 }
//             })
//         };
        
//         this.updateMaterialColor = () => 
//         {
//             // Update only the uniform values directly instead of recreating the material
//             Object.keys(this.grassUniforms).forEach(key => 
//                 {
//                     if (key in this.material.uniforms) 
//                     {
//                         this.material.uniforms[key].value.set(this.grassUniforms[key]);
//                     }
//                 })
//             };
//         };
//     }

//     update()
//     {
//         this.material.uniforms.uTime.value = this.grassUniforms.uTime = this.time.elapsed * 0.001;
//     }
