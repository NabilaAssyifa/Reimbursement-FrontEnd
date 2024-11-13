import { useContext, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { MobileContext } from "../providers/MobileProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchBar({ placeholder, onSearch, clearOnSearch }) {
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const [searchInput, setSearchInput] = useState("");

  function handleSubmit() {
    if (onSearch) onSearch(searchInput);
    if (clearOnSearch) setSearchInput("");
  }

  return (
    <div
      className={`w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 flex ${
        isMobile ? "" : ""
      } justify-between items-center gap-2`}
    >
      <FontAwesomeIcon icon={faSearch} className="w-5 text-gray-500" />
      <input
        className="w-full outline-none basis-0 grow h-8 bg-transparent focus:outline-none text-xs"
        placeholder={placeholder ?? "Lakukan pencarian..."}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      {!isMobile ? (
        <button
          className="p-2 text-white bg-black text-xs font-bold rounded-full min-w-24"
          onClick={handleSubmit}
        >
          Cari
        </button>
      ) : null}
    </div>
  );
}
