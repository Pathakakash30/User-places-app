const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyDQ6byKyl3X2iwa_K4rEhpe0Yn2Ra8_ab0";

// function getCoordsForAddress(address) {
//   return { lat: 40.7484405, lng: -73.9878584 };
// }

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULT") {
    const error = new HttpError(
      "could not find location for the specified address",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
