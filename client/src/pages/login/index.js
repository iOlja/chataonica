import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';
import { HideLoader, ShowLoader } from '../../redux/loaderSlice';

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [user, setUser] = React.useState({
		email: '',
		password: '',
	});

	const login = async () => {
		try {
			dispatch(ShowLoader());
			const response = await LoginUser(user);
			dispatch(HideLoader());
			if (response.success) {
				toast.success(response.message);
				localStorage.setItem('token', response.data);
				window.location.href = '/';
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
	}, []);

	return (
		<div className="h-screen bg-primary flex items-center justify-center">
			<div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96 ">
				<div className='flex'>
				<i className="ri-chat-smile-2-line text-4xl text-primary mr-2"></i>

				<h1 className="text-3xl uppercase font-semibold text-primary">
					Chat App Login
				</h1>
				</div>
				<hr />
				<input
					type="email"
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
					placeholder="<<  email  >>"
				/>

				<input
					type="password"
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
					placeholder="<<  password  >>"
				/>

				<button className={
					user.email && user.password ? 'contained-btn' : 'disabled-btn'
				} onClick={login}>
					Login
				</button>
				<Link to="/register" className="underline">
					Don't have an account? Register
				</Link>
			</div>
		</div>
	);
}

export default Login;
