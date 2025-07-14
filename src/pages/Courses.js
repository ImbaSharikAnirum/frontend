import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesFromAPI } from "../redux/coursesSlice";
import { ReactComponent as Create } from "../images/Create.svg";
import "../styles/courses.css";
import "../styles/modal.css";
import { Link } from "react-router-dom";
import CardCourse from "../components/courses/CardCourse";
import DirectionFilter from "../components/courses/DirectionFilter";
import FormatFilter from "../components/courses/FormatFilter";
import AgeInput from "../components/courses/AgeInput";
import FilterGroup from "../components/courses/FilterGroup";
import SkeletonCardCourse from "../components/courses/SkeletonCardCourse";
import FilterMobile from "../components/courses/FilterMobile";
import { useMediaQuery } from "react-responsive";
import { selectCurrentUser } from "../redux/reducers/authReducer";

export default function Courses() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const filter = useSelector((state) => state.filter);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const user = useSelector(selectCurrentUser);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  useEffect(() => {
    if (fetching) {
      dispatch(fetchCoursesFromAPI(currentPage))
        .then(({ courses: newCourses, totalCount: newTotalCount }) => {
          setTotalCount(newTotalCount);
          setCurrentPage((prevPage) => prevPage + 1);
        })
        .finally(() => {
          setFetching(false);
          setLoading(false);
        });
    }
  }, [fetching, currentPage, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
    setFetching(true);
  }, [filter]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  });

  const scrollHandler = (e) => {
    if (
      document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) <
        800 &&
      courses.length < totalCount
    ) {
      setFetching(true);
    }
  };

  return (
    <div className="padding">
      <div className="filters">
        <div className="desktop courses_filters">
          <DirectionFilter loading={loading || isLoading} />
        </div>
        <div className="desktop courses_filters">
          <FormatFilter loading={loading || isLoading} />
        </div>
        <div className="desktop courses_filters">
          <AgeInput loading={loading || isLoading} />
        </div>
        {!isMobile && (
          <div className="courses_filters">
            <FilterGroup loading={loading || isLoading} />
          </div>
        )}
        {(user?.role?.id === Number(ManagerId) || user?.role?.id === Number(TeacherId)) && (
          <Link
            to="/create/course"
            className="button_only_icon"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Create />
          </Link>
        )}
      </div>
      <div className="filters_mobile">
        <FilterMobile />
      </div>
      <div className="filters_mobile_placeholder"></div>

      {/* Courses */}
      <div className="card-container">
        {loading || isLoading
          ? Array.from(new Array(12)).map((_, index) => (
              <SkeletonCardCourse key={index} />
            ))
          : courses.length > 0
          ? courses.map((course) => (
              <CardCourse key={course.id} course={course} />
            ))
          : null}
      </div>
      {!loading && !isLoading && courses.length === 0 && (
        <div className="no-courses">
          <div
            className="h4"
            style={{
              width: "100%",
              fontSize: "24px",
            }}
          >
            Нет подходящих занятий
          </div>
          <div
            className="Body-2"
            style={{
              width: "100%",
              fontSize: "20px",
              marginTop: "16px",
            }}
          >
            Попробуйте скорректировать или удалить некоторые фильтры либо
            изменить формат поиска.
          </div>
        </div>
      )}
    </div>
  );
}
