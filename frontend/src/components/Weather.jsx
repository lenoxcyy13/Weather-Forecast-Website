import React, { useState, useEffect } from 'react';
import axios from 'axios';

const convertToFahrenheit = (temp) => {
  return `${Math.trunc((temp - 273.15) * 1.8 + 32)}°F`;
};

const WeatherBlock = ({ cityName, icon, temp, description, time }) => (
  <div className="weather">
    <div className="city">{cityName}</div>
    <div className="temp">{temp}</div>
    <img className="icon" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
    <div className="disc">{description}</div>
    <div className="time">{time}</div>
  </div>
);

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1);
  const [city, setCity] = useState('');

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      fetchCurrentWeather({ lat: latitude, lon: longitude });
    }
    );
  };

  const search = () => {
    fetchCurrentWeather({ city });
  };

  const fetchCurrentWeather = async (params) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/weather/`, {
        params,
      });
      setCurrentWeather(response.data);
      setLatitude(response.data.coord.lat);
      setLongitude(response.data.coord.lon);
    } catch (error) {
      console.error('Error fetching current weather:', error);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/forecast/`, {
        params: { lat, lon }
      });
      setForecast(response.data.list);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  useEffect(() => {
    if (latitude !== -1 && longitude !== -1) {
      fetchForecast(latitude, longitude);
    }
  }, [latitude, longitude]);


  return (
    <div>
      <div id="searcher">
        <button id="getLocationButton" onClick={getLocation}>Get My Location</button>
        <input type="text" id="cityName" onChange={(e) => setCity(e.target.value)} />
        <button id="search-button" onClick={search}>Search Weather</button>
      </div>
      {currentWeather && (
        <>
          <WeatherBlock
            cityName={currentWeather.name}
            icon={currentWeather.weather[0].icon}
            temp={convertToFahrenheit(currentWeather.main.temp)}
            description={currentWeather.weather[0].description}
            time="Current Time"
          />
          {forecast.slice(0, 8).map((data, i) => (
            <WeatherBlock
              key={i}
              cityName={currentWeather.name}
              icon={data.weather[0].icon}
              temp={convertToFahrenheit(data.main.temp)}
              description={data.weather[0].description}
              time={data.dt_txt}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Weather;
