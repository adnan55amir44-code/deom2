const WEATHER_URL = "https://wttr.in";

export async function getWeather(city) {
  if (!city || typeof city !== "string") {
    throw new Error("City is required.");
  }

  const cleanCity = city.trim();

  if (!cleanCity) {
    throw new Error("City cannot be empty.");
  }

  const url = `${WEATHER_URL}/${encodeURIComponent(cleanCity)}?format=j1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "MCP-Weather-App/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Weather service returned ${response.status}`);
  }

  const data = await response.json();
  const current = data.current_condition?.[0];

  if (!current) {
    throw new Error("Weather data was not available.");
  }

  const location = data.nearest_area?.[0];

  return {
    city: location?.areaName?.[0]?.value || cleanCity,
    country: location?.country?.[0]?.value || "",
    region: location?.region?.[0]?.value || "",
    temperatureC: Number(current.temp_C),
    feelsLikeC: Number(current.FeelsLikeC),
    humidity: Number(current.humidity),
    windKmph: Number(current.windspeedKmph),
    visibilityKm: Number(current.visibility),
    pressureMb: Number(current.pressure),
    description: current.weatherDesc?.[0]?.value || "Unknown",
    observationTime: current.observation_time || "",
    uvIndex: Number(current.uvIndex || 0)
  };
}
