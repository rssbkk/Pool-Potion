import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera
{
    constructor()
    {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Camera');
            this.debugObject = {};
            this.debugFolder.close();
        }

        this.setInstance();
        this.setControls();
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.maxDistance = 10;
        this.controls.minDistance = 2;
        this.controls.maxPolarAngle = 1.4;
        this.controls.minPolarAngle = 0.5;

        if(this.debug.active)
        {
            this.debugFolder.add(this.controls, 'maxDistance')
                .min(0)
                .max(20)
                .step(.05)
                .name('Max Distance')
                .onChange(() =>
                {
                    this.controls.update();
                });
            
            this.debugFolder.add(this.controls, 'minDistance')
                .min(-5)
                .max(5)
                .step(.05)
                .name('Min Distance')
                .onChange(() =>
                {
                    this.controls.update();
                });

            this.debugFolder.add(this.controls, 'maxPolarAngle')
                .min(0)
                .max(10)
                .step(.05)
                .name('Max Angle')
                .onChange(() =>
                {
                    this.controls.update();
                });
            
            this.debugFolder.add(this.controls, 'minPolarAngle')
                .min(0)
                .max(3.14)
                .step(.05)
                .name('Min Angle')
                .onChange(() =>
                {
                    this.controls.update();
                });
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}