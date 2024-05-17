import * as THREE from 'three';
import Experience from '../../Experience.js';

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
                stepSize: 0.5,
                anything: 8
            };
        }

        this.stepSize = 0.5;
        this.toonMaterial = null;

        this.createMaterial();
    }

    createMaterial() 
    {
        this.toonMaterial = new THREE.MeshToonMaterial({
            gradientMap: this.createGradientMap(this.stepSize),
            precision: "lowp"
        })

        if (this.debug.active) 
        {
            this.debugFolder.addBinding(this.toonMaterial, 'precision',
            {
                options: {
                    low: 'lowp',
                    medium: 'mediump',
                    high: 'highp'
                }
            })
        }
    }

    createGradientMap(stepSize) 
    {
        if (this.debug.active) 
        {
            this.debugFolder.addBinding(this.debugObject, 'stepSize', {
                min: 0.01,
                max: 2,
                step: 0.01,
            })
            .on('finish', (value) => {
                this.stepSize = value;
                this.toonMaterial.gradientMap = this.createGradientMap(this.stepSize);
                this.toonMaterial.gradientMap.needsUpdate = true;
                this.toonMaterial.needsUpdate = true;
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