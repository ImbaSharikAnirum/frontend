import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducers/authReducer";
import axios from "axios";

import { toast } from "react-toastify";

export default function Authenticated() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API;

  const url = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("access_token");
  let servicePath = "";

  if (url.includes("discord")) {
    servicePath = "discord";
  } else if (url.includes("google")) {
    servicePath = "google";
  }

  if (servicePath && accessToken) {
    authenticateUser(servicePath, accessToken);
  }

  function authenticateUser(servicePath, accessToken) {
    axios
      .get(`${API}/auth/${servicePath}/callback?access_token=${accessToken}`)
      .then((response) => {
        dispatch(setUser(response.data));
        localStorage.setItem("token", response.data.jwt || "");
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate(`/`);
        toast.success(`Вы вошли через ${servicePath}`);
      })
      .catch((error) => {
        console.error("Failed:", error);
        navigate(`/`);
        toast.error("Произошла ошибка, попробуйте снова");
      });
  }

  return <div>Authenticated</div>;
}
