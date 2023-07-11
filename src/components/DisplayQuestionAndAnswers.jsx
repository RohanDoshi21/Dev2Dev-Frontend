import Axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authCheck, authCheckModerator } from "../AuthChecker";
import arrowDown from "../assets/down-arrow.png";
import arrowUp from "../assets/up-arrow.png";
import {
  answerUrl,
  changeStatusUrl,
  deleteMyQuestion,
  getQuestionsUrl,
  voteAnswerUrl,
  voteQuestionUrl,
} from "../constants/urls";
import formattedDate from "../utils/dateFormattor";
import CodeHighlight from "./sub/CodeHighlighter";
import SpinnerComponent from "./sub/SpinnerComponent";

const fetchQuestionById = async (id) => {
  let response = await fetch(getQuestionsUrl + "/" + id);

  const data = await response.json();
  return data["data"]["question"];
};

const fetchAnswersByQuestionId = async (id) => {
  let response = await fetch(answerUrl + "/" + id);

  const data = await response.json();
  return data["data"]["answers"];
};

const DisplayQuestionAndAnswers = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [addAnswerVariable, setAddAnswerVariable] = useState("");
  //   const jwt_token = localStorage.getItem("jwt_authorization");
  const userID = localStorage.getItem("userID");

  const [isMyQuestion, updateIsMyQuestion] = useState(
    userID === question["ownerId"]
  );

  const [email, setEmail] = useState("");

  const history = useHistory();

  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
    fetchQuestionById(id).then((data) => {
      setQuestion(data);
      updateIsMyQuestion(data["ownerId"] === userID);
      setEmail(data["owner"]["email"]);
      setLoading(false);
    });
    setIsModerator(authCheckModerator());
  }, [id, userID]);

  const addAnswer = async () => {
    if (!authCheck()) {
      toast.warn("Please Login to answer");
      return;
    }

    const status = localStorage.getItem("jwt_authorization");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + status,
      },
    };

    Axios.post(
      answerUrl,
      {
        description: addAnswerVariable,
        question: id,
      },
      config
    )
      .then((_) => {
        setAddAnswerVariable("");
        fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
        toast.success("Answer Added Successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  const addVote = async (id, vote, type) => {
    if (!authCheck()) {
      toast.error("Please Login to vote");
      return;
    }

    const status = localStorage.getItem("jwt_authorization");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + status,
      },
    };

    const typeQ = type === "question" ? voteQuestionUrl : voteAnswerUrl;

    Axios.put(
      typeQ + id,
      {
        vote: vote,
      },
      config
    )
      .then((_) => {
        if (type === "question") {
          fetchQuestionById(id).then((data) => setQuestion(data));
        } else {
        }
        fetchAnswersByQuestionId(id).then((data) => setAnswers(data));
        toast.success("Vote Added Successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  const handleDelete = async (id) => {
    const res = await fetch(deleteMyQuestion + `/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt_authorization"),
      },
    });
    await res.json();
    history.goBack();
  };

  const handleStatusChange = async (id, questionStatus) => {
    const status = localStorage.getItem("jwt_authorization");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + status,
      },
    };

    Axios.patch(
      changeStatusUrl,
      {
        questionId: id,
        status: questionStatus,
      },
      config
    )
      .then((_) => {
        fetchQuestionById(id).then((data) => setQuestion(data));
        toast.success("Status Changed Successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  return (
    <div className="mx-36 py-5 bg-opacity-50 bg-white">
      {loading ? (
        <SpinnerComponent />
      ) : (
        <div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
          <div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
            <button
              className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
              aria-label="Upvote"
              onClick={() => addVote(question.id, 1, "question")}
            >
              <img src={arrowUp} className="h-5 w-5 mx-2" alt="up arrow"></img>

              <span className="text-xs font-medium">{question.upvotes}</span>
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
              aria-label="Downvote"
              onClick={() => addVote(question.id, -1, "question")}
            >
              <img
                src={arrowDown}
                className="h-5 w-5 mx-2"
                alt="up arrow"
              ></img>
              <span className="text-xs font-medium">{question.downvotes}</span>
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-2  w-full">
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
              <div className="text-gray-700 mb-2 whitespace-pre-wrap">
                <CodeHighlight description={question.description} />
              </div>
            </div>
            <div className="text-gray-600 inline-flex w-full items-start justify-start text-[0.85rem] space-x-2">
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
            <div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
              {email} • Posted on {formattedDate(question.created_at)}
            </div>

            {isMyQuestion && (
              <button onClick={() => handleDelete(question.id)}>
                <FaTrash />
              </button>
            )}

            {isModerator && (
              <div className="flex items-center">
                {question.status === "OPEN" ? (
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    onClick={() => handleStatusChange(question.id, "CLOSED")}
                  >
                    Close
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    onClick={() => handleStatusChange(question.id, "OPEN")}
                  >
                    Open
                  </button>
                )}
              </div>
            )}

            {/* Display question components */}
            {question.questionComponents &&
              Array.isArray(question.questionComponents) && (
                <div className="flex overflow-x-auto">
                  {question.questionComponents.map((component) => {
                    if (component.component === "TEXT") {
                      return (
                        <div
                          key={component.id}
                          className="text-gray-600 mb-2 mr-2 bg-white rounded-lg shadow-md border p-2"
                        >
                          {component.content}
                        </div>
                      );
                    } else if (component.component === "VIDEO") {
                      return (
                        <div
                          key={component.id}
                          className="text-gray-600 mb-2 mr-2 bg-white rounded-lg shadow-md border p-2"
                        >
                          <iframe
                            width="560"
                            height="315"
                            src={component.content}
                            title="Video Component"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      );
                    } else if (component.component === "IMAGE") {
                      return (
                        <div
                          key={component.id}
                          className="flex items-center mb-2 mr-2 bg-white rounded-lg shadow-md border p-2"
                        >
                          <a
                            href={component.content}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={component.content}
                              alt=""
                              className="max-h-80 max-w-80 rounded-lg"
                            />
                          </a>
                        </div>
                      );
                    } else {
                      return null; // Handle other component types if needed
                    }
                  })}
                </div>
              )}
          </div>
        </div>
      )}

      <div className="flex flex-col mt-4">
        <div className="flex flex-row">
          <div className="text-base font-medium mb-1 text-gray-500">
            {answers.length} Answers
          </div>
        </div>
      </div>
      {loading ? (
        <SpinnerComponent />
      ) : (
        answers.map((answer) => (
          <div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
            <div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
              <button
                className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
                aria-label="Upvote"
                onClick={() => addVote(answer.id, 1, "answer")}
              >
                <img
                  src={arrowUp}
                  className="h-5 w-5 mx-2"
                  alt="up arrow"
                ></img>

                <span className="text-xs font-medium">{answer.upvotes}</span>
              </button>
              <button
                className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
                aria-label="Downvote"
                onClick={() => addVote(answer.id, -1, "answer")}
              >
                <img
                  src={arrowDown}
                  className="h-5 w-5 mx-2"
                  alt="up arrow"
                ></img>
                <span className="text-xs font-medium">{answer.downvotes}</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-2">
              <div className="items-start justify-start text-start">
                <div className="text-gray-700 mb-2 whitespace-pre-wrap">
                  <CodeHighlight description={answer.description} />
                </div>
              </div>
              <div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
                {answer.owner.email} • Posted on{" "}
                {formattedDate(answer.created_at)}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Display the form to add an answer */}
      <div className="border border-gray-200 shadow-lg rounded-lg px-8 mb-1 py-3">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="text-base font-medium mb-1 text-gray-500">
              Add an Answer
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                rows="4"
                placeholder="Enter your answer"
                value={addAnswerVariable}
                onChange={(e) => setAddAnswerVariable(e.target.value)}
              />
            </div>

            <div className="flex flex-row my-2">
              <div className="text-sm text-gray-500">
                <button
                  className="bg-[#144272] hover:bg-[#2C74B3] text-white  py-2 px-4 rounded-2xl w-32"
                  type="button"
                  onClick={addAnswer}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayQuestionAndAnswers;
