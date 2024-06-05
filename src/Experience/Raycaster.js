import * as THREE from 'three'
import Experience from './Experience.js'
import InteractionAnimation from './world/worldUtils/InteractionAnimation.js';

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
        this.previousIntersect = null;

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

        // Raycaster to ignore grass and trees
        this.instance.layers.set(0);
    }

    populateArray()
    {
        this.scene.traverse((object) => {
            if(object.userData.type === 'interactive')
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
                const worldPosition = new THREE.Vector3();
                this.currentIntersect.object.parent.getWorldPosition(worldPosition);

                this.interactionAnimation.animate(this.currentIntersect.object.parent, worldPosition, this.currentIntersect.object.parent.parent.name);
            }
        });
    }

    update() {
        this.instance.setFromCamera(this.pointer, this.camera.instance);

        const intersects = this.instance.intersectObjects(this.objectsToTest);
        if (intersects.length) {
            this.currentIntersect = intersects[0];

            if(this.currentIntersect !== this.previousIntersect) {
                if(this.previousIntersect) {
                    this.previousIntersect.scale.set(1, 1, 1);
                }
                this.currentIntersect.object.parent.scale.set(1.1, 1.1, 1.1);

                this.previousIntersect = this.currentIntersect.object.parent;
            }
        } else {
            if(this.previousIntersect) {
                this.previousIntersect.scale.set(1, 1, 1);
                this.previousIntersect = null;
            }

            this.currentIntersect = null;
        }
    }
}