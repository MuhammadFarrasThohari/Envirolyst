import React from 'react'
import logo from '../assets/react.svg'
import satelliteIpsum from '../assets/image/satellite-dum.jpeg'
import { MapPin, Building, TreePine, Square, Waves, Thermometer, Wind, Users, Droplets, Download } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import RecommendationCard from '../components/RecommendationCard';

function AnalysisResults() {
  const data = [
    { name: 'Vegetation', value: 8 },
    { name: 'Buildings', value: 64 },
    { name: 'Water', value: 2 },
    { name: 'Empty Land', value: 26 },
  ];

  const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15'];

  return (
    <div className='flex flex-col w-full p-10 gap-12'>
      {/* Header */}
      <div className='flex w-full justify-between items-center'>
        <img src={logo} alt="Logo Image" className='object-fit size-12' />
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-4xl font-semibold'>Enviromental Analysis Dashboard</h1>
          <p className='text-sm text-gray-600'>Satellite imagery and API-powered insight for sustainable development</p>
        </div>
        <button className='bg-green-600 px-4 py-4 rounded-xl text-sm text-white cursor-pointer '>Analyze different area</button>
      </div>

      {/* Data */}
      <div className='flex w-full justify-center gap-5'>
        <div className='w-1/3 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-6'>
          <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Location Overview</h2>
          <img src={satelliteIpsum} alt="Satellite Image" className='rounded-md' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <MapPin className='text-gray-700 size-5' />
              <p className='text-base'>Jakarta Timur, Indonesia</p>
            </div>
            <p className='text-sm text-gray-500'><span className='text-gray-700'>Coordinates: </span>40.7128°N, 74.060°W</p>
            <p className='text-sm text-gray-500'><span className='text-gray-700'>Area: </span>2 KM^2</p>
          </div>
        </div>
        <div className='w-1/3 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col'>
          <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Land Usage Breakdown</h2>
          <div className='flex w-full justify-center'>
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <Building className='bg-red-400 text-white p-1 size-7 rounded-full' />
                <p className='text-sm'>Buildings</p>
              </div>
              <p className='text-sm'>64%</p>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <TreePine className='bg-green-400 text-white p-1 size-7 rounded-full' />
                <p className='text-sm'>Vegetation</p>
              </div>
              <p className='text-sm'>64%</p>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <Square className='bg-yellow-400 text-white p-1 size-7 rounded-full' />
                <p className='text-sm'>Empty Lands</p>
              </div>
              <p className='text-sm'>26%</p>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <Waves className='bg-blue-400 text-white p-1 size-7 rounded-full' />
                <p className='text-sm'>Water Areas</p>
              </div>
              <p className='text-sm'>2%</p>
            </div>
          </div>
        </div>
        <div className='w-1/3 flex flex-col gap-6'>
          <div className='h-3/7 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-10'>
            <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Weather</h2>
            <div className='flex justify-between px-4 gap-2'>
              <div className='flex flex-col justify-center items-center'>
                <Thermometer className='text-orange-400' />
                <p>33°C</p>
                <p className='text-sm text-gray-400'>Temperature</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Droplets className='text-blue-400' />
                <p>16%</p>
                <p className='text-sm text-gray-400'>Humidity</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Wind className='text-gray-500' />
                <p>12 km/h</p>
                <p className='text-sm text-gray-400'>Wind</p>
              </div>
            </div>
          </div>
          <div className='h-4/7 drop-shadow-lg p-5 rounded-lg border border-gray-200 flex flex-col gap-8'>
            <h2 className='text-xl font-semibold text-green-600 tracking-wide'>Air Quality</h2>
            <div className='flex justify-between gap-2'>
              <p>AQI (Air Quality Index)</p>
              <p>45 <span className='text-sm bg-green-200 text-green-600 py-1 px-2 rounded-full'>Good</span></p>
            </div>
            <div className='flex justify-between'>
              <p>PM2.5</p>
              <p>12.2 µg/m³</p>
            </div>
            <div className='flex justify-between'>
              <p>PM10</p>
              <p>30.2 µg/m³</p>
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
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Community Organization</h3>
            <div className='grid grid-cols-2 gap-6'>
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold mb-4'>Government</h3>
            <div className='grid grid-cols-2 gap-6'>
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
              <RecommendationCard title="Plant Native Trees" priority="High" description="Plant native oak and maple trees in the 12% empty land areas to improve air quality and biodiversity" />
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