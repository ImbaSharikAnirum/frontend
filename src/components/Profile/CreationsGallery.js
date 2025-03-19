import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetCreationsQuery } from "../../redux/services/creationAPI";
import { useMediaQuery } from "react-responsive";

const CreationsGallery = ({ id, showSkeleton }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [page, setPage] = useState(1);
  const [creations, setCreations] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Запрашиваем creations по странице
  const { data, isLoading, isFetching } = useGetCreationsQuery(
    {
      userId: id,
      page,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Обновляем галерею при получении новых данных
  useEffect(() => {
    if (data && data.data) {
      if (page === 1) {
        setCreations(data.data);
      } else {
        setCreations((prevCreations) => {
          const newUnique = data.data.filter(
            (item) => !prevCreations.some((prev) => prev.id === item.id)
          );
          return [...prevCreations, ...newUnique];
        });
      }
      // Если получено меньше 30 элементов, значит больше страниц нет
      setHasMore(data.data.length === 30);
    } else {
      setHasMore(false);
    }
  }, [data, page]);

  const loadMore = () => {
    if (!isLoading && !isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const breakpointColumnsObj = {
    default: 7,
    1100: 3,
    700: 2,
    500: 2,
  };

  return (
    <InfiniteScroll
      dataLength={creations.length}
      next={loadMore}
      hasMore={hasMore}
      loader={null}
      style={{ overflow: "hidden" }}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {creations.map((item) => {
          const imageUrl =
            item.attributes?.image?.data?.attributes?.formats?.medium?.url ||
            item.attributes?.image?.data?.attributes?.formats?.small?.url ||
            item.attributes?.image?.data?.attributes?.url ||
            item.attributes?.image?.url;
          if (!imageUrl) return null;
          const altText =
            item.attributes?.image?.data?.attributes?.alternativeText ||
            item.attributes.title ||
            "Creation image";
          return (
            <div key={item.id} className="gallery-item">
              <Link to={`/creation/${item.id}`}>
                <img src={imageUrl} alt={altText} className="gallery-image" />
              </Link>
            </div>
          );
        })}
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
      {!isLoading && !isFetching && creations.length === 0 && (
        <div style={{ width: "100%" }}>
          <div className="h4" style={{ width: "100%", fontSize: "24px" }}>
            На данный момент креативностей нет
          </div>
          <div
            className="Body-2"
            style={{ width: "100%", fontSize: "20px", marginTop: "16px" }}
          >
            Попробуйте зайти позже
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default CreationsGallery;
