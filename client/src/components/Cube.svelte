<script>
	import * as THREE from 'three'
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';
    import { currentColor1, currentColor2, currentBlock, detailTx } from '../stores';

	export const width = 3;
	export const height = 3;
	export const depth = 3;
	export const widthSegments = 1
	export const heightSegments = 1
	export const depthSegments = 1
	export const id = 0

	let color1 = $currentColor1
	let color2 = $currentColor2

	onMount(() => {const container = document.querySelector('#scene-container');
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(2, window.innerWidth / window.innerHeight, 1, 1000);
	const renderer = new THREE.WebGL1Renderer();

	const controls = new OrbitControls( camera, renderer.domElement );
    const loader = new GLTFLoader();
	const model = null

	loader.load (
		// resource URL
	'models/gltf/bitmaps/PRISTINEPP-001.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );
		
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
	);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0x000000, 0)
	//document.body.appendChild(renderer.domElement);
	container?.append(renderer.domElement);

	const geometry = new THREE.BoxGeometry( width, height, depth);
	const txgeometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
	const material = new THREE.MeshBasicMaterial({ color1 });
	const cube = new THREE.Mesh( txgeometry, material);
	
	//  scene.add(cube);
	
	// camera.position.z = 5;
	camera.position.set( 0, 20, 100 );
	controls.update();

	function animate() {
		requestAnimationFrame( animate );
		// cube.rotation.x += 0.01;
		// cube.rotation.y += 0.01;

		renderer.render( scene, camera);
		
	}

	animate();
	});

    export {};
</script>

