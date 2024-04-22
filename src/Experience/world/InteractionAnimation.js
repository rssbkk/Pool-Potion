import * as THREE from 'three';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

import Experience from '../Experience.js';

export default class InteractionAnimation
{
    constructor()
    {
        this.experience = new Experience();
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;

        gsap.registerPlugin(CustomEase)

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Interaction Animation',
                expanded: true
            });
        }

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
            new THREE.Vector3().copy(model), // Assuming 'model' is a mesh and copying its position
            new THREE.Vector3(model.x * 0.95, model.y + 1.5, model.z * 0.95),
            new THREE.Vector3(model.x * 0.5, model.y + 0.75, model.z * 0.5),
            new THREE.Vector3(0, 3, 0),
            new THREE.Vector3(0, 0, 0)
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Example: Red color
        const points = this.spline.getPoints(50); // Generates 50 points along the curve
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
            }
            
        });
    }
}