import Axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import arrowDown from "../assets/down-arrow.png";
import arrowUp from "../assets/up-arrow.png";
import {getMyQuestionsUrl} from "../constants/urls";
import CreateQuestion from "./sub/CreateQuestion";
import formattedDate from "../utils/dateFormattor";

const fetchMyQuestions = async () => {
    const status = localStorage.getItem("jwt_authorization");

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + status,
        },
    };

    let response = await Axios.get(getMyQuestionsUrl, config);
    const res = await response.data;
    return res["data"];
};

const MyQuestions = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchMyQuestions().then((data) => {
            setQuestions(data["questions"]);
        });
    }, []);

    return (
        <div className="flex flex-col mx-36 justify-center items-center  bg-cover my-5">
            {/*Post Question Component*/}
            <CreateQuestion/>
            {questions.map((question) => (
                <Link
                    to={`/question/${question.id}`}
                    className="w-full bg-opacity-50 bg-white"
                >
                    <div
                        className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-8 relative w-full">
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
                        <div className="flex flex-col gap-3 mb-2">
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
                                className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
                                {question.owner.email} • Posted on{" "}
                                {formattedDate(question.created_at)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MyQuestions;
