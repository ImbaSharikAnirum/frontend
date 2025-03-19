import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import GuideComplainModal from "../components/Guide/GuideComplainModal";
import GuideDeleteModal from "../components/Guide/GuideDeleteModal";
import CreationUploadModal from "../components/Guide/CreationUploadModal";
import NotAuthenticatedModal from "../components/Guide/NotAuthenticatedModal";
import { showFooterMenu } from "../redux/footerMenuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import GuideImage from "../components/Guide/GuideImage";
import GuideInfo from "../components/Guide/GuideInfo";
import {
  useGetGuideByIdQuery,
  useSaveGuideMutation,
} from "../redux/services/guidesAPI";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import GuideMore from "../components/Guide/GuideMore";
import GuideImageMobile from "../components/Guide/GuideImageMobile";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";

export default function Guide() {
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);
  const { data, error, isLoading } = useGetGuideByIdQuery({
    id,
    userId: user ? user.id : null,
  });
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [imageHeight, setImageHeight] = useState(0);

  // Состояния модалок
  const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isNotAuthModalOpen, setIsNotAuthModalOpen] = useState(false);

  // Состояние для статуса сохранения гайда
  const [savedGuideStatus, setSavedGuideStatus] = useState(false);
  const [saveGuide] = useSaveGuideMutation();

  // Устанавливаем начальный статус сохранения, когда данные загружены
  useEffect(() => {
    if (data && user) {
      const isGuideSaved = data.data.attributes.savedBy?.data?.some(
        (u) => u.id === user.id
      );
      setSavedGuideStatus(!!isGuideSaved);
    }
  }, [data, user]);

  const openComplainModal = () => setIsComplainModalOpen(true);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const openCreationModal = () => setIsCreationModalOpen(true);
  const openNotAuthModal = () => setIsNotAuthModalOpen(true);

  useEffect(() => {
    return () => {
      dispatch(showFooterMenu(false));
    };
  }, [dispatch]);

  if (error) return <div>Error loading guide.</div>;

  const imageUrl =
    data?.data?.attributes?.image?.data?.attributes?.formats?.medium?.url ||
    data?.data?.attributes?.image?.data?.attributes?.url ||
    data?.data?.attributes?.image?.data?.attributes?.formats?.small?.url ||
    data?.data?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url;
  const info = data?.data?.attributes;
  const creations = data?.data?.attributes?.creations?.data;
  const authorId = data?.data?.attributes?.users_permissions_user?.data.id;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsNotAuthModalOpen(true);
      return;
    }
    const action = savedGuideStatus ? "unsave" : "save";
    // Оптимистичное обновление: сразу меняем статус кнопки
    const prevStatus = savedGuideStatus;
    setSavedGuideStatus(!prevStatus);
    try {
      await saveGuide({ guideId: id, userId: user.id, action }).unwrap();
    } catch (err) {
      // Если произошла ошибка, возвращаем предыдущий статус
      setSavedGuideStatus(prevStatus);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* Рендерим модальные окна */}
      {isComplainModalOpen && (
        <GuideComplainModal
          guideId={id}
          onClose={() => setIsComplainModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <GuideDeleteModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
      {isCreationModalOpen && (
        <CreationUploadModal
          guideId={id}
          onClose={() => setIsCreationModalOpen(false)}
        />
      )}
      {isNotAuthModalOpen && (
        <NotAuthenticatedModal onClose={() => setIsNotAuthModalOpen(false)} />
      )}

      <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
        <div
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {isMobile && (
            <GuideImageMobile
              imageUrl={imageUrl}
              setImageHeight={setImageHeight}
              isLoading={isLoading}
            />
          )}

          {!isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                height: `${Math.max(imageHeight, 400)}px`,
                width: "100%",
              }}
            >
              <GuideImage
                imageUrl={imageUrl}
                isLoading={isLoading}
                setImageHeight={setImageHeight}
                imageHeight={imageHeight}
              />
              <GuideInfo
                authorId={authorId}
                info={info}
                id={id}
                openComplainModal={openComplainModal}
                openDeleteModal={openDeleteModal}
                openCreationModal={openCreationModal}
                openNotAuthModal={openNotAuthModal}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        {isMobile && (
          <div
            style={{
              marginTop: imageHeight ? imageHeight : "250px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1001,
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  style={{
                    width: "180px",
                    height: "40px",
                    borderRadius: "30px",
                  }}
                />
              ) : (
                <button
                  className="button Body-3 button-animate-filter"
                  onClick={() => {
                    if (!user) {
                      setIsNotAuthModalOpen(true);
                    } else {
                      setIsCreationModalOpen(true);
                    }
                  }}
                >
                  Загрузить работу
                </button>
              )}
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  style={{
                    width: "180px",
                    height: "40px",
                    borderRadius: "30px",
                  }}
                />
              ) : (
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={handleSave}
                  style={{
                    backgroundColor: savedGuideStatus ? "black" : "",
                    color: savedGuideStatus ? "white" : "",
                  }}
                >
                  {savedGuideStatus ? "Сохранено" : "Сохранить"}
                </button>
              )}
            </div>
            {isLoading ? (
              <Skeleton
                className="button_icon"
                variant="circular"
                style={{ height: "40px", width: "40px" }}
              />
            ) : (
              <div>
                <GuideMore
                  onOpenComplain={openComplainModal}
                  onOpenDelete={openDeleteModal}
                  authorId={authorId}
                />
              </div>
            )}
          </div>
        )}
        {!isLoading && Number(creations?.length) > 0 && user && (
          <div
            style={{
              marginTop: "32px",
              backgroundColor: "#F2F2F2",
              borderRadius: "20px",
              padding: "24px 24px 12px 24px",
            }}
          >
            <div className="Body-2">Прогресс</div>
            <div
              className="scroll_guide"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "24px",
                marginTop: "16px",
                flexWrap: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              {creations?.map((creation, index) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "16px",
                  }}
                  key={index}
                >
                  <Link to={`/creation/${creation.id}`}>
                    <img
                      src={
                        creation.attributes.image.data.attributes.formats?.small
                          ?.url
                      }
                      alt="Creation"
                      style={{
                        maxWidth: "150px",
                        height: "150px",
                        border: "1px solid #DDDDDD",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div style={{ marginTop: "8px" }} className="Body-2">
                    {moment(creation.attributes.publishedAt).format(
                      "DD.MM.YYYY"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
