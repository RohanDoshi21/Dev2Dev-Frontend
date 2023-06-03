import { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUrl } from "../constants/urls";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [isLoggedIn, setStatus] = useState(false);
  const history = useHistory();
  //   const cookies = new Cookies();

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
    console.log(loginUrl);
    try {
      const response = await fetch(loginUrl, options);
      const data = await response.json();
      const token = data["data"]["token"];
      // console.log(token);
      // cookies.set("jwt_authorization", token);
      localStorage.setItem("jwt_authorization", token);
      localStorage.setItem("username", data["data"]["user"]["first_name"]);
      localStorage.setItem("userID", data["data"]["user"]["id"]);
      localStorage.setItem("role", data["data"]["user"]["role"]);
      localStorage.setItem("dpUrl", data["data"]["user"]["dpUrl"]);

      toast.success("Logged in!", {
        position: "top-center",
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to login!", {
        position: "top-center",
        hideProgressBar: true,
      });
    } finally {
      history.push("/");
    }
  };

  return (
    // {isLoggedIn && <ToastContainer/>}
    <div>
      {/* <ToastContainer /> */}
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
                <a href="/auth/signup">Don't have an account? Sign up</a>
              </h2>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
