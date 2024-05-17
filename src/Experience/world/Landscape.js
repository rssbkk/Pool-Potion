import * as THREE from 'three';

import Experience from '../Experience.js';
import Leaf from './worldUtils/LeafMaterial.js';
import { log } from 'three/examples/jsm/nodes/Nodes.js';

export default class Landscape
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.toonMaterial = this.experience.toonMaterial;
        this.leafMaterial = new Leaf().leafMaterial;

        this.sceneObject = {};

        this.sceneObjectColumns = [];
        this.sceneObjectRocks = [];
        this.sceneObjectTrunks = [];

        this.createLandscape();
        this.seperateParts();
        this.setupDebug();
    }
    
    createLandscape()
    {
        this.model = this.experience.resources.items.landscape.scene;
        this.model.layers.set(1);

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = this.toonMaterial;
            }
        })
        this.scene.add(this.model);
    }

    seperateParts()
    {
        // Seperate Leaves
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('canopy'))
            {
                child.material = this.leafMaterial;
                child.frustumCulled = false;
            }
        });

        // Seperate Trunks
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('trunk'))
            {
                this.sceneObjectTrunks.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0x515138);
            }
        });
        
        // Seperate Rocks
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('rock'))
            {
                this.sceneObjectRocks.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xa66fa6);
            }
        });
        
        // Seperate Columns
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('plane'))
            {
                this.sceneObjectColumns.push(child);
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xbcb8aa);
            }
        });
        
        // Seperate Well
        this.scene.traverse((child) =>
        {
            if (child.name.toLocaleLowerCase().includes('well'))
            {
                this.sceneObject.well = child;
                child.material = this.toonMaterial.clone();
                child.material.color = new THREE.Color(0xa5a192);
            }
        });

        console.log(this.sceneObjectRocks);
    }

    setupDebug()
    {
        if(this.debug.active)
        {
            this.LandscapeTweaks = this.debug.pane.addFolder({
                title: 'Landscape',
                expanded: true
            });

            this.debugObject = {
                wellColor: `#${this.sceneObject.well.material.color.getHexString()}`,
                columnColor: `#${this.sceneObjectColumns[0].material.color.getHexString()}`,
                trunkColor: `#${this.sceneObjectTrunks[0].material.color.getHexString()}`,
                rockColor: `#${this.sceneObjectRocks[0].material.color.getHexString()}`
            };

            this.LandscapeTweaks.addBinding(this.debugObject, 'wellColor').on('change', () => this.sceneObject.well.material.color.set(this.debugObject.wellColor)),
            this.LandscapeTweaks.addBinding(this.debugObject, 'columnColor').on('change', () => this.sceneObjectColumns.forEach(column => { column.material.color.set(this.debugObject.columnColor) })),
            this.LandscapeTweaks.addBinding(this.debugObject, 'trunkColor').on('change', () => this.sceneObjectTrunks.forEach(trunk => { trunk.material.color.set(this.debugObject.trunkColor) })),
            this.LandscapeTweaks.addBinding(this.debugObject, 'rockColor').on('change', () => this.sceneObjectRocks.forEach(rock => { rock.material.color.set(this.debugObject.rockColor) }))
        }
    }
}