<script>
import analytics from '../utils/analytics.js'
import { settingsBitmap } from '../stores.js'
import SidebarMenuItem2 from './SidebarMenuItem2.svelte';

function toggle(setting) {
  if (settingConfig[setting] != null && settingConfig[setting].valueType === 'bool') {
    onChange(setting, !$settingsBitmap[setting])
  }
}

function onChange(setting, value) {
  $settingsBitmap[setting] = value
  analytics.trackEvent('settingsBitmap', setting, $settingsBitmap[setting])
}


let settingConfig = { 
  showMyBitmap: {
    label: 'My Bitmap',
    type: 'pill',
    falseLabel: 'Bitfeed',
    trueLabel: 'Bitmapstr',
    valueType: 'bool'
  },
  show3DBitmap: {
    label: '3D Bitmap',
    type: 'pill',
    falseLabel: 'Off',
    trueLabel: 'On',
    valueType: 'bool'
  },
  showNav: {
    label: 'Show Navigation',
    valueType: 'bool'
  },
  showBlockInfo: {
    label: 'Show block Info',
    valueType: 'bool'
  },
 
}


function getSettings(setting) {
  return settingConfig[setting] || {}
}

</script>

{#each Object.keys($settingsBitmap) as setting (setting) }
  {#if settingConfig[setting]}
    <SidebarMenuItem2 {...getSettings(setting)} value={$settingsBitmap[setting]} on:click={() => { toggle(setting) }} on:input={(e) => { onChange(setting, e.detail)}} />
  {/if}
{/each}
