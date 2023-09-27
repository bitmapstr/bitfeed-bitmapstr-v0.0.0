<script>
    import "../components/tonejs/js/BA-webaudio-controls";
    import "../components/tonejs/js/playground-midi";
    import "../components/tonejs/js/listenBA";
    import "../components/tonejs/js/playgroundrecorder";
    import RangeSlider from "./util/RangeSlider.svelte";
    import {
        currentColor1,
        currentColor2,
        currentHeight,
        selectedTx,
        currentBlock,
        detailTx,
        latestBlockHeight,
    } from "../stores";
    let color1 = $currentColor1;
    let color2 = $currentColor2;
    let txdetail = $detailTx;

    export let value = 770;
    export const note = value;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();

    export function playNote(value) {
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(value, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
    }

    function hexSliceToFrequency(hexSlice) {
        const decimalValue = parseInt(hexSlice, 16);
        const minFrequency = 20; // Minimum frequency in Hz
        const maxFrequency = 20000; // Maximum frequency in Hz

        const normalizedValue = decimalValue / 0xffff; // Normalize to [0, 1]
        const mappedFrequency =
            minFrequency + normalizedValue * (maxFrequency - minFrequency);
        // console.log("hexSliceToFrequency")
        // console.log(mappedFrequency)
        return mappedFrequency;
    }

    var start = 0;
    var end = start + 2;
    const m = $detailTx.id;
    function slicestrg() {
        const strgslice = m.slice(start, end);
        document.getElementById("stringindex").value =
            start + "," + end + " slice:" + strgslice;
        console.log("slicestrg()");
        console.log(strgslice);
        return strgslice;
    }
    function nextslice() {
        var nextstart = start++;
        var nextend = nextstart + 2;
        var nextindex = m.slice(nextstart, nextend);
        console.log(nextindex);
        document.getElementById("stringindex").value =
            nextstart + "," + nextend + " slice:" + nextindex;

        return nextindex;
    }
    function prevslice() {
        var prevstart = start--;
        var prevend = prevstart + 2;
        var previndex = m.slice(prevstart, prevend);
        console.log(previndex);
        document.getElementById("stringindex").value =
            prevstart + "," + prevend + " slice:" + previndex;

        return previndex;
    }
    function playTxNote() {
        const strgslice = nextslice();
        const frequency = hexSliceToFrequency(strgslice);

        console.log("frequency");
        console.log(frequency);

        oscillator.type = "sine";
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.frequency.setValueAtTime(frequency + 440, audioCtx.currentTime); // value in hertz
    }
    var timeout;
    function playTx() {
        timeout = setInterval(playTxNote, 750);
    }
    export function stopPlaying() {
        stoptimeout(timeout);
        oscillator.disconnect(audioCtx.destination);
    }

    function stoptimeout() {
        clearTimeout(timeout);
    }
    var cliptb = document.getElementById('clipTB');
    function playselected() {
        var txt = detailTx;

        if (document.getSelection) {
            txt = document.getSelection();
            document.getElementById("clipTB").value = txt;
        }
        playTx();
    }
    function playLoop() {
        try {
            playstr();
        } catch (err) {
            //bd();
        }
        if (n === "") {
        	loopseq();
        }
    }

    function playstr() {
        timeout = setTimeout(playTx, 500);
    }
    function loopseq() {
        start = 0;
        let end = start + 2;
        playLoop();
    }
    function enterHeight(height) {
        searchBlockHeight(height);
        $currentHeight = height;
        console.log("currentHeight");
        console.log($currentHeight);
        VerifyBitmap();
    }

    function wholeString() {
        var m = txdetail.id
        var start = 0;
        var end = 64;
        var strgslice = m.slice(start, end);
        document.getElementById("clipTB").value = strgslice;
        document.getElementById("clipTB").focus();
        document.getElementById("clipTB").select();
    }

    function halfString() {
        var m = txdetail.id
        var start = 0;
        var end = 32;
        var strgslice = m.slice(start, end);
        document.getElementById("clipTB").value = strgslice;
        document.getElementById("clipTB").focus();
        document.getElementById("clipTB").select();
    }
    function quarterString() {
        var m = txdetail.id
        var start = 0;
        var end = 16;
        var strgslice = m.slice(start, end);
        document.getElementById("clipTB").value = strgslice;
        document.getElementById("clipTB").focus();
        document.getElementById("clipTB").select();
    }
    function eighthString() {
        var m = txdetail.id
        var start = 0;
        var end = 8;
        var strgslice = m.slice(start, end);
        document.getElementById("clipTB").value = strgslice;
        document.getElementById("clipTB").focus();
        document.getElementById("clipTB").select();
    }
    
</script>
<div id="audio-wrapper">
    <h3 style="text-align: left;">BEATFEED by Bitcoin Audio</h3>
<div
    id="blockinfogroup"
    class="blockinfogroup"
    style="font-family: 'Orbitron', sans-serif;"
>
    <label id="blocksTBLabel" for="blocksTB">Latest Block : </label>
    <input
        id="blocksTB"
        class="TB"
        type="text"
        name="blocksTB"
        value={$latestBlockHeight}
    />

    <label id="searchLabel" for="searchTB">Now Playing: </label>
    <input
        type="text"
        id="searchTB"
        class="TB"
        value={txdetail.block.height}
        autocomplete="off"
        placeholder="ENTER BLOCK HEIGHT"
    />

    <input
        type="text"
        id="dataString"
        class="TB"
        name="dataString"
        on:select={playselected}
        value={"TxID : " + txdetail.id}
    />
    <input
        type="text"
        id="dataString2"
        class="TB"
        name="dataString"
        value={txdetail.value}
    />

    <input type="text"
        id="clipTB"
        class="TB"
        name="clipTB"
        value=""
        on:select={playLoop}
    />

    <input type="text" id="consoleTB" class="TB" name="consoleTB" value="" />
</div>

<div>
   

    <!-- <RangeSlider bind:value={value} on:change={playNote(value)} id="Frequency" trackColor={$currentColor2}/>
        {value} -->

    <div id="player">
        <span>
            <p class="inline-label">Loop Start</p>
            <webaudio-slider id="loopstart"
                style="position: relative"
                src="../images/slice-slider.svg"
                knobsrc="../images/slice-slider-knob.svg"
                direction="horz"
                value="0"
                min="0"
                max="64"
                step="1"
                units="%"
                tooltip="Loop Start"
                midicc="0.25"
                midilearn="1"
                on:change={playNote(value)}
            />
            <webaudio-param link="loopstart" />
        </span>
        <span>
        <br />
        <p class="inline-label">Scrub</p>
        <webaudio-slider
            id="looplink"
            style="position: relative"
            src="../images/slice-slider.svg"
            knobsrc="../images/slice-slider-knob.svg"
            direction="horz"
            value="0"
            min="0"
            max="64"
            step="1"
            tooltip="Scrub"
            midicc="0.25"
            midilearn="1"
        />
    </span>
        <br />
        <span>
            <p class="inline-label">Loop End</p>
            <webaudio-slider
                id="loopend"
                style="position: relative"
                src="../images/slice-slider.svg"
                knobsrc="../images/slice-slider-knob.svg"
                direction="horz"
                value="64"
                min="0"
                max="64"
                step="1"
                units="%"
                tooltip="Loop End"
                midicc="0.25"
                midilearn="1"
            />
            <webaudio-param link="loopend" />
        </span>
        <div id="sliceinfo">
            <input
                id="stringindex"
                type="text"
                class="TB text-center"
                name="stringindex"
            />
        </div>
        <div id="notebuttons" class="notebuttons">
            <button
                id="wholeswitch"
                value="wholeswitch"
                on:click={wholeString}
            />
            <button id="halfswitch" value="halfswitch" on:click={halfString} />
            <button
                id="quarterswitch"
                value="quarterswitch"
                on:click={quarterString}
            />
            <button
                id="eighthswitch"
                value="eighthswitch"
                on:click={eighthString}
            />
            <div id="midiswitches" class="midiswitches">
                <!--<webaudio-switch id="wholeswitchmidi" src="../images/notes/wholeBtn.svg" width="80" height="25" type="kick" midicc="2.81" midilearn="1"></webaudio-switch>
                                          <webaudio-switch id="halfswitchmidi" src="../images/notes/halfBtn.svg"  width="80" height="25";  type="kick"  midicc="2.83" midilearn="1" ></webaudio-switch>
                            <webaudio-switch id="quarterswitchmidi" src="../images/notes/quarterBtn.svg"  width="80" height="25";  type="kick"  midicc="2.84" midilearn="1" ></webaudio-switch>
                            <webaudio-switch id="eighthswitchmidi" src="../images/notes/eighthBtn.svg"  width="80" height="25";  type="kick"  midicc="2.86" midilearn="1" ></webaudio-switch>-->
            </div>
        </div>
        <div id="transporter">
            <button id="prevslicebutton" class="" on:click={prevslice} />
            <button id="playtoneseq" class="" on:click={playTx} />
            <button id="playallheights" class="" onclick="playallBPM()" />
            <button id="muteBTN" class="" on:click={stopPlaying} />
            <button id="record" class="" />
            <button id="cancel" class="" hidden="true" />
            <button id="clickthrubutton" class="" on:click={nextslice} />
        </div>
    </div>
    <br />
    <div id="slider-controls" class="slider-controls">
        <div id="sliders">
            <div id="panSlider">
                <p class="inline-label">Pan</p>
                <webaudio-slider id="pan"
                    src="../images/slice-slider.svg"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="horz"
                    value="0"
                    min="-1"
                    max="1"
                    step=".1"
                    units="%"
                    tooltip="Pan"
                    midicc="0.24"
                    midilearn="1"><br /></webaudio-slider
                >
                <webaudio-param link="pan" />
            </div>
    
            <p id="vert-label" class="vert-label">Volume</p>
            <span>
                <webaudio-slider id="vol"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="-18"
                    min="-60"
                    max="40"
                    step=".5"
                    tooltip="volume"
                    midicc="0.12"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="vol" />
            </span>
            <p id="vert-label" class="vert-label">Effect</p>
            <span>
                <webaudio-slider id="slider-effect"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="0"
                    min="-80"
                    max="6"
                    midicc="0.13"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="slider2" />
            </span>
            <p id="vert-label" class="vert-label">slider2</p>
            <span>
                <webaudio-slider id="slider2"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="0"
                    min="-80"
                    max="6"
                    midicc="0.14"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="slider2" />
            </span>
            <p id="vert-label" class="vert-label">Equalizer</p>
            <span>
                <webaudio-slider id="slider3"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="0"
                    min="-80"
                    max="6"
                    midicc="0.15"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="slider3" />
            </span>
            <span>
                <webaudio-slider id="slider4"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="0"
                    min="-80"
                    max="6"
                    midicc="0.16"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="slider4" />
            </span>
            <span>
                <webaudio-slider id="slider5"
                    src="../images/vsliderbody.png"
                    knobsrc="../images/slice-slider-knob.svg"
                    direction="vert"
                    value="0"
                    min="-80"
                    max="6"
                    midicc="0.17"
                    midilearn="1"
                />
                <br />
                <webaudio-param link="slider5" />
            </span>
        
        
            <div id="Names" class="Names">
                <select class="dropdown"></select>
            </div>
            <div id="Preset" class="Preset">
                <select class="dropdown"></select>
            </div>
            <div class="effect">
                <select name="effect" id="effect" class="dropdown" onchange="changeeffect()">
                    <option value="">Effect</option>
                    <option value="reverb">Reverb</option>
                    <option value="chorus">Chorus</option>
                    <option value="pingpongdelay">PingPongDelay </option>
                    <option value="tremolo">Tremolo</option>
                    <option value="vibrato">Vibrato</option>
                    <option value="phaser">Phaser</option>
                </select>
            </div>


    </div>

    </div>
</div>
</div>
<style>
    .playButton {
        background-color: var(--palette-good);
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }
    .stopButton {
        background-color: var(--palette-good);
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }
    .primary {
        color: orange;
    }
    .dropdown {
      position: relative;
      
    }
    .dropdown button {
      background-color: var(--palette-good);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
</style>
