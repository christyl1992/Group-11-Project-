// Fetching API 

var queryURL = "https://restcountries.com/v3.1/all"

fetch(queryURL)
.then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(queryURL);
    console.log(data);

// Loop through the countries
    for (let i = 0; i < data.length; i++) {
      var country = data[i];
      
      // Check if the country is Italy
      if (country.name.common === "Italy") {
        const countryName = country.name.common;
        const countryNameOfficial = country.name.official;
        const flag = country.flags.png;
        const capitalCity = country.capital[0];
        const population = country.population;

        console.log("Common Country Name: " + countryName);
        console.log("Official Counry Name:" + countryNameOfficial)
        console.log("Flag: " + flag);
        console.log("Capital City: " + capitalCity);
        console.log("Population: " + population);

      
        break;
      }
    }
  })