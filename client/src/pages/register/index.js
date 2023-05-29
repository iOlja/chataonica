import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUser } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { HideLoader, ShowLoader } from '../../redux/loaderSlice';

function Register() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [user, setUser] = React.useState({
		name: '',
		email: '',
		password: '',
	});

	const register = async () => {
		try {
			dispatch(ShowLoader());
			const response = await RegisterUser(user);
			dispatch(HideLoader());
			if (response.success) {
				toast.success(response.message);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (localStorage.getItem('token')) {
			navigate('/');
		}
	});

	return (
		<div className="h-screen bg-primary flex items-center justify-center">
			<div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96 ">
				<div className='flex'>
			<i className="ri-chat-smile-2-line text-4xl text-primary mr-2"></i>
				<h1 className="text-3xl uppercase font-semibold text-primary">
					Chat App Register
				</h1>
				</div>
				<hr />
				<input
					type="text"
					value={user.name}
					onChange={(e) => setUser({ ...user, name: e.target.value })}
					placeholder="<<  choose a catchi username >>"
				/>

				<input
					type="email"
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
					placeholder="<<  enter email  >>"
				/>

				<input
					type="password"
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
					placeholder="<<  any password you can think off  >>"
				/>

				<button className= {
					user.name && user.email && user.password ? 'contained-btn' : 'disabled-btn'
				} onClick={register}>
					Register
				</button>
				<Link to="/login" className="underline">
					Already have an account? Login
				</Link>
			</div>
		</div>
	);
}

export default Register;
