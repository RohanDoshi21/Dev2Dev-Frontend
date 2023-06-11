import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserUrl } from "../constants/urls";
import axios from "axios";

const UserCard = ({ user }) => {
  return (
    <Link
      to={`/user/${user.id}`}
      className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white"
    >
      <img
        className="w-full h-40 object-cover"
        src={user.dpUrl}
        alt={`${user.first_name} ${user.last_name}`}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-[#0A2647]">{`${user.first_name} ${user.last_name}`}</div>
        <p className="text-gray-700 text-base p-[0.5px]">
          {user.email.split("@")[0]}
        </p>
        <p className="text-gray-700 text-base p-[0.5px]">{user.phone_number}</p>
        <p className="text-gray-700 text-base p-[0.5px]">{user.role}</p>
      </div>
    </Link>
  );
};

const UserListPage = () => {
  const fetchUsers = async () => {
    const response = await axios.get(getUserUrl);
    const data = response.data.data.users;
    return data;
  };

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const [users, setUsers] = useState([]);

  return (
    <div className="container mx-auto p-4 px-20">
      <h1 className="text-3xl font-bold mb-4 text-[#0A2647]">User List</h1>
      <div className="grid grid-cols-1 gap-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserListPage;
