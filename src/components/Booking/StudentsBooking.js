import React, { useEffect, useRef, useState } from "react";
import {
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsByUserIdQuery,
  useUpdateStudentMutation,
} from "../../redux/services/studentAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
  selectJwt,
} from "../../redux/reducers/authReducer";
import {
  setStudents,
  addStudent,
  setLoading,
  setError,
  selectAllStudents,
  selectStudentStatus,
  clearStudents,
} from "../../redux/reducers/studentReducer";
import { toast } from "react-toastify";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { ReactComponent as More } from "../../images/more.svg";
import { Link, useParams } from "react-router-dom";
import {
  selectCurrentInvoice,
  setInvoice,
} from "../../redux/reducers/invoiceBookingReducer";
import {
  useCreateInvoiceMutation,
  useCreateTinkoffPaymentMutation,
  useFetchInvoiceByIdQuery,
} from "../../redux/services/invoiceAPI";
import { selectCurrencyCode } from "../../redux/reducers/currencyReducer";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import moment from "moment";
import { Skeleton } from "@mui/material";

export default function StudentsBooking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const userCurrency = useSelector(selectCurrencyCode);
  const course = useSelector(selectCurrentCourse);
  const [createTinkoffPayment] = useCreateTinkoffPaymentMutation();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [createStudent, { isLoading: isCreatingStudent }] =
    useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdatingStudent }] =
    useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [phone, setPhone] = useState("");
  const [createStudentForm, setCreateStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Для редактирования
  const isInitialized = useSelector(selectIsInitialized);

  // Получение студентов по userId
  const { data: studentsData, isLoading } = useGetStudentsByUserIdQuery(
    user?.id,
    {
      skip: !user,
      refetchOnMountOrArgChange: true,
    }
  );

  const students = useSelector(selectAllStudents);
  useEffect(() => {
    if (isInitialized && user) {
      if (studentsData) {
        dispatch(setStudents(studentsData));
      } else {
        dispatch(clearStudents());
      }
    }
  }, [isInitialized, user, studentsData, dispatch]);
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setCreateStudentForm(false);
    if (student) {
      dispatch(
        setInvoice({
          name: student.name,
          family: student.family,
          phone: student.phone,
        })
      );
    }
  };

  const handleCreateStudent = () => {
    setIsEditing(false); // Сбрасываем состояние редактирования
    setSelectedStudent(null); // Сбрасываем выбранного ученика

    if (createStudentForm) {
      // Если форма уже открыта, закрываем её
      setCreateStudentForm(false);
      setName("");
      setFamily("");
      setPhone("");
    } else {
      // Если форма закрыта, открываем её
      setCreateStudentForm(true);
      setName("");
      setFamily("");
      setPhone("");
    }
  };
  const ManagerId = process.env.REACT_APP_MANAGER;
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const family = formData.get("family");
    const phone = formData.get("phone");

    try {
      dispatch(setLoading());

      if (isEditing) {
        // Обновление студента
        await updateStudent({
          id: selectedStudent.id,
          name,
          family,
          phone,
        }).unwrap();

        // Обновляем студента в Redux
        dispatch(
          setStudents(
            students.map((student) =>
              student.id === selectedStudent.id
                ? { ...student, name, family, phone }
                : student
            )
          )
        );

        toast.success("Данные студента успешно обновлены!");
      } else {
        // Создание нового студента
        const student = await createStudent({
          name,
          family,
          phone,
          users_permissions_user:
            user.role.id === Number(ManagerId) ? null : user.id,
        }).unwrap();

        // Добавляем нового студента в Redux

        const formattedStudent = student.data?.attributes
          ? {
              id: student.data.id,
              name: student.data.attributes.name,
              family: student.data.attributes.family,
              phone: student.data.attributes.phone,
            }
          : {
              id: student.id,
              name: student.name,
              family: student.family,
              phone: student.phone,
            };

        // Добавляем нового студента в Redux
        dispatch(addStudent(formattedStudent));

        toast.success("Студент успешно создан!");
      }

      setName("");
      setPhone("");
      setFamily("");
      setCreateStudentForm(false);
      setIsEditing(false); // Сбрасываем состояние редактирования
    } catch (error) {
      console.error("Ошибка при сохранении данных студента:", error);
      dispatch(
        setError(error.message || "Ошибка при сохранении данных студента")
      );
      toast.error("Ошибка при сохранении данных студента");
      setName("");
      setPhone("");
      setFamily("");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleMoreClick = (event, student) => {
    event.stopPropagation();

    // If clicking on the same student, toggle modal visibility
    if (isModalOpen && selectedStudent?.id === student.id) {
      setIsModalOpen(false);
      return;
    }

    setSelectedStudent(student);

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Calculate position for mobile devices
    let top = buttonRect.bottom + window.scrollY;
    let left = viewportWidth < 768 ? buttonRect.left - 180 : buttonRect.left; // Adjust left position for mobile

    // Ensure modal is within viewport
    if (left < 0) left = 0; // Adjust if modal goes out of left viewport
    if (left + 180 > viewportWidth) left = viewportWidth - 180; // Adjust if modal goes out of right viewport

    setModalPosition({
      top,
      left,
    });

    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleDelete = async () => {
    setIsModalOpen(false);

    // Сразу обновляем состояние, чтобы удалить студента из UI
    const updatedStudents = students.filter(
      (student) => student.id !== selectedStudent.id
    );
    dispatch(setStudents(updatedStudents));

    try {
      // Пытаемся удалить студента на сервере
      await deleteStudent(selectedStudent.id).unwrap();
      toast.success(`Студент ${selectedStudent.name} удален`);
      // Если удаление на сервере прошло успешно, ничего не нужно делать
    } catch (error) {
      // Если произошла ошибка, возвращаем студента обратно в список
      dispatch(setStudents([...updatedStudents, selectedStudent]));
      toast.error("Ошибка при удалении студента");
      console.error("Ошибка при удалении студента:", error);
    }
  };
  useEffect(() => {
    if (!students || students.length === 0) {
      setCreateStudentForm(true);
    } else {
      setCreateStudentForm(false);
    }
  }, [students]);

  const handleEdit = () => {
    setIsModalOpen(false);

    setIsEditing(true);
    setCreateStudentForm(true);
    setName(selectedStudent.name);
    setFamily(selectedStudent.family);
    setPhone(selectedStudent.phone);
  };
  const [createInvoice] = useCreateInvoiceMutation();

  const currentInvoice = useSelector(selectCurrentInvoice);
  const totalCost = currentInvoice?.sum || 0;

  const { id: courseId, date, invoiceId } = useParams();

  const handleConfirmAndPay = () => {
    if (!selectedStudent) {
      toast.error("Пожалуйста, выберите студента перед подтверждением.");
      return;
    }

    if (currentInvoice) {
      createInvoice(currentInvoice)
        .unwrap()
        .then((response) => {
          const invoiceId = response.data.id;
          // Формируем ссылку для клиента
          const url = `${window.location.origin}/booking/${courseId}/${date}/${invoiceId}`;
          navigator.clipboard
            .writeText(url)
            .then(() => {
              toast.success("Ссылка на оплату скопирована!");
            })
            .catch(() => {
              toast.success("Счет создан, но не удалось скопировать ссылку");
            });
        })
        .catch((error) => {
          console.error("Ошибка при создании счета:", error);
        });
    }
    // Логика подтверждения и оплаты здесь
  };

  const status = useSelector(selectStudentStatus);
  const createPaymentLink = async () => {
    if (!selectedStudent) {
      toast.error("Выберите ученика перед оплатой");
      return;
    }

    if (isPaymentLoading) {
      return; // Предотвращаем повторные клики
    }

    setIsPaymentLoading(true);

    try {
      // 1. Сначала создаём счет (invoice)
      const invoicePayload = {
        name: selectedStudent.name,
        family: selectedStudent.family,
        phone: selectedStudent.phone,
        sum: totalCost,
        currency: userCurrency,
        group: course.id,
        status_payment: false,
        start_day: moment(currentInvoice?.start_day).format("YYYY-MM-DD"),
        end_day: moment(currentInvoice?.end_day).format("YYYY-MM-DD"),
      };
      const invoiceResponse = await createInvoice(invoicePayload).unwrap();
      const invoiceId =
        invoiceResponse?.data?.id || invoiceResponse?.invoice?.id;

      // 2. Затем инициируем оплату
      const paymentPayload = {
        users_permissions_user: user.id,
        student: selectedStudent.id,
        group: course.id,
        amount: totalCost,
        currency: userCurrency,
        invoiceId, // если нужно связать платёж и счет
      };
      const response = await createTinkoffPayment(paymentPayload).unwrap();
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error("Не удалось получить ссылку на оплату");
      }
    } catch (err) {
      console.error("Ошибка при создании счета или платежа:", err);
      toast.error("Ошибка при создании счета или платежа");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const { data: invoiceData, isLoading: isInvoiceLoading } =
    useFetchInvoiceByIdQuery(invoiceId, { skip: !invoiceId });

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Во время загрузки не показываем ничего */}
      {isLoading && !invoiceId ? null : (
        <div>
          {/* Loader для поиска студентов */}
          {status === "loading" && !isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "32px 0",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Список студентов после загрузки */}
          {status === "succeeded" && students.length > 0 && !invoiceId && (
            <div>
              <div className="h5">Выберите ученика</div>
              <ul style={{ marginTop: "12px" }}>
                {students.map((student) => (
                  <div
                    key={student.id}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className="button-group" style={{ marginTop: "8px" }}>
                      <button
                        onClick={() => handleStudentClick(student)}
                        className={
                          selectedStudent === student
                            ? "selected button-animate"
                            : "button-animate"
                        }
                        style={{ width: isMobile ? "200px" : "250px" }}
                      >
                        {student.name} {student.family} - {student.phone}
                      </button>
                    </div>{" "}
                    <button
                      className="button_only_icon  button_white button-animate-filter"
                      onClick={(event) => handleMoreClick(event, student)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "36px",
                        width: "36px",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
                      }}
                    >
                      <More
                        style={{ fill: "white", width: "80px", height: "80px" }}
                      />
                    </button>
                    {isModalOpen && selectedStudent?.id === student.id && (
                      <div
                        ref={modalRef}
                        className="modal"
                        style={{
                          position: "absolute",
                          top: modalPosition.top, // Применение top позиции
                          left: modalPosition.left, // Применение left позиции
                          zIndex: 10000,
                          backgroundColor: "#fff",
                          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                          borderRadius: "12px",
                          padding: "12px",
                          width: "180px",
                          marginTop: "8px",
                        }}
                      >
                        <ul
                          className="teacher-list Body-2"
                          style={{
                            listStyleType: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <li
                            onClick={handleEdit}
                            onMouseEnter={() => setHoveredIndex(0)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`city-list-item ${
                              hoveredIndex === 0 ? "hovered" : ""
                            }`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              backgroundColor:
                                hoveredIndex === 0 ? "#E9E9E9" : "transparent",
                            }}
                          >
                            <div
                              className="Body-3"
                              style={{
                                marginLeft: "16px",
                                fontSize: "16px",
                                color: "#333",
                              }}
                            >
                              Редактировать
                            </div>
                          </li>
                          <li
                            onClick={handleDelete}
                            onMouseEnter={() => setHoveredIndex(1)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`city-list-item ${
                              hoveredIndex === 1 ? "hovered" : ""
                            }`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              backgroundColor:
                                hoveredIndex === 1 ? "#E9E9E9" : "transparent",
                            }}
                          >
                            <div
                              className="Body-3"
                              style={{
                                marginLeft: "16px",
                                fontSize: "16px",
                                color: "#333",
                              }}
                            >
                              Удалить
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          )}

          {/* Всё, что ниже списка студентов, показываем только после загрузки */}
          {!isLoading && (
            <>
              <div className="Body-3" style={{ marginTop: "20px" }}></div>
              {user && !invoiceId && (
                <button
                  className="button_filter_clear Body-2"
                  onClick={handleCreateStudent}
                >
                  Добавить ученика
                </button>
              )}
              {createStudentForm && user && !invoiceId && !isLoading && (
                <div>
                  {isCreatingStudent || isUpdatingStudent ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "250px",
                        textAlign: "center",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        style={{
                          width: "100%",
                          height: "40px",
                          marginBottom: "12px",
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        style={{
                          width: "100%",
                          height: "40px",
                          marginBottom: "12px",
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        style={{
                          width: "100%",
                          height: "40px",
                          marginBottom: "16px",
                        }}
                      />
                      <Skeleton
                        variant="rectangular"
                        style={{
                          width: "100%",
                          height: "40px",
                        }}
                      />
                    </div>
                  ) : (
                    <form
                      onSubmit={onSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "250px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        className="input_default_border"
                        style={{ width: "100%" }}
                      >
                        <input
                          className="input_default"
                          placeholder="Имя"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          name="name"
                          required
                        />
                      </div>
                      <div
                        className="input_default_border"
                        style={{ width: "100%" }}
                      >
                        <input
                          className="input_default"
                          placeholder="Фамилия"
                          type="text"
                          value={family}
                          onChange={(e) => setFamily(e.target.value)}
                          name="family"
                          required
                        />
                      </div>
                      <div
                        className="input_default_border"
                        style={{ width: "100%" }}
                      >
                        <input
                          className="input_default"
                          placeholder="Телефон для связи"
                          type="phone"
                          name="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="button_save Body-2 button-animate-filter"
                        style={{ width: "100%", marginTop: "16px" }}
                        disabled={isCreatingStudent || isUpdatingStudent}
                      >
                        {isCreatingStudent || isUpdatingStudent
                          ? "Загрузка..."
                          : isEditing
                          ? "Сохранить изменения"
                          : "Добавить"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {user && (
                <div>
                  <div
                    style={{
                      borderBottom: "1px solid #CDCDCD",
                      marginTop: "24px",
                    }}
                  ></div>
                  <div style={{ marginTop: "24px" }}>
                    <div className="h5">Правила отмены</div>
                    <div className="Body-2" style={{ marginTop: "16px" }}>
                      Отмена и полный возврат возможны за 2 дня до начала курса.
                      После этого срока отмена участия и возврат средств не
                      предусмотрены.
                    </div>
                    <div className="Body-2" style={{ marginTop: "16px" }}>
                      Компания не осуществляет перерасчеты и переносы в случае
                      пропуска занятия, включая случаи со справкой.
                    </div>
                    <div className="Body-2" style={{ marginTop: "16px" }}>
                      При недоборе участников или других препятствиях курсы
                      отменяются с возвратом оплаты за несостоявшиеся занятия.
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "1px solid #CDCDCD",
                      marginTop: "24px",
                    }}
                  ></div>
                  <div
                    className="Body-2"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start",
                      marginTop: "16px",
                      fontSize: "12px",
                    }}
                  >
                    <p style={{ margin: "0", lineHeight: "1.5" }}>
                      Продолжая, вы соглашаетесь с положениями основных
                      документов{" "}
                      <Link
                        to="/signup"
                        style={{
                          color: "black",
                          textDecoration: "underline",
                        }}
                      >
                        Условия предоставления услуг
                      </Link>{" "}
                      и{" "}
                      <Link
                        to="/confidentiality"
                        style={{
                          color: "black",
                          textDecoration: "underline",
                        }}
                      >
                        Политика конфиденциальности
                      </Link>{" "}
                      — и подтверждаете, что прочли их.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {userCurrency === "RUB" && !invoiceId ? (
                      <button
                        className="button Body-3 button-animate-filter"
                        style={{ marginTop: "20px", maxWidth: "240px" }}
                        disabled={isPaymentLoading}
                        onClick={createPaymentLink}
                      >
                        {isPaymentLoading
                          ? "Загрузка..."
                          : "Подтвердить и оплатить"}
                      </button>
                    ) : !invoiceId ? (
                      <div className="Body-2" style={{ marginTop: "20px" }}>
                        На текущий момент оплата только в рублях. Поменяйте
                        валюту в настройках.
                      </div>
                    ) : null}
                    {user?.role?.id === Number(ManagerId) && !invoiceId && (
                      <button
                        className="button Body-3 button-animate-filter"
                        style={{ marginTop: "20px", maxWidth: "240px" }}
                        onClick={handleConfirmAndPay}
                      >
                        Добавить счет
                      </button>
                    )}
                  </div>
                </div>
              )}

              {invoiceId &&
                invoiceData &&
                invoiceData.data?.attributes?.status_payment === false &&
                !isInvoiceLoading && (
                  <div>
                    {!user && (
                      <div>
                        <div
                          style={{
                            borderBottom: "1px solid #CDCDCD",
                            marginTop: "24px",
                          }}
                        ></div>
                        <div style={{ marginTop: "24px" }}>
                          <div className="h5">Правила отмены</div>
                          <div className="Body-2" style={{ marginTop: "16px" }}>
                            Отмена и полный возврат возможны за 2 дня до начала
                            курса. После этого срока отмена участия и возврат
                            средств не предусмотрены.
                          </div>
                          <div className="Body-2" style={{ marginTop: "16px" }}>
                            Компания не осуществляет перерасчеты и переносы в
                            случае пропуска занятия, включая случаи со справкой.
                          </div>
                          <div className="Body-2" style={{ marginTop: "16px" }}>
                            При недоборе участников или других препятствиях
                            курсы отменяются с возвратом оплаты за
                            несостоявшиеся занятия.
                          </div>
                        </div>
                        <div
                          style={{
                            borderBottom: "1px solid #CDCDCD",
                            marginTop: "24px",
                          }}
                        ></div>
                        <div
                          className="Body-2"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                            alignItems: "start",
                            marginTop: "16px",
                            fontSize: "12px",
                          }}
                        >
                          <p style={{ margin: "0", lineHeight: "1.5" }}>
                            Продолжая, вы соглашаетесь с положениями основных
                            документов{" "}
                            <Link
                              to="/signup"
                              style={{
                                color: "black",
                                textDecoration: "underline",
                              }}
                            >
                              Условия предоставления услуг
                            </Link>{" "}
                            и{" "}
                            <Link
                              to="/confidentiality"
                              style={{
                                color: "black",
                                textDecoration: "underline",
                              }}
                            >
                              Политика конфиденциальности
                            </Link>{" "}
                            — и подтверждаете, что прочли их.
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      className="button Body-3 button-animate-filter"
                      style={{ marginTop: "20px", maxWidth: "240px" }}
                      disabled={isPaymentLoading}
                      onClick={async () => {
                        if (isPaymentLoading) return;

                        setIsPaymentLoading(true);
                        try {
                          const response = await createTinkoffPayment({
                            users_permissions_user: user?.id,
                            amount: invoiceData.data.attributes.sum,
                            currency:
                              invoiceData.data.attributes.currency ||
                              userCurrency,
                            invoiceId: invoiceId,
                          }).unwrap();
                          if (response?.paymentUrl) {
                            window.location.href = response.paymentUrl;
                          }
                        } catch (error) {
                          console.error("Ошибка при создании платежа:", error);
                          toast.error("Ошибка при создании платежа");
                        } finally {
                          setIsPaymentLoading(false);
                        }
                      }}
                    >
                      {isPaymentLoading
                        ? "Загрузка..."
                        : "Подтвердить и оплатить"}
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
