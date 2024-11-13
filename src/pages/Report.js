import exportIcon from "../assets/icons/exportIcon.svg";

import { useContext, useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import request from "../API";
import { LoadingContext } from "../providers/LoadingProvider";
import { MobileContext } from "../providers/MobileProvider";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InstansiSelectDropdown from "../components/searchable_dropdown_instansi";
import ProjectsSelectDropdown from "../components/searchable_dropdown_projects";
import SearchBar from "../components/search_bar";
import { useCookies } from "react-cookie";
import SearchableDropdownRealtime from "../components/searchable_dropdown_realtime";
import LoadingSpinner from "../components/loading_spinner";
import { useNavigate } from "react-router-dom";
import formatDate from "../data/dateFormatter";
import formatPrice from "../data/priceFormatter";
import Popup_ExportMenu from "../components/popups/popup_exportMenu";

export default function ReportPage() {
  const [cookies, setCookies, removeCookies] = useCookies();

  return (
    <>
      {cookies.login ? (
        cookies.login.role === "finance" ||
        cookies.login.role === "realisasi" ? (
          <ReportPageContent />
        ) : (
          <NoAccess />
        )
      ) : null}
    </>
  );
}

function NoAccess() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <h1 className="w-full text-center align-middle text-3xl font-bold">
        Anda Tidak Memliki Akses Ke Halaman Ini
      </h1>
      <button className="p-2 w-fit bg-gray-700 hover:bg-gray-800 text-white text-center rounded-lg">
        Kembali ke Dashboard
      </button>
    </div>
  );
}

function ReportPageContent() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const navigate = useNavigate();

  // Analysis States
  const [perUser, setPerUser] = useState(undefined);
  const [perMonth, setPerMonth] = useState(undefined);
  const [perProject, setPerProject] = useState(undefined);

  const [analysisLoading, setAnalysisLoading] = useState({
    loading: true,
    error: false,
  });

  // Request States
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(0);
  const [instansiFilter, setInstansiFilter] = useState(undefined);
  const [projectFilter, setProjectFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState("");

  const [requestLoading, setRequestLoading] = useState({
    loading: true,
    error: false,
  });
  const [allRequests, setAllRequests] = useState([]);
  const [requestPage, setRequestPage] = useState(1);
  const [openExport, setOpenExport] = useState(false);

  async function fetchAnalysisData() {
    setAnalysisLoading({ loading: true, error: false });

    const userResponse = await request("GET", "/charts/peruser/5");
    const monthResponse = await request("GET", "/charts/permonth/5");
    const projectResponse = await request("GET", "/charts/perproject/5");

    if (!userResponse || userResponse.error)
      setAnalysisLoading({ loading: true, error: true });
    if (!monthResponse || monthResponse.error)
      setAnalysisLoading({ loading: true, error: true });
    if (!projectResponse || projectResponse.error)
      setAnalysisLoading({ loading: true, error: true });

    setPerUser(userResponse);
    setPerMonth(monthResponse);
    setPerProject(projectResponse);
    setAnalysisLoading({ loading: false, error: false });
  }

  async function fetchRequests() {
    setRequestLoading({ loading: true, error: false });

    const response = await request("POST", "/requests/all/15/" + requestPage, {
      search: searchFilter,
      days: dateFilter,
      project_filter: projectFilter,
      instansi_filter: instansiFilter,
      status: statusFilter,
    });

    if (!response || response.error) {
      console.log(response);
      return setRequestLoading({ loading: true, error: true });
    }

    setAllRequests(response);
    setRequestLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [
    searchFilter,
    dateFilter,
    instansiFilter,
    projectFilter,
    statusFilter,
    requestPage,
  ]);

  return (
    <>
      {openExport ? <Popup_ExportMenu setClose={setOpenExport} /> : null}

      <div className="font-sans px-6 min-h-screen relative overflow-hidden">
        <h1 className="font-bold text-1xl mb-6">Analisis Data Reimbursement</h1>

        {analysisLoading.loading ? (
          analysisLoading.error ? (
            <>
              <h1 className="mb-4 text-center">Gagal Mengambil Data Grafik</h1>
              <button
                className="p-2 bg-gray-700 hover:bg-gray-800 text-white text-center rounded-lg block mx-auto"
                onClick={fetchAnalysisData}
              >
                Ulangi
              </button>
            </>
          ) : (
            <LoadingSpinner />
          )
        ) : (
          <>
            <CenterScroll className="w-full overflow-x-scroll flex gap-10">
              {perUser ? (
                <div>
                  <h2 className="font-bold text-1xl mb-2">
                    Jumlah Reimbursement Per user
                  </h2>
                  <BarChart width={500} height={250} data={perUser}>
                    <XAxis dataKey="username" fontSize={10} />
                    <YAxis dataKey="amount" fontSize={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      fillOpacity={0.5}
                      fill="#FF0000"
                    />
                  </BarChart>
                </div>
              ) : null}

              {perMonth ? (
                <div>
                  <h2 className="font-bold text-1xl mb-2">
                    Jumlah Reimbursement Per Bulan
                  </h2>
                  <BarChart width={500} height={250} data={perMonth}>
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis dataKey="amount" fontSize={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      fillOpacity={0.5}
                      fill="#FF0000"
                    />
                  </BarChart>
                </div>
              ) : null}
            </CenterScroll>

            <CenterScroll>
              {perProject ? (
                <div>
                  <h2 className="font-bold text-1xl mb-2">
                    Data Request Per Project
                  </h2>
                  <AreaChart width={1000} height={250} data={perProject}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="nama_project" fontSize={10} />
                    <YAxis fontSize={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="jumlah"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorPv)"
                    />
                  </AreaChart>
                </div>
              ) : null}
            </CenterScroll>
          </>
        )}

        <hr className="my-12 border-2"></hr>

        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-1xl">Semua Request</h1>
          <button
            className="p-4 bg-black rounded-full text-xs hover:bg-gray-800"
            onClick={() => setOpenExport(true)}
          >
            {!isMobile ? (
              <span className="align-middle mr-2 text-white">EXPORT</span>
            ) : null}
            <FontAwesomeIcon
              icon={faFileExport}
              color="white"
              className="my-auto align-middle"
            />
          </button>
        </div>

        <SearchBar
          placeholder={"Cari berdasarkan judul atau deskripsi..."}
          onSearch={(s) => setSearchFilter(s)}
        />

        {/* Search filters */}
        <div className="mt-4 mb-8 flex gap-4 justify-center items-center flex-wrap">
          <select
            className="bg-gray-300 text-black font-medium rounded-md text-xs px-4 h-6 w-64"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Semua Hari</option>
            <option value="7">7 hari terakhir</option>
            <option value="30">30 hari terakhir</option>
            <option value="365">1 tahun terakhir</option>
          </select>

          <SearchableDropdownRealtime
            defaultMessage={"Semua Project"}
            changeFind={async (search, setContents) => {
              const response = await request("GET", "/projects/all/" + search);

              if (response && !response.error)
                setContents(
                  response.map((r) => {
                    return { value: r.id_project, label: r.nama_project };
                  })
                );

              return response;
            }}
            customStyle={
              "relative flex items-center justify-between bg-gray-300 text-xs w-64 p-0 pl-2 bg-gray-100 border-gray-400 rounded-md"
            }
            onChange={(project) => setProjectFilter(project.value)}
          />

          <InstansiSelectDropdown
            placeholder={"Semua Instansi"}
            setValue={setInstansiFilter}
            customStyle={
              "relative flex items-center justify-between bg-gray-300 text-xs w-64 p-0 pl-2 bg-gray-100 border-gray-400 rounded-md"
            }
          />

          <select
            className="bg-gray-300 text-black font-medium rounded-md text-xs px-4 h-6 w-64"
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

        <div>
          {requestLoading.loading ? (
            !requestLoading.error ? (
              <>
                <LoadingSpinner />
                <h1 className="w-full mt-4 font-bold text-center">
                  Mencari...
                </h1>
              </>
            ) : (
              <>
                <h1 className="w-full mt-4 mb-2 font-bold text-center">
                  Gagal Mencari Data Request
                </h1>
                <button
                  className="mx-auto block p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white text-center"
                  onClick={fetchRequests}
                >
                  Ulangi
                </button>
              </>
            )
          ) : (
            <>
              <div className="relative overflow-x-auto">
                {allRequests.length > 0 ? (
                  <table className="w-full text-sm text-left text-black">
                    <thead className="text-xs uppercase bg-gray-300">
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
                      {allRequests.map((r, i) => {
                        let requestStatus = "pending";

                        if (r.finance_diterima) requestStatus = "diterima";
                        if (r.realisasi_diterima) requestStatus = "selesai";
                        if (r.ditolak > 0) requestStatus = "ditolak";

                        return (
                          <tr
                            className="border-b border-gray-700 cursor-pointer"
                            key={i}
                            onClick={() =>
                              navigate("/report/request/" + r.id_request)
                            }
                          >
                            <td className="px-6 py-4 min-w-72">{r.judul}</td>
                            <td className="px-6 py-4">{r.project ?? "-"}</td>
                            <td className="px-6 py-4">{r.instansi}</td>
                            <td className="px-6 py-4">
                              {formatDate(r.tanggal_request)}
                            </td>
                            <td className="px-6 py-4">
                              {formatPrice(r.jumlah)}
                            </td>
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
                ) : (
                  <h1 className="w-full text-black font-bold text-center">
                    Pencarian Tidak Ditemukan
                  </h1>
                )}
              </div>

              <div className="w-full flex justify-center items-center mt-8">
                <p
                  className="mr-4 text-blue-700 hover:text-blue-400 underline decoration-solid cursor-pointer"
                  onClick={() => {
                    if (requestPage > 1) setRequestPage(requestPage - 1);
                  }}
                >
                  &lt; Sebelumnya
                </p>
                |
                <p
                  className="ml-4 text-blue-700 hover:text-blue-400 underline decoration-solid cursor-pointer"
                  onClick={() => setRequestPage(requestPage + 1)}
                >
                  Selanjutnya &gt;
                </p>
              </div>
              <div className="w-full flex justify-center items-center text-xs mb-4">
                Menampilkan 10 per hal. - Halaman {requestPage}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CenterScroll({ children }) {
  const scrollContainer = useRef();
  const [isScrolling, setScrolling] = useState(false);

  useEffect(() => {
    function handleResize() {
      setScrolling(
        scrollContainer.current.scrollWidth >
          scrollContainer.current.clientWidth
      );
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`flex ${
        isScrolling ? "justify-start" : "justify-evenly"
      } items-center gap-6 overflow-x-scroll`}
      ref={scrollContainer}
    >
      {children}
    </div>
  );
}
