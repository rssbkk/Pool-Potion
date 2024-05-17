import * as THREE from 'three';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

import Experience from '../../Experience.js';

import EventEmitter from "../../utils/EventEmitter.js";

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

    animate(mesh, position, color)
    {
        const params = {
            t: 0
        }

        // Create Animation Curve
        this.spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3().copy(position),
            new THREE.Vector3(position.x * 0.95, position.y + 1.5, position.z * 0.95),
            new THREE.Vector3(position.x * 0.5, position.y + 0.75, position.z * 0.5),
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
                position.copy(point);
            },
            onComplete: () => {
                this.scene.remove(mesh);
                this.trigger('added' + color);
            }
        });
    }
}