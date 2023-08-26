
<script >
    import '../components/tonejs/js/BA-webaudio-controls'
    import '../components/tonejs/js/playground-midi'
    import '../components/tonejs/js/listenBA'
    import '../components/tonejs/js/playgroundrecorder'
import RangeSlider from "./util/RangeSlider.svelte";
import { currentColor1, currentColor2, currentHeight, selectedTx, currentBlock, detailTx } from "../stores";
let color1 = $currentColor1
let color2 = $currentColor2

export let value = 770;
export const note = value;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();

const hexString = "7717194d20d5d311502d100d16292219c284d3a58d2b679d151c9d79f45942d7";
const sliceLength = 2;
const slices = [];

export function playNote(value) {

oscillator.type = "square";
oscillator.frequency.setValueAtTime(value, audioCtx.currentTime); // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();
}

function hexSliceToFrequency(hexSlice) {
    const decimalValue = parseInt(hexSlice, 16);
    const minFrequency = 20;  // Minimum frequency in Hz
    const maxFrequency = 20000;  // Maximum frequency in Hz

    const normalizedValue = decimalValue / 0xFFFF; // Normalize to [0, 1]
    const mappedFrequency = minFrequency + normalizedValue * (maxFrequency - minFrequency);
    // console.log("hexSliceToFrequency")
    // console.log(mappedFrequency)
    return mappedFrequency;
}

var start = 0;
var end = start + 2;
const m = $detailTx.id
function slicestrg() {
	
	const strgslice = m.slice(start, end);
	document.getElementById("stringindex").value = start + "," + end + " slice:" + strgslice;
    console.log("slicestrg()")
    console.log(strgslice)
	return strgslice;

}
function nextslice() {
	var nextstart = start++;
	var nextend = nextstart + 2
	var nextindex = m.slice(nextstart, nextend);
    console.log(nextindex)
    document.getElementById("stringindex").value = nextstart + "," + nextend + " slice:" + nextindex;

	return nextindex;
}
function prevslice() {
	var prevstart = start-- ;
	var prevend = prevstart + 2 
	var previndex = m.slice(prevstart, prevend);
    console.log(previndex)
    document.getElementById("stringindex").value = prevstart + "," + prevend + " slice:" + previndex;

	return previndex;
}
function playTxNote() {
    
    const strgslice = nextslice()
    const frequency = hexSliceToFrequency(strgslice);

    console.log("frequency")
    console.log(frequency)

    oscillator.type = "sine";
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz
   
}
var timeout;
function playTx() {
   timeout = setInterval(playTxNote, 750);

}
export function stopPlaying() {
    stoptimeout(timeout)
    oscillator.disconnect(audioCtx.destination)
}

function stoptimeout() {
	clearTimeout(timeout);
}
function playselected() {

	var txt = "";

	if (document.getSelection) {
		txt = document.getSelection();
		document.getElementById("clipTB").value = txt;

	}
	//cliptb.blur();
	//document.getElementById("body").focus();
	playTx();
}
function playseq() {
	
	try {

		playstr();		
		
	}
	catch (err) {
		//bd();
	}
	// if (n === "") {
	// 	loopseq();
	// }
	
}

function playstr() {



    timeout = setTimeout(playTx, 500);


}
function loopseq() {
	// start = 0;
	// let end = start + 2;
	playseq();
}
function enterHeight(height) {
        searchBlockHeight(height);
        $currentHeight = height
        console.log("currentHeight");
        console.log($currentHeight)
        VerifyBitmap()
    }

    

</script>

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

</style>

<div id="blockinfogroup" class="blockinfogroup" style="font-family: 'Orbitron', sans-serif;">
    <label id="blocksTBLabel" for="blocksTB">Txinfo: </label>
    <input id="blocksTB" class="TB" type="text" name="blocksTB" >

    <label id="searchLabel" for="searchTB">Now Playing: </label>
    <input type="text" id="searchTB" class="TB" value={$currentHeight} autocomplete="off" placeholder="ENTER BLOCK HEIGHT">
    <input type="text" id="dataString" class="TB" name="dataString" on:select={playselected}  value={$detailTx.id}/>
    <input type="text" id="dataString2" class="TB" name="dataString" on:select={playselected}  value={$detailTx.value}/>

    <input type="text" id="clipTB" class="TB" name="clipTB" value="" onselect="playseq()" />

    <input type="text" id="consoleTB" class="TB" name="consoleTB" value="" />


</div>

<div>
    <!-- <button class="playButton" style="background-color: {$currentColor2}" on:click={playTx} >Play</button>
    <button class="stopButton" style="background-color: {$currentColor2}" on:click={stopPlaying} >Stop</button>
    <br/>
    <br/> -->

    <!-- <RangeSlider bind:value={value} on:change={playNote(value)} id="Frequency" trackColor={$currentColor2}/>
        {value} -->



    <div id="player" >
                    
                    <span>
                        <p class="inline-label">Loop Start</p>
                        <webaudio-slider id="loopstart" style="position: relative" src="../images/slice-slider.svg" knobsrc="../images/slice-slider-knob.svg" direction="horz" value="0" min="0" max="64" step="1" units="%" tooltip="Loop Start" midicc="0.25" midilearn="1"></webaudio-slider>
                        <webaudio-param link="loopstart"></webaudio-param>
                    </span>
                    <br />
                    <webaudio-slider id="looplink" style="position: relative" src="../images/slice-slider.svg" knobsrc="../images/slice-slider-knob.svg" direction="horz" value="0" min="0" max="64" step="1" tooltip="Loop Link" midicc="0.25" midilearn="1"></webaudio-slider>

                    <br />
                    <span>
                        <p class="inline-label">Loop  End</p>
                        <webaudio-slider id="loopend" style="position: relative" src="../images/slice-slider.svg" knobsrc="../images/slice-slider-knob.svg" direction="horz" value="64" min="0" max="64" step="1" units="%" tooltip="Loop End" midicc="0.25" midilearn="1"></webaudio-slider>
                        <webaudio-param link="loopend"></webaudio-param>
                    </span>
                    <div id="sliceinfo">
                        <input id="stringindex" type="text" class="TB text-center" name="stringindex" />
                    </div>
                    <div id="notebuttons" class="notebuttons">
                        <button id="wholeswitch" value="wholeswitch" onclick="wholeString()"></button>
                        <button id="halfswitch" value="halfswitch" onclick="halfString()"></button>
                        <button id="quarterswitch" value="quarterswitch" onclick="quarterString()"></button>
                        <button id="eighthswitch" value="eighthswitch" onclick="eighthString()"></button>
                        <div id="midiswitches" class="midiswitches">
                            <!--<webaudio-switch id="wholeswitchmidi" src="../images/notes/wholeBtn.svg" width="80" height="25" type="kick" midicc="2.81" midilearn="1"></webaudio-switch>
                                          <webaudio-switch id="halfswitchmidi" src="../images/notes/halfBtn.svg"  width="80" height="25";  type="kick"  midicc="2.83" midilearn="1" ></webaudio-switch>
                            <webaudio-switch id="quarterswitchmidi" src="../images/notes/quarterBtn.svg"  width="80" height="25";  type="kick"  midicc="2.84" midilearn="1" ></webaudio-switch>
                            <webaudio-switch id="eighthswitchmidi" src="../images/notes/eighthBtn.svg"  width="80" height="25";  type="kick"  midicc="2.86" midilearn="1" ></webaudio-switch>-->
                        </div>
                    </div>
                    <div id="transporter">
                        <button id="prevslicebutton" class="" on:click={prevslice} />
                        <button id="playtoneseq" class="" on:click={playTx}></button>
                        <button id="playallheights" class="" onclick="playallBPM()"></button>
                        <button id="muteBTN" class="" on:click={stopPlaying}></button>
                        <button id="record" class=""></button>
                        <button id="cancel" class="" hidden="true"></button>
                        <button id="clickthrubutton" class="" on:click={nextslice} />
                    </div>

                </div>
                <br />
                <div id="slider-controls" class="slider-controls">
                    <div id="sliders">
                        <p id="vert-label" class="vert-label">Volume</p>
                        <span>
                            <webaudio-slider id="vol" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="-18" min="-60" max="40" step=".5" tooltip="volume" midicc="0.12" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="vol"></webaudio-param>
                        </span>
                        <span>
                            <webaudio-slider id="slider1" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="0" min="-80" max="6" midicc="0.13" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="slider1"></webaudio-param>
                        </span>
                        <span>
                            <webaudio-slider id="slider2" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="0" min="-80" max="6" midicc="0.14" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="slider2"></webaudio-param>
                        </span>
                        <p id="vert-label" class="vert-label">Equalizer</p>
                        <span>
                            <webaudio-slider id="slider3" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="0" min="-80" max="6" midicc="0.15" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="slider3"></webaudio-param>
                        </span>
                        <span>
                            <webaudio-slider id="slider4" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="0" min="-80" max="6" midicc="0.16" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="slider4"></webaudio-param>
                        </span>
                        <span>
                            <webaudio-slider id="slider5" src="../images/vsliderbody.png" knobsrc="../images/slice-slider-knob.svg" direction="vert" value="0" min="-80" max="6" midicc="0.17" midilearn="1"></webaudio-slider>
                            <br />
                            <webaudio-param link="slider5"></webaudio-param>
                        </span>
                        
                  
                    </div>
                    <span>
                        <p class="inline-label">Pan</p>
                        <webaudio-slider id="pan" src="../images/slice-slider.svg" knobsrc="../images/slice-slider-knob.svg" direction="horz" value="0" min="-1" max="1" step=".1" units="%" tooltip="Pan" midicc="0.24" midilearn="1"><br /></webaudio-slider>
                        <webaudio-param link="pan"></webaudio-param>
                    </span>
                  </div>
                  

</div>

