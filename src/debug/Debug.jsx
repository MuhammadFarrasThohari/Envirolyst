import React from 'react'
import { getRecommendation } from '../services/getRecommendation';

function Debug() {


  const inputData = {
    coordinates: [-6.2149547212220995, 106.82366923371607],
    city: "Jakarta",
    country: "Indonesia",
    weather: {
      temperature: 30.5,
      humidity: 80,
      wind_speed: 2.1,
      uv_index: 4,
      season: "Clear"
    },
    air_quality: {
      pm25: 76,
      co: 0.7,
      aqi: 152
    },
    land_coverage: {
      vegetation: 18,
      buildings: 55,
      roads: 12,
      empty_land: 13,
      water_areas: 2
    }
  }

  const handleClick = async () => {
    const recomendation = await getRecommendation(inputData);
    console.log(recomendation);
  }

  return (
    <div>
      <button onClick={handleClick}>Click here</button>
    </div>
  )
}

export default Debug