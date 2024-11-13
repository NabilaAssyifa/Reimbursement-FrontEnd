import avatar from "../assets/icons/avataruser.svg";
import logout from "../assets/icons/iconLogout.svg";
import React, { useContext, useEffect, useState } from "react";
import { MobileContext } from "../providers/MobileProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LoginContext } from "../providers/LoginProvider";

export default function Header() {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [cookies, setCookies, removeCookies] = useCookies();
  let location = useLocation();
  const navigate = useNavigate();

  const { isMobile, setIsMobile } = useContext(MobileContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [crumbs, setCrumbs] = useState([]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    let locationSplit = location.pathname.split("/");
    locationSplit.shift();

    setCrumbs(locationSplit);
  }, []);

  function handleLogout() {
    setLoginData(undefined);
    removeCookies("login");
    navigate("/auth");
  }

  return (
    <header className="flex px-6 flex-row md:justify-between justify-end items-center mb-6">
      {!isMobile ? (
        <p
          className="text-base text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => navigate("/" + crumbs.length > 0 ? crumbs[0] : "")}
        >
          {crumbs.length > 0 ? (
            <>
              {crumbs[0]
                ? crumbs[0].charAt(0).toUpperCase() + crumbs[0].slice(1)
                : "Dashboard"}
              {crumbs.map((c, i) => {
                if (i === 0) return null;
                return (
                  <>
                    {" > "}
                    <span className="ml-1 text-gray-700 cursor-pointer">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </span>
                  </>
                );
              })}
            </>
          ) : null}
        </p>
      ) : null}

      <div className="relative mt-3">
        <button className="flex items-center md:mt-0" onClick={togglePopup}>
          <span className="mr-2 text-sm md:text-s">
            {cookies.login ? cookies.login.username : "UNKNOWN"}
          </span>
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 md:w-8 md:h-8 rounded-full"
          />
        </button>

        {isPopupOpen && (
          <div className="absolute right-0 w-48 bg-white border border-gray-200 dark:bg-gray-900 rounded-b-md z-[1000]">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {cookies.login ? cookies.login.username : "UNKNOWN"}
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {cookies.login ? cookies.login.email : "UNKNOWN"}
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {cookies.login ? cookies.login.role : "UNKNOWN"}
              </span>
            </div>
            <hr className=" border-gray-300" />

            <button
              className="flex items-center  w-full p-2 text-red-800 hover:bg-gray-100 hover:rounded-b-md font-medium"
              onClick={handleLogout}
            >
              <img
                className="ml-2"
                src={logout}
                alt="Logout icon"
                style={{ width: "20px", height: "20px" }}
              />
              <span className="ml-2 text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
