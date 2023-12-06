import React from "react";
import { AiFillHeart } from "react-icons/ai";
import Rating from "./Rating";

const CardItem = ({ item }) => {
  const handleVisitPage = (e) => {
    const url = `https://tiki.vn/${e.target.name}`;
    window.open(url, "_blank"); // Mở một tab mới
  };

  return (
    <div key={item.id} className="card flex flex-col">
      <img
        className="w-full h-50 object-cover flex-shrink-0 rounded-t-md"
        src={item.thumbnail_url}
        alt={item.name}
      />
      <div className="p-5 flex-col gap-1 flex-shrink-0 bg-white rounded-b-md">
        <div className="flex items-center gap-2">
          <span className="badge">{item.brand_name}</span>
          <span className="badge">{item.primary_category_name}</span>
        </div>
        <h2 className="product-title" title={item.name}>
          {item.name}
        </h2>

        <div>
          <span className="text-sm font-bold">
            {item.price.toLocaleString("en-US")} VNĐ
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm line-through opacity-50">
              {item.original_price.toLocaleString("en-US")} VND
            </span>
          </div>
        </div>
        <span className="flex items-center mt-1 justify-between">
          <span className="text-xs ml-2 text-gray-500">
            {item.review_count.toLocaleString("en-US")} đánh giá
          </span>
          <span className="text-xs ml-2 text-gray-500">
            {item.quantity_sold && item.quantity_sold.value
              ? item.quantity_sold.value.toLocaleString("en-US")
              : 0}
            {"  "} đã bán
          </span>
        </span>

        <div className="mt-5 flex gap-2 justify-between">
          <button
            name={item.url_path}
            className="button-primary"
            onClick={handleVisitPage}
          >
            Visit Page
          </button>
          {item.rating_average != 0 && <Rating rating={item.rating_average} />}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
