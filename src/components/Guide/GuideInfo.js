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
    <>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          style={{
            borderRadius: "30px",
            height: "100%",
            width: "400px",
            display: "block",
          }}
        />
      ) : (
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
                <button onClick={handleShare} className="button_icon">
                  <Download style={{ height: "14px" }} />
                </button>
                <GuideMore
                  onOpenComplain={openComplainModal}
                  onOpenDelete={openDeleteModal}
                  authorId={authorId}
                />
              </div>
              <div>{moment(info.createdAt).format("DD.MM.YYYY")}</div>
            </div>
            <div
              className="Body-3"
              style={{ marginTop: "16px", marginLeft: "12px" }}
            >
              {info.title}
            </div>
            <div
              className="Body-3"
              style={{
                marginTop: "14px",
                fontSize: "14px",
                marginLeft: "12px",
              }}
            >
              {info.text}
            </div>
          </div>

          <div style={{ padding: "24px" }}>
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
          </div>
        </div>
      )}
    </>
  );
}
