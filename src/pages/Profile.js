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
import { ReactComponent as SettingsIcon } from "../images/settings.svg";
import { useNavigate } from "react-router-dom";
import PortfolioSkillTree from "../components/Profile/PortfolioSkillTree";

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: profile, isLoading, error } = useGetUserProfileDetailsQuery(id);

  // По умолчанию выбран компонент "Креативы"
  const [activeTab, setActiveTab] = useState("Креативы");

  if (error) {
    return <div>Ошибка загрузки профиля.</div>;
  }

  const handleClickSettings = () => {
    navigate(`/settings/${id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "24px 24px 0px 24px" }}>
        {user && user.id === Number(id) && isMobile && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "left",
            }}
          >
            {!isLoading ? (
              <button
                className="button_icon"
                onClick={handleClickSettings}
                style={{ width: "30px", height: "30px" }}
              >
                <SettingsIcon style={{ width: "15px", height: "15px" }} />
              </button>
            ) : (
              <Skeleton
                variant="circular"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              />
            )}
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
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
          {!isLoading ? (
            <div className="Body-3" style={{ marginTop: "16px" }}>
              0 LVL
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "15%",
                height: "16px",
                borderRadius: "4px",
                marginTop: "16px",
              }}
            />
          )}
          {!isLoading ? (
            <div className="Body-3" style={{ marginTop: "16px" }}>
              nickname
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "30%",
                height: "16px",
                borderRadius: "4px",
                marginTop: "16px",
              }}
            />
          )}
        </div>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: isLoading ? "center" : "center", // всегда по центру
              minWidth: "min-content",
              paddingBottom: "16px",
              // padding: "0 8px", // добавляем симметричный отступ
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
            <div style={{ padding: "4px" }} className="button-group">
              <button
                onClick={() => setActiveTab("Древо навыков")}
                className={
                  activeTab === "Древо навыков"
                    ? "selected button-animate Body-3"
                    : "button-animate Body-3"
                }
                style={{ whiteSpace: "nowrap" }}
              >
                Древо навыков
              </button>
            </div>
          </div>
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
          marginTop: "12px",
        }}
      >
        {activeTab === "Креативы" && <CreationsGallery id={id} />}
        {activeTab === "Портфолио" && <PortfolioGallery id={id} />}
        {activeTab === "Древо навыков" && <PortfolioSkillTree id={id} />}
      </div>
    </div>
  );
}
