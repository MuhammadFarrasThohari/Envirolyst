import React, {useEffect} from 'react'
import logo from '../assets/react.svg'
import satelliteIpsum from '../assets/image/satellite-dum.jpeg'
import { MapPin, Building, TreePine, Square, Waves, Thermometer, Wind, Users, Droplets, Download, Factory, Home, Sprout, Trees, Wheat, Flower, Car, Mountain } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import RecommendationCard from '../components/RecommendationCard';
import { useLocation } from 'react-router';
import * as LucideIcons from "lucide-react";

// public assets
import logoKita from "/logo/blackGreen.png";

function AnalysisResults() {
  useEffect(() => {
    document.title = "Envirolyst – Analysis Results";
  }, []);
  const location = useLocation();

  const { inputData, recommendations } = location.state || {};
  console.log(inputData);


  const landCoverageData = inputData?.land_coverage ? [
    {
      name: inputData.land_coverage.top1.label,
      value: Math.round(inputData.land_coverage.top1.score * 100),
      rawValue: inputData.land_coverage.top1.score
    },
    {
      name: inputData.land_coverage.top2.label,
      value: Math.round(inputData.land_coverage.top2.score * 100),
      rawValue: inputData.land_coverage.top2.score
    },
    {
      name: inputData.land_coverage.top3.label,
      value: Math.round(inputData.land_coverage.top3.score * 100),
      rawValue: inputData.land_coverage.top3.score
    },
    {
      name: inputData.land_coverage.top4.label,
      value: Math.round(inputData.land_coverage.top4.score * 100),
      rawValue: inputData.land_coverage.top4.score
    },
    {
      name: inputData.land_coverage.top5.label,
      value: Math.round(inputData.land_coverage.top5.score * 100),
      rawValue: inputData.land_coverage.top5.score
    }
  ] : [];

  const LAND_TYPE_COLORS = {
    'arbor woodland': '#22c55e',        // Green
    'artificial grassland': '#84cc16',   // Light green
    'dry cropland': '#eab308',          // Yellow
    'garden plot': '#10b981',           // Emerald
    'industrial land': '#6b7280',       // Gray
    'irrigated land': '#3b82f6',        // Blue
    'lake': '#0ea5e9',                  // Sky blue
    'natural grassland': '#65a30d',     // Lime green
    'paddy field': '#059669',           // Teal
    'pond': '#06b6d4',                  // Cyan
    'river': '#0284c7',                 // Light blue
    'rural residential': '#f59e0b',     // Amber
    'shrub land': '#16a34a',            // Green variant
    'traffic land': '#374151',          // Dark gray
    'urban residential': '#dc2626'      // Red
  };

  const getLandTypeColor = (landType, index) => {
    return LAND_TYPE_COLORS[landType.toLowerCase()] ||
      ['#f87171', '#4ade80', '#60a5fa', '#facc15', '#a78bfa'][index % 5];
  };

  const getLandTypeIcon = (landType) => {
    const type = landType.toLowerCase();
    switch (type) {
      case 'arbor woodland': return Trees;
      case 'artificial grassland': return Sprout;
      case 'dry cropland': return Wheat;
      case 'garden plot': return Flower;
      case 'industrial land': return Factory;
      case 'irrigated land': return Droplets;
      case 'lake': return Waves;
      case 'natural grassland': return Mountain;
      case 'paddy field': return Wheat;
      case 'pond': return Waves;
      case 'river': return Waves;
      case 'rural residential': return Home;
      case 'shrub land': return TreePine;
      case 'traffic land': return Car;
      case 'urban residential': return Building;
      default: return Square;
    }
  };

  const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15'];

  const getIconComponent = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent || LucideIcons.HelpCircle;
  }

  const getAQIRating = (aqi) => {
    if (aqi === 1) {
      return { label: 'Good', color: 'bg-green-200 text-green-600' };
    } else if (aqi === 2) {
      return { label: 'Moderate', color: 'bg-yellow-200 text-yellow-600' };
    } else if (aqi === 3) {
      return { label: 'Unhealthy for Sensitive', color: 'bg-orange-200 text-orange-600' };
    } else if (aqi === 4) {
      return { label: 'Unhealthy', color: 'bg-red-200 text-red-600' };
    } else {
      return { label: 'Hazardous', color: 'bg-purple-200 text-purple-600' };
    }
  };


  return (
    <div className='flex flex-col w-full p-10 gap-12'>
      {/* Header */}
      <div className='flex w-full justify-between items-center'>
        <img src={logo} alt="Logo Image" className='size-12' />
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-4xl font-semibold'>Enviromental Analysis Dashboard</h1>
          <p className='text-sm text-gray-600'>Satellite imagery and API-powered insight for sustainable development</p>
        </div>
        <button className='bg-green-500 px-4 py-4 rounded-xl text-sm text-white cursor-pointer '>Analyze different area</button>
      </div>

      {/* Data */}
      <div className='flex w-full justify-center gap-5'>
        <div className='w-1/3 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-6'>
          <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Location Overview</h2>
          <img src={inputData.sat_image} alt="Satellite Image" className='rounded-md' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <MapPin className='text-gray-700 size-5' />
              <p className='text-base'>{inputData.city}, {inputData.country}</p>
            </div>
            <p className='text-sm text-gray-500'><span className='text-gray-700'>Coordinates: </span>{inputData.coordinates[0].toFixed(3)}°N, {inputData.coordinates[1].toFixed(3)}°W</p>
            <p className='text-sm text-gray-500'><span className='text-gray-700'>Area: </span>{inputData.area} <sup>2</sup></p>
          </div>
        </div>
        <div className='w-1/3 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col'>
          <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Land Usage Breakdown</h2>
          <div className='flex w-full justify-center'>
            <PieChart width={300} height={300}>
              <Pie
                data={landCoverageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {landCoverageData.map((entry, index) => (
                  <Cell key={index} fill={getLandTypeColor(entry.name, index)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className='flex flex-col gap-2 max-h-48 overflow-y-auto'>
            {landCoverageData.map((item, index) => {
              const IconComponent = getLandTypeIcon(item.name);
              const color = getLandTypeColor(item.name, index);
              return (
                <div key={index} className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <div className='p-1 rounded-full' style={{ backgroundColor: color }}>
                      <IconComponent className='text-white size-5' />
                    </div>
                    <p className='text-sm capitalize'>{item.name.replace(/_/g, ' ')}</p>
                  </div>
                  <p className='text-sm font-medium'>{item.value}%</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className='w-1/3 flex flex-col gap-6'>
          <div className='h-3/7 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-10'>
            <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Weather</h2>
            <div className='flex justify-between px-4 gap-2'>
              <div className='flex flex-col justify-center items-center'>
                <Thermometer className='text-orange-400' />
                <p>{inputData.weather.temperature}°C</p>
                <p className='text-sm text-gray-400'>Temprature</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Droplets className='text-blue-400' />
                <p>{inputData.weather.humidity}%</p>
                <p className='text-sm text-gray-400'>Humidity</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Wind className='text-gray-500' />
                <p>{inputData.weather.wind_speed} m/s</p>
                <p className='text-sm text-gray-400'>Wind</p>
              </div>
            </div>
          </div>
          <div className='h-4/7 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-6'>
            <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Air Quality</h2>
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between gap-2'>
                <p>AQI (Air Quality Index)</p>
                <p className={`text-sm py-1 px-2 rounded-full ${getAQIRating(inputData.air_quality.aqi).color}`}>
                  {getAQIRating(inputData.air_quality.aqi).label}
                </p>
              </div>
              <div className='flex justify-between'>
                <p>PM2.5</p>
                <p>{inputData.air_quality.pm25} µg/m³</p>
              </div>
              <div className='flex justify-between'>
                <p>PM10</p>
                <p>{inputData.air_quality.pm10} µg/m³</p>
              </div>
              <div className='flex justify-between'>
                <p>CO</p>
                <p>{inputData.air_quality.co} µg/m³</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation card */}
      <div className='drop-shadow-lg p-5 rounded-lg border border-gray-200'>
        <div className='flex flex-col gap-10 px-5 py-5'>
          <h2 className='text-3xl font-semibold text-green-500'>Recomendations</h2>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Residents</h3>
            <div className='grid grid-cols-2 gap-6'>
              {recommendations.residents.map((rec, index) => (
                <RecommendationCard key={index} icon={getIconComponent(rec.icon)} title={rec.title} priority={rec.priority} description={rec.description} />
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Community Organization</h3>
            <div className='grid grid-cols-2 gap-6'>
              {recommendations.community_organizations.map((rec, index) => (
                <RecommendationCard key={index} icon={getIconComponent(rec.icon)} title={rec.title} priority={rec.priority} description={rec.description} />
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Government</h3>
            <div className='grid grid-cols-2 gap-6'>
              {recommendations.government.map((rec, index) => (
                <RecommendationCard key={index} icon={getIconComponent(rec.icon)} title={rec.title} priority={rec.priority} description={rec.description} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center gap-15 drop-shadow-lg p-5 rounded-lg border border-gray-200'>
        <button className='flex gap-2 text-white bg-green-400 py-3 px-4 rounded-lg cursor-pointer items-center hover:bg-green-500'><Download /> Report</button>
        <button className='flex gap-2 text-green-400 border border-green-300 rounded-lg items-center py-3 px-4 cursor-pointer hover:bg-green-400 hover:text-white'><Users />View Nearby Initiatives</button>
      </div>
    </div>
  )
}

export default AnalysisResults