import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useWeatherAPI } from "./hooks/useWeatherAPI";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Header } from "./components/Header";
import { SearchSection } from "./components/SearchSection";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastSection } from "./components/ForecastSection";
import { ErrorMessage } from "./components/ErrorMessage";

function App() {
  // Initialize cursor trail
  useCursorTrail();

  // Weather API hook
  const {
    weatherData,
    forecastData,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    toggleUnit,
  } = useWeatherAPI();

  // Page variants for smooth transitions
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen relative"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <Header unit={unit} onToggleUnit={toggleUnit} />

        <SearchSection onSearch={fetchWeatherByCity} loading={loading} />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <ErrorMessage
                message={error}
                onRetry={() => fetchWeatherByCity("London")}
              />
            </motion.div>
          )}

          {weatherData && !loading && !error && (
            <motion.div
              key="weather-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            >
              <WeatherCard weatherData={weatherData} unit={unit} />

              {forecastData && <ForecastSection forecastData={forecastData} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance optimization: Preload next potential images */}
      <div className="hidden">
        {weatherData && (
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt=""
            loading="lazy"
          />
        )}
      </div>
    </motion.div>
  );
}

export default App;
