<script>
    import { searchBlockHeight } from "../utils/search";
    import GetAllInscriptions from "./Indexer.svelte";
    import MySlider from "./MySlider.svelte";
    import  {currentHeight, currentColor1} from "../stores";

    let wallet = { connected: false };
    let winuni = window.unisat;
    async function ConnectWallet() {
        // UniSat Wallet
       
        try {
            if (typeof winuni !== "undefined") {
                console.log("UniSat Wallet is installed!");
                let accounts = await winuni.requestAccounts();
                console.log("connect success", accounts);
                wallet.connected = !wallet.connected;
                GetMyBitmaps();
            } else {
                console.log("UniSat Wallet is not installed :(");
                console.log("connect failed");
                alert("Install a compatible wallet.");
            }
        } catch {
            console.log("Connect wallet");
        }

        // Xverse

    }

    async function GetMyBitmaps() {
        if (wallet.connected) {
            try {
                let limit = 13;
                let insArray = [];
                const res = await window.unisat.getInscriptions(0, limit);
                console.log("Total Ins: " + res.total);
                for (let i = 0; i < limit; i++) {
                    const insID = res.list[i].inscriptionId;
                    const hiro =
                        "https://api.hiro.so/ordinals/v1/inscriptions/" + insID;
                    const content = await fetch(hiro + "/content");
                    const ins = await content.text();
                    const inscriptionParts = ins.split(".");
                    console.log(inscriptionParts);
                    const bitmapNum = inscriptionParts[0];
                    const textFilter = [];
                    const bitmapText = "bitmap";

                    if (inscriptionParts.length > 1) {
                        insArray.push(bitmapNum);
                    }
                    //console.log("Content: " + ins)
                    //console.log("InsID: " + insID)
                }

                console.log(insArray);
                return [insArray];

                } catch (e) {
                    console.log(e);
                }

        } else {
            console.log("no Inscriptions!?");
        }
    }

    function DisconnectWallet() {
        wallet.connected = !wallet.connected;
        console.log("disconnect here");
    }

    function handleSubmit(height) {
        searchBlockHeight(height);
        $currentHeight = height
        console.log("currentHeight");
        console.log($currentHeight)
    }
    $: accounts = accounts;
    let selected;
</script>

<div class="dropdown"> 
    {#if wallet.connected}
        <button class="danger" on:click={DisconnectWallet}
            >Disconnect Wallet</button>
        <h3>unverified bitmaps</h3>
        <form  on:submit|preventDefault={handleSubmit(selected)}>
            <select class="dropdown" bind:value={selected} on:change={() => handleSubmit(selected)}>
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
            <input
                bind:value={selected}
                on:change={() => handleSubmit(selected)}
            />
            <!-- <button disabled={!selected} type="submit"> Submit </button> -->
            <p>selected bitmap {selected ? selected : "[waiting...]"}</p>

            <div />
        </form>
    {:else if !wallet.connected}
        <p>Connect yer wallet</p>
        <button class="primary" style="background-color: {$currentColor1}" on:click={ConnectWallet}>UniSat</button>
        <br />
        <button style="background-color: {$currentColor1}">Hiro</button>
        <br />
        <button style="background-color: {$currentColor1}">Xverse</button>
    {:else}
        <p>something else happened here</p>
    {/if}
</div>


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
    .dropdown {
      position: relative;
    }
    .dropdown button {
      background-color: var(--palette-good);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    .dropdown ul {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1;
      list-style: none;
      padding: 0;
      margin: 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color:var(--palette-good);
    }
    .dropdown ul li {
      padding: 5px 10px;
      cursor: pointer;
    }
    .dropdown ul li:hover {
      background-color: #f1f1f1;
    }
    .open .dropdown ul {
      display: block;
    }
  </style>

