<script>
import analytics from '../utils/analytics.js'
import { settingsBitmap, settings} from '../stores.js'
import SidebarMenuItem2 from './SidebarMenuItem2.svelte';

function toggle(setting) {
  if (settingConfig[setting] != null && settingConfig[setting].valueType === 'bool') {
    onChange(setting, !$settings[setting])
  }
}

function onChange(setting, value) {
  $settings[setting] = value
  analytics.trackEvent('settings', setting, $settings[setting])
}


let settingConfig = { 
  audioOn: {
    label: 'Audio On',
    valueType: 'bool'
  },
  unverifiedtheme: {
    label: 'Unverified',
    type: 'dropdown',
    valueType: 'string'
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

{#each Object.keys($settings) as setting (setting) }
  {#if settingConfig[setting]}
    <SidebarMenuItem2 {...getSettings(setting)} value={$settings[setting]} on:click={() => { toggle(setting) }} on:input={(e) => { onChange(setting, e.detail)}} />
  {/if}
{/each}
