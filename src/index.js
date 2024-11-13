import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import "./assets/css/responsive/index_res.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/Auth";
import LoginProvider from "./providers/LoginProvider";
import Dashboard from "./pages/Dashboard";
import MobileProvider from "./providers/MobileProvider";
import ProjectPage from "./pages/Project";
import LoadingProvider from "./providers/LoadingProvider";
import WarningProvider from "./providers/WarningProvider";
import RequestPage from "./pages/Request";
import PopupProvider from "./providers/PopupProvider";
import RiwayatPage from "./pages/Riwayat";
import RequestDetailsPage from "./pages/RequestDetails";
import NotFoundPage from "./pages/404";
import ApprovalPage from "./pages/Approval";
import ReportPage from "./pages/Report";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Outlet />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/project",
            element: <ProjectPage />,
          },
          {
            path: "/request",
            element: <RequestPage />,
          },
          {
            path: "/riwayat",
            element: <RiwayatPage />,
          },
          {
            path: "/riwayat/request/:id_request",
            element: <RequestDetailsPage />,
          },
          {
            path: "/approval",
            element: <ApprovalPage />,
          },
          {
            path: "/approval/request/:id_request",
            element: <RequestDetailsPage />,
          },
          {
            path: "/report",
            element: <ReportPage />,
          },
          {
            path: "/report/request/:id_request",
            element: <RequestDetailsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MobileProvider>
      <LoadingProvider>
        <WarningProvider>
          <LoginProvider>
            <PopupProvider>
              <RouterProvider router={router} />
            </PopupProvider>
          </LoginProvider>
        </WarningProvider>
      </LoadingProvider>
    </MobileProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
