import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const authCheck = () => {
  const token = localStorage.getItem("jwt_authorization");

  return token !== null;
};

const logOut = async () => {
  try {
    const token = await localStorage.getItem("jwt_authorization");
    toast.success("Logged out!", {
      position: "top-center",
      hideProgressBar: true,
    });
    localStorage.removeItem("jwt_authorization");

    return { message: "Successfully logged out" };
  } catch (error) {
    toast.error("Failed to logout", {
      position: "top-center",
      hideProgressBar: true,
    });
    return { error: "Something went wrong" };
  }
};

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jwt_authorization"),
  },
};

export { authCheck, logOut, config };
