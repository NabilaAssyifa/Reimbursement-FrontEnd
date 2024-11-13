import { useLocation, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  let location = useLocation();

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-9xl text-gray-400 hover:text-gray-500 font-bold cursor-default">
        404
      </h1>
      <p>
        Halaman <span className="italic font-bold">{location.pathname}</span>{" "}
        tidak ditemukan
      </p>
      <button
        className="p-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
        onClick={() => navigate("/")}
      >
        Kembali ke dashboard
      </button>
    </section>
  );
}
