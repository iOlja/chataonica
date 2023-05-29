import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllChats } from "../apicalls/chats";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllUsers, SetUser, SetAllChats } from "../redux/userSlice";


//on every refresh check the token, if token is valid render homepage, else navigate user to login page
function ProtectedRoute({ children }) {
	// const [user, setUser] = React.useState(null);
	const { user } = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const getCurrentUser = async () => {
		try {
			dispatch(ShowLoader());
			const response = await GetCurrentUser();
			const allUsersResponse = await GetAllUsers();
			const allChatsResponse = await GetAllChats();

			dispatch(HideLoader());
			if (response.success) {
				dispatch(SetUser(response.data));
				dispatch(SetAllUsers(allUsersResponse.data));
				dispatch(SetAllChats(allChatsResponse.data));

			} else {
				toast.error(response.message);
				navigate('/login');
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
			navigate('/login');
		}
	};

	useEffect(() => {
		if (localStorage.getItem('token')) {
			getCurrentUser();
		} else {
			navigate('/login');
		}
	}, []);

	return (
		<div className="h-screen w-screen bg-gray-200 p-2">
			{/* header */}

			<div className="flex justify-between p-5">
				<div className="flex items-center gap-1">
					<i className="ri-chat-smile-2-line text-2xl"></i>

					<h1 className="text-primary text-2xl uppercase font-bold underline cursor-pointer"
					onClick={()=> {
						navigate("/")
					}}
					
					>
						CHATAONICA
					</h1>
				</div>
				<div className="flex gap-1 text-md items-center">
					<i className="ri-user-heart-line text-xl"></i>

					<h1 className="underline text-xl">{user?.name}</h1>

					<i
						className="ri-logout-circle-r-line ml-5 text-xl cursor-pointer"
						onClick={() => {
							localStorage.removeItem('token');
							navigate('/login');
						}}
					></i>
				</div>
			</div>

			{/* content (pages) */}

			<div className="p-5">{children}</div>
		</div>
	);
}

export default ProtectedRoute;
