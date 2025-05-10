import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const url = `https://api.open-meteo.com/v1/forecast`


app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => {

    res.render('index.ejs');
});

app.post('/weather', async (req, res) => {
    const { latitude, longitude } = req.body;
  
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          hourly: 'temperature_2m,rain,cloud_cover,relative_humidity_2m,wind_speed_200m',
          models: 'meteofrance_seamless',
          timezone: 'auto',
          forecast_days: 1
        }
      });
  
      const data = response.data.hourly;
      const hour = new Date().getHours();
  
      const rain = data.rain[hour];
      const cloud = data.cloud_cover[hour];
  
      // 🌙 Détection jour/nuit
      const isNight = hour >= 20 || hour <= 6;
  
      // Choix de l’icône météo
      let icon = "🌤️";
      if (rain > 0.3) {
        icon = isNight ? "🌧️" : "🌦️";
      } else if (cloud > 80) {
        icon = isNight ? "☁️" : "☁️";
      } else if (cloud > 50) {
        icon = isNight ? "🌙" : "⛅";
      } else {
        icon = isNight ? "🌙" : "☀️";
      }
  
      res.json({
        current: {
          temperature: data.temperature_2m[hour],
          wind: data.wind_speed_200m[hour],
          humidity: data.relative_humidity_2m[hour],
          rain: rain,
          icon
        },
        hourly: {
          temperature_2m: data.temperature_2m,
          rain: data.rain,
          cloud_cover: data.cloud_cover
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur API météo' });
    }
  });
  

app.use((req, res) => {
    res.status(404).render('index.ejs');
});
app.listen(port, '0.0.0.0', () => { console.log(`listening on port ${port}`) });