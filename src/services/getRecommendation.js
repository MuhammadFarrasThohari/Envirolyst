import axios  from "axios";

export const getRecommendation = async (data) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY

  const prompt = `
    You are an AI assistant tasked with analyzing urban data to provide actionable recommendations that help businesses in Indonesia grow responsibly and adapt to a fast-changing world, while improving green spaces and reducing pollution. The input data includes satellite imagery analysis (land usage breakdown), weather data, and air quality data for a specific city area. Your goal is to generate practical, context-specific recommendations for four stakeholder groups: (1) individual residents, (2) local government, (3) community organizations, and (4) businesses, focusing on efficiency, smarter decision-making, and resource management for businesses, alongside increasing green spaces and reducing pollution for all. Ensure suggestions are feasible, tailored to the provided data, suitable for a general audience, and promote long-term success without harming people or the planet. Avoid overly technical jargon.

    **IMPORTANT**: Return the response as a pure JSON string. Do not include markdown, code fences, explanations, or any text outside the JSON object. The response must be only the JSON object, starting with { and ending with }.

    Input Data:
    - City: ${data.city}
    - Country: ${data.country}
    - Coordinates: [${data.coordinates[0]}, ${data.coordinates[1]}]
    - Land Usage Classification (top 5 categories with confidence scores):
      1. ${data.land_coverage.top1.label}: ${(data.land_coverage.top1.score * 100).toFixed(1)}%
      2. ${data.land_coverage.top2.label}: ${(data.land_coverage.top2.score * 100).toFixed(1)}%
      3. ${data.land_coverage.top3.label}: ${(data.land_coverage.top3.score * 100).toFixed(1)}%
      4. ${data.land_coverage.top4.label}: ${(data.land_coverage.top4.score * 100).toFixed(1)}%
      5. ${data.land_coverage.top5.label}: ${(data.land_coverage.top5.score * 100).toFixed(1)}%
    - Weather:
      - Temperature: ${data.weather.temprature}°C
      - Humidity: ${data.weather.humidity}%
      - Wind Speed: ${data.weather.wind_speed} m/s
    - Air Quality:
      - Air Quality Index (AQI): ${data.air_quality.aqi} (scale: 1 good, 2 moderate, 3 unhealthy for sensitive groups, 4 unhealthy, 5 hazardous)
      - PM2.5: ${data.air_quality.pm25} μg/m³
      - PM10: ${data.air_quality.pm10} μg/m³
      - CO: ${data.air_quality.co} μg/m³

    Task:
    1. Analyze the data to assess the environmental health and business potential of the area.
    2. Provide 3-5 specific recommendations for each stakeholder (residents, government, community organizations, businesses).
    3. For each recommendation, include:
      - "icon": A Lucide React icon name (e.g., TreePine, Leaf, Recycle, Bus, Home, Building2, Users, Sprout, Wind, Droplets, Sun, Shield, Heart, Car, Bike) representing the action.
      - "title": A short title summarizing the recommendation (1-5 words).
      - "description": A 1-2 sentence description providing detailed guidance on implementing the recommendation, explaining why it's suitable given the data, and detailing the environmental and business benefits.
      - "priority": A number (high, medium, low) indicating the urgency or importance of the recommendation.
    4. Format the output as a JSON object with the following structure example:
    {
      "residents": [
        {
          "icon": "TreePine",
          "title": "Plant Native Trees",
          "description": "Plant native trees in residential yards, as the low vegetation (e.g., 10%) and high AQI (e.g., 120) suggest a need for green cover to improve air quality. This enhances local health and could support small urban gardening businesses.",
          "priority": "High"
        }
      ],
      "government": [
        {
          "icon": "Building2",
          "title": "Promote Green Zoning",
          "description": "Incorporate green zones in urban planning using the 15% empty land, as this supports sustainable growth amid rising pollution (e.g., PM2.5 80). This attracts eco-conscious businesses and boosts city resilience.",
          "priority": "High"
        }
      ],
      "community_organizations": [
        {
          "icon": "Users",
          "title": "Start Green Workshops",
          "description": "Organize workshops to teach sustainable practices using the tropical climate, as the high humidity (e.g., 85%) suits plant growth despite moderate AQI (e.g., 90). This fosters community skills and supports local green startups.",
          "priority": "Medium"
        }
      ],
      "businesses": [
        {
          "icon": "Leaf",
          "title": "Adopt Green Roofing",
          "description": "Install green roofs on commercial buildings using the 20% building coverage, as this reduces heat and pollution (e.g., PM10 60) in dense areas. This lowers energy costs and enhances business appeal to eco-aware customers.",
          "priority": "High"
        }
      ]
    }
  `;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        {role: "system", content: "You are an enviromental AI assistant"},
        {role: "user", content: prompt}
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )

  const recommendations = JSON.parse(response.data.choices[0].message.content);
  return recommendations
};