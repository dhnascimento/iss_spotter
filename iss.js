const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const parsedBody = JSON.parse(body);
    const ip = parsedBody.ip;
    return callback(null, ip);

  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `It didn't work! Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const parsedBody = JSON.parse(body);
    const coords = {
      latitude:"",
      longitude:""
    };
    coords.latitude = parsedBody.data.latitude;
    coords.longitude = parsedBody.data.longitude;

    return callback(null, coords);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
//  *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {

  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    
    if (error) {
      return callback(error, null);
    }
    
    if (response.statusCode !== 200) {
      const msg = `It didn't work! Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const passes = JSON.parse(body).response;
    return callback(null, passes);
  
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("Error with fetchMyIP", error);
      return;

    }

    return fetchCoordsByIP(ip, (error, coords) => {
        
      if (error) {
        console.log("Error with fetchCoordsByIP", error);
        return;

      }
      return fetchISSFlyOverTimes(coords, (error, times) => {

        if (error) {
          console.log("Error with fetchISSFlyOverTime". error);
          return;

        }
        return callback(null, times);

      });
    });
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };