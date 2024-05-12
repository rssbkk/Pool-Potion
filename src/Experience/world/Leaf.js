import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Experience from '../Experience.js';

import leafVertexShader from"./shaders/leafShader/leafVertex.glsl";
import leafFragmentShader from "./shaders/leafShader/leafFragment.glsl";

import leafRootVertexShader from"./shaders/leafRootShader/leafRootVertex.glsl";
import leafRootFragmentShader from "./shaders/leafRootShader/leafRootFragment.glsl";

export default class Leaf
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;

        this.instanceCount = 50;
        this.canopyCount = 2

        this.createLeaf();
        // this.createLeaves();
        this.createCanopy(this.canopyCount);
        this.setupDebug();
        this.createTree();
    }

    createTree()
    {
        this.model = this.experience.resources.items.tree.scene;

        const foliage = this.model.getObjectByName('foliage');
        if (foliage) foliage.material = this.material;
        const trunk = this.model.getObjectByName('trunk');
        if (trunk) trunk.material = this.toonMaterial;

        this.scene.add(this.model);
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'leaf',
                expanded: true
            });

            // SHADER LEAF MATERIAL DEBUG
            const shaderFolder = this.debugFolder.addFolder({ title: 'Shader Properties' });

            shaderFolder.addBinding(this.leafUniforms, 'uEffectBlend', {
                label: 'uEffectBlend',
                min: 0,
                max: 2,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uInflate', {
                label: 'uInflate',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uScale', {
                label: 'uScale',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uWindSpeed', {
                label: 'uWindSpeed',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });

            this.updateMaterial = () => 
            {
                // Update only the uniform values directly instead of recreating the material
                Object.keys(this.leafUniforms).forEach(key => 
                {
                    if (key in this.material.uniforms) 
                    {
                        this.material.uniforms[key].value = this.leafUniforms[key];
                    }
                })
            };

        }
    }

    createLeaf()
    {
        this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;
        this.foliageImage = this.experience.resources.items.foliageImage;

        this.leafUniforms =
        {
            uEffectBlend: 1.0,
            uInflate: 1,
            uScale: 1,
            uWindSpeed: 1,
            uWindTime: 0.0,
            // uLeafColor1: new THREE.Color(0x9bd38d),
            // uLeafColor2: new THREE.Color(0x1f352a),
            // uLeafColor3: new THREE.Color(0xffff00)
        }

        this.geometry = new THREE.PlaneGeometry( 0.02, 0.02 )
        this.material = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uEffectBlend: new THREE.Uniform(this.leafUniforms.uEffectBlend),
                uInflate: new THREE.Uniform(this.leafUniforms.uInflate),
                uScale: new THREE.Uniform(this.leafUniforms.uScale),
                uWindSpeed: new THREE.Uniform(this.leafUniforms.uWindSpeed),
                uWindTime: new THREE.Uniform(this.leafUniforms.uWindTime),
                uFoliageImage: new THREE.Uniform(this.foliageImage),
                // uLeafColor1: new THREE.Uniform(this.leafUniforms.uLeafColor1),
                // uLeafColor2: new THREE.Uniform(this.leafUniforms.uLeafColor2),
                // uLeafColor3: new THREE.Uniform(this.leafUniforms.uLeafColor3)
            },
            transparent: true
        })
        //this.material = new THREE.MeshBasicMaterial();
    }

    createLeaves(mesh)
    {
        this.samplerGeometry = new THREE.SphereGeometry( 5, 5, 5 );
        this.samplerMesh = new THREE.Mesh( this.samplerGeometry );

        const sampler = new MeshSurfaceSampler(this.samplerMesh).build();

        const offsets = new Float32Array(this.instanceCount * 3);

        const position = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        for(let i = 0; i < this.instanceCount; i++ )
        {
            sampler.sample( position );
            
            offsets[i * 3 + 0] = Math.random() * 2-1;  // Random X offset
            offsets[i * 3 + 1] = Math.random() * 2-1;  // Random Y offset
            offsets[i * 3 + 2] = Math.random() * 2-1;  // Random Z offset

            matrix.setPosition(position);

            mesh.setMatrixAt( i, matrix );
        }

        const offsetAttribute = new THREE.InstancedBufferAttribute(offsets, 3);
        this.mesh.geometry.setAttribute('offset', offsetAttribute);

        mesh.updateMatrix();
        mesh.instanceMatrix.needsUpdate = true;
    }

    createCanopy(count)
    {
        for (let i = 0; i < count; i++)
        {
            this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.instanceCount );
            this.mesh.position.set( Math.random() * 8, 2, Math.random() * 8);
            this.scene.add(this.mesh)

            this.createLeaves(this.mesh)
        }
    }

    update()
    {
        this.material.uniforms.uWindTime.value = this.leafUniforms.uWindTime += this.material.uniforms.uWindSpeed.value * this.time.delta * 0.002;
    }
}