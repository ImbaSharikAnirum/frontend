import React, { useEffect } from "react";
import { useFetchCourseByIdQuery } from "../../redux/services/courseAPI";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentCourse,
  setCourse,
} from "../../redux/reducers/courseReducer";
import Address from "./Address";
import { useMediaQuery, useTheme, Skeleton } from "@mui/material";
import Images from "./Images";
import Details from "./Details";
import Teacher from "./Teacher";
import Form from "./Form";

export default function Info({ data, isLoading }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setCourse(data));
    }
  }, [data, dispatch]); // ✅ Выполняется только при изменении `data`

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      {!isMobile && <Address isLoading={isLoading} />}
      <Images isLoading={isLoading} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "100%" }}>
          <Details isLoading={isLoading} />
          {isLoading ? (
            <Skeleton
              variant="text"
              width={isMobile ? "70%" : "50%"}
              height={24}
              style={{
                marginTop: "12px",
                lineHeight: "24px",
              }}
            />
          ) : (
            <div
              className="h4"
              style={{
                marginTop: "12px",
              }}
            >
              Информация о преподавателе
            </div>
          )}
          <Teacher isLoading={isLoading} />
        </div>

        {!isMobile && <Form isLoading={isLoading} />}
      </div>
    </div>
  );
}
