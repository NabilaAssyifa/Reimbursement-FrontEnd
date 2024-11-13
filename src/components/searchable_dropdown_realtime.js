import { useEffect, useRef, useState } from "react";
import dropIcon from "../assets/icons/dropIcon.svg";

export default function SearchableDropdownRealtime({
  defaultMessage,
  customStyle,
  onChange,
  changeFind,
}) {
  const inputRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(undefined);

  const [contents, setContents] = useState([]);
  const [noSearch, setNoSearch] = useState(true);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.select();
    }
  }, [isOpen]);

  return (
    <div
      className={`${
        customStyle ??
        "w-full p-2 bg-gray-300 rounded-lg flex justify-start items-center relative"
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <input
        className="bg-transparent w-full focus:outline-none"
        ref={inputRef}
        placeholder={defaultMessage ?? "-Pilih Opsi-"}
        value={selected ? selected.label : searching}
        onClick={(e) => e.stopPropagation()}
        onChange={async (e) => {
          if (e.target.value) {
            if (typeof changeFind === "function") {
              setSearching(e.target.value);
              setNoSearch(false);
              setLoading({ loading: true, error: false });
              const response = await changeFind(e.target.value, setContents);
              if (!response || response.error) {
                console.log(response);
                return setLoading({ loading: true, error: true });
              }

              setLoading({ loading: false, error: false });
            }
          } else {
            setContents([]);
            setSearching("");
            setNoSearch(true);
          }
        }}
        disabled={!isOpen}
      />
      <img src={dropIcon} className="cursor-pointer" />
      {isOpen ? (
        <DropdownContents
          defaultMessage={defaultMessage}
          contents={contents}
          setSelected={setSelected}
          setIsOpen={setIsOpen}
          loading={loading}
          noSearch={noSearch}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}

function DropdownContents({
  defaultMessage,
  contents,
  setSelected,
  setIsOpen,
  loading,
  noSearch,
  onChange,
}) {
  const initialContents = useRef(contents);
  const containerElement = useRef();
  const [atTop, setAtTop] = useState(false);

  const handleClickOutside = (event) => {
    if (
      containerElement.current &&
      !containerElement.current.contains(event.target)
    )
      setIsOpen(false);
  };

  useEffect(() => {
    const rect = containerElement.current.getBoundingClientRect();
    // Moves contents to top of dropdown if overflowing the screen
    if (rect.y + rect.height > window.innerHeight) setAtTop(true);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul
      ref={containerElement}
      className={`absolute w-full bg-gray-300 p-2 ${
        atTop ? "top" : "bottom"
      }-0 left-0 overflow-y-scroll rounded-lg z-10 max-h-48`}
      style={{ transform: `translateY(${atTop ? "-100%" : "60%"})` }}
    >
      {loading.loading ? (
        !loading.error ? (
          <li className="p-2">Loading...</li>
        ) : (
          <li className="p-2">Gagal Mengambil Data</li>
        )
      ) : (
        <>
          <li
            onClick={() => {
              setSelected(undefined);
              onChange({ value: undefined, label: undefined });
            }}
            className="p-2 hover:bg-gray-400 cursor-pointer"
          >
            {defaultMessage ?? "-Pilih Opsi-"}
          </li>
          {contents.length > 0 ? (
            contents.map((c, i) => {
              return (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-400 cursor-pointer"
                  onClick={() => {
                    initialContents.current.forEach((ic) => {
                      if (ic.value === c.value) setSelected(ic);
                    });

                    if (typeof onChange === "function") onChange(c);
                  }}
                >
                  {c.label}
                </li>
              );
            })
          ) : !noSearch ? (
            <li className="p-2">Opsi Tidak Ditemukan</li>
          ) : (
            <li className="p-2">Ketik Untuk Mulai Pencarian</li>
          )}
        </>
      )}
    </ul>
  );
}
