import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiFillHeart } from "react-icons/ai";

import { words } from "../lib/data";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [activeSearch, setActiveSearch] = useState([]);
  const [listData, setListData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [name, setName] = useState(searchParams.get("name") || "");
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setName("");
      setActiveSearch([]);
      return false;
    }
    setName(e.target.value);
    setActiveSearch(
      words.filter((w) => w.includes(e.target.value)).slice(0, 8)
    );
  };

  const handleClick = (value) => {
    setActiveSearch([]);
    setName(value);
  };

  useEffect(() => {
    if (name) {
      // Gọi hàm loadData với giá trị name
      loadData(name);
    }
  }, []);

  const loadData = (name) => {
    const payload = {
      limit: 40,
      include: "advertisement",
      aggregations: 2,
      version: "home-persionalized",
      trackity_id: "43c243c4-c377-0e68-389f-44db0ab4d6a6",
      page: 1,
      urlKey: name,
    };
    axios
      .post("https://crawl-tiki-backend.vercel.app/crawl/data", payload)
      .then((response) => {
        setListData(response.data);
        console.log(listData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVisitPage = (e) => {
    const url = `https://tiki.vn/${e.target.name}`;
    window.open(url, "_blank"); // Mở một tab mới
  };

  return (
    <>
      <form className="relative flex flex-col justify-center items-center">
        <div className="relative">
          <input
            type="input"
            value={name}
            name="name"
            placeholder="Type Here"
            onChange={(e) => handleSearch(e)}
            className="w-full p-4 rounded-full bg-state-800 text-gray-800 placeholder-gray-400 focus:outline-none min-w-[500px] border-2 border-solid border-black p-4"
          />

          <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-state-900 rounded-full">
            <AiOutlineSearch />
          </button>
        </div>

        {activeSearch.length > 0 && (
          <div className="bg-gray-100 border-2 absolute top-20 p-4 bg-state-800 text-white rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2 flex flex-col justify-center min-w-[500px]">
            {activeSearch.map((s) => (
              <span
                key={s}
                className="text-gray-800 hover:bg-gray-200 cursor-pointer inline-block p-2 rounded"
                onClick={() => handleClick(s)}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </form>
      <div className="grid grid-cols-4 gap-4 ml-10 mr-10 mt-20">
        {listData.map((item) => (
          <div key={item.id} className="card flex flex-col">
            <img
              className="w-full h-40 object-cover flex-shrink-0 rounded-t-md"
              src={item.thumbnail_url}
              alt={item.name}
            />
            <div className="p-5 flex-col gap-1 flex-shrink-0 bg-white rounded-b-md">
              <div className="flex items-center gap-2">
                <span className="badge">{item.brand_name}</span>
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
                <button>
                  <AiFillHeart className="flex-grow flex justify-center items-left bg-gray-300/6 hover:bg-gray-300/80 transition rounded-md text-5xl p-2" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchBar;
