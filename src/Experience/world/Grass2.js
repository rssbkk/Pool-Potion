import * as THREE from 'three';
import Experience from '../Experience.js';

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

        this.instanceCount = 100000;
        this.grassPositions = [];
        this.mesh = null;

        this.createGrassBlade();
        this.createGrassField();
        this.setupDebug();
    }

    createGrassBlade()
    {
        // Create Textures
        this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;

        this.grassDimentions =
        {
            peakWidth: 0.005,
            baseWidth: 0.02,
            height: 0.25,
            heightSegments: 4
        }

        this.grassUniforms =
        {
            uTime: 0, 
            uWindStrength: 4.5 ,
            uGrassBend: 1.85 ,
            uNoiseSpeed: 0.01 ,
            uTerrainSize: 400. ,
            uTipColor1: new THREE.Color(0xa8b243),
            uTipColor2: new THREE.Color(0x1f352a),
            uTipColor3: new THREE.Color(0xffff00) ,
            uBaseColor1: new THREE.Color(0x228b22) ,
            uBaseColor2: new THREE.Color(0x313f1b) ,
            uNoiseScale: 1.5,
            uTextureScale: 50.0,
            uPerlinRange: 2.25,
            uColorOffset: 1
        }

        this.geometry = new THREE.CylinderGeometry( this.grassDimentions.peakWidth, this.grassDimentions.baseWidth, this.grassDimentions.height, 3, this.grassDimentions.heightSegments, true);
        this.material1 = new THREE.MeshBasicMaterial();
        this.material = new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(this.grassUniforms.uTime),
                uWindStrength: new THREE.Uniform(this.grassUniforms.uWindStrength),
                uGrassBend: new THREE.Uniform(this.grassUniforms.uGrassBend),
                uNoiseSpeed: new THREE.Uniform(this.grassUniforms.uNoiseSpeed),
                uTerrainSize: new THREE.Uniform(this.grassUniforms.uTerrainSize),
                uTipColor1: new THREE.Uniform(this.grassUniforms.uTipColor1),
                uTipColor2: new THREE.Uniform(this.grassUniforms.uTipColor2),
                uTipColor3: new THREE.Uniform(this.grassUniforms.uTipColor3),
                uBaseColor1: new THREE.Uniform(this.grassUniforms.uBaseColor1),
                uBaseColor2: new THREE.Uniform(this.grassUniforms.uBaseColor2),
                uNoiseTexture: new THREE.Uniform(this.perlinTexture),
                uNoiseScale: new THREE.Uniform(this.grassUniforms.uNoiseScale),
                uTextureScale: new THREE.Uniform(this.grassUniforms.uTextureScale),
                uPerlinRange: new THREE.Uniform(this.grassUniforms.uPerlinRange),
                uColorOffset: new THREE.Uniform(this.grassUniforms.uColorOffset)
            },
            // wireframe: true
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        // this.mesh.position.x = 2
        // this.mesh.position.y = 0.1
        // this.mesh.position.z = 2
        // this.scene.add(this.mesh);
    }

    createGrassField()
    {
        this.instanceMesh = new THREE.InstancedMesh( this.geometry, this.material, this.instanceCount );
        this.instanceMesh.layers.set(1);
        this.scene.add( this.instanceMesh );

        const instancePositions = new Float32Array(this.instanceCount * 3);

        let planeSize = 15.0;
        for(let i = 0; i < this.instanceCount; i++)
        {
            let tempPositionX = instancePositions[i * 3 + 0] = (Math.random() * planeSize - planeSize / 2);
            let tempPositionZ = instancePositions[i * 3 + 2] = (Math.random() * planeSize - planeSize / 2);

            const matrix = new THREE.Matrix4();
            matrix.setPosition(tempPositionX, 0, tempPositionZ);
            this.instanceMesh.setMatrixAt(i, matrix);
        }

        this.instanceMesh.instanceMatrix.needsUpdate = true;

        const instancedPositionAttribute = new THREE.InstancedBufferAttribute(instancePositions, 3);
        this.geometry.setAttribute('instancePosition', instancedPositionAttribute);
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Grass',
                expanded: false
            });

            // Folder for geometry properties
            const grassGeometry = this.debugFolder.addFolder({ title: 'Geometry Properties' });

            grassGeometry.addBinding(this.grassDimentions, 'peakWidth', {
                label: 'Peak Width',
                min: 0.001,
                max: 0.1,
                step: 0.001
            }).on('change', (value) => {
                this.updateGeometry();
            });

            grassGeometry.addBinding(this.grassDimentions, 'baseWidth', {
                label: 'Base Width',
                min: 0.01,
                max: 0.1,
                step: 0.001
            }).on('change', (value) => {
                this.updateGeometry();
            });

            grassGeometry.addBinding(this.grassDimentions, 'height', {
                label: 'Height',
                min: 0.1,
                max: 1.0,
                step: 0.01
            }).on('change', (value) => {
                this.updateGeometry();
            });
            
            grassGeometry.addBinding(this.grassDimentions, 'heightSegments', {
                label: 'Height Segments',
                min: 1,
                max: 20,
                step: 1
            }).on('change', (value) => {
                this.updateGeometry();
            });

            this.updateGeometry = () => {
                const newGeometry = new THREE.CylinderGeometry(this.grassDimentions.peakWidth, this.grassDimentions.baseWidth, this.grassDimentions.height, 3, this.grassDimentions.heightSegments, true);
                this.instanceMesh.geometry.dispose();
                this.instanceMesh.geometry = newGeometry;
            };

            // // Folder for shader properties
            const shaderFolder = this.debugFolder.addFolder({ title: 'Shader Properties' });

            shaderFolder.addBinding(this.grassUniforms, 'uNoiseScale', {
                label: 'Noise Scale',
                min: 0.1,
                max: 5,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.grassUniforms, 'uTextureScale', {
                label: 'Texture Scale',
                min: -200.0,
                max: 200.0,
                step: 1.0
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.grassUniforms, 'uPerlinRange', {
                label: 'Perlin Range',
                min: -20.0,
                max: 20.0,
                step: 0.25
            }).on('change', () => {
                this.updateMaterial();
            });

            shaderFolder.addBinding(this.grassUniforms, 'uWindStrength', {
                min: 0,
                max: 10,
                step: 0.1,
                label: 'Wind Strength'
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.grassUniforms, 'uGrassBend', {
                min: 0,
                max: 5,
                step: 0.1,
                label: 'Grass Bend'
            }).on('change', (value) => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.grassUniforms, 'uNoiseSpeed', {
                min: 0,
                max: 0.1,
                step: 0.001,
                label: 'Noise Speed'
            }).on('change', () => {
                this.updateMaterial();
            });
            
            shaderFolder.addBinding(this.grassUniforms, 'uTerrainSize', {
                min: 100,
                max: 1000,
                step: 10,
                label: 'Terrain Size'
            }).on('change', () => {
                this.updateMaterial();
            });
            
            // // Folder for grass color properties
            const colorFolder = this.debugFolder.addFolder({ title: 'Color Properties' });

            this.debugObject = { 
                uTipColor1: `#${this.grassUniforms.uTipColor1.getHexString()}`,
                uTipColor2: `#${this.grassUniforms.uTipColor2.getHexString()}`,
                uTipColor3: `#${this.grassUniforms.uTipColor3.getHexString()}`,
                uBaseColor1: `#${this.grassUniforms.uBaseColor1.getHexString()}`,
                uBaseColor2: `#${this.grassUniforms.uBaseColor2.getHexString()}`,
            }

            colorFolder.addBinding(this.debugObject, 'uTipColor1').on('change', () => { this.material.uniforms.uTipColor1.value.set(this.debugObject.uTipColor1)});
            colorFolder.addBinding(this.debugObject, 'uTipColor2').on('change', () => { this.material.uniforms.uTipColor2.value.set(this.debugObject.uTipColor2)});
            colorFolder.addBinding(this.debugObject, 'uTipColor3').on('change', () => { this.material.uniforms.uTipColor3.value.set(this.debugObject.uTipColor3)});
            colorFolder.addBinding(this.debugObject, 'uBaseColor1').on('change', () => { this.material.uniforms.uBaseColor1.value.set(this.debugObject.uBaseColor1)});
            colorFolder.addBinding(this.debugObject, 'uBaseColor2').on('change', () => { this.material.uniforms.uBaseColor2.value.set(this.debugObject.uBaseColor2)});

            this.updateMaterial = () => 
            {
                Object.keys(this.grassUniforms).forEach(key => 
                {
                    if (key in this.material.uniforms) 
                    {
                        this.material.uniforms[key].value = this.grassUniforms[key];
                    }
                })
            };
        };
    }

    update()
    {
        this.material.uniforms.uTime.value = this.grassUniforms.uTime = this.time.elapsed * 0.001;
    }
}
