import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getUserUrl } from "../constants/urls";

const UserProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    const response = await axios.get(getUserUrl + userId);
    const data = response.data.data.user;
    return data;
  };

  useEffect(() => {
    fetchUser().then((data) => {
      setUser(data);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-xs mx-auto rounded overflow-hidden shadow-lg">
        <img
          className="w-full"
          src={user.dpUrl || "/default-avatar.png"}
          alt="User Avatar"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{`${user.first_name} ${user.last_name}`}</div>
          <p className="text-gray-700 text-base mb-2">Email: {user.email}</p>
          <p className="text-gray-700 text-base mb-2">
            Phone Number: {user.phone_number}
          </p>
          <p className="text-gray-700 text-base mb-2">Role: {user.role}</p>
          <p className="text-gray-700 text-base mb-2">
            Member Since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Questions Asked
        </h1>
      </div>
    </div>
  );
};

export default UserProfile;
