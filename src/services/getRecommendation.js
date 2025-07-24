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
    - Land Coverage:
      - Vegetation: ${data.land_coverage.vegetation}% (indicating green spaces like parks, forests)
      - Buildings: ${data.land_coverage.buildings}% 
      - Roads: ${data.land_coverage.roads}% 
      - Empty Land: ${data.land_coverage.empty_land}% (indicating unused land)
      - Water Areas: ${data.land_coverage.water_areas}%
    - Weather:
      - Temperature: ${data.weather.temperature}°C
      - Humidity: ${data.weather.humidity}%
      - Wind Speed: ${data.weather.wind_speed} m/s
      - UV Index: ${data.weather.uv_index}
      - Season: ${data.weather.season}
    - Air Quality:
      - Air Quality Index (AQI): ${data.air_quality.aqi} (scale: 0-50 good, 51-100 moderate, 101-150 unhealthy for sensitive groups, 151+ unhealthy)
      - PM2.5: ${data.air_quality.pm25} 
      - CO: ${data.air_quality.co} 

    Task:
    1. Analyze the data to assess the environmental health of the area.
    2. Provide 2-4 specific recommendations for each stakeholder (residents, government, community organizations).
    3. For each recommendation, include:
       - "icon": A Font Awesome class (e.g., fa-regular fa-tree, fa-solid fa-leaf) representing the action.
       - "title": A short title summarizing the recommendation (1-5 words).
       - "description": A 1-2 sentence description providing detailed guidance on implementing the recommendation, explaining why it's suitable given the data, and detailing the environmental benefits.
       - "priority": A number (high, medium, low) indicating the urgency or importance of the recommendation.
    4. Format the output as a JSON object with the following structure example:
    {
      "residents": [
        {
          "icon": "fa-regular fa-tree",
          "title": "Plant Native Trees",
          "description": "Plant native oak and maple trees in the empty land areas with good sunlight for optimal growth, as the low 18% vegetation and high AQI of 152 indicate a need for green spaces to improve air quality. This will enhance biodiversity and reduce urban heat, benefiting public health.",
          "priority": "High"
        },
        ...
      ],
      "government": [
        {
          "icon": "fa-solid fa-city",
          "title": "Develop Green Spaces",
          "description": "Implement urban parks in the 15% underutilized land with community input, as the 18% vegetation and high PM2.5 of 76 suggest a need to address pollution and heat. This will improve air quality and provide recreational benefits for residents.",
          "priority": "High"
        },
        ...
      ],
      "community_organizations": [
        {
          "icon": "fa-solid fa-hands-holding",
          "title": "Organize Clean-Ups",
          "description": "Organize clean-up events in the 15% empty land during cooler months, as high PM2.5 levels and the tropical wet season necessitate community action for cleaner spaces. This will reduce pollution and foster community engagement in sustainability.",
          "priority": "Medium"
        },
        ...
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