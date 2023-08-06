<script>
import analytics from '../utils/analytics.js'
import { settingsBitmap, settings} from '../stores.js'
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
  audioOn: {
    label: 'Audio On',
    valueType: 'bool'
  },
  showSearch: {
    label: 'Search Bar',
    valueType: 'bool'
  },
  showBlockInfo: {
    label: 'Block Info',
    valueType: 'bool'
  },
  showMyBitmap: {
    label: 'My Bitmap',
    valueType: 'bool'
  }
 
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
