// Import API key from config.js
import { key } from "./config";
$(document).ready(function () {
  // Variables for API url, search string , query
  var apiURL = "https://api.openweathermap.org/data/2.5/forecast?";
  var searchString = "";
  var queryURL;

  // Parent divs - today , forecast
  var today = $("#today");
  var forecast = $("#forecast");

  // Variables for current day data
  var cityName;
  var todayDate;
  var todayIcon;
  var todayTemperature;
  var todayWind;
  var todayHumidity;

  // Variables for forecast data
  var forecastDate;
  var forecastIcon;
  var forecastTemperature;
  var forecastWind;
  var forecastHumidity;

  // Array for results of data fetch
  var results = [];

  // Modal
  var modalTitle = $(".modal-title");
  var modalBodyText = $(".modal-body").children().eq(0);

  // When search button is clicked
  $("#search-button").on("click", function (e) {
    // Prevent automatic form submission
    e.preventDefault();

    today.empty();
    forecast.empty();

    // If search input value is empty
    if ($("#search-input").val() == false) {
      // Show message
      modalBodyText.text("Please enter a city name.");
      showModal();
    }
    // If search input value exists
    else {
      // Remove whitespace from input and
      searchString = $("#search-input").val().trim();
      // Make searchstring lower case

      searchString = searchString.toLowerCase();

      // Add searchString to history
      createSearchedItemBtn(searchString);

      // Clear search input
      $("#search-input").val(" ");

      // Clear results array
      results = [];

      // save retrieved result
      var savedResults;

      // If searchstring already exists in localstorage
      if (localStorage.getItem(searchString) !== null) {
        // Retrieve from storage and parse data
        savedResults = JSON.parse(localStorage.getItem(searchString));

        // Populate dashboard content from saved results
        // Populate current day weather section
        var todayWeather = $("<div>");

        // container div for cityName, todayDate, todayIcon

        var todayWeatherMasthead = $("<div>");
        todayWeatherMasthead.addClass("d-flex");
        cityName = $("<h3>");
        cityName.text(savedResults[0].city);
        todayDate = $("<h3>");
        todayDate.addClass("px-2");
        todayDate.text(savedResults[0].date);
        todayIcon = $("<img>");
        todayIcon.attr("src", savedResults[0].icon[0]);
        todayIcon.attr("alt", savedResults[0].icon[1]);
        todayTemperature = $("<p>");
        todayTemperature.text("Temp: " + savedResults[0].temp);
        todayWind = $("<p>");
        todayWind.text("Wind: " + savedResults[0].wind);
        todayHumidity = $("<p>");
        todayHumidity.text("Humidity: " + savedResults[0].humidity);

        // Append to Masthead
        todayWeatherMasthead.append(cityName, todayDate, todayIcon);

        // Append to container div
        todayWeather.append(
          todayWeatherMasthead,
          todayTemperature,
          todayWind,
          todayHumidity
        );

        //Append to parent div
        $("#today").append(todayWeather);

        // Populate forecast weather section

        // Append title  for forecast
        var forecastHeading = $("<h3>").text("5-Day Forecast:");
        forecast.append(forecastHeading);

        // From search results
        for (var i = 1; i < savedResults.length; i++) {
          var forecastWeather = $("<div>");
          forecastWeather.addClass("col m-1 forecast-weather");
          forecastDate = $("<h3>");
          forecastDate.text(savedResults[i].date);
          forecastIcon = $("<img>");
          forecastIcon.attr("src", savedResults[i].icon[0]);

          // Check if individual status exist and add
          forecastIcon.attr("alt", savedResults[i].icon[1]);
          forecastTemperature = $("<p>");
          // Convert temperature data value to celsius

          forecastTemperature.text("Temp: " + savedResults[i].temp);
          forecastWind = $("<p>").text("Wind: " + savedResults[i].wind);
          forecastHumidity = $("<p>").text(
            "Humidity: " + savedResults[i].humidity
          );
          forecastWeather.append(
            forecastDate,
            forecastIcon,
            forecastTemperature,
            forecastWind,
            forecastHumidity
          );
          $("#forecast").append(forecastWeather);
        }
        return;
      } else {
        // Build search query
        queryURL = apiURL + "q=" + searchString + key;

        // Fetch data form API
        fetch(queryURL)
          .then(function (response) {
            // If no data
            if (response.status === 404) {
              modalTitle.text("No Data for that city is available.");
              modalBodyText.text("Please try again later.");
              showModal();
            } else {
              return response.json();
            }
          })
          .then(function (data) {
            // Get forecast weather data
            var dayWeather = data.list;

            //Create div for today weather
            var todayWeather = $("<div>");

            // Create container div for cityName, todayDate, todayIcon

            var todayWeatherMasthead = $("<div>");
            todayWeatherMasthead.addClass("d-flex");
            cityName = $("<h3>");
            cityName.text(data.city.name);
            todayDate = $("<h3>");
            todayDate.addClass("px-2");
            todayDate.text(dayjs(dayWeather.dt_txt).format("DD/MM/YYYY"));
            todayIcon = $("<img>");
            todayIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                dayWeather[0].weather[0].icon +
                ".png"
            );
            todayIcon.attr("alt", dayWeather[0].weather[0].description);
            todayTemperature = $("<p>");
            todayTemperature.text(
              "Temp: " + (dayWeather[0].main.temp - 273.15).toFixed(2) + " °C"
            );
            todayWind = $("<p>");
            todayWind.text("Wind: " + dayWeather[0].wind.speed + " MPH");
            todayHumidity = $("<p>");
            todayHumidity.text(
              "Humidity: " + dayWeather[0].main.humidity + " %"
            );

            // Append to Mastehead
            todayWeatherMasthead.append(cityName, todayDate, todayIcon);

            // Append to container div
            todayWeather.append(
              todayWeatherMasthead,
              todayTemperature,
              todayWind,
              todayHumidity
            );

            //Append to parent div
            $("#today").append(todayWeather);

            // Append title  for forecast
            var forecastHeading = $("<h3>").text("5-Day Forecast:");
            forecast.append(forecastHeading);

            // From search results
            for (var i = 1; i < dayWeather.length; i++) {
              var forecastWeather = $("<div>");
              forecastWeather.addClass("col m-1 forecast-weather");
              forecastDate = $("<h3>");
              forecastDate.text(
                dayjs(dayWeather[i].dt_txt).format("DD/MM/YYYY")
              );
              forecastIcon = $("<img>");
              forecastIcon.attr(
                "src",
                "https://openweathermap.org/img/wn/" +
                  dayWeather[i].weather[0].icon +
                  ".png"
              );

              forecastIcon.attr("alt", dayWeather[i].weather[0].description);
              forecastTemperature = $("<p>");
              // Convert temperature to celsius

              forecastTemperature.text(
                "Temp: " + (dayWeather[i].main.temp - 273.15).toFixed(2) + " °C"
              );
              forecastWind = $("<p>").text(
                "Wind: " + dayWeather[i].wind.speed + " MPH"
              );
              forecastHumidity = $("<p>").text(
                "Humidity: " + dayWeather[i].main.humidity + " %"
              );
              forecastWeather.append(
                forecastDate,
                forecastIcon,
                forecastTemperature,
                forecastWind,
                forecastHumidity
              );
              $("#forecast").append(forecastWeather);
            }
            // Create an array of objects from data-list
            for (var j = 0; j < dayWeather.length; j++) {
              // Create an object
              var resultObject = {
                city: data.city.name,
                date: dayjs(dayWeather.dt_txt).format("DD/MM/YYYY"),
                icon: [
                  "https://openweathermap.org/img/wn/" +
                    dayWeather[j].weather[0].icon +
                    ".png",
                  dayWeather[j].weather[0].description,
                ],
                wind: dayWeather[j].wind.speed + " MPH",
                temp: (dayWeather[j].main.temp - 273.15).toFixed(2) + " °C",
                humidity: dayWeather[j].main.humidity + " %",
              };
              results.push(resultObject);
            }

            // Save result to localstorage using cityname as key
            localStorage.setItem(
              data.city.name.toLowerCase(),
              JSON.stringify(results)
            );
          });
      }
    }
  });
});

// function to create button
function createSearchedItemBtn(str) {
  // check if the button with the same text content already exists and append it if not
  var searchedItemList = $("#history");
  var searchedItemBtns = searchedItemList.find("button");

  var buttonExists =
    searchedItemBtns.filter(function () {
      return $(this).text() === str;
    }).length > 0;

  if (!buttonExists) {
    // Create button
    var searchedItemBtn = $("<button>");
    searchedItemBtn.addClass("btn btn-secondary search-button mt-1");
    searchedItemBtn.text(str).addClass("text-capitalize");
    searchedItemList.prepend(searchedItemBtn);
  } else {
    return;
  }
}

// Click button to hide modal
$("#close-btn").on("click", function () {
  hideModal();
});
//  Click (X) icon to hide modal
$(".btn-close").on("click", function () {
  hideModal();
});
// Function to show modal
function showModal() {
  $(".modal").show();
}
// function to hide modal
function hideModal() {
  $(".modal").hide();
}
