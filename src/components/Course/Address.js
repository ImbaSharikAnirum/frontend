import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { ReactComponent as Share2 } from "../../images/share2.svg";
import { Skeleton } from "@mui/material";

export default function Address({ isLoading }) {
  const course = useSelector(selectCurrentCourse);
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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        width: "100%",
        height: "60px",
      }}
    >
      {isLoading ? (
        <Skeleton variant="text" width={"70%"} height={"100%"} />
      ) : course.format === "Оффлайн" ? (
        <div
          className="h5"
          style={{
            display: "flex",
          }}
        >
          г. {course.city}, {course.district}, {course.address}
        </div>
      ) : (
        <div
          className="h5"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {course.format}
        </div>
      )}

      {isLoading ? (
        <Skeleton variant="text" width={"20%"} height={"100%"} />
      ) : (
        <button
          className="button_white button-animate-filter"
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
          }}
          onClick={() => handleShare()}
        >
          <Share2 style={{ fill: "white", width: "16px", height: "16px" }} />
          <div className="h5" style={{ marginLeft: "8px" }}>
            Поделиться
          </div>
        </button>
      )}
    </div>
  );
}
