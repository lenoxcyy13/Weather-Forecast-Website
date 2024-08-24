import React, { useCallback } from 'react';
import axios from 'axios';

const convertToFahrenheit = (temp) => {
  return Math.trunc((temp - 273.15) * 1.8 + 32) + "°F";
};

const createWeatherBlock = (data) => {
  const cityName = data.name;
  const icon = data.weather[0].icon;
  const temp = convertToFahrenheit(data.main.temp);
  const disc = data.weather[0].description;
  const newDiv = document.createElement('div');
  newDiv.className = 'weather';
  const cityEle = document.createElement('div');
  cityEle.className = 'city';
  cityEle.innerHTML = cityName;
  const tempEle = document.createElement('div');
  tempEle.className = 'temp';
  tempEle.innerHTML = temp;
  const imgEle = document.createElement('img');
  imgEle.className = 'icon';
  imgEle.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const discEle = document.createElement('div');
  discEle.className = 'disc';
  discEle.innerHTML = disc;
  const timeEle = document.createElement('div');
  timeEle.className = 'time';
  timeEle.innerHTML = 'Current Time';
  newDiv.appendChild(cityEle);
  newDiv.appendChild(tempEle);
  newDiv.appendChild(imgEle);
  newDiv.appendChild(discEle);
  newDiv.appendChild(timeEle);
  return newDiv;
};

const createForcastBlock = (data, i) => {
  const cityName = data.city.name;
  const icon = data.list[i].weather[0].icon;
  const temp = convertToFahrenheit(data.list[i].main.temp);
  const disc = data.list[i].weather[0].description;
  const time = data.list[i].dt_txt;
  const newDiv = document.createElement('div');
  newDiv.className = 'weather';
  const cityEle = document.createElement('div');
  cityEle.className = 'city';
  cityEle.innerHTML = cityName;
  const tempEle = document.createElement('div');
  tempEle.className = 'temp';
  tempEle.innerHTML = temp;
  const imgEle = document.createElement('img');
  imgEle.className = 'icon';
  imgEle.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const discEle = document.createElement('div');
  discEle.className = 'disc';
  discEle.innerHTML = disc;
  const timeEle = document.createElement('div');
  timeEle.className = 'time';
  timeEle.innerHTML = time;
  newDiv.appendChild(cityEle);
  newDiv.appendChild(tempEle);
  newDiv.appendChild(imgEle);
  newDiv.appendChild(discEle);
  newDiv.appendChild(timeEle);
  return newDiv;
};

const Weather = () => {
  const getWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/weather/`, {
        params: { lat, lon }
      });
      displayData(response.data, true);
      const loader = document.getElementById('loader');
      loader.style.display = 'none';
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getForecastWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/forecast/`, {
        params: { lat, lon }
      });
      displayFor(response.data);
      const loader = document.getElementById('loader');
      loader.style.display = 'none';
    } catch (error) {
      console.error('Error fetching forecast weather data:', error);
    }
  };

  const getCityWeatherData = async (city) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/weather/`, {
        params: { city }
      });
      displayData(response.data);
      const loader = document.getElementById('loader');
      loader.style.display = 'none';
    } catch (error) {
      console.error('Error fetching city weather data:', error);
    }
  };

  const handleGetLocation = async () => {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    navigator.geolocation.getCurrentPosition(async (position) => {
      let { latitude, longitude } = position.coords;
      await getWeatherData(latitude, longitude);
      await getForecastWeatherData(latitude, longitude);
    });
  };

  const handleSearch = () => {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    const city = document.getElementById('cityName').value;
    getCityWeatherData(city);
  };

  const displayData = useCallback((data, current = false) => {
    let weatherBlocks;
    const newWeather = createWeatherBlock(data);
    if (current) {
      weatherBlocks = document.getElementById('for-weather');
    } else {
      weatherBlocks = document.getElementById('city-weather');
    }
    weatherBlocks.appendChild(newWeather);
  }, []);

  const displayFor = useCallback((data) => {
    const ForBlocks = document.getElementById("for-weather");
    for (let i = 0; i < 8; i++) {
      const newFor = createForcastBlock(data, i);
      ForBlocks.appendChild(newFor);
    }
  }, []);

  return (
    <div className="weather-outer">
      <div id="loader" className="loader-container">
        <div className="loader"></div>
      </div>
      <div id="searcher">
        <button id="getLocationButton" onClick={handleGetLocation}>Get My Location</button>
        <input type="text" id="cityName" />
        <button id="search-button" onClick={handleSearch}>Search Weather</button>
      </div>
      <div id="weather-blocks">
        <div className="container">
          <div id="for-weather"></div>
        </div>
        <div className="container">
          <div id="city-weather"></div>
        </div>
      </div>
    </div>
  );
};

export default Weather;