<script>
import Icon from './Icon.svelte'
import BitcoinAudioIcon from '../assets/icon/cil-bitcoinaudioicon.svg'
import { longBtcFormat, numberFormat, feeRateFormat } from '../utils/format.js'
import { exchangeRates, settings, sidebarToggle, newHighlightQuery, highlightingFull } from '../stores.js'
import { formatCurrency } from '../utils/fx.js'
// import BitcoinAudio from './BitcoinAudio.svelte';

export let tx
export let position

let clampedX
let clampedY
let above = false
$: clampedX = Math.max(20, Math.min(position.x - 30, window.innerWidth - 300))
$: clampedY = Math.max(50, Math.min(position.y, window.innerHeight - 30))
$: {
  above = position.y > (window.innerHeight / 2)
}

let formattedLocalValue

$: {
  if (tx && tx.value) {
    const rate = $exchangeRates[$settings.currency]
    let local
    if (rate && rate.last) {
      formattedLocalValue = formatCurrency($settings.currency, (tx.value/100000000) * rate.last, { compact: true })
    } else {
      formattedLocalValue = null
    }
  }
}

let inputCount
let outputCount
$: {
  if (tx) {
    if (tx.inputs) inputCount = tx.inputs.length
    else inputCount = tx.numInputs || 0
    if (tx.outputs) outputCount = tx.outputs.length
    else outputCount = tx.numOutputs || 0
  }
}

function formatBTC (sats) {
  return `₿ ${longBtcFormat.format(sats/100000000)}`
}

function highlight () {
  if (!$highlightingFull && tx && tx.id) {
    $newHighlightQuery = tx.id
    $sidebarToggle = 'search'
  }
}
</script>

<style type="text/scss">
  .tx-audio {
    position: fixed;
    z-index: 50;
    width: 300px;
    display: block;
    pointer-events: all;
    box-sizing: border-box;
    transform: translateY(20px);

    // background: var(--palette-d);
    color: var(--palette-x);
    padding: .5rem;

    font-size: 0.8rem;
    text-align: left;

    &.above {
      transform: translateY(calc(-100% - 20px));
    }

    .field {
      margin: 0;
      line-height: 1.4em;
    }

    .local-value {
      white-space: nowrap;
    }

    .hash {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .coinbase {
      white-space: pre-wrap;
      word-break: break-all;
    }

    .inputs {
      display: inline-table;
      table-layout: fixed;
      width: calc(100% - 40px);

      span {
        display: table-cell;
        white-space: nowrap;
        &.arrow {
          min-width: 1.5em;
          text-align: center;
        }
        &:last-child {
          text-align: right;
        }
      }
    }

    &:hover {
      .hash {
        white-space: pre-wrap;
        word-break: break-all;
      }
    }

    .icon-button {
      float: right;
      font-size: 24px;
      margin: 0;
      transition: opacity 300ms, color 300ms, background 300ms;
      // background: var(--palette-c);
      color: var(--bold-a);
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;
      &:hover {
        background: var(--palette-e);
      }
      &.disabled {
        color: var(--palette-e);
        background: none;
      }
    }
  }
</style>

<div class="tx-audio" class:above style="left: {clampedX}px; top: {clampedY}px">
  <div class="icon-button" class:disabled={$highlightingFull} on:click={highlight} title="Add to watchlist">
    <Icon icon={BitcoinAudioIcon}/>
  </div>
  <p class="field hash">
    TxID: { tx.id }
  </p>
  {#if inputCount && outputCount && !tx.coinbase }
    <p class="field inputs">
      <span>{ inputCount } input{#if inputCount != 1}s{/if}</span>
      <span class="arrow"> &#10230; </span>
      <span>{ outputCount } output{#if outputCount != 1}s{/if}</span>
    </p>
  {:else if tx.coinbase }
    {#if tx.coinbase.sigAscii }
      <p class="field coinbase">Coinbase: { tx.coinbase.sigAscii }</p>
    {:else}
      <p class="field coinbase">Coinbase</p>
    {/if}
    <p class="field inputs">{ tx.outputs.length } output{#if tx.outputs.length != 1}s{/if}</p>
  {/if}
 
 <p>Tx.Value</p>
 {tx.value/1000000}

 <!-- <p>txNote: {txNote}</p> -->
 
</div>
