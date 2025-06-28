
// Weather Dashboard JavaScript
class WeatherDashboard {
  constructor() {
    this.apiKey = '575fcf489cce2ff7e3b873f8eca5c92c';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.currentUnit = 'metric';
    this.currentWeatherData = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.getUserLocation();
  }

  setupEventListeners() {
    // Enter key support for input
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.getWeather();
      }
    });

    // Unit toggle buttons
    document.getElementById('celsiusBtn').addEventListener('click', () => {
      this.toggleUnit('metric');
    });

    document.getElementById('fahrenheitBtn').addEventListener('click', () => {
      this.toggleUnit('imperial');
    });
  }

  async getUserLocation() {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        this.getWeatherByCoords(latitude, longitude);
      } catch (error) {
        console.log('Location access denied or unavailable');
      }
    }
  }

  async getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }

    try {
      this.showLoading();
      this.hideError();
      
      const weatherData = await this.fetchWeatherByCity(city);
      const forecastData = await this.fetchForecastByCity(city);
      
      this.displayWeather(weatherData);
      this.displayForecast(forecastData);
      
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  async getWeatherByCoords(lat, lon) {
    try {
      this.showLoading();
      
      const weatherData = await this.fetchWeatherByCoords(lat, lon);
      const forecastData = await this.fetchForecastByCoords(lat, lon);
      
      this.displayWeather(weatherData);
      this.displayForecast(forecastData);
      
      // Update input with city name
      document.getElementById('cityInput').value = weatherData.name;
      
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  async fetchWeatherByCity(city) {
    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.currentUnit}`;
    return this.fetchWeatherData(url);
  }

  async fetchWeatherByCoords(lat, lon) {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`;
    return this.fetchWeatherData(url);
  }

  async fetchForecastByCity(city) {
    const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.currentUnit}`;
    return this.fetchForecastData(url);
  }

  async fetchForecastByCoords(lat, lon) {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`;
    return this.fetchForecastData(url);
  }

  async fetchWeatherData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('API key invalid. Please check your configuration.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw new Error('Failed to fetch weather data. Please try again.');
      }
    }
    
    return response.json();
  }

  async fetchForecastData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    return response.json();
  }

  displayWeather(data) {
    this.currentWeatherData = data;
    
    // Update DOM elements
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('countryName').textContent = data.sys.country;
    document.getElementById('currentTime').textContent = this.formatDateTime(new Date());
    
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    
    document.getElementById('weatherMain').textContent = data.weather[0].main;
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°${this.getUnitSymbol()}`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} ${this.getWindUnit()}`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // UV Index would require additional API call, showing placeholder
    document.getElementById('uvIndex').textContent = 'N/A';
    
    // Show weather card
    document.getElementById('weatherResult').style.display = 'block';
  }

  displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    // Get daily forecasts (one per day for next 5 days)
    const dailyForecasts = this.processForecastData(data.list);
    
    dailyForecasts.forEach(forecast => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      
      forecastItem.innerHTML = `
        <div class="day">${forecast.day}</div>
        <div class="date">${forecast.date}</div>
        <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.description}">
        <div class="temps">
          <span class="high">${Math.round(forecast.temp_max)}°</span>
          <span class="low">${Math.round(forecast.temp_min)}°</span>
        </div>
        <div class="description">${forecast.description}</div>
      `;
      
      forecastContainer.appendChild(forecastItem);
    });
    
    // Show forecast section
    document.getElementById('forecast').style.display = 'block';
  }

  processForecastData(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      } else {
        dailyData[dateKey].temp_max = Math.max(dailyData[dateKey].temp_max, item.main.temp_max);
        dailyData[dateKey].temp_min = Math.min(dailyData[dateKey].temp_min, item.main.temp_min);
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  }

  toggleUnit(unit) {
    if (this.currentUnit === unit) return;
    
    this.currentUnit = unit;
    
    // Update active button
    document.getElementById('celsiusBtn').classList.toggle('active', unit === 'metric');
    document.getElementById('fahrenheitBtn').classList.toggle('active', unit === 'imperial');
    
    // Refresh data if available
    if (this.currentWeatherData) {
      const city = document.getElementById('cityInput').value;
      if (city) {
        this.getWeather();
      }
    }
  }

  getUnitSymbol() {
    return this.currentUnit === 'metric' ? 'C' : 'F';
  }

  getWindUnit() {
    return this.currentUnit === 'metric' ? 'm/s' : 'mph';
  }

  formatDateTime(date) {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  searchCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    this.getWeather();
  }

  showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherResult').style.display = 'none';
    document.getElementById('forecast').style.display = 'none';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').style.display = 'flex';
    document.getElementById('weatherResult').style.display = 'none';
    document.getElementById('forecast').style.display = 'none';
  }

  hideError() {
    document.getElementById('errorMessage').style.display = 'none';
  }
}

// Initialize the weather dashboard
const weatherDashboard = new WeatherDashboard();

// Global functions for HTML onclick events
function getWeather() {
  weatherDashboard.getWeather();
}

function searchCity(cityName) {
  weatherDashboard.searchCity(cityName);
}

// Set focus on input when page loads
window.addEventListener('load', () => {
  document.getElementById('cityInput').focus();
});
