import closeIcon from "../assets/icons/closeIconBlack.svg";
import uploadIcon from "../assets/icons/uploadIcon.svg";
import deleteIcon from "../assets/icons/deleteIcon.svg";

import { useContext, useEffect, useState } from "react";
import InstansiSelectDropdown from "../components/searchable_dropdown_instansi";
import ProjectsSelectDropdown from "../components/searchable_dropdown_projects";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MobileContext } from "../providers/MobileProvider";
import { PopupContext } from "../providers/PopupProvider";
import { LoadingContext } from "../providers/LoadingProvider";
import hasExtension from "../data/extensionCheck";
import { WarningContext } from "../providers/WarningProvider";
import { apiHost } from "../data/Keys";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import BarangListItem from "../components/barang_list_item";
import FileInput from "../components/file_input";
import ImageViewer from "../components/popups/popup_imageViewer";

export default function RequestPage() {
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const { popup, setOpenPopup } = useContext(PopupContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);
  const [cookies, setCookies, removeCookies] = useCookies();
  const navigate = useNavigate();

  const [judulInput, setJudulInput] = useState("");
  const [deskripsiInput, setDeskripsiInput] = useState("");
  const [metodeInput, setMetodeInput] = useState("cash");
  const [instansiInput, setInstansiInput] = useState(undefined);
  const [projectInput, setProjectInput] = useState(undefined);

  const [viewPengeluarangImage, setViewPengeluaranImage] = useState(undefined);
  const [barang, setBarang] = useState([]);

  const [requestType, setRequestType] = useState("");

  function clearForm() {
    setJudulInput("");
    setDeskripsiInput("");
    setMetodeInput("cash");
    setInstansiInput(undefined);
    setProjectInput(undefined);
    setRequestType("");
    setBarang([]);
  }

  async function handleCreate() {
    let failMsg = "";
    if (!judulInput) failMsg = "Judul tidak boleh kosong";
    else if (!metodeInput) failMsg = "Metode pembayaran tidak boleh kosong";
    else if (!requestType) failMsg = "Anda harus memilih tipe request";
    else if (requestType === "operasional" && !instansiInput)
      failMsg = "Instansi harus terisi";
    else if (requestType === "project" && !projectInput)
      failMsg = "Project harus terisi";
    else if (barang.length === 0)
      failMsg = "Daftar pengeluaran tidak boleh kosong";

    if (failMsg)
      return setWarning({
        headerMessage: "Tidak Bisa Membuat Request",
        message: failMsg,
        singleConfirm: true,
      });

    setLoading({ loading: true, error: false, complete: false });

    // Manual form and request creation because of images
    let formData = new FormData();

    formData.append("judul", judulInput);
    formData.append("deskripsi", deskripsiInput);
    formData.append("metode_pembayaran", metodeInput);
    if (requestType === "operasional")
      formData.append("id_instansi", instansiInput);
    if (requestType === "project") formData.append("id_project", projectInput);

    for (let i = 0; i < barang.length; i++)
      formData.append("images", barang[i].image);

    formData.append(
      "pengeluaran",
      JSON.stringify(
        barang.map((b) => {
          let bCopy = b;
          delete bCopy.image;
          return bCopy;
        })
      )
    );

    const request = await fetch(apiHost + "/requests/add", {
      method: "POST",
      body: formData,
      headers: {
        account_token: cookies.login.login_token,
      },
    });

    const response = await request.json();
    if (!response || response.error) {
      setLoading({ loading: true, error: true, complete: false });
      console.log(response);
      return;
    }

    setLoading({
      loading: true,
      error: false,
      complete: true,
      customButtons: [
        {
          label: "Lihat Request",
          action: () => navigate("/riwayat/request/" + response.id_request),
        },
        {
          label: "Buat Lagi",
          action: clearForm,
        },
      ],
    });
  }

  return (
    <div className="bg-white font-sans px-6 min-h-screen relative overflow-hidden">
      {viewPengeluarangImage ? (
        <ImageViewer
          images={[URL.createObjectURL(viewPengeluarangImage)]}
          imageIndex={0}
          setClose={setViewPengeluaranImage}
        />
      ) : null}

      <h1 className="font-bold text-2xl mb-6">Form Pengajuan Reimbursement</h1>

      <div>
        <label
          htmlFor="small-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Judul Reimbursement
        </label>
        <input
          type="text"
          id="small-input"
          placeholder="Masukkan judul reimburse..."
          className=" placeholder-gray-300 mb-3 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
          value={judulInput}
          onChange={(e) => setJudulInput(e.target.value)}
        />
      </div>

      <div className="mt-2 ">
        <label
          htmlFor="large-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Deskripsi Pengajuan Permintaan
        </label>
        <textarea
          id="large-input"
          className="placeholder-gray-300 mb-3 block w-full text-sm text-gray-900 p-2 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
          style={{ resize: "vertical" }}
          placeholder="Masukkan deskripsi dengan jelas..."
          value={deskripsiInput}
          onChange={(e) => setDeskripsiInput(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="small-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Metode Pembayaran
        </label>
        <select
          id="small-input"
          class=" placeholder-gray-300 mb-3 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
          value={metodeInput}
          onChange={(e) => setMetodeInput(e.target.value)}
        >
          <option value={"cash"}>Cash</option>
          <option value={"petty cash"}>Petty Cash</option>
          <option value={"transfer"}>Transfer</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-6 mb-12">
        <div>
          <label
            htmlFor="small-input"
            class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
            >
            Jenis Request
          </label>
          <select
            id="small-input"
            class=" placeholder-gray-400 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
          >
            <option value={""}>-Pilih Jenis Request-</option>
            <option value={"operasional"}>Operasional</option>
            <option value={"project"}>Project Based</option>
          </select>
        </div>
        <div>
          {requestType === "operasional" ? (
            <div>
              <label
                htmlFor="small-input"
                class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
                >
                Untuk Instansi
              </label>
              <InstansiSelectDropdown
                placeholder={"-Pilih Instansi-"}
                value={instansiInput}
                setValue={setInstansiInput}
              />
            </div>
          ) : requestType === "project" ? (
            <div>
              <label
                htmlFor="small-input"
                className="block mb-2 mt-2 text-sm font-medium text-gray-900 text-black"
              >
                Untuk Project
              </label>
              <ProjectsSelectDropdown
                placeholder={"-Pilih Project-"}
                value={projectInput}
                class=" placeholder-gray-400 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
                setValue={setProjectInput}
              />
            </div>
          ) : null}
        </div>
      </div>

      <hr className="my-4 border-gray-200 mb-12" />

      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="font-bold text-2xl shrink">Daftar Pengeluaran</h1>
        <button
          type="button"
          className="h-10 w-42 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 shrink-0"
          onClick={() =>
            setOpenPopup({
              name: "add_barang",
              props: { setBarang: setBarang },
            })
          }
        >
          <FontAwesomeIcon icon={faPlus} />{" "}
          {!isMobile ? <span className="ml-2">Tambah Barang</span> : null}
        </button>
      </div>

      <div className="border border-gray-300 rounded-md text-xs p-5">
        {barang.map((b, i) => (
          <BarangListItem
            barang={b}
            index={i}
            setBarang={setBarang}
            setViewImage={setViewPengeluaranImage}
          />
        ))}
      </div>

      <button
        type="button"
        className="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        onClick={handleCreate}
      >
        Buat Request
      </button>
    </div>
  );
}
