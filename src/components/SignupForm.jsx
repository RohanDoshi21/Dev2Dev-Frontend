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
    <div className="flex justify-center my-4 items-center align-middle bg-cover font-myfont">
      <div className="flex justify-center items-center flex-col rounded-xl gap-y-2 p-8 border-2 shadow-xl mt-5 px-10">
        <h1 className="text-4xl font-semibold mt-2 text-[#0A2647]">Sign Up</h1>
        <hr className="w-full border-[#0A2647] border-[0.12rem] mb-4" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-sm">
          <label className="text-base">First Name</label>
          <input
            type="text"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={firstName}
            required
            onChange={(e) => setFname(e.target.value)}
          />
          <label className="text-base">Last Name</label>
          <input
            type="text"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={lastName}
            required
            onChange={(e) => setLname(e.target.value)}
          />
          <label className="text-base">Email</label>
          <input
            type="email"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-base">Phone Number</label>
          <input
            type="tel"
            className="border py-2 px-3 rounded outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
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
              <a href="/auth/login" className="text-[#2C74B3] hover:underline">
                Already have an account? Log in
              </a>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignupForm;
