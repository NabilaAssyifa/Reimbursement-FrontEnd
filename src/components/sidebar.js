import React, { useState, useEffect, useRef, useContext } from "react";
import logo from "../assets/img/jetkoms.svg";
import { RiMenu2Line } from "react-icons/ri";
import iconGrid from "../assets/icons/iconGrid.svg";
import iconProject from "../assets/icons/project.svg";
import iconApproval from "../assets/icons/icApproval.svg";
import iconReimburse from "../assets/icons/reimburst2.svg";
import iconRiwayat from "../assets/icons/riwayat.svg";
import { useLocation } from "react-router-dom";
import { MobileContext } from "../providers/MobileProvider";
import sidebarContent from "../data/sidebarContent";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      overlayRef.current &&
      overlayRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div>
      {isMobile && !isSidebarOpen && (
        <div className="fixed top-3 left-6 z-50 p-4">
          <RiMenu2Line
            className="text-2xl cursor-pointer hover:text-gray-500 transition duration-100"
            onClick={toggleSidebar}
          />
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-[250px] h-full bg-[#1D1C21] shadow-md z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center pl-10 mt-10">
        <h1 className="text-xl font-bold text-white mb-10" >Quinsis Group</h1>         
        </div>

        {sidebarContent.map((item, index) => {
          const pathCheck =
            location.pathname === "/" ? "/dash" : location.pathname;
          const itemCheck = item.route === "/" ? "/dash" : item.route;

          return (
            <ul className="mt-2" key={index}>
              <li className="py-2">
                <a
                  href={item.route}
                  className={
                    "flex items-center text-white font-sans hover:bg-neutral-700 transition-all duration-200 h-14 w-full " +
                    (pathCheck.startsWith(itemCheck)
                      ? "border-l-4 border-white"
                      : "")
                  }
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <img
                    src={item.icon}
                    alt="Grid Icon"
                    className="mr-5 ml-10"
                    style={{ width: "22px", height: "22px" }}
                  />
                  {item.label}
                </a>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}
