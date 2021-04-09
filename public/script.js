  
const socket = io('/');
const videoGrid = document.getElementById('asset')
const scene = document.getElementById('scene')
const myPeer = new Peer()
const myVideo = document.createElement('video')
myVideo.setAttribute('id', 'asset' + 10);
var player = document.createElement("a-box");
player.setAttribute('id', 10);
player.setAttribute('position', '0 1.6 0');
player.setAttribute('material', 'src: #asset' + 10);

myVideo.muted = false

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    addVideoStream(myVideo, stream, player)
})
myPeer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);

})

socket.on('user-connected', userId =>{
    console.log('user connected ' + userId);
})

function addVideoStream(video, stream, player){
    video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
  scene.append(player)
}