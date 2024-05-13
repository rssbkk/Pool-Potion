import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import Experience from '../Experience.js';

import leafVertexShader from"./shaders/leafShader/leafVertex.glsl";
import leafFragmentShader from "./shaders/leafShader/leafFragment.glsl";

export default class Leaf
{
    constructor()
    {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.debug = this.experience.debug;

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
            // uLeafColor1: new THREE.Color(0x9bd38d),
            // uLeafColor2: new THREE.Color(0x1f352a),
            // uLeafColor3: new THREE.Color(0xffff00)
        }

        this.geometry = new THREE.PlaneGeometry( 0.02, 0.02 )
        this.leafMaterial = new THREE.ShaderMaterial({
            vertexShader: leafVertexShader,
            fragmentShader: leafFragmentShader,
            uniforms: {
                uEffectBlend: new THREE.Uniform(this.leafUniforms.uEffectBlend),
                uInflate: new THREE.Uniform(this.leafUniforms.uInflate),
                uScale: new THREE.Uniform(this.leafUniforms.uScale),
                uWindSpeed: new THREE.Uniform(this.leafUniforms.uWindSpeed),
                uWindTime: new THREE.Uniform(this.leafUniforms.uWindTime),
                uFoliageImage: new THREE.Uniform(this.foliageImage),
                // uLeafColor1: new THREE.Uniform(this.leafUniforms.uLeafColor1),
                // uLeafColor2: new THREE.Uniform(this.leafUniforms.uLeafColor2),
                // uLeafColor3: new THREE.Uniform(this.leafUniforms.uLeafColor3)
            }
        })
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'leaf',
                expanded: true
            });

            // SHADER LEAF MATERIAL DEBUG
            const shaderFolder = this.debugFolder.addFolder({ title: 'Shader Properties' });

            shaderFolder.addBinding(this.leafUniforms, 'uEffectBlend', {
                label: 'uEffectBlend',
                min: 0,
                max: 2,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uInflate', {
                label: 'uInflate',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uScale', {
                label: 'uScale',
                min: 0,
                max: 3,
                step: 0.1
            }).on('change', () => {
                this.updateMaterial();
            });
            shaderFolder.addBinding(this.leafUniforms, 'uWindSpeed', {
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
        }
    }

    update()
    {
        this.leafMaterial.uniforms.uWindTime.value = this.leafUniforms.uWindTime += this.leafMaterial.uniforms.uWindSpeed.value * this.time.delta * 0.002;
    }
}