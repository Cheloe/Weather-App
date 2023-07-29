var cityContainerEl = document.getElementById('cities-container');
var searchBtnEl = document.
getElementById('search-btn');
var searchFieldEl = document.getElementById('search-field')
var searchHistoryEl= document.getElementById('search-history');
var todaysContainerEl = document.getElementById('todays-forecast');
var fiveDayContainerEl = document.getElementById('five-day-forecast');
var cityNameEl= document.getElementById('city-name');


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
        //console.log(data.list);
        forecast = data.list.filter(function(value, index, Arr) {
          return index % 8 == 0;
        });        
        displayTodaysForecast(location, forecast);
        for (let j=0; j < forecast.length; j++) {
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
  document.getElementById('cityName').textContent = city + " (" + now + ")";
  var forecastCityEl = document.createElement('h2');
  var iconEl = document.createElement('img');
  var humidityEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var tempEl = document.createElement('h5');
  var savedCityButtonEl = document.createElement('button');
  var savedCityButtonDiv = document.createElement('div');

  //apply class to elements
  savedCityButtonDiv.classList.add('d-grid', 'gap-2')
  savedCityButtonEl.classList.add('btn', 'btn-secondary', 'mb-2');
  savedCityButtonEl.setAttribute('type', 'button');
  iconEl.classList.add('w-25');

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
  searchHistoryEl.append(savedCityButtonDiv);
  todaysContainerEl.append(forecastCityEl);
  todaysContainerEl.append(iconEl);
  todaysContainerEl.append(tempEl);
  todaysContainerEl.append(humidityEl);
  todaysContainerEl.append(windEl);

  // check to see if city is already in local storage and if not, add it
  if (savedCitiesArray.includes(city)) {
    return;
  } else {
    savedCitiesArray.push(city);
    savedCityButtonDiv.append(savedCityButtonEl);
    localStorage.setItem("search history", JSON.stringify(savedCitiesArray));
  }
}

function displayFiveDayForecast(icon, temp, humidity, wind){
  
  var dayContainer = document.createElement('div');
  var iconEl = document.createElement('img');
  var humidityEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var tempEl = document.createElement('h5');

  dayContainer.classList.add("col", "card", "m-1");
  //console.log(icon);
  var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.setAttribute("src", iconUrl);
  humidityEl.textContent = humidity + " %";
  windEl.textContent= wind + " mph";
  tempEl.textContent = temp + " F";
  
  fiveDayContainerEl.append(dayContainer);
  dayContainer.append(tempEl);
  dayContainer.append(iconEl);
  dayContainer.append(humidityEl);
  dayContainer.append(windEl);
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
        //console.log(data[0]);
        var location = data[0].name;
        var lat = data[0].lat;
        var lon = data[0].lon;   
        
        fetchWeather(location, lat, lon);
      })
}

// This is the event listener for the search button
searchBtnEl.addEventListener('click', function(){
    var cityName = searchFieldEl.value.trim();
    clearForecast();
    console.log(cityName);
    fetchCoordinates(cityName);
    searchFieldEl.value = "";
});

// This clears the forecast when a new city is searched
function clearForecast() {
  todaysContainerEl.innerHTML = "";
  fiveDayContainerEl.innerHTML = "";
}

function displaySearchHistory() {
  var savedCities = JSON.parse(localStorage.getItem("search history"));
  if (savedCities) {
    savedCitiesArray = savedCities;
    for (let i=0; i < savedCities.length; i++) {
      var savedCityButtonEl = document.createElement('button');
      var savedCityButtonDiv = document.createElement('div');
      savedCityButtonDiv.classList.add('d-grid', 'gap-2')
      savedCityButtonEl.classList.add('btn', 'btn-secondary', 'mb-2');
      savedCityButtonEl.setAttribute('type', 'button');
      savedCityButtonEl.textContent = savedCities[i];
      savedCityButtonEl.setAttribute('data-cityName', savedCities[i]);
      searchHistoryEl.append(savedCityButtonDiv);
      savedCityButtonDiv.append(savedCityButtonEl);
    }
    //display the last searched city
    fetchCoordinates(savedCities[savedCities.length - 1]);
  }
}

      

function init() {
  // this will pull from local storage anything that needs to be pulled on refresh
  // add buttons for each city found in local storage
  displaySearchHistory();
}

// This is the event listener for the saved city buttons
searchHistoryEl.addEventListener('click', function(event){
  var cityName = event.target.getAttribute('data-cityName');
  clearForecast();
  fetchCoordinates(cityName);
});

//TODO:
// Add refresh state for when local storage has data
// Add logic for init
// Add ceiling for # buttons allowed in recent searches
// Finish making it pretty with bootstrap

init();