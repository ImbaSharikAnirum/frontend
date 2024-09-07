import React, { useEffect, useState } from "react";
import { ReactComponent as More } from "../../images/more.svg";
import { ReactComponent as Check } from "../../images/list/check.svg";
import { ReactComponent as X } from "../../images/list/x.svg";
import { ReactComponent as Empty } from "../../images/list/empty.svg";
import moment from "moment";
import { useParams } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import { useFetchInvoicesByCourseIdQuery } from "../../redux/services/invoiceAPI";
import {
  selectInvoiceStatus,
  setInvoice,
  setLoading,
} from "../../redux/reducers/invoiceReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { Skeleton } from "@mui/material";
import ModalMonthTable from "./ModalMonthTable";
import {
  clearStudents,
  selectActiveDates,
  selectSelectedMonth,
  selectStudents,
  setStudents,
} from "../../redux/reducers/courseTableReducer";
import ActiveDatesList from "./ActiveDatesList";

// Переименуем компонент в StudentTable
export default function StudentTable() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const course = useSelector(selectCurrentCourse);
  const { id } = useParams();

  const activeDates = useSelector(selectActiveDates);
  const selectedMonth = useSelector(selectSelectedMonth);

  const startOfMonth = moment(selectedMonth, "MMMM YYYY")
    .startOf("month")
    .format("YYYY-MM-DD");
  const endOfMonth = moment(selectedMonth, "MMMM YYYY")
    .endOf("month")
    .format("YYYY-MM-DD");

  const { data: invoices, isLoading } = useFetchInvoicesByCourseIdQuery({
    courseId: id,
    startDate: startOfMonth,
    endDate: endOfMonth,
  });

  const students = useSelector(selectStudents);
  const status = useSelector(selectInvoiceStatus);
  useEffect(() => {
    dispatch(setLoading());
    if (invoices?.data) {
      dispatch(
        setStudents(
          invoices.data.map((invoice) => ({
            name: `${invoice.attributes.name} ${invoice.attributes.family}`,
            phone: invoice.attributes.phone,
            sum: invoice.attributes.sum,
            activities: invoice.attributes.activities.data,
            invoiceId: invoice.id,
          }))
        )
      );
      dispatch(setInvoice(invoices.data));
    }
  }, [invoices, dispatch]);

  const ManagerId = process.env.REACT_APP_MANAGER;
  const user = useSelector(selectCurrentUser);

  const loadingItemsCount = 5;

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
                {user?.role?.id === Number(ManagerId) && (
                  <div
                    className="Body-3"
                    style={{
                      flex: "1",
                      padding: "8px",
                      alignItems: "center",
                    }}
                  >
                    №
                  </div>
                )}
                <div
                  className="Body-3"
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
                  Имя
                </div>
                {user?.role?.id === Number(ManagerId) && (
                  <div
                    className="Body-3"
                    style={{ flex: "2", padding: "8px", minWidth: "130px" }}
                  >
                    Телефон
                  </div>
                )}
                {user?.role?.id === Number(ManagerId) && (
                  <div
                    className="Body-3"
                    style={{ flex: "2", padding: "8px", minWidth: "40px" }}
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
                      justifyContent: "center",
                      display: "flex",
                      minWidth: "50px",
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
                  <div className="Body-2" style={{ flex: "1", padding: "8px" }}>
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
                      minWidth: "130px",
                    }}
                  >
                    {student.name}
                  </div>

                  <div>
                    {user?.role?.id === Number(ManagerId) && (
                      <div
                        className="Body-2"
                        style={{ flex: "2", padding: "8px", minWidth: "140px" }}
                      >
                        {student.phone}
                      </div>
                    )}
                  </div>

                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="Body-2"
                      style={{ flex: "2", padding: "8px", minWidth: "40px" }}
                    >
                      {student.sum}
                    </div>
                  )}
                  <ActiveDatesList
                    student={student}
                    studentIndex={studentIndex}
                    startOfMonth={startOfMonth}
                    endOfMonth={endOfMonth}
                  />
                  <div style={{ flex: "1", padding: "8px" }}>
                    {user?.role?.id === Number(ManagerId) && (
                      <button
                        className="button_only_icon  button_white button-animate-filter"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "36px",
                          width: "36px",
                          border: "none",
                          cursor: "pointer",
                          zIndex: 1000,
                        }}
                      >
                        <More style={{ fill: "white" }} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
