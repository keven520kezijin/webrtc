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

// div
let divConstraints = document.querySelector('div#constraints')

// recored
let recvideo = document.querySelector('video#recplayer')
let btnRecord = document.querySelector('button#record')
let btnPlay = document.querySelector('button#recplay')
let btnDownload = document.querySelector('button#download')

let buffer
let mediaRecorder

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
  
  let videoTrack = stream.getVideoTracks()[0]
  let videoConstraints = videoTrack.getSettings()
  divConstraints.textContent = JSON.stringify(videoConstraints, null, 2)
  
  window.stream = stream
  videoplay.srcObject = stream
  // audioplayer.srcObject = stream

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
      audio: true,
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

function handleDataAvailable(e) {
  if(e && e.data && e.data.size > 0) {
    buffer.push(e.data)
  }
}


function startRecord() {

  buffer = []

  const options = {
    mimeType: 'video/webm;codecs=vp8'
  }

  if(!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported!`)
    return
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options)
  } catch(e) {
    console.error('Failed to create MediaRecorder: ', e)
    return
  }

  mediaRecorder.ondataavailable = handleDataAvailable
  mediaRecorder.start(10)
}

function stopRecord() {
  mediaRecorder.stop()
}

btnRecord.onclick = () => {
  if (btnRecord.textContent === 'Start Record') {
    startRecord();
    btnRecord.textContent = 'Stop Record'
    btnPlay.disabled = true
    btnDownload.disabled = true
  } else {
    stopRecord();
    btnRecord.textContent = 'Start Record'
    btnPlay.disabled = false
    btnDownload.disabled = false
  }
}

btnPlay.onclick = () => {
  let blob = new Blob(buffer, {type: 'video/webm'})
  recvideo.src = window.URL.createObjectURL(blob)
  recvideo.srcObject = null
  recvideo.controls = true
  recvideo.play()
}

btnDownload.onclick = () => {
  let blob = new Blob(buffer, {type: 'video/webm'})
  let url = window.URL.createObjectURL(blob)
  let a = document.createElement('a')

  a.href = url
  a.style.display = 'none'
  a.download = 'aaa.webm'
  a.click()
}


