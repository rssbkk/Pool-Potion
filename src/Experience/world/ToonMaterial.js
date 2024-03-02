import * as THREE from 'three';

import Experience from '../Experience.js';
import Renderer from '../Renderer.js';

export default class ToonMaterial 
{
    constructor()
    {
        this.experience = new Experience();
        this.renderer = new Renderer();
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('ToonMat');
            this.debugObject = {};
            this.debugFolder.close();
        }

        this.stepSize = 0.5;
        this.toonMaterial = null;

        this.createMaterial();
    }

    createMaterial()
    {
        const format = ( this.renderer.instance.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

        for ( let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += this.stepSize, alphaIndex ++ ) {

            const colors = new Uint8Array( alphaIndex + 2 );
        
            for ( let c = 0; c <= colors.length; c ++ ) {
        
                colors[ c ] = ( c / colors.length ) * 255;
        
            }
        
            const gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
            gradientMap.needsUpdate = true;
        
            this.toonMaterial = new THREE.MeshToonMaterial( {
                gradientMap: gradientMap
            } );
        }
    }
}