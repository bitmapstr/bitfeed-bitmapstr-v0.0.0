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
	import blockinfo from './BlockInfo.svelte'
	import TxRender from './TxRender.svelte';
    import TxInfo from './TxInfo.svelte';

	let txController
	let canvasWidth = '100%'
  	let canvasHeight = '100%'
	onMount(() => {const container = document.querySelector('.bitmap-cube');
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGL1Renderer();
	const controls = new OrbitControls( camera, renderer.domElement );
	const loader = new GLTFLoader();
	renderer.setSize(200,200);
	container?.append(renderer.domElement);

	const height = 3;
	const width = 3;
	const depth = 3;

	const geometry = new THREE.BoxGeometry( height, width, depth);
	const material = new THREE.MeshBasicMaterial({ color: 0xe2933b});
	const cube = new THREE.Mesh( geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	function animate() {
		requestAnimationFrame( animate );
		 cube.rotation.x += 0.01;
		 cube.rotation.y += 0.01;

		renderer.render( scene, camera);
		
	}

	animate();
	});
	console.log("Current Block")
	console.log({$currentBlock})

	
	let mousePosition = { x: 0, y: 0 }

function onClick (e) {
  mousePosition = {
	x: e.clientX,
	y: e.clientY
  }
  const position = {
	x: e.clientX,
	y: window.innerHeight - e.clientY
  }
  if (txController) txController.mouseClick(position)
}

function pointerMove (e) {
  if (!txController.selectionLocked) {
	mousePosition = {
	  x: e.clientX,
	  y: e.clientY
	}
	const position = {
	  x: e.clientX,
	  y: window.innerHeight - e.clientY
	}
	if (txController) txController.mouseMove(position)
  }
}

function pointerLeave (e) {
  const position = {
	x: null,
	y: null
  }
  if (txController) txController.mouseMove(position)
}

function hideBlock () {
    $blockVisible = false
  }
  function quitExploring () {
    if (txController) txController.resumeLatest()
  }
    export {};
</script>
