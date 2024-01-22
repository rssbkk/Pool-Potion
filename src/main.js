import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import potionVertexShader from './shaders/potionShader/potionVertex.glsl';
import potionFragmentShader from './shaders/potionShader/potionFragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {};

// Potion Tweaks
const potionTweaks = gui.addFolder( 'Potion Tweaks' );
// potionTweaks.close();

const potionColourTweaks = potionTweaks.addFolder( 'Potion Colour' );
// potionColourTweaks.close();

const potionPositioning = potionTweaks.addFolder( 'Potion Positioning' );

//  Ground Tweaks
const groundTweaks = gui.addFolder( 'Ground Tweaks' );


// Camera Tweaks
const cameraTweaks = gui.addFolder('CameraTweaks')
// cameraTweaks.close();

debugObject.locateCamera = () => 
{
    console.log(camera.position);
}

cameraTweaks.add( debugObject, 'locateCamera' );

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Loaders
const gltfLoader = new GLTFLoader();

/**
 * Ground
 */
// Ground Mesh
const groundDimensions = {
    planeSize: 100
}

const groundGeometry = new THREE.PlaneGeometry( 100, 100 );
const groundMaterial = new THREE.MeshStandardMaterial();
const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
groundMesh.rotation.x = - Math.PI / 2;
groundMesh.position.y = - 0.51;
// scene.add( groundMesh );

// Ground tweaks
groundTweaks.add( groundDimensions, 'planeSize')
    .min(10)
    .max(10000)
    .step(10)
    .name('Ground Size')
    .onChange(() =>
    {
        groundMesh.geometry.dispose()
        groundMesh.geometry = new THREE.PlaneGeometry( 
            groundDimensions.planeSize, 
            groundDimensions.planeSize
        )
    });

groundTweaks.add(groundMesh.position, 'y')
    .min(-10)
    .max(10)
    .step(0.01)
    .name('Y Position');

/**
 * Potion Object
 */
// Potion Colour
debugObject.depthColor = '#367981';
debugObject.surfaceColor = '#6d90a2';

potionColourTweaks.addColor(debugObject, 'depthColor')
    .onChange(() => { potionMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) });
potionColourTweaks.addColor(debugObject, 'surfaceColor')
    .onChange(() => { potionMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) });

// Potion Dimension Tweaks
const potionDimensions = {
    XScale : 1.565,
    YScale : 1.565,
    divisions: 64
}

potionPositioning.add(potionDimensions, 'XScale')
    .min(0)
    .max(10)
    .step(.005)
    .name('X Size')
    .onFinishChange(() =>
    {
        potionMesh.geometry.dispose()
        potionMesh.geometry = new THREE.PlaneGeometry( 
            potionDimensions.XScale, 
            potionDimensions.YScale, 
            potionDimensions.divisions, 
            potionDimensions.divisions
        )
    });

potionPositioning.add(potionDimensions, 'YScale')
    .min(0)
    .max(10)
    .step(.005)
    .name('Y Size')
    .onFinishChange(() =>
    {
        potionMesh.geometry.dispose()
        potionMesh.geometry = new THREE.PlaneGeometry( 
            potionDimensions.XScale, 
            potionDimensions.YScale, 
            potionDimensions.divisions, 
            potionDimensions.divisions
        )
    });

potionPositioning.add(potionDimensions, 'divisions')
    .min(64)
    .max(1028)
    .step(8)
    .name('Divisions')
    .onFinishChange(() =>
    {
        potionMesh.geometry.dispose()
        potionMesh.geometry = new THREE.PlaneGeometry( 
            potionDimensions.XScale, 
            potionDimensions.YScale, 
            potionDimensions.divisions, 
            potionDimensions.divisions
        )
    });

// Potion Mesh
const potionGeometry = new THREE.PlaneGeometry( 
    potionDimensions.XScale, 
    potionDimensions.YScale, 
    potionDimensions.divisions, 
    potionDimensions.divisions
);
const potionMaterial = new THREE.ShaderMaterial({
    vertexShader: potionVertexShader,
    fragmentShader: potionFragmentShader,
    side: THREE.DoubleSide,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.055 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.2 },

        uSmallWavesElevation: { value: 0.055 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.45 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0 },
        uColorMultiplier: { value: 7 }
    }
});

let potionMesh = new THREE.Mesh(potionGeometry, potionMaterial);

potionMesh.rotation.x = - Math.PI * 0.5;

potionMesh.position.x = 0;
potionMesh.position.y = 0.45;
potionMesh.position.z = 0;
scene.add(potionMesh);

// Potion Tweaks
potionTweaks.add(potionMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
potionTweaks.add(potionMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
potionTweaks.add(potionMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
potionTweaks.add(potionMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')


potionTweaks.add(potionMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
potionTweaks.add(potionMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
potionTweaks.add(potionMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
potionTweaks.add(potionMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

potionTweaks.add(potionMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
potionTweaks.add(potionMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

//  Potion Positioning Tweaks
potionPositioning.add(potionMesh.position, 'x').min(-10).max(10).step(0.5).name('X Position');
potionPositioning.add(potionMesh.position, 'y').min(-10).max(10).step(0.01).name('Y Position');
potionPositioning.add(potionMesh.position, 'z').min(-10).max(10).step(0.5).name('Z Position');

/**
 * Scene Object
 */
gltfLoader.load('/blockOutScene-draft-one.glb', (gltf) => 
{
    console.log(gltf.scene.children);
    const materialChange = gltf.scene.children;
    materialChange.forEach( (mesh) =>
    {
        mesh.material = new THREE.MeshBasicMaterial();
        mesh.material.side = 2;
    });

    gltf.scene.children[0].material.color = new THREE.Color( 0xffffff );
    gltf.scene.children[1].material.color = new THREE.Color( 0xff000 );
    gltf.scene.children[2].material.color = new THREE.Color( 0xfff );
    gltf.scene.children[3].material.color = new THREE.Color( 0xfff );
    gltf.scene.children[4].material.color = new THREE.Color( 0xfff );
    gltf.scene.children[5].material.color = new THREE.Color( 0xfff );
    gltf.scene.children[6].material.color = new THREE.Color( 0xfff );
    gltf.scene.children[7].material.color = new THREE.Color( 0xfff );

    scene.add(gltf.scene);
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Lights
 */
const hemisphereLight = new THREE.HemisphereLight( 0xf0f0ff, 0xffffff, 0.0 );
// scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight( 0xfff, 0 );
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set( 2, 2, 2 );
// scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
// scene.add(directionalLightHelper)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set( 2.5, 3, -2.5 );
camera.lookAt( potionMesh );
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Potion
    potionMaterial.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()