import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Droplets,
  Wind,
  Gauge,
  Sun,
  Thermometer,
  MapPin,
  Calendar,
} from "lucide-react";

const DetailItem = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    className="glassmorphism glassmorphism-hover rounded-2xl p-4 flex items-center gap-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{
      scale: 1.05,
      y: -5,
    }}
  >
    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
      <Icon className="w-5 h-5 text-blue-300" />
    </div>
    <div className="flex-1">
      <p className="text-white/70 text-sm">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  </motion.div>
);

const AnimatedText = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
  >
    {children}
  </motion.div>
);

export const WeatherCard = ({ weatherData, unit }) => {
  const getUnitSymbol = () => (unit === "metric" ? "°C" : "°F");
  const getWindUnit = () => (unit === "metric" ? "m/s" : "mph");

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const details = [
    {
      icon: Eye,
      label: "Feels like",
      value: `${Math.round(weatherData.main.feels_like)}${getUnitSymbol()}`,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${weatherData.main.humidity}%`,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${weatherData.wind.speed} ${getWindUnit()}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${weatherData.main.pressure} hPa`,
    },
    {
      icon: Sun,
      label: "UV Index",
      value: "N/A",
    },
    {
      icon: Thermometer,
      label: "Visibility",
      value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
    },
  ];

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-8 mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <AnimatedText delay={0.5}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-300" />
              <h2 className="text-3xl font-bold text-white">
                {weatherData.name}
              </h2>
              <span className="text-white/70 text-xl">
                {weatherData.sys.country}
              </span>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.7}>
            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">{formatDateTime(new Date())}</p>
            </div>
          </AnimatedText>
        </div>

        <div className="flex items-center gap-6">
          <AnimatedText delay={0.6}>
            <motion.img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}
              className="w-24 h-24"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </AnimatedText>

          <div className="text-right">
            <AnimatedText delay={0.8}>
              <motion.div
                className="text-6xl font-bold text-gradient"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                {Math.round(weatherData.main.temp)}°
              </motion.div>
            </AnimatedText>

            <AnimatedText delay={1.0}>
              <h3 className="text-xl font-semibold text-white capitalize mb-1">
                {weatherData.weather[0].main}
              </h3>
              <p className="text-white/70 capitalize">
                {weatherData.weather[0].description}
              </p>
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((detail, index) => (
          <DetailItem
            key={detail.label}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
            delay={1.2 + index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};
