import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import gsap from 'gsap';

import potionVertexShader from './shaders/potionShader/potionVertex.glsl';
import potionFragmentShader from './shaders/potionShader/potionFragment.glsl';

/**
 * Base
 */

// Stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// Debug
const gui = new GUI();
const debugObject = {};

// Fog Tweaks
const fogTweaks = gui.addFolder( 'Fog Tweaks' );
    fogTweaks.close();

// Potion Tweaks
const potionTweaks = gui.addFolder( 'Potion Tweaks' );
    potionTweaks.close();
const potionColourTweaks = potionTweaks.addFolder( 'Potion Colour' );
    potionColourTweaks.close();
const potionPositioning = potionTweaks.addFolder( 'Potion Positioning' );

//  Ground Tweaks
const groundTweaks = gui.addFolder( 'Ground Tweaks' );
    groundTweaks.close();


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
const textureLoader = new THREE.TextureLoader();

// Fog
debugObject.fogColor = "#cccccc"

scene.fog = new THREE.Fog( debugObject.fogColor, 1, 10 );

fogTweaks.addColor(debugObject, 'fogColor')
    .onChange(() => { scene.fog.color.set(debugObject.fogColor) })
;
fogTweaks.add(scene.fog, 'near')
    .min(0.1)
    .max(10)
    .step(0.05)
    .name('Fog Near')
;
fogTweaks.add(scene.fog, 'far')
    .min(0.2)
    .max(15)
    .step(0.05)
    .name('Fog Far')
;


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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Textures
 */

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
groundMesh.material.color = new THREE.Color( 0x00f00f );

scene.add( groundMesh );

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

// MeshToonMaterial
let sceneMaterial = null;

const stepSize = 0.3;
const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

for ( let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex ++ ) {

    const colors = new Uint8Array( alphaIndex + 2 );

    for ( let c = 0; c <= colors.length; c ++ ) {

        colors[ c ] = ( c / colors.length ) * 255;

    }

    const gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
    gradientMap.needsUpdate = true;

    sceneMaterial = new THREE.MeshToonMaterial( {
        gradientMap: gradientMap
    } );

    console.log(colors);

}

gltfLoader.load('/ruin-scene-draft-one.glb', (gltf) => 
{
    console.log(gltf.scene.children);
    gltf.scene.scale.set(0.25, 0.25, 0.25);

    const materialChange = gltf.scene.children;
    materialChange.forEach( (mesh) =>
    {
        mesh.material = sceneMaterial;
    });

    // gltf.scene.children[0].material.color = new THREE.Color( 0xffffff );
    // gltf.scene.children[1].material.color = new THREE.Color( 0xff000 );
    // gltf.scene.children[2].material.color = new THREE.Color( 0xfff );
    // gltf.scene.children[3].material.color = new THREE.Color( 0xfff );
    // gltf.scene.children[4].material.color = new THREE.Color( 0xfff );
    // gltf.scene.children[5].material.color = new THREE.Color( 0xfff );
    // gltf.scene.children[6].material.color = new THREE.Color( 0xfff );
    // gltf.scene.children[7].material.color = new THREE.Color( 0xfff );

    scene.add(gltf.scene);
});

/**
 * Interaction Objects
 */
const interactionObjectGeometry = new THREE.BoxGeometry( 0.5, 1, 0.5);
const interactionObjectMaterial = new THREE.MeshToonMaterial({
    color: new THREE.Color( 1, 0, 0 )
});
const interactionObjectMesh = new THREE.Mesh( interactionObjectGeometry, interactionObjectMaterial );
interactionObjectMesh.position.set(3, 0, 3)
scene.add(interactionObjectMesh);

// let model = null
// gltfLoader.load(
//     './models/Duck/glTF-Binary/Duck.glb',
//     (gltf) =>
//     {
//         model = gltf.scene
//         gltf.scene.position.y = - 1.2
//         scene.add(gltf.scene)
//     }
// )

/**
 * Interaction Actions
 */
function throwAnimation(intersect, distance) {
    gsap.to(intersect.object.position, {
        keyframes: [
            // { x: (distance * 5) / 6 , z: (distance / 6) * 5, y: 0.5, duration: 0.1 },
            { x: (distance / 6) * 4, z: (distance / 6) * 4, y: .2, duration: 0.2 },
            { x: (distance / 6) * 3, z: (distance / 6) * 3, y: .4, duration: 0.25 },
            { x: (distance / 6) * 2, z: (distance / 6) * 2, y: .6, duration: 0.3 },
            { x: 0, z: 0, y: 2, duration: 0.1 },
            { x: 0, z: 0, y: -1, duration: 0.1, delay: 0.5 },
        ],
        ease: "expo.out",
        duration: 1.5
    });
}

window.addEventListener('click', () => {
    if (currentIntersect) {
        let modelX = currentIntersect.object.position.x
        let modelZ = currentIntersect.object.position.z

        let distanceToWellCenter = Math.hypot(modelX, modelZ);

        console.log(distanceToWellCenter);
        console.log(modelX);
        console.log(modelZ);

        throwAnimation(currentIntersect, distanceToWellCenter);
    }
});

// window.addEventListener('click', () =>
// {
//     if(currentIntersect)
//     {
//         let modelX = currentIntersect.object.position.x
//         let modelZ = currentIntersect.object.position.z

//         let distanceToWellCenter = Math.hypot( modelX, modelZ );
//         let oneFrame = distanceToWellCenter / 6;

//         console.log( distanceToWellCenter );
//         console.log( modelX );
//         console.log( modelZ );

//         function throwAnimation() {
//             gsap.to(currentIntersect.object.position, {
//                 keyframes: [
//                     { x: (distanceToWellCenter / 6) * 5, z: (distanceToWellCenter / 6) * 5, y: 0.5 },
//                     { x: (distanceToWellCenter / 6) * 4, z: (distanceToWellCenter / 6) * 4, y: 1 },
//                     { x: (distanceToWellCenter / 6) * 3, z: (distanceToWellCenter / 6) * 3, y: 1.5 },
//                     { x: (distanceToWellCenter / 6) * 2, z: (distanceToWellCenter / 6) * 2, y: 2 },
//                     { x: distanceToWellCenter / 6, z: distanceToWellCenter / 6, y: 1.5 },
//                     { x: 0, z: 0, y: -1 },
//                 ],
//                 ease: "Power2.in"
//             })
//         }
//         return throwAnimation
//     }
// })

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Lights
 */
const hemisphereLight = new THREE.HemisphereLight( 0xf0f0ff, 0xffffff, 0.0 );
// scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set( 5, 2, 5 );
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
scene.add(directionalLightHelper)

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
 * Animate
 */
// Animation variables
let currentIntersect = null;

// Animation Function
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    stats.begin();

    // Update controls
    controls.update()

    // Raycaster Work
    raycaster.setFromCamera(mouse, camera)
    
    const objectsToTest = [interactionObjectMesh]
    const intersects = raycaster.intersectObjects(objectsToTest)

    if(intersects.length) {
        currentIntersect = intersects[0];
    } else {
        currentIntersect = null;
    };

    // Potion
    potionMaterial.uniforms.uTime.value = elapsedTime;

    // Update Directional Light Position
        // directionalLight.position.x = Math.sin(elapsedTime)
        // directionalLight.position.z = Math.cos(elapsedTime)

    // Render
    renderer.render(scene, camera)
    
    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()