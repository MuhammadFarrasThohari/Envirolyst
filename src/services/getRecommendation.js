import axios  from "axios";

export const getRecommendation = async (data) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY

  const prompt=`
    You are an environmental AI assistant tasked with analyzing urban data to provide actionable recommendations for improving green spaces and reducing pollution. The input data includes satellite imagery analysis (land usage breakdown), weather data, and air quality data for a specific city area. Your goal is to generate practical, context-specific recommendations for three stakeholder groups: (1) individual residents, (2) local government, and (3) community organizations. Recommendations should address increasing green spaces (e.g., planting trees, urban gardens) and reducing pollution (e.g., public transport use, policy changes). Ensure suggestions are feasible, tailored to the provided data, and suitable for a general audience. Avoid overly technical jargon.

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
      - Air Quality Index (AQI): ${data.air_quality.aqi} (scale: 0-50 good, 51-100 moderate, 101-150 unhealthy for sensitive groups, 151+ unhealthy)
      - PM2.5: ${data.air_quality.pm25} μg/m³
      - PM10: ${data.air_quality.pm10} μg/m³
      - CO: ${data.air_quality.co} μg/m³

    Task:
    1. Analyze the data to assess the environmental health of the area.
    2. Provide 2-4 specific recommendations for each stakeholder (residents, government, community organizations).
    3. For each recommendation, include:
       - "icon": A Lucide React icon name (e.g., TreePine, Leaf, Recycle, Bus, Home, Building2, Users, Sprout, Wind, Droplets, Sun, Shield, Heart, Car, Bike, etc.) representing the action.
       - "title": A short title summarizing the recommendation (1-5 words).
       - "description": A 1-2 sentence description providing detailed guidance on implementing the recommendation, explaining why it's suitable given the data, and detailing the environmental benefits.
       - "priority": A number (high, medium, low) indicating the urgency or importance of the recommendation.
    4. Format the output as a JSON object with the following structure example:
    {
      "residents": [
        {
          "icon": "TreePine",
          "title": "Plant Native Trees",
          "description": "Plant native tropical trees in available residential spaces to increase green coverage, as the area is 95.3% urban residential with good air quality (AQI: 1) that should be maintained. This will enhance biodiversity, provide natural cooling, and help maintain the current low pollution levels.",
          "priority": "High"
        }
      ],
      "government": [
        {
          "icon": "Building2",
          "title": "Green Urban Planning",
          "description": "Implement mandatory green space requirements in new residential developments, leveraging the small irrigated land percentage (1.1%) as a model for sustainable urban expansion. This will prevent air quality degradation as urbanization continues and create climate-resilient neighborhoods.",
          "priority": "High"
        }
      ],
      "community_organizations": [
        {
          "icon": "Users",
          "title": "Community Gardens",
          "description": "Establish community gardens in underutilized residential areas, taking advantage of the tropical climate and current excellent air quality to create sustainable food systems. This will strengthen community bonds while maintaining environmental health and reducing urban heat islands.",
          "priority": "Medium"
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