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


        // if(this.debug.active)
        // {
        //     this.debugFolder = this.debug.pane.addFolder({
        //         title: 'curve',
        //         expanded: true
        //     });
        //     this.debugObject = {};
        // }

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

    createInteraction()
    {
        window.addEventListener('click', () => 
        {
            if(this.raycaster.currentIntersect) 
            {
                let model = this.raycaster.currentIntersect.object;

                // console.log(model);
                // console.log(model.position);

                this.interactionAnimation.animate(model.position)
            }
        })
    }
}