import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetchCourseByIdQuery } from "../redux/services/courseAPI";
import {
  setCourse,
  resetCourse,
  setError,
  selectCurrentCourse,
  selectCourseStatus,
} from "../redux/reducers/courseReducer";
import Images from "../components/Course/Images";
import { useMediaQuery, useTheme } from "@mui/material";
import Address from "../components/Course/Address";
import Information from "../components/Course/Information";
import Teacher from "../components/Course/Teacher";
import Location from "../components/Course/Location";
import Rules from "../components/Course/Rules";
import Form from "../components/Course/Form";

export default function Course() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchCourseByIdQuery(id);
  const course = useSelector(selectCurrentCourse);
  const status = useSelector(selectCourseStatus);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (data) {
      dispatch(setCourse(data));
    } else if (error) {
      dispatch(setError(error));
    }
    return () => {
      dispatch(resetCourse());
    };
  }, [data, error, dispatch]);

  if (isLoading || status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (!course) return <div>Group not found</div>;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: isMobile ? "100%" : "1120px" }}>
        {!isMobile && <Address />}
        <Images />
        <div style={{ display: "flex" }}>
          <div>
            <Information />
            <div
              className="h4"
              style={{
                marginTop: "12px",
              }}
            >
              Информация о преподавателе
            </div>
            <Teacher />
          </div>

          <Form />
        </div>

        <Location />
        <Rules />
      </div>
    </div>
  );
}
