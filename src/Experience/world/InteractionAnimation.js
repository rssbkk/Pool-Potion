import * as THREE from 'three';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

import Experience from '../Experience.js';

import EventEmitter from "../utils/EventEmitter";

export default class InteractionAnimation extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience();
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;

        gsap.registerPlugin(CustomEase)

        this.animationParametersAndSetUp();
    }

    animationParametersAndSetUp()
    {
        this.animationParameters = 
        {
            delay: 0.5,
            duration: 1.5,
            repeat: 0
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Interaction Animation',
                expanded: false
            });

            this.debugFolder.addBinding(this.animationParameters, 'delay', { min: 0, max: 2, step: 0.1, label: 'Delay' });
            this.debugFolder.addBinding(this.animationParameters, 'duration', { min: 0, max: 3, step: 0.1, label: 'Duration' });
            this.debugFolder.addBinding(this.animationParameters, 'repeat', { min: -1, max: 1, step: 1, label: 'Repeat' });
        }
    }

    animate(model)
    {
        const params = {
            t: 0
        }

        // Create Animation Curve
        this.spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3().copy(model),
            new THREE.Vector3(model.x * 0.95, model.y + 1.5, model.z * 0.95),
            new THREE.Vector3(model.x * 0.5, model.y + 0.75, model.z * 0.5),
            new THREE.Vector3(0, 3, 0),
            new THREE.Vector3(0, 0, 0)
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const points = this.spline.getPoints(5);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);


        gsap.to(params, {
            t: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: CustomEase.create("custom", "M0,0 C0.523,0.164 0.58,0.472 0.688,0.542 0.89,0.671 0.939,0.74 1,1 "),
            onUpdate: () => {
                const point = this.spline.getPoint(params.t);
                model.copy(point);
            },
            onComplete: () => {
                this.trigger('blob');
            }
        });
    }
}

// FROM PREVIOUS CODE

/**
//  * POTION ANIMATION ON INTERACTION  
//  */
// // Animation configuration
// let animationCount = 0;

// const animationConfig = {
//     uBigWavesElevation: { min: 0.25, max: 1 },
//     uBigWavesSpeed: { min: 0.25, max: 2.5 },
//     uSmallWavesElevation: { min: 0.15, max: 1 },
//     uSmallWavesFrequency: { min: 2, max: 15 },
//     uSmallWavesSpeed: { min: 0, max: 2 },
//     // Special case without min/max
//     uSmallIterations: { isIterations: true }
// };

// // Generalized animate function
// const animateProperty = (propertyKey) => {
//     animationCount += 1;

//     let config = animationConfig[propertyKey];
//     let previous = potionMaterial.uniforms[propertyKey].value;
//     let tinyRandom = (Math.random() - 0.5) / 5;
//     let newValue;

//     // console.log('config = ' + config);

//     if (config.isIterations) {
//         newValue = Math.round(Math.random() * 4);
//     } else {
//         newValue = Math.max(config.min, Math.min(config.max, (previous + tinyRandom)));
//         if(newValue === previous) {
//             newValue = (config.max - config.min) / 2;
//         }
//     }

//     // console.log("config min = " + config.min);
//     // console.log("config max = " + config.max);
//     // console.log("tr = " + tinyRandom);
//     // console.log("prv = " + previous);
//     // console.log("nv = " + newValue);

//     gsap.to(potionMaterial.uniforms[propertyKey], {
//         value: newValue,
//         duration: 1,
//         ease: "power2.inOut"
//     });

//     console.log(`${propertyKey} ${potionMaterial.uniforms[propertyKey].value}`);

//     //Color Animation
//     gsap.to(potionMaterial.uniforms.uDepthColor.value, {
//         r: Math.random(),
//         g: Math.random(),
//         b: Math.random(),
//         duration: 2,
//         ease: "power1.inOut",
//         onUpdate: function () {
//             potionMaterial.uniforms.uDepthColor.value.needsUpdate = true;
//         }
//     });
//     gsap.to(potionMaterial.uniforms.uSurfaceColor.value, {
//         r: Math.random(),
//         g: Math.random(),
//         b: Math.random(),
//         duration: 2,
//         ease: "power1.inOut",
//         onUpdate: function () {
//             potionMaterial.uniforms.uSurfaceColor.value.needsUpdate = true;
//         }
//     });
// };
// /**
//  * Interaction Actions
//  */
// window.addEventListener('click', () => {
//     if (currentIntersect) {
//         // let modelX = currentIntersect.object.position.x
//         // let modelZ = currentIntersect.object.position.z

//         // let distanceToWellCenter = Math.hypot(modelX, modelZ);

//         // // console.log(distanceToWellCenter);
//         // // console.log(modelX);
//         // // console.log(modelZ);
        
//         // throwAnimation(currentIntersect, distanceToWellCenter);

//         console.log(currentIntersect.object.name);

//         if(currentIntersect.object.name === 'red') {
//             animateProperty('uBigWavesElevation');
//         } else if(currentIntersect.object.name === 'blue') {
//             animateProperty('uBigWavesSpeed');
//         } else if(currentIntersect.object.name === 'green') {
//             animateProperty('uSmallWavesElevation');
//         } else if(currentIntersect.object.name === 'magenta') {
//             animateProperty('uSmallWavesSpeed');
//         } else if(currentIntersect.object.name === 'cyan') {
//             animateProperty('uSmallWavesFrequency');
//         } else if(currentIntersect.object.name === 'yellow') {
//             animateProperty('uSmallIterations');
//         }
//     }
// });