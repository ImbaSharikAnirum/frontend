import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { ReactComponent as EditForm } from "../../images/edit_form.svg";

export default function Edit() {
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  const course = useSelector(selectCurrentCourse);
  const user = useSelector(selectCurrentUser);
  return (
    <div>
      {course.id &&
        (user?.role?.id === Number(ManagerId) ||
          (user?.role?.id === Number(TeacherId) &&
            user?.id === course?.teacher?.id)) && (
          <button
            className="button_white button-animate-filter"
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            <EditForm style={{ height: "16px", marginRight: "4px" }} />
            <div className="Body-3">Прочее</div>
          </button>
        )}
    </div>
  );
}
