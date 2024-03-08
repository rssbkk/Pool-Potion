import * as THREE from 'three';
import Experience from '../Experience.js';

export default class ToonMaterial {
    constructor() {
        this.experience = new Experience();
        this.renderer = this.experience.renderer;
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('ToonMat');
            this.debugObject = {};
            this.debugFolder.close();
        }

        this.stepSize = 0.7;
        this.toonMaterial = null;

        this.createMaterial();
    }

    createMaterial()
    {
        const format = ( this.renderer.instance.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

        for ( let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += this.stepSize, alphaIndex ++ ) {

            const colors = new Uint8Array( alphaIndex + 2 );
        
            for ( let c = 0; c <= colors.length; c ++ )
            {
                colors[ c ] = ( c / colors.length ) * 255;
            }
        
            const gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
            gradientMap.needsUpdate = true;
        
            this.toonMaterial = new THREE.MeshToonMaterial( {
                gradientMap: gradientMap,
                precision: "lowp"
            } );

            if(this.debug.active)
            {
                this.debugObject.stepSize = this.stepSize
                this.debugFolder.add(this.debugObject, 'stepSize')
                    .min(0)
                    .max(2)
                    .step(0.01)
                    .name('Step Size')
                    .onFinishChange( () => 
                    {
                        this.stepSize = this.debugObject.stepSize;
                        this.toonMaterial.dispose ();
                        this.createMaterial()
                    } );
            }
        }
    }
}

//     createMaterial() {
//         this.toonMaterial = new THREE.MeshToonMaterial({
//             gradientMap: this.createGradientMap(this.stepSize),
//             precision: "lowp"
//         })
//     }

//     createGradientMap(stepSize) {
//         const format = (this.renderer.instance.capabilities.isWebGL2) ? THREE.RedFormat : THREE.LuminanceFormat;
//         let alphaIndex = Math.floor(1.0 / stepSize) + 1;
//         const colors = new Uint8Array(alphaIndex + 1);

//         for (let c = 0; c <= alphaIndex; c++) {
//             colors[c] = (c / alphaIndex) * 255;
//         }

//         const gradientMap = new THREE.DataTexture(colors, colors.length, 1, format);
//         gradientMap.needsUpdate = true;

//         return gradientMap;
//     }

//     setupDebug() {
//         if (this.debug.active) {
//             this.debugObject.stepSize = this.stepSize;
//             this.debugFolder.add(this.debugObject, 'stepSize')
//                 .min(0)
//                 .max(2)
//                 .step(0.01)
//                 .name('Step Size')
//                 .onFinishChange(() => {
//                     this.stepSize = this.debugObject.stepSize;
//                     this.toonMaterial.dispose ();
//                     this.createMaterial();
//                 });
//         }
//     }
// }