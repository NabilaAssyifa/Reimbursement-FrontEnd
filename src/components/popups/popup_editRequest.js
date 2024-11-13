import { useContext, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";

import PopupContainer from "../popup_container";
import InstansiSelectDropdown from "../searchable_dropdown_instansi";
import ProjectsSelectDropdown from "../searchable_dropdown_projects";
import FileInput from "../file_input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingContext } from "../../providers/LoadingProvider";
import { WarningContext } from "../../providers/WarningProvider";
import { MobileContext } from "../../providers/MobileProvider";
import BarangListItem from "../barang_list_item";
import { PopupContext } from "../../providers/PopupProvider";
import ImageViewer from "./popup_imageViewer";
import { apiHost } from "../../data/Keys";
import { useCookies } from "react-cookie";

export default function EditRequest({ initialData, setClose }) {
  const { warning, setWarning } = useContext(WarningContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const { openPopup, setOpenPopup } = useContext(PopupContext);
  const [cookies, setCookies, removeCookies] = useCookies();

  const [requestType, setRequestType] = useState(
    initialData.details.project ? "project" : "operasional"
  );
  const [judulInput, setJudulInput] = useState(initialData.details.judul);
  const [deskripsiInput, setDeskripsiInput] = useState(
    initialData.details.deskripsi
  );
  const [metodeInput, setMetodeInput] = useState(
    initialData.details.metode_pembayaran
  );
  const [instansiInput, setInstansiInput] = useState(undefined);
  const [projectInput, setProjectInput] = useState(undefined);
  const [barang, setBarang] = useState(initialData.barang);
  const [viewImage, setViewImage] = useState(undefined);

  const [pengeluaranRemove, setPengeluaranRemove] = useState([]);
  const [pengeluaranAdd, setPengeluaranAdd] = useState([]);
  const [changeType, setChangeType] = useState({
    changing: false,
    changeId: undefined,
    changeLabel: undefined,
  });

  async function handleUpdate() {
    setLoading({ loading: true, error: false, complete: false });

    // Manually again because of images
    let formData = new FormData();

    formData.append("judul", judulInput);
    formData.append("deskripsi", deskripsiInput);
    formData.append("metode", metodeInput);
    if (changeType.changeId) {
      if (requestType === "project")
        formData.append("id_project", changeType.changeId);
      else if (requestType === "operasional")
        formData.append("id_instansi", changeType.changeId);
    }

    for (let i = 0; i < pengeluaranAdd.length; i++)
      formData.append("images", pengeluaranAdd[i].image);

    formData.append("pengeluaran_remove", JSON.stringify(pengeluaranRemove));
    formData.append(
      "pengeluaran_add",
      JSON.stringify(
        pengeluaranAdd.map((p) => {
          let pCopy = p;
          delete pCopy.image;
          return pCopy;
        })
      )
    );

    const request = await fetch(
      apiHost + "/requests/" + initialData.details.id_request,
      {
        method: "PUT",
        body: formData,
        headers: {
          account_token: cookies.login.login_token,
        },
      }
    );
    const response = await request.json();

    if (!response || response.error) {
      setLoading({ loading: true, error: true, complete: false });
      return console.log(response);
    }

    setLoading({ loading: false, error: false, complete: true });
    window.location.reload();
  }

  return (
    <PopupContainer zIndex={800}>
      {viewImage ? (
        <ImageViewer
          images={[
            viewImage instanceof File
              ? URL.createObjectURL(viewImage)
              : apiHost + "/img/" + viewImage,
          ]}
          imageIndex={0}
          setClose={setViewImage}
        />
      ) : null}

      <button
        className="p-2 rounded-full bg-black hover:bg-gray-500 absolute top-0 right-0 mt-4 mr-4"
        onClick={setClose}
      >
        <img src={closeIcon} />
      </button>
      <div className="bg-white p-2 w-full md:max-w-5xl h-[95%] rounded-lg shadow-lg overflow-y-scroll">
        <h1 className="font-bold text-3xl mb-8 text-gray-700 mt-4 ml-4">
          Edit Detail Request
        </h1>

        <div>
          <label
            htmlFor="judul-input"
            className="block mb-2 text-sm font-medium text-gray-900 text-black"
          >
            Judul Reimbursement
          </label>
          <input
            type="text"
            id="judul-input"
            className="block w-full p-2 rounded-lg focus:outline-none bg-gray-300"
            value={judulInput}
            onChange={(e) => setJudulInput(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="deskripsi-input"
            className="block mb-2 text-sm font-medium text-gray-900 text-black"
          >
            Deskripsi Pengajuan Permintaan
          </label>
          <textarea
            id="deskripsi-input"
            className="block w-full p-2 rounded-lg focus:outline-none bg-gray-300 height min-h-40 text-sm"
            style={{ resize: "vertical" }}
            value={deskripsiInput}
            onChange={(e) => setDeskripsiInput(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="metode-input"
            className="block mb-2 mt-2 text-sm font-medium text-gray-900 text-black"
          >
            Metode Pembayaran
          </label>
          <select
            id="metode-input"
            className="block w-full mb-2 p-2 rounded-lg focus:outline-none bg-gray-300"
            value={metodeInput}
            onChange={(e) => setMetodeInput(e.target.value)}
          >
            <option value={"cash"}>Cash</option>
            <option value={"petty cash"}>Petty Cash</option>
            <option value={"transfer"}>Transfer</option>
          </select>
        </div>

        {!changeType.changing ? (
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row justify-between items-center px-6 mt-4 mx-auto text-center gap-2">
            <div>
              <p className="font-bold border-b-2 border-black">Tipe Request:</p>
              <p>
                {requestType === "project" ? "Project Based" : "Operasional"}
              </p>
            </div>
            <div>
              <p className="font-bold border-b-2 border-black">
                {requestType === "project" ? "Nama Project" : "Instansi"}:
              </p>
              <p>
                {requestType === "project"
                  ? projectInput ?? initialData.details.project
                  : instansiInput ?? initialData.details.instansi}
              </p>
            </div>
            <button
              className="bg-black p-2 rounded-lg text-white text-sm"
              onClick={() => setChangeType({ ...changeType, changing: true })}
            >
              Ubah
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-6 mb-4">
              <div>
                <label
                  htmlFor="small-input"
                  className="block mb-2 mt-2 text-sm font-medium text-gray-900 text-black"
                >
                  Jenis Request
                </label>
                <select
                  id="small-input"
                  className="block w-full p-2 rounded-lg focus:outline-none bg-gray-300"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                >
                  <option value={"operasional"}>Operasional</option>
                  <option value={"project"}>Project Based</option>
                </select>
              </div>
              <div>
                {requestType === "operasional" ? (
                  <div>
                    <label
                      htmlFor="small-input"
                      className="block mb-2 mt-2 text-sm font-medium text-gray-900 text-black"
                    >
                      Untuk Instansi
                    </label>
                    <InstansiSelectDropdown
                      placeholder={"-Pilih Instansi-"}
                      value={instansiInput}
                      setValue={setInstansiInput}
                      onChange={(instansi) =>
                        setChangeType({
                          changing: true,
                          changeId: instansi.value,
                          changeLabel: instansi.label,
                        })
                      }
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
                      setValue={setProjectInput}
                      onChange={(project) =>
                        setChangeType({
                          changing: true,
                          changeId: project.value,
                          changeLabel: project.label,
                        })
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <button
              className="w-full bg-black p-2 mb-2 rounded-lg text-white text-sm"
              onClick={() => {
                if (requestType === "project")
                  setProjectInput(changeType.changeLabel);
                else setInstansiInput(changeType.changeLabel);

                setChangeType({ ...changeType, changing: false });
              }}
            >
              Simpan
            </button>
            <button
              className="w-full bg-red-500 p-2 rounded-lg text-white text-sm"
              onClick={() => setChangeType({ ...changeType, changing: false })}
            >
              Batal
            </button>
          </>
        )}

        <div className="w-full flex justify-between items-center my-6">
          <h1 className="font-bold text-2xl shrink">Daftar Pengeluaran</h1>
          <button
            type="button"
            className="h-10 w-42 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 shrink-0"
            onClick={() =>
              setOpenPopup({
                name: "add_barang",
                props: { setBarang: setPengeluaranAdd, setBarang2: setBarang },
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
            {!isMobile ? <span className="ml-2">Tambah Barang</span> : null}
          </button>
        </div>

        <div className="border border-gray-300 rounded-md text-xs p-5 mb-8">
          {barang.map((b, i) => (
            <BarangListItem
              barang={b}
              index={i}
              setBarang={setBarang}
              setViewImage={setViewImage}
              removeAction={(barang) => {
                if (barang.id_pengeluaran)
                  setPengeluaranRemove((pRemove) => [
                    ...pRemove,
                    barang.id_pengeluaran,
                  ]);

                setPengeluaranAdd((pAdd) =>
                  pAdd.filter(
                    (p) =>
                      p.deskripsi !== barang.deskripsi &&
                      p.harga !== barang.harga &&
                      p.tanggal_pembelian !== barang.tanggal_pembelian &&
                      p.image !== barang.image
                  )
                );
              }}
            />
          ))}
        </div>

        <hr className="my-4 border-gray-200"></hr>

        <button
          className="w-full p-4 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-center text-sm"
          onClick={() =>
            setWarning({
              headerMessage: "Konfirmasi Perubahan",
              message:
                "Mengubah data request akan mengulang status persetujuannya",
              confirmAction: handleUpdate,
            })
          }
        >
          Simpan Perubahan
        </button>
      </div>
    </PopupContainer>
  );
}
