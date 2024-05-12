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

        this.setSunLight();
        this.setAmbient();
        this.setEnvironmentMap();
        this.setupDebug();
    }

    setAmbient()
    {
        this.ambientightVariables = { 
            color: '#b88f8f'
        };

        this.ambientLight = new THREE.AmbientLight( this.ambientightVariables.color, 1 );
        this.scene.add( this.ambientLight );
    }

    setSunLight()
    {
        this.sunLightVariables = { 
            color: '#ffe1aa',
            shadowMapSize: 24
        };

        this.sunLight = new THREE.DirectionalLight( this.sunLightVariables.color, 3.5);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(this.sunLightVariables.shadowMapSize, this.sunLightVariables.shadowMapSize);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, - 1.25);
        this.scene.add(this.sunLight);
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
    }
    
    setupDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Environment',
                expanded: false
            });
            
            // Ambient light Debug
            const ambientDebug = this.debugFolder.addFolder({ title: 'Ambient Debug' });

            ambientDebug.addBinding(this.ambientightVariables, 'color')
            .on('change', () => 
            {
                this.ambientLight.color.set(this.ambientightVariables.color)
            })

            ambientDebug.addBinding(this.ambientLight, 'intensity', 
            {
                label: 'Ambient Intensity',
                min: 0.1,
                max: 10,
                step: 0.1,
            });

            // Sun Light Debug
            const sunDebug = this.debugFolder.addFolder({ title: 'Sun Debug' });
        
            sunDebug.addBinding(this.sunLightVariables, 'color')
            .on('change', () => 
            {
                this.sunLight.color.set(this.sunLightVariables.color)
            })

            sunDebug.addBinding(this.sunLightVariables, 'shadowMapSize',
            {
                label: 'Sun Shadow Map',
                min: 6,
                max: 1024,
                step: 6
            })
            .on('change', (value) =>
            {
                this.sunLight.shadow.mapSize.set(value, value)
            })
        
            sunDebug.addBinding(this.sunLight, 'intensity', 
            {
                label: 'sunLightIntensity',
                min: 0,
                max: 10,
                step: 0.001,
            });
            
            sunDebug.addBinding(this.sunLight.position, 'x', 
            {
                label: 'sunLightX',
                min: -5,
                max: 5,
                step: 0.001,
            });
            
            sunDebug.addBinding(this.sunLight.position, 'y', 
            {
                label: 'sunLightY',
                min: -5,
                max: 5,
                step: 0.001,
            });
            
            sunDebug.addBinding(this.sunLight.position, 'z', 
            {
                label: 'sunLightZ',
                min: -5,
                max: 5,
                step: 0.001,
            });
        
            // Environment map debug
            const envDebug = this.debugFolder.addFolder({ title: 'EnvMap Debug' });

            envDebug.addBinding(this.environmentMap, 'intensity', 
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