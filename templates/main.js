const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 
const interestName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

const names = localStorage.getItem('name-s');
const interests = localStorage.getItem('interest-s');

// Get room and users
socket.on('roomUsers', ({interests, names}) => {
    outputRoomName(interests);
    outputUsers(names);
})

// Join chatroom
socket.emit('joinRoom', {names, interests});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
}) 

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Get message text from chat.html
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message'); 
    div.innerHTML = '<p class="meta">' + message.names + '<span>' + ' ' + message.time + '</span></p> <p class="text">' + message.text + '</p>';
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM 
function outputRoomName(interests){
    interestName.innerText = interests;
}

//Add users to DOM 
function outputUsers(users){
    userList.innerHTML = 
    users.map(user => '<li>' + user.names + '</li>').join('');
}