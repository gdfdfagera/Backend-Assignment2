const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const countries = require("i18n-iso-countries");
const newsLanguage = 'en';
const PORT = 3000;

const app = express();

const OPEN_WEATHER_API_KEY = '65c9fec7eae7d186800771c006793ad0';
const newsApiKey = 'a09568439b1a4e32b631c1833f24720e';

app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

app.post('/weather', async (req, res) => {
  try {
      let { city, country } = req.body;
      const countryCode = getCountryCode(country).toLowerCase();
      let weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${OPEN_WEATHER_API_KEY}`
      );
      const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApiKey}&language=${newsLanguage}`);
      const newsData = newsResponse.data;

      let weatherData = {
          temperature: kelvinToCelsius(weatherResponse.data.main.temp),
          description: weatherResponse.data.weather[0].description,
          icon: weatherResponse.data.weather[0].icon,
          coordinates: {
              latitude: weatherResponse.data.coord.lat,
              longitude: weatherResponse.data.coord.lon,
          },
          feelsLike: kelvinToCelsius(weatherResponse.data.main.feels_like),
          humidity: weatherResponse.data.main.humidity,
          pressure: weatherResponse.data.main.pressure,
          windSpeed: weatherResponse.data.wind.speed,
          countryCode: weatherResponse.data.sys.country,
          rainVolume: weatherResponse.data.rain ? weatherResponse.data.rain['1h'] : 0,
      };

      console.log(weatherData);
      console.log(newsData);

      res.json({weatherData, newsData});
  } catch (error) {
      console.error('Error fetching weather data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

function getCountryCode(countryName) {
  const countryCode = countries.getAlpha2Code(countryName, "en");
  return countryCode || "Не найден";
}

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
});

function kelvinToCelsius(kelvin) {
    return Math.floor(kelvin - 273.15);
}