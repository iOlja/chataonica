const express = require('express');
require('dotenv').config();
const app = express();
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 5000;
const dayjs = require('dayjs');

const usersRoute = require('./routes/usersRoute');
const chatsRoute = require('./routes/chatsRoute');
const messagesRoute = require('./routes/messagesRoute');

// socket.io implementation
app.use(express.json());

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

// check connection of socket.io from client side

io.on('connection', (socket) => {
	//socket events

	socket.on('join-room', (userId) => {
		socket.join(userId);
	});

	// 	//send msg to recipient
	// 	socket.on("send-message", ({text, sender, recipient}) => {
	// //send msg to recipient which is olja
	// 		io.to(recipient).emit("receive-message", {
	// 			text, sender

	// 		})
	// 	})

	//send msg to clients in the same room (if bug "multiple msg send or received" apper change socket.on to socket.once)
	socket.on('send-message', (message) => {
		io.to(message.members[0])
			.to(message.members[1])
			.emit('receive-message', message);
	});
});

app.use('/api/users', usersRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/messages', messagesRoute);

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => console.log(`Server running on port ${port}`));
