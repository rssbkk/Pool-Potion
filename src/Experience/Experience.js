import * as THREE from 'three';

import Sizes from "./utils/Sizes.js";
import Time from "./utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Raycaster from './Raycaster.js';
import World from './world/World.js';
import Resources from './utils/Resources.js';
import Debug from './utils/Debug.js';
import sources from './sources.js';
import ToonMaterial from './world/ToonMaterial.js';
import LeafMaterial from './world/LeafMaterial.js';
import InteractionAnimation from './world/InteractionAnimation.js';

let instance = null;

export default class Experience
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance;
        }
        
        instance = this;

        // Global Access
        window.experience = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.interactionAnimation = new InteractionAnimation();
        this.toonMaterial = new ToonMaterial().toonMaterial;
        this.leafMaterial = new LeafMaterial();
        this.camera = new Camera();
        this.raycaster = new Raycaster();
        this.renderer = new Renderer();
        this.world = new World();

        // Sizes Resize Event
        this.sizes.on('resize', ()=>
        {
            this.resize();
        })

        // Time Tick Event
        this.time.on('tick', ()=>
        {
            this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
    }

    update() // Order May Matter
    {
        this.camera.update();
        this.world.update();
        this.renderer.update();
        this.raycaster.update();
    }
}