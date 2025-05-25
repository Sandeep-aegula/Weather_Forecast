const weatheform = document.querySelector(".weatherform");
const cityinput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "9146a17e9bf2088991f517c961ed418c";

weatheform.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityinput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorData = await response.json();
        if (errorData.cod === "404") {
            throw new Error("City not found. Please check the city name and try again.");
        } else {
            throw new Error(errorData.message || "Failed to fetch weather data");
        }
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    // Clear previous error styles
    card.style.color = "";
    card.textContent = "";
    card.style.display = "flex";

    const { 
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }] 
    } = data;

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descripDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const date = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `🌡: ${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descripDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    date.textContent = new Date().toLocaleString();

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descripDisplay.classList.add("descripDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    date.classList.add("date");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descripDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(date);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 400 && weatherId < 500):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌁";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    card.textContent = "";
    card.style.display = "block";
    card.style.color = "red";
    card.textContent = message;
}

const getLocationBtn = document.getElementById("getLocationBtn");

getLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await getWeatherByCoords(latitude, longitude);
                displayWeatherInfo(weatherData);
            } catch (error) {
                console.error(error);
                displayError("Could not fetch location weather");
            }
        }, error => {
            console.error(error);
            displayError("Location access denied");
        });
    } else {
        displayError("Geolocation not supported");
    }
});

async function getWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data by coordinates");
    }
    return await response.json();
}
