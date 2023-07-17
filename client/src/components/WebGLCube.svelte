<script>
	import { onMount } from "svelte";
	import { Renderer, Mesh, CubeGeometry, PerspectiveCamera } from "svelte-gl";
  
	onMount(() => {
	  const renderer = new Renderer({ target: canvas });
  
	  const geometry = new CubeGeometry(1, 1, 1);
	  const material = new Mesh.BasicMaterial({ color: 0x00ff00 });
	  const cube = new Mesh(geometry, material);
  
	  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
	  camera.position.z = 5;
  
	  renderer.add(cube, camera);
	  renderer.start();
	});
  </script>
  
  <canvas id="canvas" width="400" height="400"></canvas>
  