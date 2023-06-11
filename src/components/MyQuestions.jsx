import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import arrowDown from "../assets/down-arrow.png";
import arrowUp from "../assets/up-arrow.png";
import { getMyQuestionsUrl } from "../constants/urls";
import { getQuestionsUrl } from "../constants/urls";
import { toast } from "react-toastify";
import { authCheck } from "../AuthChecker";

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

  function formattedDate(createdAt) {
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
    return formattedDate;
  }

  const [postQuestion, setPostQuestion] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [tagList, setTagList] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue === "") return;
    setTagList([...tagList, inputValue]);
    setInputValue("");
  };

  const removeTag = (tag) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  async function postQuestionBackend() {
    const status = localStorage.getItem("jwt_authorization");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + status,
      },
    };

    Axios.post(
      getQuestionsUrl,
      {
        title: title,
        description: description,
        tag: tagList,
      },
      config
    ).then((response) => {
      toast.success("Question posted successfully");
      fetchMyQuestions().then((data) => {
        setQuestions(data["questions"]);
      });
      setPostQuestion(false);
    });
  }

  function handleOnClick() {
    if (!authCheck()) {
      toast.warn("You need to be logged in to post a question");
    } else {
      setPostQuestion(true);
    }
  }

  return (
    <div className="flex flex-col mx-36 justify-center items-center  bg-cover my-5">
      {/* Post a question button */}
      <div className="justify-center items-center w-2/5 flex">
        {postQuestion === false && (
          <button
            onClick={handleOnClick}
            className="bg-[#0A2647] hover:bg-[#2C74B3] text-white font-bold  w-full py-2 px-4 rounded-2xl mb-4 my-3"
          >
            Post a question
          </button>
        )}
      </div>
      {
        // Create a form to post a question
        postQuestion === true && (
          <div className="flex flex-col mx-auto w-3/5 mb-10 p-2">
            <div className="justify-center items-center">
              <button
                onClick={() => {
                  setPostQuestion(false);
                }}
                className="bg-[#0A2647] hover:bg-[#2C74B3] text-white font-bold  w-3/4 py-2 px-4 rounded-2xl mb-4 my-3"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-col mx-auto w-full border-[1px] p-8 rounded-xl shadow-lg mb-2">
              <div className="flex flex-col mb-4 align-start justify-start items-start ">
                <label
                  className="mb-1 font-normal text-xl text-[#144272] rounded "
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="border py-2 px-3 text-grey-800 w-full rounded"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter your question here"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col mb-4 align-start justify-start items-start">
                <label
                  className="mb-1 font-normal text-xl text-[#144272]"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="border py-2 px-3 text-grey-800 w-full rounded"
                  name="description"
                  id="description"
                  placeholder="Enter the description of your question here"
                  cols="30"
                  rows="10"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="flex flex-col mb-4 align-start justify-start items-start ">
                <div className="inline-flex items-center justify-center mb-2">
                  <div className="mb-1 font-normal text-xl text-center h-full  p-[0.35rem] text-[#144272] rounded mr-2">
                    Tags
                  </div>
                  <div className="w-full inline-flex space-x-2">
                    {tagList.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-center rounded-lg p-[0.35rem] px-2 h-fit w-fit text-[#215e93] bg-[#c8dff5]"
                      >
                        {tag}
                        <button
                          className="ml-3"
                          onClick={() => {
                            removeTag(tag);
                          }}
                        >
                          {" "}
                          ✕{" "}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="inline-flex w-full space-x-3">
                  <input
                    className="border py-2 px-3 text-grey-800 w-full rounded"
                    type="text"
                    name="tag"
                    id="tag"
                    placeholder="Add a tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button
                    className="bg-[#144272] hover:bg-[#2C74B3] text-white  text-[2rem] px-4 text-center items-center justify-center rounded-xl h-fit w-fit"
                    onClick={handleAddTag}
                  >
                    {" "}
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={postQuestionBackend}
                className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl"
              >
                Post
              </button>
            </div>
          </div>
        )
      }
      {questions.map((question) => (
        <Link
          to={`/question/${question.id}`}
          className="w-full bg-opacity-50 bg-white"
        >
          <div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-8 relative w-full">
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
              <div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
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
