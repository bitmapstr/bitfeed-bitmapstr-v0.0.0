<script>
    import {
        settings,
        overlay,
        serverConnected,
        serverDelay,
        txCount,
        mempoolCount,
        mempoolScreenHeight,
        blockVisible,
        tinyScreen,
        compactScreen,
        currentBlock,
        latestBlockHeight,
        selectedTx,
        blockAreaSize,
        devEvents,
        devSettings,
        pageWidth,
        pageHeight,
        loading,
        freezeResize,
    } from "../stores.js";
    import SearchBar from "../components/SearchBar.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import LoadingAnimation from "../components/util/LoadingAnimation.svelte";
    import Alerts from "../components/alert/Alerts.svelte";
    import { numberFormat } from "../utils/format.js";
    import {
        exchangeRates,
        lastBlockId,
        haveSupporters,
        sidebarToggle,
    } from "../stores.js";
    import { fade, slide } from "svelte/transition";
    import config from "../config.js";
    import TxRender2 from "./TxRender2.svelte";
    import NavBar from "./NavBar.svelte";
    import getAllInscriptions from './Indexer-Local.svelte'
    import {
        Button,
        Card,
        CardActions,
        CardSubtitle,
        CardText,
        CardTitle,
        Divider,
        Icon,
        Container,
        Row,
        Col,
        MaterialApp,
    } from "svelte-materialify";
    import { mdiChevronDown } from "@mdi/js";
    import TxController from "../controllers/TxController.js";

    let active = false;
    function toggle() {
        active = !active;
    }
</script>

<div class="canvas-wrapper">
        <img src="/img/bg-logo-w-text.svg" alt="" class="bg-logo-w-text" />
        <TxRender2 controller={TxController} />
                <Container>
                    <Row>
                        <Card style="max-width:400px;">
                            <!-- <img src="/img/bg-logo-w-text.svg" alt="" class="bg-logo-w-text"> -->
                            <CardTitle></CardTitle>
                            <CardSubtitle></CardSubtitle>
                            <CardText><h5>Inscription</h5></CardText>
                            <CardActions>
                                <Button text>Button</Button>
                                <Button
                                    text
                                    fab
                                    size="small"
                                    class="ml-auto"
                                    on:click={toggle}
                                >
                                    <Icon
                                        path={mdiChevronDown}
                                        rotate={active ? 180 : 0}
                                    />
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
</div>
