document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather');
    const resultContainer = document.getElementById('weather-data');
    const city_time = document.getElementsByClassName('city_time')[0];
    const temperature = document.getElementsByClassName('temperature')[0];
    const wind = document.getElementsByClassName('card_wind')[0];
    const countryCode = document.getElementsByClassName('card_countryCode')[0];
    const volume = document.getElementsByClassName('card_volume')[0];
    const humanity = document.getElementsByClassName('card_humanity')[0];
    const pressure = document.getElementsByClassName('card_pressure')[0];
    const weather_card = document.getElementsByClassName('weather_card')[0];
    const container = document.getElementById('news');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      let city = document.getElementById('city').value;
      let country = document.getElementById('country').value;
      var imagePath = '/public/image/';
  
      try {
        let response = await axios.post(`/weather`, { city, country });
        let data = response.data.weatherData;
        let datanews = response.data.newsData.articles;
        console.log(data);
        var imageUrl = imagePath + data.icon + '@2x.png';
        

        city_time.innerHTML = `
            <div>
                <h2>${city}</h2>
            </div>
        `;

        temperature.innerHTML = `
            <div class="Celci">
                <h3>${data.temperature} °C</h3>
            </div>
            <div class="description">
                ${data.description}
            </div>
            <div class="icon">

            </div>
            <div class="feels">
                Feels like ${data.feelsLike} °C
            </div>
        `;

        wind.innerHTML = `
            <div class="wind">
                <b>Wind</b> <br>${data.windSpeed} m/s
            </div>
        `;

        humanity.innerHTML = `
            <div class="humanity">
                <b>Humidity</b> <br>${data.humidity} %
            </div>
        `;

        volume.innerHTML = `
            <div class="volume">
                <b>Rain volume</b> <br>${data.rainVolume} mm
            </div>
        `;

        pressure.innerHTML = `
            <div class="pressure"><b>Pressure</b> <br> ${data.pressure} hPa</div>
        `;

        countryCode.innerHTML = `
            <div class="countryCode"><b>Country Code</b> <br>${data.countryCode}</div>
        `;
        
        const imageContainer = document.getElementById('imageContainer');
        var img = imageContainer.querySelector('img');
        if (img) {
          img.src = imageUrl;
        } else {
          img = new Image();
          img.src = imageUrl;
          img.onerror = function () {
              console.error('Изображение не найдено');
          };
          imageContainer.appendChild(img);
        }

        img.onerror = function() {
          console.error('Изображение не найдено');
        };

        weather_card.setAttribute('style', 'display: block;')

        google.maps.event.addDomListener(window, 'load', init(data.coordinates.latitude, data.coordinates.longitude));

         
        const newsList = document.createElement('div');
        newsList.setAttribute('class', 'newsList');
        newsList.innerHTML = '<h2>News</h2>';
        datanews.forEach(article => {
            if (article.description == null){
                return;
            }
            const newsItem = document.createElement('div');
            newsItem.setAttribute('class', 'newsItem');
            newsItem.innerHTML = `<h3 style="text-align: center">${article.title}</h3>
                                <p>${article.description}</p>
                                <a href="${article.url}" target="_blank" style="text-align: center; color: black; text-decoration: none;">Read more</a>`;
            newsList.appendChild(newsItem);
        });
        container.appendChild(newsList);
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
        resultContainer.innerHTML = '<p>Error fetching weather data</p>';
      }
    });
});



function init(lat, lng) {
    let mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(lat, lng),
        styles: [{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#878787"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f9f5ed"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"color":"#f5f5f5"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#aee0f4"}]}]
    };

    let mapElement = document.getElementById('map');

    let map = new google.maps.Map(mapElement, mapOptions);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: 'Snazzy!'
    });
}