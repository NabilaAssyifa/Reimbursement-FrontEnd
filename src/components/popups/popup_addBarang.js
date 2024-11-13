import { useContext, useState } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";

import PopupContainer from "../popup_container";
import { PopupContext } from "../../providers/PopupProvider";
import NumberInput from "../number_input";
import { WarningContext } from "../../providers/WarningProvider";
import FileInput from "../file_input";

export default function Popup_AddBarang() {
  const { openPopup, setOpenPopup } = useContext(PopupContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [deskripsiInput, setdeskripsiInput] = useState("");
  const [tanggalInput, setTanggalInput] = useState("");
  const [hargaInput, setHargaInput] = useState("");
  const [fileInput, setFileInput] = useState([]);

  function handleAdd() {
    if (
      !deskripsiInput ||
      !tanggalInput ||
      !hargaInput ||
      fileInput.length <= 0
    )
      return setWarning({
        headerMessage: "Tidak Bisa Menambahkan",
        message: "Semua field harus terisi",
        singleConfirm: true,
      });

    openPopup.props.setBarang((prevBarang) => [
      ...prevBarang,
      {
        deskripsi: deskripsiInput,
        harga: hargaInput,
        tanggal_pembelian: tanggalInput,
        image: fileInput[0],
      },
    ]);

    if (openPopup.props.setBarang2)
      openPopup.props.setBarang2((prevBarang) => [
        ...prevBarang,
        {
          deskripsi: deskripsiInput,
          harga: hargaInput,
          tanggal_pembelian: tanggalInput,
          image: fileInput[0],
        },
      ]);

    setOpenPopup(undefined);
  }

  return (
    <PopupContainer zIndex={800}>
      <div className="w-[40%] h-[90vh] min-w-96 p-4 bg-white rounded-lg overflow-y-scroll">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold">Tambah Pengeluaran</h2>
          <img
            src={closeIcon}
            className="svg-black cursor-pointer"
            onClick={() => setOpenPopup(undefined)}
          />
        </div>

        <div className="mb-3 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Pengeluaran
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 p-2 rounded-lg text-xs"
            placeholder="Jelaskan pembelian pengeluaran"
            value={deskripsiInput}
            onChange={(e) => setdeskripsiInput(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Harga Total (dalam Rp)
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 px-3 p-2 rounded-lg text-xs"
            placeholder="Masukkan Total Harga Barang"
            value={hargaInput}
            onChange={(e) => {
              setHargaInput(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Tanggal Pembelian
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 px-3 p-2 rounded-lg text-xs"
            placeholder="Masukkan Total Harga Barang"
            value={tanggalInput}
            onChange={(e) => setTanggalInput(e.target.value)}
          />
        </div>

        {fileInput.length <= 0 ? (
          <FileInput setValue={setFileInput} singleFile={true} />
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Bukti Pembayaran
            </label>
            <div className="bg-gray-200 rounded-lg w-[80%] mx-auto h-auto aspect-square mb-2 relative p-1">
              <img
                className="w-full h-full object-contain"
                src={URL.createObjectURL(fileInput[0])}
              />
              <button
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white text-center text-xs"
                onClick={() => setFileInput([])}
              >
                Ubah
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          className="bg-gray-800 w-full mb-3 text-white text-xs py-2 px-4 rounded-lg hover:bg-gray-900"
          onClick={handleAdd}
        >
          Tambah
        </button>
      </div>
    </PopupContainer>
  );
}
