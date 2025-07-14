import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

export default function TeacherWelcome({ user }) {
  const navigate = useNavigate();

  return (
    <div
      className="padding"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
        <div
          className="h4"
          style={{
            marginTop: "12px",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Добро пожаловать, преподаватель!
        </div>

        <Paper
          elevation={3}
          style={{
            padding: "40px",
            borderRadius: "20px",
            backgroundColor: "#f0f8f0",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              color="success.main"
            >
              Вы уже являетесь преподавателем!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              У вас есть доступ ко всем возможностям преподавателя на платформе.
              Вы можете создавать курсы, управлять учениками, загружать
              материалы и многое другое.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ваши возможности:
            </Typography>
            <ul style={{ paddingLeft: "20px", color: "#666" }}>
              <li className="Body-2">Создание и управление курсами</li>
              <li className="Body-2">Работа с учениками и группами</li>
              <li className="Body-2">Загрузка гайдов и учебных материалов</li>
              <li className="Body-2">Создание портфолио и древа навыков</li>
              {/* <li className="Body-2">Общение с учениками через чат</li> */}
              {/* <li className="Body-2">Управление расписанием занятий</li> */}
            </ul>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <button
              className="button Body-3 button-animate"
              onClick={() => navigate("/create/course")}
              style={{ marginRight: "16px" }}
            >
              Создать курс
            </button>
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={() => navigate("/profile/" + user.id)}
            >
              Мой профиль
            </button>
            <button
              className="button_white Body-3 button-animate"
              onClick={() => navigate("/courses")}
            >
              Посмотреть курсы
            </button>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
