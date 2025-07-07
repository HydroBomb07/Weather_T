import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

const QuickCityButton = ({ city, onClick, delay }) => (
  <motion.button
    className="px-4 py-2 glassmorphism glassmorphism-hover rounded-full text-white/90 text-sm font-medium hover:text-white transition-all duration-300"
    onClick={() => onClick(city)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{
      scale: 1.05,
      y: -2,
    }}
    whileTap={{ scale: 0.95 }}
  >
    {city}
  </motion.button>
);

export const SearchSection = ({ onSearch, loading }) => {
  const [searchValue, setSearchValue] = useState("");

  const quickCities = [
    "Tokyo",
    "New York",
    "London",
    "Paris",
    "Dubai",
    "Sydney",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleQuickSearch = (city) => {
    setSearchValue(city);
    onSearch(city);
  };

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-8 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative flex">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for any city..."
                className="w-full px-6 py-4 pr-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                disabled={loading}
              />
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            </div>

            <motion.button
              type="submit"
              className="ml-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading || !searchValue.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
              {loading ? "Searching..." : "Search"}
            </motion.button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <motion.p
          className="text-white/80 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ✨ Quick Search
        </motion.p>

        <div className="flex flex-wrap gap-3">
          {quickCities.map((city, index) => (
            <QuickCityButton
              key={city}
              city={city}
              onClick={handleQuickSearch}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
