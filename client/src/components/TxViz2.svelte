<script>
  import { onMount } from 'svelte'
  import TxController from '../controllers/TxController.js'
  // import TxRender from './TxRender.svelte'
  import getTxStream from '../controllers/TxStream.js'
  import { settings, overlay, serverConnected, serverDelay, txCount, mempoolCount,
           mempoolScreenHeight, blockVisible, tinyScreen,
           compactScreen, currentBlock, latestBlockHeight, selectedTx, blockAreaSize,
           devEvents, devSettings, pageWidth, pageHeight, loading, freezeResize } from '../stores.js'
  import BlockInfo from '../components/BlockInfo.svelte'
  import SearchBar from '../components/SearchBar.svelte'
  import TxInfo from '../components/TxInfo.svelte'
  import Sidebar from '../components/Sidebar.svelte'
  import TransactionOverlay from '../components/TransactionOverlay.svelte'
  import AboutOverlay from '../components/AboutOverlay.svelte'
  import LoadingAnimation from '../components/util/LoadingAnimation.svelte'
  import Alerts from '../components/alert/Alerts.svelte'
  import { numberFormat } from '../utils/format.js'
  import { exchangeRates, lastBlockId, haveSupporters, sidebarToggle } from '../stores.js'
  import { formatCurrency } from '../utils/fx.js'
  import { fade, slide } from 'svelte/transition'
  import config from '../config.js'
  import Cube from './Cube.svelte'
  import RunningOsterich from './RunningOsterich.svelte';
  import TxRender2 from './TxRender2.svelte';
  import NavBar from './NavBar.svelte';
  // import getAllInscriptions from './Indexer-Local.svelte'
  import {Button, Card, CardActions, CardSubtitle, CardText, CardTitle, Divider, Icon, Container, Row, Col, MaterialApp} from 'svelte-materialify'
  import {mdiChevronDown} from '@mdi/js'  

  let width = window.innerWidth - 20
  let height = window.innerHeight - 20
  let txController2
  let blockCount = 0
  let running = false

  let lastFrameUpdate = 0

  let txStream
  if (!config.noTxFeed || !config.noBlockFeed) txStream = getTxStream()

  $: {
    if ($blockVisible) {
      if (txController2) txController2.showBlock()
    } else {
      if (txController2) txController2.hideBlock()
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
    txController2 = new TxController({ width, height })

    if (!config.noTxFeed) {
      txStream.subscribe('tx', tx => {
        txController2.addTx(tx)
      })
      txStream.subscribe('drop_tx', txid => {
        txController2.dropTx(txid)
      })
    }
    if (!config.noBlockFeed) {
      txStream.subscribe('block', ({block, realtime}) => {
        if (block) {
          const added = txController2.addBlock(block, realtime)
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
      txController2.resize({
        width,
        height
      })
    }
  }

  function changedMode () {
    if (txController2) {
      txController2.redoLayout({
        width,
        height
      })
    }
  }

  function hideBlock () {
    $blockVisible = false
  }

  function quitExploring () {
    if (txController2) txController2.resumeLatest()
  }

  function fakeBlock () {
    const block = txController2.simulateBlock()
    // txController2.addBlock(new BitcoinBlock({
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
    txController2.simulateDumpTx(1, value)
  }

  function fakeTxs () {
    txController2.simulateDumpTx(200)
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

  function onClick (e) {
    mousePosition = {
      x: e.clientX,
      y: e.clientY
    }
    const position = {
      x: e.clientX,
      y: window.innerHeight - e.clientY
    }
    if (txController2) txController2.mouseClick(position)
  }

  function pointerMove (e) {
    if (!txController2.selectionLocked) {
      mousePosition = {
        x: e.clientX,
        y: e.clientY
      }
      const position = {
        x: e.clientX,
        y: window.innerHeight - e.clientY
      }
      if (txController2) txController2.mouseMove(position)
    }
  }

  function pointerLeave (e) {
    const position = {
      x: null,
      y: null
    }
    if (txController2) txController2.mouseMove(position)
  }


  export async function getAllInscriptions() {
		let insArray = [
    {
        "id": "6dd41aa4d9dae71303c650bc17ac2dedf6ec96b71b334da026439d360b50da67i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "02540a211aeec350fd49df50a688c5067ac03f256bcc4dd717bedee155f7d967i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "191239693e7a7888c1b8d308de17fc3bfb2e69445e209a9056d0e38baf6dd467i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "26133fe210432cadc818bb225a9d4a83e271ae858d5f213dc3c8d5431583c667i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "741c3f451441c126502548ebde6aba42ea5dc47baf7201be2e8899f206f2c567i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "8b6e2039f72e0b4836feaeeab82ac88e28e1f6c0ab818c18d1268d2dbe06c267i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "d893323e4d44a2e5f414bb15c72ab1815a7a291b1ed89513954a77438269bb67i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "56a356e8c546b3c792708afdea8bbd560c258d728bab1ed3f86f46e08c09b867i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "18389026ffb9730064e2ae172582ea67b38a378eb170edf538c5b110a053aa67i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    },
    {
        "id": "9e16cdc0cfb4fb244ba58bc7c1535244d2c3f6bd053da9c8870fb7529173a367i0",
        "genesis_block_height": 799960,
        "timestamp": 1690139846000,
        "ins": "{\"p\":\"brc-20\",\"op\":\"mint\",\"tick\":\"sats\",\"amt\":\"100000000\"}",
        "mime_type": "text/plain"
    }
];
        console.log(insArray)
		return insArray;
	}

  let active = false;
  function toggle() {
    active = !active;
  }

</script>

<style type="text/scss">
  .tx-area {
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

  .tx-scene {
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
    width: 75%;
    height: 75%;
    opacity: 0.3;
    top: 100px;
    left: 160px;
    position: absolute;
    object-fit: contain;
    z-index: inherit;
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

<div class="tx-area" class:light-mode={!$settings.darkMode} style="width: {canvasWidth}; height: {canvasHeight}">
 
            <div class="canvas-wrapper"  on:pointerleave={pointerLeave} on:pointermove={pointerMove} on:click={onClick} >
              {#if $settings.showBlockInfo }  
              <img src="/img/bg-logo-w-text.svg" alt="" class="bg-logo-w-text">
                          <TxRender2 controller={txController2} /> 
                          
                          {:else if !$settings.showblockinfo}
                          {#await getAllInscriptions()}
                          <p>...waiting for my bitmaps</p>
                        {:then data}
                        {#each data as response, index}
                         <!-- {console.log(data[1])} -->
             
                <Container>
                  <Row>
                    <Card style="max-width:400px;">
                      <!-- <img src="/img/bg-logo-w-text.svg" alt="" class="bg-logo-w-text"> -->
                      <CardTitle>{index} - {response.genesis_block_height}</CardTitle>
                      <CardSubtitle> {response.timestamp}</CardSubtitle>
                      <CardText> <h5>Inscription</h5>
                      </CardText>
                      <CardActions>
                        <Button text>Button</Button>
                        <Button text fab size="small" class="ml-auto" on:click={toggle}>
                          <Icon path={mdiChevronDown} rotate={active ? 180 : 0} />
                        </Button>
                      </CardActions>
                      {#if active}
                        <div transition:slide>
                          <Divider />
                          <div class="bitmap-cube">
                            <!-- <Cube /> -->
                          </div>
          
                        </div>
                      {/if}
                        </Card>
                        </Row>
                        </Container>
                            {/each}
                          {/await}
                          
              {/if}


             

  </div>

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
    {#if $settings.showBlockInfo && !$settings.showSearch }  
    <NavBar />              
    <button class="primary" on:click={getAllInscriptions}>getAll</button>
                      
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
  <!-- <TransactionOverlay /> -->
  <!-- <AboutOverlay /> -->

  <!-- {#if config.donationsEnabled }
    <DonationOverlay />
    {#if $haveSupporters}
      <SupportersOverlay />
    {/if}
  {/if} -->

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
