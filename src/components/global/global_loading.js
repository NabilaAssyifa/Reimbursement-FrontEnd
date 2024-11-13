import closeIcon from "../../assets/icons/closeIcon.svg";
import errorIcon from "../../assets/icons/errorIcon.gif";
import completeIcon from "../../assets/icons/completeIcon.svg";

import { useContext } from "react";
import { LoadingContext } from "../../providers/LoadingProvider";
import PopupContainer from "../popup_container";
import LoadingSpinner from "../loading_spinner";

export default function GlobalLoading({ error, complete, customMessage }) {
  const { loading, setLoading } = useContext(LoadingContext);

  return (
    <PopupContainer zIndex={999}>
      <div className="bg-[#1D1C21] p-6  rounded-lg" style={{ width: "320px" }}>
        {error ? (
          <Error setLoading={setLoading} customMessage={customMessage} />
        ) : complete ? (
          <Complete setLoading={setLoading} customMessage={customMessage} />
        ) : (
          <BasicLoading customMessage={customMessage} />
        )}

        {loading.customButtons && loading.customButtons.length > 0
          ? loading.customButtons.map((b, i) => (
              <button
                className="w-full my-2 p-2 text-sm text-black bg-white rounded-lg"
                key={i}
                onClick={() => {
                  if (b.action) b.action();
                  setLoading({ loading: false, error: false, complete: false });
                }}
              >
                {b.label}
              </button>
            ))
          : null}
      </div>
    </PopupContainer>
  );
}

function BasicLoading({ customMessage }) {
  return (
    <>
    <div className="p-6">
      <LoadingSpinner />
      <p className="w-full text-center text-white mt-6">
        {customMessage ?? "Sedang memproses..."}
      </p>
      </div>
    </>
  );
}

function Error({ setLoading, customMessage }) {
  return (
    <>
      <div className=" gap-4 pb-4  flex items-center">
        <img
          src={closeIcon}
          className="cursor-pointer"
          onClick={() =>
            setLoading({ loading: false, error: false, complete: false })
          }
        />
      </div>
      <img
        src={errorIcon}
        style={{
          width: "10em",
          height: "11em",
          aspectRatio: "1/1",
          margin: "0 auto",
        }}
      />
      <p className="text-white text-center pb-4">
        {customMessage ?? "Sebuah kesalahan telah terjadi..."}
      </p>
    </>
  );
}

function Complete({ setLoading, customMessage }) {
  return (
    <>
      <div className="border-b-2 border-white gap-4 pb-4 mb-4 flex items-center">
        <img
          src={closeIcon}
          className="cursor-pointer"
          onClick={() =>
            setLoading({ loading: false, error: false, complete: false })
          }
        />
        <p className="text-white text-lg">Berhasil</p>
      </div>
      <img
        src={completeIcon}
        style={{
          width: "10em",
          height: "auto",
          aspectRatio: "1/1",
          margin: "0 auto",
        }}
      />
      <p className="text-white text-center">
        {customMessage ?? "Proses berhasil"}
      </p>
    </>
  );
}
