function __log(e, data) {
  log.innerHTML += "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  __log('Media stream created.');

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');
  
  recorder = new Recorder(input);
  __log(recorder);
  __log('Recorder initialised.');
  console.log('Recorder initialised.');
}

function startRecording(button) {
  recorder && recorder.record();
  __log('Recording...');
  console.log('Recording...');
  
}

function stopRecording(button) {
  recorder && recorder.stop();
  __log('Stopped recording.');
  console.log('Stopped recording.');
  
  //get the audio blob
  var b = getAudioBlob();

  // create WAV download link using audio data blob
  createDownloadLink();
  
  recorder.clear();

  recording = false;

  return b;
}

function createDownloadLink() {
recorder && recorder.exportWAV(function(blob) {
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
    
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
    console.log("Inside createDownloadLink()");
    console.log(blob);
  });
}

function getAudioBlob() {
  var b = null;
  recorder && recorder.exportWAV(function(blob) {
    b = blob;
  });

  return b;
}


var recorderObject = (function() {
return {
    recorder: function() {
      (function($) {
          'use strict';
window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    
    audio_context = new AudioContext;
    __log('Audio context set up.');
    __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
  } catch (e) {
    alert('No web audio support in this browser!');
    alert(e);
  }
  
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
};
})(window.jQuery);
}
}
})(recorderObject||{})
