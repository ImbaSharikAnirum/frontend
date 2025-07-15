import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../redux/reducers/currencyReducer";
import LanguageCurrencySelector from "../LanguageCurrencySelector";
import { ReactComponent as Down } from "../../images/down.svg";

export default function TeacherProfitCalculator() {
  const [courses, setCourses] = useState(4);
  const [students, setStudents] = useState(7);
  const [price, setPrice] = useState(5500);
  const [format, setFormat] = useState("Онлайн");
  const [rent, setRent] = useState(0);
  const [result, setResult] = useState(0);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    let gross = courses * students * price;
    if (format === "Оффлайн") {
      gross = gross - rent;
    }
    setResult(Math.round(gross * 0.7));
  }, [courses, students, price, rent, format]);

  const formatSum = (sum) => sum.toLocaleString("ru-RU");

  return (
    <div
      style={{
        borderRadius: 16,
        padding: "20px 24px",
        marginTop: 16,
        marginBottom: 32,
        fontSize: 16,
        color: "#222",
        lineHeight: 1.7,
        fontFamily: "Nunito Sans",
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 20 }}>
        Калькулятор вашего дохода
      </div>
      <div style={{ marginBottom: 16 }}>
        <div className="Body-3" style={{ fontSize: 14, marginBottom: 8 }}>
          Формат
        </div>
        <div
          className="button-group"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          {["Онлайн", "Оффлайн"].map((type) => (
            <button
              key={type}
              onClick={() => setFormat(type)}
              className={`button-animate${format === type ? " selected" : ""}`}
              style={{
                padding: "10px 20px",
                border: "1px solid #DDDDDD",
                backgroundColor: format === type ? "black" : "white",
                color: format === type ? "white" : "black",
                borderRadius: "25px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div className="Body-3" style={{ fontSize: 14, marginBottom: 8 }}>
          Количество курсов
        </div>
        <div
          className="button-group"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <button
              key={num}
              onClick={() => setCourses(num)}
              className={`button-animate number-button${
                courses === num ? " selected" : ""
              }`}
              style={{
                width: "40px",
                height: "40px",
                padding: 0,
                borderRadius: "50%",
                border: "1px solid #DDDDDD",
                backgroundColor: courses === num ? "black" : "white",
                color: courses === num ? "white" : "black",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div className="Body-3" style={{ fontSize: 14, marginBottom: 8 }}>
          Среднее число учеников в курсе
        </div>
        <div
          className="button-group"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <button
              key={num}
              onClick={() => setStudents(num)}
              className={`button-animate number-button${
                students === num ? " selected" : ""
              }`}
              style={{
                width: "40px",
                height: "40px",
                padding: 0,
                borderRadius: "50%",
                border: "1px solid #DDDDDD",
                backgroundColor: students === num ? "black" : "white",
                color: students === num ? "white" : "black",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div className="Body-3" style={{ fontSize: 14, marginBottom: 8 }}>
          Средняя цена курса за месяц
        </div>
        <div
          className="input_default_border"
          style={{
            width: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            className="input_default"
            placeholder="0"
            style={{
              width: "100px",
              marginLeft: "20px",
              fontSize: "16px",
              textAlign: "left",
              color: "#000000",
            }}
          />
          <span
            style={{ marginRight: "12px", cursor: "pointer" }}
            onClick={() => setCurrencyDialogOpen(true)}
          >
            {currencySymbol}
          </span>
        </div>
      </div>
      {format === "Оффлайн" && (
        <div style={{ marginBottom: 16 }}>
          <div className="Body-3" style={{ fontSize: 14, marginBottom: 8 }}>
            Цена аренды за месяц
          </div>
          <div
            className="input_default_border"
            style={{
              width: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              type="number"
              min={0}
              value={rent}
              onChange={(e) => setRent(Math.max(0, Number(e.target.value)))}
              className="input_default"
              placeholder="0"
              style={{
                width: "100px",
                marginLeft: "20px",
                fontSize: "16px",
                textAlign: "left",
                color: "#000000",
              }}
            />
            <span
              style={{ marginRight: "12px", cursor: "pointer" }}
              onClick={() => setCurrencyDialogOpen(true)}
            >
              {currencySymbol}
            </span>
          </div>
        </div>
      )}
      <LanguageCurrencySelector
        open={currencyDialogOpen}
        onClose={() => setCurrencyDialogOpen(false)}
        defaultTab={1}
      />
      <div
        className="Body-2"
        style={{ fontSize: 18, marginTop: 12, fontWeight: 500 }}
      >
        Ваша прибыль составит:{" "}
        <b>
          {formatSum(result)} {currencySymbol}
        </b>
      </div>
      <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
        📎 С учётом комиссии платформы и банка (30%)
        {format === "Оффлайн" && rent > 0 && (
          <>
            <br />
            Аренда уже учтена в расчёте
          </>
        )}
      </div>
    </div>
  );
}
