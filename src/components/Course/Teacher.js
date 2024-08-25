import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";

export default function Teacher() {
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
        <img
          src={`${course.teacher.photo}`}
          alt="Аватар"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "90px",
            border: "1px solid #DDDDDD",
          }}
        />
      </div>
      <div className="Body-2" style={{ marginTop: "16px" }}>
        {course.teacher.name}
      </div>
    </div>
  );
}
