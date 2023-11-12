const weather = {
    APIKey: "39f649549c24ea6c9c9b543610c30ae4"
};

let cityName;
const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("city-input");
const city = document.getElementById("current-city");
const date = document.getElementById("current-date");
const temperature = document.getElementById("current-temperature");
const humidity = document.getElementById("current-humidity");
const windSpeed = document.getElementById("current-wind-speed");
const icon = document.getElementById("current-icon");
const forecastContainer = document.getElementById("forecast-container");
const searchHistoryContainer = document.getElementById("search-history-container");

function kelvinToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);
}

const currentDate = dayjs().format("dddd, MMMM D, YYYY");

searchButton.addEventListener("click", async function () {
    cityName = cityInput.value.trim();

    if (cityName === "") {
        return;
    }

    try {
        const currentWeatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weather.APIKey}`);
        const currentWeatherData = await currentWeatherResponse.json();

        date.textContent = currentDate;
        city.textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        temperature.textContent = kelvinToFahrenheit(currentWeatherData.main.temp);
        humidity.textContent = currentWeatherData.main.humidity;
        windSpeed.textContent = currentWeatherData.wind.speed;
        icon.src = `http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`;

        const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weather.APIKey}`);
        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = '';

        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecast = forecastData.list[i];
            const forecastDate = dayjs(forecast.dt_txt).format("dddd, MMMM D, YYYY");
            const forecastTemp = kelvinToFahrenheit(forecast.main.temp) + "°F";
            const forecastIcon = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-container");

            forecastCard.innerHTML = `
                <p class="forecast-date">${forecastDate}</p>
                <img class="forecast-icon" src="${forecastIcon}" alt="Weather Icon">
                <p class="forecast-temperature">${forecastTemp}</p>
            `;

            forecastContainer.appendChild(forecastCard);
        }

        // Save search to local storage
        saveSearchToLocalStorage(cityName);

        // Display search history
        displaySearchHistory();

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});

// Function to save search to local storage
function saveSearchToLocalStorage(search) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.unshift(search);
    searches = [...new Set(searches)]; // Remove duplicates
    localStorage.setItem('searches', JSON.stringify(searches));
}

// Function to display search history
function displaySearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];

    searchHistoryContainer.innerHTML = '';

    searches.forEach(search => {
        const searchItem = document.createElement("div");
        searchItem.classList.add("search-history-item");
        searchItem.textContent = search;

        searchHistoryContainer.appendChild(searchItem);
    });
}
