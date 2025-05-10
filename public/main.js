const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: crd.latitude, longitude: crd.longitude })
    })
        .then(res => res.json())
        .then(data => {
            const now = new Date();
            const currentHour = now.getHours();
            const jour = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
            document.getElementById('date').textContent = jour.charAt(0).toUpperCase() + jour.slice(1);
            document.getElementById('temp').textContent = Math.round(data.current.temperature) + "°";
            document.getElementById('wind').textContent = Math.round(data.current.wind) + " km/h";
            document.getElementById('humidity').textContent = Math.round(data.current.humidity) + " %";
            document.getElementById('icon').textContent = data.current.icon;
            document.getElementById('rain').textContent = Math.round(data.current.rain) + " %";

            const forecastList = document.getElementById('forecast-list');
            forecastList.innerHTML = '';
            for (let i = 1; i <= 6; i++) {
                const hourIndex = currentHour + i;
                if (hourIndex >= data.hourly.temperature_2m.length) break;
              
                const time = `${(currentHour + i).toString().padStart(2, '0')}h`;
                const temp = Math.round(data.hourly.temperature_2m[hourIndex]) + '°';
                const cloud = data.hourly.cloud_cover[hourIndex];
                const rain = data.hourly.rain[hourIndex];
              
                const isNight = (currentHour + i) >= 20 || (currentHour + i) <= 6;
              
                // Choix d'icône météo contextuelle
                let icon = "🌤️";
                if (rain > 0.2) {
                  icon = isNight ? "🌧️" : "🌦️";
                } else if (cloud > 80) {
                  icon = "☁️";
                } else if (cloud > 50) {
                  icon = isNight ? "🌙" : "⛅";
                } else {
                  icon = isNight ? "🌙" : "☀️";
                }
              
                const li = document.createElement('li');
                li.innerHTML = `
                  <h2>${time}</h2>
                  <h2 class="weather-icon">${icon}</h2>
                  <h3>${temp}</h3>
                `;
                forecastList.appendChild(li);
              }
        })
        .catch(err => console.error(err));
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

console.log('hi its working !');