export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip code ");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
};

export const displayError = (headerMsg, screenReaderMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(screenReaderMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg} . Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return (word.charAt(0)).toUpperCase() + word.slice(1);
  });

  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("cuurentForecast__location");
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  // currrent conditions
  const current_conditions_Array = createCurrentConditionDivs(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentConditions(current_conditions_Array);

  // six day forecast
  displaySixDayForecast(weatherJson);
  setFocusonSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const current_conditions = document.getElementById("currentForecast");
  current_conditions.classList.toggle("zero-vis");
  current_conditions.classList.toggle("fade-in");

  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentConditions);

  const sixDayForecat = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecat);
};

const deleteContents = (parentElement) => {
    if(parentElement) {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
    }    
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };

  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "Fahrenheit" : "Celsius"; // since it is for screen reader we use complete name not just the first letter
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}° 
    ${tempUnit} in ${location}}`;
};

const setFocusonSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  );
  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherObj.current.temp))}°`
  );
  const properDescription = toProperCase(
    weatherObj.current.weather[0].description
  );
  const description = createElem("div", "desc", properDescription);
  const feels = createElem(
    "div",
    "feels",
    `Feels Like ${Math.round(Number(weatherObj.current.feels_like))}°`
  );
  const maxTemp = createElem(
    "div",
    "maxTemp",
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`
  );
  const minTemp = createElem(
      "div",
      "minTemp",
      `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`
  );
  const humidity = createElem(
      "div",
      "humidity",
      `Humidity ${weatherObj.current.humidity}%`
  );
  const wind = createElem(
      "div",
      "wind",
      `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );

  return [icon, temp, description, feels, minTemp, maxTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const fontAwesomeIcon = translateIconToFontAwesome(icon);
  fontAwesomeIcon.ariaHidden = true;
  fontAwesomeIcon.title = altText;
  iconDiv.appendChild(fontAwesomeIcon);
  return iconDiv;
};

const createElem = (elemType, elemClassName, elemText, unit) => {
  const div = document.createElement(elemType);
  div.className = elemClassName;
  if (elemText) {
    div.textContent = elemText;
  }

  if (elemClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit"); // or unitDiv.className = unit
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch(firstTwoChars) {
        case "01" :
            if(lastChar === "d") {
                i.classList.add("far", "fa-sun");
            }else {
                i.classList.add("far" , "fa-moon")
            }
            break;
        case "02" :
            if(lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun");
            }else {
                i.classList.add("fas" , "fa-cloud-moon")
            }
            break;
        case "03" :
            i.classList.add("fas" , "fa-cloud");
            break;
        case "04":
            i.classList.add("fas", "fa-cloud-meatball");
            break;
        case "09":
           i.classList.add("fas", "fa-cloud-rain");
        case "10":
            if(lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun-rain");
            }else {
                i.classList.add("fas" , "fa-cloud-moon-rain")
            }
            break;
        case "11":
            i.classList.add("fas", "fa-poo-storm");
            break;
        case "13":
            i.classList.add("far", "fa-snowflake");
            break;
        case "50":
            i.classList.add("fas", "fa-smog");
            break;
        default:
            i.classList.add("far", "fa-question-circle")                                       
    }
    return i;
}

const displayCurrentConditions = (CurrentConditionsArray) => {
    const ccContainer = document.getElementById("currentForecast__conditions");
    CurrentConditionsArray.forEach(cc => {
        ccContainer.appendChild(cc)
    })
}


const displaySixDayForecast = (weatherJson) => {
  for (let i = 1 ; i < 7;i++) {
    const dailyForecastArray =  createDailyForecastDivs(weatherJson.daily[i]);
    displayDailyForecast(dailyForecastArray);
  }
}


const createDailyForecastDivs = (dayWeather) => {
  const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
  const dayAbbreviation = createElem("p", "dayAbbreviation" , dayAbbreviationText);
  const dayIcon = createDailyForecastIcon(dayWeather.weather[0].icon , dayWeather.weather[0].description);
  const dayHigh = createElem("p" , "dayHigh" , `${Math.round(Number(dayWeather.temp.max))}°`)
  const dayLow = createElem("p", "dayLow" , `${Math.round(Number(dayWeather.temp.min))}°`)

  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
}

const getDayAbbreviation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0,3).toUpperCase()
}

const createDailyForecastIcon = (icon , altText) => {
  const img = document.createElement("img");
  if(window.innerWidth < 768 || window.innerHeight < 1025 ) {
    img.src = `http://openweathermap.org/img/wn/${icon}.png`
  }else {
    img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
  }
  img.alt = altText;
  return img;
  
}


const displayDailyForecast = (dailyForecastArray) => {
  const dayDiv = createElem("div", "forecastDay");
  dailyForecastArray.forEach(el => {
    dayDiv.appendChild(el)
  })

  const dailyForecastContainer = document.getElementById("dailyForecast__contents");
  dailyForecastContainer.appendChild(dayDiv);
}