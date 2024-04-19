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

        gsap.registerPlugin(CustomEase)

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Interaction Animation',
                expanded: true
            });
        }

        this.animationParameters = 
        {
            delay: 0.5,
            duration: 1.5,
            repeat: -1
        }
    }

    animate(model, position)
    {
        // Create Animation Curve
        this.spline = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3().copy(position),
            new THREE.Vector3( 0, 5, 0 ),
            new THREE.Vector3( 0, 0, 0 )
        );

        // Create Animmation
        gsap.to(model, {
            t: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: CustomEase.create("custom", "M0,0 C0.439,0.118 0.355,0.443 0.642,0.512 0.846,0.56 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.479,0.111 0.502,0.417 0.674,0.512 0.901,0.636 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.523,0.164 0.58,0.472 0.688,0.542 0.89,0.671 0.939,0.74 1,1 "),
            onUpdate: () => {
                const point = this.spline.getPoint(this.t);
                model.position.copy(point);
            }
        });

        // Debug
        if(this.debug.active)
        {
            this.debugFolder.addBinding(this.animationParameters, 'delay', { min: 0, max: 2, step: 0.1, label: 'Delay' });
            this.debugFolder.addBinding(this.animationParameters, 'duration', { min: 0, max: 3, step: 0.1, label: 'Duration' });
            this.debugFolder.addBinding(this.animationParameters, 'repeat', { min: -1, max: 1, step: 1, label: 'Repeat' });
            this.debugFolder.addBinding({ label: 'Start Animation' }).on('click', () => this.startAnimation());
        }
    }
}