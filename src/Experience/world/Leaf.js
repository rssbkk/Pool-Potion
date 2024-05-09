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

        this.instanceCount = 500;
        this.canopyCount = 4

        this.createLeaf();
        // this.createLeaves();
        this.createCanopy(this.canopyCount);
        // this.setupDebug();
    }

    // NOTES:
    // 1. InstancedMeshes to always face the camera
    // 2. instacned meshes to tilt from center along horizontal axis
    // 3. offset that by perlinNoise and world position
    // 4. test moving from under to remove normal and depth lines, same for grass

    createLeaf()
    {
        this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;

        this.leafUniforms =
        {
            uTime: 0, 
            uWindStrength: 4.5 ,
            uLeafBend: 1.85 ,
            uNoiseSpeed: 0.01 ,
            uTerrainSize: 400. ,
            uNoiseScale: 1.5 ,
            uLeafColor1: new THREE.Color(0x9bd38d),
            uLeafColor2: new THREE.Color(0x1f352a),
            uLeafColor3: new THREE.Color(0xffff00)
        }

        this.geometry = new THREE.PlaneGeometry( 0.2, 0.2 )
        this.material = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(this.leafUniforms.uTime),
                uWindStrength: new THREE.Uniform(this.leafUniforms.uWindStrength),
                uLeafBend: new THREE.Uniform(this.leafUniforms.uLeafBend),
                uNoiseSpeed: new THREE.Uniform(this.leafUniforms.uNoiseSpeed),
                uTerrainSize: new THREE.Uniform(this.leafUniforms.uTerrainSize),
                uNoiseTexture: new THREE.Uniform(this.perlinTexture),
                uNoiseScale: new THREE.Uniform(this.leafUniforms.uNoiseScale),
                uLeafColor1: new THREE.Uniform(this.leafUniforms.uLeafColor1),
                uLeafColor2: new THREE.Uniform(this.leafUniforms.uLeafColor2),
                uLeafColor3: new THREE.Uniform(this.leafUniforms.uLeafColor3)
            }
        })
    }

    createLeaves(mesh)
    {
        this.samplerGeometry = new THREE.SphereGeometry( 0.5, 5, 5 );
        this.samplerMesh = new THREE.Mesh( this.samplerGeometry );

        const sampler = new MeshSurfaceSampler(this.samplerMesh).build();

        const heights = new Float32Array(this.instanceCount);

        const bbox = new THREE.Box3().setFromObject(mesh);
        const minY = bbox.min.y;
        const maxY = bbox.max.y;

        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const matrix = new THREE.Matrix4();

        for(let i = 0; i < this.instanceCount; i++ )
        {
            sampler.sample( position );
            
            rotation.x = THREE.MathUtils.randFloatSpread(2 * Math.PI);
            rotation.y = THREE.MathUtils.randFloatSpread(2 * Math.PI);
            rotation.z = THREE.MathUtils.randFloatSpread(2 * Math.PI);

            heights[i] = (position.y - minY) / (maxY - minY);

            matrix.makeRotationFromEuler(rotation);
            matrix.setPosition(position);

            mesh.setMatrixAt( i, matrix );
        }

        mesh.updateMatrix();
        mesh.instanceMatrix.needsUpdate = true;

        this.mesh.geometry.setAttribute('aHeightFactor', new THREE.InstancedBufferAttribute(heights, 1, false));
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