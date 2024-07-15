import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //We are on the server

    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx",
      headers: req.headers,
    });
  } else {
    // we must be on the server

    return axios.create({
      baseURL: "/",
    });
  }
};
