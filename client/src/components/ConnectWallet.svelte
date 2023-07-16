<script>
    import { IntType } from "three";
    import { searchBlockHeight } from "../utils/search";
    import GetAllInscriptions from './Indexer.svelte'

    let wallet = { connected: false };

    async function ConnectWallet() {
		let winuni = window.unisat;
        
		if (typeof winuni !== 'undefined') {
			console.log('UniSat Wallet is installed!');
            let accounts = await winuni.requestAccounts();
			console.log('connect success', accounts);
            wallet.connected = !wallet.connected;
            GetMyBitmaps()

		} else {
			console.log('UniSat Wallet is not installed :(');
            console.log('connect failed');
            wallet.connected = !wallet.connected;

		}
		
	}

    async function GetMyBitmaps() {
        let insArray = [];
        try {
            const res = await window.unisat.getInscriptions(0, 10);
            console.log("Total Ins: " + res.total);
            for (let i = 0; i < res.total; i++) {
                const insID = res.list[i].inscriptionId;
                const hiro =
                    "https://api.hiro.so/ordinals/v1/inscriptions/" + insID;
                const content = await fetch(hiro + "/content");
                const ins = await content.text();
                const inscriptionParts = ins.split(".");
                const bitmapNum = inscriptionParts[0];                
                const textFilter = []
                const bitmapText = "bitmap";

                // if (ins.includes(bitmapText)) {

                //     insArray.push(bitmapNum);
                // }

                if (ins.includes(bitmapText)) {
                    //insArray.pop(bitmapText)
                    insArray.push(bitmapNum)
            }
                console.log("Content: " + ins)
                console.log("InsID: " + insID)
            }

        } catch (e) {
            console.log(e);
        }

        return [insArray];
    }

    function handleSubmit(height) {

        searchBlockHeight(height)
        console.log("handleSubmit")
    }
    //$: wallet.connected = !wallet.connected;
    $: accounts = accounts;
    let selected;
</script>

{#if wallet.connected}
<button class="danger" on:click={ConnectWallet}>Disconnect Wallet</button> 

{:else if !wallet.connected}
<button class="primary" on:click={ConnectWallet}>Connect a Wallet</button>
<br />
<button>UniSat</button>
<br />
<button>Hiro</button>
<br />
<button>Xverse</button>

{:else}
	<p>something else happened here</p>
{/if}

<h2>My bitmaps</h2>
<form on:submit|preventDefault={handleSubmit(selected)}>
    <select bind:value={selected} on:change={() => handleSubmit(selected)}>
        <option>Select ur bitmap</option>
        {#await GetMyBitmaps()}
            <p>...waiting for my bitmaps</p>
        {:then bitmaps}
            {console.log("BITMAPS: " + bitmaps)}
            {#each bitmaps[0] as bitmap, index}
                
                <option value={bitmap}>{bitmap}</option>
            {/each}
        {/await}
    </select>
    <input bind:value={selected} on:change={() => handleSubmit(selected)} />
	<button disabled={!selected} type="submit"> Submit </button>
    <p>selected bitmap {selected ? selected : "[waiting...]"}</p> 
    <br>
    <div>
      <!-- <GetAllInscriptions /> -->
  
    </div>  
</form>

<style>
    .primary {
        color: orange;
    }
    .danger {
        color: rgba(255, 119, 0, 0.675);
    }
    input {
        display: block;
        width: 200px;
        max-width: 100%;
    }
</style>
