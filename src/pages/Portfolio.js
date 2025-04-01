import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPortfolioByIdQuery } from "../redux/services/portfolioAPI";
import { Avatar, Skeleton } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import PortfolioMore from "../components/Portfolio/PortfolioMore";
import PortfolioDeleteModal from "../components/Portfolio/PortfolioDeleteModal";

export default function Portfolio() {
  const { id } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const user = useSelector(selectCurrentUser);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, error, isLoading } = useGetPortfolioByIdQuery(id);

  if (error)
    return <div className="Body-3">Ошибка при загрузке портфолио.</div>;

  const imageUrl =
    data?.data?.attributes?.image?.data?.attributes?.formats?.medium?.url ||
    data?.data?.attributes?.image?.data?.attributes?.formats?.small?.url ||
    data?.data?.attributes?.image?.data?.attributes?.url;
  const imageAlt =
    data?.data?.attributes?.image?.data?.attributes?.alternativeText ||
    "Portfolio image";

  const avatarUrl =
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.data?.attributes?.formats?.small?.url ||
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.data?.attributes?.url ||
    "";

  const avatarAlt =
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.alternativeText || "Avatar пользователя";

  const authorId = data?.data?.attributes?.users_permissions_user?.data?.id;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "16px" : "0",
      }}
      className="padding"
    >
      {/* Левая колонка – изображение */}
      <div
        style={{
          width: isMobile ? "100%" : "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ padding: "12px" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              style={{
                width: "100%",
                minWidth: "300px",
                border: "1px solid #DDDDDD",
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "100%",
                minWidth: "300px",
                padding: "12px",
                border: "1px solid #DDDDDD",
                height: "400px",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
      </div>

      {/* Правая колонка – аватар и действия */}
      <div
        style={{
          width: isMobile ? "90%" : "20%",
          minHeight: "400px",
          minWidth: isMobile ? "auto" : "290px",
          backgroundColor: "#F2F2F2",
          borderRadius: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        {user && user.id === authorId && (
          <PortfolioMore
            onOpenDelete={() => setIsDeleteModalOpen(true)}
            authorId={authorId}
          />
        )}
        <div>
          {!isLoading ? (
            <Link to={`/profile/${authorId}`}>
              <Avatar
                src={avatarUrl}
                alt={avatarAlt}
                sx={{ width: 100, height: 100 }}
              />
            </Link>
          ) : (
            <Skeleton variant="circular" width={100} height={100} />
          )}
        </div>
        <div
          style={{
            marginTop: "16px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!isLoading ? (
            <div className="Body-2">0 LVL</div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{ width: "20%", height: "16px", borderRadius: "8px" }}
            />
          )}
        </div>
        <div
          className="Body-3"
          style={{
            marginTop: "16px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!isLoading ? (
            <div className="Body-2">nickname</div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{ width: "30%", height: "16px", borderRadius: "8px" }}
            />
          )}
        </div>
        <div style={{ marginTop: "32px", width: "100%" }}>
          {!isLoading ? (
            <div className="Body-2">
              Это изображение из портфолио. Вы можете загружать свои лучшие
              работы, чтобы продемонстрировать прогресс и стиль.
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{ width: "100%", height: "32px", borderRadius: "8px" }}
            />
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <PortfolioDeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
