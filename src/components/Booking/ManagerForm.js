import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Search } from "../../images/search.svg";
import { useLazyGetStudentsQuery } from "../../redux/services/studentAPI";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  clearStudents,
  selectAllStudents,
  setLoading,
  setStudents,
} from "../../redux/reducers/studentReducer";

export default function ManagerForm() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fetchStudents, { data: studentsData, isFetching, error }] =
    useLazyGetStudentsQuery();

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const students = useSelector(selectAllStudents);

  // Ссылка на таймер
  const debounceTimeout = useRef(null);
  const currentRequestId = useRef(null);

  // Функция для обработки поиска
  const handleSearch = (query) => {
    if (query) {
      dispatch(setLoading());
      const requestId = Date.now();
      currentRequestId.current = requestId;
      fetchStudents({ query })
        .unwrap()
        .then((data) => {
          // Проверка идентификатора текущего запроса
          if (currentRequestId.current === requestId) {
            if (data.length > 0) {
              dispatch(setStudents(data));
              //   dispatch(setLoading());
            }
          }
        });
    } else {
      //   dispatch(clearStudents()); // Очищаем студентов если запрос пустой
    }
  };

  // Эффект для обработки изменений в поле ввода
  useEffect(() => {
    // Очистка предыдущего таймера
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Установка нового таймера
    debounceTimeout.current = setTimeout(() => {
      handleSearch(selectedStudent);
    }, 300); // 300 мс задержка перед вызовом запроса

    // Очистка таймера при размонтировании
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [selectedStudent, dispatch, fetchStudents]);


  const handleStudentInputChange = (event) => {
    const value = event.target.value;
    setSelectedStudent(value);
  };

  const handleClearSearch = () => {
    setSelectedStudent("");
    dispatch(clearStudents());
  };
  return (
    <div className="modal-body" style={{ marginTop: "24px" }}>
      <div className="h5">Поиск студента</div>
      <div
        className="teacher-search"
        style={{ width: isMobile ? "250px" : "320px" }}
      >
        <Search className="icon" />
        <input
          type="text"
          value={selectedStudent}
          onChange={handleStudentInputChange}
          placeholder={
            isMobile
              ? "Введите имя или телефон"
              : "Введите имя, фамилию или телефон"
          }
          className="input-search Body-2"
          style={{
            width: "100%",
            paddingLeft: "4px",
            fontSize: "16px",
          }}
        />
        {selectedStudent && (
          <span className="clear-icon" onClick={handleClearSearch}>
            ✕
          </span>
        )}
      </div>
    </div>
  );
}
