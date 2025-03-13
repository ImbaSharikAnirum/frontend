import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setLoading,
  setPinterest,
} from "../redux/reducers/pinterestReducer";
import { useFetchPinsQuery } from "../redux/services/pinterestApi";
import { selectIsInitialized } from "../redux/reducers/authReducer";
import "../styles/gallery.css"; // Подключение стилей

const PinterestPins = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);

  // Используем хук для запроса пинов
  const {
    data: pins,
    error,
    isLoading,
    isSuccess,
  } = useFetchPinsQuery({
    skip: !isInitialized,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (isSuccess && pins) {
      console.log("Pins received:", pins);
      dispatch(setPinterest(pins));
    } else if (error) {
      dispatch(setError(error.message || "Error fetching pins"));
    }
  }, [isLoading, isSuccess, pins, error, dispatch]);

  // Получаем статус и ошибку из Redux с помощью useSelector
  const status = useSelector((state) => state.pinterest.status);
  const selectError = useSelector((state) => state.pinterest.error);
  const pinsFromStore = useSelector((state) => state.pinterest.pinterest);

  return (
    <div>
      <h1>Pinterest Pins</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {selectError}</p>}
      {status === "succeeded" && pinsFromStore && (
        <div>
          <h2>Your Pinterest Pins</h2>
          <div className="pinterest-grid">
            {pinsFromStore.items.length > 0 ? (
              pinsFromStore.items.map((pin) => (
                <div key={pin.id} className="grid-item">
                  <img
                    src={pin.media?.images["1200x"]?.url}
                    alt={pin.title}
                    className="pin-image"
                  />
                  <p>{pin.title}</p>
                </div>
              ))
            ) : (
              <p>No pins available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PinterestPins;
