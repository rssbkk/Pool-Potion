import * as THREE from 'three';
import Experience from '../Experience.js';

import potionVertexShader from './shaders/potionShader/potionVertex.glsl';
import potionFragmentShader from './shaders/potionShader/potionFragment.glsl';

export default class Potion 
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('potion');
            this.debugObject = {};
        }

        this.setGeometry();
        this.setMaterial()
        this.setInteraction();
        this.setMesh()
    }

    setGeometry()
    {
        // Potion Dimension Tweaks
        const potionDimensions = {
            XScale : 1.565,
            YScale : 1.565,
            divisions: 64
        }

        this.geometry = new THREE.PlaneGeometry( 
            potionDimensions.XScale, 
            potionDimensions.YScale, 
            potionDimensions.divisions, 
            potionDimensions.divisions
        );

        if(this.debug.active)
        {
            this.geometryTweaks = this.debugFolder.addFolder('Geometry')

            this.geometryTweaks.add(potionDimensions, 'XScale')
                .min(0)
                .max(10)
                .step(.005)
                .name('X Size')
                .onFinishChange(() =>
                {
                    setMesh.dispose()
                    potionMesh.geometry = new THREE.PlaneGeometry( 
                        potionDimensions.XScale, 
                        potionDimensions.YScale, 
                        potionDimensions.divisions, 
                        potionDimensions.divisions
                    )
                });

                this.geometryTweaks.add(potionDimensions, 'YScale')
                .min(0)
                .max(10)
                .step(.005)
                .name('Y Size')
                .onFinishChange(() =>
                {
                    potionMesh.geometry.dispose()
                    potionMesh.geometry = new THREE.PlaneGeometry( 
                        potionDimensions.XScale, 
                        potionDimensions.YScale, 
                        potionDimensions.divisions, 
                        potionDimensions.divisions
                    )
                });

                this.geometryTweaks.add(potionDimensions, 'divisions')
                    .min(64)
                    .max(1028)
                    .step(8)
                    .name('Divisions')
                    .onFinishChange(() =>
                    {
                        potionMesh.geometry.dispose()
                        potionMesh.geometry = new THREE.PlaneGeometry( 
                            potionDimensions.XScale, 
                            potionDimensions.YScale, 
                            potionDimensions.divisions, 
                            potionDimensions.divisions
                        )
                    });
        }
    }

    setMaterial()
    {
        // Potion Colour
        this.debugObject.depthColor = '#367981';
        this.debugObject.surfaceColor = '#6d90a2';

        this.material = new THREE.ShaderMaterial({
            vertexShader: potionVertexShader,
            fragmentShader: potionFragmentShader,
            // side: THREE.DoubleSide,
            uniforms:
            {
                uTime: { value: 0 },
                
                uBigWavesElevation: { value: 0.055 },
                uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                uBigWavesSpeed: { value: 0.2 },
        
                uSmallWavesElevation: { value: 0.055 },
                uSmallWavesFrequency: { value: 3 },
                uSmallWavesSpeed: { value: 0.45 },
                uSmallIterations: { value: 4 },
        
                uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
                uSurfaceColor: { value: new THREE.Color(this.debugObject.surfaceColor) },
                uColorOffset: { value: 0 },
                uColorMultiplier: { value: 7 }
            },
            wireframe: true
        });

        if(this.debug.active)
        {
            this.materialTweaks = this.debugFolder.addFolder('Material Tweaks')

                // // Potion Tweaks
            this.materialTweaks.add(this.material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
            this.materialTweaks.add(this.material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
            this.materialTweaks.add(this.material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
            this.materialTweaks.add(this.material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')


            this.materialTweaks.add(this.material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
            this.materialTweaks.add(this.material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
            this.materialTweaks.add(this.material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
            this.materialTweaks.add(this.material.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

            this.materialTweaks.add(this.material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
            this.materialTweaks.add(this.material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
        }
    }

    setInteraction()
    {
        // Animation configuration
        let animationCount = 0;

        const animationConfig = {
            uBigWavesElevation: { min: 0.25, max: 1 },
            uBigWavesSpeed: { min: 0.25, max: 2.5 },
            uSmallWavesElevation: { min: 0.15, max: 1 },
            uSmallWavesFrequency: { min: 2, max: 15 },
            uSmallWavesSpeed: { min: 0, max: 2 },
            // Special case without min/max
            uSmallIterations: { isIterations: true }
        };

        // Generalized animate function
        const animateProperty = (propertyKey) => {
            animationCount += 1;

            let config = animationConfig[propertyKey];
            let previous = potionMaterial.uniforms[propertyKey].value;
            let tinyRandom = (Math.random() - 0.5) / 5;
            let newValue;

            // console.log('config = ' + config);

            if (config.isIterations) {
                newValue = Math.round(Math.random() * 4);
            } else {
                newValue = Math.max(config.min, Math.min(config.max, (previous + tinyRandom)));
                if(newValue === previous) {
                    newValue = (config.max - config.min) / 2;
                }
            }

            // console.log("config min = " + config.min);
            // console.log("config max = " + config.max);
            // console.log("tr = " + tinyRandom);
            // console.log("prv = " + previous);
            // console.log("nv = " + newValue);

            gsap.to(potionMaterial.uniforms[propertyKey], {
                value: newValue,
                duration: 1,
                ease: "power2.inOut"
            });

            console.log(`${propertyKey} ${potionMaterial.uniforms[propertyKey].value}`);

            //Color Animation
            gsap.to(potionMaterial.uniforms.uDepthColor.value, {
                r: Math.random(),
                g: Math.random(),
                b: Math.random(),
                duration: 2,
                ease: "power1.inOut",
                onUpdate: function () {
                    potionMaterial.uniforms.uDepthColor.value.needsUpdate = true;
                }
            });
            gsap.to(potionMaterial.uniforms.uSurfaceColor.value, {
                r: Math.random(),
                g: Math.random(),
                b: Math.random(),
                duration: 2,
                ease: "power1.inOut",
                onUpdate: function () {
                    potionMaterial.uniforms.uSurfaceColor.value.needsUpdate = true;
                }
            });
        };

    }

    setMesh()
    {
        
        let potionMesh = new THREE.Mesh( this.geometry, this.material);
        
        potionMesh.rotation.x = - Math.PI * 0.5;
        
        potionMesh.position.x = 0;
        potionMesh.position.y = 0.45;
        potionMesh.position.z = 0;
        this.scene.add(potionMesh);

        if(this.debug.active)
        {
            this.positionTweaks = this.debugFolder.addFolder('Potion Position')

            //  Potion Positioning Tweaks
            this.positionTweaks.add(potionMesh.position, 'x').min(-10).max(10).step(0.5).name('X Position');
            this.positionTweaks.add(potionMesh.position, 'y').min(-10).max(10).step(0.01).name('Y Position');
            this.positionTweaks.add(potionMesh.position, 'z').min(-10).max(10).step(0.5).name('Z Position');
        }
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}