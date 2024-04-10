import * as THREE from 'three';
import Experience from '../Experience.js';

export default class ToonMaterial {
    constructor() {
        this.experience = new Experience();
        this.renderer = this.experience.renderer;
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'ToonMat',
                expanded: false
            });
            this.debugObject = {
                stepSize: this.stepSize
            };
        }

        this.stepSize = 0.3;
        this.toonMaterial = null;

        this.createMaterial();
    }

    createMaterial() 
    {
        this.toonMaterial = new THREE.MeshToonMaterial({
            gradientMap: this.createGradientMap(this.stepSize),
            precision: "lowp"
        })
    }

    createGradientMap(stepSize) 
    {
        if (this.debug.active) 
        {
            this.debugObject.stepSize = this.stepSize;
            this.debugFolder.addBinding(this.debugObject, 'stepSize', {
                min: 0,
                max: 2,
                step: 0.01,
                label: 'Step Size'
            })
            .on('finish', () => 
            {
                this.stepSize = this.debugObject.stepSize;
                this.toonMaterial.dispose(); // Dispose only if necessary
                this.createMaterial();
                // Here, propagate the update to all meshes using this.toonMaterial
                this.updateAllMeshes(); // You'll need to implement this method
            })
        }

        // const format = (this.renderer.instance.capabilities.isWebGL2) ? THREE.RedFormat : THREE.LuminanceFormat;
        let alphaIndex = Math.floor(1.0 / stepSize) + 1;
        const colors = new Uint8Array(alphaIndex + 1);

        for (let c = 0; c <= alphaIndex; c++) {
            colors[c] = (c / alphaIndex) * 255;
        }

        const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
        gradientMap.needsUpdate = true;

        return gradientMap;
    }

    updateAllMeshes() {
        this.experience.scene.traverse((object) => {
            if (object.isMesh && object.material === this.toonMaterial) {
                console.log('Material recognised and chenged');
                object.material = this.toonMaterial;
                object.material.needsUpdate = true;
            }
        });
    }
    
}