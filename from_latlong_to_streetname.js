/*
    get file list -- https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
    open file (json) -- https://stackabuse.com/reading-and-writing-json-files-with-node-js
    get required elements
    push into array
    save array into csv
*/

//requiring path and fs modules
const path = require('path');
const fs = require('fs');

//joining path of directory 
const directoryPath = path.join(__dirname, '..\\json');

const All_Addresses = []

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        //console.log(file); 

        let rawdata = fs.readFileSync('D:\\ONE DRIVE - PESSOAL\\OneDrive\\Site_Doutoramento\\LATLONG_STREET\\json\\' + file);
        let address = JSON.parse(rawdata);
        
        if (!address.error) {

            const address_info = {
                Filename : file,
                Address_Line1: address.features[0].properties.address_line1,
                Address_Line2: address.features[0].properties.address_line2,
                Formatted: address.features[0].properties.formatted,
                Street: address.features[0].properties.street,
                Housenumber : address.features[0].properties.housenumber
            }
/*
            console.log(address.features[0].properties.address_line1); 
            console.log(address.features[0].properties.address_line2); 
            console.log(address.features[0].properties.formatted); 
            console.log(address.features[0].properties.street);     
            console.log(address.features[0].properties.housenumber);     
*/
            All_Addresses.push(address_info);
        }

    });

    //console.table(All_Addresses);
    writeToCSVFile(All_Addresses);
});

//address.features[0].properties.address_line1
//address.features[0].properties.address_line2
//address.features[0].properties.formatted
//address.features[0].properties.street
function writeToCSVFile(addresses) {
    const filename = '..\\output-address-info.csv';
    fs.writeFile(filename, extractAsCSV(addresses), err => {
      if (err) {
        console.log('Error writing to csv file', err);
      } else {
        console.log(`saved as ${filename}`);
      }
    });
  }
  
  function extractAsCSV(addresses) {
    const header = ["Filename|Address_Line1|Address_Line2|Formatted|Street|Housenumber"];
    const rows = addresses.map(address =>
       `${address.Filename}|${address.Address_Line1}|${address.Address_Line2}|${address.Formatted}|${address.Street}|${address.Housenumber}`
    );
    return header.concat(rows).join("\n");
  }