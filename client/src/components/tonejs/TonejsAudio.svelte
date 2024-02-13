<script lang="ts">
import * as Tone from 'tone'
import { currentColor1,currentColor2, selectedTx } from '../../stores';
import {playstr} from './js/playground-midi'


function playTone() {

    playstr(selectedTx)


//create a synth and connect it to the main output (your speakers)
// const synth = new Tone.Synth().toDestination();
// //play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");
//     Tone.Transport.start();
}

function stopTone() {
    Tone.disconnect
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

    <button class="playButton" style="background-color: {$currentColor2}" on:click={playTone} >playTone</button>
    <button class="stopButton" style="background-color: {$currentColor2}" on:click={stopTone} >stopTone</button>


</div>