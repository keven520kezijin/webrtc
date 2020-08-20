'use strict'

let audioSource = document.querySelector('select#audioSource')
let audioOutput = document.querySelector('select#audioOutput')
let videoSource = document.querySelector('select#videoSource')
let filterSelect = document.querySelector('select#filter')

let snapshot = document.querySelector('button#snapshot')
let picture = document.querySelector('canvas#picture')
let audioplayer = document.querySelector('audio#audioplayer')
picture.width = 640
picture.height = 400

let videoplay = document.querySelector('video#player')
let divConstraints = document.querySelector('div#constraints')

function gotDevices (deviceInfos) {
  deviceInfos.forEach((deviceInfo) => {

      let option = document.createElement('option')
      option.text = deviceInfo.label
      option.value = deviceInfo.deviceId

      if(deviceInfo.kind === 'audioinput') {
        audioSource.appendChild(option)
      }else if(deviceInfo.kind === 'audiooutput') {
        audioOutput.appendChild(option)
      }else if(deviceInfo.kind === 'videoinput') {
        videoSource.appendChild(option)
      }
  });
}

function gotMediaStream (stream) {
  videoplay.srcObject = stream
  // audioplayer.srcObject = stream

  let videoTrack = stream.getVideoTracks()[0]
  let videoConstraints = videoTrack.getSettings()
  divConstraints.textContent = JSON.stringify(videoConstraints, null, 2)

  return navigator.mediaDevices.enumerateDevices();
}

function handleError (err) {
  console.log('getUserMedia error: ', err)
}

function start() {
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported')
    return
  } else {
    let deviceId = videoSource.value
    let constraints = {
      // video: {
      //   width: 640,
      //   height: 480,
      //   frameRate: 30,
      //   // deviceId: deviceId ? deviceId : undefined
      // },
      video: true,
      audio: false,
    }
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError)
  }
}

start()

videoSource.onchange = start;

filterSelect.onchange = function() {
  videoplay.className = filterSelect.value
}

snapshot.onclick = function () {
  picture.getContext('2d').drawImage(videoplay, 0, 0, picture.width, picture.height)
}
