// Top Panel Reference
const title = document.getElementById("title");

// Navigation Panel References
const openNav = document.getElementById("open-nav");
const closeNav = document.getElementById("close-nav");

const homeBtn = document.getElementById("home-btn");
const weatherBtn = document.getElementById("weather-btn");
const airpollutionBtn = document.getElementById("airpollution-btn");
const zipCodeInput = document.getElementById("zip-code-input");

// Panel References 
const navigationPanel = document.getElementById("navigation-panel");
const contentPanels = document.getElementsByClassName("content-panels");
const homePanel = document.getElementById("home-panel");
const weatherPanel = document.getElementById("weather-panel");
const airpollutionPanel = document.getElementById("airpollution-panel");

// Weather Panel References
const weatherZipCode = document.getElementById("weather-zip-code");
const weatherDescription = document.getElementById("weather-description");
const weatherConditionIcon = document.getElementById("weather-condition-icon");
const temperature = document.getElementById("temperature");
const low = document.getElementById("low");
const high = document.getElementById("high");
const feelsLike = document.getElementById("feels-like");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");

// Air Pollution Panel References
const scaleContainer = document.getElementById("scale-container");
const airpollutionZipCode = document.getElementById("airpollution-zip-code");
const airQualityIndex = document.getElementById("air-quality-index");
const airQualityStatus = document.getElementById("air-quality-status");
const airQualityDescription = document.getElementById("air-quality-description");
const pointer = document.getElementById("pointer");

// Api Key and Usage
const apiKey = "9e3accea0f1ab449181619ebbbcbd78c";
let geoURL;
let lat;
let lon;

function search(){ // uses openweathermap's geo api to find latitude and longitude based on zip code
    geoURL = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCodeInput.value},US&appid=${apiKey}`;
    fetch(geoURL)
    .then(function(reponse){
        return reponse.json();
    })
    .then(function(geoJSON){
        lat = geoJSON.lat;
        lon = geoJSON.lon;
        if(lat == undefined || lon == undefined){
            alert("Invalid zip code.");
            return;
        }
        if(weatherPanel.style.display != "none"){
            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
            fetchWeatherData(weatherURL);
        }else if(airpollutionPanel.style.display != "none"){
            const airURL = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            fetchAirData(airURL);
        }
    });
}

function fetchWeatherData(weatherURL){ // fetch data from openweathermap's api to change weather panel data
    fetch(weatherURL)
    .then(function(reponse){
        return reponse.json();
    })
    .then(function(weatherJSON){
        weatherZipCode.innerText = `Zip Code: ${zipCodeInput.value}`;
        weatherDescription.innerText = weatherJSON.weather[0].description.toUpperCase();
        weatherConditionIcon.src = `https://openweathermap.org/img/wn/${weatherJSON.weather[0].icon}@4x.png`;
        temperature.innerText = `${Math.round(weatherJSON.main.temp)}°F`;
        low.innerText = `${Math.round(weatherJSON.main.temp_min)}°F`;
        high.innerText = `${Math.round(weatherJSON.main.temp_max)}°F`;
        feelsLike.innerText = `${Math.round(weatherJSON.main.feels_like)}°F`
        windSpeed.innerText = `${weatherJSON.wind.speed} mph`;
        pressure.innerText = `${weatherJSON.main.pressure} mb`;
        humidity.innerText = `${weatherJSON.main.humidity}%`;
    });
}

function fetchAirData(airURL){ // fetch data from openweathermap's api to change air pollution panel data
    fetch(airURL)
    .then(function(reponse){
        return reponse.json();
    })
    .then(function(airJSON){
        airpollutionZipCode.innerText = `Zip Code: ${zipCodeInput.value}`;
        airQualityIndex.innerText = airJSON.list[0].main.aqi;
        let status=[
            "Good",
            "Fair",
            "Moderate",
            "Unhealthy",
            "Hazardous"
        ];
        let description=[
            "Air quality is satisfactory, and air pollution poses little or no risk.",
            "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
            "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
            "Health alert: The risk of health effects is increased for everyone.",
            "Health warning of emergency conditions: everyone is more likely to be affected."
        ];
        let movePointer = 71;
        if(airJSON.list[0].main.aqi == "1"){
            airQualityStatus.innerText = status[0];
            airQualityDescription.innerText = description[0];
            scaleContainer.style.backgroundColor = "lightgreen";
            movePointer += 40;
        }else if(airJSON.list[0].main.aqi == "2"){
            airQualityStatus.innerText = status[1];
            airQualityDescription.innerText = description[1];
            scaleContainer.style.backgroundColor = "#DEC20B";
            movePointer += 230; 
        }else if(airJSON.list[0].main.aqi == "3"){
            airQualityStatus.innerText = status[2];
            airQualityDescription.innerText = description[2];
            scaleContainer.style.backgroundColor = "orange";
            movePointer += 480;
        }else if(airJSON.list[0].main.aqi == "4"){
            airQualityStatus.innerText = status[3];
            airQualityDescription.innerText = description[3];
            scaleContainer.style.backgroundColor = "red";
            movePointer += 775;
        }else if(airJSON.list[0].main.aqi == "5"){
            airQualityStatus.innerText = status[4];
            airQualityDescription.innerText = description[4];
            scaleContainer.style.backgroundColor = "purple";
            movePointer += 930;
        }
        pointer.style.marginLeft = `${movePointer}px`;
    });
}

//Navigation Buttons
openNav.onclick = function(event){ // shows navigation panel and moves everything else more right
    event.preventDefault();
    navigationPanel.style.width = "16%";
    title.style.marginLeft = "320px";
    for(let i = 0; i < contentPanels.length; i++){
        contentPanels[i].style.marginLeft = "16%";
        contentPanels[i].style.width = "84%";
    }
}

closeNav.onclick = function(event){ // hides navigation panel and moves everything else more left
    event.preventDefault();
    navigationPanel.style.width = "0";
    title.style.marginLeft = "0";
    for(let i = 0; i < contentPanels.length; i++){
        contentPanels[i].style.marginLeft = "0";
        contentPanels[i].style.width = "100%";
    }
}

homeBtn.onclick = function(event) { // shows home panel
    event.preventDefault();
    homePanel.style.display = "block";
    weatherPanel.style.display = "none";
    airpollutionPanel.style.display = "none";
    homeBtn.classList.add("active");
    weatherBtn.classList.remove("active");
    airpollutionBtn.classList.remove("active");
}

weatherBtn.onclick = function(event) { // shows weather panel
    event.preventDefault();
    if(zipCodeInput.value == ""){
        alert("Enter a zip code.");
        homeBtn.click();
    }else{
        weatherPanel.style.display = "flex";
        homePanel.style.display = "none";
        airpollutionPanel.style.display = "none";
        homeBtn.classList.remove("active");
        weatherBtn.classList.add("active");
        airpollutionBtn.classList.remove("active");
        search();
    }
}

airpollutionBtn.onclick = function(event) { // shows air quality panel
    event.preventDefault();
    if(zipCodeInput.value == ""){
        alert("Enter a zip code.");
        homeBtn.click();
    }else{
        airpollutionPanel.style.display = "flex";
        weatherPanel.style.display = "none";
        homePanel.style.display = "none"
        homeBtn.classList.remove("active");
        weatherBtn.classList.remove("active");
        airpollutionBtn.classList.add("active");
        search();
    }
}

zipCodeInput.onblur = function(){ // On zipCodeInput's change, it activates search()
    if (weatherPanel.style.display != "none" || airpollutionPanel.style.display != "none"){
        search();
    }
}

zipCodeInput.addEventListener('keydown', function(event) { // Prevent the default Enter key behavior
    if (event.key === "Enter"){
        event.preventDefault();
        zipCodeInput.blur(); 
    }
});

homeBtn.click(); // Show home panel when the user loads in the page