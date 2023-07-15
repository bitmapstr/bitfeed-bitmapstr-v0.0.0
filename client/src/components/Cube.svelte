<script>
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import BlockInfo from './BlockInfo.svelte';
	import { settings, overlay, serverConnected, serverDelay, txCount, mempoolCount,
           mempoolScreenHeight, blockVisible, tinyScreen,
           compactScreen, currentBlock, latestBlockHeight, selectedTx, blockAreaSize,
           devEvents, devSettings, pageWidth, pageHeight, loading, freezeResize } from '../stores.js'


	onMount(() => {const container = document.querySelector('.bitmap-wrapper');
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGL1Renderer();
	const controls = new OrbitControls( camera, renderer.domElement );
	const loader = new GLTFLoader();
	renderer.setSize(200,200);
	container?.append(renderer.domElement);

	const height = 1;
	const width = 1;
	const depth = 1;

	const geometry = new THREE.BoxGeometry( height, width, depth);
	const material = new THREE.MeshBasicMaterial({ color: 0xe2933b});
	const cube = new THREE.Mesh( geometry, material);
	scene.add(cube);

	camera.position.z = 5;

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
<div>
	<BlockInfo block={$currentBlock} visible={$blockVisible && !$tinyScreen} />
	<p>The current block is {$currentBlock}</p>
</div>
