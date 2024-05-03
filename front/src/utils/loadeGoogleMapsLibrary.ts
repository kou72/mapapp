import { Loader } from "@googlemaps/js-api-loader";

export const loadeGoogleMapsLibrary = async () => {
  const loader = new Loader({
    apiKey: process.env.VUE_APP_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps", "marker"],
  });
  const { Map } = await loader.importLibrary("maps");
  const { PinElement } = await loader.importLibrary("marker");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  return { Map, PinElement, AdvancedMarkerElement };
};
