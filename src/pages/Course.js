import React, { useEffect, useState } from "react";
import Table from "../components/Course/Table";
import Info from "../components/Course/Info";
import StudentDataModal from "../components/Course/StudentDataModal";
import { useDispatch, useSelector } from "react-redux";
import {
  closeDeleteInvoiceModal,
  closeEditSumModal,
  closeStudentDataModal,
} from "../redux/reducers/modalReducer";
import DeleteTheInvoiceModal from "../components/Course/DeleteTheInvoiceModal";
import EditSumModal from "../components/Course/EditSumModal";
import Location from "../components/Course/Location";
import CourseEdit from "../components/Course/CourseEdit";
import Rules from "../components/Course/Rules";
import { useParams } from "react-router-dom";
import { useFetchCourseByIdQuery } from "../redux/services/courseAPI";
import { showFooterMenu } from "../redux/footerMenuSlice";

function Course() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, isLoading } = useFetchCourseByIdQuery(id);
  const isStudentDataModalOpen = useSelector(
    (state) => state.modals.studentDataModalOpen
  );
  const isDeleteInvoiceModalOpen = useSelector(
    (state) => state.modals.deleteInvoiceModalOpen
  );
  const isEditSumModalOpen = useSelector(
    (state) => state.modals.editSumModalOpen
  );
  useEffect(() => {
    return () => {
      dispatch(showFooterMenu(false));
    };
  }, [dispatch]);
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
        <Info data={data} isLoading={isLoading} />
        <Table />
        <CourseEdit />
        <Location isLoading={isLoading}/>
        <Rules isLoading={isLoading}/>
      </div>
    </div>
  );
}

export default Course;
