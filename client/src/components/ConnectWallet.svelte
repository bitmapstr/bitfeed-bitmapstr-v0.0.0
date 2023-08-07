<script>
    import { searchBlockHeight } from "../utils/search";
    import GetAllInscriptions from "./Indexer.svelte";
    import  {currentHeight, currentColor1, walletConnected, verifiedBitmapstr, unisatAccounts, isBitmapOwner} from "../stores";
    import io from 'socket.io-client'
 

    export let wallet = walletConnected;
    export let accounts = unisatAccounts;
    let winuni = window.unisat;
    async function ConnectWallet() {
        // UniSat Wallet
       
        try {
            if (typeof winuni !== "undefined") {
                console.log("UniSat Wallet is installed!");
                accounts = await winuni.requestAccounts();
                console.log("connect success", accounts);

                unisatAccounts.set(accounts)
                wallet.connected = true
                GetMyBitmaps();

            } else {
                console.log("UniSat Wallet is not installed :(");
                console.log("connect failed");
                alert("Install a compatible wallet.");
            }
        } catch {
            // console.log("Connect wallet");
            alert("UniSat Wallet is installed! Connect your Wallet")
        }

        // Xverse

    }
  
    async function GetMyBitmaps() {
        if (wallet.connected =true) {
            try {
                
                let limit = 20;
                let insArray = [];
                const res = await window.unisat.getInscriptions(0, limit);
                let total = res.total
                // console.log("Total Ins: " + total);
                // const insTotal = "https://api.hiro.so/ordinals/v1/inscriptions?limit=" + total
                // console.log(insTotal)
                for (let i = 0; i < 20; i++) {
                    const insID = res.list[i].inscriptionId;
                    const hiro =
                        "https://api.hiro.so/ordinals/v1/inscriptions/" + insID;
                    const content = await fetch(hiro + "/content");
                    const ins = await content.text();
                    const inscriptionParts = ins.split(".");
                    // console.log(inscriptionParts);
                    const bitmapNum = inscriptionParts[0];
                    const textFilter = [];
                    const bitmapText = "bitmap";

                    if (inscriptionParts.length > 1) {
                        insArray.push(bitmapNum);
                        
                    }
                    //console.log("Content: " + ins)
                    //console.log("InsID: " + insID)
                    
                }
                $verifiedBitmapstr = true
                console.log(insArray);
                return [insArray];

                } catch (e) {
                    console.log(" catch GetMyBitmaps ERROR");
                    console.log(e);
                }

        } else {
            console.log("else GetMyBitmaps ERROR");
        }
    }

    function VerifyBitmap() {

        const trac = io("https://bitmap.trac.network", {
            autoConnect : true,
            reconnection: true,
            reconnectionDelay: 500,
            econnectionDelayMax : 500,
            randomizationFactor : 0
        });
        trac.connect();
        trac.on('response', async function(msg)
        {
            $isBitmapOwner = JSON.parse(msg.result)
            isBitmapOwner.set($isBitmapOwner)

        });
        trac.on('error', async function(msg)
        {
            console.log(msg);
        });
        trac.emit('get', {
        func : 'isBitmapOwner',
        args : [$unisatAccounts[0], $currentHeight],
        call_id : ''
        });

    }
    function DisconnectWallet() {
        wallet.connected = false;
        $verifiedBitmapstr = false
        console.log("disconnect here");
    }

    function handleSubmit(height) {
        searchBlockHeight(height);
        $currentHeight = height
        console.log("currentHeight");
        console.log($currentHeight)
        VerifyBitmap()
    }


    let selected;
</script>

<div class="dropdown"> 
    {#if wallet.connected}
        <button class="dropdown button" style="background-color: {$currentColor1}" on:click={DisconnectWallet}
            >Disconnect Wallet</button>
        <!-- <h3>{$verifiedBitmapstr}</h3> -->
        <form  on:submit|preventDefault={handleSubmit(selected)}>
            <select class="dropdown" style="background-color: {$currentColor1}" bind:value={selected} on:change={() => handleSubmit(selected)}>
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
            {#if isBitmapOwner}
            <p>{selected} is verified</p>
            {:else}
            <p class="danger">{selected} is not verified</p>
            {/if}

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
</style>

