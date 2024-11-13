import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import deleteIcon from "../assets/icons/deleteIcon.svg";
import formatDate from "../data/dateFormatter";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";

const { useState } = require("react");
const { default: formatPrice } = require("../data/priceFormatter");

export default function BarangListItem({
  barang,
  index,
  setBarang,
  setViewImage,
  noAction,
  removeAction,
}) {
  // barang: [{deskripsi: '', harga: 0, tanggal_pembelian: '', image: ''}, ...{}]
  const [expanded, setExpanded] = useState(false);

  function handleRemove() {
    if (removeAction && typeof removeAction === "function")
      removeAction(barang);

    setBarang((prevBarang) => {
      let barangCopy = [...prevBarang];
      barangCopy.splice(index, 1);
      return barangCopy;
    });
  }

  return (
    <div key={index}>
      {/* Collapsed view */}
      <button
        className={`w-full bg-gray-100 p-3 rounded-lg shadow flex justify-between items-center ${
          !expanded ? "mb-3" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{barang.deskripsi}</span>
        <span className="text-gray-500">≡</span>
      </button>

      {/* Expanded view */}
      {expanded ? (
        <div className={`w-full overflow-x-scroll ${expanded ? "mb-3" : ""}`}>
          <table className="w-full bg-gray-100 rounded-lg shadow-md gap-4 text-sm min-w-96">
            <thead>
              <th className="py-4">Deskripsi Pengeluaran</th>
              <th className="py-4">Harga Total</th>
              <th className="py-4">Tanggal Pembelian</th>
              <th className="py-4">Gambar</th>
              {!noAction ? <th className="pr-4">Hapus</th> : null}
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-center">{barang.deskripsi}</td>
                <td className="py-2 text-center">
                  {formatPrice(barang.harga)}
                </td>
                <td className="py-2 text-center">
                  {formatDate(barang.tanggal_pembelian)}
                </td>
                <td className="py-2 text-center text-lg">
                  <FontAwesomeIcon
                    icon={faImage}
                    size="1x"
                    color="black"
                    className="cursor-pointer p-2 rounded hover:bg-gray-300"
                    onClick={() => setViewImage(barang.image)}
                  />
                </td>
                {!noAction ? (
                  <td className="pr-2 text-center text-lg">
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="1x"
                      color="red"
                      className="cursor-pointer p-2 rounded hover:bg-gray-300"
                      onClick={handleRemove}
                    />
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
