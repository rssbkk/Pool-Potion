import * as THREE from 'three'
import Experience from './Experience.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Render')
            this.debugObject = {};
            this.debugFolder.close();
        }

        this.composer = null;

        this.createInstance();
        //this.postProcess();
    }

    createInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            precision: "lowp",
        });
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.BasicShadowMap;
        this.instance.setClearColor('#211d20');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    postProcess()
    {
        this.composer = new EffectComposer( this.instance );
        this.composer.setPixelRatio(this.sizes.pixelRatio);
        this.composer.setSize(this.sizes.width, this.sizes.height);

        this.renderPixelatedPass = new RenderPixelatedPass( 3, this.scene, this.camera.instance );
        this.renderPixelatedPass.normalEdgeStrength = 1.5;
        this.renderPixelatedPass.depthEdgeStrength = 1.25;
        this.renderPixelatedPass = new RenderPixelatedPass( 3, this.scene, this.camera.instance );

        this.composer.addPass( this.renderPixelatedPass );

        this.outputPass = new OutputPass();
        this.composer.addPass( this.outputPass );

        if(this.debug.active)
        {
            this.debugObject.pixelSize = 3;
            
            this.debugObject.pixelAlignedPanning= true;

            this.debugFolder.add( this.debugObject, 'pixelSize' )
                .min( 1 )
                .max( 40 )
                .step( 1 )
                .onChange( () => {
                    this.renderPixelatedPass.setPixelSize( this.debugObject.pixelSize );
                } );
            this.debugFolder.add( this.renderPixelatedPass, 'normalEdgeStrength' )
                .min( 0 )
                .max( 4 )
                .step( .05 );
            this.debugFolder.add( this.renderPixelatedPass, 'depthEdgeStrength' )
                .min( 0 )
                .max( 2 )
                .step( .05 );
            // this.debugFolder.add( this.debugObject, 'pixelAlignedPanning' );
        }
    }

    resize()
    {
        this.instance.setSize(this.sizes.width , this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        // this.composer.render();
        this.instance.render( this.scene, this.camera.instance)
    }
}