import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Grass from './Grass2.js';
import Landscape from './Landscape.js';
import Potion from './Potion.js';
import Leaf from './Leaf.js';
import CurveAnim from './CurveAnim.js';

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('ready', ()=>
        {
            // Setup (Order matters here)
            this.floor = new Floor();
            this.potion = new Potion();
            this.grass = new Grass();
            this.leaf = new Leaf();
            this.landscape = new Landscape
            this.curveAnim = new CurveAnim();
            this.environment = new Environment();
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
    }
}