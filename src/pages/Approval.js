import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/search_bar";
import InstansiSelectDropdown from "../components/searchable_dropdown_instansi";
import ProjectsSelectDropdown from "../components/searchable_dropdown_projects";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";
import LoadingSpinner from "../components/loading_spinner";
import request from "../API";
import formatDate from "../data/dateFormatter";
import formatPrice from "../data/priceFormatter";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../providers/LoginProvider";
import { useCookies } from "react-cookie";

export default function ApprovalPage() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);
  const [cookies, setCookies, removeCookies] = useCookies();
  const navigate = useNavigate();

  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const [requestLoading, setRequestLoading] = useState({
    loading: true,
    error: false,
  });
  const [allRequests, setAllRequests] = useState([]);

  async function fetchRequests() {
    setRequestLoading({ loading: true, error: false });

    const response = await request(
      "GET",
      "/requests/toapprove" +
        (cookies.login.role === "finance" || cookies.login.role === "realisasi"
          ? `/${cookies.login.role}`
          : "")
    );
    if (!response || response.error) {
      setRequestLoading({ loading: true, error: true });
      console.log(response);
      return;
    }

    setAllRequests(response);
    setRequestLoading({ loading: false, error: false });
  }

  function getFilteredRequests() {
    let filteredRequests = allRequests;

    if (dateFilter)
      filteredRequests = filteredRequests.filter(
        (f) =>
          Math.floor(
            (new Date() - new Date(f.tanggal_request)) / (1000 * 60 * 60 * 24)
          ) <= parseInt(dateFilter)
      );
    if (searchFilter)
      filteredRequests = filteredRequests.filter(
        (f) =>
          f.judul.toLowerCase().includes(searchFilter.toLowerCase()) ||
          f.deskripsi.toLowerCase().includes(searchFilter.toLowerCase())
      );
    if (statusFilter) {
      let statusCheck = (f) => {};

      switch (statusFilter) {
        case "pending":
          statusCheck = (f) => !f.finance_diterima && f.ditolak === 0;
          break;
        case "diterima":
          statusCheck = (f) => f.finance_diterima !== null && f.ditolak === 0;
          break;
        case "selesai":
          statusCheck = (f) => f.realisasi_diterima !== null;
          break;
        case "ditolak":
          statusCheck = (f) => f.ditolak > 0;
          break;
        default:
          statusCheck = (f) => true;
          break;
      }

      filteredRequests = filteredRequests.filter(statusCheck);
    }

    return filteredRequests;
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="font-sans px-6 min-h-screen relative overflow-hidden">
      <h1 className="font-bold text-1xl mb-6">Riwayat Reimbursement</h1>

      <SearchBar
        placeholder={"Cari berdasarkan judul atau deskripsi..."}
        onSearch={(s) => setSearchFilter(s)}
      />

      {/* Search filters */}
      <div className="mt-4 mb-8 flex gap-4 justify-center items-center flex-wrap">
        <select
          className="bg-gray-300 text-gray-500 font-light rounded-md text-xs px-4 p-1 w-64 border-none "
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">Semua Hari</option>
          <option value="7">7 hari terakhir</option>
          <option value="30">30 hari terakhir</option>
          <option value="365">1 tahun terakhir</option>
        </select>

        <select
          className="bg-gray-300 text-gray-500 font-light rounded-md text-xs px-4 p-1 w-64 border-none "
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="diterima">Disetujui</option>
          <option value="selesai">Selesai</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div className="relative overflow-x-auto">
        {requestLoading.loading ? (
          requestLoading.error ? (
            <div className="w-full">
              <h2 className="font-bold w-full text-center mb-4">
                Sebuah Kesalahan Terjadi
              </h2>
              <button
                className="bg-gray-700 p-2 text-white text-sm font-bold rounded-lg mx-auto block"
                onClick={fetchRequests}
              >
                Ulangi
              </button>
            </div>
          ) : (
            <LoadingSpinner />
          )
        ) : allRequests.length === 0 ? (
          <h2 className="font-bold w-full text-center">
            Tidak ada Request Untuk Diberikan Persetujuan
          </h2>
        ) : (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-100 text-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Judul Request
                </th>
                <th scope="col" className="px-6 py-3">
                  Project
                </th>
                <th scope="col" className="px-6 py-3">
                  Instansi
                </th>
                <th scope="col" className="px-6 py-3">
                  Tanggal Pengajuan
                </th>
                <th scope="col" className="px-6 py-3">
                  Harga Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRequests().map((r, i) => {
                let requestStatus = "pending";

                if (r.finance_diterima) requestStatus = "diterima";
                if (r.realisasi_diterima) requestStatus = "selesai";
                if (r.ditolak > 0) requestStatus = "ditolak";

                return (
                  <tr
                    className="border-b border-gray-200 cursor-pointer text-gray-900"
                    key={i}
                    onClick={() =>
                      navigate("/approval/request/" + r.id_request)
                    }
                  >
                    <td className="px-6 py-4 min-w-72">{r.judul}</td>
                    <td className="px-6 py-4">{r.project ?? "-"}</td>
                    <td className="px-6 py-4">{r.instansi}</td>
                    <td className="px-6 py-4">
                      {formatDate(r.tanggal_request)}
                    </td>
                    <td className="px-6 py-4">{formatPrice(r.jumlah)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full text-white text-xs font-semibold p-2 ${
                          requestStatus === "pending"
                            ? "bg-yellow-500"
                            : requestStatus === "diterima"
                            ? "bg-blue-800"
                            : requestStatus === "selesai"
                            ? "bg-green-800"
                            : "bg-red-500"
                        }`}
                      >
                        {requestStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
