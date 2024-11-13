const {
  default: Popup_AddBarang,
} = require("../components/popups/popup_addBarang");

const popups = [
  {
    name: "add_barang",
    element: <Popup_AddBarang />,
  },
];

function getPopup(name) {
  const targetPopup = popups.find((p) => p.name === name);
  if (targetPopup) return targetPopup.element;
  else return null;
}

export { popups, getPopup };
