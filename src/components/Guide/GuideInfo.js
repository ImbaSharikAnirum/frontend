import React from "react";
import GuideMore from "./GuideMore";
import moment from "moment";
import { ReactComponent as Download } from "../../images/Download.svg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { Skeleton } from "@mui/material";

export default function GuideInfo({
  authorId,
  info,
  id,
  openComplainModal,
  openDeleteModal,
  openCreationModal,
  openNotAuthModal,
  isLoading,
}) {
  const user = useSelector(selectCurrentUser);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <div
      style={{
        width: "400px",
        height: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ padding: "24px" }}>
        <div
          className="Body-3"
          style={{
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            {!isLoading ? (
              <button onClick={handleShare} className="button_icon">
                <Download style={{ height: "14px" }} />
              </button>
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}
            {!isLoading ? (
              <div style={{ marginLeft: "8px" }}>
                <GuideMore
                  onOpenComplain={openComplainModal}
                  onOpenDelete={openDeleteModal}
                  authorId={authorId}
                />
              </div>
            ) : (
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                style={{ marginLeft: "8px" }}
              />
            )}
          </div>
          {!isLoading ? (
            <div>{moment(info.createdAt).format("DD.MM.YYYY")}</div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "90px",
                height: "16px",
                borderRadius: "4px",
              }}
            />
          )}
        </div>
        {!isLoading ? (
          <div className="Body-3" style={{ marginTop: "16px" }}>
            {info.title}
          </div>
        ) : (
          <Skeleton
            variant="rectangular"
            style={{
              width: "60%",
              height: "16px",
              borderRadius: "4px",
              marginTop: "16px",
            }}
          />
        )}
        {!isLoading ? (
          <div
            className="Body-3"
            style={{
              marginTop: "14px",
              fontSize: "14px",
            }}
          >
            {info.text}
          </div>
        ) : (
          <Skeleton
            variant="rectangular"
            style={{
              width: "90%",
              height: "64px",
              borderRadius: "4px",
              marginTop: "16px",
            }}
          />
        )}
      </div>

      <div style={{ padding: "24px" }}>
        {!isLoading ? (
          <button
            className="button Body-3 button-animate-filter"
            onClick={() => {
              if (!user) {
                openNotAuthModal();
              } else {
                openCreationModal();
              }
            }}
          >
            Загрузить свою работу
          </button>
        ) : (
          <Skeleton
            variant="rectangular"
            style={{ width: "220px", height: "40px", borderRadius: "30px" }}
          />
        )}
      </div>
    </div>
  );
}
