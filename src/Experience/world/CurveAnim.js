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

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'curve',
                expanded: false
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

        console.log(this.curve);
    }

    createBox()
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial();
        this.box = new THREE.Mesh( geometry, material );
        this.box.position.copy(this.curve.v0);
        this.scene.add(this.box);
    }

    animate()
    {
        
    }
}