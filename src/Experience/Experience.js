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
import ToonMaterial from './world/worldUtils/ToonMaterial.js';
import InteractionAnimation from './world/worldUtils/InteractionAnimation.js';

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

        // Ingredient Added Event
        const ingredients = ['bellaBowl', 'toadstool', 'skinnyShroom', 'foxGlove', 'pentaFlora', 'starShroom'];
        ingredients.forEach(ingredient => {
            this.interactionAnimation.on(`added${ingredient}`, () => 
            {
                this.added(ingredient);
            });
        });
        
        ingredients.forEach(ingredient => {
            this.interactionAnimation.on(`respawn${ingredient}`, () => 
            {
                this.respawn(ingredient);
            });
        });
    }

    added(ingredient)
    {
        this.world.potion.createInteraction(ingredient);
        console.log('here');
    }

    respawn(ingredient)
    {
        this.world.curveAnim.spawnIngredient(ingredient);
        this.raycaster.populateArray();
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