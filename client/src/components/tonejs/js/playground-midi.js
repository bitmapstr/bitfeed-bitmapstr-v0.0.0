import * as Tone from 'tone'
import { writable } from 'svelte/store';
import {instrument, makeInstrument} from '../js/listenBA'

import {selectedTx} from '../../../stores'

const selectedtx = writable(selectedTx.id)

var vol = new Tone.Volume(-24);
var eq3 = new Tone.EQ3({

	"lowFrequency": 400,
	"highFrequency": 2500
});

const start = -1;
const end = start + 0;

var reverb = new Tone.Reverb({
	"decay": 5,
	"preDelay": 0.01
}).toDestination();
var chorus = new Tone.Chorus(8, 5, 1).toDestination();
var pingpongdelay = new Tone.PingPongDelay({
	"delayTime": "8n",
	"feedback": 0.8,
	"wet": 0.25
}).toDestination();
var tremolo = new Tone.Tremolo();
var vibrato = new Tone.Vibrato({
	"maxDelay": 0.005,
	"frequency": 15,
	"depth": 0.1

}).toDestination();
var phaser = new Tone.Phaser({
	"frequency": 8,
	"octaves": 4,
	"baseFrequency": 1000
}).toDestination();

function selecteffect(effect) {

	var effecttype = document.getElementById("effect").value;


	switch (effecttype) {

		case "reverb":

			effect = reverb;
			break;

		case "chorus":
			effect = chorus;
			break;

		case "pingpongdelay":
			effect = pingpongdelay;
			break;

		case "tremolo":
			effect = tremolo;
			break;

		case "vibrato":
			effect = vibrato;
			break;

		case "phaser":
			effect = phaser;
			break;

	}

	return effect;

}

function getstring(selectedStr) {
	selectedStr = selectedtx
	
}

function slicestrg() {
	
	var m = selectedtx
	var strgslice = m.slice(start, end);
	document.getElementById("stringindex").value = start + "," + end + " slice:" + strgslice;
	return strgslice;

}
function nextslice() {
	var nextstart = start++;
	var nextend = end++;
	var nextindex = slicestrg(nextstart, nextend);
	return nextindex;
}
function prevslice() {
	var prevstart = --start;
	var prevend = --end;
	var previndex = slicestrg(prevstart, prevend);
	return previndex;
}
function wholeslice() {
	var wslice = nextslice();
	start++;
	end++;
	return wslice;

}
function halfslice() {
	var nexthalf = wholeslice();
}

function loopseq() {
	start = 0;
	end = start + 2;
	playseq();
}
function noloopseq() {
	start = 0;
	end = start + 2;
	playallheights();
}

var cliptb = document.getElementById('clipTB');
var t2stb = document.getElementById('t2sbox');
function wholeString() {
	var m = currentstring.value;
	var start = 0;
	var end = 64;
	var strgslice = m.slice(start, end);
	cliptb.value = strgslice;
	cliptb.focus();
	cliptb.select();
}
function halfString() {
	var m = currentstring.value;
	var start = 0;
	var end = 32;
	var strgslice = m.slice(start, end);
	cliptb.value = strgslice;
	cliptb.focus();
	cliptb.select();
}
function quarterString() {
	var m = currentstring.value;
	var start = 0;
	var end = 16;
	var strgslice = m.slice(start, end);
	cliptb.value = strgslice;
	cliptb.focus();
	cliptb.select();
}
function eighthString() {
	var m = currentstring.value;
	var start = 0;
	var end = 8;
	var strgslice = m.slice(start, end);
	cliptb.value = strgslice;
	cliptb.focus();
	cliptb.select();
}

var timeout;
function stoptimeout() {
	clearTimeout(timeout);
}
function playseq() {

	stoptimeout();
	// Delay Time
	// var timeTime = Number(timeMenu.options[timeMenu.selectedIndex].value);
	var bpmTime = Tone.Transport.bpm.value;
	var time = 333 / bpmTime;
	timeout = setTimeout(playseq, time);
	try {
		
		playstr();
		Tone.Transport.start();
		
	}
	catch (err) {
		//bd();
	}
	
	
}
export function playstr(string) {
	makeInstrument(instrument)
	const now = Tone.now();
	console.log("instrument")
	console.log(instrument)
	instrument.triggerAttackRelease(string, now);
	// instrument.triggerRelease(now + 1.5);
	return string;
}
function changeKnobs() {

	// knob control
	var knob = document.getElementById("knob-controls");
	var knobs = knob.getElementsByTagName('webaudio-knob');
	for (var i = 0; i < knobs.length; i++) {

		var knob0 = knobs[0];
		knob0.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			//notation = this.value;
		});

		var knob1 = knobs[1];
		knob1.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			//speedvariable = this.value;
		});
		var knob2 = knobs[2];
		knob2.addEventListener("change", function (e) {

			document.getElementById("consoleTB").value = this.value + " " + this.id;
			//notation = this.value;
		});

		var knob3 = knobs[3];
		knob3.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			//speedvariable = this.value;
		});
	}

}
function changevolume() {
	// Volume Slider[0]
	var audiosliders = document.getElementById("left-panel");
	var sliders = audiosliders.getElementsByTagName('webaudio-slider');

	for (var i = 0; i < sliders.length; i++) {
		var slider = sliders[0];
		slider.addEventListener("change", function (e) {

			document.getElementById("consoleTB").value = this.value + " " + this.id;
			vol.volume.value = this.value;
			instrument.chain(vol, Tone.Master);

			//vol.volume.rampTo(1, 1);
		});
	}

}
function changeEQ() {

	var eqbase = document.getElementById("left-panel");
	var eq = eqbase.getElementsByTagName('webaudio-slider');
	//document.getElementById("consoleTB").value = eq.length;
	for (var i = 0; i < eq.length; i++) {

		var eqlow = eq[3];
		var eqmid = eq[4];
		var eqhigh = eq[5];
		eqlow.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			eq3.low.value = this.value;
			instrument.chain(eq3, Tone.Master);
		});
		eqmid.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			eq3.mid.value = this.value;
			instrument.chain(eq3, Tone.Master);
		});
		eqhigh.addEventListener("change", function (e) {
			document.getElementById("consoleTB").value = this.value + " " + this.id;
			eq3.high.value = this.value;
			instrument.chain(eq3, Tone.Master);
		});


	}

	instrument.chain(eq3, Tone.Master);

}
function changePan() {
	// Pan Slider[6]
	var audiosliders = document.getElementById("left-panel");
	var sliders = audiosliders.getElementsByTagName('webaudio-slider');
	var panVol = new Tone.Panner();
	for (var i = 0; i < sliders.length; i++) {
		var slider = sliders[6];
		slider.addEventListener("change", function (e) {

			document.getElementById("consoleTB").value = this.value + " " + this.id;
			panVol.pan.value = this.value;
			instrument.chain(panVol, vol, Tone.Master);
		});
	}

}
function loopslider(loopstart, loopend) {
	
	var clipliders = document.getElementById("left-panel");
	var sliders = clipliders.getElementsByTagName('webaudio-slider');
	const input = document.getElementById('dataString');
	//var getloopend =  ;
	
	for (var i = 0; i < sliders.length; i++) {
		loopstart = sliders[7];
		loopstart.addEventListener("change", function (e) {

			document.getElementById("consoleTB").value = this.value + " " + this.id;
			selectLoop(this.value, loopend.value);
		});

		loopend = sliders[8];
		loopend.addEventListener("change", function (e) {

			document.getElementById("consoleTB").value = this.value + " " + this.id;
			selectLoop(loopstart.value, this.value);
		});

		
	}
	
}
function selectLoop(loopstart, loopend) {
	const input = document.getElementById('dataString');
	input.focus();
	input.setSelectionRange(loopstart, loopend);
	if (loopstart.value >= loopend.value) {
		loopstart.value = 0;
		loopend.value = 64
		input.focus();
		input.setSelectionRange(loopstart, loopend);
	}
	else {
		//
	}
	
}
function midiSwitches() {
	var midiswitches = document.getElementById("midiswitches");
	var switches = midiswitches.getElementsByTagName("webaudio-switch");
	for (var i = 0; i < switches.length; i++) {
		//var midiswitch = switches[1];
		//midiswitch.addEventListener('click', function (e) {});
		webAudioControlsMidiManager.addMidiListener(function (event) {
			var data = event.data;
			var channel = data[0] & 0xf;
			var controlNumber = data[1];

			console.log("midiswitches() event hook: data:[" + data + "] channel:" + channel + " cN:" + controlNumber);


			// do whatever you want with the event
			// ...
			switch (controlNumber) {
				case 60:
					//padclip();
					console.log("case:60");
					break;

				case 62:
					start = 0;
					end = start + 2;
					halfString();
					playseq();
					break;

				case 64:
					start = 0;
					end = start + 2;
					quarterString();
					playseq();
					break;

				case 65:
					start = 0;
					end = start + 2;
					eighthString();
					playseq();
					break;

				case 81:
					start = 0;
					end = start + 2;
					wholeString();
					playseq();
					break;

				case 83:
					start = 0;
					end = start + 2;
					halfString();
					playseq();
					break;

				case 84:
					start = 0;
					end = start + 2;
					quarterString();
					playseq();
					break;

				case 86:
					start = 0;
					end = start + 2;
					eighthString();
					playseq();
					break;
				case 74:
					start = 0;
					end = start + 2;
					slicestrg();
					playseq();
					break;

				case 76:
					start = 0;
					end = start + 2;
					nextslice();
					playseq();
					break;

				case 77:
					start = 0;
					end = start + 2;
					wholeslice();
					playseq();
					break;

				case 79:
					start = 0;
					end = start + 2;
					halfslice();
					playseq();
					break;

				case 117:
					Tone.Transport.stop();
					stoptimeout();
					break;

				case 118:
					Tone.Transport.start();
					playseq();
					break;
			}

			return switches;
		});

	}
}

function midicanvasSwitches() {
	var clipstart = -1;
	var clipend = 2;

	var midiswitches = document.getElementById("pads-container");
	var switches = midiswitches.getElementsByTagName("webaudio-switch");


	for (var i = 0; i < 1; i++) {
		//var midiswitch = switches[i];
		//midiswitch.addEventListener('click', function (e) {
		//console.log(i);
		//});

		webAudioControlsMidiManager.addMidiListener(function (event) {
			var data = event.data;
			var channel = data[0] & 0xf;
			var controlNumber = data[1];
			console.log("midicanvasSwitches() event hook: data:[" + data + "] channel:" + channel + " cN:" + controlNumber);
			// do whatever you want with the event
			// ...

			var padstart = 0;
			var padend = 2;

			function playcase(s) {
				var clip = switches[i].id;
				s = clip.slice(padstart, padend);


				try {
					console.log("playcase():" + padstart, padend, s);
					instrument.triggerAttackRelease(s, "4n");
				}
				catch (err) {

					//bd();
				}
				if (padend === 6) {
					clearTimeout(padtimeout);
					padstart = 0;
					padend = 2;
				}
				padstart++;
				padend++;
			}




			switch (controlNumber) {

				case 60:
					var sixty = switches[0];
					sixty.setAttribute("midicc", "1." + controlNumber);
					console.log("midicanvasSwitches() " + sixty.id + " " + controlNumber);
					var timeMenu = document.getElementById("time");
					delayTime = Number(timeMenu.options[timeMenu.selectedIndex].value);
					padtimeout = setTimeout(playcase.bind(this), delayTime);



					//try {
					//	console.log("case 60: " + clipstart + ", " + clipend + " " + s + " " );
					//	instrument.triggerAttackRelease(s, "4n");
					//}
					//catch (err) {
					//	//
					//	//this.weight = 0;
					//	bd();
					//}
					//if (s === "") {
					//	clearTimeout(padtimeout);
					//	clipstart = 0;
					//	clipend =  2;
					//}
					//clipstart++;
					//clipend++;
					break;

				case 62:

					var sixty2 = switches[1];
					sixty2.setAttribute("midicc", "1." + controlNumber);
					playcase();
					break;

				case 64:
					var sixty4 = switches[2];
					sixty4.setAttribute("midicc", "1." + controlNumber);
					console.log(sixty4.id);
					break;

				case 65:
					var sixty5 = switches[3];
					sixty5.setAttribute("midicc", "1." + controlNumber);
					console.log(sixty5.id);
					break;
				case 67:
					var sixty7 = switches[4];
					sixty7.setAttribute("midicc", "1." + controlNumber);
					console.log(sixty7.id);
					break;

				case 69:
					var sixty9 = switches[5];
					sixty9.setAttribute("midicc", "1." + controlNumber);
					console.log(sixty9.id);
					break;

				case 71:
					var seventy1 = switches[6];
					seventy1.setAttribute("midicc", "1." + controlNumber);
					console.log(seventy1.id);
					break;

				case 72:
					var seventy2 = switches[7];
					seventy2.setAttribute("midicc", "1." + controlNumber);
					console.log(seventy2.id);
					break;
				case 74:

					break;
				case 76:

					break;
				case 77:

					break;
				case 79:

					break;
				case 81:

					break;

				case 83:

					break;

				case 84:

					break;

				case 86:

					break;

				case 117:
					Tone.Transport.stop();
					stoptimeout();
					break;

				case 118:
					Tone.Transport.start();
					playseq();
					break;
			}

			return controlNumber;
		});

	}
}

function muteaudio() {
	stoptimeout();
	Tone.Transport.stop();
	//if (Tone.Master.mute === false) {
	//	Tone.Master.mute === true;
	//} else {
	//	Tone.Master.mute === false;
	//}


}


function loadplayground() {	
	loadblockinfo();	
	changevolume();
	changePan();
	changeEQ();
	pRecorder();
	loopslider();
	//midiSwitches();
	changeKnobs();	
	//midicanvasSwitches();
	
}


