'use strice'

let audioSource = document.querySelector('select#audioSource')
let audioOutput = document.querySelector('select#audioOutput')
let videoSource = document.querySelector('select#videoSource')


if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log('enumerateDevices is not supported!');
} else {
  navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .catch(handleError);
}

function gotDevices(deviceInfos) {
  deviceInfos.forEach((deviceInfo) => {
    console.log(deviceInfo.kind + ":label = " 
      + deviceInfo.label + ":id = "
      + deviceInfo.deviceId + ":groupid = "
      + deviceInfo.groupId);

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

function handleError(err) {
  console.log(err.name + ":" + err.message);
}

// (async function(){console.debug(await navigator.mediaDevices.enumerateDevices())})()