import * as THREE from 'three';

import Experience from '../Experience.js';

export default class curveAnim
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.raycaster = this.experience.raycaster;


        // if(this.debug.active)
        // {
        //     this.debugFolder = this.debug.pane.addFolder({
        //         title: 'curve',
        //         expanded: true
        //     });
        //     this.debugObject = {};
        // }

        // this.createBox(5);
        this.createBoxes();
    }

    createBox(count)
    {
        const geometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });

        for(let i = 0; i < count; i++ )
        {
            this.box = new THREE.Mesh( geometry, material );
            this.box.position.set( 5 * Math.random() - 2.5, 0.5, 5 * Math.random() - 2.5);
            this.box.userData.type = "interactive";
            this.scene.add(this.box);
        }
    }

    createBoxes()
    {
        const interactionObjectGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2);

        const interactionObjectMaterial = new THREE.MeshToonMaterial({color: new THREE.Color( 1, 0, 0 ) });
        const interactionObjectMesh = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial );
        interactionObjectMesh.position.set(-0.45, 0, -1.45);
        interactionObjectMesh.name = "red";
        interactionObjectMesh.userData.type = "interactive";
        this.scene.add(interactionObjectMesh);

        const interactionObjectMaterial2 = new THREE.MeshToonMaterial({color: new THREE.Color( 0, 1, 0 ) });
        const interactionObjectMesh2 = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial2 );
        interactionObjectMesh2.position.set(-1.45, 0, -0.45);
        interactionObjectMesh2.name = "green";
        interactionObjectMesh2.userData.type = "interactive";
        this.scene.add(interactionObjectMesh2);

        const interactionObjectMaterial3 = new THREE.MeshToonMaterial({color: new THREE.Color( 0, 0, 1 ) });
        const interactionObjectMesh3 = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial3 );
        interactionObjectMesh3.position.set(0.95, 0, -1.25);
        interactionObjectMesh3.name = "blue";
        interactionObjectMesh3.userData.type = "interactive";
        this.scene.add(interactionObjectMesh3);

        const interactionObjectMaterial4 = new THREE.MeshToonMaterial({color: new THREE.Color( 1, 1, 0 ) });
        const interactionObjectMesh4 = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial4 );
        interactionObjectMesh4.position.set(1.45, 0, -0.05);
        interactionObjectMesh4.name = "yellow";
        interactionObjectMesh4.userData.type = "interactive";
        this.scene.add(interactionObjectMesh4);

        const interactionObjectMaterial5 = new THREE.MeshToonMaterial({color: new THREE.Color( 0, 1, 1 ) });
        const interactionObjectMesh5 = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial5 );
        interactionObjectMesh5.position.set(0.95, 0, 1.15);
        interactionObjectMesh5.name = "cyan";
        interactionObjectMesh5.userData.type = "interactive";
        this.scene.add(interactionObjectMesh5);

        const interactionObjectMaterial6 = new THREE.MeshToonMaterial({color: new THREE.Color( 1, 0, 1 ) });
        const interactionObjectMesh6 = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial6 );
        interactionObjectMesh6.position.set(-0.45, 0, 1.45);
        interactionObjectMesh6.name = "magenta";
        interactionObjectMesh6.userData.type = "interactive";
        this.scene.add(interactionObjectMesh6);

    }
}