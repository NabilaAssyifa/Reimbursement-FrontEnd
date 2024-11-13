import { createContext, useState } from "react";

export const PopupContext = createContext();

function PopupProvider({ children }) {
  // {name: '', props: {}}
  const [openPopup, setOpenPopup] = useState(undefined);

  return (
    <PopupContext.Provider value={{ openPopup, setOpenPopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export default PopupProvider;
