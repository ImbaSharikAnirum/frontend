import React, { useEffect, useState } from "react";
import { ReactComponent as Left } from "../images/left.svg";
import {
  useMediaQuery,
  useTheme,
  Skeleton,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Card from "../components/Booking/Card";
import InformationBooking from "../components/Booking/InformationBooking";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import LoginBooking from "../components/Booking/LoginBooking";
import { Link } from "react-router-dom";
import SignupBooking from "../components/Booking/SignupBooking";
import FormBooking from "../components/Booking/FormBooking";
import { useGetStudentsByUserIdQuery } from "../redux/services/studentAPI";
import {
  selectAllStudents,
  selectStudentStatus,
  setError,
  setStudents,
} from "../redux/reducers/studentReducer";
import StudentsBooking from "../components/Booking/StudentsBooking";
import { selectCurrentCourse } from "../redux/reducers/courseReducer";
import ManagerForm from "../components/Booking/ManagerForm";
import { selectCurrency } from "../redux/reducers/currencyReducer";
import { useFetchCourseByIdQuery } from "../redux/services/courseAPI";
import { useParams } from "react-router-dom";
import {
  useFetchInvoiceByIdQuery,
  useCreateTinkoffPaymentMutation,
} from "../redux/services/invoiceAPI";

export default function Booking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ManagerId = process.env.REACT_APP_MANAGER;
  const [scrollTop, setScrollTop] = useState(0);
  const { id, date, invoiceId } = useParams();
  const currency = useSelector(selectCurrency);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);
  const [prevCurrency, setPrevCurrency] = useState(currency.code);
  const [createTinkoffPayment] = useCreateTinkoffPaymentMutation();

  const {
    data: courseData,
    isLoading: isCourseLoading,
    refetch,
  } = useFetchCourseByIdQuery(id, {
    skip: !id,
    currency: currency.code,
  });

  const { data: invoiceData, isLoading: isInvoiceLoading } =
    useFetchInvoiceByIdQuery(invoiceId, {
      skip: !invoiceId,
    });

  useEffect(() => {
    if (prevCurrency !== currency.code) {
      setIsCurrencyLoading(true);
      setPrevCurrency(currency.code);
      // Делаем новый запрос при смене валюты
      refetch();
    }
  }, [currency.code, prevCurrency, refetch]);

  useEffect(() => {
    if (courseData) {
      setIsCurrencyLoading(false);
    }
  }, [courseData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const user = useSelector(selectCurrentUser);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(true);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const course = useSelector(selectCurrentCourse);
  const showSkeletons = isCurrencyLoading || isCourseLoading;
  console.log(invoiceData, "invoiceData");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      className="padding"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "1120px",
        }}
      >
        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={() => window.history.back()}
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
              <Left style={{ fill: "white", width: "80px", height: "80px" }} />
            </button>
            <div className="h4" style={{ marginLeft: "12px" }}>
              Подтвердите и оплатите
            </div>
          </div>
        )}
        {isMobile && (
          <div
            className="box"
            style={{
              maxWidth: "100%",
            }}
          >
            <Card isLoading={showSkeletons} />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <InformationBooking />
            {invoiceId ? (
              <div>
                {isInvoiceLoading ? (
                  <div>
                    <div
                      style={{
                        borderBottom: "1px solid #CDCDCD",
                        marginTop: "24px",
                      }}
                    ></div>
                    <Skeleton
                      variant="rectangular"
                      style={{
                        width: "80px",
                        height: "24px",
                        marginTop: "24px",
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      style={{
                        width: "200px",
                        height: "20px",
                        marginTop: "12px",
                      }}
                    />
                  </div>
                ) : invoiceData ? (
                  <div>
                    <div
                      style={{
                        borderBottom: "1px solid #CDCDCD",
                        marginTop: "24px",
                      }}
                    ></div>
                    <div
                      className="h5"
                      style={{
                        marginTop: "24px",
                      }}
                    >
                      Ученик
                    </div>
                    <div className="Body-2" style={{ marginTop: "12px" }}>
                      {invoiceData.data.attributes.name}{" "}
                      {invoiceData.data.attributes.family}
                    </div>
                  </div>
                ) : (
                  <div className="Body-2">Счет не найден</div>
                )}
              </div>
            ) : (
              !user &&
              course.direction && (
                <>
                  {showLogin && (
                    <div>
                      <LoginBooking />
                      <div
                        className="Body-2"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "250px",
                          marginTop: "16px",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        <p style={{ lineHeight: "1.5" }}>
                          Еще не зарегистрировались в Anirum?
                          <button
                            className="Body-2"
                            onClick={handleSignupClick}
                            style={{
                              fontSize: "12px",
                              color: "black",
                              textDecoration: "underline",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Зарегистрироваться
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                  {showSignup && (
                    <div>
                      <SignupBooking />

                      <div
                        className="Body-2"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "250px",
                          marginTop: "16px",
                          fontSize: "12px",
                          textAlign: "center",
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
                        <p style={{ margin: "8px 0 0", lineHeight: "1.5" }}>
                          Вы уже зарегистрировались в Anirum?{" "}
                          <button
                            onClick={handleLoginClick}
                            className="Body-2"
                            style={{
                              fontSize: "12px",
                              color: "black",
                              textDecoration: "underline",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Войти
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )
            )}
            {course.direction &&
              user?.role?.id === Number(ManagerId) &&
              !invoiceId && (
                <div
                  style={{
                    borderBottom: "1px solid #CDCDCD",
                    marginTop: "24px",
                  }}
                ></div>
              )}
            {course.direction &&
              user?.role?.id === Number(ManagerId) &&
              !invoiceId && <ManagerForm />}

            <StudentsBooking />
          </div>

          {!isMobile && (
            <div
              className="box"
              style={{
                position: "sticky",
                top: scrollTop > 100 ? "10px" : "100px",
                alignSelf: "flex-start",
                transition: "top 0.3s ease",
                marginLeft: "20px",
                maxWidth: "50%",
                minWidth: "45%",
              }}
            >
              <Card isLoading={showSkeletons} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
