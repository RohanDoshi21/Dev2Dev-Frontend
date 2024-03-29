import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/logo_bg.png";

import { authCheck, logOut } from "../AuthChecker";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  let [isAuthenticated, setAuth] = useState(authCheck());
  let [query, setQuery] = useState("");
  const history = useHistory();

  const userName = localStorage.getItem("username");
  const dpUrl = localStorage.getItem("dpUrl");

  const handleLogout = async () => {
    try {
      await logOut();
      setAuth(false);
      toast.success("Logged out!");
      localStorage.removeItem("userID");
      localStorage.removeItem("username");
      localStorage.removeItem("jwt_authorization");
    } catch (e) {
      toast.error("Failed to logout");
    }
  };

  const handleSearch = () => {
    const q = query.replace(" ", "+");
    history.push(`/search/results/${q}`);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center py-2 px-4 bg-[#0A2647] h-16 text-gray-100">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img
              src={Logo}
              alt="Stack Overflow logo"
              className="h-12 w-40 p-2"
            />
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-4 items-center">
          <div className="relative">
            <input
              className="block w-full bg-gray-200 border border-gray-300 rounded-lg py-2 px-4 placeholder-gray-500 text-gray-700 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 22l-6-6" />
                <circle cx="10" cy="10" r="8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1">
          <ul className="flex justify-end ">
            <li className="mr-4">
              {isAuthenticated && (
                <Link
                  className="hover:text-blue-500"
                  to={`/questions/my_questions`}
                >
                  My Questions
                </Link>
              )}
            </li>
            <li className="mr-4">
              <Link className="hover:text-blue-500" to="/tag/node">
                Tags
              </Link>
            </li>
            <li className="mr-4">
              <Link className="hover:text-blue-500" to="/users">
                Users
              </Link>
            </li>
            <li className="mr-4">
              {!isAuthenticated && (
                <Link className="hover:text-blue-500" to="/auth/login">
                  Login
                </Link>
              )}
            </li>
            <li className="mr-4">
              {isAuthenticated && (
                <Link
                  className="hover:text-blue-500"
                  to="/"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* User profile information */}
        <div className="user-profile flex items-center mx-2">
          {isAuthenticated && (
            <img
              className="rounded-full h-8 w-8 mr-2"
              src={dpUrl || "https://via.placeholder.com/50x50"}
              alt="User profile"
            />
          )}
          {isAuthenticated && (
            <span className="text-gray-300 text-sm font-medium">
              {userName}{" "}
            </span>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
