import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetMessages, SendMessage } from '../../../apicalls/messages';
import { ShowLoader, HideLoader } from '../../../redux/loaderSlice';
import toast from 'react-hot-toast';
import store from '../../../redux/store';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);



function ChatArea({ socket }) {
	const dispatch = useDispatch();
	const [newMessage, setNewMessage] = React.useState('');
	const { selectedChat, user } = useSelector((state) => state.userReducer);
	const [messages = [], setMessages] = React.useState([]);
	const recipientUser = selectedChat.members.find(
		(mem) => mem._id !== user._id
	);

	const sendNewMessage = async () => {
		try {
			// dispatch(ShowLoader());
			const message = {
				chat: selectedChat._id,
				// members: selectedChat.members.map((mem) => mem._id),
				sender: user._id,
				text: newMessage,
			};
			// send msg to srv through soket.io
			socket.emit('send-message', {
				...message,
				members: selectedChat.members.map((mem) => mem._id),
				// createdAt: dayjs('DD/MM/YY, hh:mm a').format(),
				read: false,
			});

			// store in DB socket.io
			const response = await SendMessage(message);
			// dispatch(HideLoader());
			if (response.success) {
				setNewMessage('');
			}
		} catch (error) {
			// dispatch(HideLoader());
			toast.error(error.message);
		}
	};

	const getMessages = async () => {
		try {
			dispatch(ShowLoader());
			const response = await GetMessages(selectedChat._id);
			dispatch(HideLoader());
			if (response.success) {
				setMessages(response.data);
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getMessages();

		// receive msg from srv using socket.io
		socket.off('receive-message').on('receive-message', (message) => {
			const tempSelectedChat = store.getState().userReducer.selectedChat;
			if (tempSelectedChat._id === message.chat) {
				setMessages((messages) => [...messages, message]);
			}
		});
	}, [selectedChat]);

	useEffect(() => {
		// scrool to bootom for new msg id
		const messagesContainer = document.getElementById('messages');
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}, [messages]);

	// console.log(recipientUser);

	return (
		<div className="bg-white h-[85vh] border rounded-2xl w-full flex flex-col justify-between p-5">
			{/* 1st part recipient user */}
			<div>
				<div className="flex gap-5 items-center mb-2">
					{recipientUser.profilePic && (
						<img
							src={recipientUser.profilePic}
							alt="profile pic"
							className="w-10 h-10 rounded-full"
						/>
					)}
					{!recipientUser.profilePic && (
						<div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center">
							<h1 className="uppercase text-xl font-semibold  text-white ">
								{recipientUser.name[0]}
							</h1>
						</div>
					)}
					<h1 className="uppercase ">{recipientUser.name}</h1>
				</div>
				<hr />
			</div>

			{/* 2nd part chat messages */}
			<div className="h-[67vh] overflow-y-scroll p-3" id="messages">
				<div className="flex flex-col gap-2">
					{messages.map((message) => {
						const isCurrentUserIsSender = message.sender === user._id;
						return (
							<div className={`flex ${isCurrentUserIsSender && 'justify-end'}`}>
								<div className="flex flex-col">
									<h1
										className={`${
											isCurrentUserIsSender
												? 'bg-indigo-300 text-primary rounded-tr-none'
												: 'bg-green-200 text-primary rounded-tl-none'
										} p-2 rounded-xl`}
									>
										{message.text}
									</h1>
									<h1
										className={`${
											isCurrentUserIsSender
												? ' text-blue-300 text-xs'
												: ' text-primary text-xs'
										} p-1`}
									>
										{dayjs(message.createdAt).format('DD/MM/YY, hh:mm a')}
									</h1>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* 3rd part chat imput */}
			<div>
				<div className="h-18 rounded-xl border-indigo-600 shadow border flex justify-between p-2 items-center">
					<input
						type="text"
						placeholder="Type a message and send >>"
						className="w-[90%] border-0 h-full rounded-xl focus:border-none"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
					/>
					<button
						className="bg-green-500 text-white py-1 px-6 rounded-md h-max shadow"
						onClick={sendNewMessage}
					>
						<i className="ri-mail-send-line text-white"></i>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ChatArea;
