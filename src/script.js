let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let now = new Date();

let currentWeekday = weekDays[now.getDay()];
let headerWeekday = document.querySelector("#current-weekday");
headerWeekday.innerHTML = currentWeekday;

let currentMonth = months[now.getMonth()];
let headerMonth = document.querySelector("#current-month");
headerMonth.innerHTML = currentMonth;

let currentDate = now.getDate();
let headerDate = document.querySelector("#current-date");
headerDate.innerHTML = currentDate;

function replaceHeaderHour() {
  let currentHour = now.getHours();
  let headerHour = document.querySelector("#current-hour");
  let timestamp = document.querySelector("#timestamp");
  if (currentHour === 0) {
    headerHour.innerHTML = 12;
    timestamp.innerHTML = "AM";
  } else if (currentHour >= 13) {
    headerHour.innerHTML = currentHour - 12;
    timestamp.innerHTML = "PM";
  } else if (currentHour === 12) {
    headerHour.innerHTML = currentHour;
    timestamp.innerHTML = "PM";
  } else {
    headerHour.innerHTML = currentHour;
    timestamp.innerHTML = "AM";
  }
}
replaceHeaderHour();

function replaceHeaderMinutes() {
  let currentMinutes = now.getMinutes();
  let headerMinutes = document.querySelector("#current-minutes");
  if (currentMinutes <= 9) {
    headerMinutes.innerHTML = `0${currentMinutes}`;
  } else {
    headerMinutes.innerHTML = currentMinutes;
  }
}
replaceHeaderMinutes();

function handleSubmit(event) {
  event.preventDefault();
  let citySearchInput = `q=${document.querySelector("#city-search").value}`;
  searchCity(citySearchInput);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function searchCurrentLocation(position) {
  let currentCoords = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  searchCity(currentCoords);
}

function searchCity(location) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "6e2f14a60b2f5be57b160a6148235b2f";
  let units = "imperial";
  let apiUrl = `${apiEndpoint}${location}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  document.querySelector("#header-city").innerHTML = response.data.name;

  currentFahrenheitTemp = response.data.main.temp;

  document.querySelector("#current-temp").innerHTML = Math.round(
    currentFahrenheitTemp
  );
  document
    .querySelector("#current-weather-icon")
    .setAttribute("src", `images/${response.data.weather[0].icon}.png`);

  currentFeelsLikeTemp = response.data.main.feels_like;

  document.querySelector("#feels-like-temp").innerHTML = `${Math.round(
    currentFeelsLikeTemp
  )}℉`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#current-weather-condition").innerHTML =
    response.data.weather[0].description;
}

function displayCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active-link");
  celsiusLink.classList.remove("non-active-link");
  fahrenheitLink.classList.remove("active-link");
  fahrenheitLink.classList.add("non-active-link");
  let currentCelsiusTemp = ((currentFahrenheitTemp - 32) * 5) / 9;
  let feelsLikeCelsiusTemp = ((currentFeelsLikeTemp - 32) * 5) / 9;
  currentTempHeading.innerHTML = Math.round(currentCelsiusTemp);
  feelsLikeTempHeading.innerHTML = `${Math.round(feelsLikeCelsiusTemp)}℃`;
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active-link");
  celsiusLink.classList.add("non-active-link");
  fahrenheitLink.classList.add("active-link");
  fahrenheitLink.classList.remove("non-active-link");
  currentTempHeading.innerHTML = Math.round(currentFahrenheitTemp);
  feelsLikeTempHeading.innerHTML = `${Math.round(currentFeelsLikeTemp)}℉`;
}

function displayForecast() {
  let forecastSection = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  weekDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col card-column">
    <h5 class="card-title">${day}</h5>
    <div class="card">
      <span class="forecast-temp-max">73°</span>
      <span class="forecast-temp-min">55°</span>
      <img
        src="images/02d.png"
        alt="cloudy"
        class="forecast-weather-image"
      />
    </div>
  </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
}

let currentFahrenheitTemp = null;
let currentFeelsLikeTemp = null;
let currentTempHeading = document.querySelector("#current-temp");
let feelsLikeTempHeading = document.querySelector("#feels-like-temp");

let currentLocationButton = document.querySelector("#current-city-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

let citySearchForm = document.querySelector("#search-form");
citySearchForm.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

searchCity("q=seattle");
displayForecast();
