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

        this.instanceCount = 5;

        this.createLeaf();
        this.createLeaves();
        // this.setupDebug();
    }

    // NOTES:
    // 1. InstancedMeshes to always face the camera
    // 2. instacned meshes to tilt from center along horizontal axis
    // 3. offset that by perlinNoise and world position
    // 4. test moving from under to remove normal and depth lines, same for grass

    createLeaf()
    {
        this.geometry = new THREE.PlaneGeometry( 0.5, 0.5 )
        this.material = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(0)
            }

        })
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.instanceCount );
        this.mesh.position.set( 0, 2, 0 );
        this.scene.add(this.mesh);
    }

    createLeaves()
    {

        this.samplerGeometry = new THREE.SphereGeometry(1, 5, 5);
        this.samplerMesh = new THREE.Mesh( this.samplerGeometry );

        const sampler = new MeshSurfaceSampler(this.samplerMesh).build();

        const position = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        for(let i = 0; i < this.instanceCount; i++ )
        {
            sampler.sample( position );
            matrix.makeTranslation( position );

            this.mesh.setMatrixAt( i, matrix );
        }

        this.mesh.updateMatrix();

    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed;
    }
}