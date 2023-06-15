import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

const authCheck = () => {
    const token = localStorage.getItem("jwt_authorization");

    return token !== null;
};

const authCheckModerator = () => {
    const token = localStorage.getItem("jwt_authorization");
    if (token === null) {
        return false;
    }

    const decodedToken = jwtDecode(token);
    const user = decodedToken.user;
    const role = user.role;

    console.log(role);

    return role === "MODERATOR";
};

const logOut = async () => {
    try {
        localStorage.removeItem("jwt_authorization");
        return {message: "Successfully logged out"};
    } catch (error) {
        return {error: "Something went wrong"};
    }
};

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt_authorization"),
    },
};

export {authCheck, logOut, config, authCheckModerator};
