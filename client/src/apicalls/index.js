import axios from 'axios';

//to store the autorizatio token in local storage

export const axiosInstance = axios.create({
	headers: {
		authorization: `Bearer ${localStorage.getItem('token')}`,
	},
});
