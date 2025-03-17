import React, { useState } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useSaveGuideMutation } from "../../redux/services/guidesAPI";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

const GuidesGallery = ({
  images,
  loadMore,
  hasMore,
  isLoading,
  isFetching,
  user,
  showSkeleton, // новый пропс
}) => {
  const breakpointColumnsObj = {
    default: 7,
    1100: 3,
    700: 2,
    500: 2,
  };

  const [saveGuideStatus, setSavedGuideStatus] = useState([]);
  const [saveGuide] = useSaveGuideMutation();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const handleSave = (e, guide) => {
    e.preventDefault();
    if (!user) {
      toast.info("Прежде чем продолжить, пожалуйста, зарегистрируйтесь.");
      return;
    }
    const isSavedFromData = guide?.attributes?.savedBy?.data?.some(
      (savedUser) => savedUser.id === user.id
    );
    const isSavedOptimistic = saveGuideStatus.includes(guide.id);
    const isCurrentlySaved = isSavedFromData || isSavedOptimistic;
    const action = isCurrentlySaved ? "unsave" : "save";

    if (action === "unsave") {
      setSavedGuideStatus((prev) => prev.filter((id) => id !== guide.id));
    } else {
      setSavedGuideStatus((prev) => [...prev, guide.id]);
    }
    saveGuide({ guideId: guide.id, userId: user.id, action });
  };

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={loadMore}
      hasMore={hasMore}
      loader={null}
      style={{ overflow: "hidden" }}
      endMessage={
        images.length > 0 && (
          <p style={{ textAlign: "center" }} className="Body-2">
            Больше изображений нет
          </p>
        )
      }
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((item) => {
          const imageAttributes = item.attributes?.image?.data?.attributes;
          const url =
            imageAttributes?.formats?.medium?.url ||
            imageAttributes?.formats?.small?.url ||
            imageAttributes?.url;
          if (!url) return null;
          const alternativeText =
            item.attributes?.image?.data?.attributes?.alternativeText ||
            item.attributes.title ||
            "Gallery image";
          const isImageSaved =
            saveGuideStatus.includes(item.id) ||
            (item.attributes?.savedBy?.data &&
              item.attributes.savedBy.data.some((u) => u.id === user.id));

          return (
            <div key={item.id} className="gallery-item">
              <Link to={`/guide/${item.id}`}>
                <img
                  src={url}
                  alt={
                    alternativeText || item.attributes.title || "Gallery image"
                  }
                  className="gallery-image"
                />
              </Link>
              {!isMobile && (
                <button
                  className="save-button button Body-3 button-animate-filter"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isImageSaved && "black",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSave(e, item);
                  }}
                >
                  {isImageSaved ? "Сохранено" : "Сохранить"}
                </button>
              )}
            </div>
          );
        })}
        {/* Рендерим скелетоны, если идет загрузка или активирован флаг showSkeleton */}
        {(isLoading || isFetching || showSkeleton) &&
          Array.from({ length: isMobile ? 5 : 40 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="gallery-item">
              <Skeleton
                variant="rectangular"
                sx={{ borderRadius: "8px" }}
                width="100%"
                height={Math.floor(Math.random() * (350 - 150 + 1)) + 150}
              />
            </div>
          ))}
      </Masonry>
      {(!isLoading || !isFetching) && images.length === 0 && (
        <div style={{ width: "100%" }}>
          <div className="h4" style={{ width: "100%", fontSize: "24px" }}>
            Нет подходящих гайдов
          </div>
          <div
            className="Body-2"
            style={{ width: "100%", fontSize: "20px", marginTop: "16px" }}
          >
            Попробуйте добавить гайды или удалить некоторые фильтры
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default GuidesGallery;
