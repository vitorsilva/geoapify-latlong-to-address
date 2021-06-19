//https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
const https = require('https');
require("dotenv").config();

const url = "https://api.geoapify.com/v1/geocode/reverse?lat=41.15051389&lon=-8.611091667&api_key=" + process.env.GEOAPIFY_API_KEY;

https.get(url, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(JSON.parse(data).explanation);
    console.log(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});