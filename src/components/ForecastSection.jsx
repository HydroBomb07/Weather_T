import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const ForecastCard = ({
  day,
  date,
  icon,
  tempMax,
  tempMin,
  description,
  index,
}) => (
  <motion.div
    className="glassmorphism glassmorphism-hover rounded-2xl p-6 text-center"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    whileHover={{
      scale: 1.05,
      y: -10,
    }}
  >
    <div className="mb-4">
      <h4 className="text-white font-semibold text-lg mb-1">{day}</h4>
      <p className="text-white/60 text-sm">{date}</p>
    </div>

    <motion.img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description}
      className="w-16 h-16 mx-auto mb-4"
      whileHover={{
        scale: 1.2,
        rotate: [0, -10, 10, 0],
      }}
      transition={{ duration: 0.5 }}
    />

    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-bold text-xl">
          {Math.round(tempMax)}°
        </span>
        <span className="text-white/60 text-lg">{Math.round(tempMin)}°</span>
      </div>

      <p className="text-white/70 text-sm capitalize leading-tight">
        {description}
      </p>
    </div>
  </motion.div>
);

export const ForecastSection = ({ forecastData }) => {
  const processForecastData = (forecastList) => {
    const dailyData = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        };
      } else {
        dailyData[dateKey].temp_max = Math.max(
          dailyData[dateKey].temp_max,
          item.main.temp_max,
        );
        dailyData[dateKey].temp_min = Math.min(
          dailyData[dateKey].temp_min,
          item.main.temp_min,
        );
      }
    });

    return Object.values(dailyData).slice(0, 5);
  };

  const dailyForecasts = processForecastData(forecastData.list);

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
          <Calendar className="w-6 h-6 text-blue-300" />
        </div>
        <h3 className="text-2xl font-bold text-gradient">5-Day Forecast</h3>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((forecast, index) => (
          <ForecastCard
            key={forecast.day + forecast.date}
            day={forecast.day}
            date={forecast.date}
            icon={forecast.icon}
            tempMax={forecast.temp_max}
            tempMin={forecast.temp_min}
            description={forecast.description}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};
