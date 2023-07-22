<script>
	// import { json, text } from '@sveltejs/kit';
    // import { Card, Button, Toggle } from "flowbite-svelte";
    import {Card} from 'svelte-materialify'
    let vCard = false;

	export async function GetAllInscriptions() {
		let insArray = [
    {
        "id": "2cd6956912ccb31b1288d1a36f240224e7269448712ea8348cbe346efbb8533bi0",
        "genesis_block_height": 798049,
        "timestamp": 1688956735000,
        "ins": "02161.btc"
    },
    {
        "id": "0af868e70e54a5a60ccb48a6c5de3589335de8cd833caddd780ed4d4ff06393bi0",
        "genesis_block_height": 798049,
        "timestamp": 1688956735000,
        "ins": "351.web3"
    },
    {
        "id": "4f3e92f747ca4128122be1324b78566cd52a5be71fcfb6edafa242271f88243bi0",
        "genesis_block_height": 798049,
        "timestamp": 1688956735000,
        "ins": "510.web3"
    }
];
     
		return insArray;
	}

	function handleSubmit() {
		console.log('submit');
	}
</script>


<!-- <div class="canvas-wrapper">
<button on:click={GetAllInscriptions}> get em all </button>

{#await GetAllInscriptions()}
	<p>...waiting for my bitmaps</p>
{:then data}
	
	{#each data as response, index}
    {console.log(data[1])}
    <Card>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Inscription</h5>
        <h2>{index} - {response.genesis_block_height} - {response.timestamp}</h2>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"></p>

    </Card>
    <Card img="src/lib/images/bitmapstr.png" reverse={vCard}>
    
       
        <Button>
          Read more <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Button>
  
		<br />
	{/each}
{/await}

</div> -->