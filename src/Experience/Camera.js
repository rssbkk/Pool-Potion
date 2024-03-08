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
        this.instance = new THREE.OrthographicCamera( - this.sizes.aspectRatio, this.sizes.aspectRatio, 1, -1, 0.1, 100 )
        //.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)

        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.maxZoom = 1.3;
        this.controls.minZoom = 0.45;
        this.controls.maxPolarAngle = 1.05;
        this.controls.minPolarAngle = 0.5;

        if(this.debug.active)
        {
            this.debugFolder.add(this.controls, 'maxZoom')
                .min(0)
                .max(20)
                .step(.05)
                .name('Max Distance')
                .onChange(() =>
                {
                    this.controls.update();
                });
            
            this.debugFolder.add(this.controls, 'minZoom')
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