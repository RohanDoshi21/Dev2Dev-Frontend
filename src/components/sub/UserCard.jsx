import React from "react";

const UserCard = ({ user }) => {
  return (
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
  );
};

export default UserCard;
