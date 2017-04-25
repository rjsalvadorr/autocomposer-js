const Soundfont = require("soundfont-player");

class BrowserPlayer {
  playSample() {
    var ac = new AudioContext()

    /*
    Soundfont.instrument(ac, 'clavinet').then(function (clavinet) {
      clavinet.play('C4')
    })

    // or use FluidR3_GM
    Soundfont.instrument(ac, 'clavinet', { soundfont: 'FluidR3_GM' }).then(function (clavinet) {
      clavinet.play('C4')
    })
    */

    // The first step is always create an instrument:
    Soundfont.instrument(ac, 'clavinet', { soundfont: 'FluidR3_GM' }).then(function (clavinet) {
      // Then you can play a note using names or midi numbers:
      clavinet.play('C4')
      clavinet.play(69)
      // float point midi numbers are accepted (and notes are detuned):
      clavinet.play(60.5) // => 500 cents over C4

      // you can stop all playing notes
      clavinet.stop()
      // or stop only one
      clavinet.play('C4').stop(ac.currentTime + 0.5)
      // or pass a duration argument to `play`
      clavinet.play('C4', ac.currentTime, { duration: 0.5})


      // You can connect the instrument to a midi input:
      window.navigator.requestMIDIAccess().then(function (midiAccess) {
        midiAccess.inputs.forEach(function (midiInput) {
          clavinet.listenToMidi(midiInput)
        })
      })

      // Or schedule events at a given time
      clavinet.schedule(ac.currentTime + 5, [ { time: 0, note: 60}, { time: 0.5, note: 61} ])
    })
  }
}

exports.BrowserPlayer = new BrowserPlayer();
