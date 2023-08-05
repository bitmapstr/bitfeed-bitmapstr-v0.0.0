<script >
import RangeSlider from "./util/RangeSlider.svelte";
import { currentColor1 } from "../stores";


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();
let value = 770;

export function playNote(value) {

oscillator.type = "square";
oscillator.frequency.setValueAtTime(value, audioCtx.currentTime); // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();

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
    <button class="playButton" style="background-color: {$currentColor1}" on:click={playNote(value)} >Play</button>
    <button class="stopButton" style="background-color: {$currentColor1}" on:click={stopPlaying} >Stop</button>
    <br>


    <RangeSlider bind:value={value} on:change={(e) => value = e.detail.value} id="Frequency"  />
        {value}

    <h1>BITCOIN AUDIO</h1>
</div>