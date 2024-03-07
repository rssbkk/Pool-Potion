import * as THREE from 'three';

import Sizes from "./utils/Sizes.js";
import Time from "./utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './world/World.js';
import Resources from './utils/Resources.js';
import Debug from './utils/Debug.js';

import sources from './sources.js';

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
        this.camera = new Camera();
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
    }
}