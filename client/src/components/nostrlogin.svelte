<script>
import  {currentColor1, currentHeight } from "../stores";
import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";

const nip07signer = new NDKNip07Signer();
const ndk = new NDK({ signer: nip07signer, explicitRelayUrls: [ "ws://umbrel.local:4848", "wss://relay.bitmapstr.io"], });
    // const ndk = new NDK({ signer: nip07signer, explicitRelayUrls: [ "ws://umbrel.local:4848"], });

async function nostrConnect() {
    
    nip07signer.user().then(async (user) => {
    if (!!user.npub) {
        console.log("Permission granted to read their public key:", user.npub);
    }
    await ndk.connect();
});
}

async function nostrbitfeed() {

    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = 1;
    ndkEvent.content = "Chillin' on " + $currentHeight + ".bitmap";
    ndkEvent.publish(); // This will trigger the extension to ask the user to confirm signing.
    console.log("ndkEvent")
    console.log(ndkEvent)

}
async function imagetest() {

  const ndkEvent = new NDKEvent(ndk);
  ndkEvent.kind = 1;
  ndkEvent.content = "this 1 kind note with tags";
  ndkEvent.tag = [
    ["t", "ndk"],
    ["image", "https://ordinals.com/content/9b8a806b940cf9ad97360d51cb4c470051c3b5bdf13ca328f19bedf9133c1a7ei0"]
  ],
  ndkEvent.publish(); // This will trigger the extension to ask the user to confirm signing.
  console.log("ndkEvent")
  console.log(ndkEvent)


// {
// "kind": 30023,
// "created_at": 1675642635,
// "content": "Lorem [ipsum][nostr:nevent1qqst8cujky046negxgwwm5ynqwn53t8aqjr6afd8g59nfqwxpdhylpcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mg8arnc9] dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nRead more at nostr:naddr1qqzkjurnw4ksz9thwden5te0wfjkccte9ehx7um5wghx7un8qgs2d90kkcq3nk2jry62dyf50k0h36rhpdtd594my40w9pkal876jxgrqsqqqa28pccpzu.",
// "tags": [
// ["d", "lorem-ipsum"],
// ["title", "Lorem Ipsum"],
// ["published_at", "1296962229"],
// ["t", "placeholder"],
// ["e", "b3e392b11f5d4f28321cedd09303a748acfd0487aea5a7450b3481c60b6e4f87", "wss://relay.example.com"],
// ["a", "30023:a695f6b60119d9521934a691347d9f78e8770b56da16bb255ee286ddf9fda919:ipsum", "wss://relay.nostr.org"]
// ],
// "pubkey": "...",
// "id": "..."
// }

}


</script>
<style>
.primary {
    color: orange;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    .dropdown {
      position: relative;
      
    }
    .dropdown button {
      /* background-color: var(--palette-good); */
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
</style>
<div>
<h1>Nostr login</h1>
<button class="primary" style="background-color: {$currentColor1}" on:click={nostrConnect}>log-in</button>
<button class="primary" style="background-color: {$currentColor1}" on:click={nostrbitfeed}>SEND</button>
<button class="primary" style="background-color: {$currentColor1}" on:click={imagetest}>IMAGE</button>


</div>
