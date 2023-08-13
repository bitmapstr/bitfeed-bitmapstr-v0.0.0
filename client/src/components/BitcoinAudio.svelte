<script >
import RangeSlider from "./util/RangeSlider.svelte";
import { currentColor1, currentColor2, selectedTx } from "../stores";
    import TonejsAudio from "./tonejs/TonejsAudio.svelte";

export let value = 770;
export const note = value

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();

const hexString = $selectedTx.id;
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
    console.log("hexSliceToFrequency")
    console.log(mappedFrequency)
    return mappedFrequency;
}

function playTx() {
    oscillator.type = "square";
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    for (let i = 0; i < hexString.length; i += sliceLength) {
        
        slices.push(hexString.slice(i, i + sliceLength));
        // Converting and logging each slice to frequency
        slices.forEach((slice, index) => {
            const frequency = hexSliceToFrequency(slice);
            // oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz
            console.log(`Frequency for Slice ${index + 1}: ${frequency} Hz`); 
            
        });
    }
}


export function stopPlaying() {
    oscillator.disconnect(audioCtx.destination)
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

<div>
    <button class="playButton" style="background-color: {$currentColor2}" on:click={playTx} >Play</button>
    <button class="stopButton" style="background-color: {$currentColor2}" on:click={stopPlaying} >Stop</button>
    <br/>
    <br/>

    <RangeSlider bind:value={value} on:change={playNote(value)} id="Frequency" trackColor={$currentColor2}/>
        {value}

</div>
<div>
    <TonejsAudio />
</div>