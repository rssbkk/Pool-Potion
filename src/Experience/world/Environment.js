import * as THREE from 'three';
import Experience from "../Experience.js";

export default class Environment
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'environment',
                expanded: false
            });
            this.debugObject = {};
        }

        this.setSunLight();
        this.setEnvironmentMap();
    }

    setSunLight()
    {
        let lightColor = { color: '#ffe1aa' };
        this.sunLight = new THREE.DirectionalLight( lightColor.color, 3.5);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(24, 24);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, - 1.25);
        this.scene.add(this.sunLight);

        // Debug
        if(this.debug.active)
        {
            // Sun Light Color
            this.debugFolder.addBinding(lightColor, 'color')
            .on('change', () => 
            {
                this.sunLight.color.set(lightColor.color)
            })

            // Sun Light Intensity
            this.debugFolder.addBinding(this.sunLight, 'intensity', 
            {
                label: 'sunLightIntensity',
                min: 0,
                max: 10,
                step: 0.001,
            });
            
            // Sun Light Position X
            this.debugFolder.addBinding(this.sunLight.position, 'x', 
            {
                label: 'sunLightX',
                min: -5,
                max: 5,
                step: 0.001,
            });
            
            // Sun Light Position Y
            this.debugFolder.addBinding(this.sunLight.position, 'y', 
            {
                label: 'sunLightY',
                min: -5,
                max: 5,
                step: 0.001,
            });
            
            // Sun Light Position Z
            this.debugFolder.addBinding(this.sunLight.position, 'z', 
            {
                label: 'sunLightZ',
                min: -5,
                max: 5,
                step: 0.001,
            });
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterials();


        // Debug
        if(this.debug.active)
        {
            this.debugFolder.addBinding(this.environmentMap, 'intensity', 
            {
                min: 0,
                max: 4,
                step: 0.001,
                label: 'envMapIntensity'
            })
            .on('change', () => 
            {
                this.environmentMap.updateMaterials
            })
        }
    }
}