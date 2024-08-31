import React, { useEffect } from "react";
import "../../styles/checkbox.css";
import { useSignupMutation } from "../../redux/services/authAPI";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateStudentMutation,
  useGetStudentsByUserIdQuery,
} from "../../redux/services/studentAPI";
import {
  addStudent,
  setError,
  setLoading,
  setStudents,
} from "../../redux/reducers/studentReducer";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function FormBooking() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();



  const [createStudent, { isLoading: isCreatingStudent }] =
    useCreateStudentMutation();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const family = formData.get("family");
    const phone = formData.get("phone");

    try {
      dispatch(setLoading());

      const student = await createStudent({
        name,
        family,
        phone,
        users_permissions_user: user.id,
      }).unwrap();
      dispatch(addStudent(student.data)); // Добавляем нового студента в список
      toast.success("Студент успешно создан!");
    } catch (error) {
      console.error("Ошибка создания студента:", error);
      dispatch(setError(error.message || "Ошибка создания студента"));
      toast.error("Ошибка создания студента");
    }
  };
  return (
    <div style={{ marginTop: "32px" }}>
      <div
        className="h5"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start", // Выровнять по правому краю
          // width: "260px",
          marginTop: "32px",
        }}
      >
        Требуется для записи
      </div>
      <div className="Body-2" style={{ marginTop: "12px" }}>
        Данные ученика:
      </div>
      {isCreatingStudent ? (
        <Box sx={{ display: "flex", marginTop: "32px", marginLeft: "32px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Выровнять по правому краю
            width: "250px",
            textAlign: "center",
          }}
        >
          <div
            className="input_default_border"
            style={{
              width: "100%",
            }}
          >
            <input
              className="input_default"
              placeholder="Имя"
              type="text"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              name="name"
              required
            />
          </div>
          <div
            className="input_default_border"
            style={{
              width: "100%",
              // marginTop: "8px",
            }}
          >
            <input
              className="input_default"
              placeholder="Фамилия"
              type="text"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              name="family"
              required
            />
          </div>

          <div
            className="input_default_border"
            style={{
              width: "100%",
            }}
          >
            <input
              className="input_default"
              placeholder="Телефон для связи"
              type="phone"
              name="phone"
              required
            />
          </div>
      
          <button
            type="submit"
            className="button_save Body-2 button-animate-filter"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={isCreatingStudent}
          >
            {isCreatingStudent ? "Загрузка..." : "Сохранить"}
          </button>
        </form>
      )}
   
    </div>
  );
}
