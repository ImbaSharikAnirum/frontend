import React from "react";
import { useSelector } from "react-redux";
import {
  selectCourseStatus,
  selectCurrentCourse,
} from "../../redux/reducers/courseReducer";
import { Skeleton } from "@mui/material";

export default function Teacher({ isLoading }) {
  const course = useSelector(selectCurrentCourse);
  return (
    <div
      className="box"
      style={{
        display: "flex",
        marginTop: "16px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ height: "100px", width: "100px" }}>
        {isLoading ? (
          <Skeleton height={"100%"} width={"100%"} variant="circular" />
        ) : (
          <img
            src={`${course.teacher.photo.original}`}
            srcSet={`
                ${course.teacher.photo.small} 480w,
                ${course.teacher.photo.medium} 768w,
                ${course.teacher.photo.large} 1200w
            `}
            alt="Аватар"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "90px",
              border: "1px solid #DDDDDD",
            }}
          />
        )}
      </div>
      {isLoading ? (
        <Skeleton
          variant="text"
          width="70%"
          height="1em"
          style={{
            marginTop: "12px",
            display: "inline-block",
          }}
        />
      ) : (
        <div className="Body-2" style={{ marginTop: "16px" }}>
          {course.teacher.name}
        </div>
      )}
    </div>
  );
}
