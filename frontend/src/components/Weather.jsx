import React, { useState, useEffect } from 'react';
import axios from 'axios';

const convertToFahrenheit = (temp) => {
  return `${Math.trunc((temp - 273.15) * 1.8 + 32)}\u00B0F`;
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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = () => {
    setIsLoading(true);
    setError('');
    console.log('Attempting to get location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got location:', latitude, longitude);
        setLatitude(latitude);
        setLongitude(longitude);
      },
      async (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Falling back to IP-based location.');
        // Fallback to IP-based geolocation
        try {
          const response = await axios.get('https://ipapi.co/json/');
          const { latitude, longitude } = response.data;
          console.log('Fallback location:', latitude, longitude);
          setLatitude(latitude);
          setLongitude(longitude);
        } catch (ipError) {
          console.error('Error getting IP-based location:', ipError);
          setError('Unable to retrieve your location.');
          setIsLoading(false);
        }
      }
    );
  };

  const search = () => {
    setIsLoading(true);
    setError('');
    fetchCurrentWeather({ city });
  };

  const fetchCurrentWeather = async (params) => {
    try {
      console.log('Fetching current weather with params:', params);
      const response = await axios.get(`http://localhost:8000/api/weather/`, {
        params,
      });
      console.log('Current weather response:', response.data);
      setCurrentWeather(response.data);
      setLatitude(response.data.coord.lat);
      setLongitude(response.data.coord.lon);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      setError('Error fetching current weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      console.log('Fetching forecast for lat:', lat, 'lon:', lon);
      const response = await axios.get(`http://localhost:8000/api/forecast/`, {
        params: { lat, lon }
      });
      console.log('Forecast response:', response.data);
      setForecast(response.data.list);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setError('Error fetching forecast data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchCurrentWeather({ lat: latitude, lon: longitude });
      fetchForecast(latitude, longitude);
    }
  }, [latitude, longitude]);

  return (
    <div>
      <div id="loader" className="loader-container" style={{ display: isLoading ? 'block' : 'none' }}>
        <div className="loader"></div>
      </div>
      <div id="searcher">
        <button id="getLocationButton" onClick={getLocation}>Get My Location</button>
        <input type="text" id="cityName" onChange={(e) => setCity(e.target.value)} />
        <button id="search-button" onClick={search}>Search Weather</button>
      </div>
      {/* {error && <div className="error">{error}</div>} */}

      <div className='container'>
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

    </div>
  );
};

export default Weather;