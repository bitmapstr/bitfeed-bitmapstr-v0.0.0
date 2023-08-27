<script>
import { currentColor1 } from "../../stores";

export let active
export let left
export let right
export let leftDisabled = false
export let rightDisabled = false

let background;
$: background && background.style.setProperty('--palette-good', $currentColor1 )

</script>

<div class="pill2"  class:active={active} on:click >
  {#if !leftDisabled}
    <span class="side left" bind:this={background} class:selected={!active} ><slot name="left">{ left }</slot></span>
  {/if}
  {#if !rightDisabled}
    <span class="side right" bind:this={background} class:selected={active} ><slot name="right">{ right }</slot></span>
  {/if}
</div>

<style type="text/scss">
:root {
  --background: inherit;
}
.pill2 {
  display: inline-block;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  overflow: hidden;

  .side {
    width: 100%;
    max-width: 400px;
    flex-shrink: 1;
    flex-grow: 1;
    padding: .5em 1em;
    background: var(--palette-e);
    text-align: center;

    &:first-child {
      border-top-left-radius: .5em;
      border-bottom-left-radius: .5em;
    }
    &:last-child {
      border-top-right-radius: .5em;
      border-bottom-right-radius: .5em;
    }

    &.selected {
      background: var(--palette-good);
      color: var(--palette-a);
    }
  }
}
</style>
