import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { useGetUserProfileDetailsQuery } from "../redux/services/userProfileAPI";
import { Skeleton } from "@mui/material";
import { Avatar } from "@mui/material";
import CreationsGallery from "../components/Profile/CreationsGallery";
import PortfolioGallery from "../components/Profile/PortfolioGallery";
import { useMediaQuery } from "react-responsive";

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { id } = useParams();
  const { data: profile, isLoading, error } = useGetUserProfileDetailsQuery(id);

  // По умолчанию выбран компонент "Креативы"
  const [activeTab, setActiveTab] = useState("Креативы");

  if (error) {
    return <div>Ошибка загрузки профиля.</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: isMobile ? "-24px" : "-40px",
        marginRight: isMobile ? "-24px" : "-40px",
        // width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <div>
          {!isLoading ? (
            <Avatar
              sx={{
                height: 100,
                width: 100,
              }}
              alt="Avatar"
              src={
                profile?.avatar?.formats?.small?.url ||
                profile?.avatar?.url ||
                ""
              }
            />
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        <div className="Body-3" style={{ marginTop: "16px" }}>
          0 LVL
        </div>
        <div className="Body-3" style={{ marginTop: "16px" }}>
          nickname
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div style={{ padding: "4px" }} className="button-group">
          <button
            onClick={() => setActiveTab("Креативы")}
            className={
              activeTab === "Креативы"
                ? "selected button-animate Body-3"
                : "button-animate Body-3"
            }
          >
            Креативы
          </button>
        </div>
        <div style={{ padding: "4px" }} className="button-group">
          <button
            onClick={() => setActiveTab("Портфолио")}
            className={
              activeTab === "Портфолио"
                ? "selected button-animate Body-3"
                : "button-animate Body-3"
            }
          >
            Портфолио
          </button>
        </div>
      </div>
      {/* <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "right",
          marginTop: "40px",
        }}
      >
        <div style={{ marginRight: "40px" }}>+</div>
      </div> */}
      <div
        style={{
          marginTop: "24px",
          marginLeft: isMobile ? "8px" : "16px",
          marginRight: isMobile ? "8px" : "16px",
        }}
      >
        {activeTab === "Креативы" ? (
          <CreationsGallery id={id} />
        ) : (
          <PortfolioGallery id={id} />
        )}
      </div>
    </div>
  );
}
