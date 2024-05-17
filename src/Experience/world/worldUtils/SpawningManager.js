import * as THREE from 'three';

import Experience from '../../Experience.js';

import EventEmitter from '../../utils/EventEmitter';

export default class SpawningManager extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience();
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.time = this.experience.time;
    }

    respawn(thing)
    {
        console.log('ready to respawn ' + thing);

        this.world.curveAnim.createBox(thing, positions[randomNumber]);
    }
}