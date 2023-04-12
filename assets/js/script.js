var cityContainerEl = document.getElementById('cities-container');
var searchBtnEl = document.
getElementById('search-btn');
var searchFieldEl = document.getElementById('search-field')
var searchHistoryEl= document.getElementById('search-history');
var todaysContainerEl = document.getElementById('todays-forecast');
var fiveDayContainerEl = document.getElementById('five-day-forecast');

var apiKey = 'b7d4b53a4c12da243b0e55e69f915177';
//var weatherApiUrl = 'https://api.openweathermap.org'
var now = dayjs().format("MMMM DD, YYYY");
var savedCitiesArray= [];
var storageArray = [];

console.log(now);

function fetchWeather(location, lat, lon) {
    var weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

    fetch(weatherUrl)
    
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.list);
        //to use weather API icons, would have to choose index of 4 or 8 depending on if it's day or night?
        forecast = data.list.filter(function(value, index, Arr) {
          return index % 8 == 0;
        });        
        displayTodaysForecast(location, forecast);
        for (let j=1; j < forecast.length; j++) {
            icon = forecast[j].weather[0].icon;
            temp = Math.trunc(forecast[j].main.temp);
            humidity = forecast[j].main.humidity
            wind = forecast[j].wind.speed
            displayFiveDayForecast(icon, temp, humidity, wind);
        }
    });      
};

function displayTodaysForecast(location, forecast){
  //get values from todays forecast
  var city = location;
  var icon = forecast[0].weather[0].icon;
  var temp = Math.trunc(forecast[0].main.temp);
  var humidity = forecast[0].main.humidity
  var wind = forecast[0].wind.speed;

  //create html elements for each item to be displayed
  var forecastCityEl = document.createElement('h2');
  var iconEl = document.createElement('img');
  var humidityEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var tempEl = document.createElement('h5');
  var savedCityButtonEl = document.createElement('button');
  

  //set html element content
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.setAttribute("src", iconUrl);
  humidityEl.textContent = humidity + " %";
  windEl.textContent= wind + " mph";
  forecastCityEl.textContent = city;
  tempEl.textContent = temp + " F";
  savedCityButtonEl.textContent = city;
  savedCityButtonEl.setAttribute('data-cityName', city);
  //add element to page
  searchHistoryEl.append(savedCityButtonEl);
  todaysContainerEl.append(forecastCityEl);
  todaysContainerEl.append(tempEl);
  todaysContainerEl.append(iconEl);
  todaysContainerEl.append(humidityEl);
  todaysContainerEl.append(windEl);


  //TODO: check to see if this city is in city array
  //add city to saved cities
  //savedCitiesArray.push(city);
  
  //add city/weather to storage
  var newStorageObject = {
    "city": city,
    "temp": temp,
    "iconUrl": iconUrl,
    "humidity": humidity,
    "wind": wind
  }
  console.log(newStorageObject);
  storageArray.push(newStorageObject);
  console.log(storageArray);
  localStorage.setItem("search history", JSON.stringify(storageArray));
}
function displayFiveDayForecast(icon, temp, humidity, wind){
  
  var iconEl = document.createElement('img');
  var humidityEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var tempEl = document.createElement('h5');

  console.log(icon);
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.setAttribute("src", iconUrl);
  humidityEl.textContent = humidity + " %";
  windEl.textContent= wind + " mph";
  tempEl.textContent = temp + " F";
  

  fiveDayContainerEl.append(tempEl);
  fiveDayContainerEl.append(iconEl);
  fiveDayContainerEl.append(humidityEl);
  fiveDayContainerEl.append(windEl);
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

// savedCityButtonEl.addEventListener('click', function(event) {
//   var cityName = event.target.getAttribute("dataset", "cityName");
//   fetchCoordinates(cityName);
// })

function init() {
  // this will pull from local storage anything that needs to be pulled on refresh
}


//TODO:
// Check if city is already in local storage, add if not
// Add event listeners to new city buttons
// Add refresh state for when local storage has data
// Add logic for init
// Add ceiling for # buttons allowed in recent searches