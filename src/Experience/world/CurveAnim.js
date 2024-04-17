import * as THREE from 'three';
import gsap from 'gsap';

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

        // // Keep a dictionary of Curve instances
		// 	this.splines = {
		// 		GrannyKnot: new Curves.GrannyKnot(),
		// 		HeartCurve: new Curves.HeartCurve( 3.5 ),
		// 		VivianiCurve: new Curves.VivianiCurve( 70 ),
		// 		KnotCurve: new Curves.KnotCurve(),
		// 		HelixCurve: new Curves.HelixCurve(),
		// 		TrefoilKnot: new Curves.TrefoilKnot(),
		// 		TorusKnot: new Curves.TorusKnot( 20 ),
		// 		CinquefoilKnot: new Curves.CinquefoilKnot( 20 ),
		// 		TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot( 14 ),
		// 		FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
		// 		DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
		// 		DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
		// 		DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
		// 		DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c(),
		// 		PipeSpline: pipeSpline,
		// 		SampleClosedSpline: sampleClosedSpline
		// 	};

        this.createSpline();
        this.createBox();
        this.animate();
    }

    createSpline()
    {
        this.curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3( -5, 0, 0 ),
            new THREE.Vector3( 10, 8, 0 ),
            new THREE.Vector3( 5, 0, 0 )
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
        this.box.position.copy(this.curve.getPoint(0));
        this.scene.add(this.box);

        // // Add a slider to control t
        // this.debugFolder.addBinding(params, 't', { min: 0, max: 1, step: 0.01 }).on('change', (value) => {
        //     this.updateBoxPosition(value);
        // });
    }

    animate()
    {
        gsap.to(this, {
            t: 1,
            duration: 1.5,
            repeat: -1, // Repeat the animation infinitely
            ease: "power3.in",
            onUpdate: () => {
                const point = this.curve.getPoint(this.t); // Use the updated value of t to get a new point
                this.box.position.copy(point); // Update the box's position to this point
            }
        });
    }
}