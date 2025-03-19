import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCreationQuery } from "../redux/services/creationAPI";
import { Avatar, Skeleton } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import CreationDeleteModal from "../components/Creation/CreationDeleteModal";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import CreationMore from "../components/Creation/CreationMore";

export default function CreationDetails() {
  // Извлекаем id из URL
  const { id } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const user = useSelector(selectCurrentUser);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Получаем данные создания
  const { data, error, isLoading } = useGetCreationQuery(id);

  if (error) return <div>Ошибка при загрузке создания.</div>;

  // Извлекаем URL изображения создания
  const creationImageUrl =
    data?.data?.attributes?.image?.url ||
    data?.data?.attributes?.image?.data?.attributes?.formats?.medium?.url ||
    data?.data?.attributes?.image?.data?.attributes?.formats?.small?.url ||
    data?.data?.attributes?.image?.data?.attributes?.url;

  const creationImageAlt =
    data?.data?.attributes?.image?.data?.attributes?.alternativeText ||
    "Изображение создания";

  // Извлекаем URL аватара пользователя
  const avatarUrl =
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.data?.attributes?.formats?.small?.url ||
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.data?.attributes?.url ||
    "";

  const avatarAlt =
    data?.data?.attributes?.users_permissions_user?.data?.attributes?.avatar
      ?.alternativeText || "Avatar пользователя";

  // Извлекаем URL изображения гайда
  const guideImageUrl =
    data?.data?.attributes?.guide?.data?.attributes?.image?.url ||
    data?.data?.attributes?.guide?.data?.attributes?.image?.data?.attributes
      ?.formats?.medium?.url ||
    data?.data?.attributes?.guide?.data?.attributes?.image?.data?.attributes
      ?.formats?.small?.url ||
    data?.data?.attributes?.guide?.data?.attributes?.image?.data?.attributes
      ?.url;
  const guideImageId = data?.data?.attributes?.guide?.data?.id;
  const guideImageAlt =
    data?.data?.attributes?.guide?.data?.attributes?.image?.data?.attributes
      ?.alternativeText || "Guide изображение";
  const authorId = data?.data?.attributes?.users_permissions_user?.data?.id;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "16px" : "0",
      }}
    >
      {/* Левая колонка – изображение создания */}
      <div
        style={{
          width: isMobile ? "100%" : "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ padding: "12px" }}>
          {creationImageUrl ? (
            <img
              src={creationImageUrl}
              alt={creationImageAlt}
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
      {/* Правая колонка – аватар и гайд */}
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
          <CreationMore
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
              Ознакомьтесь с гайдом, чтобы понять логику и вдохновиться для
              собственных работ:
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{ width: "100%", height: "32px", borderRadius: "8px" }}
            />
          )}
        </div>
        <div style={{ marginTop: "12px", width: "100%" }}>
          {guideImageUrl ? (
            <Link to={`/guide/${guideImageId}`}>
              <img
                src={guideImageUrl}
                alt={guideImageAlt}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Link>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{ width: "100%", height: "200px", borderRadius: "8px" }}
            />
          )}
        </div>
      </div>
      {isDeleteModalOpen && (
        <CreationDeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
