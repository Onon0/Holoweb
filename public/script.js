  
const socket = io('/');
const videoGrid = document.getElementById('video-grid')

const cameraSize = {
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
};


const myPeer = new Peer()
const myVideo = document.createElement('video')
//myVideo.width = cameraSize.w;
//myVideo.height = cameraSize.h;
myVideo.muted = true


const peers = {}
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.msGetUserMedia||
                         navigator.mozGetUserMedia;


if(navigator.getUserMedia){
    navigator.getUserMedia({
        video:true,
        audio:false
    }, function(stream){
        addVideoStream(myVideo, stream)
        myVideo.srcObject = stream
        videoGrid.append(myVideo)
    
        myPeer.on('call', call=>{
            call.answer(stream)
            video = document.createElement('video')
            //video.width = cameraSize.w;
            //video.height = cameraSize.h;
            call.on('stream', userVideoStream=>{
                addVideoStream(video, userVideoStream)
            })
        })
    
        socket.on('user-connected', userId =>{
            connectToNewUser(userId, stream)
        })
    },
    function(err) {
        console.log("The following error occurred: " + err.name);
     }

    )
}else{
    console.log("getUserMedia not supported")
}


socket.on('user-disconnected', userId=>{
    if(peers[userId]) peers[userId].close()
})
myPeer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);

})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    //video.width = cameraSize.w;
    //video.height = cameraSize.h;
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] = call
}
function addVideoStream(video, stream){
    video.srcObject = stream
    video.onloadedmetadata = function(e){
        video.play()
    }
  videoGrid.append(video)
}