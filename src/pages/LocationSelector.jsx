import React, { useState, useEffect, useRef } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router";


const Mapv4 = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snapCount, setSnapCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [lastCoords, setLastCoords] = useState(null);

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const boxSize = 200; 
  const scale = 2;
  const snapshotSize = 400; 

  const offset = boxSize / 2;

  useEffect(() => {
    const move = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  

  const handleMapClick = async (e) => {
    const { latLng } = e.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;

    setLastCoords({ lat, lng });

    const currentZoom = mapRef.current?.getZoom?.() || zoomLevel;
    setZoomLevel(currentZoom);

    const url = generateStaticMapUrl(lat, lng, currentZoom, snapshotSize, scale);
    setSnapshotUrl(url);
    setSnapCount((prev) => prev + 1);
    console.log("📸 Snapshot URL:", url);
    console.log("Lat & Lng", lat, lng);
    try {
      const location = await getCityAndCountry(lat, lng);
      // console.log("📍 City & Country:", location.city, location.country);
      console.log("📍 City & Country:", location);
      setCity(location.city);
      setCountry(location.country);
    } catch (err) {
      console.error("Error getting city/country:", err.message);
    }
  };


  return (
    <div className="relative">
      <header className="bg-allWhite pb-6 pt-2 flex  items-center justify-between text-center text-2xl font-popMd">
        <h2 >Logo</h2>
        <div className="flex flex-col items-center justify-center space-y-1">
          <h3 className="font-popSmBld">Snapshot</h3>
          <h1 className="text-sm">Click an area on the map and analyze to see the report</h1>

        </div>
        <h2 className="text-lg" >Zoom: {zoomLevel}</h2>

      </header>
      <Map
        defaultCenter={{ lat: -6.2, lng: 106.8 }}
        defaultZoom={zoomLevel}
        mapTypeId="hybrid"
        style={{ width: "100%", height: "82vh" }}
        onClick={handleMapClick}
        onZoomChanged={(e) => setZoomLevel(e.detail.zoom)}
        onLoad={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        options={{
          disableDefaultUI: true,
          // zoomControl: true,
          mapTypeControl: true,
          // fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          maxZoom: 20,
          minZoom: 2,
        }}
        streetViewControl:false

      />

      {/* <div
        style={{
          position: "fixed",
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          left: `${mousePos.x - offset}px`,
          top: `${mousePos.y - offset}px`,
          border: "2px dashed #4caf50",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      /> */}

      {snapshotUrl && lastCoords && (
        <div
          className="fixed bg-allWhite p-4 rounded-md space-y-2"
          style={{
            bottom: 30,
            right: 20,
            zIndex: 10000,
            maxWidth: "280px",
          }}
        >
          {/* <h4>📸 Snapshot #{snapCount}</h4> */}
          <div className="text-sm text-allBlack space-y-1 ">
            <p> 
              <span> Location: </span> 
              {city}, {country} 
            </p> 
            <p> 
              <span> Area: </span> 
              {estimateAreaFromBox(zoomLevel, boxSize, scale, lastCoords.lat)} m × m 
            </p> 
            <p> 
              <span> Lat: </span> 
              {lastCoords.lat}
            </p> 
            <p> 
              <span> Lng: </span> 
              {lastCoords.lng}
            </p> 
          </div>
          
          <img src={snapshotUrl} alt="Snapshot" className="w-full rounded-lg" />
          <button
            className="bg-greenie text-allWhite px-4 py-2 rounded mt-2 font-popReg w-full"
            onClick={() => navigate("/report", {
                state: {
                    url: snapshotUrl,
                    lat: lastCoords.lat,
                    lng: lastCoords.lng,
                    zoom: zoomLevel,
                },})
}
            >
            Analyze
            </button>
        </div>
      )}
    </div>
  );
};

function generateStaticMapUrl(lat, lng, zoom, size, scale) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}x${size}&scale=${scale}&maptype=satellite&key=${API_KEY}`;
}

function estimateMetersPerPixel(zoom, latitude = 0) {
  const earthCircumference = 40075016.686;
  const latitudeCorrection = Math.cos((latitude * Math.PI) / 180);
  return (earthCircumference * latitudeCorrection) / Math.pow(2, zoom + 8);
}

function estimateAreaFromBox(zoom, boxSizePx, scale = 1, latitude = 0) {
  const metersPerPixel = estimateMetersPerPixel(zoom, latitude);
  const effectivePixels = boxSizePx * scale;
  return Math.round(effectivePixels * metersPerPixel);
}

async function getCityAndCountry(lat, lng) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API;
  const response = await fetch(
     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=id&key=${API_KEY}`
  );

  const data = await response.json();
  if (data.status === "OK") {
    const addressComponents = data.results[0]?.address_components || [];

    let city = "";
    let country = "";

    for (const component of addressComponents) {
      // if (component.types.includes("locality")) {
      //   city = component.long_name;
      // }

      // if (component.types.includes("administrative_area_level_1")) {
      //   city = component.long_name;
      // }

      if (component.types.includes("administrative_area_level_2")) {
        city = component.long_name;
      }

      if (component.types.includes("country")) {
        country = component.long_name;
      }
    }

    return { city, country };
  } else {
    throw new Error("Failed to reverse geocode");
  }
}




export default Mapv4;