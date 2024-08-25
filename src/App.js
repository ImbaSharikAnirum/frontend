import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
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

function App() {
  useInitializeUser();

  return (
    <div className="App">
      <Header />
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/course/:id" element={<Course />} />
          <Route path="/" element={<Courses />} />
          <Route path="/team" element={<Team />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/booking/:id/:date" element={<Booking />} />
          <Route path="/create/course" element={<CreateCourse />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/requisites" element={<Requisites />} />
          <Route path="/confidentiality" element={<Confidentiality />} />
          <Route path="/sucsess-payment" element={<SucsessCourse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authenticated/:service" element={<Authenticated />} />
        </Routes>
      </main>
      <Footer />
      <FooterMenu />
    </div>
  );
}

export default App;
