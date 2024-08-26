import React from "react";
import { ReactComponent as Share2 } from "../../images/share2.svg";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";

export default function Address() {
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

  const course = useSelector(selectCurrentCourse);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      {course.format === "Оффлайн" ? (
        <div
          className="h5"
          style={{
            display: "flex",
          }}
        >
          г. {course.city}, {course.district}, ул. {course.address}
        </div>
      ) : (
        <div
          className="h5"
          style={{
            marginBottom: "16px",
            alignItems: "center",
          }}
        >
          {course.format}
        </div>
      )}

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
    </div>
  );
}
