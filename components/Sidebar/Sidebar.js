import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAppContext } from "../../context/map";
import ReviewItem from "../ReviewItem/ReviewItem";

function Sidebar() {
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  const map = useAppContext();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
    let user = JSON.parse(localStorage.getItem("session"));

    axios
      .post("https://fuber.vercel.app/api/getReview", {
        params: {
          id: user.id,
        },
      })
      .then((res) => {
        setReviews(res.data);
      });
  }, []);

  return (
    <div className="">
      <h1 className="text-3xl font-extrabold p-[0.75rem]">
        Good evening, {user.name?.split(" ")[0]}
      </h1>
      <h1 className="bg-white text-black text-2xl font-extrabold p-[0.75rem] bg-[#f5f5f5]">
        Earned Reviews
      </h1>
      {reviews?.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}

export default Sidebar;
