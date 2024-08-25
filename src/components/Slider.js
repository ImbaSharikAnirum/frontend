import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Left } from "../images/left.svg";
import { ReactComponent as Right } from "../images/right.svg";
import "../styles/slider.css";
import { useSwipeable } from "react-swipeable";
import { useMediaQuery, useTheme } from "@mui/material";

const Slider = ({ course, images }) => {
  const [curr, setCurr] = useState(0);

  const prev = () => {
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };
  const next = () => {
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="slider-container" {...handlers}>
      <Link to={`/course/${course.id}`} className="image-container">
        {images.map((s, index) => (
          <div
            key={index}
            className="slide-image-container"
            style={{
              transform: `translateX(-${curr * 100}%)`,
            }}
          >
            <img src={`${s}`} alt="Курс" className="slide-image" />
          </div>
        ))}
      </Link>
      {/* Стрелки */}
      {!isMobile && (
        <div
          className="nav-arrows left"
          style={{
            paddingLeft: "8px",
          }}
        >
          <button
            className="button_slider "
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={prev}
          >
            <Left />
          </button>
        </div>
      )}
      {!isMobile && (
        <div
          className="nav-arrows right"
          style={{
            paddingRight: "8px",
          }}
        >
          <button
            className="button_slider"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={next}
          >
            <Right />
          </button>
        </div>
      )}
      {/* конец */}
      {images.length > 1 && (
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === curr ? "active" : ""}`}
              onClick={() => setCurr(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
