/*
  References

  simple request with node - https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
  hiding api-keys - https://www.freecodecamp.org/news/private-api-keys/

  TODO:
  remove hardcoded lat/long
    - use array
    - use file => https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  save request to file
    - as json => https://stackabuse.com/reading-and-writing-json-files-with-node-js
    - as csv
*/

require("dotenv").config();

const https = require('https');
const fs = require('fs')
const csv = require('csv-parser');

const files = [];
const addresses = [];

//const url = "https://api.geoapify.com/v1/geocode/reverse?lat=41.15051389&lon=-8.611091667&api_key=" + process.env.GEOAPIFY_API_KEY;

fs.createReadStream('D:\\ONE DRIVE - PESSOAL\\OneDrive\\Site_Doutoramento\\Ficheiros-Base\\_Fotos AT_APP\\outgps.csv')
  .pipe(csv())
  .on('data', function (row) {
  
    const file = {
        SourceFile: row.SourceFile,
        GPSLongitude: row.GPSLongitude,
        GPSLatitude: row.GPSLatitude,
        GPSTimeStamp: row.GPSTimeStamp
    }
    files.push(file)
  })
  .on('end', function () {

    urls = [];

    urls = getApiUrls();
    console.table(urls)
    //for each call get the result

    getStuff(urls);
  })

function getApiUrls() {
  const local_urls = []; 

  files.forEach(function (file) {

    const sourceFile = file.SourceFile;
    const apiUrl = "https://api.geoapify.com/v1/geocode/reverse?lat=" + file.GPSLatitude + "&lon=" + file.GPSLongitude + "&api_key=" + process.env.GEOAPIFY_API_KEY;

    const new_url = {
      SourceFile: sourceFile,
      ApiUrl: apiUrl
    };

    local_urls.push(new_url);

  });

  return local_urls;

}

function getStuff(urls) {

  urls.forEach(function(url) {

    https.get(url.ApiUrl, (resp) => {
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        //console.log(JSON.parse(data).explanation);
        //console.log(data);
  
        const new_address = {
          Address: JSON.parse(data).features[0].properties.address_line1
        };
    
        addresses.push(new_address);
  
        fs.writeFile("..\\json\\" + url.SourceFile + ".json", data, function (err) {
          if (err) {
            console.log(url.SourceFile + ' - ' + err);
          }
          
        });
  
  
  //      return data;
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      return null;
    });


  })


}    