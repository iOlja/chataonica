import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatArea from './components/ChatArea';
import UserSearch from './components/UserSearch';
import UsersList from './components/UsersList';
import { io } from 'socket.io-client';
import heroicon from '../home/heroicon.svg'
const socket = io('https://chataonica.onrender.com');


function Home() {
	const [searchKey, setSearchKey] = React.useState('');
	const { selectedChat, user } = useSelector((state) => state.userReducer);

	useEffect(() => {
		// join room
		if (user) {
			socket.emit('join-room', user._id);
		}
	}, [user]);

	return (
		<div className="flex gap-5">
			{/* 1st part user search, users list, chat list */}

			<div className="w-96">
				<UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />

				<UsersList 
				searchKey={searchKey}
				setSearchKey={setSearchKey} />
			</div>

			{/* 2nd part chat area */}

			{selectedChat && (
				<div className="w-full" >
					<ChatArea socket={socket} />
				</div>
			)}

{!selectedChat && (
        <div className="w-full h-[80vh]  items-center justify-center flex flex-col">
          <img src={heroicon} alt="home-hero-icon" className=""
          />
          <h1 className="text-3xl font-semibold text-indigo-500 mt-5">
            Select a user and chat away...
          </h1>
        </div>
      )}

		</div>
	);
}

export default Home;
