import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Grass from './Grass2.js';
import Landscape from './Landscape.js';
import Potion from './Potion.js';
import curveAnim from './CurveAnim.js';

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.raycaster = this.experience.raycaster;

        this.resources.on('ready', ()=>
        {
            // Setup (Order matters here)
            this.floor = new Floor();
            this.potion = new Potion();
            this.grass = new Grass();
            this.landscape = new Landscape();
            this.curveAnim = new curveAnim();
            this.environment = new Environment();
            this.raycaster.populateArray();
        })
    }

    update()
    {
        if(this.potion)
        {
            this.potion.update();
        }
        if(this.grass)
        {
            this.grass.update();
        }
        if(this.leafMaterial)
        {
            this.leafMaterial.update();
        }
    }
}