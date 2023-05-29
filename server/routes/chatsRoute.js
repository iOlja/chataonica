const router = require('express').Router();
const Chat = require('../models/chatModel');
const Message = require("../models/messageModel");
const authMiddleware = require('../middlewares/authMiddleware');

// create new chat (need members from model, lastMessage and unreadMessage will be updated manually)

router.post('/create-new-chat', authMiddleware, async (req, res) => {
	try {
		const newChat = new Chat(req.body);
		const savedChat = await newChat.save();
		// populate members and last message in saved chat
    await savedChat.populate("members");
    res.send({
      success: true,
      message: "Chat created successfully",
      data: savedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
});

// get all chats of current user (members are stored as an array, we need to compare array with string. we need to use $in operator to check if an user with an id is present or not. if he is present we need to fetch all of his chats )

router.get('/get-all-chats', authMiddleware, async (req, res) => {
	try {
		const chats = await Chat.find({
			members: {
				$in: [req.body.userId],
			},
		})
			.populate('members')
			.populate("lastMessage")
			.sort({ updateAt: -1 });
		res.send({
			success: true,
			message: 'Chats fetched successfully',
			data: chats,
		});
	} catch (error) {
		res.send({
			success: false,
			message: 'Error fetching chats',
			error: error.message,
		});
	}
});

module.exports = router;
