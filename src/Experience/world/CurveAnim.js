import * as THREE from 'three';
import gsap from 'gsap';

import Experience from '../Experience.js';

import shroomVertexShader from "./shaders/shroomShader/shroomVertexShader.glsl";
import shroomFragmentShader from "./shaders/shroomShader/shroomFragmentShader.glsl";

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

        this.animationParametersAndSetUp();
        this.createBellaBowl();
        this.createPentaFlora();
        this.createStarShroom();
        this.createFoxGlove();
        this.createToadstool();
        this.createSkinnyShroom();
        this.setupDebug();
        this.test();
    }

    test()
    {
        this.createBellaBowl(new THREE.Vector3(2.9, 0.0, 1.2));
        this.createBellaBowl(new THREE.Vector3(3.1, 0.0, 1.4));
        this.createBellaBowl(new THREE.Vector3(2.6, 0.0, 2.0));
        this.createBellaBowl(new THREE.Vector3(2.6, 0.0, 2.0));
        this.createBellaBowl(new THREE.Vector3(3.4, 0.0, 1.7));
        this.createBellaBowl(new THREE.Vector3(3.8, 0.0, 0.6));
    }

    createBellaBowl(position = { x:1.5, y:0, z:-2.6})
    {
        this.bellaBowl = new THREE.Group;
        this.bellaBowlModel = this.experience.resources.items.bellaBowl.scene;
        this.bellaBowl.add(this.bellaBowlModel);
        this.bellaBowl.position.set(position.x, position.y, position.z);
        this.bellaBowl.scale.set(0.1, 0.1, 0.1);
        this.bellaBowl.updateMatrixWorld(true);
        this.bellaBowl.name = 'bellaBowl';
        this.bellaBowl.userData.type = 'interactive';
        this.bellaBowlPart = [];

        this.bellaBowl.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('bowl'))
                {
                    this.bellaBowlPart.push(child);
                    this.bellaBowlPart.color = new THREE.Color(0xff5ac5);
                    let baseColor = new THREE.Color(0xff5ac5);

                    // Set the initial material and color for the first part
                    this.bellaBowlPart[0].material = this.toonMaterial.clone();
                    this.bellaBowlPart[0].material.color.set(baseColor);

                    // Iterate over each part after the first
                    for (let i = 1; i < this.bellaBowlPart.length; i++) {
                        let child = this.bellaBowlPart[i];

                        // Clone the material from the first part
                        child.material = this.bellaBowlPart[0].material.clone();

                        // Darken the color by reducing the lightness
                        // Assuming each subsequent part gets 10% darker than the previous
                        let factor = 0.55;  // Adjust the factor to control how much darker each part gets
                        let darkerColor = baseColor.clone().multiplyScalar(factor);

                        // Set the darker color for this part
                        child.material.color.set(darkerColor);

                        // Update baseColor to the new darker color for the next iteration
                        baseColor = darkerColor;
                    }
                }
            });

        this.scene.add(this.bellaBowl);

        gsap.to(this.bellaBowl.scale, {
            x: 0.5,
            y: 1.75,
            z: 0.5,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "bounce.in"
        });
        
        gsap.to(this.bellaBowl.scale, {
            x: 1,
            y: 1.75,
            z: 1,
            delay: this.animationParameters.delay + 1.25,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "elastic.out"
        });
    }
    
    createStarShroom(position = { x:-1.5, y:0, z:-2.6})
    {
        this.starShroom = new THREE.Group;
        this.starShroomModel = this.experience.resources.items.starShroom.scene;
        this.starShroom.add(this.starShroomModel);
        this.starShroom.position.set(position.x, position.y, position.z);
        this.starShroom.scale.set(0.1, 0.1, 0.1);
        this.starShroom.updateMatrixWorld(true);
        this.starShroom.name = 'starShroom';
        this.starShroom.userData.type = 'interactive';

        this.starShroom.traverse((child) =>
            {
                if (child.name.toLocaleLowerCase().includes('cylinder'))
                {
                    this.starShroomPart = child;
                    child.material = new THREE.ShaderMaterial({
                        vertexShader: shroomVertexShader,
                        fragmentShader: shroomFragmentShader,
                        uniforms: {
                            uTipColor: new THREE.Uniform( new THREE.Color(0xFF0000)),
                            uBaseColor: new THREE.Uniform( new THREE.Color(0x0000FF)),
                        }
                    })
                }
            });

        this.scene.add(this.starShroom);

        gsap.to(this.starShroom.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration * 1.25,
            repeat: this.animationParameters.repeat,
            ease: "steps(5)"
        });
    }
    
    createPentaFlora(position = { x:-3, y:0, z:0})
    {
        this.pentaFlora = new THREE.Group;
        this.pentaFloraModel = this.experience.resources.items.pentaFlora.scene;
        this.pentaFlora.add(this.pentaFloraModel);
        this.pentaFlora.position.set(position.x, position.y, position.z);
        this.pentaFlora.scale.set(0.1, 0.1, 0.1);
        this.pentaFlora.updateMatrixWorld(true);
        this.pentaFlora.name = 'pentaFlora';
        this.pentaFlora.userData.type = 'interactive';
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

        gsap.to(this.pentaFlora.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration / 2,
            ease: "bounce.out"
        });
        
        gsap.to(this.pentaFlora.rotation, {
            y: - Math.PI * 2,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "power2.out"
        });
    }
    
    createToadstool(position = { x:-1.5, y:0, z:2.6})
    {
        this.toadstool = new THREE.Group;
        this.toadstoolModel = this.experience.resources.items.toadstool.scene;
        this.toadstool.add(this.toadstoolModel);
        this.toadstool.position.set(position.x, position.y, position.z);
        this.toadstool.scale.set(0.1, 0.1, 0.1);
        this.toadstool.updateMatrixWorld(true);
        this.toadstool.name = 'toadstool';
        this.toadstool.userData.type = 'interactive';
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

        gsap.to(this.toadstool.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration / 2,
            ease: "bounce.in"
        });
        
        gsap.to(this.toadstool.rotation, {
            y: Math.PI * 4,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "power2.out"
        });
        
    }
    
    createSkinnyShroom(position = { x:1.5, y:0, z:2.6})
    {
        this.skinnyShroom = new THREE.Group;
        this.skinnyShroomModel = this.experience.resources.items.skinnyShroom.scene;
        this.skinnyShroom.add(this.skinnyShroomModel);
        this.skinnyShroom.position.set(position.x, position.y, position.z);
        this.skinnyShroom.scale.set(0.1, 0.1, 0.1);
        this.skinnyShroom.updateMatrixWorld(true);
        this.skinnyShroom.name = 'skinnyShroom';
        this.skinnyShroom.userData.type = 'interactive';
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

        gsap.to(this.skinnyShroom.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "elastic.out"
        });
    }
    
    createFoxGlove(position = { x:3, y:0, z:0})
    {
        this.foxGlove = new THREE.Group;
        this.foxGloveModel = this.experience.resources.items.foxGlove.scene;
        this.foxGlove.add(this.foxGloveModel);
        this.foxGlove.position.set( position.x, position.y, position.z );
        this.foxGlove.scale.set( 0.1, 0.1, 0.1 );
        this.foxGlove.updateMatrixWorld(true);
        this.foxGlove.name = 'foxGlove';
        this.foxGlove.userData.type = "interactive";
        this.foxGloveGlove = [];
        this.foxGloveLeaf = [];

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

        gsap.to(this.foxGlove.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: this.animationParameters.delay,
            duration: this.animationParameters.duration,
            repeat: this.animationParameters.repeat,
            ease: "bounce.in"
        });
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
        
        switch(name) {
            case 'bellaBowl':
                //this.createBellaBowl(randomPosition);
                break;
            case 'toadstool':
                this.createToadstool(randomPosition);
                break;
            case 'skinnyShroom':
                this.createSkinnyShroom(randomPosition);
                break;
            case 'foxGlove':
                this.createFoxGlove(randomPosition);
                break;
            case 'pentaFlora':
                this.createPentaFlora(randomPosition);
                break;
            case 'starShroom':
                this.createStarShroom(randomPosition);
                break;
        }
    
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
        
        mesh.position.set(new THREE.Vector3(randomPosition.x, randomPosition.y, randomPosition.z));
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
        if(this.debug.active)
        {
            this.debugObject = {
                bellaBowlColor: `#${this.bellaBowlPart.color.getHexString()}`,

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
                
                //starShroomColor: `#${this.starShroomPart.material.color.getHexString()}`,
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

            // starShroomTweaks.addBinding(this.debugObject, 'starShroomColor').on('change', () => this.starShroomPart.material.color.set(this.debugObject.starShroomColor));

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

    animationParametersAndSetUp()
    {
        this.animationParameters = 
        {
            delay: 0,
            duration: 1.5,
            repeat: 0
        }
        
        
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Ingredients',
                expanded: false
            });

            const spawningAnimationTweaks = this.debugFolder.addFolder({
                title: 'Spawning Animation',
                expanded: false
            });

            spawningAnimationTweaks.addBinding(this.animationParameters, 'delay', { min: 0, max: 2, step: 0.1, label: 'Delay' });
            spawningAnimationTweaks.addBinding(this.animationParameters, 'duration', { min: 0, max: 3, step: 0.1, label: 'Duration' });
            spawningAnimationTweaks.addBinding(this.animationParameters, 'repeat', { min: -1, max: 1, step: 1, label: 'Repeat' });
        }
    }
}