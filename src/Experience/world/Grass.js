import * as THREE from 'three';
import Experience from '../Experience.js';
import Floor from './Floor.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import grassVertexShader from './shaders/grassShader/grassVertex.glsl';
import grassFragmentShader from './shaders/grassShader/grassFragment.glsl';

export default class Grass
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        this.floor = new Floor();

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Grass');
            this.debugObject = {};
        }

        this.createInstance();
    }

    createInstance()
    {
        const instanceCount = 2000;
        const sampler = new MeshSurfaceSampler(this.floor.groundMesh).build();
        const positions = new Float32Array(instanceCount * 3)

        const bladeGeometry = new THREE.PlaneGeometry( .1, .5,);
        const instancedGeometry = new THREE.InstancedBufferGeometry().copy(bladeGeometry);
        instancedGeometry.instanceCount = instanceCount;

        for(let i = 0; i < instanceCount; i++) {
            const position = new THREE.Vector3();
            sampler.sample(position);
            this.floor.groundMesh.updateMatrixWorld(); //use "true" if the mesh has children that will need updated
            position.applyMatrix4(this.floor.groundMesh.matrixWorld);
            positions.set([position.x, position.y, position.z], i * 3);
        }

        const instancedPositions = new THREE.InstancedBufferAttribute(positions, 3);
        instancedGeometry.setAttribute('aPosition', instancedPositions);

        this.material = new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: 
            {
                uTime: { value: 0 }
            }
        });

        const mesh = new THREE.Mesh(instancedGeometry, this.material);

        this.scene.add(mesh);
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}
