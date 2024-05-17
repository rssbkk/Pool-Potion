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

        this.createBoxes();
    }

    createBox(name)
    {
        const interactionObjectGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const colors = [
            { color: new THREE.Color(1, 0, 0), positions: [ new THREE.Vector3(2.0, 0, 2.0), new THREE.Vector3(-2.0, 0, -2.0), new THREE.Vector3(2.0, 0, -2.0), new THREE.Vector3(-2.0, 0, 2.0)], name: "red" },
            { color: new THREE.Color(0, 1, 0), positions: [ new THREE.Vector3(1.8, 0, 1.8), new THREE.Vector3(-1.8, 0, -1.8), new THREE.Vector3(1.8, 0, -1.8), new THREE.Vector3(-1.8, 0, 1.8)], name: "green" },
            { color: new THREE.Color(0, 0, 1), positions: [ new THREE.Vector3(1.6, 0, 1.8), new THREE.Vector3(-1.6, 0, -1.8), new THREE.Vector3(1.6, 0, -1.8), new THREE.Vector3(-1.6, 0, 1.8)], name: "blue" },
            { color: new THREE.Color(1, 1, 0), positions: [ new THREE.Vector3(2.0, 0, 1.8), new THREE.Vector3(-2.0, 0, -1.8), new THREE.Vector3(2.0, 0, -1.8), new THREE.Vector3(-2.0, 0, 1.8)], name: "yellow" },
            { color: new THREE.Color(0, 1, 1), positions: [ new THREE.Vector3(1.6, 0, 2.0), new THREE.Vector3(-1.6, 0, -2.0), new THREE.Vector3(1.6, 0, -2.0), new THREE.Vector3(-1.6, 0, 2.0)], name: "cyan" },
            { color: new THREE.Color(1, 0, 1), positions: [ new THREE.Vector3(2.2, 0, 1.8), new THREE.Vector3(-2.2, 0, -1.8), new THREE.Vector3(2.2, 0, -1.8), new THREE.Vector3(-2.2, 0, 1.8)], name: "magenta" }
        ];

        const objectInfo = colors.find( color => color.name === name );
        const randomNumber = Math.round(Math.random() * (objectInfo.positions.length - 1));
        const randomPosition = objectInfo.positions[randomNumber];

        const material = new THREE.MeshToonMaterial({ color: objectInfo.color });
        const mesh = new THREE.Mesh(interactionObjectGeometry, material);
        
        mesh.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
        mesh.name = name;
        mesh.userData.type = "interactive";
        this.scene.add(mesh);
    }

    createBoxes() {
        const interactionObjectGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const colors = [
            { color: new THREE.Color(1, 0, 0), position: [-0.45, 0, -1.45], name: "red" },
            { color: new THREE.Color(0, 1, 0), position: [-1.45, 0, -0.45], name: "green" },
            { color: new THREE.Color(0, 0, 1), position: [0.95, 0, -1.25], name: "blue" },
            { color: new THREE.Color(1, 1, 0), position: [1.45, 0, -0.05], name: "yellow" },
            { color: new THREE.Color(0, 1, 1), position: [0.95, 0, 1.15], name: "cyan" },
            { color: new THREE.Color(1, 0, 1), position: [-0.45, 0, 1.45], name: "magenta" }
        ];
    
        colors.forEach(({ color, position, name }) => {
            const material = new THREE.MeshToonMaterial({ color });
            const mesh = new THREE.Mesh(interactionObjectGeometry, material);
            mesh.position.set(...position);
            mesh.name = name;
            mesh.userData.type = "interactive";
            this.scene.add(mesh);
        });
    }
}