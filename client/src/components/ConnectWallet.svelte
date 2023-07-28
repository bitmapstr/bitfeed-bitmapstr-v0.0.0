<script>
    import { searchBlockHeight } from "../utils/search";
    import GetAllInscriptions from "./Indexer.svelte";
    import MySlider from "./MySlider.svelte";

    let wallet = { connected: false };

    async function ConnectWallet() {
        // UniSat Wallet
        let winuni = window.unisat;
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
                let limit = 30;
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
        console.log("searchBlockHeight");
    }
    $: accounts = accounts;
    let selected;
</script>

<div>
    {#if wallet.connected}
        <button class="danger" on:click={DisconnectWallet}
            >Disconnect Wallet</button>
        <h2>unverified bitmaps</h2>
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
        <button class="primary" on:click={ConnectWallet}>UniSat</button>
        <br />
        <button>Hiro</button>
        <br />
        <button>Xverse</button>
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
</style>
