import * as THREE from 'three';

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

        this.createBox(5);
        //this.createInteraction();
    }

    createBox(count)
    {
        const geometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });

        for(let i = 0; i < count; i++ )
        {
            this.box = new THREE.Mesh( geometry, material );
            this.box.position.set( 5 * Math.random() - 2.5, 0.5, 5 * Math.random() - 2.5);
            this.box.userData.type = "interactive";
            this.scene.add(this.box);
        }
    }

    // createInteraction()
    // { 
    //     window.addEventListener('click', () => 
    //     {
    //         if(this.raycaster.currentIntersect) 
    //         {
    //             this.interactionAnimation.animate(intersects[0])
    //         }
    //     })
    //}
}

// update()
//     {

//         const intersects = this.raycaster.instance.intersectObjects(this.objectsToTest)

//         if(intersects.length) {
//             this.currentIntersect = intersects[0];
//         } else {
//             this.currentIntersect = null;
//         };
//     }