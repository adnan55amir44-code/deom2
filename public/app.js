const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");
const speakButton = document.getElementById("speakButton");
const stopButton = document.getElementById("stopButton");

let currentWeather = null;

async function loadWeather(city) {
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  hideError();
  weatherCard.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    currentWeather = result.weather;
    displayWeather(currentWeather);
  } catch (error) {
    console.error(error);
    showError(error.message || "Unable to get weather.");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayWeather(weather) {
  document.getElementById("locationName").textContent = weather.city;
  document.getElementById("locationRegion").textContent =
    `${weather.region ? weather.region + ", " : ""}${weather.country}`;
  document.getElementById("temperature").textContent = weather.temperatureC;
  document.getElementById("feelsLike").textContent = `${weather.feelsLikeC}°C`;
  document.getElementById("humidity").textContent = `${weather.humidity}%`;
  document.getElementById("wind").textContent = `${weather.windKmph} km/h`;
  document.getElementById("visibility").textContent = `${weather.visibilityKm} km`;
  document.getElementById("uv").textContent = weather.uvIndex;
  document.getElementById("pressure").textContent = `${weather.pressureMb} mb`;
  document.getElementById("description").textContent = weather.description;
  document.getElementById("weatherIcon").textContent = getWeatherEmoji(weather.description);
  weatherCard.classList.remove("hidden");
}

function getWeatherEmoji(description) {
  const text = description.toLowerCase();

  if (text.includes("thunder")) return "⛈️";
  if (text.includes("rain") || text.includes("drizzle")) return "🌧️";
  if (text.includes("snow")) return "❄️";
  if (text.includes("cloud") || text.includes("overcast")) return "☁️";
  if (text.includes("mist") || text.includes("fog")) return "🌫️";
  if (text.includes("clear") || text.includes("sun")) return "☀️";
  return "🌤️";
}

function speakWeather() {
  if (!currentWeather) return;

  if (!("speechSynthesis" in window)) {
    showError("Your browser does not support Text-to-Speech.");
    return;
  }

  window.speechSynthesis.cancel();

  const weather = currentWeather;
  const text = `
    Current weather in ${weather.city}, ${weather.country}.
    Temperature is ${weather.temperatureC} degrees Celsius.
    It feels like ${weather.feelsLikeC} degrees.
    Current condition: ${weather.description}.
    Humidity is ${weather.humidity} percent.
    Wind speed is ${weather.windKmph} kilometers per hour.
    Visibility is ${weather.visibilityKm} kilometers.
    UV index is ${weather.uvIndex}.
  `;

  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 0.95;
  speech.pitch = 1;
  speech.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(voice => voice.lang.startsWith("en"));

  if (englishVoice) speech.voice = englishVoice;

  window.speechSynthesis.speak(speech);
}

function stopVoice() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function useMyLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by this browser.");
    return;
  }

  loading.classList.remove("hidden");

  navigator.geolocation.getCurrentPosition(
    async position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { headers: { "Accept": "application/json" } }
        );

        const data = await response.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.county;

        if (!city) {
          throw new Error("Could not determine your city.");
        }

        cityInput.value = city;
        await loadWeather(city);
      } catch (error) {
        showError(error.message);
      } finally {
        loading.classList.add("hidden");
      }
    },
    () => {
      loading.classList.add("hidden");
      showError("Location permission was denied or unavailable.");
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

function showError(message) {
  errorText.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

searchButton.addEventListener("click", () => {
  loadWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    loadWeather(cityInput.value.trim());
  }
});

locationButton.addEventListener("click", useMyLocation);
speakButton.addEventListener("click", speakWeather);
stopButton.addEventListener("click", stopVoice);

loadWeather("Karachi");
