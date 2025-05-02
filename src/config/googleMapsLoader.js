import { Loader } from "@googlemaps/js-api-loader";

let loader = null;

export const initGoogleMapsLoader = () => {
  if (!loader) {
    loader = new Loader({
      apiKey: "AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc",
      version: "weekly",
      libraries: ["maps", "marker"],
      id: "anirum",
    });
  }
  return loader;
};

export const loadGoogleMaps = async () => {
  const loader = initGoogleMapsLoader();
  await loader.load();
  return window.google;
};
