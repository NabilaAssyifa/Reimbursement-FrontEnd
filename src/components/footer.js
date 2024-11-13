import React from "react";
import logo from "../assets/img/jetkoms.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-100 h-28 p-6 mt-6  ">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-0 md:mb-6">
        <img src={logo} alt="Logo" className="w-32 h-12" />
        <div className="text-xs text-center md:text-left">
          <p>Jl. Tegal Rotan Raya No.9 A, Sawah Baru, Kec. Ciputat,</p>
          <p>Kota Tangerang Selatan, Banten 15412</p>
          <div className="mt-1">
            <a
              href="tel:02122678216"
              className="text-blue-400 hover:text-blue-700 mr-2"
            >
              021 2267 8216
            </a>
            |
            <a
              href="mailto:rumbi@gmail.com"
              className="text-blue-400 hover:text-blue-700 ml-2"
            >
              rumbi@gmail.com
            </a>
          </div>
        </div>
      </div>
      <p className="text-xs text-right ">© 2024 Rumbi. All rights reserved.</p>
    </footer>
  );
}
