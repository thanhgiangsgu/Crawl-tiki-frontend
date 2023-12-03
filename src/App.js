import logo from "./logo.svg";
import "./App.css";
import Searchbar from "./components/SearchBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="m-8 flex flex-col justify-center">
        <Routes>
          <Route path="/" element={<Searchbar />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
