import * as THREE from 'three';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

import Experience from '../Experience.js';

export default class curveAnim
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.raycaster = this.experience.raycaster;
        this.interactionAnimation = this.experience.interactionAnimation;


        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'curve',
                expanded: true
            });
            this.debugObject = {};
        }

        this.objectsTotest = [];

        this.createBox();
        this.createInteraction();
    }

    createBox()
    {
        const geometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.box = new THREE.Mesh( geometry, material );
        this.box.position.set( -5, 0, 0 );
        this.scene.add(this.box);
        this.objectsTotest.push(this.box);
    }

    animate(model)
    {
        let modelOne = model;
        const params = {
            t: 0
        }

        // Create Animation Curve
        this.spline = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3().copy(model),
            new THREE.Vector3( 0, 5, 0 ),
            new THREE.Vector3( 0, 0, 0 )
        );

        gsap.to(params, {
            t: 1,
            delay: 0.5, //this.animationParameters.delay,
            duration: 1.5, //this.animationParameters.duration,
            repeat: 0, //this.animationParameters.repeat,
            ease: CustomEase.create("custom", "M0,0 C0.523,0.164 0.58,0.472 0.688,0.542 0.89,0.671 0.939,0.74 1,1 "),
            onUpdate: () => {
                const point = this.spline.getPoint(params.t);
                model.copy(point);
                console.log(params.t);
            }
        });
    }

    createInteraction()
    {
        window.addEventListener('click', () => 
        {
            if(this.raycaster.currentIntersect) 
            {
                let model = this.raycaster.currentIntersect.object;

                // console.log(model);
                // console.log(model.position);
                console.log('anything');

                this.animate(model.position)
            }
        })
    }
}