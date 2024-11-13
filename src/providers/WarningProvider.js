import { createContext, useState } from "react";

export const WarningContext = createContext();

function WarningProvider({ children }) {
  // {headerMessage: '', message: '', singleConfirm: false, confirmAction: ()=>{}, confirmDanger: false}
  //   const [warning, setWarning] = useState(undefined);
  const [warning, setWarning] = useState(undefined);

  return (
    <WarningContext.Provider value={{ warning, setWarning }}>
      {children}
    </WarningContext.Provider>
  );
}

export default WarningProvider;