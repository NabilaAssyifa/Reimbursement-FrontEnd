import { useContext, useEffect, useState } from "react";
import SearchableDropdown from "../components/searchable_dropdown";
import UserSelectDropdown from "../components/searchable_dropdown_user";
import LoadingSpinner from "../components/loading_spinner";
import InstansiSelectDropdown from "../components/searchable_dropdown_instansi";
import request from "../API";
import formatDate from "../data/dateFormatter";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";

export default function ProjectPage() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [namaInput, setNamaInput] = useState("");
  const [deskripsiInput, setDeskripsiInput] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [tanggalInput, setTanggalInput] = useState({ mulai: "", selesai: "" });
  const [leaderInput, setLeaderInput] = useState(undefined);
  const [instansiInput, setInstansiInput] = useState(undefined);

  const [refreshProjects, setRefreshProjects] = useState(true);

  function clearForm() {
    setNamaInput("");
    setDeskripsiInput("");
    setTanggalInput({ mulai: "", selesai: "" });
  }

  async function handleCreate() {
    if (
      !namaInput ||
      !deskripsiInput ||
      !tanggalInput.mulai ||
      !tanggalInput.selesai ||
      !leaderInput ||
      !instansiInput
    )
      return setWarning({
        headerMessage: "Tidak Bisa Membuat",
        message: "Semua field harus terisi",
        singleConfirm: true,
      });

    setLoading({ loading: true, error: false, complete: false });

    const response = await request("POST", "/projects/create", {
      name: namaInput,
      deskripsi: deskripsiInput,
      client: clientInput,
      supervisor_id: leaderInput,
      company_id: instansiInput,
      tanggal_mulai: tanggalInput.mulai,
      tanggal_selesai: tanggalInput.selesai,
    });
    if (!response || response.error) {
      setLoading({ loading: true, error: true, complete: false });
      console.log(response);
      return;
    }

    setLoading({ loading: true, error: false, complete: true });
    setRefreshProjects(!refreshProjects);
    clearForm();
  }

  return (
    <div className="bg-white px-6 font-sans min-h-screen relative overflow-hidden">
      <div>
        <label
          htmlFor="nama-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Nama Project
        </label>
        <input
          type="text"
          id="nama-input"
          placeholder="Masukkan nama project..."
          class=" placeholder-gray-300 block w-full p-2 mb-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={namaInput}
          onChange={(e) => setNamaInput(e.target.value)}
        />
      </div>
      <div className="my-2">
        <label
          htmlFor="deskripsi-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Deskripsi Project
        </label>
        <textarea
          id="deskripsi-input"
          placeholder="Masukkan deskripsi project..."
          class="placeholder-gray-300 mb-3 block w-full text-sm text-gray-900 p-2 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
          style={{ resize: "vertical" }}
          value={deskripsiInput}
          onChange={(e) => setDeskripsiInput(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="client-input"
          class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Nama Client
        </label>
        <input
          type="text"
          id="client-input"
          placeholder="Masukkan nama client..."
          class=" placeholder-gray-300 mb-3 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"          
          value={clientInput}
          onChange={(e) => setClientInput(e.target.value)}
        />
      </div>
      <form>
        <div className="grid gap-6 mt-2 md:grid-cols-2 mb-3">
          <div>
            <label
              htmlFor="mulai-input"
              class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
              >
              Mulai Project
            </label>
            <input
              type="date"
              id="mulai-input"
              class="placeholder-gray-400 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"              
              value={tanggalInput.mulai}
              onChange={(e) =>
                setTanggalInput({ ...tanggalInput, mulai: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="selesai-input"
              class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
              >
              Project Berakhir
            </label>
            <input
              type="date"
              id="selesai-input"
              class="placeholder-gray-400 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"              
              value={tanggalInput.selesai}
              onChange={(e) =>
                setTanggalInput({ ...tanggalInput, selesai: e.target.value })
              }
            />
          </div>
        </div>
      </form>
      <div>
        <label class="block mb-1 text-xs font-medium text-gray-700 dark:text-white"
        >
          Project Manager
        </label>
        <UserSelectDropdown
          placeholder={"- Pilih User -"}
          value={leaderInput}
          setValue={setLeaderInput}
        />
      </div>
      <div>
        <label class="block mb-1 text-xs mt-3 font-medium text-gray-700 dark:text-white"
        >
          Instansi Project
        </label>
        <InstansiSelectDropdown
          placeholder={"- Pilih Instansi -"}
          value={instansiInput}
          setValue={setInstansiInput}
        />
      </div>
      <button
        type="button"
        className="mt-5 w-full text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        onClick={handleCreate}
      >
        Buat Project
      </button>
      <hr className="my-4 border-gray-300" />

      <h1 className="text-2xl font-bold mt-10 mb-5">Project Anda Saat Ini</h1>
      <ProjectsList refreshProjects={refreshProjects} />
    </div>
  );
}

function ProjectsList({ refreshProjects }) {
  const [loading, setLoading] = useState({ loading: true, error: false });
  const [projects, setProjects] = useState([]);

  async function fetchProjects() {
    setLoading({ loading: true, error: false });

    const response = await request("GET", "/projects/own");
    if (!response || response.error) {
      setLoading({ loading: true, error: true });
      console.log(response);
      return;
    }

    setProjects(response);
    setLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchProjects();
  }, [refreshProjects]);

  return (
    <div className="relative overflow-x-auto">
      {loading.loading ? (
        loading.error ? (
          <>
            <h1>Terjadi Kesalahan Saat Mengambil Project</h1>
            <button
              className="mt-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              onClick={fetchProjects}
            >
              Ulangi
            </button>
          </>
        ) : (
          <LoadingSpinner />
        )
      ) : projects.length === 0 ? (
        <h1>Anda Tidak Memiliki Project</h1>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-black uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama project
              </th>
              <th scope="col" className="px-6 py-3">
                Deskripsi Project
              </th>
              <th scope="col" className="px-6 py-3">
                Mulai Project
              </th>
              <th scope="col" className="px-6 py-3">
                Project Berakhir
              </th>
              <th scope="col" className="px-6 py-3">
                Project Manager
              </th>
              <th scope="col" className="px-6 py-3">
                Instansi
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                className="bg-white border-b dark:border-gray-700"
                key={p.id_project}
              >
                <td
                  scope="row"
                  className="px-6 py-4 text-gray-900 whitespace-nowrap text-black"
                >
                  {p.nama_project}
                </td>
                <td className="px-6 py-4 min-w-80">
                  {p.deskripsi !== "" ? p.deskripsi : "-"}
                </td>
                <td className="px-6 py-4">
                  {p.tanggal_mulai ? formatDate(p.tanggal_mulai) : "-"}
                </td>
                <td className="px-6 py-4">
                  {p.tanggal_selesai ? formatDate(p.tanggal_selesai) : "-"}
                </td>
                <td className="px-6 py-4">{p.supervisor}</td>
                <td className="px-6 py-4">{p.instansi}</td>
                <td
                  className={`px-6 py-4 font-bold ${
                    p.status === "berjalan"
                      ? "text-yellow-500"
                      : p.status === "selesai"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {p.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
