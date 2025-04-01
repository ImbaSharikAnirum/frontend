import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useGetPortfoliosQuery } from "../../redux/services/portfolioAPI";

export default function PortfolioGallery({ id, showSkeleton }) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [page, setPage] = useState(1);
  const [portfolios, setPortfolios] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Запрашиваем портфолио по странице
  const { data, isLoading, isFetching } = useGetPortfoliosQuery(
    { userId: id, page },
    { refetchOnMountOrArgChange: true }
  );
  console.log(data, "data");
  // Обновляем галерею при получении новых данных
  useEffect(() => {
    if (data && data.data) {
      if (page === 1) {
        setPortfolios(data.data);
      } else {
        setPortfolios((prevPortfolios) => {
          const newUnique = data.data.filter(
            (item) => !prevPortfolios.some((prev) => prev.id === item.id)
          );
          return [...prevPortfolios, ...newUnique];
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
      dataLength={portfolios.length}
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
        {portfolios.map((item) => {
          // Предполагаем, что портфолио имеет поле images с массивом картинок
          const imageData = item.attributes?.image?.data;
          if (!imageData) return null;
          // Берём первую картинку для превью
          const imageUrl =
            imageData.attributes?.formats?.medium?.url ||
            imageData.attributes?.formats?.small?.url ||
            imageData.attributes?.url;
          const altText =
            imageData.attributes?.alternativeText ||
            item.attributes?.title ||
            "Portfolio image";
          return (
            <div key={item.id} className="gallery-item">
              <Link to={`/portfolio/${item.id}`}>
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
      {!isLoading && !isFetching && portfolios.length === 0 && (
        <div style={{ width: "100%", padding: "0px 24px" }}>
          <div className="h4" style={{ width: "100%", fontSize: "24px" }}>
            На данный момент в портфолио работ нет
          </div>
          <div
            className="Body-2"
            style={{
              width: "100%",
              fontSize: "20px",
              marginTop: "16px",
            }}
          >
            Попробуйте зайти позже.
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
}
