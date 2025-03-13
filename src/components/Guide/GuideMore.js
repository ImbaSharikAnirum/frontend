// GuideMore.js
import React, { useState, useRef, useEffect } from "react";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { ReactComponent as MoreIcon } from "../../images/more.svg";

export default function GuideMore({ onOpenComplain, onOpenDelete, authorId }) {
  const ManagerId = process.env.REACT_APP_MANAGER;
  const user = useSelector(selectCurrentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleDropdownToggle = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX - 180,
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setIsDropdownOpen(false);
    if (option === "Пожаловаться") {
      onOpenComplain && onOpenComplain();
    } else if (option === "Удалить") {
      onOpenDelete && onOpenDelete();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div >
      <button
        ref={buttonRef}
        className="button_icon"
        onClick={handleDropdownToggle}
      >
        <MoreIcon style={{ fill: "white" }} />
      </button>
      {isDropdownOpen && (
        <div
          ref={modalRef}
          style={{
            position: "absolute",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            width: "180px",
            padding: "12px",
            overflowY: "auto",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {[
              "Пожаловаться",
              (authorId === user?.id || Number(ManagerId) === user?.id) &&
                "Удалить",
            ]
              .filter(Boolean)
              .map((option, index) => (
                <li
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`city-list-item ${
                    index === hoveredIndex ? "hovered" : ""
                  }`}
                  style={{
                    backgroundColor:
                      index === hoveredIndex ? "#E9E9E9" : "transparent",
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
                    {option}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
