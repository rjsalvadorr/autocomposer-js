window.jQuery = window.$ = require("jquery");
const CalculationExploration = require("./calculations");
var calc = CalculationExploration.CalculationExploration;

const BrowserPlayer = require("./browser-player");
var testPlayer = BrowserPlayer.BrowserPlayer;

const AcMidi = require("../../src/autocomposer-midi");
var player = new AcMidi.AutoComposerMidi();

var debugMessage1 = "Range is from Db4 to G#5\n\nAverage chord tones in that range for:";
debugMessage1 += "\nmajor triads: " + calc.getAverageChordTonesInRange("M");
debugMessage1 += "\nminor triads: " + calc.getAverageChordTonesInRange("m");
debugMessage1 += "\nmaj7 chords: " + calc.getAverageChordTonesInRange("maj7");
debugMessage1 += "\nm7 chords: " + calc.getAverageChordTonesInRange("m7");
debugMessage1 += "\ndominant chords: " + calc.getAverageChordTonesInRange("7");
debugMessage1 += "\nmaj9 chords: " + calc.getAverageChordTonesInRange("maj9");
debugMessage1 += "\nm9 chords: " + calc.getAverageChordTonesInRange("m9");

var chordTonesTriads = calc.getAverageChordTonesInRange("M");
var chordTonesTetrads = calc.getAverageChordTonesInRange("maj7");
var chordTonesPentads = calc.getAverageChordTonesInRange("maj9");

var debugMessage2 = "\nNumber of possible melodies for:";
debugMessage2 += "\n~4 triads: " + Math.floor(Math.pow(chordTonesTriads, 4));
debugMessage2 += "\n~8 triads: " + Math.floor(Math.pow(chordTonesTriads, 8));
debugMessage2 += "\n~12 triads: " + Math.floor(Math.pow(chordTonesTriads, 12));
debugMessage2 += "\n~4 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 4));
debugMessage2 += "\n~8 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 8));
debugMessage2 += "\n~12 tetrads: " + Math.floor(Math.pow(chordTonesTetrads, 12));
debugMessage2 += "\n~4 pentads: " + Math.floor(Math.pow(chordTonesPentads, 4));
debugMessage2 += "\n~8 pentads: " + Math.floor(Math.pow(chordTonesPentads, 8));
debugMessage2 += "\n~12 pentads: " + Math.floor(Math.pow(chordTonesPentads, 12));
debugMessage2 += "\nNote that this doesn't account for simple filtering rules.";

var debugMessage3 = '';

$(document).ready(function(){
  var calcHtml = "<code class=\'calc-output\'>";
  calcHtml += debugMessage1 + "<br/>";
  calcHtml += debugMessage2;

  $('#output-calculations').append(calcHtml);

  $('#button-play-solo').click(function() {
    var melody = $( "#solo-melody" ).val().split(" ");
    player.playMelodySolo(melody);
  });

  $('#button-play').click(function() {
    var melody1 = $( "#first-melody" ).val().split(" ");
    var melody2 = $( "#second-melody" ).val().split(" ");
    var melody3 = $( "#third-melody" ).val().split(" ");
    player.playMelodyWithAccompaniment(melody1, melody2, melody3);
  });

  // $('#button-play').click(function() {
  //   testPlayer.playSample();
  // })

});
