import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import coursesReducer from "./coursesSlice";
import coursesCountReducer from "./coursesCountSlice";
import filterForCountReducer from "./filterForCountSlice";
import footerMenuReducer from "./footerMenuSlice";
import { authAPI } from "./services/authAPI";
import { courseAPI } from "./services/courseAPI";
import { studentAPI } from "./services/studentAPI";
import { invoiceAPI } from "./services/invoiceAPI";
import { activityApi } from "./services/activityApi";
import { guidesAPI } from "./services/guidesAPI";
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import studentReducer from "./reducers/studentReducer";
import invoiceReducer from "./reducers/invoiceSlice";
import courseTableReducer from "./reducers/courseTableReducer";
import activityReducer from "./reducers/activityReducer";
import modalReducer from "./reducers/modalReducer";
import guidesReducer from "./reducers/guidesReducer";
import monthReducer from "./reducers/monthReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    filter: filterReducer,
    courses: coursesReducer,
    coursesCount: coursesCountReducer,
    filterForCount: filterForCountReducer,
    footerMenu: footerMenuReducer,
    student: studentReducer,
    invoice: invoiceReducer,
    courseTable: courseTableReducer,
    activity: activityReducer,
    modals: modalReducer,
    guides: guidesReducer,
    monthCalculation: monthReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [invoiceAPI.reducerPath]: invoiceAPI.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [guidesAPI.reducerPath]: guidesAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      courseAPI.middleware,
      studentAPI.middleware,
      invoiceAPI.middleware,
      activityApi.middleware,
      guidesAPI.middleware
    ),
});
