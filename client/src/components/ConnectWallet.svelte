<script>
    import { searchBlockHeight } from "../utils/search";
    import GetAllInscriptions from "./Indexer.svelte";
    import  {currentHeight, currentColor1, currentColor2, walletConnected, verifiedBitmapstr, unisatAccounts, isBitmapOwner} from "../stores";
    import io from 'socket.io-client'

    export let wallet = walletConnected;
    export let accounts = unisatAccounts;
    let winuni = window.unisat;
    winuni.on('accountsChanged', function(accounts) {
        reconnectWallet()
    });

    winuni.removeListener('accountsChanged', function(accounts) {
        reconnectWallet()
    });
    async function ConnectWallet() {
        // UniSat Wallet
       
        try {
            if (typeof winuni !== "undefined") {
                console.log("UniSat Wallet is installed!");
                accounts = await winuni.requestAccounts();
                wallet.connected = true
                console.log("connect success", accounts);

                unisatAccounts.set(accounts)
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
  
    function reconnectWallet() {
        DisconnectWallet()
        ConnectWallet()

    }

    async function GetBitmapArray() {
        const ipv4Addresses = [
            "string.5.8888.bitmap",
            "string.9.bitmap",
            "0.100.bitmap",
            "20.777777.bitmap",
            "5.bitmap"
            ];
        // const addresses = await GetMyBitmaps()

        // const regexBitmap = /^(.*?)(?:0|[1-9][0-9]*)(\.bitmap)$/;
        const regexBitmap = /^(.*?)\.(\d+(\.\d+)?)(\.\d+(\.\d+)?)\.bitmap$/;

        const extractedParts = ipv4Addresses.map((item) => {
        const match = item.match(regexBitmap);
        if (match) {
            const anyPart = match[0];
            const firstNumber = match[1];
            const secondNumber = match[2];
            const thirdNumber = match[3];

            return {
            anyPart,
            firstNumber,
            secondNumber,
            thirdNumber
            };
        }
        return null;
        });

            console.log("extractedParts");
            console.log(extractedParts);

    }

    async function GetWalletInsTotal() {
        let limit;
        const walletInscriptions = await window.unisat.getInscriptions(0, limit);
        console.log(" GetWalletInsTotal()")
        console.log(walletInscriptions.total)
        return walletInscriptions.total

    }

    async function GetMyBitmaps() {
        if (wallet.connected = true) {
            const regexBitmap = /^(?:0|[1-9][0-9]*).bitmap$/;
            const regexBitmapstr = /^(?:0|[1-9][0-9]*).bitmapstr$/;
            const hiroURL = "https://api.hiro.so/ordinals/v1/inscriptions/"
            
            try { 
                const limit = await GetWalletInsTotal()                 
                const walletInscriptions = await window.unisat.getInscriptions(0, limit);
                
                let insArray = [];
                let parcelArray = [];
                
                for (let i = 0; i < walletInscriptions.total; i++) {
                    const insID = walletInscriptions.list[i].inscriptionId;
                    const hiro = hiroURL + insID;

                    const content = await fetch(hiro + "/content");
                    const ins = await content.text();
                    const inscriptionParts = ins.split(".");
                    console.log(inscriptionParts);
                    const bitmapNum = inscriptionParts[0];
                    const parcelNumber = inscriptionParts[0]
                    const bitmapText = regexBitmap.test(ins)
                    const bitmapstrText = regexBitmapstr.test(ins)

                    if (bitmapText) {
                        insArray.push(bitmapNum);
                        // switch(ins.length) {
                        //     case 2:
                        //     inscriptionParts.length = 2
                            
                        //     break;

                        //     case 3:
                        //     inscriptionParts.length = 3
                        //     parcelArray.push(parcelNumber);
                        //     break;

                        // }                        
                        
                    }
                    
                    // console.log("Content: " + ins)
                    // console.log("InsID: " + insID)
                    console.log("parcelNumber")
                    console.log(parcelNumber)

                    
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

        console.log($unisatAccounts[0], $currentHeight)

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
            console.log("$isBitmapOwner")
            console.log($isBitmapOwner)
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
        $isBitmapOwner = false
        console.log("Wallet disconnected");
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
                        <option style="background-color: {$currentColor1} color: {$currentColor2}" value={bitmap}>{bitmap}</option>
                    {/each}
                {/await}
            </select>
            {#if $isBitmapOwner}
            <p>{selected} Verified</p>
            {:else}
            <p>{selected} Not Verified</p>
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

