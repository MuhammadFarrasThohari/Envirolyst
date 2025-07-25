import React, { useState, useEffect, useRef } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router";
import axios from "axios";
import { getRecommendation } from "../services/getRecommendation";

const MapView = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snapCount, setSnapCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [lastCoords, setLastCoords] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyze.");

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

  useEffect(() => {
    if (!isLoading) return;

    const dots = [".", "..", "..."];
    let i = 0;

    const interval = setInterval(() => {
      setLoadingText(`Analyze${dots[i % dots.length]}`);
      i++;
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleMapClick = async (e) => {
    const { latLng } = e.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;

    setLastCoords({ lat, lng });

    const currentZoom = mapRef.current?.getZoom?.() || zoomLevel;
    setZoomLevel(currentZoom);

    const url = generateStaticMapUrl(
      lat,
      lng,
      currentZoom,
      snapshotSize,
      scale
    );
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

  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleButton = async () => {
    setIsLoading(true);

    let blob;
    let weatherData;
    let airPollutionData;
    let landData = [];
    let imageBase64 = null;

    try {
      blob = await downloadImageAsBlob(snapshotUrl);
      imageBase64 = await blobToBase64(blob);
    } catch (error) {
      console.error("Error downloading image:", error);
      return; // keluar jika download gagal
    }

    const formData = new FormData();
    formData.append("image", blob, "snapshot.png");

    try {
      const { data } = await axios.post(
        "http://localhost:5050/api/classify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from backend:", data);
      landData = data
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lastCoords.lat
        }&lon=${lastCoords.lng}&appid=${import.meta.env.VITE_WEATHER_API_KEY
        }&units=metric`
      );
      console.log("Weather data:", data);
      weatherData = data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }

    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lastCoords.lat
        }&lon=${lastCoords.lng}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      console.log("Air pollution data:", data);
      airPollutionData = data;
    } catch (error) {
      console.error("Error fetching air pollution data:", error);
    }

    const inputData = {
      coordinates: [lastCoords.lat, lastCoords.lng],
      city: city,
      country: country,
      area: `${estimateAreaFromBox(zoomLevel, boxSize, scale, lastCoords.lat)} m`,
      sat_image: imageBase64,
      weather: {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
      },
      air_quality: {
        pm25: airPollutionData.list[0].components.pm2_5,
        pm10: airPollutionData.list[0].components.pm10,
        co: airPollutionData.list[0].components.co,
        aqi: airPollutionData.list[0].main.aqi,
      },
      land_coverage: {
        top1: {
          label: landData[0]?.label || "Unknown",
          score: landData[0]?.score || 0,
        },
        top2: {
          label: landData[1]?.label || "Unknown",
          score: landData[1]?.score || 0,
        },
        top3: {
          label: landData[2]?.label || "Unknown",
          score: landData[2]?.score || 0,
        },
        top4: {
          label: landData[3]?.label || "Unknown",
          score: landData[3]?.score || 0,
        },
        top5: {
          label: landData[4]?.label || "Unknown",
          score: landData[4]?.score || 0,
        },
      }
    };

    const recommendations = await getRecommendation(inputData)

    // console.log("Input data to be sent:", inputData);
    // console.log("Recommendations result with AI:", recommendations);
    setIsLoading(false);
    navigate('/result', { state: { inputData, recommendations } })
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center">
          <div className="text-white text-2xl font-popMd animate-pulse">
            {loadingText}
          </div>
        </div>
      )}
      <header className="bg-white p-6 flex  items-center justify-between text-center text-2xl font-popMd">
        <h2>Logo</h2>
        <div className="flex flex-col items-center justify-center space-y-1">
          <h3 className="font-popSmBld">Snapshot</h3>
          <h1 className="text-sm">
            Click an area on the map and analyze to see the report
          </h1>
        </div>
        <h2 className="text-lg">Zoom: {zoomLevel}</h2>
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
            right: 10,
            zIndex: 10000,
            maxWidth: "280px",
          }}
        >
          {/* <h4>📸 Snapshot #{snapCount}</h4> */}
          <div className="text-sm text-allBlack space-y-1 previewLabel" >
            <p>
              <span> Location: </span>
              {city}, {country}
            </p>
            <p>
              <span> Area: </span>
              {estimateAreaFromBox(zoomLevel, boxSize, scale, lastCoords.lat)} m
              × m
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
            className="primarybtn transit text-allWhite px-4 py-2 rounded mt-2 font-popReg w-full cursor-pointer hover:bg-green-600"
            onClick={handleButton}
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

async function downloadImageAsBlob(url) {
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) throw new Error("Gagal mengunduh gambar");
  return await response.blob();
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

export default MapView;
