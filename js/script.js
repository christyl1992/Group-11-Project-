var country = "Spain";

var savedSearch = [];
//Saves the value of the search
function handleSearch(country) {
    if (country === "") {
        return;
    }
    savedSearch.push(country);

    localStorage.setItem("country", JSON.stringify(savedSearch));

    getPrevious();
    countryInfo();
}

$("#mainSearchButton").on("click", function (event) {
    event.preventDefault();
    var country = $("#mainInput").val().trim();
    console.log(country);
    handleSearch(country);
});

//Will create buttons based on search history
var previousSearchEL = $(".previous-searches-box");
function getPrevious() {
  previousSearchEL.empty();

  for (let i = 0; i < savedSearch.length; i++) {
    var rowEl = $("<row>");
    var btnEl = $("<button>").text(`${savedSearch[i]}`);

    rowEl.addClass("row savedButtonSearch");
    btnEl.addClass(
      "btn btn-sm btn-warning btn-outline-dark m-1 font-weight-bold mx-auto btnSaved"
    );
    btnEl.attr("type", "button");

    previousSearchEL.prepend(rowEl);
    rowEl.append(btnEl);
  }
  if (!country) {
    return;
  }
  //Allows the buttons to start a search as well
  $(".btnSaved").on("click", function (event) {
    event.preventDefault();
    country = $(this).text();
    if(country === "USA") {
      country = "United States"
    };
    if(country === "UK") {
      country = "United Kingdom"
    }
    console.log(country);
    countryInfo();
    // fiveDayE1();
  });
}

//Grab the main card body.
var tripBody = $(".wiki-card");
var populationBody = $(".population-card");
var capitalBody = $(".capital-card");
var commonBody = $(".common-name-card");
var flagBody = $(".flag-card");
var flagBodyImg = $("#flag-card-image");

function countryInfo() {
  var wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${country}?redirect=true`;
  var queryURL = "https://restcountries.com/v3.1/all";

  $(tripBody).empty();
  $(populationBody).empty();
  $(capitalBody).empty();
  $(commonBody).empty();
  $(flagBody).empty();

  fetch(wikiURL)
    .then((response) => response.json())
    .then((data) => {
      const wikiExtract = data.extract;
      tripBody.append(wikiExtract);
    });

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(queryURL);
      console.log(data);

      // Loop through the countries
      for (let i = 0; i < data.length; i++) {
        var restCountry = data[i];

      // Check if the country is Italy
      if (restCountry.name.common === country) {
        const countryName = restCountry.name.common;
        const countryNameOfficial = restCountry.name.official;
        commonBody.append("The common name is " + countryName + " but the official name is " + countryNameOfficial);
        const flag = restCountry.flags.png;
        flagBody.append(flag);
        const capitalCity = restCountry.capital[0];
        capitalBody.append("The capital city is " + capitalCity);
        const population = restCountry.population.toLocaleString();
        populationBody.append("The population is " + population);
            // commonBody.append("Country: " + countryName + " (Official: " + countryNameOfficial + ")");
          }

        }
      });
  }

function load() {
  var savedSearchStore = JSON.parse(localStorage.getItem("country"));

  if (savedSearchStore !== null) {
    savedSearch = savedSearchStore;
  }
  getPrevious();
  // countryInfo();
}

load();
