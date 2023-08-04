<script>
export let icon
export let inline = false
import { currentColor1 } from "../stores";
$: color1 = $currentColor1
export let color1 = "inherit"


</script>

<style type="text/scss">
.svg-icon {
  line-height: 1em;
  :global(svg) {
    height: 1em;
    margin-bottom: -16%
  }

  &.inline {
    display: inline;
    :global(svg) {
      margin-bottom: 0;
      transform: translateY(16%);
    }
  }
}
</style>

{#if inline}
<span class="svg-icon inline" style="fill: {color1}; stroke: {color1}; color: {color1}">
  {@html icon }
</span>
{:else}
<div class="svg-icon" style="fill: {color1}; stroke: {color1}; color: {color1}">
  {@html icon }
</div>
{/if}
