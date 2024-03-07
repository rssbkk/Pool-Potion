import * as THREE from 'three';
import Experience from '../Experience.js';
import ToonMaterial from './ToonMaterial.js';

export default class Grass
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = new ToonMaterial().toonMaterial;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Grass');
            this.debugObject = {};
            this.debugFolder.close();
        }

        this.instanceCount = 200;
        this.grassPositions = [];
        this.mesh = null;
        this.createInstance();
    }

    createInstance()
    {
        const planeSize = 5;

        const bladeGeometry = this.experience.resources.items.grass.scene.children[0].geometry;
        const bladeMaterial = this.toonMaterial;
        // const bladeMaterial = new THREE.MeshStandardMaterial();

        this.mesh = new THREE.InstancedMesh( bladeGeometry, bladeMaterial, this.instanceCount );

        for(let i = 0; i < this.instanceCount; i++) {
            const position = new THREE.Vector3(
                Math.random() * planeSize - planeSize / 2,
                0.1,
                Math.random() * planeSize - planeSize / 2
            );

            this.grassPositions.push(position);

            const scale = 1;
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI * 0.5, 0, 0, 'XYZ'));

            const matrix = new THREE.Matrix4();
            matrix.compose( position, quaternion, new THREE.Vector3( scale, scale, scale ));
            this.mesh.setMatrixAt( i, matrix );
        }

        // this.this.mesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.mesh);
    }

    update()
    {
        const scale = new THREE.Vector3(1, 1, 1); // Assuming uniform scale for simplicity
        const upDirection = new THREE.Vector3(0, 1, 0);

        for (let i = 0; i < this.instanceCount; i++) {
            const position = this.grassPositions[i];

            // Compute direction towards the camera
            const direction = new THREE.Vector3();
            direction.subVectors(this.camera.instance.position, position).normalize();

            // Calculate rotation around Y-axis
            const angle = Math.atan2(direction.x, direction.z);
            const quaternion = new THREE.Quaternion().setFromAxisAngle(upDirection, angle);

            // Compose the new transformation matrix
            const matrix = new THREE.Matrix4();
            matrix.compose(position, quaternion, scale);

            // Update the instance matrix
            this.mesh.setMatrixAt(i, matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}
