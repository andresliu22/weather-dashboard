var formEl = $('#search-form');
var inputEl = $('#search-input');
var submitBtnEl = $('#submit-search');
var apiKey = "cf55c07cb439558ab37bc0b13e34d8bd";
var cityInfoEl = $('#city-info');
var cityForecastEl = $('#city-forecast')

// Handle every time the search button is pressed
function handleFormSubmit(event){
    event.preventDefault();

    // Delete spaces from input
    var cityName = inputEl.val().trim().replace(" ", "%20").toUpperCase();

    // API URL to get the latitude and longitude of city
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // Fetch data (latitude and longitude)
    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function(data) {

                // Set new API URL to get weather data from the typed city
                var oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;
                // Fetch weather data of city
                fetchWeatherData(oneCallApiUrl, data.name)
            })
        }
    });
}

// Fetch weather data of city
function fetchWeatherData(url, city) {
    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                // Display Information of city
                showCurrentInfo(data, city);
            })
        }
    })
}

// Display current weather information of the city
function showCurrentInfo(data, city) {
    cityInfoEl.empty();
    var h3 = $('<h3>');
    h3.text(city + " " + moment().format("(MM/DD/YYYY)"));
    cityInfoEl.append(h3);
    
    var weatherIcon = $("<img src=" + getWeatherIcon(data.current.weather[0].icon) + "></img>")
    weatherIcon.attr("class", "weather-icon");
    h3.append(weatherIcon);

    var divEl = $('<div>');
    divEl.attr("class", "container");

    var ulEl = $('<ul>');
    ulEl.css({"list-style": "none", "padding-left": "0px"});

    var liTempEl = $('<li>');
    liTempEl.text("Temperature: " + getTemperature(data.current.temp) + " °F");

    var liHumidityEl = $('<li>');
    liHumidityEl.text("Humidity: " + data.current.humidity + "%");

    var liWindEl = $('<li>');
    liWindEl.text("Wind Speed: " + data.current.wind_speed + "MPH");

    var liUVEl = $('<li>');
    liUVEl.text("UV Index: " + data.current.uvi);

    ulEl.append(liTempEl);
    ulEl.append(liHumidityEl);
    ulEl.append(liWindEl);
    ulEl.append(liUVEl);

    divEl.append(ulEl);
    cityInfoEl.append(divEl);

    showForecast(data.daily);
}

// Display 5-day forecast of the city
function showForecast(dailyData) {
    cityForecastEl.empty();
    var h3 = $('<h3>');
    h3.text("5-Day Forecast");

    cityForecastEl.append(h3);

    var divEl = $('<div>');
    divEl.attr("class", "five-day-div container d-flex");
    divEl.css({"display": "flex"});

    for (var i = 0; i < 5; i++) {
        var divDayEl = $('<div>');
        divDayEl.attr("class", "daily-div");

        var h4 = $('<h4>');
        h4.text(moment(new Date(), "DD-MM-YYYY").add(i + 1, 'days').format("MM/DD/YYYY"));

        var weatherIcon = $("<div class='icon-div'><img class='weather-icon' src=" + getWeatherIcon(dailyData[i].weather[0].icon) + "></img></div>")

        var ulEl = $('<ul>');
        ulEl.css({"list-style": "none", "padding-left": "0px"});

        var liTempEl = $('<li>');
        liTempEl.text("Temp: " + getTemperature(dailyData[i].temp.day) + " °F");

        var liHumEl = $('<li>');
        liHumEl.text("Humidity: " + dailyData[i].humidity + "%");

        ulEl.append(liTempEl);
        ulEl.append(liHumEl);

        divDayEl.append(h4);
        divDayEl.append(weatherIcon);
        divDayEl.append(ulEl);
    
        divEl.append(divDayEl);
    }

    cityForecastEl.append(divEl);
    
}

// Change temperature from Kelvin to Fahrenheit
function getTemperature(temp) {
    return ((temp - 270) * 9 / 5 + 32).toFixed(1);
}

// Return url of weather icon
function getWeatherIcon(iconCode) {
    return "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

// Event listener
submitBtnEl.on("click", handleFormSubmit);
