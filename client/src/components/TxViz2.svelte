<script>
  import { onMount } from 'svelte'
  import TxController from '../controllers/TxController.js'
  import TxRender from './TxRender.svelte'
  import getTxStream from '../controllers/TxStream.js'
  import { settings, overlay, serverConnected, serverDelay, txCount, mempoolCount,
           mempoolScreenHeight, blockVisible, tinyScreen,
           compactScreen, currentBlock, latestBlockHeight, selectedTx, blockAreaSize,
           devEvents, devSettings, pageWidth, pageHeight, loading, freezeResize, currentColor1, settingsBitmap, verifiedBitmapstr, isBitmapOwner } from '../stores.js'
  import BlockInfo from '../components/BlockInfo.svelte'
  import SearchBar from '../components/SearchBar.svelte'
  import Sidebar from '../components/Sidebar.svelte'
  import Sidebarleft from '../components/SidebarLeft.svelte'
  import LoadingAnimation from '../components/util/LoadingAnimation.svelte'
  import Alerts from '../components/alert/Alerts.svelte'
  import { numberFormat } from '../utils/format.js'
  import { exchangeRates, lastBlockId, haveSupporters, sidebarToggle } from '../stores.js'
  import { formatCurrency } from '../utils/fx.js'
  import { fade } from 'svelte/transition'
  import config from '../config.js'
    import BlockInfo2 from './BlockInfo2.svelte';
    import TxAudio from './TxAudio.svelte';
    import TxRender2 from './TxRender2.svelte';
    import TransactionOverlayAudio from './TransactionOverlayAudio.svelte';
    import TransactionOverlay from './TransactionOverlay.svelte';

    import NavBar from './NavBar.svelte';
    import Cube from './Cube.svelte';

  let initCanvas
  let width = window.innerWidth - 20
  let height = window.innerHeight - 20
  let txController
  let blockCount = 0
  let running = false

  let lastFrameUpdate = 0

  let txStream
  if (!config.noTxFeed || !config.noBlockFeed) txStream = getTxStream()

  $: {
    if ($blockVisible) {
      if (txController) txController.showBlock()
    } else {
      if (txController) txController.hideBlock()
    }
  }

  let modeLoaded = false
  let currentMode
  $: {
    if ($settings && currentMode != $settings.vbytes) {
      if (!modeLoaded) modeLoaded = true
      else changedMode($settings.vbytes)
      currentMode = $settings.vbytes
    }
  }

  let canvasWidth = '100%'
  let canvasHeight = '100%'
  // console.log("currentcolor1")
  // console.log($currentColor1)
  $: color1 = $currentColor1
  $: {
    if ($freezeResize) {
      canvasWidth = `${window.innerWidth}px`
      canvasHeight = `${window.innerHeight}px`
    } else {
      canvasWidth = '100%'
      canvasHeight = '100%'
      resize()
    }
  }

  onMount(() => {
    txController = new TxController({ width, height })

    if (!config.noTxFeed) {
      txStream.subscribe('tx', tx => {
        txController.addTx(tx)
      })
      txStream.subscribe('drop_tx', txid => {
        txController.dropTx(txid)
      })
    }
    if (!config.noBlockFeed) {
      txStream.subscribe('block', ({block, realtime}) => {
        if (block) {
          const added = txController.addBlock(block, realtime)
          if (added && added.id) $lastBlockId = added.id
        }
      })
    }
    if (!config.noTxFeed || !config.noBlockFeed) {
      txStream.subscribe('mempool_count', count => {
        $mempoolCount = count
      })
    }

    $devEvents.addOneCallback = fakeTx
    $devEvents.addManyCallback = fakeTxs
    $devEvents.addBlockCallback = fakeBlock
  })

  function resize () {
    $pageWidth = window.innerWidth
    $pageHeight = window.innerHeight
    if ((width !== window.innerWidth - 20 || height !== window.innerHeight - 20) && !$freezeResize) {
      // don't force resize unless the viewport has actually changed
      width = window.innerWidth - 20
      height = window.innerHeight - 20
      txController.resize({
        width,
        height
      })
    }
  }

  function changedMode () {
    if (txController) {
      txController.redoLayout({
        width,
        height
      })
    }
  }

  function hideBlock () {
    $blockVisible = false
  }

  function quitExploring () {
    if (txController) txController.resumeLatest()
  }

  function fakeBlock () {
    const block = txController.simulateBlock()
    // txController.addBlock(new BitcoinBlock({
    //   version: 'fake',
    //   id: Math.random(),
    //   value: 10000,
    //   prev_block: 'also_fake',
    //   merkle_root: 'merkle',
    //   timestamp: performance.now(),
    //   bits: 'none',
    //   txn_count: 20,
    //   txns: (new Array(100)).fill(0).map((x, i) => {
    //     return {
    //       version: 'fictional',
    //       value: Math.floor(Math.random() * 1000000) + 1,
    //       id: `fake_tx_${i}_${Math.random()}`
    //     }
    //   })
    // }))
  }

  function fakeTx (value) {
    txController.simulateDumpTx(1, value)
  }

  function fakeTxs () {
    txController.simulateDumpTx(200)
  }

  $: connectionColor = ($serverConnected && $serverDelay < 5000) ? ($serverDelay < 500 ? 'good' : 'ok') : 'bad'
  $: connectionTitle = ($serverConnected && $serverDelay < 5000) ? ($serverDelay < 500 ? 'Streaming live transactions' : 'Unstable connection') : 'Disconnected'

  const fxColor = 'good'
  let fxLabel = ''
  $: {
    const rate = $exchangeRates[$settings.currency]
    if (rate && rate.last)
    fxLabel = formatCurrency($settings.currency, rate.last)
  }

	const debounce = v => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			val = v;
		}, 750);
	}

  let mousePosition = { x: 0, y: 0 }
  let audioInfoPosition = {x: 0, y: 0}

  function onClick (e) {
    mousePosition = {
      x: e.clientX,
      y: e.clientY
    }
    const position = {
      x: e.clientX,
      y: window.innerHeight - e.clientY
    }
    if (txController) txController.mouseClick(position)
  }

  function pointerMove (e) {
    if (!txController.selectionLocked) {
      mousePosition = {
        x: e.clientX,
        y: e.clientY
      }
      const position = {
        x: e.clientX,
        y: window.innerHeight - e.clientY
      }
      if (txController) txController.mouseMove(position)
    }
  }

  function pointerLeave (e) {
    const position = {
      x: null,
      y: null
    }
    if (txController) txController.mouseMove(position)
  }

</script>

<style type="text/scss">
  .audio-tx-area {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
    background: var(--palette-a);
    transition: background 500ms;
  }

  .canvas-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .bitmap-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .mempool-height {
    position: absolute;
    bottom: calc(25% + 10px);
    left: 0;
    right: 0;
    margin: auto;
    padding: 0 .5rem;
    transition: bottom 1000ms;

    .mempool-count {
      position: absolute;
      bottom: .5em;
      left: 0.5rem;
      font-size: 0.9rem;
      color: var(--palette-x);
    }

    .mempool-info {
      position: absolute;
      bottom: .5em;
      left: 0.5rem;
      right: 0.5em;
      font-size: 0.9rem;
      color: var(--palette-x);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
    }

    .audio-info {
      position: absolute;
      bottom: .5em;
      left: 0.5rem;
      right: 0.5em;
      font-size: 0.9rem;
      color: var(--palette-x);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
    }

    .height-bar {
      width: 100%;
      height: 1px;
      border-bottom: dashed 2px var(--palette-x);
      opacity: 0.75;
    }
  }

  .mempool-size-label {
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 20px;
    font-family: monospace;
    font-weight: bold;
    color: var(--palette-x);
    transition: color 500ms;
  }

  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    .status, .spacer {
      width: 6.25rem;
    }

    .status {
      text-align: left;
      padding: 1rem;
      width: 20em;
      min-width: 7.5em;
      flex-shrink: 3;
      box-sizing: border-box;

      .row {
        margin-bottom: 5px;
      }

      .status-light {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 5px;

        &.bad {
          background: var(--palette-bad);
        }
        &.ok {
          background: var(--palette-ok);
        }
        &.good {
          background: var(--palette-good);
        }
      }

      .audioOn-light {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 5px;

        &.bad {
          background: var(--palette-bad);
        }
        &.ok {
          background: var(--palette-ok);
        }
        &.good {
          background: var(--palette-good);
        }
      }


      .stat-counter, .fx-ticker {
        white-space: nowrap;
        cursor: pointer;

        &.bad {
          color: var(--palette-bad);
        }
        &.ok {
          color: var(--palette-ok);
        }
        &.good {
          color: var(--palette-good);
        }
      }

      .block-height {
        margin-bottom: 5px;
        color: white;
      }

      &.tiny {
        width: 100%;
        .row {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }
  }

  .search-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 3.5em;
    flex-grow: 1;
  }
  .nav-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 3.5em;
    flex-grow: 1;
  }

  .alert-bar-wrapper {
    width: 20em;
    flex-shrink: 0;
  }

  .block-area-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: none;

    .spacer {
      flex: 1;
    }

    .block-area-outer {
      position: relative;
      flex: 0;
      // width: 75vw;
      // max-width: 40vh;
      margin: auto;

      .block-area {
        padding-top: 100%;
      }

      // .bitmapstr-block-area {
      //   padding-top: 100%;
      // }

      .guide-area {
        background: #00FF00;
        opacity: 25%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
  }

  .guide-overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    pointer-events: none;

    .guide {
      position: absolute;
      background: #00FF00;
    }

    .v-half {
      top: 0;
      bottom: 0;
      left: calc(50% - 1px);
      width: 1px;
      margin: auto;
    }

    .h-half {
      top: calc(50% - 1px);
      left: 0;
      right: 0;
      height: 1px;
      margin: auto;
    }

    .mempool-height {
      bottom: 25%;
      left: 0;
      right: 0;
      height: 1px;
      margin: auto;
    }
  }

  .loading-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .loading-wrapper {
      width: 100px;
    }

    .loading-msg {
      margin: .4em 0 0;
      font-size: 1em;
      font-weight: bold;
      color: white;
      text-shadow: 0 0 10px black;
    }
  }

  .tx-scene2 {
  position: absolute;
  width: auto;
  left: 7px;
  right: 0;
  top: -16px;
  bottom: 0;
  /* pointer-events: none; */
  overflow: hidden;
  z-index: 0;
}

.bitmapstr {
    width: auto;
    position: relative;
    left: 0;
    right: 0;
    top: 145px;
    bottom: 0;
    overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
    z-index: -1;

}

.bitmap-cube {

  position: absolute;
}
.bg-logo-w-text {

    width: 150%;
    height: 150%;
    opacity: 0.3;
    left: -76px;
    top: -16px;
    position: inherit;
    object-fit: contain;
    z-index: inherit;

    // top: 115px;
    // left: 240px;
}

  @media screen and (max-width: 640px) {
    .search-bar-wrapper {
      position: fixed;
      top: 3.5em;
      left: 0;
      right: 0;
    }
  }

  @media screen and (max-width: 480px) {
    .alert-bar-wrapper {
      font-size: 0.8em;
      width: 18em;
    }
  }
</style>

<svelte:window on:resize={resize} on:load={resize} on:click={pointerLeave} />
<!-- <svelte:window on:resize={resize} on:click={pointerMove} /> -->



<div class="audio-tx-area" class:light-mode={!$settings.darkMode} style="background-color: {color1}; width: {canvasWidth}; height: {canvasHeight}">
          
            {#if !$settingsBitmap.showMyBitmap }   
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="canvas-wrapper"  on:pointerleave={pointerLeave} on:pointermove={pointerMove} on:click={onClick} >
              <TxRender controller={txController} />
        
              <div class="mempool-height" style="bottom: calc({$mempoolScreenHeight + 20}px)">
                <div class="height-bar" />
                {#if $tinyScreen}
                  <div class="mempool-info">
                    <span class="left">Mempool</span>
                    <span class="right">{ numberFormat.format(Math.round($mempoolCount)) }</span>
                  </div>
                {:else}
                  <span class="mempool-count">Mempool: { numberFormat.format(Math.round($mempoolCount)) } unconfirmed</span>
                {/if}
              </div>

              <div class="block-area-wrapper">
                <div class="spacer" style="flex: {$pageWidth <= 640 ? '1.5' : '1'}"></div>
                <div class="block-area-outer" style="width: {$blockAreaSize}px; height: {$blockAreaSize}px">
                  <div class="block-area">
                    <BlockInfo block={$currentBlock} visible={$blockVisible && !$tinyScreen} on:hideBlock={hideBlock} on:quitExploring={quitExploring} />
                  </div>
                  {#if config.dev && config.debug && $devSettings.guides }
                    <div class="guide-area" />
                  {/if}
                </div>
                <div class="spacer"></div>
                <div class="spacer"></div>
              </div>
              
            </div>
            {:else if $settingsBitmap.showMyBitmap}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="canvas-wrapper" on:pointerleave={pointerLeave} on:pointermove={pointerMove} on:click={onClick} >
              <TxRender2 bind:initCanvas={initCanvas}  displayHeight={canvasHeight} displayWidth={canvasWidth} controller={txController} />
              
              <div class="block-area-wrapper">
                <div class="spacer" style="flex: {$pageWidth <= 640 ? '1.5' : '1'}"></div>
                <div class="block-area-outer" style="width: {$blockAreaSize}px; height: {$blockAreaSize}px">
                 {#if $settingsBitmap.showBlockInfo }
                 {#if  !$isBitmapOwner }  
                 <img src="/img/bitmapUNVERIFIED.svg" alt="" class="bg-logo-w-text">
                 <!-- <h1>unverified</h1> -->
                 {/if}
                 {#if  $isBitmapOwner }  
                 <img src="/img/bitmapVERIFIED.svg" alt="" class="bg-logo-w-text">
                 <!-- <h1>verified</h1> -->
                 {/if}
                 {/if}
                    
                  <div class="block-area">
                    <BlockInfo2 block={$currentBlock} visible={$blockVisible && !$tinyScreen} on:hideBlock={hideBlock} on:quitExploring={quitExploring} />
                  </div>
                  {#if config.dev && config.debug && $devSettings.guides }
                    <div class="guide-area" />
                  {/if}
                </div>
                <div class="audio-info">
                               </div>
                <div class="spacer"></div>
                <div class="spacer"></div>

              </div>
              
            </div>
            {/if}
                      

  <div class="top-bar">
    <div class="status" class:tiny={$tinyScreen}>
      <div class="row">
        {#if $settings.showFX && fxLabel }
          <span class="fx-ticker {fxColor}"  on:click={() => { $sidebarToggle = 'settings'}}>{ fxLabel }</span>
        {/if}
        {#if $tinyScreen && $currentBlock }
          <span class="block-height"><b></b>{ numberFormat.format($currentBlock.height) }</span>
        {/if}
      </div>
      <div class="row">
        {#if $verifiedBitmapstr && $settingsBitmap.audioOn }
          <div class="audioOn-light {connectionColor}" title={connectionTitle}></div>
          {#if $selectedTx }

          <TxAudio tx={$selectedTx} position={audioInfoPosition} />
         
        {/if}  
        {/if}
      </div>
      <div class="row">
        {#if $settings.showNetworkStatus }
          <div class="status-light {connectionColor}" title={connectionTitle}></div>
        {/if}
      </div>
    </div>
    {#if $settings.showSearch && !$tinyScreen && !$compactScreen }
      <div class="search-bar-wrapper">                         
            <SearchBar />                       
      </div>
    {/if}
   {#if $settingsBitmap.showNav }  
             <NavBar />                        
    {/if} 
    {#if !$tinyScreen}
      <div class="alert-bar-wrapper">
        {#if config.messagesEnabled && $settings.showMessages}
          <Alerts />
        {:else}
          <div class="spacer"></div>
        {/if}
      </div>
    {/if}
  </div>

  <Sidebar />
{#if $settingsBitmap.audioOn}
<TransactionOverlayAudio />
{:else}
  <TransactionOverlay />
{/if}
  {#if $loading}
    <div class="loading-overlay" in:fade={{ delay: 1000, duration: 500 }} out:fade={{ duration: 200 }}>
      <div class="loading-wrapper">
        <LoadingAnimation />
        <p class="loading-msg">loading</p>
      </div>
    </div>
  {/if}

  {#if config.dev && config.debug && $devSettings.guides }
    <div class="guide-overlay">
      <div class="guide v-half" />
      <div class="guide h-half" />
      <div class="guide mempool-height" />
      <div class="area block-area" />
    </div>
  {/if}
</div>
