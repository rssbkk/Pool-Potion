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
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Camera',
                expanded: false
            });
            this.debugObject = {};
        }

        this.setInstance();
        this.setControls();
    }

    setInstance()
    {
        this.instance = new THREE.OrthographicCamera( - this.sizes.aspectRatio, this.sizes.aspectRatio, 1, -1, 0.1, 100 );
        //.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)

        this.instance.position.set(6, 4, 8);
        this.instance.layers.enable(1);
        this.scene.add(this.instance);
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        // this.controls.enableDamping = true;
        // this.controls.enablePan = false;
        // this.controls.maxZoom = 1.3;
        // this.controls.minZoom = 0.45;
        // this.controls.maxPolarAngle = 1.2;
        // this.controls.minPolarAngle = 0.65;

        if(this.debug.active)
        {
            this.debugFolder.addBinding(this.controls, 'maxZoom', {
                min: 0,
                max: 20,
                step: 0.05,
                label: 'Max Distacne'
            })
            .on('change', () =>
            {
                this.controls.update();
            });
            
            this.debugFolder.addBinding(this.controls, 'minZoom', {
                min: -5,
                max: 5,
                step: 0.05,
                label: 'Min Distance'
            })
            .on('change', () =>
            {
                this.controls.update();
            });

            this.debugFolder.addBinding(this.controls, 'maxPolarAngle', {
                min: 0,
                max: 10,
                step: 0.05,
                label: 'Max Angle'
            })
            .on('change', () =>
            {
                this.controls.update();
            });
            
            this.debugFolder.addBinding(this.controls, 'minPolarAngle', {
                min: 0,
                max: 3.14,
                step: 0.05,
                label: 'Min Angle'
            })
            .on('change', () =>
            {
                this.controls.update();
            });
        }
    }

    resize()
    {
        this.instance.left = - this.sizes.aspectRatio;
        this.instance.right = this.sizes.aspectRatio;
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}