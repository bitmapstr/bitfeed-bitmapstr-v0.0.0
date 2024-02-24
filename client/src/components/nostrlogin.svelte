<script>
import  {currentColor1, currentHeight } from "../stores";
import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";




async function nostrConnect() {
  console.log("Relay: ")
  console.log(socket.url)
  await ndk.connect()
    nip07signer.user().then(async (user) => {
    if (!!user.npub) {
        console.log("Permission granted to read their public key:", user.npub);
    }
});

    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = 1;
    ndkEvent.content = "Current Height: " + $currentHeight;
    ndkEvent.tag = [nip07signer.user(), "he is a radstr"]
    ndkEvent.publish(); // This will trigger the extension to ask the user to confirm signing.
    // console.log("ndkEvent")
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
