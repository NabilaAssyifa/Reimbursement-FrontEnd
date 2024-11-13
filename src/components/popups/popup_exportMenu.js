import { useContext, useState } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";

import PopupContainer from "../popup_container";
import { LoadingContext } from "../../providers/LoadingProvider";
import { apiHost } from "../../data/Keys";
import { useCookies } from "react-cookie";
import formatDate from "../../data/dateFormatter";

export default function Popup_ExportMenu({ setClose }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const [cookies, setCookies, removeCookies] = useCookies();

  const [rangeSelect, setRangeSelect] = useState("month");

  const [yearSelect, setYearSelect] = useState(new Date().getFullYear());
  const [monthSelect, setMonthSelect] = useState(new Date().getMonth() + 1);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  async function getExport() {
    setLoading({ loading: true, error: false, complete: false });

    let requestBody = {};

    if (rangeSelect === "month")
      requestBody = { year: yearSelect, month: monthSelect };
    else {
      if (new Date(fromDate) > new Date(toDate))
        return setLoading({
          loading: true,
          error: true,
          complete: false,
          customMessage: 'Pilih "tanggal dari" yang lebih kecil',
        });
      requestBody = { fromDate: fromDate, toDate: toDate };
    }

    // Manual again because files LDASPDSAIDJSADJASODJASLDJO
    const request = await fetch(`${apiHost}/charts/export`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        account_token: cookies.login.login_token,
        "Content-Type": "application/json",
      },
    });

    if (request.ok) {
      const a = document.createElement("a");
      a.download = `Report_${
        rangeSelect === "month" ? yearSelect : formatDate(fromDate)
      }-${rangeSelect === "month" ? monthSelect : formatDate(toDate)}`;
      a.href = URL.createObjectURL(await request.blob());
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.log(request);
      return setLoading({ loading: true, error: true, complete: false });
    }

    setLoading({ loading: true, error: false, complete: true });
  }

  return (
    <PopupContainer zIndex={800}>
      <div className="w-full md:w-96 p-4 rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black font-bold">Export Rekap Data</h2>
          <img
            src={closeIcon}
            className="svg-black cursor-pointer"
            onClick={() => setClose(false)}
          />
        </div>

        <div className="flex justify-between items-center gap-6 mb-4">
          <p className="font-bold ">Jangka Export</p>
          <select
            className="text-center basis-0 grow w-full"
            value={rangeSelect}
            onChange={(e) => setRangeSelect(e.target.value)}
          >
            <option value={"month"}>Pilih Bulan</option>
            <option value={"date"}>Pilih Tanggal</option>
          </select>
        </div>

        {rangeSelect === "month" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-center font-bold">Tahun</p>
              <input
                type="number"
                value={yearSelect}
                onChange={(e) => setYearSelect(e.target.value)}
                className="w-full text-center outline-none p-1 border-y-2"
              />
            </div>
            <div>
              <p className="text-center font-bold">Bulan</p>
              <select
                className="block mx-auto text-center p-1"
                value={monthSelect}
                onChange={(e) => setMonthSelect(e.target.value)}
              >
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-center font-bold">Dari Tanggal</p>
              <input
                type="date"
                className="w-full text-center outline-none p-1 border-y-2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <p className="text-center font-bold">Hingga Tanggal</p>
              <input
                type="date"
                className="w-full text-center outline-none p-1 border-y-2"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          className="p-2 mt-4 w-full bg-gray-700 hover:bg-gray-800 rounded-lg text-white text-center"
          onClick={() => {
            setClose(false);
            getExport();
          }}
        >
          Unduh Hasil Export
        </button>
      </div>
    </PopupContainer>
  );
}
