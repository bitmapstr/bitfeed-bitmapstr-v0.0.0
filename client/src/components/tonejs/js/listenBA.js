import * as Tone from 'tone'
// *  PRESET CHOOSING
 
function chooseRandomInstrument(){
	var keys = Object.keys(PresetList);
	var randomInst = keys[Math.floor(Math.random() * keys.length)];
	console.log(randomInst)
	return randomInst;
}

function chooseRandomPreset(instrument){
	var keys = PresetList[instrument];
	var randomInst = keys[Math.floor(Math.random() * keys.length)];
	console.log(randomInst)
	return randomInst;	
}

function loadPreset(inst, preset){
	var xhr = new XMLHttpRequest();
	var url = "./instrument/" + inst + "/" + preset;
	console.log("loadPreset")
	console.log(url)
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			codemirror.setValue(xhr.responseText);
			setCurrentPreset(xhr.responseText);
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
	document.querySelector("#Names select").value = inst;
	document.querySelector("#Preset select").value = preset;
	
}

// Load song

/*function loadSong(song) {
	var xhr = new XMLHttpRequest;
	var url = "./songs/" + song;

	xhr.onreadystatechange = function () {

	};

}
*/
function setCurrentPreset(preset) {

	try {
		instrument.set(JSON.parse(preset));
	} catch(e){
		// indicate the error
		codemirror.getWrapperElement().classList.add("Error");
		document.querySelector("#ErrorText").textContent = e.message;
	}
}

/**
 *  EVENTS
 */
function setupEvents(){
	//var listenButton = document.querySelector("button");
	var listenButton = document.getElementById("update");
	listenButton.addEventListener("click", function(e){
		//get and apply the preset
		setCurrentPreset(codemirror.getValue());
	}, true);
}

/**
 *  Tone.js
 */
export var instrument;

export function makeInstrument(inst){
	if (instrument){
		instrument.dispose();
	}
	// instrument =  new Tone[inst]().toDestination();
	instrument =  new Tone.Synth().toDestination();

	
}
//bind the interface
//document.querySelector("tone-meter").bind(instrument);

//var keyboard = new AudioKeys({
//	polyphony: 1,
//	rows: 1,
//	priority: "last"
//});


//keyboard.down(function (note) {
//	if (instrument.toString() === "NoiseSynth") {
//		instrument.triggerAttack();
//	} else {
//		instrument.triggerAttack(note.frequency);
//	}
//});

//keyboard.up(function (note) {
//    instrument.triggerRelease();
//});

/**
 *  Dropdown
 */
function makeInstrumentDropDown(){
	var keys = Object.keys(PresetList);
	var container = document.querySelector("#Names select");
	for (var i = 0; i < keys.length; i++){
		var option = document.createElement("option");
		container.appendChild(option);
		option.value = keys[i];
		option.textContent = keys[i];
	}
}

function makePresetDropDown(instrument){
	var presets = PresetList[instrument];
	var container = document.querySelector("#Preset select");
	//clear the previous one
	container.innerHTML = "";
	for (var i = 0; i < presets.length; i++){
		var option = document.createElement("option");
		container.appendChild(option);
		var file = presets[i];
		option.value = file;
		option.textContent = file.substring(0, file.length - 5);
	}

	var randomPreset = chooseRandomPreset(instrument);
	container.value = randomPreset;
	loadPreset(instrument, randomPreset);
}

function dropDownEvents(){
	var instruments = document.querySelector("#Names select");

	instruments.addEventListener("input", function (e) {
		// recording breaks here
		makeInstrument(instruments.value);
		makePresetDropDown(instruments.value);

	}, true);

	var presets = document.querySelector("#Preset select");

	presets.addEventListener("input", function (e) {
		// recording breaks here
		makeInstrument(instruments.value);
		loadPreset(instruments.value, presets.value);

	}, true);

	
}

/**
 *  EDITOR
 */

var codemirror;

//document loaded
document.addEventListener("DOMContentLoaded", function(event) {
	//choose a random instrument and preset
	var randomInst = chooseRandomInstrument();
	//var randomInst = "MembraneSynth";
	makeInstrument(randomInst);

	//loadPreset(randomInst, randomPreset);
	//setup the events
	setupEvents();
	codemirror = new CodeMirror(document.querySelector("#JSON"), {
		mode : {name: "javascript", json: true}
	});

	codemirror.addKeyMap({
		"Cmd-Enter": function(){
			setCurrentPreset(codemirror.getValue());
			document.querySelector("button").focus();
		}
	});

	codemirror.on("keydown", function(c, e){
		codemirror.getWrapperElement().classList.remove("Error");
		document.querySelector("#ErrorText").textContent = "";
		e.stopPropagation();
	});
	codemirror.on("keyup", function(c, e){
		e.stopPropagation();
	});

	//make the drop downs
	makeInstrumentDropDown();
	makePresetDropDown(randomInst);
	dropDownEvents();

	
});
