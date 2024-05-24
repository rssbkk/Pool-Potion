import * as THREE from 'three';
import Experience from '../Experience.js';

import gsap from 'gsap';

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

		this.animationCount = 0;
		this.animationStep = null;

    	this.animationConfig = {
			uBigWavesElevation: { min: 0.25, max: 1 },
			uBigWavesSpeed: { min: 0.25, max: 2.5 },
			uSmallWavesElevation: { min: 0.15, max: 1 },
			uSmallWavesFrequency: { min: 2, max: 15 },
			uSmallWavesSpeed: { min: 0, max: 2 },
			uSmallIterations: { isIterations: true }
		};

        this.createMaterial()
        this.createMesh()
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
                uTime: new THREE.Uniform(0),
                
                uBigWavesElevation: new THREE.Uniform(0.055),
                uBigWavesFrequency: new THREE.Uniform(new THREE.Vector2(4, 1.5)),
                uBigWavesSpeed: new THREE.Uniform(0.2),
        
                uSmallWavesElevation: new THREE.Uniform(0.055),
                uSmallWavesFrequency: new THREE.Uniform(3),
                uSmallWavesSpeed: new THREE.Uniform(0.45),
                uSmallIterations: new THREE.Uniform(4),
        
                uDepthColor: new THREE.Uniform(new THREE.Color(depthColor)),
                uSurfaceColor: new THREE.Uniform(new THREE.Color(surfaceColor)),
                uColorOffset: new THREE.Uniform(0),
                uColorMultiplier: new THREE.Uniform(7)
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

    animateProperty(propertyKey)
    {
		this.animationCount += 1;

    if(this.animationCount < 5) 
    {
    	this.animationStep = 0.1;
    } else if (this.animationCount < 10)
    {
		this.animationStep = 0.2;
    } else {
		this.animationStep = 0.3;
	}

		let config = this.animationConfig[propertyKey];
		let previous = this.material.uniforms[propertyKey].value;
    	let range = config.max - config.min;
		let minChange = range * this.animationStep;
		let newValue;

		// console.log('config = ' + config);

		if (config.isIterations) {
			newValue = Math.round(Math.random() * 4);
			this.material.uniforms.uSmallIterations.value = newValue;
		} else {
			let randomChange = (Math.random() - 0.5) * range;
			randomChange = Math.sign(randomChange) * Math.max(Math.abs(randomChange), minChange);

			//console.log('random change: ' + randomChange);
			newValue = Math.max(config.min, Math.min(config.max, previous + randomChange));

			if(newValue === previous) {
				newValue = previous + Math.sign(randomChange) * minChange;
			}
		}

		// console.log("config min = " + config.min);
		// console.log("config max = " + config.max);
		// console.log("tr = " + tinyRandom);
		// console.log("prv = " + previous);
		// console.log("nv = " + newValue);

		gsap.to(this.material.uniforms[propertyKey], {
			value: newValue,
			duration: 1,
			ease: "power2.inOut"
		});

		console.log(`${propertyKey}: ${newValue} was ${this.material.uniforms[propertyKey].value}`);

		// Cant See under waves
		if(propertyKey === 'uBigWavesElevation') {
			function mix( x, y, a) {
				return x * (1 - a) + y * a;
			}

			const result = mix(0.5, -0.25, newValue)

			gsap.to(this.potionMesh.position, {
				y: result,
				duration: 1,
				ease: "power2.inOut"
			});
		}

		//Color Animation
		gsap.to(this.material.uniforms.uDepthColor.value, {
			r: Math.random(),
			g: Math.random(),
			b: Math.random(),
			duration: 2,
			ease: "power1.inOut",
			onUpdate: function () {
				this.material.uniforms.uDepthColor.value.needsUpdate = true;
			}.bind(this)  
		});
		gsap.to(this.material.uniforms.uSurfaceColor.value, {
			r: Math.random(),
			g: Math.random(),
			b: Math.random(),
			duration: 2,
			ease: "power1.inOut",
			onUpdate: function () {
				this.material.uniforms.uSurfaceColor.value.needsUpdate = true;
			}.bind(this) 
		});
    }

    createInteraction(color)
    {
      	// console.log('potion recieving: ' + color);

		const animationMap = {
			red: 'uBigWavesElevation',
			blue: 'uBigWavesSpeed',
			green: 'uSmallWavesElevation',
			magenta: 'uSmallWavesSpeed',
			cyan: 'uSmallWavesFrequency',
			yellow: 'uSmallIterations'
		};
		
		// Check if the color is in the map and call animateProperty
		if (animationMap[color]) {
			this.animateProperty(animationMap[color]);
		}
    }

    createMesh()
    {
        const geometry = this.resources.items.potionGeometry.scene.children[0].geometry
        this.potionMesh = new THREE.Mesh( geometry, this.material);
        
        this.potionMesh.position.x = 0;
        this.potionMesh.position.y = 0.45;
        this.potionMesh.position.z = 0;
        this.scene.add(this.potionMesh);

        if(this.debug.active)
        {
          const positionTweaks = this.debugFolder.addFolder({
              title: 'Potion Position',
            });
            
            // X Position
            positionTweaks.addBinding(this.potionMesh.position, 'x', {
              min: -10,
              max: 10,
              step: 0.5,
              label: 'X Position',
            });
            
            // Y Position
            positionTweaks.addBinding(this.potionMesh.position, 'y', {
              min: -10,
              max: 10,
              step: 0.01,
              label: 'Y Position',
            });
            
            // Z Position
            positionTweaks.addBinding(this.potionMesh.position, 'z', {
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