import * as THREE from 'three';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

export default class curveAnim
{
    constructor()
    {
        this.debug = this.experience.debug;
        gsap.registerPlugin(CustomEase)

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'curve',
                expanded: true
            });
            this.debugObject = {};
        }

        this.animationParameters.delay = 0.5;
        this.animationParameters.duration = 1.5;
        this.animationParameters.repeat = -1;
    }

    createSpline(position)
    {
        this.spline = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3().copy(position),
            new THREE.Vector3( 0, 5, 0 ),
            new THREE.Vector3( 0, 0, 0 )
        );
    }

    animate()
    {
        gsap.to(this, {
            t: 1,
            delay: 0.5,
            duration: 1.5,
            repeat: -1,
            ease: CustomEase.create("custom", "M0,0 C0.439,0.118 0.355,0.443 0.642,0.512 0.846,0.56 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.479,0.111 0.502,0.417 0.674,0.512 0.901,0.636 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.523,0.164 0.58,0.472 0.688,0.542 0.89,0.671 0.939,0.74 1,1 "),
            onUpdate: () => {
                const point = this.spline.getPoint(this.t); // Use the updated value of t to get a new point
                this.box.position.copy(point); // Update the box's position to this point
            }
        });

        // Debug
        if(this.debug.active)
        {
            this.debugFolder.addBinding(this.params, 'delay', { min: 0, max: 2, step: 0.1, label: 'Delay' });
            this.debugFolder.addBinding(this.params, 'duration', { min: 0, max: 3, step: 0.1, label: 'Duration' });
            this.debugFolder.addBinding(this.params, 'repeat', { min: -1, max: 1, step: 1, label: 'Repeat' });
        }
    }
}