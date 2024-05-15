import * as THREE from 'three'
import Experience from './Experience.js'
import InteractionAnimation from './world/InteractionAnimation.js';

export default class Raycaster {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.interactionAnimation = this.experience.interactionAnimation;

        this.lastUpdate = this.time.current;
        this.updateInterval = 5000;

        this.objectsToTest = [];
        this.currentIntersect = null;

        this.createPointer();
        this.populateArray();
        this.createInstance();
        this.triggerAnimation();
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

    populateArray()
    {
        this.scene.traverse((object) => {
            if(object.userData.type)
                {
                    this.objectsToTest.push(object)
                }
        })
    }

    triggerAnimation()
    {
        window.addEventListener('click', () => {
            if(this.currentIntersect)
            {
                this.interactionAnimation.animate(this.currentIntersect.object.position);
            }
        });
    }

    update() {
        this.instance.setFromCamera(this.pointer, this.camera.instance);

        const now = this.time.current;
        if(now - this.lastUpdate > this.updateInterval)
        {
            this.populateArray();
            this.lastUpdate = now;
        }

        const intersects = this.instance.intersectObjects(this.objectsToTest);
        if (intersects.length) {
            this.currentIntersect = intersects[0];
        } else {
            this.currentIntersect = null;
        }
    }
}