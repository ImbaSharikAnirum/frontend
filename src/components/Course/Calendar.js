import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as IconCalendar } from "../../images/calendar.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMonthsWithActiveDays,
  selectSelectedMonth,
  setSelectedMonth,
} from "../../redux/reducers/monthReducer";
import { useMediaQuery, useTheme } from "@mui/material";
import { ReactComponent as Check } from "../../images/check.svg";
import moment from "moment";

export default function Calendar() {
  const monthsWithActiveDays = useSelector(selectMonthsWithActiveDays);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const listRef = useRef(null);
  const selectedMonthRef = useRef(null);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState(null);
  const dispatch = useDispatch();
  const selectedMonth = useSelector(selectSelectedMonth);
  useEffect(() => {
    const currentMonth = moment().format("MMMM YYYY");
    if (
      monthsWithActiveDays.some(
        (month) =>
          moment(month.month, "MMMM YYYY").format("MMMM YYYY") === currentMonth
      )
    ) {
      dispatch(setSelectedMonth(currentMonth));
    }
  }, [monthsWithActiveDays]);

  useEffect(() => {
    if (isModalOpen && selectedMonthRef.current) {
      selectedMonthRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isModalOpen]);

  const closeFilterModal = () => {
    setIsModalOpen(false);
  };

  const handleMonthSelect = (month) => {
    dispatch(setSelectedMonth(month));

    closeFilterModal();
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".button_only_icon")
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      style={{
        flex: "1",
        paddingRight: "8px",
        paddingLeft: "8px",
      }}
    >
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
        onClick={handleModalToggle}
      >
        <IconCalendar style={{ fill: "white" }} />
      </button>
      {!isMobile && isModalOpen && (
        <div
          className="modal"
          ref={modalRef}
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            width: "200px",
            padding: "12px",
            overflowY: "auto",
            maxHeight: "150px",
          }}
        >
          <ul
            className="teacher-list Body-2"
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              maxHeight: "150px",
              overflowY: "auto",
            }}
            ref={listRef}
          >
            {monthsWithActiveDays.map((month, index) => (
              <li
                key={index}
                ref={month.month === selectedMonth ? selectedMonthRef : null}
                onClick={(event) => {
                  event.stopPropagation();
                  handleMonthSelect(month.month);
                }}
                onMouseEnter={() => setHoveredMonthIndex(index)}
                onMouseLeave={() => setHoveredMonthIndex(null)}
                className={`city-list-item  ${
                  index === hoveredMonthIndex ? "hovered" : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "8px",
                  height: "20px",
                  backgroundColor:
                    index === hoveredMonthIndex ? "#E9E9E9" : "transparent",
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
                  {month.month}
                </div>
                {month.month === selectedMonth && (
                  <Check
                    style={{
                      marginRight: "16px",
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isMobile && isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeFilterModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "8px 24px",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-filter" style={{ border: "none" }}>
              <button
                className="button_white modal-close-button"
                onClick={closeFilterModal}
                style={{
                  padding: 0,
                  borderRadius: "50%",
                  fontSize: "16px",
                  textAlign: "center",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div className="h5" onClick={handleModalToggle}>
                  ✕
                </div>
              </button>
              <div className="h5">Месяцы</div>
              <ul
                className="teacher-list Body-2"
                style={{
                  listStyleType: "none",
                  padding: "24px 0px",
                  margin: 0,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {monthsWithActiveDays.map((month, index) => (
                  <li
                    key={index}
                    onClick={() => handleMonthSelect(month.month)}
                    className={`city-list-item ${
                      month.month === selectedMonth ? "selected" : ""
                    }`}
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      borderRadius: "8px",
                      justifyContent: "space-between",
                      backgroundColor:
                        month.month === selectedMonth
                          ? "#E9E9E9"
                          : "transparent",
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
                      {month.month}
                    </div>

                    {month.month === selectedMonth && (
                      <Check
                        style={{
                          marginRight: "16px",
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
