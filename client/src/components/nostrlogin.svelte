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

</style>
<div><h1>nostr login</h1></div>
<button style="background-color: {$currentColor1}" on:click={nostrConnect}>log-in</button>
