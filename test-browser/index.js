$(document).ready(function() {
  $('#button-play-solo').click(function() {
    var melody = $( "#solo-melody" ).val().split(" ");
    AutoComposerJS.midiPlayer.playMelodySolo(melody);
  });

  $('#button-play').click(function() {
    var melody1 = $( "#first-melody" ).val().split(" ");
    var melody2 = $( "#second-melody" ).val().split(" ");
    var melody3 = $( "#third-melody" ).val().split(" ");
    AutoComposerJS.midiPlayer.playMelodyWithAccompaniment(melody1, melody2, melody3);
  });

  $('#btn-melody-gen').click(function() {
    var isRaw = $('#chk-raw')[0].checked;
    var isLimited = $('#chk-limit')[0].checked;
    var isFiltered = $('#chk-filtered')[0].checked;
    var chordProgression = "Gm D7".split(" ");
    var generatorOptions = {
      raw: isRaw,
      limit: isLimited,
      filter: isFiltered
    };
    console.log('Generating melodies... generatorOptions=' + JSON.stringify(generatorOptions));
    // How are we going to output melodies for testing?
    // VexTab may be the easiest way (since it was built for that)
    var outputText = JSON.stringify(AutoComposerJS.melody.buildSimpleMelodies(chordProgression, generatorOptions), 2);

    console.log(outputText);

    $('#output-melodies').html(outputText);
  });
});
