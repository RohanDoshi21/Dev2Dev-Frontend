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
        localStorage.setItem("userID", responseData["data"]["user"]["id"]);
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
    <div>
      <div className="flex justify-center align-center h-screen items-center  bg-cover">
        <div className="justify-center items-center rounded-md gap-y-8 flex-col w-2/3 ">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit} className="">
            <label>Email</label>
            <input
              type="email"
              className=""
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              className=""
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
            <div>
              <h2>
                <Link to="/auth/signup"> Don't have an account? Sign up</Link>
              </h2>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
