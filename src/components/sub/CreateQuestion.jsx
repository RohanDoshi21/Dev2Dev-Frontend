import React, { useState } from "react";
import { authCheck } from "../../AuthChecker";
import { toast } from "react-toastify";
import Axios from "axios";
import { getQuestionsUrl } from "../../constants/urls";
import UploadFiles from "./UploadFiles";

const CreateQuestion = () => {
  const [postQuestion, setPostQuestion] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagList, setTagList] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [downloadUrls, setDownloadUrls] = useState([]);

  const handleAddTag = () => {
    if (inputValue === "") return;
    setTagList([...tagList, inputValue]);
    setInputValue("");
  };

  const removeTag = (tag) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  function handleOnClick() {
    if (!authCheck()) {
      toast.warn("You need to be logged in to post a question");
    } else {
      setPostQuestion(true);
    }
  }

  async function postQuestionBackend() {
    if (title.trim() === "") {
      toast.error("Please enter a title for your question");
      return;
    }

    if (description.trim() === "") {
      toast.error("Please enter a description for your question");
      return;
    }

    const status = localStorage.getItem("jwt_authorization");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + status,
      },
    };

    try {
      const response = await Axios.post(
        getQuestionsUrl,
        {
          title: title,
          description: description,
          tag: tagList,
        },
        config
      );

      const questionId = response.data.data.question.id;

      downloadUrls.forEach((url) => {
        Axios.post(
          getQuestionsUrl + "/add_component",
          {
            questionId,
            componentType: "IMAGE",
            content: url,
          },
          config
        ).then(() => {
          console.log("Image Added");
        });
      });

      toast.success("Question created successfully");
      setPostQuestion(false);
    } catch (e) {
      toast.error("Cannot create a question");
    }
  }

  return (
    <div className="justify-center items-center bg-cover w-2/3 flex flex-col">
      <div className="justify-center items-center flex w-2/3">
        {postQuestion === false && (
          <button
            onClick={handleOnClick}
            className="bg-[#0A2647] hover:bg-[#2C74B3] text-white font-bold w-full py-2 px-4 rounded-2xl mb-4 my-3"
          >
            Post a question
          </button>
        )}
      </div>
      {
        // Create a form to post a question
        postQuestion === true && (
          <div className="flex flex-col mb-5 p-2 w-3/4 justify-center items-center">
            <div className="justify-center items-center flex w-2/3">
              <button
                onClick={() => {
                  setPostQuestion(false);
                }}
                className="bg-[#144272] hover:bg-[#2C74B3] text-white  text-myfont font-bold rounded-2xl py-2 px-4 mb-4 my-3"
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
                <UploadFiles
                  downloadUrls={downloadUrls}
                  setDownloadUrls={setDownloadUrls}
                />
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
    </div>
  );
};

export default CreateQuestion;
