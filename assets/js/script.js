var cityContainerEl = document.getElementById('cities-container');
var searchBtnEl = document.
getElementById('search-btn');
var searchFieldEl = document.getElementById('search-field')
var searchHistoryEl= document.getElementById('search-history');
var todaysContainerEl = document.getElementById('todays-forecast');
var fiveDayContainerEl = document.getElementById('five-day-forecast');

var apiKey = 'b7d4b53a4c12da243b0e55e69f915177';
//var weatherApiUrl = 'https://api.openweathermap.org'



function fetchWeather(location, lat, lon) {
    var weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

    fetch(weatherUrl)
    
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.list);
        //to use weather API icons, would have to choose index of 4 or 8 depending on if it's day or night?
        var forecast = data.list.filter(function(value, index, Arr) {
          return index % 8 == 0;
        });
        //console.log(forecast);
        var city = location;
        for (let i=0; i < forecast.length; i++) {
            // could just append the stuff right away rather than assigning variables ie 
            //descEl = document.createElement("p");
            //descEl.textContent = forecast.list[i].weather[0].description
            // var weather = forecast.list[i].weather[0].description/img/wn/01n@2x.png;
            var icon = forecast[i].weather[0].icon;
            var temp = Math.trunc(forecast[i].main.temp);
            var humidity = forecast[i].main.humidity
            var wind = forecast[i].wind.speed
        }
       displayForecast(city, icon, temp, humidity, wind); 
    });      
};

function displayForecast(city, icon, temp, humidity, wind){
  var forecastCityEl = document.createElement('h2');
  var iconEl = document.createElement('img');
  var humidityEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var tempEl = document.createElement('h5');

  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.setAttribute("src", iconUrl);
  humidityEl.textContent = humidity + " %";
  windEl.textContent= wind + " mph";
  forecastCityEl.textContent = city;
  tempEl.textContent = temp + " F";
  
  todaysContainerEl.append(forecastCityEl);
  todaysContainerEl.append(tempEl);
  todaysContainerEl.append(iconEl);
  todaysContainerEl.append(humidityEl);
  todaysContainerEl.append(windEl);
}

function fetchCoordinates(cityName) {
    // Insert the API url to get a list of your repos
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=b7d4b53a4c12da243b0e55e69f915177`;
  
    fetch(requestUrl)
    
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //looping over the fetch response and inserting the URL of your repos into a list
        console.log(data[0]);
        var location = data[0].name;
        var lat = data[0].lat;
        var lon = data[0].lon;   
        
        fetchWeather(location, lat, lon);
      })
}

searchBtnEl.addEventListener('click', function(){
    var cityName = searchFieldEl.value.trim();
    //var cityName = 'Atlanta';
    console.log(cityName);
    fetchCoordinates(cityName)
});
      
