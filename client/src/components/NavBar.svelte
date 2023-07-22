<script>
import TxIcon from '../assets/icon/cil-arrow-circle-right.svg'
import BlockIcon from '../assets/icon/grid-icon.svg'
import { fly } from 'svelte/transition'
import { matchQuery, searchTx, searchBlockHeight, searchBlockHash } from '../utils/search.js'
import { selectedTx, detailTx, overlay, loading, freezeResize } from '../stores.js'
import Indexer from "./Indexer.svelte";
    import Icon from './Icon.svelte';
    import bitmapIcon from '../assets/icon/cil-bitfeed-ostrich.svg'

// import IndexerLocal from './Indexer-Local.svelte'
	
	export let menu = 1;
const queryIcons = {
  txid: TxIcon,
  input: TxIcon,
  output: TxIcon,
  // address: AddressIcon,
  blockhash: BlockIcon,
  blockheight: BlockIcon,
}

let query
let matchedQuery
let errorMessage

$: {
  if (query) {
    matchedQuery = matchQuery(query)
  } else {
    matchedQuery = null
  }
  errorMessage = null
}

function clearInput () {
  query = null
}

function handleSearchError (err) {
  switch (err) {
    case '404':
      if (matchedQuery && matchedQuery.label) {
        errorMessage = `${matchedQuery.label} not found`
      }
      break;
    default:
      errorMessage = 'server error'
  }
}

async function searchSubmit (e) {
  e.preventDefault()

  if (document.activeElement) document.activeElement.blur()

  if (matchedQuery && matchedQuery.query !== 'address') {
    loading.increment()
    let searchErr
    switch(matchedQuery.query) {
      case 'txid':
        searchErr = await searchTx(matchedQuery.txid)
        break;

      case 'input':
        searchErr = await searchTx(matchedQuery.txid, matchedQuery.input, null)
        break;

      case 'output':
        searchErr = await searchTx(matchedQuery.txid, null, matchedQuery.output)
        break;

      case 'blockheight':
        searchErr = await searchBlockHeight(matchedQuery.height)
        break;

      case 'blockhash':
        searchErr = await searchBlockHash(matchedQuery.hash)
        break;
    }
    if (searchErr == null) errorMessage = null
    else handleSearchError(searchErr)
    loading.decrement()
  } else {
    errorMessage = 'enter a transaction id, block hash or block height'
  }

  return false
}

let freezeTimeout
function focusIn(e) {
  if (freezeTimeout) clearTimeout(freezeTimeout)
  $freezeResize = true
}
async function focusOut(e) {
  freezeTimeout = setTimeout(() => {
    $freezeResize = false
  }, 500)
}

</script>

<style type="text/scss">

  ul#menu li{
		display : inline;
  }
</style>

<Icon icon={bitmapIcon} color="var(--bold-a)" />

<ul id="menu">
	<li><a href="/" on:click|preventDefault={() => (menu = 1)}>Indexer</a></li> |
	<li><a href="/" on:click|preventDefault={() => (menu = 2)}>Indexer-Local</a></li>
</ul>

{#if menu === 1}
<!-- <Indexer /> -->
{:else if menu === 2}
<!-- <IndexerLocal /> -->
{:else}
<h1>
	Page Not Found
</h1>
{/if}
