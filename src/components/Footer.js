import React from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      {/* <div className="Body-2" style={{ marginRight: "12px" }}>
        Anirum
      </div> */}
      <Link to="/confidentiality" className="link">
        <div className="Body-2" style={{ marginTop: "4px" }}>
          Конфиденциальность
        </div>{" "}
      </Link>
      <Link to="/conditions" className="link">
        <div className="Body-2" style={{ marginTop: "4px" }}>
          Условия
        </div>
      </Link>
      <Link to="/requisites" className="link">
        <div className="Body-2" style={{ marginTop: "4px" }}>
          Реквизиты компании
        </div>
      </Link>
    </div>
  );
}
