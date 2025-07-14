import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useMediaQuery,
  useTheme,
  Skeleton,
  Avatar,
  CircularProgress,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import {
  useGetTeacherApplicationsQuery,
  useApproveTeacherRoleMutation,
  useRejectTeacherRoleMutation,
} from "../../redux/services/userProfileAPI";
import { selectCurrentUser } from "../../redux/reducers/authReducer";

export default function TeacherApplicationsTable() {
  const user = useSelector(selectCurrentUser);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loadingActions, setLoadingActions] = useState({});

  const {
    data: applications,
    isLoading,
    error,
  } = useGetTeacherApplicationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Логирование для отладки
  console.log("TeacherApplicationsTable - applications:", applications);
  console.log("TeacherApplicationsTable - isLoading:", isLoading);
  console.log("TeacherApplicationsTable - error:", error);
  const [approveTeacherRole] = useApproveTeacherRoleMutation();
  const [rejectTeacherRole] = useRejectTeacherRoleMutation();

  // Проверяем, является ли пользователь менеджером
  if (user?.role?.id !== Number(ManagerId)) {
    return (
      <div
        className="Body-2"
        style={{ marginTop: "32px", textAlign: "center" }}
      >
        У вас нет доступа к этой странице
      </div>
    );
  }

  const handleApprove = async (userId, userName) => {
    setLoadingActions((prev) => ({ ...prev, [userId]: "approving" }));
    try {
      await approveTeacherRole(userId).unwrap();
      toast.success(`Заявка от ${userName} одобрена!`);
    } catch (error) {
      console.error("Ошибка при одобрении заявки:", error);
      toast.error("Ошибка при одобрении заявки");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId, userName) => {
    setLoadingActions((prev) => ({ ...prev, [userId]: "rejecting" }));
    try {
      await rejectTeacherRole(userId).unwrap();
      toast.success(`Заявка от ${userName} отклонена`);
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      toast.error("Ошибка при отклонении заявки");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Показываем loading для всей таблицы
  if (isLoading) {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #CDCDCD",
            marginTop: "32px",
          }}
        />
        <div
          className="box"
          style={{
            marginTop: "32px",
            padding: "0px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div style={{ padding: "20px" }}>
            <Paper
              elevation={0}
              style={{
                padding: "60px 20px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #CDCDCD",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <CircularProgress size={40} />
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Загружаем заявки...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Получаем список заявок на роль преподавателя
                </Typography>
              </Box>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #CDCDCD",
            marginTop: "32px",
          }}
        />
        <div
          className="box"
          style={{
            marginTop: "32px",
            padding: "0px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div style={{ padding: "20px" }}>
            <Paper
              elevation={0}
              style={{
                padding: "40px 20px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#fff3f3",
                border: "1px solid #CDCDCD",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                color="error"
              >
                Ошибка загрузки заявок
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Не удалось загрузить список заявок. Пожалуйста, попробуйте
                обновить страницу.
              </Typography>
              <button
                className="button Body-3 button-animate"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </button>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "32px",
        }}
      />
      <div
        className="box"
        style={{
          marginTop: "32px",
          padding: "0px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <div style={{ padding: "20px" }}>
          <div
            className="scroll"
            style={{
              overflowY: "auto",
              overflowX: "auto",
              maxHeight: "500px",
              minHeight: "240px",
            }}
          >
            <ul
              style={{
                padding: "0",
                marginRight: "20px",
                listStyle: "none",
                minWidth: "800px",
              }}
            >
              {/* Заголовок таблицы */}
              <li
                style={{
                  display: "flex",
                  borderBottom: "1px solid #CDCDCD",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 2,
                  minWidth: "100%",
                  height: "40px",
                }}
              >
                <div
                  className="Body-3"
                  style={{
                    flex: "1",
                    padding: "8px",
                    maxWidth: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  №
                </div>

                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    position: "sticky",
                    left: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    maxWidth: isMobile && "120px",
                    minWidth: isMobile ? "120px" : "200px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Пользователь
                </div>

                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    width: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Email
                </div>

                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    width: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Дата заявки
                </div>

                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    width: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Действия
                </div>
              </li>

              {/* Загрузка */}
              {isLoading ? (
                <div>
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        borderBottom: "1px solid #CDCDCD",
                        height: "60px",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton
                        width={"100%"}
                        variant="rectangular"
                        sx={{ marginBottom: 1 }}
                      />
                    </div>
                  ))}
                </div>
              ) : applications?.length === 0 ? (
                // Если список пуст и загрузка завершена, показываем сообщение
                <div
                  className="Body-2"
                  style={{ marginTop: "32px", textAlign: "center" }}
                >
                  Заявок на роль преподавателя пока нет
                </div>
              ) : (
                // Список заявок
                applications?.map((application, index) => (
                  <li
                    key={application.id}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #CDCDCD",
                      height: "60px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="Body-2"
                      style={{
                        flex: "1",
                        padding: "8px",
                        maxWidth: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </div>

                    <div
                      className="Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                        maxWidth: "120px",
                        minWidth: isMobile ? "120px" : "200px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Avatar
                        sx={{
                          height: 32,
                          width: 32,
                        }}
                        alt="Avatar"
                        src={application.avatar?.formats?.small?.url || ""}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "500" }}>
                          {application.username}
                        </span>
                      </div>
                    </div>

                    <div
                      className="Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        width: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {application.email}
                    </div>

                    <div
                      className="Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        width: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {moment(application.updatedAt).format("DD.MM.YYYY")}
                    </div>

                    <div
                      style={{
                        flex: "2",
                        padding: "8px",
                        width: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        className="button Body-3 button-animate"
                        onClick={() =>
                          handleApprove(
                            application.id,
                            application.name || application.username
                          )
                        }
                        disabled={loadingActions[application.id]}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          minWidth: "80px",
                          opacity:
                            loadingActions[application.id] === "approving"
                              ? 0.7
                              : 1,
                        }}
                      >
                        {loadingActions[application.id] === "approving"
                          ? "Одобрение..."
                          : "Одобрить"}
                      </button>

                      <button
                        className="button_white Body-3 button-animate"
                        onClick={() =>
                          handleReject(
                            application.id,
                            application.name || application.username
                          )
                        }
                        disabled={loadingActions[application.id]}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          minWidth: "80px",
                          opacity:
                            loadingActions[application.id] === "rejecting"
                              ? 0.7
                              : 1,
                        }}
                      >
                        {loadingActions[application.id] === "rejecting"
                          ? "Отклонение..."
                          : "Отклонить"}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
