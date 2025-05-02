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
import { portfolioAPI } from "./services/portfolioAPI";
import { chatAPI } from "./services/chatAPI";
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import studentReducer from "./reducers/studentReducer";
import invoiceReducer from "./reducers/invoiceSlice";
import invoiceBookingReducer from "./reducers/invoiceBookingReducer";
import courseTableReducer from "./reducers/courseTableReducer";
import activityReducer from "./reducers/activityReducer";
import modalReducer from "./reducers/modalReducer";
import creationReducer from "./reducers/creationReducer";
import monthReducer from "./reducers/monthReducer";
import portfolioReducer from "./reducers/portfolioReducer";
import userProfileReducer from "./reducers/userProfileReducer";
import pinterestReducer from "./reducers/pinterestReducer";
import chatReducer from "./reducers/chatReducer";
import currencyReducer from "./reducers/currencyReducer";
import languageReducer from "./reducers/languageReducer";

import { pinterestAPI } from "./services/pinterestApi";
import { userProfileAPI } from "./services/userProfileAPI";
import { creationAPI } from "./services/creationAPI";
import { directionAPI } from "./services/directionAPI";
import { skillAPI } from "./services/skillAPI";
import { skillTreeAPI } from "./services/skillTreeAPI";
import skillTreeReducer from "./reducers/skillTreeSlice";

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
    invoiceBooking: invoiceBookingReducer,
    courseTable: courseTableReducer,
    activity: activityReducer,
    modals: modalReducer,
    monthCalculation: monthReducer,
    pinterest: pinterestReducer,
    userProfile: userProfileReducer,
    creation: creationReducer,
    portfolio: portfolioReducer,
    skillTree: skillTreeReducer,
    chat: chatReducer,
    currency: currencyReducer,
    language: languageReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [invoiceAPI.reducerPath]: invoiceAPI.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [guidesAPI.reducerPath]: guidesAPI.reducer,
    [pinterestAPI.reducerPath]: pinterestAPI.reducer,
    [userProfileAPI.reducerPath]: userProfileAPI.reducer,
    [creationAPI.reducerPath]: creationAPI.reducer,
    [portfolioAPI.reducerPath]: portfolioAPI.reducer,
    [directionAPI.reducerPath]: directionAPI.reducer,
    [skillAPI.reducerPath]: skillAPI.reducer,
    [skillTreeAPI.reducerPath]: skillTreeAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      courseAPI.middleware,
      studentAPI.middleware,
      invoiceAPI.middleware,
      activityApi.middleware,
      guidesAPI.middleware,
      pinterestAPI.middleware,
      userProfileAPI.middleware,
      creationAPI.middleware,
      portfolioAPI.middleware,
      directionAPI.middleware,
      skillAPI.middleware,
      skillTreeAPI.middleware,
      chatAPI.middleware
    ),
});
