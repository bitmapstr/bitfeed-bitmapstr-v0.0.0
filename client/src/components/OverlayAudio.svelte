<script>
import analytics from '../utils/analytics.js'
import Icon from './Icon.svelte'
import closeIcon from '../assets/icon/cil-x-circle.svg'
import { overlay, currentColor1, currentColor2 } from '../stores.js'
import { createEventDispatcher } from 'svelte'
import { fade, fly } from 'svelte/transition'
const dispatch = createEventDispatcher()

export let name = 'none'
export let fullSize = false

let color1 = $currentColor1
let color2 = $currentColor2


let open
$: {
  const oldOpen = open
  open = $overlay === name
  if (oldOpen !== undefined && open != oldOpen) {
    analytics.trackEvent('audio-overlay', name, open ? 'open' : 'close')
  }
}

function close () {
  $overlay = null
  dispatch('close')
}
</script>

<style type="text/scss">
  .audio-overlay-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    
    display: flex;
    justify-content: center;
    align-items: center;

    .audio-overlay-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;

      background: var(--dark-a);
      opacity: 50%;
    }

    .audio-overlay-outer {
      position: relative;
      padding: 1em;
      border-radius: 10px;
      background: var(--palette-a);
      color: var(--palette-x);
      max-width: 80%;
      max-height: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      opacity: 95%;
      // background: url(../img/bg-logo-0.png);
      // background-repeat: round;
      // background-blend-mode: hard-light;

      @media (min-width: 1200px) {
        max-width: 960px;
      }

      .close-button {
        position: absolute;
        bottom: 100%;
        left: 100%;
        font-size: 1.2rem;
        display: block;
        background: none;
        border: none;
        padding: 0;
        margin: -0.2em;
        cursor: pointer;

        // background: var(--palette-c);
        border-radius: 50%;
      }

      .audio-overlay-inner {
        overflow: auto;
        padding-right: 1em;
        max-width: 95%;
      }

      &.full-size {
        height: 100%;
        width: 100%;
        .overlay-inner {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>

{#if open}
<div class="audio-overlay-wrapper" >
  <div class="audio-overlay-background" on:click={close} transition:fade={{ duration: 500 }} />
  <div class="audio-overlay-outer" style="background-color: {$currentColor1}" class:full-size={fullSize} transition:fly={{ duration: 500, y: 50 }}>
    <div class="audio-overlay-inner" id="{name}AudioOverlay" style="overflow:auto">
      <slot />
    </div>
    <button class="close-button" on:click={close} >
      <Icon icon={closeIcon} color="var(--palette-x)" />
    </button>
  </div>
</div>
{/if}
