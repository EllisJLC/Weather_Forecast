let api_key = "c04ed60909d66b558fcb4c66996ce63a"; // Save API key
let url; // declare url variable
let five_day = document.getElementById("weather-cards");
let search = document.getElementById("search");
let cityName = document.getElementById("city");
let saveCity = document.getElementById("save");
let navigate = document.querySelector(".navbar");
let week = ["Sun","Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]; // Days of the week array
let cityDefault = "Toronto";
let citySearch;
let searchedCity;
document.getElementById("date").innerHTML = moment().format("dddd, MMMM Do, YYYY");

load_tabs();
fill_main(cityDefault);

search.addEventListener("click", (e) => { // Search for city
  e.preventDefault();
  citySearch = document.getElementById("search-text");
  searchedCity = citySearch.value; 
  citySearch.value = ""; // Empty search text
  fill_main(searchedCity); // Get data on aforementioned city
})

saveCity.addEventListener("click", (e) => { // Save cities
    if (searchedCity){
      e.preventDefault();
      city = searchedCity; 
      if (localStorage.getItem("saved-2")) { // Overwrite oldest item saved
        localStorage.setItem("saved-2",localStorage.getItem("saved-1"));
        localStorage.setItem("saved-1",localStorage.getItem("saved-0"));
        localStorage.setItem("saved-0",city);
      } else if (localStorage.getItem("saved-1")) {
        localStorage.setItem("saved-2",city);
      } else if (localStorage.getItem("saved-0")) {
        localStorage.setItem("saved-1",city);
      } else {
        localStorage.setItem("saved-0",city);
      }
      load_tabs();
    } else {
    alert ("Please search a city first!");
  }
});

navigate.addEventListener("click", (e) => { // Set event listner for navbar option selection
  e.preventDefault();
  if (e.target.tagName === "A"){
    let citySelect = e.target.textContent;
    fill_main(citySelect);
  }
});

function load_tabs() { // Load tabs if local storage is not empty
  let navtabs = document.querySelector(".nav-item");
  if (localStorage.getItem("saved-0")) {
    navtabs.children[1].innerHTML = localStorage.getItem("saved-0");
  } 
  if (localStorage.getItem("saved-1")) {
    navtabs.children[2].innerHTML = localStorage.getItem("saved-1");
  } 
  if (localStorage.getItem("saved-2")) {
    navtabs.children[3].innerHTML = localStorage.getItem("saved-2");
  }
}

function fill_main (city) {
  fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`) // Search load
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data.cod < 299) {
        cityName.innerHTML = city;
        let currentWeather = document.getElementById("day-weather");
        let skies = data.weather[0].main; // gets main weather type
        let weatherIcon = weather_icon(skies);
        currentWeather.children[3].children[0].textContent = weatherIcon; // Display relevant weather icon
        currentWeather.children[3].children[1].textContent = `Currently ${Math.round(data.main.temp)-273}°C`; // Display current temperature
        currentWeather.children[3].children[2].textContent = `Feels like ${Math.round(data.main.feels_like)-273}°C`; // Display feels like temperature
        currentWeather.children[3].children[3].textContent = `Humidity: ${data.main.humidity}%`; // Set humidity
        let direction = set_direction(data.wind.deg); // Get wind direction
        currentWeather.children[3].children[4].textContent = `Wind Speed: ${data.wind.speed}km/h ${direction}`; // Set wind speed and direction;
        fill_cards(city);
      } else {
      alert("City is invalid! Try again!");
      document.getElementById("search-text").value = "";
      }
  });
}

function fill_cards (location) {
    fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api_key}`)
    .then ((response) => response.json())
    .then ((data) => {
      for (i = 0; i<5; i++) {
        // Set days of the week
        if (i===0) {
          document.getElementById(`weekday-${i}`).innerHTML = "Today";
        } else if (i === 1) {
          document.getElementById(`weekday-${i}`).innerHTML = "Tmrw";
        } else {
          document.getElementById(`weekday-${i}`).innerHTML = week [Number(moment().format("E")) + i];
        }
        // Set index numbering for next days
        index = i*8;
        if (index === 40) {
          index--; // The returned array has a length of 40, therefore the last index is 39, not 40.
        }
        let card = document.getElementById("day-"+i); // use i for local positioning
        let icon = weather_icon(data.list[index].weather[0].main); // use index for data array
        document.getElementById(`icon-${i}`).innerHTML = icon;
        card.children[0].textContent = `High ${Math.round(data.list[index].main.temp)-273}°C`; // Display current temperature
        card.children[1].textContent = `Feels like ${Math.round(data.list[index].main.feels_like)-273}°C`; // Display feels like temperature
        card.children[2].textContent = `Humidity: ${data.list[index].main.humidity}%`; // Set humidity
        let direction = set_direction(data.list[index].wind.deg); // Get wind direction
        card.children[3].textContent = `Wind Speed: ${data.list[index].wind.speed}km/h ${direction}`; // Set wind information
      }
    });
  }

function set_direction (direction) { // Set wind direction
  if (direction === 45) {
    direction = "NE";
  } else if (direction === 135) {
    direction = "SE";
  } else if (direction === 225) {
    direction = "SW";
  } else if (direction === 315) {
    direction = "NW";
  } else if (direction < 45 || direction > 315) {
    direction = "N";
  } else if (direction > 45 || direction < 135) {
    direction = "E";
  } else if (direction > 135 || direction < 225) {
    direction = "S";
  } else {
    direction = "W";
  }
  return direction;
}

function weather_icon (skies) {
  if (skies === "Rain") { // Checks and sets icons
    return "🌧"; // Set icon to rain
  } else if (skies === "Clouds") {
    return "☁"; // Set icon to cloudy
  } else if (skies === "Snow") {
    return "⛇"; // Set icon to snowy
  } else if (skies === "Fog") {
    return "🌫"; // Set icon to foggy
  } else if (skies === "Clear") {
    return "☼"; // Set icon to sunny
  } else if (skies === "Storm") {
    return "🌩"; // Set icon to stormy
  }
}