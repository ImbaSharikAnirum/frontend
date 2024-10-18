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
import { useMediaQuery, useTheme, Skeleton } from "@mui/material";
import Address from "../components/Course/Address";
import Information from "../components/Course/Information";
import Teacher from "../components/Course/Teacher";
import Location from "../components/Course/Location";
import Rules from "../components/Course/Rules";
import Form from "../components/Course/Form";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import StudentTable from "../components/Course/StudentTable";
import StudentDataModal from "../components/Course/StudentDataModal";
import DeleteTheInvoiceModal from "../components/Course/DeleteTheInvoiceModal";
import {
  closeDeleteInvoiceModal,
  closeEditSumModal,
  closeStudentDataModal,
} from "../redux/reducers/modalReducer";
import EditSumModal from "../components/Course/EditSumModal";
import Edit from "../components/Course/Edit";

export default function Course() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchCourseByIdQuery(id);
  const course = useSelector(selectCurrentCourse);
  const status = useSelector(selectCourseStatus);
  const user = useSelector(selectCurrentUser);
  const isStudentDataModalOpen = useSelector(
    (state) => state.modals.studentDataModalOpen
  );
  const isDeleteInvoiceModalOpen = useSelector(
    (state) => state.modals.deleteInvoiceModalOpen
  );
  const isEditSumModalOpen = useSelector(
    (state) => state.modals.editSumModalOpen
  );
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

  if (isLoading || status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
          {!isMobile && <Skeleton variant="rectangular" height={50} />}
          <Skeleton
            variant="rectangular"
            height={400}
            style={{ marginTop: 20 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Skeleton
              variant="rectangular"
              width={300}
              height={300}
              style={{ marginLeft: 20 }}
            />
          </div>
          <Skeleton
            variant="rectangular"
            height={100}
            style={{ marginTop: 20 }}
          />
          <Skeleton
            variant="rectangular"
            height={200}
            style={{ marginTop: 20 }}
          />
        </div>
      </div>
    );
  }
  if (status === "failed") return <div>Error: {error}</div>;
  if (!course) return <div>Group not found</div>;
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
        {isStudentDataModalOpen && (
          <StudentDataModal
            className="courses_filters"
            onClose={() => dispatch(closeStudentDataModal())}
          />
        )}
        {isDeleteInvoiceModalOpen && (
          <DeleteTheInvoiceModal
            className="courses_filters"
            onClose={() => dispatch(closeDeleteInvoiceModal())}
          />
        )}
        {isEditSumModalOpen && (
          <EditSumModal
            className="courses_filters"
            onClose={() => dispatch(closeEditSumModal())}
          />
        )}
        {!isMobile && <Address />}
        <Images />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "100%" }}>
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
        {course.id &&
          (user?.role?.id === Number(ManagerId) ||
            (user?.role?.id === Number(TeacherId) &&
              user?.id === course?.teacher?.id)) && <StudentTable />}

        <Edit />

        {course && <Location />}
        <Rules />
      </div>
    </div>
  );
}
