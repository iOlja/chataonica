const router = require('express').Router();
const Chat = require('../models/chatModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Message = require('../models/messageModel');

// new message

router.post('/new-message', async (req, res) => {
	try {
		// store message
		const newMessage = new Message(req.body);
		const savedMessage = await newMessage.save();

		// update chat with last message

		// const chat = await Chat.findById
		// (req.body.chat);
		// chat.lastMessage = savedMessage._id;
		// await chat.save();

		await Chat.findOneAndUpdate(
			{ _id: req.body.chat },
			{
				lastMessage: savedMessage._id,
				unread: {
					$inc: 1,
				},
			}
		);

		res.send({
			success: true,
			message: 'Message sent succesfully',
			data: savedMessage,
		});
	} catch (error) {
		res.send({
			success: false,
			message: 'Error sending message',
			error: error.message,
		});
	}
});

// get all the messages of a chat

router.get('/get-all-messages/:chatId', async (req, res) => {
	try {
		const messages = await Message.find({
			chat: req.params.chatId,
		}).sort({ createdAt: 1 });
		res.send({
			success: true,
			message: 'Messages fetched succesfully',
			data: messages,
		});
	} catch (error) {
		res.send({
			success: false,
			message: 'Error fetching messages',
			error: error.message,
		});
	}
});

module.exports = router;
