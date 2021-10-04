var formEl = $('#search-form');
var inputEl = $('#search-input');
var submitBtnEl = $('#submit-search');
var apiKey = "cf55c07cb439558ab37bc0b13e34d8bd";
var cityInfoEl = $('#city-info');
var cityForecastEl = $('#city-forecast')

function handleFormSubmit(event){
    event.preventDefault();
    var cityName = inputEl.val().trim().replace(" ", "%20").toUpperCase();

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function(data) {
                // console.log(data.coord.lat + ", " + data.coord.lon);
                var oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;
                fetchWeatherData(oneCallApiUrl, data.name)
            })
        }
    });
}

function fetchWeatherData(url, city) {
    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                showCurrentInfo(data, city);
            })
        }
    })
}

function showCurrentInfo(data, city) {
    cityInfoEl.empty();
    var h2 = $('<h2>');
    h2.text(city + " " + moment().format("(MM/DD/YYYY)"));
    cityInfoEl.append(h2);
    
    var divInfoEl = $('<div>');
    divInfoEl.attr("class", "container");

    var ulEl = $('<ul>');
    ulEl.css({"list-style": "none", "padding-left": "0px"});

    var liTempEl = $('<li>');
    liTempEl.text("Temperature: " + getTemperature(data.current.temp) + "°F");

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

    divInfoEl.append(ulEl);
    cityInfoEl.append(divInfoEl);

    showForecast(data, city);
}

function showForecast(data, city) {
    cityForecastEl.empty();
    var h2 = $('<h2>');
    h2.text("5-Day Forecast");

    cityForecastEl.append(h2);
}

function getTemperature(temp) {
    return ((temp - 270) * 9 / 5 + 32).toFixed(1);
}
submitBtnEl.on("click", handleFormSubmit);
