<script>
  import config from '../config.js'
  import analytics from '../utils/analytics.js'
  
  import SidebarTab from '../components/SidebarTab.svelte'
  import Icon from '../components/Icon.svelte'
  
  import Settings from '../components/Settings.svelte'
  import cogIcon from '../assets/icon/cil-cog.svg'
  import DevTools from '../components/DevTools.svelte'
  import codeIcon from '../assets/icon/cil-code.svg'
  import questionIcon from '../assets/icon/help-circle.svg'
  import infoIcon from '../assets/icon/info.svg'
  import atIcon from '../assets/icon/cil-at.svg'
  import gridIcon from '../assets/icon/grid-icon.svg'
  import peopleIcon from '../assets/icon/cil-people.svg'
  import giftIcon from '../assets/icon/cil-gift.svg'
  import bookmarkIcon from '../assets/icon/cil-bookmark.svg'
  import MempoolLegend from '../components/MempoolLegend.svelte'
  import ContactTab from '../components/ContactTab.svelte'
  import SearchTab from '../components/SearchTab.svelte'
  
  import bitmapIcon from '../assets/icon/cil-bitfeed-ostrich.svg'
  
  
  import { sidebarToggle, overlay, currentBlock, blockVisible, haveSupporters, freezeResize } from '../stores.js'
    import NostrLogin from './NostrLogin.svelte';
  
  let searchTabComponent
  
  let blockHidden = false
  $: blockHidden = ($currentBlock && !$blockVisible)
  
  function settings (tab) {
    if ($sidebarToggle) analytics.trackEvent('sidebar', $sidebarToggle, 'close')
    if ($sidebarToggle === tab) {
      sidebarToggle.set(null)
    } else {
      analytics.trackEvent('sidebar', tab, 'open')
      sidebarToggle.set(tab)
    }
  }
  
  function openOverlay (key) {
    $overlay = key
  }
  
  function showBlock () {
    analytics.trackEvent('viz', 'block', 'show')
    $blockVisible = true
  }

  function handleThis() {
    console.log(this)
  }
  </script>
  
  <style type="text/scss">
    .sidebar-left {
      position: fixed;
      top: 20%;
      left: 4%;
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-start;
      align-items: flex-start;
  
      @media (max-width: 480px) and (max-height: 480px) {
        &:not(.frozen) {
          display: none;
        }
      }
    }
  </style>
  
  <div class="sidebar-left" class:frozen={$freezeResize}>
    <!-- displayed in reverse order, to preserve proper z-index layering -->
      <SidebarTab  on:click={() => handleThis()} tooltip="Show Latest Block">
        <span slot="tab">
          <Icon icon={gridIcon} color="var(--bold-a)" />
        </span>
        <div slot="content">
        </div>
      </SidebarTab> 
    <SidebarTab on:click={() => handleThis()} tooltip="About">
      <span slot="tab">
        <Icon icon={questionIcon} color="var(--bold-a)" />
      </span>
    </SidebarTab>
    <SidebarTab open={$sidebarToggle === ''} on:click={() => handleThis()} tooltip="Contact">
      <span slot="tab">
        <Icon icon={atIcon} color="var(--bold-a)" />
      </span>
      <div slot="content">
      </div>
    </SidebarTab>
    <SidebarTab open={$sidebarToggle === ''} on:click={() => handleThis()} tooltip="Key">
      <span slot="tab">
        <Icon icon={infoIcon} color="var(--bold-a)" />
      </span>
      <div slot="content">
      </div>
    </SidebarTab>
    <SidebarTab open={$sidebarToggle === ''} on:click={() => handleThis()} tooltip="Search & Highlight" bind:this={searchTabComponent}>
      <span slot="tab" title="Search & Highlight">
        <Icon icon={bookmarkIcon} color="var(--bold-a)" />
      </span>
      <div slot="content">
      </div>
    </SidebarTab>
    <SidebarTab open={$sidebarToggle === ''} on:click={() => handleThis()} tooltip="Relays">
      <span slot="tab" title="Settings">
        <Icon icon={cogIcon} color="var(--bold-a)" />
      </span>
      <div slot="content">
      </div>
    </SidebarTab>
    <SidebarTab open={$sidebarToggle === ''} on:click={() => handleThis()} tooltip="nostr login">
      <span slot="tab" title="Bitmaps">
        <Icon icon={bitmapIcon} color="var(--bold-a)" />
      </span>
      <div slot="content">
        <NostrLogin />
      </div>
    </SidebarTab>
  
  </div>
  