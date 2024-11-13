import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";

import RequestDetailsPage from "../../pages/RequestDetails";
import PopupContainer from "../popup_container";
import LoadingSpinner from "../loading_spinner";
import formatDate from "../../data/dateFormatter";
import request from "../../API";

export default function RequestVersion({ requestData, setClose }) {
  const [versionLoading, setVersionLoading] = useState({
    loading: true,
    error: true,
  });
  const [versionItems, setVersionItems] = useState([]);
  const [versionApproval, setVersionApproval] = useState([]);

  async function fetchVersion() {
    setVersionLoading({ loading: true, error: false });

    const barangResponse = await request(
      "GET",
      `/requests/versionhistory/${requestData.id_request}/${requestData.version}/barang`
    );
    if (!barangResponse || barangResponse.error) {
      console.log(barangResponse);
      return setVersionLoading({ loading: true, error: true });
    }

    const approvalResponse = await request(
      "GET",
      `/requests/versionhistory/${requestData.id_request}/${requestData.version}/approval`
    );
    if (!approvalResponse || approvalResponse.error) {
      console.log(approvalResponse);
      return setVersionLoading({ loading: true, error: true });
    }

    setVersionItems(barangResponse);
    setVersionApproval(approvalResponse);

    setVersionLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchVersion();
  }, []);

  return (
    <PopupContainer zIndex={800}>
      <button
        className="p-2 rounded-full bg-black hover:bg-gray-500 absolute top-0 right-0 mt-4 mr-4"
        onClick={setClose}
      >
        <img src={closeIcon} />
      </button>
      <div className="bg-white p-2 w-full md:max-w-5xl h-[95%] rounded-lg shadow-lg overflow-y-scroll">
        <h1 className="font-bold text-3xl mb-8 text-gray-700 mt-4 ml-4">
          Versi {requestData.version} -{" "}
          {formatDate(requestData.tanggal_request)}
        </h1>
        {versionLoading.loading ? (
          versionLoading.error ? (
            <h1 className="text-center">Gagal Mengambil Riwayat Edit</h1>
          ) : (
            <LoadingSpinner />
          )
        ) : (
          <RequestDetailsPage
            overrideData={{
              details: requestData,
              barang: versionItems,
              approval: versionApproval,
            }}
          />
        )}
      </div>
    </PopupContainer>
  );
}
