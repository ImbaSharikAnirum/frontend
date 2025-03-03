import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { MonthCalculait } from "../UI/MonthCalculait";
import { useSelector, useDispatch } from "react-redux";
import { useFetchCourseByIdQuery } from "../../redux/services/courseAPI";
import { useMediaQuery, useTheme, Skeleton } from "@mui/material";
import {
  useDeleteInvoiceMutation,
  useFetchInvoicesByCourseIdQuery,
  useUpdateInvoicePaymentStatusMutation,
} from "../../redux/services/invoiceAPI";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../../redux/reducers/authReducer";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import Calendar from "./Calendar";
import {
  selectActiveDaysForSelectedMonth,
  selectMonthsWithActiveDays,
  selectSelectedMonth,
} from "../../redux/reducers/monthReducer";
import { toast } from "react-toastify";
import Activity from "./Activity";
import More from "./More";
import {
  setInvoiceDeletedCourseTable,
  setInvoicesCourseTable,
} from "../../redux/reducers/invoiceSlice";

export default function Table() {
  const { id } = useParams();
  const selectedMonth = useSelector(selectSelectedMonth);
  const month = moment(selectedMonth, "MMMM YYYY");
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  MonthCalculait();
  const isInitialized = useSelector(selectIsInitialized);

  const { data } = useFetchInvoicesByCourseIdQuery(
    {
      courseId: id,
      startDate: month.startOf("month").format("YYYY-MM-DD"),
      endDate: month.endOf("month").format("YYYY-MM-DD"),
    },
    {
      skip: !isInitialized || !month.isValid(),
      refetchOnMountOrArgChange: true,
    }
  );

  // if (isLoading || isLoadingInvoices) return <div>Loading</div>;
  const dispatch = useDispatch(); // Подключаем dispatch

  const user = useSelector(selectCurrentUser);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  const course = useSelector(selectCurrentCourse);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const activeDays = useSelector(selectActiveDaysForSelectedMonth);
  const invoices = useSelector((state) => state.invoice.invoicesCourseTable);
  const [updatePaymentStatus] = useUpdateInvoicePaymentStatusMutation();
  useEffect(() => {
    setLoadingInvoices(true);
  }, [selectedMonth]);

  useEffect(() => {
    if (data) {
      setLoadingInvoices(false);
      dispatch(
        setInvoicesCourseTable(
          data.data.map((invoice) => ({
            name: `${invoice.attributes.name} ${invoice.attributes.family}`,
            phone: invoice.attributes.phone,
            sum: invoice.attributes.sum,
            activities: invoice.attributes.activities.data,
            invoiceId: invoice.id,
            status_payment: invoice.attributes.status_payment,
          }))
        )
      );
    }
  }, [data, dispatch]);

  const handlePaymentStatusToggle = async (invoiceId, currentStatus) => {
    const newStatus = !currentStatus;

    dispatch(
      setInvoicesCourseTable(
        invoices.map((invoice) =>
          invoice.invoiceId === invoiceId
            ? { ...invoice, status_payment: newStatus }
            : invoice
        )
      )
    );

    try {
      // Здесь отправляете асинхронный запрос для обновления статуса в базе данных
      // Например, вы можете использовать мутацию из Redux Toolkit API:
      await updatePaymentStatus({
        invoiceId,
        status_payment: newStatus,
      }); // Это нужно заменить на вашу функцию
      toast.success("Статус обновлен");
    } catch (error) {
      // Если ошибка, отменяем изменения в Redux (или делаем возврат к старому состоянию)
      dispatch(
        setInvoicesCourseTable(
          invoices.map((invoice) =>
            invoice.invoiceId === invoiceId
              ? { ...invoice, status_payment: currentStatus }
              : invoice
          )
        )
      );
      toast.error("Ошибка обновления статуса");
    }
  };

  return (
    <div>
      {course.id &&
        (user?.role?.id === Number(ManagerId) ||
          (user?.role?.id === Number(TeacherId) &&
            user?.id === course?.teacher?.id)) && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                borderBottom: "1px solid #CDCDCD",
                marginTop: "32px",
              }}
            >
              {" "}
            </div>
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
                      minWidth: "800px",
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
                          maxWidth: "20px", // Устанавливаем одинаковую ширину
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                          maxWidth: isMobile && "120px",
                          minWidth: isMobile ? "120px" : "180px",
                          display: "flex",
                          alignItems: "center",
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                      {activeDays.map((date, index) => (
                        <div
                          key={index}
                          className="Body-3"
                          style={{
                            flex: "1",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "70px", // Устанавливаем одинаковую ширину для дат
                          }}
                        >
                          {moment(date, "D MMMM YYYY").format("D MMM")}
                        </div>
                      ))}
                      <div
                        style={{
                          right: 0,
                        }}
                      >
                        <Calendar />
                      </div>
                    </li>
                    {loadingInvoices ? (
                      <div>
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              borderBottom: "1px solid #CDCDCD",
                              height: "50px",
                              alignItems: "center",
                            }}
                          >
                            <Skeleton
                              width={"100%"}
                              variant="rectangular"
                              sx={{ marginBottom: 1 }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : invoices?.length === 0 ? (
                      // Если список пуст и загрузка завершена, показываем сообщение
                      <div className="Body-2" style={{ marginTop: "32px" }}>
                        В этом месяце пока учеников нет
                      </div>
                    ) : (
                      invoices?.map((student, studentIndex) => (
                        <li
                          key={student.invoiceId}
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
                              maxWidth: "20px",
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
                              maxWidth: "120px",
                              minWidth: isMobile ? "120px" : "180px",
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
                                width: "100px",
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
                                  maxWidth: "60px",
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
                                    marginRight: "8px",
                                  }}
                                ></div>

                                {student.sum}
                              </div>
                            </div>
                          )}
                          <Activity
                            student={student}
                            studentIndex={studentIndex}
                          />
                          <div
                            style={{
                              right: 0,
                            }}
                          >
                            <More student={student} />
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
