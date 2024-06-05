import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

import Experience from '../Experience.js';

import leafVertexShader from "./shaders/leafShader/leafVertex.glsl";

export default class Landscape
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;

        this.sceneObject = {};
        this.sceneObjectColumns = [];
        this.sceneObjectRocks = [];
        this.sceneObjectTrunks = [];
        this.sceneObjectLeaves = [];

        this.leafMaterial = null;

        this.createLeafMaterial();
        this.setupLeafMaterialDebug();
        this.createLandscape();
        this.seperateParts();
        this.setupDebug();
    }
    
    createLandscape()
    {
        this.model = this.experience.resources.items.landscape.scene;
        this.model.layers.set(1);

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = this.toonMaterial;
            }
        })
        this.scene.add(this.model);
    }

    seperateParts()
    {
        // Seperate Leaves
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('canopy'))
            {
                this.sceneObjectLeaves.push(child);
                child.material = this.leafMaterial;
                child.material.color = new THREE.Color(0x228b22);
                child.frustumCulled = false;
            }
        });

        // Seperate Trunks
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('trunk'))
            {
                this.sceneObjectTrunks.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0x573711);
            }
        });
        
        // Seperate Rocks
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('rock'))
            {
                this.sceneObjectRocks.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xa66fa6);
            }
        });
        
        // Seperate Columns
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('plane'))
            {
                this.sceneObjectColumns.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xbcb8aa);
            }
        });
        
        // Seperate Well
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('well'))
            {
                this.sceneObject.well = child;
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xa5a192);
            }
        });
        
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('underground'))
            {
                this.sceneObject.well = child;
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xa5a192);
                child.material.side = THREE.BackSide;
            }
        });
    }

    createLeafMaterial()
    {
        this.foliageImage = this.experience.resources.items.foliageImage;

        this.leafUniforms =
        {
            uEffectBlend: 0.9,
            uInflate: 0.7,
            uScale: 0.7,
            uWindSpeed: 0.45,
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

    
    setupDebug()
    {
        if(this.debug.active)
            {
                this.LandscapeTweaks = this.debug.pane.addFolder({
                    title: 'Landscape',
                    expanded: false
                });
                
                this.debugObject = {
                    wellColor: `#${this.sceneObject.well.material.color.getHexString()}`,
                    columnColor: `#${this.sceneObjectColumns[0].material.color.getHexString()}`,
                    trunkColor: `#${this.sceneObjectTrunks[0].material.color.getHexString()}`,
                    rockColor: `#${this.sceneObjectRocks[0].material.color.getHexString()}`,
                    leavesColor: `#${this.sceneObjectLeaves[0].material.color.getHexString()}`
                };
                
                this.LandscapeTweaks.addBinding(this.debugObject, 'wellColor').on('change', () => this.sceneObject.well.material.color.set(this.debugObject.wellColor)),
                this.LandscapeTweaks.addBinding(this.debugObject, 'columnColor').on('change', () => this.sceneObjectColumns.forEach(column => { column.material.color.set(this.debugObject.columnColor) })),
                this.LandscapeTweaks.addBinding(this.debugObject, 'trunkColor').on('change', () => this.sceneObjectTrunks.forEach(trunk => { trunk.material.color.set(this.debugObject.trunkColor) })),
                this.LandscapeTweaks.addBinding(this.debugObject, 'rockColor').on('change', () => this.sceneObjectRocks.forEach(rock => { rock.material.color.set(this.debugObject.rockColor) }))
                this.LandscapeTweaks.addBinding(this.debugObject, 'leavesColor').on('change', () => this.sceneObjectLeaves.forEach(leaves => { leaves.material.color.set(this.debugObject.leavesColor) }))
            }
        }
        
    update()
    {
        this.leafMaterial.uniforms.uWindTime.value = this.leafUniforms.uWindTime += this.leafMaterial.uniforms.uWindSpeed.value * this.time.delta * 0.002;
    }
}