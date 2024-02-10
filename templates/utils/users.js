const users = [];

// Join user to chat
function userJoin(id, names, interests){
    const user = { id, names, interests };

    users.push(user);

    return user;
}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    //Find and return, else return -1
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(interests){
    return users.filter(user => user.interests === interests);
}

module.exports = {
    userJoin,
     getCurrentUser,
     userLeave,
     getRoomUsers
};