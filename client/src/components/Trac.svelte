<script>
import { unisatAccounts, currentHeight } from "../stores"
import io from 'socket.io-client'

export let isBitmapOwner = false
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
    isBitmapOwner = JSON.parse(msg.result)
    console.log(isBitmapOwner);
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


$: isBitmapOwner = isBitmapOwner

</script>
{#if isBitmapOwner}
<p>Bitmap is verified</p>
{:else}
<p>Bitmap is not verified</p>
{/if}





