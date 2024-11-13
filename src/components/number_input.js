import { useEffect, useState } from "react";

export default function NumberInput({ value, setValue }) {
  const [num, setNum] = useState(value ?? 0);

  function handleChange(inc) {
    if (inc) {
      if (!num) setNum(1);
      else setNum(num + 1);
    } else {
      if (!num) setNum(0);
      else setNum(num - 1);
    }
  }

  useEffect(() => {
    if (setValue) setValue(num);
  }, [num]);

  return (
    <div className="w-full flex flex-row items-center justify-evenly">
      {/* I absolutely fucking hate this */}
      <button
        className="p-2 bg-blue bg-gray-700 hover:bg-gray-600 rounded-lg"
        style={{ height: "auto", aspectRatio: "1/1" }}
        onClick={() => handleChange(false)}
      >
        <p
          className="text-white font-bold"
          style={{
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          -
        </p>
      </button>
      <input
        type="number"
        value={num}
        onChange={(e) => setNum(parseInt(e.target.value))}
        className="text-center focus:outline-none bg-transparent grow min-w-0 px-2 basis-auto"
      />
      <button
        className="p-2 bg-blue bg-gray-700 hover:bg-gray-600 rounded-lg"
        style={{ height: "auto", aspectRatio: "1/1" }}
        onClick={() => handleChange(true)}
      >
        <p
          className="text-white font-bold"
          style={{
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          +
        </p>
      </button>
    </div>
  );
}
