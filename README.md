# AutoComposerJS

See it in action [here](http://www.rj-salvador.com/apps/autocomposer).

## Overview
AutoComposerJS creates small musical snippets that conform to the _best practices_ of Western music theory. In its current form, it does this by writing a simple melody over a chord progression. It also has a few more tricks:

* Writes basic accompaniment for melodies.
* Can present generated melodies in the following formats:
    + **Musical score**
    + **MIDI file**
    + **Audio** - the program play back generated MIDI files in the browser

If you're a music nerd that frequently wonders about the melodic possibilities in a chord progression, this program can help you out.
It visualizes various sequences of chord tones that fit in a chord progression, and ranks them by smoothness.
In our case, smoothness is calculated as the sum of intervals between the notes of a melody.

## Usage
Install the package through NPM

`npm install --save autocomposer-js`

And then it'll be usable in your code!

```
var AutoComposerJS = require('autocomposer-js')
var chordProgression = "Gm Em C D".split(" ")
var allTheMelodies = AutoComposerJS.melody.buildSimpleMelodies(chordProgression)
```

Or just drop the file in `dist/` through a script tag like so:

```
<script src="path/to/autocomposer-js.js"></script>
<script>
  var chordProgression = "Gm Em C D".split(" ")
  var allTheMelodies = AutoComposerJS.melody.buildSimpleMelodies(chordProgression)
</script>
```

The melodies will be returned as `MelodyData` objects, which look like this:

```
{
   "chordProgression":[
      "Gm",
      "D7"
   ],
   "melodyNotes":[
      "D5",
      "C5"
   ],
   "smoothness":2,
   "range":2,
   "melodyString":"D5 C5"
}
```

The `range` is the distance between the highest and lowest note (in semitones). The `smoothness` shows the total distance between all notes in the melody (in semitones).

## Potential Uses
* Brainstorming when starting or continuing a musical composition.
* Exploring how melody and harmony work together.

## More info
Check out the [project wiki](https://github.com/rjsalvadorr/autocomposer-js/wiki), since that's updated more often than this file.
