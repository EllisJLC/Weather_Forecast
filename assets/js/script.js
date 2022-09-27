let api_key = "c04ed60909d66b558fcb4c66996ce63a"; // Save API key
let url; // declare url variable
let five_day = document.getElementById("weather-cards");

fetch (`http://api.openweathermap.org/geo/1.0/direct?q=toronto&limit=1&appid=${api_key}`) // Default load to Toronto
  .then((response) => response.json())
  .then((data) => {
    let lat = data[0].lat; // Obtain latitude of Toronto
    let lon = data[0].lon; // Obtain longitude of Toronto
    url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    fetch (url)
      .then ((response) => response.json())
      .then ((data) => {
        console.log(data);
        let currentWeather = document.getElementById("day-weather");
        let skies = data.list[0].weather[0].main; // gets main weather type
        let weatherIcon = weather_icon(skies);
        currentWeather.children[2].children[0].textContent = weatherIcon;
        currentWeather.children[2].children[1].textContent = `Currently ${Math.round(data.list[0].main.temp)-273}°C`; // Display current temperature
        currentWeather.children[2].children[2].textContent = `Feels like ${Math.round(data.list[0].main.feels_like)-273}°C`; // Display feels like temperature
        currentWeather.children[2].children[3].textContent = `Humidity: ${data.list[0].main.humidity}%`; // Set humidity
        let direction = set_direction(data.list[0].wind.deg); // Get wind direction
        currentWeather.children[2].children[4].textContent = `Wind Speeds: ${data.list[0].wind.speed}km/h ${direction}`; // Set wind speed and direction
      })
  });

fill_cards("toronto");


function fill_cards (location) {
  fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${api_key}`) // Default load to Toronto
  .then((response) => response.json())
  .then((data) => {
    let lat = data[0].lat; // Obtain latitude of Toronto
    let lon = data[0].lon; // Obtain longitude of Toronto
    url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    fetch (url)
    .then ((response) => response.json())
    .then ((data) => {
      for (i = 0; i<5; i++) {
        index = i*8;
        if (index === 40) {
          index--; // The returned array has a length of 40, therefore the last index is 39, not 40.
        }
        let card = document.getElementById("day-"+i); // use i for local positioning
        console.log(card)
        let icon = weather_icon(data.list[index].weather[0].main); // use index for data array
        console.log(data.list[index].weather[0].main)
        card.children[0].textContent = "date";
        card.children[1].textContent = icon;
        card.children[2].textContent = `Currently ${Math.round(data.list[index].main.temp)-273}°C`; // Display current temperature
        card.children[3].textContent = `Feels like ${Math.round(data.list[index].main.feels_like)-273}°C`; // Display feels like temperature
        card.children[4].textContent = `Humidity: ${data.list[index].main.humidity}%`; // Set humidity
        let direction = set_direction(data.list[index].wind.deg); // Get wind direction
        card.children[5].textContent = `Wind Speeds: ${data.list[index].wind.speed}km/h ${direction}`; // Set wind information
      }
    });
  }
);
}



function set_direction (direction) {
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

