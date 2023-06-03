import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import arrrowDown from "../assets/down-arrow.png";
import arrrowUp from "../assets/up-arrow.png";
import { searchURL } from "../constants/urls";
import Header from "./Header";

const SearchPage = () => {
  const { query } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    console.log(searchURL + query);

    fetch(searchURL + query)
      .then((response) => response.json())
      .then((data) => setQuestions(data["data"]["questions"]))
      .catch((error) => console.error(error));

  }, [questions]);

  function formatedDate(createdAt) {
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
    return formattedDate;
  }

  console.log("Inside search page", questions);

  return (
    <div>
      <Header />
      <div className="flex flex-col mx-36 justify-center items-center  bg-cover">
        <div className="w-full item-start justify-start">
          <div className="my-6 text-start text-xl font-medium text-gray-700">
            Search Results for:{" "}
            <span className="text-[#2C74B3]"> {query} </span>{" "}
          </div>
        </div>
        {questions.map((question) => (
          <Link
            to={`/question/${question.id}`}
            className="w-full bg-opacity-50 bg-white"
          >
            <div className="border-gray-200 shadow-md border flex flex-row gap-8 rounded-lg p-4 mb-3 relative w-full">
              <div className="flex flex-col items-end  gap-4 justify-center  mr-2  w-[1rem]">
                <button
                  className="text-gray-600 hover:text-gray-800 flex  flex-row focus:outline-none focus:text-gray-800"
                  aria-label="Upvote"
                >
                  <img
                    src={arrrowUp}
                    className="h-5 w-5 mx-2"
                    alt="up arrow"
                  ></img>

                  <span className="text-xs font-medium">
                    {question.upvotes}
                  </span>
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800 flex flex-row  focus:outline-none focus:text-gray-800"
                  aria-label="Downvote"
                >
                  <img
                    src={arrrowDown}
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
                  <div className="text-gray-700 mb-2">
                    {question.description}
                  </div>
                </div>
                <div className="text-gray-600 text-end items-end justify-end text-xs absolute bottom-3 right-5">
                  {question.email} • Posted on{" "}
                  {formatedDate(question.created_at)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
