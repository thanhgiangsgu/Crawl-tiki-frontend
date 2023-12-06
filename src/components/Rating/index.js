// Rating.js
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "./Rating.css";

const Rating = ({ rating }) => {
  return (
    <div className="rating">
      <div className="rating__average">
        <h1>{rating.toFixed(1)}</h1>
        <div className="star-outer">
          <div
            className="star-inner"
            style={{ width: `${rating * 20}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Rating;
