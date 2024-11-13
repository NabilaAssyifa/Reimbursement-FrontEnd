import { Outlet } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import MobileChecker from "./components/passive/MobileChecker";
import LoginChecker from "./components/passive/LoginChecker";
import { useContext } from "react";
import { LoadingContext } from "./providers/LoadingProvider";
import { WarningContext } from "./providers/WarningProvider";
import GlobalLoading from "./components/global/global_loading";
import GlobalWarning from "./components/global/global_warning";
import { PopupContext } from "./providers/PopupProvider";
import { popups, getPopup } from "./data/popupContent";

function App() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarnig } = useContext(WarningContext);
  const { openPopup, setOpenPopup } = useContext(PopupContext);

  return (
    <section className="app-container">
      {/* Passive Components */}
      <MobileChecker />
      <LoginChecker />

      {/* Main Site Content */}
      <Sidebar />
      <section className="app-content">
        <Header />
        <Outlet />
        {/* <Footer /> */}
        <div className="h-32"></div>
      </section>

      {/* Pop Up Menus */}
      {loading.loading ? (
        <GlobalLoading
          error={loading.error}
          complete={loading.complete}
          customMessage={loading.customMessage}
        />
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

      {openPopup ? getPopup(openPopup.name) : null}
    </section>
  );
}

export default App;
