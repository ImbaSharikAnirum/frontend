// src/components/courses/SkeletonCardCourse.js
import React from "react";
import { Skeleton } from "@mui/material";
import "../../styles/courses.css";
import "../../styles/slider.css";

const SkeletonCardCourse = () => {
  return (
    <div className="card">
      <div className="slider-container">
        <div className="image-container">
          <div className="slide-image-container">
            <Skeleton
              variant="rectangular"
              className="slide-image"
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "16/9", // Соотношение сторон 16:9
                borderRadius: "8px", // Скругление углов
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ height: "35px", width: "35px" }}>
            <Skeleton variant="circular" width={35} height={35} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              flexGrow: 1,
            }}
          >
            <Skeleton
              variant="text"
              width="40%"
              height={20}
              className="Body-3"
            />
            <Skeleton
              variant="text"
              width="60%"
              height={16}
              className="Body-1"
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Skeleton variant="text" width="50%" height={16} className="Body-1" />
          <Skeleton variant="text" width="20%" height={16} className="Body-1" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            <Skeleton
              variant="text"
              width="50px"
              height={16}
              className="Body-3"
            />
            <Skeleton
              variant="text"
              width="50px"
              height={16}
              className="Body-2"
            />
          </div>
          <Skeleton variant="text" width="30%" height={16} className="Body-1" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCardCourse;
