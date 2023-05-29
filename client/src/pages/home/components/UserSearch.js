import React from 'react';

function UserSearch({ searchKey, setSearchKey }) {
	return (
		<div className="relative">
			<input
				type="text"
				placeholder="Search"
				className="rounded-full border-gray-300 w-full pl-10 text-gray-500 h-14"
				value={searchKey}
				onChange={(e) => setSearchKey(e.target.value)}
			/>
			<i className="ri-search-2-line absolute top-4 left-4 text-gray-400 font-bold"></i>
		</div>
	);
}

export default UserSearch;
