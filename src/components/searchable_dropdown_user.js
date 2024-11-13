import { useEffect, useState } from "react";
import SearchableDropdown from "./searchable_dropdown";
import request from "../API";

export default function UserSelectDropdown({ placeholder, value, setValue }) {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);

      const response = await request("GET", "/users/userlist");
      if (!response || response.error) {
        alert("Gagal mengambil data user");
        return;
      }

      setAllUsers(
        response.map((r) => {
          return { value: r.id_user, label: r.username };
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
    />
  );
}
