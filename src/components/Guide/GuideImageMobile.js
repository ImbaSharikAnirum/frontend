import React, { useEffect } from "react";
import { ReactComponent as Left } from "../../images/left.svg";
import { ReactComponent as Share2 } from "../../images/share2.svg";
import { Skeleton } from "@mui/material";

export default function GuideImageMobile({
  imageUrl,
  setImageHeight,
  isLoading,
}) {
  useEffect(() => {
    if (!isLoading) {
      setImageHeight(250); // фиксированная высота скелетона
    }
  }, [isLoading, setImageHeight]);
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
    <div>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "250px",
            border: "none",
            borderRadius: "0px",
            zIndex: 0,
          }}
        />
      ) : (
        <div
          className="image-container"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            border: "none",
            borderRadius: "0px",
            zIndex: 0,
          }}
        >
          <button
            onClick={() => window.history.back()}
            className="button_only_icon"
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              top: "24px",
              left: "24px",
              height: "36px",
              width: "36px",
              boxShadow:
                "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
              border: "none",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <Left style={{ fill: "white", width: "40px", height: "40px" }} />
          </button>

          <button
            onClick={() => handleShare()}
            className="button_only_icon"
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              top: "24px",
              right: "24px",
              height: "36px",
              width: "36px",
              boxShadow:
                "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
              border: "none",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <Share2 style={{ fill: "white", width: "40px", height: "40px" }} />
          </button>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={imageUrl}
              alt="Курс"
              className="slide-image"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.png";
              }}
              onLoad={(e) => {
                setImageHeight(e.target.offsetHeight);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
