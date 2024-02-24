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
        const instanceCount = 20;
        const sampler = new MeshSurfaceSampler(this.floor.groundMesh).build();
        const positions = new Float32Array(instanceCount * 3)

        const bladeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const instancedGeometry = new THREE.InstancedBufferGeometry().copy(bladeGeometry);
        instancedGeometry.instanceCount = instanceCount;

        console.log(instancedGeometry);

        for(let i = 0; i < instanceCount; i++) {
            const position = new THREE.Vector3();
            sampler.sample(position);
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

        console.log(mesh);
        this.scene.add(mesh);


        // // Create an instanced mesh with the given geometry and material
        // const instancedMesh = new THREE.InstancedMesh( testSphereGeometry, this.material, instanceCount);
    
        // const dummy = new THREE.Object3D();
        // const position = new THREE.Vector3();
        // const normal = new THREE.Vector3();
    
        // // Sample positions on the surface of the geometry for each instance
        // for (let i = 0; i < instanceCount; i++) {
        //     sampler.sample(position, normal);
    
        //     // Optionally, align the instance with the normal
        //     dummy.position.copy(position);
        //     // dummy.lookAt(normal.add(position));
        //     dummy.scale.setScalar(Math.random() * 0.01 + 0.02);
        //     dummy.updateMatrix();
    
        //     instancedMesh.setMatrixAt(i, dummy.matrix);
        // }

        // this.scene.add(instancedMesh);
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}
