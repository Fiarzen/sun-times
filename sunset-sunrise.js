const button = document.querySelector(".getSunTimes");
button.addEventListener("click", displaySunTimes);

// shows current time

function showTimeNow() {
  const timeNow = new Date().toUTCString();
  console.log(timeNow);
  const timeElement = document.querySelector(".time");
  timeElement.textContent = timeNow;
  timeElement.classList.add("orange");
}

showTimeNow();

// calculates the sunset and rise times
async function displaySunTimes() {
  var lngInput = document.getElementById("longitude");
  var latInput = document.getElementById("latitude");

  var lat = latInput.value;
  var lng = lngInput.value;

  if (!lat || !lng) {
    console.error("latitude or longitude missing");
    return;
  }
  const data = await fetchSunriseSunset(lat, lng);
  const sunriseElement = document.querySelector(".sunrise");
  const sunsetElement = document.querySelector(".sunset");
  sunriseElement.textContent = data.sunrise;
  sunsetElement.textContent = data.sunset;
  sunsetTime = timeStringToDate(data.sunset);
  const timeElement = document.getElementById("time");
  let now;

  now = new Date();

  sunriseTime = timeStringToDate(data.sunrise);
  console.log(sunriseTime, now, sunsetTime);
  if (sunriseTime < now && now < sunsetTime) {
    updateCountdown(sunsetTime, now);
    tillSunsetActive();
  } else if (now < sunriseTime) {
    updateCountdown(sunriseTime, now);
    tillSunriseActive();
  } else {
    var followingDay = new Date(sunriseTime.getTime() + 86400000);
    updateCountdown(followingDay, now);
    tillSunriseActive();
  }
  // hides results fields until generated
  const resultsElement = document.querySelector(".results");
  resultsElement.classList.add("active");
}

// utility to set till-sunset or sunrise active
function tillSunsetActive() {
  const tillsunsetElement = document.querySelector(".till-sunset");
  tillsunsetElement.classList.add("active");
}

function tillSunriseActive() {
  const tillsunriseElement = document.querySelector(".till-sunrise");
  tillsunriseElement.classList.add("active");
}

//returns api data in correct format

async function fetchSunriseSunset(lat, lng) {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`
    );
    const data = await response.json();
    console.log(data);

    if (data.status === "OK") {
      const result = {
        sunrise: data.results.sunrise,
        sunset: data.results.sunset,
        solarNoon: data.results.solar_noon,
        dayLength: data.results.day_length,
      };
      return result;
    } else {
      throw new Error("API returned error status");
    }
  } catch (error) {
    console.error("Failed to fetch sunrise/sunset data:", error);
    throw error;
  }
}

// create a function to calcuate time until the event
function updateCountdown(countDownDate, now) {
  console.log(countDownDate, now);
  // Calculate the difference (in seconds) between now and the count down date
  const differenceInMilliSeconds = countDownDate - now;
  const differenceInSeconds = differenceInMilliSeconds / 1000;

  // Calculation days, hours, minutes and seconds
  const days = Math.floor(differenceInSeconds / (60 * 60 * 24));
  const hours = Math.floor((differenceInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((differenceInSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(differenceInSeconds % 60);

  // Add result to page
  const countdownElement = document.querySelector(".countdown");
  countdownElement.innerText =
    days +
    " days, " +
    hours +
    " hours, " +
    minutes +
    " minutes, and " +
    seconds +
    " seconds to go!";

  // If the countdown isn't over, run again a second later
  if (differenceInSeconds > 0) {
    setTimeout(() => {
      updateCountdown(countDownDate, new Date());
    }, 1000);
  }
}

//utility function to get a date object from timestring
function timeStringToDate(timeString) {
  const today = new Date();
  const dateString = `${today.toDateString()} ${timeString}`;
  return new Date(dateString);
}
