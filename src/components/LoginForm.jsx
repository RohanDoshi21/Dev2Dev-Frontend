import React, { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUrl } from "../constants/urls";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(loginUrl, options);
      const responseData = await response.json();

      if (response.ok) {
        const token = responseData["data"]["token"];
        localStorage.setItem("jwt_authorization", token);
        localStorage.setItem(
          "username",
          responseData["data"]["user"]["first_name"]
        );
        localStorage.setItem("userID", responseData["data"]["user"]["id"].toString());
        localStorage.setItem("role", responseData["data"]["user"]["role"]);
        localStorage.setItem("dpUrl", responseData["data"]["user"]["dpUrl"]);

        toast.success("Logged in!");

        login();

        history.push("/");
      } else {
        const error = responseData["error"]; // Assuming the backend returns an "error" field
        toast.error(error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex justify-center mt-36 align-middle items-center bg-cover">
      <div className="flex justify-center items-center flex-col rounded-xl gap-y-2 p-8 border-2 shadow-xl px-10">
        <h1 className="text-4xl font-semibold text-[#0A2647]">Login</h1>
        <hr className="w-full border-[#0A2647] border-[0.12rem] mb-4" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-base">Email</label>
          <input
            type="email"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-base">Password</label>
          <input
            type="password"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#0A2647] hover:bg-[#2C74B3] text-white font-bold w-full py-2 px-4 rounded-2xl mt-4 duration-100 transform hover:scale-105"
          >
            Submit
          </button>
          <div className="text-center">
            <h2 className="text-lg">
              <Link
                to="/auth/signup"
                className="text-[#2C74B3] hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
