<script>
import  {currentColor1 } from "../stores";

    // Import the package
import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";




async function nostrConnect() {
    const nip07signer = new NDKNip07Signer();
    const ndk = new NDK({ signer: nip07signer, explicitRelayUrls: ["ws://umbrel.local:4848", " wss://relay.snort.social/", "wss://nos.lol/"], });
    nip07signer.user().then(async (user) => {
    if (!!user.npub) {
        console.log("Permission granted to read their public key:", user.npub);
    }
});

    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = 1;
    ndkEvent.content = "rad everything!";
    ndkEvent.publish(); // This will trigger the extension to ask the user to confirm signing.
    console.log("ndkEvent")
    console.log(ndkEvent)

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

</div>
