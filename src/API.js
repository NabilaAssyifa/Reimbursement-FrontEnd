import { apiHost } from "./data/Keys";

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default async function request(method, route, body) {
  let requestOptions = {
    method: method,
    headers: {
      account_token: getCookie("login")
        ? JSON.parse(getCookie("login")).login_token
        : "NO TOKEN",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET" && body) {
    const formattedBody = body;
    // Object.keys(formattedBody).forEach((prop) => {
    //   if (typeof formattedBody[prop] === "string")
    //     formattedBody[prop] = formattedBody[prop].replace(/['"`]/g, "\\$&");
    // });
    requestOptions = { ...requestOptions, body: JSON.stringify(formattedBody) };
  }

  try {
    const request = await fetch(apiHost + route, requestOptions);
    const response = await request.json();
    return response;
  } catch (error) {
    return { error: error.message };
  }
}
