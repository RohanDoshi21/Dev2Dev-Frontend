import React, {useEffect, useState} from "react";
import axios from "axios";
import Axios from "axios";
import {Link, useParams} from "react-router-dom";
import {getUserUrl, makeModeratorUrl} from "../constants/urls";
import arrowDown from "../assets/down-arrow.png";
import arrowUp from "../assets/up-arrow.png";
import {authCheckModerator} from "../AuthChecker";
import {toast} from "react-toastify";

const UserProfile = () => {
    const {userId} = useParams();

    const [user, setUser] = useState({});

    const [questions, setQuestions] = useState([]);

    const [isModerator, setIsModerator] = useState(false);

    const fetchUser = async () => {
        const response = await axios.get(getUserUrl + userId);
        const data = response.data.data.user;
        console.log(data);
        return data;
    };

    function formattedDate(createdAt) {
        const date = new Date(createdAt);
        return `${date.getDate()} ${date.toLocaleString("default", {
            month: "short",
        })} ${date.getFullYear()}`;
    }

    function makeModeratorUser() {
        const status = localStorage.getItem("jwt_authorization");

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + status,
            },
        };

        Axios.post(
            makeModeratorUrl,
            {
                email: user.email,
            },
            config
        )
            .then((_) => {
                fetchUser().then((data) => {
                    setUser(data);
                    setQuestions(data.questions);
                });
                toast.success(user.email + " is now a moderator");
            })
            .catch((error) => {
                toast.error(error.response.data.error);
            });
    }

    useEffect(() => {
        fetchUser().then((data) => {
            setUser(data);
            setQuestions(data.questions);
        });
        setIsModerator(authCheckModerator());
    }, []);

    return (
        <div className="flex flex-col items-center justify-center mx-36 bg-cover">
            <div className="max-w-xs mx-auto rounded overflow-hidden shadow-lg mt-10">
                <img
                    className="w-full"
                    src={user.dpUrl || "/default-avatar.png"}
                    alt="User Avatar"
                />
                <div className="px-6 py-4">
                    <div
                        className="font-bold text-xl mb-2 text-[#0A2647]">{`${user.first_name} ${user.last_name}`}</div>
                    <p className="text-gray-700 text-base mb-2">Email: {user.email}</p>
                    <p className="text-gray-700 text-base mb-2">
                        Phone Number: {user.phone_number}
                    </p>
                    <p className="text-gray-700 text-base mb-2">Role: {user.role}</p>
                    <p className="text-gray-700 text-base mb-2">
                        Member Since: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    {isModerator && user.role === "USER" && (
                        <button
                            onClick={makeModeratorUser}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                            Make Moderator
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
                <h1 className="text-2xl font-bold text-gray-700">Questions Asked</h1>
            </div>
            {/* <div className="flex flex-col mx-36 justify-center items-center  bg-cover"> */}
            {questions.map((question) => (
                <Link
                    to={`/question/${question.id}`}
                    className="w-full bg-opacity-50 bg-white"
                >
                    <div
                        className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 mt-8 relative w-full">
                        <div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
                            <button
                                className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
                                aria-label="Upvote"
                            >
                                <img
                                    src={arrowUp}
                                    className="h-5 w-5 mx-2"
                                    alt="up arrow"
                                ></img>

                                <span className="text-xs font-medium">{question.upvotes}</span>
                            </button>
                            <button
                                className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
                                aria-label="Downvote"
                            >
                                <img
                                    src={arrowDown}
                                    className="h-5 w-5 mx-2"
                                    alt="up arrow"
                                ></img>
                                <span className="text-xs font-medium">
                  {question.downvotes}
                </span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 mb-2 w-full">
                            <div className="items-start justify-start text-start">
                                <div className="flex flex-row">
                                    <h2 className="text-lg font-medium text-[#2C74B3] text-bold mr-2">
                                        {question.title}
                                        <span
                                            className={`${
                                                question.status === "OPEN"
                                                    ? "bg-[#a6f1c6] text-[#15452a]"
                                                    : "bg-[#fb919d] text-[#bc3646]"
                                            } pb-1  mx-2 rounded-full px-2 py-1 text-xs font-medium`}
                                        >
                      {question.status}
                    </span>
                                    </h2>
                                </div>
                                <div className="text-gray-700 mb-2">{question.description}</div>
                            </div>
                            <div
                                className="text-gray-600 inline-flex w-full items-start justify-start text-[0.85rem] space-x-2">
                                {question.tag != null &&
                                    question.tag.length > 0 &&
                                    question.tag.map((tag) => (
                                        <div
                                            key={tag}
                                            className="flex rounded-lg p-[0.35rem] px-2 h-fit w-fit text-[#215e93] bg-[#c8dff5]"
                                        >
                                            {tag}
                                        </div>
                                    ))}
                            </div>

                            <div
                                className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
                                {user.email} • Posted on {formattedDate(question.created_at)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        // </div>
    );
};

export default UserProfile;
