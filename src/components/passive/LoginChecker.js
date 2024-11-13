import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../providers/LoginProvider";
import { useCookies } from "react-cookie";
import { LoadingContext } from "../../providers/LoadingProvider";
import request from "../../API";

export default function LoginChecker() {
  const { loginData, setLoginData } = useContext(LoginContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const [cookies, setCookies, removeCookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyCookies() {
      setLoading({ loading: true, error: false, complete: false });

      const response = await request(
        "POST",
        "/users/cookielogin",
        cookies.login
      );
      if (!response || response.error) {
        console.log(response);
        setLoading({ loading: true, error: true, complete: false });
        navigate("/auth");
        return;
      }

      if (response.success)
        setLoginData({
          id_user: response.userData.id_user,
          username: response.userData.username,
          email: response.userData.email,
          role: response.userData.role,
          login_token: response.userData.login_token,
        });
      else navigate("/auth");

      setLoading({ loading: false, error: false, complete: false });
    }

    if (!loginData) {
      if (cookies.login) verifyCookies();
      else navigate("/auth");
    }
  }, []);
}
