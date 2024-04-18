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
        gsap.registerPlugin(CustomEase)

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'curve',
                expanded: true
            });
            this.debugObject = {};
        }

        this.instanceCount = 200;
        this.leafPositions = [];
        this.mesh = null;

        this.createBox();
        this.createSpline();
        this.animate();
    }

    createSpline()
    {
        this.curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3().copy(this.box.position),
            new THREE.Vector3( 0, 5, 0 ),
            new THREE.Vector3( 0, 0, 0 )
        );

        const points = this.curve.getPoints( 5 );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const material = new THREE.MeshBasicMaterial();

        this.line = new THREE.Line( geometry, material );
        this.scene.add(this.line);
    }

    createBox()
    {
        const geometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.box = new THREE.Mesh( geometry, material );
        this.box.position.set( -5, 0, 0 );
        this.scene.add(this.box);

        console.log(this.box.position);
    }

    animate()
    {
        gsap.to(this, {
            t: 1,
            delay: 0.5,
            duration: 1.5,
            repeat: -1, // Repeat the animation infinitely
            ease: CustomEase.create("custom", "M0,0 C0.439,0.118 0.355,0.443 0.642,0.512 0.846,0.56 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.479,0.111 0.502,0.417 0.674,0.512 0.901,0.636 0.939,0.74 1,1 "),ease: CustomEase.create("custom", "M0,0 C0.523,0.164 0.58,0.472 0.688,0.542 0.89,0.671 0.939,0.74 1,1 "),
            onUpdate: () => {
                const point = this.curve.getPoint(this.t); // Use the updated value of t to get a new point
                this.box.position.copy(point); // Update the box's position to this point
            }
        });
    }
}