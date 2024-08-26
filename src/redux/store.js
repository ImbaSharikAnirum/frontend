import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import coursesReducer from "./coursesSlice";
import coursesCountReducer from "./coursesCountSlice";
import filterForCountReducer from "./filterForCountSlice";
import footerMenuReducer from "./footerMenuSlice";
import { authAPI } from "./services/authAPI";
import { courseAPI } from "./services/courseAPI";
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    filter: filterReducer,
    courses: coursesReducer,
    coursesCount: coursesCountReducer,
    filterForCount: filterForCountReducer,
    footerMenu: footerMenuReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware, courseAPI.middleware),
});
