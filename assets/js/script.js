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
