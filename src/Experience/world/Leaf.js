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
        // this.setupDebug();
        this.createTree();
    }

    createTree()
    {
        this.model = this.experience.resources.items.tree.scene;

        this.aMat = new THREE.MeshBasicMaterial()

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

        }
    }

    createLeaf()
    {
        this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;
        this.foliageImage = this.experience.resources.items.foliageImage;

        this.leafUniforms =
        {
            uTime: 0, 
            uEffectBlend: 1,
            uRemap: 1,
            uNormalize: 1,
            // uWindStrength: 4.5 ,
            // uLeafBend: 1.85 ,
            // uNoiseSpeed: 0.01 ,
            // uTerrainSize: 400. ,
            // uNoiseScale: 1.5 ,
            // uLeafColor1: new THREE.Color(0x9bd38d),
            // uLeafColor2: new THREE.Color(0x1f352a),
            // uLeafColor3: new THREE.Color(0xffff00)
        }

        this.geometry = new THREE.PlaneGeometry( 0.02, 0.02 )
        this.material = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(this.leafUniforms.uTime),
                uEffectBlend: new THREE.Uniform(this.leafUniforms.uEffectBlend),
                uRemap: new THREE.Uniform(this.leafUniforms.uRemap),
                uNormalize: new THREE.Uniform(this.leafUniforms.uNormalize),
                uFoliageImage: new THREE.Uniform(this.foliageImage),
                // uWindStrength: new THREE.Uniform(this.leafUniforms.uWindStrength),
                // uLeafBend: new THREE.Uniform(this.leafUniforms.uLeafBend),
                // uNoiseSpeed: new THREE.Uniform(this.leafUniforms.uNoiseSpeed),
                // uTerrainSize: new THREE.Uniform(this.leafUniforms.uTerrainSize),
                // uNoiseTexture: new THREE.Uniform(this.perlinTexture),
                // uNoiseScale: new THREE.Uniform(this.leafUniforms.uNoiseScale),
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
        this.material.uniforms.uTime.value = this.time.elapsed;
    }
}