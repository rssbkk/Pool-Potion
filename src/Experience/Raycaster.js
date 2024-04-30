import * as THREE from 'three'
import Experience from './Experience.js'

export default class Raycaster {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.currentIntersect = null;

        this.createPointer();
        this.createInstance();
    }

    createPointer() {
        this.pointer = new THREE.Vector2();

        window.addEventListener('pointermove', (event) => {
            this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
            this.pointer.y = - (event.clientY / this.sizes.height) * 2 + 1;
        });
    }

    createInstance() {
        this.instance = new THREE.Raycaster();
    }

    update() {
        this.instance.setFromCamera(this.pointer, this.camera.instance);

        const intersects = this.instance.intersectObjects(this.objectsToTest);
        if (intersects.length) {
            this.currentIntersect = intersects[0];
        } else {
            this.currentIntersect = [];
        }
    }
}