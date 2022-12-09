import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function index() {
  const [user, setUser] = useState({});
  const Router = useRouter();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/submitReview", {
        params: {
          id: user.id,
          rating: e.target.rating.value,
          feedback: e.target.feedback.value,
          intent: user.intent,
        },
      })
      .then((res) => {
        if (user.intent === "rider") {
          Router.push("/fuberhome");
        } else {
          Router.push("/fuberhomedriver");
        }
      });
  };

  return (
    <div className="flex flex-col mt-[13%]">
      <form
        className="bg-white text-black w-[33%] mx-auto rounded-[8px] p-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-3xl text-black">How was your trip?</h1>
        <div className="flex flex-col">
          <label className="text-xl text-black font-extrabold">
            {user.intent === "rider" ? "Driver" : "Rider"} Rating
          </label>
          <div className="flex flex-row">
            <div className="flex flex-col items-center">
              <input type="radio" name="rating" value="1" />
              <label className="text-black">1</label>
            </div>
            <div className="flex flex-col items-center">
              <input type="radio" name="rating" value="2" />
              <label className="text-black">2</label>
            </div>
            <div className="flex flex-col items-center">
              <input type="radio" name="rating" value="3" />
              <label className="text-black">3</label>
            </div>
            <div className="flex flex-col items-center">
              <input type="radio" name="rating" value="4" />
              <label className="text-black">4</label>
            </div>
            <div className="flex flex-col items-center">
              <input type="radio" name="rating" value="5" />
              <label className="text-black">5</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-xl text-black font-extrabold">
            {user.intent === "rider" ? "Driver" : "Rider"} Feedback
          </label>
          <textarea
            rows={4}
            className="rounded-[8px] p-2  outline outline-1 text-black"
            name="feedback"
          />
        </div>
        <button className="bg-black text-white rounded-[8px] p-2 mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default index;
