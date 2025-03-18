import React, { useEffect, useState } from "react";
import "../styles/footerMenu.css";
import { ReactComponent as Vector } from "../images/Vector.svg";
import { ReactComponent as GridIcon } from "../images/grid.svg";
import { ReactComponent as User } from "../images/user.svg";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  hideFooterMenu,
  showFooterMenu,
  resetFilters,
  triggerSearch,
} from "../redux/footerMenuSlice";
import { ReactComponent as Search } from "../images/search.svg";
import { selectCurrentCourse } from "../redux/reducers/courseReducer";
import moment from "moment";
import "moment/locale/ru";
import { Link } from "react-router-dom";
import {
  clearStudents,
  selectAllStudents,
} from "../redux/reducers/studentReducer";
import { logout, selectCurrentUser } from "../redux/reducers/authReducer";
import { useMediaQuery } from "react-responsive";
import { Avatar } from "@mui/material";

const FooterMenu = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.footerMenu.isVisible);
  const isFilterGroupMobile = useSelector(
    (state) => state.footerMenu.isFilterGroupMobile
  );
  const isFilterMobile = useSelector(
    (state) => state.footerMenu.isFilterMobile
  );
  const course = useSelector(selectCurrentCourse);
  const nextMonth = moment().add(1, "months").format("MMMM"); // Следующий месяц
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const scrollDownThreshold = 15;
  const scrollUpThreshold = 10;
  const location = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Если мобильная версия и мы на странице гайда, не рендерим футер

  const isCoursePage = /^\/course\/\d+$/.test(location.pathname);
  useEffect(() => {
    dispatch(showFooterMenu());
  }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (location.pathname === "/") {
        if (
          currentScrollTop > lastScrollTop &&
          currentScrollTop - lastScrollTop > scrollDownThreshold
        ) {
          dispatch(hideFooterMenu());
        } else if (
          currentScrollTop < lastScrollTop &&
          lastScrollTop - currentScrollTop > scrollUpThreshold
        ) {
          dispatch(showFooterMenu());
        }

        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop, dispatch, location.pathname]);

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handleSearch = () => {
    dispatch(triggerSearch());
  };
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearStudents());
    dispatch(logout());
  };

  // if (!user) return null;
  // if (isMobile && location.pathname.startsWith("/guide")) {
  //   return null;
  // }
  return (
    <>
      {!isFilterGroupMobile && (
        <div>
          {!location.pathname.includes("/booking") && (
            <div
              className={`footer-menu ${isVisible ? "visible" : ""} ${
                !isFilterMobile && "visible"
              }`}
            >
              {course.id && isCoursePage ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      <div className="Body-3" style={{ fontSize: "16px" }}>
                        {course.price_lesson} р
                      </div>
                      <div
                        className="Body-2"
                        style={{ fontSize: "16px", marginLeft: "4px" }}
                      >
                        за занятие
                      </div>
                    </div>

                    <div
                      className="Body-1"
                      style={{
                        color: "#5F5F5F",
                        textDecoration: "underline",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {nextMonth}
                    </div>
                  </div>
                  <Link
                    // to={`https://api.whatsapp.com/send/?phone=77473628471&text=Здравствуйте,%20я%20хочу%20забронировать%20курс.%20ID%20группы:%20${course.id}&type=phone_number&app_absent=0`}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    to={`/booking/${course.id}/${moment(nextMonth, "MMMM YYYY")
                      .locale("en")
                      .format("YYYY-MM")}`}
                    style={{
                      textDecoration: "none",
                      // color: "black",
                      // width: "100%",
                      // marginTop: "16px",
                    }}
                  >
                    <button className="button Body-3 button-animate-filter">
                      Забронировать
                    </button>
                  </Link>
                </div>
              ) : !isFilterMobile ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    className="Body-1"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={handleReset}
                  >
                    Сбросить всё
                  </div>
                  <button
                    className="button Body-3 button-animate-filter"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onClick={handleSearch}
                  >
                    <Search
                      style={{
                        stroke: "#E60023",
                        marginRight: "4px",
                        height: "18px",
                      }}
                    />
                    Искать
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "120px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `link ${isActive ? "active" : ""}`
                        }
                      >
                        <Vector />
                      </NavLink>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <NavLink
                        to="/"
                        style={{ fontSize: "12px" }}
                        className={({ isActive }) =>
                          `link ${isActive ? "active" : ""}`
                        }
                      >
                        <div className="Body-2" style={{ marginTop: "4px" }}>
                          Курсы
                        </div>
                      </NavLink>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "120px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <NavLink
                        to="/guides"
                        className={({ isActive }) =>
                          `link ${isActive ? "active" : ""}`
                        }
                      >
                        <GridIcon />
                      </NavLink>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <NavLink
                        to="/guides"
                        style={{ fontSize: "12px" }}
                        className={({ isActive }) =>
                          `link ${isActive ? "active" : ""}`
                        }
                      >
                        <div className="Body-2" style={{ marginTop: "4px" }}>
                          Гайды
                        </div>
                      </NavLink>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "120px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {user ? (
                      <div>
                        <NavLink
                          to={`/profile/${user.id}`}
                          className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                          }
                        >
                          <User />
                        </NavLink>
                      </div>
                    ) : (
                      <div>
                        <NavLink
                          to="/login"
                          className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                          }
                        >
                          <User />
                        </NavLink>
                      </div>
                    )}
                    <div className="Body-2" style={{ marginTop: "4px" }}>
                      {user ? (
                        <NavLink
                          to={`/profile/${user.id}`}
                          className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                          }
                          style={{ fontSize: "12px" }}
                        >
                          <div className="Body-2" style={{ marginTop: "4px" }}>
                            Профиль
                          </div>
                        </NavLink>
                      ) : (
                        // <NavLink
                        //   onClick={handleLogout}
                        //   className={({ isActive }) =>
                        //     `link ${!isActive ? "active" : ""}`
                        //   }
                        //   style={{ fontSize: "12px" }}
                        // >
                        //
                        // </NavLink>
                        <NavLink
                          to="/login"
                          className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                          }
                          style={{ fontSize: "12px" }}
                        >
                          <div className="Body-2" style={{ marginTop: "4px" }}>
                            Вход
                          </div>
                        </NavLink>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FooterMenu;
