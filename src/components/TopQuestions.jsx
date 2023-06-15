import Axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Select from "react-select";
import arrowDown from "../assets/down-arrow.png";
import arrowUp from "../assets/up-arrow.png";
import {getQuestionsUrl} from "../constants/urls";
import QuestionPageSwitcher from "./QuestionPageSwitcher";
import CreateQuestion from "./CreateQuestion";
import formattedDate from "../utils/dateFormattor";

const fetchTopQuestions = async (option, page) => {
    let response = await fetch(`${getQuestionsUrl}?page=${page}&sort=${option}`);
    const data = await response.json();
    return data["data"];
};

const fetchTotalPages = async () => {
    let response = await Axios.post(getQuestionsUrl + "/total_pages");
    return response["data"]["data"];
};

const options = [
    {value: "most_recent", label: "Most recent"},
    {value: "oldest", label: "Oldest"},
    {value: "most_upvoted", label: "By upvote"},
    {value: "most_answered", label: "Most answered"},
];

const TopQuestions = () => {
    const [questions, setQuestions] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const defaultValue = options[0];
    const [selectedOption, setSelectedOption] = useState(defaultValue);

    useEffect(() => {
        fetchTopQuestions(selectedOption["value"], currentPage).then((data) => {
            setQuestions(data["questions"]);
        });

        fetchTotalPages().then((data) => {
            setTotalPages(data["totalPages"]);
        });
    }, [currentPage, selectedOption]);

    const onPageChange = async (newPage) => {
        setCurrentPage(newPage);
        fetchTopQuestions(selectedOption["value"], newPage).then((data) => {
            setQuestions(data["questions"]);
        });
    };

    return (
        <div className="flex flex-col mx-36 justify-center items-center bg-cover">
            {/*Create Question Component*/}
            <CreateQuestion/>
            {
                <Select
                    className="rounded-2xl"
                    options={options}
                    isSearchable={false}
                    isClearable={false}
                    value={selectedOption}
                    onChange={(opt) => {
                        setSelectedOption(opt);
                        fetchTopQuestions(opt["value"], currentPage).then((data) =>
                            setQuestions(data["questions"])
                        );
                    }}
                />
            }
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
                                <div className="text-gray-700 mb-2">
                                    <div
                                        className="overflow-hidden"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {question.description}
                                    </div>
                                </div>
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
                                {question.owner.email} • Posted on{" "}
                                {formattedDate(question.created_at)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <div className="mb-10">
                <QuestionPageSwitcher
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default TopQuestions;
