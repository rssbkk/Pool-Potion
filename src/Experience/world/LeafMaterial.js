import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

import Experience from '../Experience.js';

import leafVertexShader from"./shaders/leafShader/leafVertex.glsl";
import leafFragmentShader from "./shaders/leafShader/leafFragment.glsl";

export default class Leaf
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;

        this.leafMaterial = null;

        this.createLeafMaterial();
        this.setupDebug();
    }

    createLeafMaterial()
    {
        // this.perlinTexture = this.experience.resources.items.perlinNoiseImage;
        // this.perlinTexture.wrapS = this.perlinTexture.wrapT = THREE.RepeatWrapping;
        this.foliageImage = this.experience.resources.items.foliageImage;

        this.leafUniforms =
        {
            uEffectBlend: 1.0,
            uInflate: 1,
            uScale: 1,
            uWindSpeed: 1,
            uWindTime: 0.0,
            uLeafColor: new THREE.Color(0x228b22),
        }

        // (0x3f6d21)
        // (0x9bd38d),
        // (0x1f352a),
        // (0x228b22) ,

        this.leafMaterial = new CustomShaderMaterial({
            baseMaterial: new THREE.MeshToonMaterial({color: this.leafUniforms.uLeafColor}),
            vertexShader: leafVertexShader,
            uniforms: {
                uEffectBlend: new THREE.Uniform(this.leafUniforms.uEffectBlend),
                uInflate: new THREE.Uniform(this.leafUniforms.uInflate),
                uScale: new THREE.Uniform(this.leafUniforms.uScale),
                uWindSpeed: new THREE.Uniform(this.leafUniforms.uWindSpeed),
                uWindTime: new THREE.Uniform(this.leafUniforms.uWindTime),
                uFoliageImage: new THREE.Uniform(this.foliageImage),
            },
            transparent: true,
            alphaMap: this.foliageImage,
            alphaTest: 0.5,
        })

        console.log(this.leafMaterial);
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Leaf Material',
                expanded: false
            });

            this.debugFolder.addBinding(this.leafUniforms, 'uEffectBlend', {
                label: 'uEffectBlend',
                min: 0,
                max: 2,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            this.debugFolder.addBinding(this.leafUniforms, 'uInflate', {
                label: 'uInflate',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            this.debugFolder.addBinding(this.leafUniforms, 'uScale', {
                label: 'uScale',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            this.debugFolder.addBinding(this.leafUniforms, 'uWindSpeed', {
                label: 'uWindSpeed',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });

            this.updateMaterial = () => 
            {
                // Update only the uniform values directly instead of recreating the material
                Object.keys(this.leafUniforms).forEach(key => 
                {
                    if (key in this.leafMaterial.uniforms) 
                    {
                        this.leafMaterial.uniforms[key].value = this.leafUniforms[key];
                    }
                })
            };

            this.updateMaterialColor = (value) => 
            {
                console.log(value);
                this.leafMaterial.color.value.set(value);
            };

        }
    }

    update()
    {
        this.leafMaterial.uniforms.uWindTime.value = this.leafUniforms.uWindTime += this.leafMaterial.uniforms.uWindSpeed.value * this.time.delta * 0.002;
    }
}