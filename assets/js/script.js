//Reference elements
let searchForm = $("#search-form");
let searchHistory = $("#history");
let todaySection = $("#today");
let forecastSection = $("#forecast");
let forecastHeader = $("#forecast-header");
let searchBtn = $("#search-button");
let clearBtn = $("#clear-button");
// Load search history
document.addEventListener("DOMContentLoaded", function () {
  showSearchHistory();
});
//Get previous searches array or create it
let searchHistoryArr = JSON.parse(localStorage.getItem("CityNames")) || [];
// When user clicks searchbtn
searchForm.on("submit", function (event) {
  event.preventDefault();
  let searchInput = $("#search-input").val();
  // if search input is empty
  if (!searchInput) {
    alert("Please enter a city name");
    return;
  } else {
    forecastHeader.empty();
    // Fetch data with search input
    fetchData(searchInput);
    // Clear the search input
    $("#search-input").val("");
  }
});
// function to create buttons for searched items
function showSearchHistory() {
  searchHistory.empty();

  searchHistoryArr.forEach((city) => {
    let searchedCityBtn = $("<button>").addClass(
      "btn btn-secondary city-search-button mt-2 form-control"
    );
    searchedCityBtn.text(city);
    searchHistory.append(searchedCityBtn);
    // When searched item btn is clicked fetch data
    searchedCityBtn.on("click", function () {
      fetchData(city);
    });
  });
}
//Function to save search history
function saveSearchHistory(str) {
  // Convert to lowercase
  const cityName = str.toLowerCase();
  // If city already searched for
  if (searchHistoryArr.map((str) => str.toLowerCase()).includes(cityName)) {
    return;
  }
  searchHistoryArr.push(str);
  //Save to local storage if not already searched for
  localStorage.setItem("CityNames", JSON.stringify(searchHistoryArr));
  showSearchHistory();
}
// Clear search history btn
clearBtn.on("click", function (event) {
  event.preventDefault();
  searchHistory.empty();
  searchHistoryArr = [];
  localStorage.setItem("CityNames", JSON.stringify(searchHistoryArr));
  //Clear all search results
  todaySection.empty().removeClass("card");
  forecastSection.empty();
  forecastHeader.empty();
});
// Function to fetch weather data
function fetchData(searchstr) {
  //Clear previous search results
  todaySection.empty();
  forecastSection.empty();
  forecastHeader.empty();
  let key = "&appid=4826468e9fb284c1f1eb954d7b34649a";
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchstr +
    "&cnt=40" +
    key +
    "&units=metric";

  fetch(queryURL)
    .then(function (response) {
      //Validate search input
      if (!response.ok) {
        alert("City not found. Please enter a valid city name.");
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(function (data) {
      saveSearchHistory(searchstr);
      showTodayWeather(data);

      let weatherData = data.list;
      // Forecast section title
      let forecastTitle = $("<h3>").text("5-Day Forecast:").addClass("mt-3");
      forecastHeader.append(forecastTitle);

      for (let i = 0; i < weatherData.length; i++) {
        // Forecast weather content
        let dataHour = dayjs(weatherData[i].dt_txt).format("H");

        if (dataHour === "12") {
          let eachDataset = weatherData[i];
          let weatherBox = $("<div>").addClass("col");
          forecastSection.append(weatherBox);
          let weatherCard = $("<div>").addClass(
            "card-text forecast-weather text-white"
          );
          weatherBox.append(weatherCard);
          let cardBody = $("<div>").addClass("card-body");
          weatherCard.append(cardBody);
          let date = dayjs(eachDataset.dt_txt).format("D/M/YYYY");
          let dateEl = $("<h4>").addClass("card-title").text(date);
          cardBody.append(dateEl);
          let dayOfWeek = $("<h3>").text(
            dayjs(eachDataset.dt_txt).format("dddd")
          );
          cardBody.append(dayOfWeek);
          let iconCode = eachDataset.weather[0].icon;
          let iconImg = $("<img>");
          let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
          iconImg.attr("src", iconURL);
          iconImg.attr("alt", eachDataset.weather[0].description);
          cardBody.append(iconImg);
          displayInSection(eachDataset, cardBody);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
function showTodayWeather(data) {
  let todayWeather = data.list[0];
  // Today section content
  let todayDate = dayjs(todayWeather.dt_txt).format("D/M/YYYY");
  todaySection.addClass("card-body card today-weather");
  let cityName = data.city.name;
  let cityNameEl = $("<h2>")
    .addClass("card-title")
    .text(cityName + " (" + todayDate + ")");
  todaySection.append(cityNameEl);
  let weatherIcon = todayWeather.weather[0].icon;
  let weatherIconImg = $("<img>");
  let weatherIconURL =
    "https://openweathermap.org/img/w/" + weatherIcon + ".png";
  weatherIconImg.attr("src", weatherIconURL);
  weatherIconImg.attr("alt", todayWeather.weather[0].description);
  weatherIconImg.attr("style", "width: 100px;");
  todaySection.append(weatherIconImg);
  displayInSection(todayWeather, todaySection);
}
// Function to display weather content
function displayInSection(array, section) {
  let temp = array.main.temp;
  let tempEl = $("<p>")
    .addClass("card-text mt-2")
    .text("Temp: " + temp + "°C");
  section.append(tempEl);
  let wind = array.wind.speed;
  let windEl = $("<p>")
    .addClass("card-text")
    .text("Wind: " + (parseFloat(wind) * 3.6).toFixed(2) + " KPH");
  section.append(windEl);
  let humidity = array.main.humidity;
  let humidityEl = $("<p>")
    .addClass("card-text")
    .text("Humidity: " + humidity + "%");
  section.append(humidityEl);
}

