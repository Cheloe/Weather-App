var cityContainerEl = document.getElementById('cities-container');
var searchBtnEl = document.
getElementById('search-btn');
var searchFieldEl = document.getElementById('search-field')
var searchHistoryEl= document.getElementById('search-history');
var todaysContainerEl = document.getElementById('todays-forecast');
var fiveDayContainerEl = document.getElementById('five-day-forecast');

var apiKey = 'b7d4b53a4c12da243b0e55e69f915177';
var weatherApiUrl = 'https://api.openweathermap.org'



function fetchWeather(lat, lon) {
    var weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

    fetch(weatherUrl)
    
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var forecast = data
        console.log(forecast.list[1].weather[0])
        for (let i=0; i<5; i++) {
            // could just append the stuff right away rather than assigning variables ie 
            //descEl = document.createElement("p");
            //descEl.textContent = forecast.list[i].weather[0].description
            var weather = forecast.list[i].weather[0].description;
            var icon = forecast.list[i].weather[0].icon;
            var temp = forecast.list[i].main.temp;
            var humidity = forecast.list[i].main.humidity
            var wind = forecast.list[i].wind.speed
      }
      console.log(weather);
            console.log(icon);
            console.log(temp + " degrees");
            console.log(humidity + "%");
            console.log(wind + " mph");
        });      
};

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
        var location = data[0];
        var lat = location.lat;
        var lon = location.lon;   
        
        fetchWeather(lat, lon);
      })
}

searchBtnEl.addEventListener('click', function(){
    // var cityName = searchFieldEl.value.trim();
    var cityName = 'Atlanta';
    console.log(cityName);
    fetchCoordinates(cityName)
});
      
