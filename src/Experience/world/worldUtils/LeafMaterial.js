import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

import Experience from '../../Experience.js';

import leafVertexShader from "../shaders/leafShader/leafVertex.glsl";

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

        
    }

    createLeafMaterial()
    {
        this.foliageImage = this.experience.resources.items.foliageImage;

        this.leafUniforms =
        {
            uEffectBlend: 0.9,
            uInflate: 0.7,
            uScale: 0.7,
            uWindSpeed: 1,
            uWindTime: 0.0,
        }

        this.leafMaterial = new CustomShaderMaterial({
            baseMaterial: new THREE.MeshToonMaterial(),
            vertexShader: leafVertexShader,
            uniforms: {
                uEffectBlend: new THREE.Uniform(this.leafUniforms.uEffectBlend),
                uInflate: new THREE.Uniform(this.leafUniforms.uInflate),
                uScale: new THREE.Uniform(this.leafUniforms.uScale),
                uWindSpeed: new THREE.Uniform(this.leafUniforms.uWindSpeed),
                uWindTime: new THREE.Uniform(this.leafUniforms.uWindTime),
                uFoliageImage: new THREE.Uniform(this.foliageImage),
            },
            silent: true,
            transparent: true,
            alphaMap: this.foliageImage,
            alphaTest: 0.5,
        })
    }

    setupLeafMaterialDebug()
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