import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import "./Map.css";

const Map = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBpeeTKd_AR0V-rKCp_XPfz6Zs0uSM39B4",
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <LoaderMap {...props} />;
};

function LoaderMap(props) {
  return (
    <GoogleMap
      zoom={props.zoom}
      center={props.center}
      mapContainerClassName="map"
    >
      <Marker position={props.center} />
    </GoogleMap>
  );
}

export default Map;
