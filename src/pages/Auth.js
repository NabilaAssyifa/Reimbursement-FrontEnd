import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/img/jetkoms.svg";
import loginBackground from "../assets/img/login_bg.svg";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";
import GlobalLoading from "../components/global/global_loading";
import GlobalWarning from "../components/global/global_warning";
import request from "../API";
import { useCookies } from "react-cookie";
import { LoginContext } from "../providers/LoginProvider";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);
  const { loginData, setLoginData } = useContext(LoginContext);
  const [cookies, setCookies, removeCookies] = useCookies();
  const navigate = useNavigate();

  const [input, setInput] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleLogin() {
    if (!input.email || !input.password)
      return setWarning({
        headerMessage: "Tidak Bisa Login",
        message: "Email dan password tidak boleh kosong",
        singleConfirm: true,
      });

    setLoading({ loading: true, error: false, complete: false });

    const response = await request("POST", "/users/login", input);
    if (!response || response.error) {
      console.log(response);
      setLoading({ loading: true, error: true, complete: false });
      return;
    }

    if (response.success) {
      const responseData = {
        id_user: response.userData.id_user,
        username: response.userData.username,
        email: response.userData.email,
        role: response.userData.role,
        login_token: response.userData.login_token,
      };
      setCookies("login", responseData);
      setLoginData(responseData);
      navigate("/");
    } else
      setWarning({
        headerMessage: "Akun Tidak Ditemukan",
        message: "Email dan/atau password salah",
        singleConfirm: true,
      });

    setLoading({ loading: false, error: false, complete: false });
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen ">
        <div className="lg:w-1/2 w-full flex flex-col justify-center px-8 lg:px-20 py-10">
          {/* <img src={logo} alt="Logo" className="w-72 mb-7  " /> */}
          <h4 className="text-gray-500 text-sm mb-2">
            HALO, SELAMAT DATANG 👋
          </h4>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Lanjutkan ke Akun Anda.
          </h1>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                placeholder="emailanda@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                PASSWORD
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="**********"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={input.password}
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
              />
              <div
                className="mt-5 absolute inset-y-0 right-4 flex items-center cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800"
              onClick={handleLogin}
            >
              MASUK
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 justify-end items-center">
          <div
            className="w-8/12 h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${loginBackground})` }}
          ></div>
        </div>
      </div>

      {/* Pop Up Menus */}
      {loading.loading ? (
        <GlobalLoading error={loading.error} complete={loading.complete} />
      ) : null}
      {warning ? (
        <GlobalWarning
          headerMessage={warning.headerMessage}
          message={warning.message}
          singleConfirm={warning.singleConfirm}
          confirmAction={warning.confirmAction}
          confirmDanger={warning.confirmDanger}
        />
      ) : null}
    </>
  );
}
