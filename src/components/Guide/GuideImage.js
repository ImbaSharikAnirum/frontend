import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as Search } from "../../images/search.svg";
import { Modal, Skeleton } from "@mui/material";

export default function GuideImage({ imageUrl, isLoading, setImageHeight }) {
  const [open, setOpen] = useState(false);
  const imgRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // После загрузки изображения вычисляем его высоту
  const onImageLoad = () => {
    if (imgRef.current && setImageHeight) {
      setImageHeight(imgRef.current.offsetHeight);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "500px",
        // Можно не задавать высоту, если хотим, чтобы контейнер подстраивался
      }}
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          style={{
            borderRadius: "30px",
            height: "400px",
            width: "100%",
            display: "block",
          }}
        />
      ) : (
        <div>
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Illustration of the guide content"
              onLoad={onImageLoad}
              style={{
                maxWidth: "100%",
                borderRadius: "30px",
                border: "1px solid #DDDDDD",
              }}
            />
          )}
          {imageUrl && (
            <button
              onClick={handleOpen}
              style={{
                position: "absolute",
                bottom: "20px",
                right: "25px",
                backgroundColor: "white",
                padding: "5px 10px",
                borderRadius: "8px",
                border: "1px solid #DDDDDD",
                cursor: "pointer",
              }}
            >
              <Search className="icon" />
            </button>
          )}
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "white", fontSize: "24px" }}>✕</span>
          </button>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Guide"
              style={{ maxHeight: "80%", maxWidth: "80%" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.png";
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
