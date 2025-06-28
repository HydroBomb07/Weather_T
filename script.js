
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
    this.initializeAnimations();
    this.createInteractiveEffects();
  }

  setupEventListeners() {
    // Enhanced enter key support with animation
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.animateSearch();
        this.getWeather();
      }
    });

    // Input focus animations
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('focus', () => {
      cityInput.parentElement.style.transform = 'scale(1.05)';
    });
    
    cityInput.addEventListener('blur', () => {
      cityInput.parentElement.style.transform = 'scale(1)';
    });

    // Unit toggle buttons with enhanced animations
    document.getElementById('celsiusBtn').addEventListener('click', () => {
      this.toggleUnit('metric');
    });

    document.getElementById('fahrenheitBtn').addEventListener('click', () => {
      this.toggleUnit('imperial');
    });

    // Search button with ripple effect
    document.querySelector('.search-btn').addEventListener('click', (e) => {
      this.createRippleEffect(e);
      this.animateSearch();
    });
  }

  initializeAnimations() {
    // Stagger animation for quick city buttons
    const cityButtons = document.querySelectorAll('.city-btn');
    cityButtons.forEach((btn, index) => {
      btn.style.setProperty('--delay', `${index * 0.1}s`);
      btn.style.animationDelay = `${index * 0.1}s`;
    });

    // Initialize typing effect for weather description
    this.setupTypingEffect();
  }

  createInteractiveEffects() {
    // Mouse move parallax effect
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.02;
        const x = mouseX * speed * 10;
        const y = mouseY * speed * 10;
        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    // Add floating particles effect
    this.createFloatingParticles();
  }

  createFloatingParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    
    setInterval(() => {
      if (Math.random() > 0.7) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
          particle.remove();
        }, 25000);
      }
    }, 3000);
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  animateSearch() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      searchBtn.style.transform = '';
    }, 150);
  }

  setupTypingEffect() {
    // This will be called when weather data is displayed
    this.typeWriterEffect = (element, text, speed = 50) => {
      element.innerHTML = '';
      element.style.borderRight = '2px solid white';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 1000);
        }
      };
      typeWriter();
    };
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
      
      // Add staggered animation delay
      setTimeout(() => {
        this.displayWeather(weatherData);
      }, 300);
      
      setTimeout(() => {
        this.displayForecast(forecastData);
      }, 600);
      
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

  // ... keep existing code (fetch methods remain the same)
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
    
    // Update DOM elements with enhanced animations
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('countryName').textContent = data.sys.country;
    document.getElementById('currentTime').textContent = this.formatDateTime(new Date());
    
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    
    // Use typing effect for weather main
    const weatherMainElement = document.getElementById('weatherMain');
    this.typeWriterEffect(weatherMainElement, data.weather[0].main);
    
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°${this.getUnitSymbol()}`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} ${this.getWindUnit()}`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // UV Index would require additional API call, showing placeholder
    document.getElementById('uvIndex').textContent = 'N/A';
    
    // Add staggered animation to detail items
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
      item.style.setProperty('--delay', `${index * 0.1}s`);
      item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Show weather card with animation
    document.getElementById('weatherResult').style.display = 'block';
  }

  displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    // Get daily forecasts (one per day for next 5 days)
    const dailyForecasts = this.processForecastData(data.list);
    
    dailyForecasts.forEach((forecast, index) => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.style.animationDelay = `${index * 0.1}s`;
      
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
      
      // Add hover effects
      forecastItem.addEventListener('mouseenter', () => {
        forecastItem.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      forecastItem.addEventListener('mouseleave', () => {
        forecastItem.style.transform = '';
      });
      
      forecastContainer.appendChild(forecastItem);
    });
    
    // Show forecast section
    document.getElementById('forecast').style.display = 'block';
  }

  // ... keep existing code (processForecastData method remains the same)
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
    
    // Update active button with animation
    const celsiusBtn = document.getElementById('celsiusBtn');
    const fahrenheitBtn = document.getElementById('fahrenheitBtn');
    
    celsiusBtn.classList.toggle('active', unit === 'metric');
    fahrenheitBtn.classList.toggle('active', unit === 'imperial');
    
    // Add scale animation to active button
    const activeBtn = unit === 'metric' ? celsiusBtn : fahrenheitBtn;
    activeBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      activeBtn.style.transform = '';
    }, 200);
    
    // Refresh data if available
    if (this.currentWeatherData) {
      const city = document.getElementById('cityInput').value;
      if (city) {
        this.getWeather();
      }
    }
  }

  // ... keep existing code (utility methods remain the same)
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
    this.animateSearch();
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
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'flex';
    errorElement.classList.add('shake');
    
    // Remove shake class after animation
    setTimeout(() => {
      errorElement.classList.remove('shake');
    }, 600);
    
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
