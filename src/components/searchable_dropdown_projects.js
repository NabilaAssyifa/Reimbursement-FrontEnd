import { useEffect, useState } from "react";
import SearchableDropdown from "./searchable_dropdown";
import request from "../API";

export default function ProjectsSelectDropdown({
  placeholder,
  value,
  setValue,
  customStyle,
  onChange,
}) {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);

      const response = await request("GET", "/projects/own");
      if (!response || response.error) {
        alert("Gagal mengambil data project");
        return;
      }

      setAllUsers(
        response.map((r) => {
          return { value: r.id_project, label: r.nama_project };
        })
      );
      setLoading(false);
    }

    fetchAllUsers();
  }, []);

  return (
    <SearchableDropdown
      defaultMessage={placeholder}
      contents={allUsers}
      isLoading={loading}
      initialValue={value}
      setValue={setValue}
      customStyle={customStyle}
      onChange={onChange}
    />
  );
}
