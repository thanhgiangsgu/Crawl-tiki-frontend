import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiFillHeart } from "react-icons/ai";
import CardItem from "./CardItem";
import Ring from "./Ring";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SearchBar = () => {
  const [activeSearch, setActiveSearch] = useState([]);
  const [listData, setListData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [name, setName] = useState(searchParams.get("name") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu với trạng thái isLoading là true
  const sortingOptions = {
    default: "Phổ biến",
    top_seller: "Bán chạy",
    newest: "Hàng mới",
    price_asc: "Giá thấp đến cao", // Modified key
    price_desc: "Giá cao đến thấp", // Example of another modified key
  };
  let sort = searchParams.get("sort") || "default";
  const [selectedItem, setSelectedItem] = useState(sortingOptions[sort]);

  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page"), 10) - 1
    : -1;
  const [pageCount, setPageCount] = useState(10);

  const handleProductSuggestions = async (e) => {
    if (e.target.value === "") {
      setName("");
      setActiveSearch([]);
      return false;
    }
    setName(e.target.value);
    const res = await axios.get(
      `https://crawl-tiki-backend-thanhgiangsgu.vercel.app/crawl/load-product-suggestions/${e.target.value}`
    );
    setActiveSearch(res.data);
  };

  const handleClick = (value) => {
    setActiveSearch([]);
    setName(value);
    handleSearch();
  };

  useEffect(() => {
    if (name) {
      setIsLoading(true);
      // Gọi hàm loadData với giá trị name
      loadData(name);
    }
  }, []);

  const loadData = (name) => {
    if (sort == "price_asc") {
      sort = "price,asc";
    } else if (sort == "price_desc") {
      sort = "price,desc";
    }
    const payload = {
      limit: 40,
      include: "advertisement",
      aggregations: 2,
      version: "home-persionalized",
      trackity_id: "43c243c4-c377-0e68-389f-44db0ab4d6a6",
      page: currentPage + 1,
      urlKey: name,
      sort: sort,
    };
    axios
      .post(
        "https://crawl-tiki-backend-thanhgiangsgu.vercel.app/crawl/data",
        payload
      )
      .then((response) => {
        setListData(response.data.fullData);
        setPageCount(response.data.pageCount);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const exportToJson = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Use XLSX.write to convert the workbook to a binary string
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(excelBuffer)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger a click event to download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Utility function to convert a binary string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const handleSearch = () => {
    if (name == "") {
      toast.error("Vui lòng nhập thông tin sản phẩm", {
        position: "top-right",
      });
    } else {
      window.location.href = `/?name=${name}&page=1`;
    }
  };

  const handlePageClick = (selected) => {
    window.location.href = `/?name=${name}&page=${
      selected.nextSelectedPage + 1
    }&sort=${sort}`;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (option) => {
    setSelectedItem(sortingOptions[option]);
    window.location.href = `/?name=${name}&page=1
    }&sort=${option}`;
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative">
          <input
            type="input"
            value={name}
            name="name"
            placeholder="Type Here"
            onChange={(e) => handleProductSuggestions(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full p-4 rounded-full bg-state-800 text-gray-800 placeholder-gray-400 border-2 border-solid border-black p-4 min-w-[400px] sm:min-w-[40vw]"
          />

          <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-state-900 rounded-full">
            <AiOutlineSearch onClick={handleSearch} />
          </button>
        </div>

        {listData.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between w-full mt-6">
            {/* Xuất file Json và Excel */}
            <div className="relative flex flex-col md:flex-row items-center mb-2 md:mb-0">
              <button
                onClick={() => exportToJson(listData)}
                className="bg-pink-100 border-2 rounded-full p-2 mb-2 md:mb-0 md:mr-2 w-full min-w-[200px]"
              >
                Xuất file Json
              </button>
              <button
                onClick={() => exportToExcel(listData)}
                className="bg-orange-100 border-2 rounded-full p-2 mb-2 md:mb-0 md:mr-2 w-full min-w-[200px]"
              >
                Xuất file Excel
              </button>
            </div>

            {/* Dropdown sắp xếp */}
            <div className="flex items-center bg-gray-100 border-2 rounded-full p-2 justify-center">
              <div className="mr-2">Sắp xếp</div>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-800"
                >
                  <span className="mr-5">{selectedItem}</span>
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/catalog/arrow.svg"
                    alt="arrow"
                    className="w-4 h-4"
                  />
                </button>
                {isOpen && (
                  <div className="absolute z-10 mt-2 p-2 bg-white border rounded shadow-md w-40 ">
                    <div
                      onClick={() => handleItemClick("default")}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      Phổ biến
                    </div>
                    <div
                      onClick={() => handleItemClick("top_seller")}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      Bán chạy
                    </div>
                    <div
                      onClick={() => handleItemClick("newest")}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      Hàng mới
                    </div>
                    <div
                      onClick={() => handleItemClick("price_asc")}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      Giá thấp đến cao
                    </div>
                    <div
                      onClick={() => handleItemClick("price_desc")}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      Giá cao đến thấp
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSearch.length > 0 && (
          <div className="bg-gray-100 border-2 absolute top-20 p-4 bg-state-800 text-white rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2 flex flex-col justify-center min-w-[400px] sm:min-w-[50%]">
            {activeSearch.map((s) => (
              <span
                key={s.url}
                className="text-gray-800 hover:bg-gray-200 cursor-pointer inline-block p-2 rounded"
                onClick={() => handleClick(s.keyword)}
              >
                {s.keyword}
              </span>
            ))}
          </div>
        )}
      </div>
      {listData.length > 0 && (
        <div className="flex flex-col justify-center items-center mt-20 mx-auto">
          <div className="flex grid grid-cols-1 sm:grid-cols-50 md:grid-cols-50 lg:grid-cols-33 xl:grid-cols-25 gap-4 mt-20 justify-around items-center mx-auto">
            {isLoading ? ( // Kiểm tra nếu đang loading thì hiển thị component <Ring />
              <Ring />
            ) : (
              // Nếu không phải đang loading thì hiển thị dữ liệu
              <>
                <div className="flex flex-wrap justify-center items-center">
                  {listData.map((item) => (
                    <CardItem key={item.id} item={item} />
                  ))}
                </div>
                <div className="pagination-container xl:grid-cols-4">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onClick={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    initialPage={currentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
