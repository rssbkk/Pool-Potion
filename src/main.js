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
potionTweaks.close();

const potionColourTweaks = potionTweaks.addFolder( 'Potion Colour' );
// potionColourTweaks.close();

const potionPositioning = potionTweaks.addFolder( 'Potion Positioning' );

// Camera Tweaks
const cameraTweaks = gui.addFolder('CameraTweaks')
cameraTweaks.close();

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

// Lights
const hemisphereLight = new THREE.HemisphereLight( 0xff0000, 0x00ff00, 0.5 );
scene.add(hemisphereLight);

/**
 * Potion Object
 */
// Potion Colour
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';

potionColourTweaks.addColor(debugObject, 'depthColor').onChange(() => { potionMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) });
potionColourTweaks.addColor(debugObject, 'surfaceColor').onChange(() => { potionMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) });

// Potion Mesh
let potionXScale = 2;
let potionYScale = 2;

potionPositioning.add('xScale').min(0).max(5).step(1).name('Potion X');
potionPositioning.add('yScale').min(0).max(5).step(1).name('Potion Y');

const potionGeometry = new THREE.PlaneGeometry( potionXScale, potionYScale, 512, 512 );
const potionMaterial = new THREE.ShaderMaterial({
    vertexShader: potionVertexShader,
    fragmentShader: potionFragmentShader,
    side: THREE.DoubleSide,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 }
    }
});

const potionMesh = new THREE.Mesh(potionGeometry, potionMaterial);
potionMesh.rotation.x = - Math.PI * 0.5;
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

/**
 * Background Objects
 */
gltfLoader.load('/scene-draft-three.glb', (gltf) => 
{
    console.log(gltf.scene.children);
    const materialChange = gltf.scene.children;
    materialChange.forEach( (mesh) =>
    {
        mesh.material = new THREE.MeshBasicMaterial();
    });
    gltf.scene.children[0].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[1].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[2].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[3].material.color = new THREE.Color( 0x0000ff );
    gltf.scene.children[4].material.color = new THREE.Color( 0x00ff00 );
    gltf.scene.children[5].material.color = new THREE.Color( 0xf000f0 );
    gltf.scene.children[6].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[7].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[8].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[9].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[10].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[11].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[12].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[13].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[14].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[15].material.color = new THREE.Color( 0x00ff00 );
    gltf.scene.children[16].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[17].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[18].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[19].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[20].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[21].material.color = new THREE.Color( 0xf00000 );
    gltf.scene.children[22].material.color = new THREE.Color( 0xf00000 );

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set( 5, 5, 5 );
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