import React, { useState, useEffect } from 'react'
import logo from '/logo/blackGreen.png'
import satelliteIpsum from '../assets/image/satellite-dum.jpeg'
import { MapPin, Building, TreePine, Square, Waves, Thermometer, Wind, Users, Droplets, Download, Factory, Home, Sprout, Trees, Wheat, Flower, Car, Mountain } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import RecommendationCard from '../components/RecommendationCard';
import { useLocation } from 'react-router';
import * as LucideIcons from "lucide-react";
import { useNavigate } from 'react-router';

function AnalysisResults() {
  const navigate = useNavigate();

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

  const [activeTab, setActiveTab] = useState('residents');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const tabList = [
    { id: 'residents', label: 'Residents' },
    { id: 'community_organizations', label: 'Community' },
    { id: 'government', label: 'Government' },
    { id: 'businesses', label: 'Businesses' }
  ];

  // Function to convert image to base64
  const imageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Function to generate and download the HTML report
  const generateHTMLReport = async () => {
    setIsGeneratingReport(true);

    try {
      // Convert satellite image to base64 for embedding
      const base64Image = await imageToBase64(inputData?.sat_image);

      // Create report content
      const reportContent = generateReportContent(base64Image);

      // Create blob and download
      const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Environmental_Analysis_Report_${inputData?.city || 'Location'}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating HTML report:', error);
      alert('Error generating HTML report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Function to generate and download the PDF report
  const generatePDFReport = async () => {
    setIsGeneratingReport(true);

    try {
      // Convert satellite image to base64 for embedding
      const base64Image = await imageToBase64(inputData?.sat_image);

      // Create report content
      const reportContent = generateReportContent(base64Image);

      // Create a temporary window to print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(reportContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      };
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Function to generate HTML report content
  const generateReportContent = (base64Image) => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Get all recommendations from all categories
    const allRecommendations = [];
    Object.keys(recommendations || {}).forEach(category => {
      const categoryLabel = tabList.find(tab => tab.id === category)?.label || category;
      (recommendations[category] || []).forEach(rec => {
        allRecommendations.push({
          ...rec,
          category: categoryLabel
        });
      });
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environmental Analysis Report - ${inputData?.city}, ${inputData?.country}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #22c55e;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #22c55e;
            margin: 0;
            font-size: 2.5rem;
        }
        .header p {
            color: #666;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #22c55e;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .location-overview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            align-items: start;
        }
        .location-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .info-item {
            padding: 15px;
            background: #f9fafb;
            border-radius: 6px;
        }
        .info-item strong {
            color: #374151;
        }
        .satellite-image {
            text-align: center;
        }
        .satellite-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .satellite-image p {
            margin-top: 10px;
            font-size: 0.9rem;
            color: #6b7280;
            font-style: italic;
        }
        .land-usage-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .land-usage-table th,
        .land-usage-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        .land-usage-table th {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .weather-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .weather-item {
            text-align: center;
            padding: 15px;
            background: #f0f9ff;
            border-radius: 6px;
        }
        .air-quality-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .air-quality-item {
            padding: 15px;
            background: #fef3c7;
            border-radius: 6px;
            text-align: center;
        }
        .aqi-good { background: #d1fae5; }
        .aqi-moderate { background: #fef3c7; }
        .aqi-unhealthy-for-sensitive { background: #fed7aa; }
        .aqi-unhealthy { background: #fecaca; }
        .aqi-hazardous { background: #ddd6fe; }
        .recommendations {
            margin-top: 20px;
        }
        .recommendation-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #22c55e;
            background: #f9fafb;
        }
        .recommendation-category {
            font-size: 0.9rem;
            color: #6b7280;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .recommendation-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        .recommendation-priority {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .priority-high { background: #fecaca; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #d97706; }
        .priority-low { background: #d1fae5; color: #059669; }
        .recommendation-description {
            color: #6b7280;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.9rem;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .section { break-inside: avoid; }
            .header h1 { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Environmental Analysis Report</h1>
        <p><strong>Location:</strong> ${inputData?.city}, ${inputData?.country}</p>
        <p><strong>Generated on:</strong> ${currentDate} at ${currentTime}</p>
    </div>

    <div class="section">
        <h2>Location Overview</h2>
        <div class="location-overview">
            <div class="location-info">
                <div class="info-item">
                    <strong>City:</strong><br>
                    ${inputData?.city}, ${inputData?.country}
                </div>
                <div class="info-item">
                    <strong>Coordinates:</strong><br>
                    ${inputData?.coordinates?.[0]?.toFixed(3)}°N, ${inputData?.coordinates?.[1]?.toFixed(3)}°W
                </div>
                <div class="info-item">
                    <strong>Area:</strong><br>
                    ${inputData?.area} km²
                </div>
            </div>
            <div class="satellite-image">
                ${base64Image ? `<img src="${base64Image}" alt="Satellite Image of ${inputData?.city}" />` : '<p>Satellite image not available</p>'}
                <p>Satellite imagery of the analyzed area</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Land Usage Breakdown</h2>
        <table class="land-usage-table">
            <thead>
                <tr>
                    <th>Land Type</th>
                    <th>Percentage</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                ${landCoverageData.map(item => `
                    <tr>
                        <td>${item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td>${item.value}%</td>
                        <td>${item.rawValue.toFixed(4)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Weather Conditions</h2>
        <div class="weather-grid">
            <div class="weather-item">
                <strong>Temperature</strong><br>
                ${inputData?.weather?.temperature}°C
            </div>
            <div class="weather-item">
                <strong>Humidity</strong><br>
                ${inputData?.weather?.humidity}%
            </div>
            <div class="weather-item">
                <strong>Wind Speed</strong><br>
                ${inputData?.weather?.wind_speed} m/s
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Air Quality Assessment</h2>
        <div class="air-quality-grid">
            <div class="air-quality-item aqi-${getAQIRating(inputData?.air_quality?.aqi).label.toLowerCase().replace(/\s+/g, '-')}">
                <strong>AQI</strong><br>
                ${getAQIRating(inputData?.air_quality?.aqi).label}
            </div>
            <div class="air-quality-item">
                <strong>PM2.5</strong><br>
                ${inputData?.air_quality?.pm25} µg/m³
            </div>
            <div class="air-quality-item">
                <strong>PM10</strong><br>
                ${inputData?.air_quality?.pm10} µg/m³
            </div>
            <div class="air-quality-item">
                <strong>CO</strong><br>
                ${inputData?.air_quality?.co} µg/m³
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Comprehensive Recommendations</h2>
        <div class="recommendations">
            ${allRecommendations.map(rec => `
                <div class="recommendation-item">
                    <div class="recommendation-category">${rec.category.toUpperCase()}</div>
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-priority priority-${rec.priority.toLowerCase()}">${rec.priority.toUpperCase()} PRIORITY</div>
                    <div class="recommendation-description">${rec.description}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="footer">
        <p>This report was generated using satellite imagery and environmental data analysis.</p>
        <p>Environmental Analysis Dashboard - Powered by AI and Satellite Technology</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <div className='flex flex-col w-full p-10 gap-12'>
      {/* Header */}
      <div className='flex w-full justify-between items-center'>
        <a className="size-8 flex space-x-3 items-center text-allBlack mb-4 md:mb-0" href='/'>
          <img src={logo} alt="Logo Image" className='size-9 object-center object-contain' />
          <span className="font-popSmBld text-xl">Envirolyst</span>
        </a>
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-4xl font-semibold'>Enviromental Analysis Dashboard</h1>
          <p className='text-sm text-gray-600'>Satellite imagery and API-powered insight for sustainable development</p>
        </div>
        <button onClick={() => navigate('/mapview')} className='bg-green-500 px-4 py-4 rounded-xl text-sm text-white cursor-pointer '>Analyze different area</button>
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
        <div className='flex flex-col gap-8 px-5 py-5'>
          <h2 className='text-3xl font-semibold text-green-600'>Recommendations</h2>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            {tabList.map(tab => (
              <button
                key={tab.id}
                className={`pb-2 px-3 text-sm font-medium border-b-2 ${activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-green-500'
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div>
            <h3 className='text-xl font-semibold mb-4'>{tabList.find(t => t.id === activeTab)?.label}</h3>
            <div className='grid grid-cols-2 gap-6'>
              {(recommendations[activeTab] || []).map((rec, index) => (
                <RecommendationCard
                  key={index}
                  icon={getIconComponent(rec.icon)}
                  title={rec.title}
                  priority={rec.priority}
                  description={rec.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-center gap-6 drop-shadow-lg p-5 rounded-lg border border-gray-200'>
        <button
          onClick={generateHTMLReport}
          disabled={isGeneratingReport}
          className='flex gap-2 text-white bg-green-500 py-3 px-4 rounded-lg cursor-pointer items-center hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Download />
          {isGeneratingReport ? 'Generating Report...' : 'Download HTML Report'}
        </button>
        <button
          onClick={generatePDFReport}
          disabled={isGeneratingReport}
          className='flex gap-2 text-white bg-red-500 py-3 px-4 rounded-lg cursor-pointer items-center hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Download />
          {isGeneratingReport ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
        <button onClick={() => navigate('/initiatives')} className='flex gap-2 text-green-400 border border-green-300 rounded-lg items-center py-3 px-4 cursor-pointer hover:bg-green-400 hover:text-white'>
          <Users />View Nearby Initiatives
        </button>
      </div>
    </div>
  )
}

export default AnalysisResults