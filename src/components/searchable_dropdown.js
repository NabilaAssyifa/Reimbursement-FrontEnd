import { useEffect, useRef, useState } from "react";
import dropIcon from "../assets/icons/dropIcon.svg";

export default function SearchableDropdown({
  defaultMessage,
  contents,
  initialValue,
  setValue,
  isLoading,
  customStyle,
  onChange,
}) {
  const inputRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState("");
  const [selected, setSelected] = useState(undefined);

  useEffect(() => {
    if (initialValue) {
      if (contents.length > 0) {
        console.log("initialValue is " + initialValue);
        setSelected(
          contents.findIndex(
            (c) => c.value === initialValue || c.label === initialValue
          )
        );
      }
    }
  }, [initialValue, contents]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selected !== undefined) setValue(contents[selected].value);
    else setValue(undefined);
  }, [selected]);

  return (
    <div
      className={`${
        customStyle ??
        "w-full p-2 bg-gray-300 rounded-lg flex justify-start items-center relative"
      }`}
      onClick={() => {
        if (!isLoading) setIsOpen(!isOpen);
      }}
    >
      <input
        className="bg-transparent w-full focus:outline-none"
        ref={inputRef}
        placeholder={
          isLoading ? "Loading..." : defaultMessage ?? "-Pilih Opsi-"
        }
        value={
          isLoading
            ? "Loading..."
            : selected !== undefined
            ? contents[selected].label
            : searching
        }
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          setSearching(e.target.value);
          setSelected(undefined);
        }}
        disabled={!isOpen}
      />
      <img src={dropIcon} className="cursor-pointer" />
      {isOpen ? (
        <DropdownContents
          defaultMessage={defaultMessage}
          contents={contents}
          searching={searching}
          setSelected={setSelected}
          setIsOpen={setIsOpen}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}

function DropdownContents({
  defaultMessage,
  contents,
  searching,
  setSelected,
  setIsOpen,
  onChange,
}) {
  const initialContents = useRef(contents);
  const containerElement = useRef();
  const [atTop, setAtTop] = useState(false);

  const handleClickOutside = (event) => {
    if (
      containerElement.current &&
      !containerElement.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
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
      <li
        onClick={() => setSelected(undefined)}
        className="p-2 hover:bg-gray-400 cursor-pointer"
      >
        {defaultMessage ?? "-Pilih Opsi-"}
      </li>
      {contents.length > 0 ? (
        contents
          .filter((c) =>
            c.label.toLowerCase().includes(searching.toLowerCase())
          )
          .map((c, i) => {
            return (
              <li
                key={i}
                className="p-2 hover:bg-gray-400 cursor-pointer"
                onClick={() => {
                  initialContents.current.forEach((ic, ii) => {
                    if (ic.value === c.value) setSelected(ii);
                  });

                  if (typeof onChange === "function") onChange(c);
                }}
              >
                {c.label}
              </li>
            );
          })
      ) : (
        <li>Opsi Tidak Ditemukan</li>
      )}
    </ul>
  );
}
