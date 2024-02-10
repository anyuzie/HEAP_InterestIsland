const http = require('http');
const express = require("express");
const socketio = require('socket.io');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
// Using server instead of app
const server = http.createServer(app);
const io = socketio(server);
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://teckyew:iloveinterestisland@interestislandgotcluste.1wwxavn.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const botname = '❤️ Bot';

// SOCKET CONNECTION

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({names, interests}) => {
    const user = userJoin(socket.id, names, interests);

    socket.join(user.interests);

     //Welcome current single user
    socket.emit('message', formatMessage(botname, '~ W e l c o m e  t o  I n t e r e s t   I s l a n d ! ~'));

    //Broadcast too all clients when a user connects (exclude the current user)
    socket.broadcast.to(user.interests)
    .emit(
      'message', 
      formatMessage(botname, user.names + ' has joined the chat')
  );

  // Send users and room info
  io.to(user.interests).emit('roomUsers', {
    interests: user.interests,
    users: getRoomUsers(user.interests)
  });
});

  //Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.interests).emit('message', formatMessage(user.names, msg));
  });

  // Runs when clients disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.interests).emit(
        'message', 
        formatMessage(botname, user.names + ' has left the chat')
      ); 

      // Send users and room info
    io.to(user.interest).emit('roomUsers', {
    room: user.interests,
    users: getRoomUsers(user.interests)
    });
  }
});
}); 



// Define the user schema
const notesSchema = {
  name: String,
  password: String,
  cfm_password: String,
  age: String,
  gender: String
};

// Create the Note model
const Note = mongoose.model("Note", notesSchema);

// Set up default route and middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/Applications/MAMP/htdocs/officialheap/Team-17-Project'));

// Homepage route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Signup route
app.get("/signup.html", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup.html", urlencodedParser, function (req, res) {
  var username = req.body.name;
  var password = req.body.password;
  var cfm_password = req.body.cfm_password;

  // Hash the passwords
  bcrypt.hash(password, 10, function (err, hashedPass) {
    if (err) {
      console.error(err);
      res.status(500).send("Error occurred while hashing the password.");
      return;
    }

    bcrypt.hash(cfm_password, 10, function (err, hashedCfmPass) {
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while hashing the confirm password.");
        return;
      }

      // Create a new user
      let newNote = new Note({
        name: username,
        password: hashedPass,
        cfm_password: hashedCfmPass,
        age: req.body.age,
        gender: req.body.gender
      });

      // Save the user to the database
      newNote.save()
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Error occurred while saving the user data.");
        });
    });
  });
});

app.post("/", urlencodedParser, function(req, res) {
  var username = req.body.name;
  var password = req.body.password;

  Note.findOne({ name: username })
    .then(user => {
      if (user) {
        // Compare the login password with the stored password
        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            console.error(err);
            res.status(500).send("An error occurred while comparing passwords.");
          } else if (result) {
            // Passwords match, redirect to dashboard
            //res.redirect("/dashboard.html?name=" + user.name);
            res.redirect("/interest.html");
          } else {
            // Password is incorrect
            res.status(400).send("Invalid password. Please try again.");
          }
        });
      } else {
        // User not found
        res.status(400).send("User not found. Please try again.");
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).send("Error occurred while finding the user.");
    });
});


// Dashboard route
app.get("/interest.html", function (req, res) {
    // Render the dashboard view here
    res.sendFile(__dirname + "/interest.html");
  });

// Chat route
app.get("/chat.html", function (req, res) {
  // Render the dashboard view here
  res.sendFile(__dirname + "/chat.html");
});

// Start the server
server.listen(3000, function () {
  console.log("Server is running on port 3000");
});