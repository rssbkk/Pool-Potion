import * as THREE from 'three';

import Experience from '../Experience.js';
import { log } from 'three/examples/jsm/nodes/Nodes.js';

export default class curveAnim
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.raycaster = this.experience.raycaster;
        this.toonMaterial = this.experience.toonMaterial;


        // if(this.debug.active)
        // {
        //     this.debugFolder = this.debug.pane.addFolder({
        //         title: 'curve',
        //         expanded: true
        //     });
        //     this.debugObject = {};
        // }

        this.createBoxes();
        this.createBellaBowl();
        this.createPentaFlora();
        this.createStarShroom();
        this.createFoxGlove();
        this.createToadstool();
        this.createSkinnyShroom();
        //this.setupDebug();
    }

    createBellaBowl()
    {
        this.bellaBowl = this.experience.resources.items.bellaBowl.scene;
        this.bellaBowl.scale.set(0.125, 0.125, 0.125);
        this.bellaBowl.position.set(2, 0, 2);

        this.bellaBowl.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('bowl'))
                {
                    this.bellaBowlPart = [];
                    this.bellaBowlPart.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x00ffff);
                    this.bellaBowlPart.color = new THREE.Color(0x00ffff);
                }
            });

        this.scene.add(this.bellaBowl);
    }
    
    createStarShroom()
    {
        this.starShroom = this.experience.resources.items.starShroom.scene;
        this.starShroom.scale.set(0.125, 0.125, 0.125);
        this.starShroom.position.set(2, 0, 2);

        this.starShroom.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('cylinder'))
                {
                    this.starShroomPart = child;
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x00ffff);
                }
            });

        this.scene.add(this.starShroom);
    }
    
    createPentaFlora()
    {
        this.pentaFlora = this.experience.resources.items.pentaFlora.scene;
        this.pentaFlora.scale.set(0.125, 0.125, 0.125);
        this.pentaFlora.position.set(2, 0, 0);
        this.pentaFloraPetal = [];

        this.pentaFlora.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('stalk'))
                {
                    this.pentaFloraStalk = child;
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x339033);
                }
                if (child.name.toLocaleLowerCase().includes('petal'))
                {
                    
                    this.pentaFloraPetal.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0xffba00);
                    this.pentaFloraPetal.color = new THREE.Color(0xffba00);
                    child.material.side = THREE.DoubleSide;
                }
            });

        this.scene.add(this.pentaFlora);
    }
    
    createToadstool()
    {
        this.toadstool = this.experience.resources.items.toadstool.scene;
        this.toadstool.scale.set(0.125, 0.125, 0.125);
        this.toadstool.position.set(2, 0, 2);
        this.toadstoolSphere = [];

        this.toadstool.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('head'))
                {
                    this.toadstoolHead = child;
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0xde2c2c);
                    child.material.side = THREE.BackSide;
                }
                if (child.name.toLocaleLowerCase().includes('sphere'))
                {
                    this.toadstoolSphere.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0xd1d1d1);
                    this.toadstoolSphere.color = new THREE.Color(0xd1d1d1);
                }
                if (child.name.toLocaleLowerCase().includes('stalk'))
                {
                    this.toadstoolStalk = child;
                    child.material.color = new THREE.Color(0xb1b18d);
                }
            });

        this.scene.add(this.toadstool);
    }
    
    createSkinnyShroom()
    {
        this.skinnyShroom = this.experience.resources.items.skinnyShroom.scene;
        this.skinnyShroom.scale.set(0.125, 0.125, 0.125);
        this.skinnyShroom.position.set(2, 0, 2);
        this.skinnyShroomHead = [];
        this.skinnyShroomStalk = [];

        this.skinnyShroom.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('head'))
                {
                    this.skinnyShroomHead.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0xff5010);
                    this.skinnyShroomHead.color = new THREE.Color(0xff5010);
                }
                if (child.name.toLocaleLowerCase().includes('stalk'))
                {
                    this.skinnyShroomStalk.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0xffffff);
                    this.skinnyShroomStalk.color = new THREE.Color(0xffffff);
                }
            });

        this.scene.add(this.skinnyShroom);
    }
    
    createFoxGlove(position)
    {
        this.foxGlove = new THREE.Group;
        this.foxGloveModel = this.experience.resources.items.foxGlove.scene;
        this.foxGlove.add(this.foxGloveModel);
        this.foxGlove.position.set(2, 0, 2);
        this.foxGlove.updateMatrixWorld(true);
        this.foxGlove.name = 'foxGlove';
        this.foxGlove.userData.type = "interactive";
        this.foxGloveGlove = [];
        this.foxGloveLeaf = [];

        console.log(this.foxGlove);

        this.foxGlove.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('glove'))
                {
                    this.foxGloveGlove.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x62264d);
                    this.foxGloveGlove.color = new THREE.Color(0x62264d);
                }
                if (child.name.toLocaleLowerCase().includes('stalk'))
                {
                    this.foxGloveStalk = child;
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x4c984c);
                }
                if (child.name.toLocaleLowerCase().includes('leaf'))
                {
                    this.foxGloveLeaf.push(child);
                    child.material = this.toonMaterial.clone();
                    child.material.color = new THREE.Color(0x3d6a3e);
                    this.foxGloveLeaf.color = new THREE.Color(0x3d6a3e);
                }
            });

        this.scene.add(this.foxGlove);
    }

    spawnIngredient(name)
    {
        const ingredients = [
            { positions: [ new THREE.Vector3(2.0, 0, 2.0), new THREE.Vector3(-2.0, 0, -2.0), new THREE.Vector3(2.0, 0, -2.0), new THREE.Vector3(-2.0, 0, 2.0)], name: "bellaBowl" },
            { positions: [ new THREE.Vector3(1.8, 0, 1.8), new THREE.Vector3(-1.8, 0, -1.8), new THREE.Vector3(1.8, 0, -1.8), new THREE.Vector3(-1.8, 0, 1.8)], name: "toadstool" },
            { positions: [ new THREE.Vector3(1.6, 0, 1.8), new THREE.Vector3(-1.6, 0, -1.8), new THREE.Vector3(1.6, 0, -1.8), new THREE.Vector3(-1.6, 0, 1.8)], name: "skinnyShroom" },
            { positions: [ new THREE.Vector3(2.0, 0, 1.8), new THREE.Vector3(-2.0, 0, -1.8), new THREE.Vector3(2.0, 0, -1.8), new THREE.Vector3(-2.0, 0, 1.8)], name: "foxGlove" },
            { positions: [ new THREE.Vector3(1.6, 0, 2.0), new THREE.Vector3(-1.6, 0, -2.0), new THREE.Vector3(1.6, 0, -2.0), new THREE.Vector3(-1.6, 0, 2.0)], name: "pentaFlora" },
            { positions: [ new THREE.Vector3(2.2, 0, 1.8), new THREE.Vector3(-2.2, 0, -1.8), new THREE.Vector3(2.2, 0, -1.8), new THREE.Vector3(-2.2, 0, 1.8)], name: "starShroom" }
        ];

        const objectInfo = ingredients.find( ingredient => ingredient.name === name );
        const randomNumber = Math.round(Math.random() * (objectInfo.positions.length - 1));
        const randomPosition = objectInfo.positions[randomNumber];
        
        mesh.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
        mesh.name = name;
        mesh.userData.type = "interactive";
        this.scene.add(mesh);
    }

    createBox(name)
    {
        const interactionObjectGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const colors = [
            { color: new THREE.Color(1, 0, 0), positions: [ new THREE.Vector3(2.0, 0, 2.0), new THREE.Vector3(-2.0, 0, -2.0), new THREE.Vector3(2.0, 0, -2.0), new THREE.Vector3(-2.0, 0, 2.0)], name: "red" },
            { color: new THREE.Color(0, 1, 0), positions: [ new THREE.Vector3(1.8, 0, 1.8), new THREE.Vector3(-1.8, 0, -1.8), new THREE.Vector3(1.8, 0, -1.8), new THREE.Vector3(-1.8, 0, 1.8)], name: "green" },
            { color: new THREE.Color(0, 0, 1), positions: [ new THREE.Vector3(1.6, 0, 1.8), new THREE.Vector3(-1.6, 0, -1.8), new THREE.Vector3(1.6, 0, -1.8), new THREE.Vector3(-1.6, 0, 1.8)], name: "blue" },
            { color: new THREE.Color(1, 1, 0), positions: [ new THREE.Vector3(2.0, 0, 1.8), new THREE.Vector3(-2.0, 0, -1.8), new THREE.Vector3(2.0, 0, -1.8), new THREE.Vector3(-2.0, 0, 1.8)], name: "yellow" },
            { color: new THREE.Color(0, 1, 1), positions: [ new THREE.Vector3(1.6, 0, 2.0), new THREE.Vector3(-1.6, 0, -2.0), new THREE.Vector3(1.6, 0, -2.0), new THREE.Vector3(-1.6, 0, 2.0)], name: "cyan" },
            { color: new THREE.Color(1, 0, 1), positions: [ new THREE.Vector3(2.2, 0, 1.8), new THREE.Vector3(-2.2, 0, -1.8), new THREE.Vector3(2.2, 0, -1.8), new THREE.Vector3(-2.2, 0, 1.8)], name: "magenta" }
        ];

        const objectInfo = colors.find( color => color.name === name );
        const randomNumber = Math.round(Math.random() * (objectInfo.positions.length - 1));
        const randomPosition = objectInfo.positions[randomNumber];

        const material = new THREE.MeshToonMaterial({ color: objectInfo.color });
        const mesh = new THREE.Mesh(interactionObjectGeometry, material);
        
        mesh.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
        mesh.name = name;
        mesh.userData.type = "interactive";
        this.scene.add(mesh);
    }

    createBoxes() {
        const interactionObjectGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const colors = [
            { color: new THREE.Color(1, 0, 0), position: [-0.45, 0, -1.45], name: "red" },
            { color: new THREE.Color(0, 1, 0), position: [-1.45, 0, -0.45], name: "green" },
            { color: new THREE.Color(0, 0, 1), position: [0.95, 0, -1.25], name: "blue" },
            { color: new THREE.Color(1, 1, 0), position: [1.45, 0, -0.05], name: "yellow" },
            { color: new THREE.Color(0, 1, 1), position: [0.95, 0, 1.15], name: "cyan" },
            { color: new THREE.Color(1, 0, 1), position: [-0.45, 0, 1.45], name: "magenta" }
        ];
    
        colors.forEach(({ color, position, name }) => {
            const material = new THREE.MeshToonMaterial({ color });
            const mesh = new THREE.Mesh(interactionObjectGeometry, material);
            mesh.position.set(...position);
            mesh.name = name;
            mesh.userData.type = "interactive";
            this.scene.add(mesh);
        });
    }

    setupDebug()
    {
        console.log(this.foxGloveLeaf);
    if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Ingredients',
                expanded: false
            });
            this.debugObject = {
                bellaBowlColor: `${this.bellaBowlPart.color.getHexString()}`,

                foxGloveLeafColor: `#${this.foxGloveLeaf.color.getHexString()}`,
                foxGloveStalkColor: `#${this.foxGloveStalk.material.color.getHexString()}`,
                foxGloveGloveColor: `#${this.foxGloveGlove.color.getHexString()}`,
                
                toadstoolSphereColor: `#${this.toadstoolSphere.color.getHexString()}`,
                toadstoolStalkColor: `#${this.toadstoolStalk.material.color.getHexString()}`,
                toadstoolHeadColor: `#${this.toadstoolHead.material.color.getHexString()}`,
                
                skinnyShroomHeadColor: `#${this.skinnyShroomHead.color.getHexString()}`,
                skinnyShroomStalkColor: `#${this.skinnyShroomStalk.color.getHexString()}`,
                
                pentaFloraPetalColor: `#${this.pentaFloraPetal.color.getHexString()}`,
                pentaFloraStalkColor: `#${this.pentaFloraStalk.material.color.getHexString()}`,
                
                starShroomColor: `#${this.starShroomPart.material.color.getHexString()}`,
            };

            // BellaBowl Tweaks
            const bellaBowlTweaks = this.debugFolder.addFolder({
                title: 'BellaBowl',
                expanded: false
            });
            
            bellaBowlTweaks.addBinding(this.bellaBowl.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            bellaBowlTweaks.addBinding(this.bellaBowl.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            bellaBowlTweaks.addBinding(this.bellaBowl.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            bellaBowlTweaks.addBinding(this.debugObject, 'bellaBowlColor').on('change', () => this.bellaBowlPart.forEach(bowl => { bowl.material.color.set(this.debugObject.bellaBowlColor)}));
            
            // Star Shroom Tweaks
            const starShroomTweaks = this.debugFolder.addFolder({
                title: 'starShroom',
                expanded: false
            });
            
            starShroomTweaks.addBinding(this.starShroom.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            starShroomTweaks.addBinding(this.starShroom.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            starShroomTweaks.addBinding(this.starShroom.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            starShroomTweaks.addBinding(this.debugObject, 'starShroomColor').on('change', () => this.starShroomPart.material.color.set(this.debugObject.starShroomColor));

            // Toadstool Tweaks
            const toadstoolTweaks = this.debugFolder.addFolder({
                title: 'toadstool',
                expanded: false
            });
            
            toadstoolTweaks.addBinding(this.toadstool.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            toadstoolTweaks.addBinding(this.toadstool.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            toadstoolTweaks.addBinding(this.toadstool.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            toadstoolTweaks.addBinding(this.debugObject, 'toadstoolHeadColor').on('change', () => this.toadstoolHead.material.color.set(this.debugObject.toadstoolHeadColor));
            toadstoolTweaks.addBinding(this.debugObject, 'toadstoolSphereColor').on('change', () => this.toadstoolSphere.forEach(sphere => {sphere.material.color.set(this.debugObject.toadstoolSphereColor)}));
            toadstoolTweaks.addBinding(this.debugObject, 'toadstoolStalkColor').on('change', () => this.toadstoolStalk.material.color.set(this.debugObject.toadstoolStalkColor));
            
            // SkinnyShroom Tweaks
            const skinnyShroomTweaks = this.debugFolder.addFolder({
                title: 'skinnyShroom',
                expanded: false
            });
            
            skinnyShroomTweaks.addBinding(this.skinnyShroom.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            skinnyShroomTweaks.addBinding(this.skinnyShroom.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            skinnyShroomTweaks.addBinding(this.skinnyShroom.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            skinnyShroomTweaks.addBinding(this.debugObject, 'skinnyShroomHeadColor').on('change', () => this.skinnyShroomHead.forEach(head => {head.material.color.set(this.debugObject.skinnyShroomHeadColor)}));
            skinnyShroomTweaks.addBinding(this.debugObject, 'skinnyShroomStalkColor').on('change', () => this.skinnyShroomStalk.forEach(stalk => {stalk.material.color.set(this.debugObject.skinnyShroomStalkColor)}));
            
            // Foxglove Tweaks
            const foxGloveTweaks = this.debugFolder.addFolder({
                title: 'foxGlove',
                expanded: false
            });
            
            foxGloveTweaks.addBinding(this.foxGlove.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            foxGloveTweaks.addBinding(this.foxGlove.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            foxGloveTweaks.addBinding(this.foxGlove.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            foxGloveTweaks.addBinding(this.debugObject, 'foxGloveGloveColor').on('change', () => this.foxGloveGlove.forEach(glove => {glove.material.color.set(this.debugObject.foxGloveGloveColor)}));
            foxGloveTweaks.addBinding(this.debugObject, 'foxGloveLeafColor').on('change', () => this.foxGloveLeaf.forEach(leaf => {leaf.material.color.set(this.debugObject.foxGloveLeafColor)}));
            foxGloveTweaks.addBinding(this.debugObject, 'foxGloveStalkColor').on('change', () => this.foxGloveStalk.material.color.set(this.debugObject.foxGloveStalkColor));
            
            // PentaFlora Tweaks
            const pentaFloraTweaks = this.debugFolder.addFolder({
                title: 'pentaFlora',
                expanded: false
            });
            
            pentaFloraTweaks.addBinding(this.pentaFlora.position, 'x', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'X Position',
            });

            pentaFloraTweaks.addBinding(this.pentaFlora.position, 'y', {
                min: -10,
                max: 10,
                step: 0.01,
                label: 'Y Position',
            });

            pentaFloraTweaks.addBinding(this.pentaFlora.position, 'z', {
                min: -10,
                max: 10,
                step: 0.5,
                label: 'Z Position',
            });

            pentaFloraTweaks.addBinding(this.debugObject, 'pentaFloraPetalColor').on('change', () => this.pentaFloraPetal.forEach(petal => {petal.material.color.set(this.debugObject.pentaFloraPetalColor)}));
            pentaFloraTweaks.addBinding(this.debugObject, 'pentaFloraStalkColor').on('change', () => this.pentaFloraStalk.material.color.set(this.debugObject.pentaFloraStalkColor));
        }
    }
}