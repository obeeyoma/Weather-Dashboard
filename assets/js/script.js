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
