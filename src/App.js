import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Courses from "./pages/Courses";
import Team from "./pages/Team";
import Finance from "./pages/Finance";
import Booking from "./pages/Booking";
import Course from "./pages/Course";
import CreateCourse from "./pages/CreateCourse";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Conditions from "./components/footer/Conditions";
import Requisites from "./components/footer/Requisites";
import Confidentiality from "./components/footer/Confidentiality";
import FooterMenu from "./components/FooterMenu";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import { useInitializeUser } from "./hooks/useInitializeUser";
import "react-toastify/dist/ReactToastify.css";
import Authenticated from "./hooks/Authenticated";
import SucsessCourse from "./pages/SucsessCourse";
import Guides from "./pages/Guides";
import CreateGuide from "./components/Guide/CreateGuide";
import Error from "./pages/Error";
import Callback from "./pages/Callback";
import PinterestLogin from "./pages/PinterestLogin";

function App() {
  useInitializeUser();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="App">
      <Header />
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/course/:id" element={<Course />} />
          <Route path="/pinterest" element={<PinterestLogin />} />
          <Route path="/pinterest/callback" element={<Callback />} />
          <Route path="/" element={<Courses />} />
          <Route path="/team" element={<Team />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/booking/:id/:date" element={<Booking />} />
          <Route path="/create/course" element={<CreateCourse />} />
          <Route path="/create/guide" element={<CreateGuide />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/requisites" element={<Requisites />} />
          <Route path="/confidentiality" element={<Confidentiality />} />
          <Route path="/sucsess-payment" element={<SucsessCourse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/error" element={<Error />} />
          <Route path="/authenticated/:service" element={<Authenticated />} />
        </Routes>
      </main>
      <Footer />
      <FooterMenu />
    </div>
  );
}

export default App;
