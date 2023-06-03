import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signupUrl } from "../constants/urls";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      password: password,
    };

    const options = {
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await axios.post(signupUrl, data, options);

      if (response.status === 201) {
        toast.success("Successfully registered!");
        toast.info("Please login to continue");
        history.push("/auth/login");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="signup-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>First Name</label>
          <input
            type="text"
            className="auth-input"
            value={firstName}
            required
            onChange={(e) => setFname(e.target.value)}
          />
          <label>Last Name</label>
          <input
            type="text"
            className="auth-input"
            value={lastName}
            required
            onChange={(e) => setLname(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Phone Number</label>
          <input
            type="tel"
            className="auth-input"
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            className="auth-input"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
          <div>
            <h2>
              <a href="/auth/login">Already have an account? Log in</a>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignupForm;
