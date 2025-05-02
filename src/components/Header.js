import React, { useState } from "react";
import "../styles/buttons.css";
import "../styles/header.css";
import { ReactComponent as Logo } from "../images/AnirumLogo.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthButtons from "./Header/AuthButtons";
import UserProfile from "./Header/UserProfile";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import LanguageCurrencySelector from "./LanguageCurrencySelector";
import { IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import useLanguageAndCurrency from "../hooks/useLanguageAndCurrency";
import { selectLanguageCode } from "../redux/reducers/languageReducer";

function Header() {
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { selectedCurrency } = useLanguageAndCurrency();
  const languageCode = useSelector(selectLanguageCode);

  const handleCloseLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  return (
    <div
      className="header"
      style={{
        zIndex: 1000,
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <Logo style={{ height: "25px", width: "auto" }} />
      <div>
        {" "}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <button className="button_white button-animate-filter">
            <div className="h5">{t("header.courses")}</div>
          </button>
        </Link>
        <Link
          to="/guides"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <button className="button_white button-animate-filter">
            <div className="h5">{t("header.guides")}</div>
          </button>
        </Link>
        <Link
          to="/skill-tree"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <button className="button_white button-animate-filter">
            <div className="h5">{t("header.skillTree")}</div>
          </button>
        </Link>
        {user?.role?.id === Number(ManagerId) && (
          <Link
            to="/chat"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <button className="button_white button-animate-filter">
              <div className="h5">{t("header.chat")}</div>
            </button>
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton
          onClick={() => setIsLanguageModalOpen(true)}
          sx={{
            color: "black",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          style={{ marginRight: "12px" }}
        >
          <LanguageIcon />
        </IconButton>
        {user ? <UserProfile /> : <AuthButtons />}
      </div>

      <LanguageCurrencySelector
        open={isLanguageModalOpen}
        onClose={handleCloseLanguageModal}
        selectedCurrency={selectedCurrency}
        selectedLanguage={languageCode}
      />
    </div>
  );
}

export default Header;
