import { useEffect, useRef, useState } from "react";
import request from "../API";
import LoadingSpinner from "../components/loading_spinner";
import formatDate from "../data/dateFormatter";
import formatPrice from "../data/priceFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faClock, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <>
      <div className="h-0.5">
      <NumsContainer />
      <StatsContainer />
      </div>
    </>
  );
}

function NumsContainer() {
  const numsContainer = useRef(null);
  const [numScrolling, setNumScrolling] = useState(false);
  const [dashData, setDashData] = useState(undefined);

  useEffect(() => {
    function handleResize() {
      if (numsContainer.current) {
        setNumScrolling(
          numsContainer.current.scrollWidth > numsContainer.current.clientWidth
        );
      }
    }

    async function fetchData() {
      const response = await request("GET", "/misc/dashboard");
      if (!response || response.error) {
        alert("Gagal mengambil data dashboard");
        console.log(response);
        return;
      }

      setDashData(response);
    }

    fetchData();

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="px-6" >
    <div className="w-full mx-auto px-4 justify-center items-center py-9 md:px-28 py-2 border justify-center border-gray-100 rounded-lg bg-gray-50 ">
      <section className="max-w-screen-xl justify-center grid gap-12 md:grid-cols-4 md:gap-48 ">
        <AnimatedNumberWrapper target={40} label="Pending" icon={faClock} color="yellow" />
        <AnimatedNumberWrapper target={40} label="Ditolak" icon={faCircleXmark} color="red" />
        <AnimatedNumberWrapper target={40} label="Disetujui" icon={faThumbsUp} color="blue" />
        <AnimatedNumberWrapper target={40} label="Selesai" icon={faCircleCheck} color="green" />
      </section>
    </div>
    </div>
  );
}

function AnimatedNumberWrapper({ target, label, icon, color }) {
  const [animatedNum, setAnimatedNum] = useState(0);

  useEffect(() => {
    const startNum = 0;
    const endNum = target;
    const duration = 3; 
    const stepTime = (duration * 1000) / (endNum - startNum);

    let currentNum = startNum;
    const interval = setInterval(() => {
      if (currentNum < endNum) {
        currentNum++;
        setAnimatedNum(currentNum);
      } else {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval); 
  }, [target]);

  return (
    <article>
      <div className="w-14 h-14 rounded shadow-md bg-white flex justify-center items-center rotate-3 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="20">
          <FontAwesomeIcon icon={icon} className={`text-${color}-500`} />
        </svg>
      </div>
      <h2>
        <span className="flex tabular-nums text-slate-900 text-5xl font-extrabold mb-2">
          <span>{animatedNum}</span>
        </span>
        <span className={`inline-flex font-semibold text-${color}-500 mb-2`}>
          {label}
        </span>
      </h2>
    </article>
  );
}


function StatsContainer() {
  const [loading, setLoading] = useState({ loading: true, error: false });
  const [mostRecent, setMostRecent] = useState(undefined);
  const [waitingCount, setWaitingCount] = useState(0);
  const [projects, setProjects] = useState([]);

  async function fetchStats() {
    setLoading({ loading: true, error: false });

    const response = await request("GET", "/misc/dashboard/stats");
    if (!response || response.error) {
      console.log(response);
      return setLoading({ loading: true, error: true });
    }

    setMostRecent(response.latest[0]);
    setWaitingCount(response.amount);
    setProjects(response.projects);
    setLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      {loading.loading ? (
        loading.error ? (
          <>
            <h1 className="w-full text-center mb-4">
              Gagal Menampilkan Data Dashboard
            </h1>
            <button
              className="p-2 bg-gray-700 hover:bg-gray-800 cursor-pointer rounded-lg text-white text-center block mx-auto"
              onClick={fetchStats}
            >
              Ulangi
            </button>
          </>
        ) : (
          <LoadingSpinner />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 p-6 gap-4 md:h-[30em]">
          <div className="row-span-2">
            {mostRecent ? (
              <>
                <h2 className=" mb-2">Request Terbaru Anda</h2>
                <div className="bg-[#282828] rounded-lg p-4 grid grid-cols-2 gap-2 text-white min-h-80">
                  <p className=" pt-2 col-span-2 font-bold">
                    {mostRecent.judul} -{" "}
                    <span
                      style={{
                        color:
                          mostRecent.status === "pending"
                            ? "yellow"
                            : mostRecent.status === "diterima"
                            ? "blue"
                            : mostRecent.status === "ditolak"
                            ? "red"
                            : "green",
                      }}
                    >
                      {mostRecent.status.toUpperCase()}
                    </span>
                  </p>
                  <textarea
                    readOnly
                    style={{ resize: "vertical" }}
                    value={mostRecent.deskripsi}
                    placeholder="Tidak ada deskripsi"
                    className="text-xs p-2 col-span-2 rounded-md bg-transparent h-fit"
                  ></textarea>
                  <div className="">
                    <p className="font-bold">Project</p>
                    <p className="text-xs">{mostRecent.project ?? "-"}</p>
                  </div>
                  <div className="">
                    <p className="font-bold">Instansi</p>
                    <p className="text-xs">{mostRecent.instansi}</p>
                  </div>
                  <p className="  col-span-2 text-sm">
                    Tanggal Pembuatan: {formatDate(mostRecent.tanggal_request)}
                  </p>
                  <p className=" col-span-2 text-sm">
                    Total Harga:{" "}
                    <span className="font-bold">
                      {formatPrice(mostRecent.harga)}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="ml-2 mb-2">Request Terbaru Anda</h2>
                <div className="bg-black rounded-3xl p-4 text-white min-h-96 mb-[-40px]">
                  <p>Anda Tidak Memiliki Request</p>
                </div>
              </>
            )}
          </div>
          <div>
            <h2 className="mb-2">Data Untuk Approver</h2>
            <div className="border border-gray-300 rounded-lg p-4 text-white mb-6">
              <h1 className="w-full text-5xl text-black italic font-bold text-center">
                {waitingCount.toString().padStart(2, "0")}
              </h1>
              <p className="w-full text-center text-black">
                Request Untuk Anda Review
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 text-white h-48 overflow-y-scroll mb-[20px]">
              <h2 className="text-black font-bold mb-2">Project Anda</h2>
              <ul>
                {projects.length > 0 ? (
                  projects.map((p, i) => (
                    <li
                      key={i}
                      className="text-black border-y-2 border-gray-300 py-2"
                    >
                      <p className="text-sm">
                        {p.nama_project} - {p.status.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Total {p.request_count} Request
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-black text-sm">Tidak ada data</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
