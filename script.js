const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let peerConnection;

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);

async function startCall() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = stream;
        localStream = stream;

        const configuration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        };
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addEventListener('icecandidate', handleICECandidate);
        peerConnection.addEventListener('track', handleTrack);

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

async function endCall() {
    try {
        localStream.getTracks().forEach(track => track.stop());
        if (remoteVideo.srcObject) {
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
    } catch (error) {
        console.error('Error ending call:', error);
    }
}

function handleICECandidate(event) {
    if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
    }
}

function handleTrack(event) {
    remoteVideo.srcObject = event.streams[0];
}
