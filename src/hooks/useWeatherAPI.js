import { useState, useCallback, useEffect } from "react";

const API_KEY = "575fcf489cce2ff7e3b873f8eca5c92c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const useWeatherAPI = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");

  const fetchWeatherByCity = useCallback(
    async (city) => {
      setLoading(true);
      setError(null);

      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`,
          ),
          fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`,
          ),
        ]);

        if (!weatherResponse.ok) {
          throw new Error(
            weatherResponse.status === 404
              ? "City not found"
              : "Failed to fetch weather data",
          );
        }

        const weather = await weatherResponse.json();
        const forecast = await forecastResponse.json();

        setWeatherData(weather);
        setForecastData(forecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [unit],
  );

  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      setLoading(true);
      setError(null);

      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`,
          ),
          fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`,
          ),
        ]);

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const weather = await weatherResponse.json();
        const forecast = await forecastResponse.json();

        setWeatherData(weather);
        setForecastData(forecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [unit],
  );

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  }, []);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          // Fallback to a default city
          fetchWeatherByCity("London");
        },
      );
    } else {
      fetchWeatherByCity("London");
    }
  }, [fetchWeatherByCoords, fetchWeatherByCity]);

  return {
    weatherData,
    forecastData,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    toggleUnit,
  };
};
