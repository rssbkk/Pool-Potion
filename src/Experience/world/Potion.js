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
            this.debugFolder = this.debug.pane.addFolder({
                title: 'potion',
                expanded: false
            });
            this.debugObject = {};
        }

        this.createGeometry();
        this.createMaterial()
        this.createInteraction();
        this.createMesh()
    }

    createGeometry()
    {
        // Potion Dimension Tweaks
        const potionDimensions = 
        {
            XScale : 1.565,
            YScale : 1.565,
            divisions: 64
        }

        this.geometry = this.resources.items.potionGeometry.scene.children[0].geometry

        if (this.debug.active) 
        {
            const geometryTweaks = this.debugFolder.addFolder({
              title: 'Geometry',
            });
          
            // X Scale
            geometryTweaks.addBinding(potionDimensions, 'XScale', 
            {
              label: 'X Size',
              min: 0,
              max: 10,
              step: 0.005,
            }).on('change', (value) => {
              // Assuming createMesh is a method or an existing mesh you want to dispose of
              // This might need to be potionMesh.dispose() depending on your setup
              if (createMesh.dispose) createMesh.dispose();
              potionMesh.geometry = new THREE.PlaneGeometry(
                potionDimensions.XScale,
                potionDimensions.YScale,
                potionDimensions.divisions,
                potionDimensions.divisions
              );
            });
          
            // Y Scale
            geometryTweaks.addBinding(potionDimensions, 'YScale', 
            {
              label: 'Y Size',
              min: 0,
              max: 10,
              step: 0.005,
            }).on('change', () => {
              potionMesh.geometry.dispose();
              potionMesh.geometry = new THREE.PlaneGeometry(
                potionDimensions.XScale,
                potionDimensions.YScale,
                potionDimensions.divisions,
                potionDimensions.divisions
              );
            });
          
            // Divisions
            geometryTweaks.addBinding(potionDimensions, 'divisions', 
            {
              label: 'Divisions',
              min: 4,
              max: 1028,
              step: 8,
            }).on('change', () => {
              potionMesh.geometry.dispose();
              potionMesh.geometry = new THREE.PlaneGeometry(
                potionDimensions.XScale,
                potionDimensions.YScale,
                potionDimensions.divisions,
                potionDimensions.divisions
              );
            });
        }
    }

    createMaterial()
    {
        let  depthColor;
        let  surfaceColor;

        // Potion Colour
        if(!this.debug.active)
        {
            depthColor = '#367981'
            surfaceColor = '#6d90a2'
        } 
        else 
        {
            depthColor = this.debugObject.depthColor = '#367981'
            surfaceColor = this.debugObject.surfaceColor = '#6d90a2'
        }
        
        // this.debugObject.depthColor = '#367981';
        // this.debugObject.surfaceColor = '#6d90a2';

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
        
                uDepthColor: { value: new THREE.Color(depthColor) },
                uSurfaceColor: { value: new THREE.Color(surfaceColor) },
                uColorOffset: { value: 0 },
                uColorMultiplier: { value: 7 }
            }
        });

        if(this.debug.active)
        {
            const materialTweaks = this.debugFolder.addFolder({
                title: 'Material Tweaks',
              });
              
              // Big Waves Elevation
              materialTweaks.addBinding(this.material.uniforms.uBigWavesElevation, 'value', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'uBigWavesElevation',
              });
              
              // Big Waves Frequency X
              materialTweaks.addBinding(this.material.uniforms.uBigWavesFrequency.value, 'x', {
                min: 0,
                max: 10,
                step: 0.001,
                label: 'uBigWavesFrequencyX',
              });
              
              // Big Waves Frequency Y
              materialTweaks.addBinding(this.material.uniforms.uBigWavesFrequency.value, 'y', {
                min: 0,
                max: 10,
                step: 0.001,
                label: 'uBigWavesFrequencyY',
              });
              
              // Big Waves Speed
              materialTweaks.addBinding(this.material.uniforms.uBigWavesSpeed, 'value', {
                min: 0,
                max: 4,
                step: 0.001,
                label: 'uBigWavesSpeed',
              });
              
              // Small Waves Elevation
              materialTweaks.addBinding(this.material.uniforms.uSmallWavesElevation, 'value', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'uSmallWavesElevation',
              });
              
              // Small Waves Frequency
              materialTweaks.addBinding(this.material.uniforms.uSmallWavesFrequency, 'value', {
                min: 0,
                max: 30,
                step: 0.001,
                label: 'uSmallWavesFrequency',
              });
              
              // Small Waves Speed
              materialTweaks.addBinding(this.material.uniforms.uSmallWavesSpeed, 'value', {
                min: 0,
                max: 4,
                step: 0.001,
                label: 'uSmallWavesSpeed',
              });
              
              // Small Waves Iterations
              materialTweaks.addBinding(this.material.uniforms.uSmallIterations, 'value', {
                min: 0,
                max: 5,
                step: 1,
                label: 'uSmallIterations',
              });
              
              // Color Offset
              materialTweaks.addBinding(this.material.uniforms.uColorOffset, 'value', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'uColorOffset',
              });
              
              // Color Multiplier
              materialTweaks.addBinding(this.material.uniforms.uColorMultiplier, 'value', {
                min: 0,
                max: 10,
                step: 0.001,
                label: 'uColorMultiplier',
              });
        }
    }

    createInteraction()
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

    createMesh()
    {
        
        let potionMesh = new THREE.Mesh( this.geometry, this.material);
        
        // potionMesh.rotation.x = - Math.PI * 0.5;
        
        potionMesh.position.x = 0;
        potionMesh.position.y = 0.45;
        potionMesh.position.z = 0;
        this.scene.add(potionMesh);

        if(this.debug.active)
        {
            const positionTweaks = this.debugFolder.addFolder({
                title: 'Potion Position',
              });
              
              // X Position
              positionTweaks.addBinding(potionMesh.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
              });
              
              // Y Position
              positionTweaks.addBinding(potionMesh.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
              });
              
              // Z Position
              positionTweaks.addBinding(potionMesh.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
              });
        }
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}