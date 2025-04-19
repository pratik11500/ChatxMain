
var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload(){
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  socket.on("join", function(room){
    chatRoom.innerHTML = "Chatroom : " + room;
  });

  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 10){
      messages.push(message);
    } else {
      messages.shift();
      messages.push(message);
    }
    updateMessages();
    if (dingSound) {
      dingSound.currentTime = 0;
      dingSound.play().catch(e => console.log('Audio play failed:', e));
    }
  });

  // Add enter key support for sending messages
  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      Send();
    }
  });
}

function updateMessages() {
  for (let i = 0; i < 10; i++) {
    let messageElement = document.getElementById("Message" + i);
    if (messageElement) {
      messageElement.innerHTML = messages[i] || '-';
      messageElement.style.color = messages[i] ? "#303030" : "#a0a0a0";
    }
  }
}

function Connect(){
  if (usernameInput.value.trim() !== "") {
    socket.emit("join", chatIDInput.value, usernameInput.value);
  }
}

function Send(){
  if (delay && messageInput.value.trim() !== ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset(){
  delay = true;
}
