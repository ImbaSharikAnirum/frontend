import React, { useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchInvoicesByCourseIdQuery,
  useUpdateInvoicePaymentStatusMutation,
} from "../../redux/services/invoiceAPI";
import {
  selectInvoiceStatus,
  setInvoice,
  setLoading,
} from "../../redux/reducers/invoiceReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { Skeleton } from "@mui/material";
import ModalMonthTable from "./ModalMonthTable";
import {
  selectActiveDates,
  selectSelectedMonth,
  selectStudents,
  setStudents,
} from "../../redux/reducers/courseTableReducer";
import ActiveDatesList from "./ActiveDatesList";
import { updateStudentPaymentStatus } from "../../redux/reducers/studentReducer";
import { toast } from "react-toastify";
import MoreTable from "./MoreTable";
import { skipToken } from "@reduxjs/toolkit/query";

export default function StudentTable() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const activeDates = useSelector(selectActiveDates);
  const selectedMonth = useSelector(selectSelectedMonth);

  // Проверяем, что активные даты уже существуют
  const startOfMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").startOf("month").format("YYYY-MM-DD")
    : null;
  const endOfMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").endOf("month").format("YYYY-MM-DD")
    : null;

  // Выполняем запрос только если даты известны (startOfMonth и endOfMonth не null)
  const { data: invoices } = useFetchInvoicesByCourseIdQuery(
    startOfMonth && endOfMonth
      ? {
          courseId: id,
          startDate: startOfMonth,
          endDate: endOfMonth,
        }
      : skipToken // Служит для пропуска запроса до тех пор, пока данные не будут готовы
  );

  const [updatePaymentStatus] = useUpdateInvoicePaymentStatusMutation();
  const students = useSelector(selectStudents);
  const status = useSelector(selectInvoiceStatus);

  useEffect(() => {
    if (startOfMonth && endOfMonth) {
      dispatch(setLoading());
    }

    if (invoices?.data) {
      dispatch(
        setStudents(
          invoices.data.map((invoice) => ({
            name: `${invoice.attributes.name} ${invoice.attributes.family}`,
            phone: invoice.attributes.phone,
            sum: invoice.attributes.sum,
            activities: invoice.attributes.activities.data,
            invoiceId: invoice.id,
            status_payment: invoice.attributes.status_payment,
          }))
        )
      );
      dispatch(setInvoice(invoices.data));
    }
  }, [invoices, dispatch, startOfMonth, endOfMonth]);

  const ManagerId = process.env.REACT_APP_MANAGER;
  const user = useSelector(selectCurrentUser);
  const loadingItemsCount = 5;

  const handlePaymentStatusToggle = async (invoiceId, currentStatus) => {
    const newStatus = !currentStatus;

    dispatch(
      updateStudentPaymentStatus({
        invoiceId,
        status_payment: newStatus,
      })
    );

    dispatch(
      setStudents(
        students.map((student) =>
          student.invoiceId === invoiceId
            ? { ...student, status_payment: newStatus }
            : student
        )
      )
    );

    try {
      const updatedInvoice = await updatePaymentStatus({
        invoiceId,
        status_payment: newStatus,
      }).unwrap();

      dispatch(
        updateStudentPaymentStatus({
          invoiceId,
          status_payment: updatedInvoice.status_payment,
        })
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      dispatch(
        updateStudentPaymentStatus({
          invoiceId,
          status_payment: currentStatus,
        })
      );
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: loadingItemsCount }, (_, index) => (
      <li
        key={index}
        style={{
          display: "flex",
          borderBottom: "1px solid #CDCDCD",
          height: "50px",
          alignItems: "center",
        }}
      >
        <div className="Body-2" style={{ flex: "1", padding: "8px" }}>
          <Skeleton variant="rectangular" style={{ width: "100%" }} />
        </div>
        <div
          className="Body-2"
          style={{
            flex: "2",
            padding: "8px",
            position: "sticky",
            left: 0,
            backgroundColor: "white",
            zIndex: 1,
            minWidth: "130px",
          }}
        >
          <Skeleton variant="rectangular" style={{ width: "100%" }} />
        </div>
        {user?.role?.id === Number(ManagerId) && (
          <div className="Body-2" style={{ flex: "2", padding: "8px" }}>
            <Skeleton variant="rectangular" style={{ width: "100%" }} />
          </div>
        )}
        {user?.role?.id === Number(ManagerId) && (
          <div className="Body-2" style={{ flex: "2", padding: "8px" }}>
            <Skeleton variant="rectangular" style={{ width: "100%" }} />
          </div>
        )}
        {activeDates.map((date, dateIndex) => (
          <div
            key={dateIndex}
            className="Body-2"
            style={{ flex: "1", padding: "8px" }}
          >
            <Skeleton variant="rectangular" style={{ width: "100%" }} />
          </div>
        ))}
        <div style={{ flex: "1", padding: "8px" }}>
          <Skeleton variant="rectangular" style={{ width: "100%" }} />
        </div>
      </li>
    ));
  };
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "32px",
        }}
      ></div>
      <div
        className="box"
        style={{
          marginTop: "32px",
          padding: "0px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            padding: "20px",
          }}
        >
          <div
            className="scroll"
            style={{
              overflowY: "auto",
              overflowX: "auto",
              maxHeight: "350px",
              minHeight: "240px",
            }}
          >
            <ul
              style={{
                padding: "0",
                marginRight: "20px",
                listStyle: "none",
                minWidth: "1000px",
              }}
            >
              <li
                style={{
                  display: "flex",
                  borderBottom: "1px solid #CDCDCD",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 2,
                  minWidth: "100%",
                  height: "40px",
                }}
              >
             
                  <div
                    className="Body-3"
                    style={{
                      flex: "1",
                      padding: "8px",
                      alignItems: "center",
                      width: "20px", // Устанавливаем одинаковую ширину
                    }}
                  >
                    №
                  </div>
              
                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    position: "sticky",
                    left: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    width: "130px", // Устанавливаем одинаковую ширину
                  }}
                >
                  Имя
                </div>
                {user?.role?.id === Number(ManagerId) && (
                  <div
                    className="Body-3"
                    style={{
                      flex: "2",
                      padding: "8px",
                      width: "130px", // Устанавливаем одинаковую ширину
                    }}
                  >
                    Телефон
                  </div>
                )}
                {user?.role?.id === Number(ManagerId) && (
                  <div
                    className="Body-3"
                    style={{
                      flex: "2",
                      padding: "8px",
                      width: "100px", // Устанавливаем одинаковую ширину
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Оплата
                  </div>
                )}
                {activeDates.map((date, index) => (
                  <div
                    key={index}
                    className="Body-3"
                    style={{
                      flex: "1",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "50px", // Устанавливаем одинаковую ширину для дат
                    }}
                  >
                    {date}
                  </div>
                ))}
                <ModalMonthTable />
              </li>
              {status === "loading" && <>{renderSkeletons()}</>}
              {students.length === 0 && status === "succeeded" && (
                <div>
                  <div className="Body-2" style={{ marginTop: "32px" }}>
                    В этом месяце пока учеников нет
                  </div>
                  <div></div>
                </div>
              )}
              {students.map((student, studentIndex) => (
                <li
                  key={studentIndex}
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #CDCDCD",
                    height: "50px",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="Body-2"
                    style={{
                      flex: "1",
                      padding: "8px",
                      width: "20px", // Устанавливаем одинаковую ширину
                    }}
                  >
                    {studentIndex + 1}
                  </div>
                  <div
                    className="Body-2"
                    style={{
                      flex: "2",
                      padding: "8px",
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      width: "130px", // Устанавливаем одинаковую ширину
                    }}
                  >
                    {student.name}
                  </div>

                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="button_white Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        width: "130px", // Устанавливаем одинаковую ширину
                      }}
                      onClick={() => {
                        // Копирование номера телефона в буфер обмена
                        navigator.clipboard.writeText(student.phone);
                        toast.success("Номер телефона скопирован!");
                      }}
                    >
                      {student.phone}
                    </div>
                  )}

                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        width: "100px", // Устанавливаем одинаковую ширину
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className={`button_white Body-2 button-animate-filter ${
                          student.status_payment ? "" : ""
                        }`}
                        style={{
                          flex: "2",
                          padding: "8px",
                          height: "10px",
                          maxWidth: "60px", // Устанавливаем одинаковую ширину
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() =>
                          handlePaymentStatusToggle(
                            student.invoiceId,
                            student.status_payment
                          )
                        }
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: student.status_payment
                              ? "#24a143"
                              : "#E60023",
                            marginRight: "8px", // Отступ между кругом и суммой
                          }}
                        ></div>

                        {student.sum}
                      </div>
                    </div>
                  )}
                  <ActiveDatesList
                    student={student}
                    studentIndex={studentIndex}
                    startOfMonth={startOfMonth}
                    endOfMonth={endOfMonth}
                  />

                  <MoreTable student={student} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
