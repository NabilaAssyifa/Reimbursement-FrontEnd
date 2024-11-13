import dropIcon from "../assets/icons/dropIcon.svg";

import {
  fa1,
  fa2,
  fa3,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faCircleXmark,
  faImage,
  faEdit,
  faQuestionCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import BarangListItem from "../components/barang_list_item";
import ImageViewer from "../components/popups/popup_imageViewer";
import LoadingSpinner from "../components/loading_spinner";
import { useNavigate, useParams } from "react-router-dom";
import request from "../API";
import { apiHost } from "../data/Keys";
import formatDate from "../data/dateFormatter";
import RequestVersion from "../components/popups/popup_requestversion";
import { MobileContext } from "../providers/MobileProvider";
import EditRequest from "../components/popups/popup_editRequest";
import { WarningContext } from "../providers/WarningProvider";
import { LoadingContext } from "../providers/LoadingProvider";
import InfoHover from "../components/info_hover";
import FileInput from "../components/file_input";
import { LoginContext } from "../providers/LoginProvider";
import { useCookies } from "react-cookie";

export default function RequestDetailsPage({ overrideData }) {
  const approvalContainer = useRef();
  const { id_request } = useParams();
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const [cookies, setCookies, removeCookies] = useCookies();

  const [detailsLoading, setDetailsLoading] = useState({
    loading: false,
    error: false,
  });
  const [historyLoading, setHistoryLoading] = useState({
    loading: true,
    error: false,
  });

  const [details, setDetails] = useState(
    overrideData ? overrideData.details : {}
  );
  const [barang, setBarang] = useState(overrideData ? overrideData.barang : []);
  const [approval, setApproval] = useState(
    overrideData ? overrideData.approval : {}
  );
  const [versionHistory, setVersionHistory] = useState([]);

  const [imageIndex, setImageIndex] = useState(0);
  const [viewImage, setViewImage] = useState(undefined);
  const [viewPengeluaranImage, setViewPengeluaranImage] = useState(undefined);
  const [viewVersion, setViewVersion] = useState(undefined);
  const [approvalScrolling, setApprovalScrolling] = useState(false);
  const [approvalState, setApprovalState] = useState("pending");
  const [editing, setEditing] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showInfo, setShowInfo] = useState(undefined);

  async function fetchData() {
    setDetailsLoading({ loading: true, error: false });

    const response = await request("GET", "/requests/" + id_request);
    if (!response || response.error) {
      setDetailsLoading({ loading: false, error: true });
      console.log(response);
      return;
    }

    let setRole = response.viewer_role;
    if (
      !response.approval.supervisor &&
      response.departemen.leader_id === cookies.login.id_user &&
      !response.project
    )
      setRole = "supervisor";

    setDetails({
      ...response.details,
      username: response.owner.nama,
      id_user: response.owner.id_user,
      rekening: response.owner.rekening,
      instansi: response.instansi.nama,
      departemen: response.departemen.nama,
      departemen_leader: response.departemen.leader,
      departemen_leader_id: response.departemen.leader_id,
      project: response.project ? response.project.nama : undefined,
      project_supervisor: response.project
        ? response.project.supervisor
        : undefined,
      viewer_role: setRole,
    });
    setBarang(response.items);
    setApproval(response.approval);

    setDetailsLoading({ loading: false, error: false });
  }

  async function fetchHistory() {
    setHistoryLoading({ loading: true, error: false });

    let response = await request(
      "GET",
      "/requests/versionhistory/" + id_request
    );
    if (!response || response.error) {
      setHistoryLoading({ loading: true, error: true });
      console.log(response);
      return;
    }

    response.shift();
    setVersionHistory(response);

    setHistoryLoading({ loading: false, error: false });
  }

  useEffect(() => {
    function handleResize() {
      if (approvalContainer.current)
        setApprovalScrolling(
          approvalContainer.current.scrollWidth >
            approvalContainer.current.clientWidth
        );
    }

    if (!overrideData) {
      fetchData();
      fetchHistory();
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (Object.keys(details).length > 0 && !overrideData) {
      if (details.viewer_role === "supervisor") {
        if (!approval.supervisor) setShowApproval(true);
      } else if (details.viewer_role === "finance") {
        if (approval.supervisor && !approval.finance) setShowApproval(true);
      } else if (details.viewer_role === "realisasi") {
        if (approval.supervisor && approval.finance && !approval.realisasi)
          setShowApproval(true);
      }
    }
  }, [details, approval]);

  return (
    <>
      {viewPengeluaranImage ? (
        <ImageViewer
          images={[apiHost + "/img/" + viewPengeluaranImage]}
          imageIndex={0}
          setClose={setViewPengeluaranImage}
        />
      ) : null}

      {viewVersion ? (
        <RequestVersion
          requestData={viewVersion}
          setClose={() => setViewVersion(undefined)}
        />
      ) : null}

      {editing ? (
        <EditRequest
          initialData={{
            details: details,
            // images: images,
            barang: barang,
          }}
          setClose={() => setEditing(false)}
        />
      ) : null}

      {showInfo ? (
        <InfoHover
          message={showInfo.message}
          posX={showInfo.posX}
          posY={showInfo.posY}
        />
      ) : null}

      {!overrideData ? (
        <div className="w-full mb-8 px-6 flex justify-between items-center">
          <h1 className="font-bold text-3xl text-gray-700">Detail Request</h1>
          {details && details.id_user && cookies ? (
            details.id_user === cookies.login.id_user ? (
              <button
                className="p-4 bg-black rounded-full text-xs hover:bg-gray-800"
                onClick={() => setEditing(true)}
              >
                {!isMobile ? (
                  <span className="align-middle mr-2 text-white">EDIT</span>
                ) : null}
                <FontAwesomeIcon
                  icon={faEdit}
                  color="white"
                  className="my-auto"
                />
              </button>
            ) : null
          ) : null}
        </div>
      ) : null}

      {!detailsLoading.loading ? (
        !detailsLoading.error ? (
          <>
          <div className="px-6" >
            <div className="bg-gray-50 border  rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-xl mb-4 text-black">
                Informasi Request
              </h2>
              <hr className="my-4 border-gray-300" />

              <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                <div>
                  <p className="font-normal text-gray-600">Judul Request</p>{" "}
                  {details.judul}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Deskripsi</p>{" "}
                  <textarea
                    style={{ resize: "none" }}
                    readOnly
                    className="bg-transparent w-full outline-none rounded-lg text-sm"
                  >
                    {details.deskripsi}
                  </textarea>
                </div>
                <div>
                  <p className="font-normal text-gray-600">Nama Requestor</p>{" "}
                  {details.username}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Metode Pembayaran</p>{" "}
                  {details.metode_pembayaran}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Jenis Request</p>
                  {details.project ? "Project Based" : "Operasional"}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Nama Project</p>{" "}
                  <p>
                    {details.project ?? "-"}
                    {details.project ? (
                      <span
                        className="ml-2"
                        onMouseMove={(e) =>
                          setShowInfo({
                            message:
                              "Supervisor: " + details.project_supervisor,
                            posX: e.clientX,
                            posY: e.clientY,
                          })
                        }
                        onMouseLeave={() => setShowInfo(undefined)}
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          size="1x"
                          color="gray"
                        />
                      </span>
                    ) : null}
                  </p>
                </div>
                <div>
                  <p className="font-normal text-gray-600">No Rekening</p>{" "}
                  {details.rekening}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Nama Departemen</p>{" "}
                  <p>
                    {details.departemen}{" "}
                    <span
                      className="ml-2"
                      onMouseMove={(e) =>
                        setShowInfo({
                          message: "Leader: " + details.departemen_leader,
                          posX: e.clientX,
                          posY: e.clientY,
                        })
                      }
                      onMouseLeave={() => setShowInfo(undefined)}
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size="1x"
                        color="gray"
                      />
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-normal text-gray-600">Nama Instansi</p>
                  {details.instansi}
                </div>
                <div>
                  <p className="font-normal text-gray-600">Tanggal Request</p>
                  {formatDate(details.tanggal_request)}
                </div>
                {details.tanggal_update ? (
                  <div>
                    <p className="font-normal text-gray-600">Terakhir Update</p>
                    {formatDate(details.tanggal_update)}
                  </div>
                ) : null}
              </div>
            </div>
            </div>
            
            <div className="px-6" >
            <div className="bg-gray-50 border rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-xl mb-4 text-black">
                Daftar Barang Pembelian
              </h2>
              <hr className="my-4 border-gray-300" />

              <div>
                {barang.map((b, i) => {
                  return (
                    <BarangListItem
                      barang={b}
                      index={i}
                      setBarang={setBarang}
                      setViewImage={setViewPengeluaranImage}
                      noAction={true}
                    />
                  );
                })}
              </div>
            </div>
            </div>
            
            <div className="px-6" >
            <div className="bg-gray-50 border rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-xl mb-4 text-black">
                Approval
                <span
                  className={`ml-4 p-2 px-4 text-white rounded-full text-xs align-middle`}
                  style={{
                    backgroundColor:
                      approvalState === "pending"
                        ? "#a8a73d" // dark yellow
                        : approvalState === "diterima"
                        ? "blue"
                        : approvalState === "selesai"
                        ? "darkgreen"
                        : "darkred",
                  }}
                >
                  {approvalState.toUpperCase()}
                </span>
              </h2>
              <hr className="my-4 border-gray-300 mb-7" />
              {Object.keys(approval).length === 0 ? (
                <h1>Request ini belum memiliki approval</h1>
              ) : (
                <div
                  className={`flex space-x-4 justify-start overflow-x-scroll`}
                  ref={approvalContainer}
                >
                  {approval.supervisor ? (
                    <ApprovalItem
                      index={1}
                      data={approval.supervisor}
                      numColor={"bg-blue-900"}
                      setApprovalState={setApprovalState}
                    />
                  ) : null}
                  {approval.finance ? (
                    <ApprovalItem
                      index={2}
                      data={approval.finance}
                      numColor={"bg-purple-900"}
                      setApprovalState={setApprovalState}
                    />
                  ) : null}
                  {approval.realisasi ? (
                    <ApprovalItem
                      index={3}
                      data={approval.realisasi}
                      numColor={"bg-yellow-900"}
                      setApprovalState={setApprovalState}
                    />
                  ) : null}
                </div>
              )}
            </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="w-full text-center mb-4">
              Gagal Mengambil Data Request
            </h1>
            <button
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white"
              style={{
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              onClick={() => {
                fetchData();
                fetchHistory();
              }}
            >
              Ulangi
            </button>
          </>
        )
      ) : (
        <LoadingSpinner />
      )}

      {!overrideData ? (
        <div className="px-6" >
        <div className="bg-gray-50 border rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-4 text-gray-700">
            History Edit
          </h2>

          {historyLoading.loading ? (
            historyLoading.error ? (
              <>
                <h1 className="w-full text-center mb-4">
                  Gagal Mengambil Data Riwayat Edit
                </h1>
                <button
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-white text-sm relative"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                  onClick={fetchHistory}
                >
                  Ulangi
                </button>
              </>
            ) : (
              <LoadingSpinner />
            )
          ) : versionHistory.length === 0 ? (
            <h1 className="w-full text-center">
              Request ini belum mengalami perubahan
            </h1>
          ) : (
            <ol className="relative border-s border-gray-700">
              {versionHistory.map((v, i) => {
                return (
                  <li className="mb-10 ms-4" key={i}>
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <p className="mb-1 text-sm font-normal leading-none text-gray-400">
                      Versi {v.version} - {formatDate(v.tanggal_request)}
                    </p>
                    <button
                      onClick={() => setViewVersion(v)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Lihat {/* What is this... */}
                      <svg
                        className="w-3 h-3 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        </div>
      ) : null}

      {showApproval ? <ApprovalMenu role={details.viewer_role} /> : null}
    </>
  );
}

function ApprovalItem({ index, data, numColor, setApprovalState }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const [viewImages, setViewImages] = useState(undefined);

  useEffect(() => {
    if (data.diterima) {
      if (index === 2) setApprovalState("diterima");
      else if (index === 3) setApprovalState("selesai");
    } else setApprovalState("ditolak");
  }, []);

  async function handleViewImage() {
    setLoading({ ...loading, loading: true });

    const response = await request(
      "GET",
      "/approval/images/" + data.id_approval
    );
    if (!response || response.error) {
      setLoading({ loading: true, error: true, complete: false });
      return console.log(response);
    }

    setViewImages(response.map((r) => apiHost + "/img/" + r.nama_file));
    setLoading({ loading: false, error: false, complete: false });
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      {viewImages ? (
        <ImageViewer
          images={viewImages}
          imageIndex={0}
          setClose={setViewImages}
        />
      ) : null}

      {/* Header */}
      <div className="w-full relative mb-4">
        <div
          className={
            numColor + " p-2 w-10 h-auto rounded-full absolute top-1/2 left-0"
          }
          style={{ transform: "translateY(-50%)", aspectRatio: "1/1" }}
        >
          <FontAwesomeIcon
            icon={index === 1 ? fa1 : index === 2 ? fa2 : fa3}
            size="1x"
            color="white"
            style={{
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <h1 className="font-bold text-lg w-full text-white text-center">
          {index === 1 ? "SUPERVISOR" : index === 2 ? "FINANCE" : "REALISASI"}
        </h1>
      </div>

      {/* Content */}
      <textarea
        className="w-96 h-32 p-2 rounded-lg text-xs mb-4"
        style={{ resize: "vertical" }}
        placeholder="Tidak dilampirkan catatan"
        readOnly
        value={data.catatan}
      ></textarea>

      {/* Misc Details */}
      <div className="w-full flex items-center justify-evenly gap-4">
        <div className="border-solid border-2 border-blue-700 rounded-full p-1 text-xs text-white text-center">
          {formatDate(data.tanggal_approval)}
        </div>
        {index !== 3 ? (
          <div
            className={`rounded-full p-1 text-center text-white grow basis-0 w-full text-xs`}
            style={{
              backgroundColor: data.diterima ? "green" : "red",
            }}
          >
            {data.diterima ? "Disetujui" : "Ditolak"} oleh {data.approver}
          </div>
        ) : (
          <div
            className="rounded-full p-1 text-center text-white grow basis-0 w-full text-xs bg-rose-950 cursor-pointer"
            onClick={handleViewImage}
          >
            <span className="mr-1">
              <FontAwesomeIcon icon={faImage} size="1x" color="white" />
            </span>
            Lihat bukti pembayaran
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovalMenu({ role }) {
  const { warning, setWarning } = useContext(WarningContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [cookies, setCookies, removeCookies] = useCookies();
  const { id_request } = useParams();
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [catatanInput, setCatatanInput] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadImagesDisplay, setUploadImagesDisplay] = useState([]);

  async function handleApprove(approved) {
    if (role === "realisasi" && uploadImages.length === 0)
      return setWarning({
        headerMessage: "Tidak Bisa Approve",
        message: "Bukti pembayaran tidak boleh kosong",
        singleConfirm: true,
      });

    setLoading({ loading: true, error: false, complete: false });

    // Manual request handling because of files
    let formData = new FormData();
    formData.append("catatan", catatanInput);
    formData.append("diterima", approved);
    for (let i = 0; i < uploadImages.length; i++)
      formData.append("images", uploadImages[i]);

    const request = await fetch(apiHost + "/approval/" + id_request, {
      method: "POST",
      body: formData,
      headers: {
        account_token: cookies.login.login_token,
      },
    });

    const response = await request.json();
    if (!response || response.error) {
      setLoading({
        loading: true,
        error: true,
        complete: false,
      });
      return console.log(response);
    }

    setLoading({
      loading: true,
      error: false,
      complete: true,
      customButtons: [
        {
          label: "Kembali ke Approval",
          action: () => navigate("/approval"),
        },
      ],
    });
  }

  return (
    <>
      <div
        className="w-full p-4 flex justify-between items-center text-xl mt-6 border-y-2 border-gray-200 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h1 className="font-bold">{role.toUpperCase()} Approval</h1>
        <img
          src={dropIcon}
          style={{ transform: `rotate(${isOpen ? "180" : "0"}deg)` }}
        />
      </div>
      {isOpen ? (
        <div className="border-b-2 border-l-2 border-r-2 border-gray-200 p-4 rounded-bl-lg rounded-br-lg">
          <div className="flex flex-col sm:flex-row justify-evenly items-center gap-4">
            <textarea
              className="min-w-64 md:min-w-96 min-h-24 p-2 bg-gray-100 border-2 border-black rounded-lg text-xs focus-none"
              placeholder="Tambahkan catatan..."
              value={catatanInput}
              onChange={(e) => setCatatanInput(e.target.value)}
            ></textarea>
            <div className="w-full">
              <button
                className="w-full mb-4 p-2 text-white text-center text-sm rounded-lg bg-green-700 hover:bg-green-600"
                onClick={() => handleApprove(true)}
              >
                Setujui Request
              </button>
              <button
                className="w-full p-2 text-white text-center text-sm rounded-lg bg-red-700 hover:bg-red-600"
                onClick={() =>
                  setWarning({
                    message: "Apakah anda yakin ingin menolak request ini?",
                    confirmAction: () => {
                      if (!catatanInput)
                        setWarning({
                          message:
                            "Apakah anda yakin untuk tidak menambahkan catatan?",
                          confirmAction: () => handleApprove(false),
                          confirmDanger: true,
                        });
                      else handleApprove(false);
                    },
                    confirmDanger: true,
                  })
                }
              >
                Tolak Request
              </button>
            </div>
          </div>
          {role === "realisasi" ? (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_30%] md:gap-6">
              <FileInput
                setValue={setUploadImages}
                setDisplayValue={setUploadImagesDisplay}
              />
              <div>
                <p className="block mb-2 mt-2 pb-2 text-sm font-medium text-gray-900 text-black border-b-2 border-gray-500">
                  File Terpilih
                </p>
                <div className="h-64 overflow-auto">
                  {uploadImages.length > 0
                    ? uploadImagesDisplay.map((img, i) => {
                        return (
                          <div className="w-fit py-2 pl-2 border-b border-gray-300">
                            <p className="text-xs" key={i}>
                              {img}
                            </p>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
