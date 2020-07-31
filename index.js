const { nextISSTimesForMyLocation } = require('./iss.js');

// fetchMyIP((error, ip) =>{
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked!", ip);

// });

// fetchCoordsByIP("64.229.83.37", (error, coords) => {
//   if (error) {
//     console.log("It didn't work!", error);
//   }
  
//   console.log("It worked! Returned Coords: ", coords);
// });

// fetchISSFlyOverTimes({ latitude: '43.01470', longitude: '-81.30490' }, (error, fly) =>{
//   if (error) {
//     console.log("It didn't work!", error);
//   }

//   console.log(fly);
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});