import { useContext, useState } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";
import warningIcon from "../../assets/icons/warningIcon.svg";

import PopupContainer from "../popup_container";
import { LoadingContext } from "../../providers/LoadingProvider";
import { UNSAFE_FetchersContext } from "react-router-dom";
import { WarningContext } from "../../providers/WarningProvider";

export default function GlobalWarning({
  headerMessage,
  message,
  singleConfirm,
  confirmAction,
  confirmDanger,
}) {
  const { warning, setWarning } = useContext(WarningContext);

  return (
    <PopupContainer zIndex={999}>
      <div className="bg-[#1D1C21] p-6 rounded-lg" style={{ width: "300px" }}>
        <div className="border-b-2 border-white gap-4 pb-4 mb-4 flex items-center">
          <img
            src={closeIcon}
            className="cursor-pointer"
            onClick={() => setWarning(undefined)}
          />
          <p className="text-white text-lg">
            {headerMessage ?? "Konfirmasi Proses"}
          </p>
        </div>
        <img
          src={warningIcon}
          style={{
            width: "10em",
            height: "auto",
            aspectRatio: "1/1",
            margin: "0 auto",
          }}
        />
        <p className="text-white text-center">
          {message ?? "Apakah anda yakin ingin melanjutkan proses?"}
        </p>
        {!singleConfirm ? (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              className="p-2 grow rounded bg-white text-black hover:bg-gray-500 hover:text-white"
              onClick={() => setWarning(undefined)}
            >
              Tidak
            </button>
            <button
              className={`p-2 grow rounded ${
                confirmDanger ? "bg-red-600 text-white" : "bg-white text-black"
              } hover:bg-gray-500 hover:text-white`}
              onClick={() => {
                setWarning(undefined);
                if (confirmAction) confirmAction();
              }}
            >
              Iya
            </button>
          </div>
        ) : (
          <button
            className="mt-6 p-2 w-full bg-white text-black hover:bg-gray-500 hover:text-white rounded"
            onClick={() => {
              setWarning(undefined);
              if (confirmAction) confirmAction();
            }}
          >
            Oke
          </button>
        )}
      </div>
    </PopupContainer>
  );
}
