//Global Variable that contains all search user has been done
var savedSearch = [];

//Add Click Event in mainSearchButton
$("#mainSearchButton").on("click", function (event) {
    event.preventDefault();
    let country = $("#mainInput").val().trim();
    console.log(country);
    //If search input is not empty then
    if (country !== null && country !== "") {
        if (country === "USA") {
            country = "United States"
        } else if (country === "UK") {
            country = "United Kingdom"
        }else{
            country = capitalizeFirstLetter(country);
        }
        savedSearch.push(country);
        localStorage.setItem("country", JSON.stringify(savedSearch));
        getPrevious(savedSearch);
        countryInfo(country);
    }

});

//Wait page load then add Click event in modalSearchButton
$(document).ready(function () {
    $('#searchModal').modal('show');

    $("#modalSearchButton").on("click", function (event) {
        event.preventDefault();
        let country = $("#modalCountryInput").val().trim();
        if (country !== null && country !== "") {
            if (country === "USA") {
                country = "United States"
            } else if (country === "UK") {
                country = "United Kingdom"
            }else{
                country = capitalizeFirstLetter(country);
            }
            savedSearch.push(country);
            localStorage.setItem("country", JSON.stringify(savedSearch));
            getPrevious(savedSearch);
            countryInfo(country);
        }
        $('#searchModal').modal('hide');
    });
});


/**
 * Using the list of savedSearch, recreate all buttons of countries and add in reverse order into 'previous-searches-box'
 * Also add click event to all new buttons with special treatment for UK and USA which will use the full name
 * @param savedSearch
 * @returns {last country|null}
 */
function getPrevious(savedSearch) {
    //Get div container of searched countries
    let previousSearchEL = $(".previous-searches-box");
    //Remove all of them
    previousSearchEL.empty();

    for (let i = 0; i < savedSearch.length; i++) {
        //Create new row div
        let rowEl = $("<row>");
        rowEl.addClass("row savedButtonSearch");
        //Create new button
        let btnEl = $("<button>").text(`${savedSearch[i]}`);
        btnEl.addClass("btn btn-sm btn-warning btn-outline-dark m-1 font-weight-bold mx-auto btnSaved");
        btnEl.attr("type", "button");

        //Add at the begeaning
        previousSearchEL.prepend(rowEl);
        rowEl.append(btnEl);
    }

    //Allows the buttons to start a search as well
    $(".btnSaved").on("click", function (event) {
        event.preventDefault();
        let country = $(this).text();
        if (country === "USA") {
            country = "United States"
        } else if (country === "UK") {
            country = "United Kingdom"
        }
        console.log(country);
        countryInfo(country);
    });

    if (savedSearch.length > 0) {
        return savedSearch[savedSearch.length - 1];
    } else {
        return null;
    }
}

/**
 * This function updates the main page with all the details of the country, first get all those divs, clean each of them
 * then get the new data using wikipedia rest api and restcountries rest api
 * use Wikipedia rest to get the country details
 * use RestCountries for all other deatils such as population, capital, flag, etc..
 * @param country
 */
function countryInfo(country) {
    let wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${country}?redirect=true`;
    let queryURL = "https://restcountries.com/v3.1/all";

    let tripBody = $(".wiki-card");
    let populationBody = $(".population-card");
    let capitalBody = $(".capital-card");
    let commonBody = $(".common-name-card");
    let flagBody = $(".flag-card");
    let flagBodyImg = $("#flag-card-image");

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

            // Loop through the countries until find, once find we can stop the loop
            let found = false;
            let i = 0;
            while (i < data.length && !found) {
                var restCountry = data[i];
                // Check if the restCountry is equal to the country we look for
                if (restCountry.name.common === country) {
                    const countryName = restCountry.name.common;
                    const countryNameOfficial = restCountry.name.official;
                    commonBody.append("The common name is " + countryName + " but the official name is " + countryNameOfficial);

                    const flag = restCountry.flags.png;
                    flagBody.append(country);

                    flagBodyImg.attr("src",flag);

                    const capitalCity = restCountry.capital[0];
                    capitalBody.append("The capital city is " + capitalCity);

                    const population = restCountry.population.toLocaleString();
                    populationBody.append("The population is " + population);
                    //Update flag
                    found = true;
                }
                i++;
            }
        });
}

/**
 * This Function will get countries from localStorage and add countries in 'previous-searches-box', also if there is
 * at least one country will load the last one in the main page
 */
function load() {
    //get countries from localStorage
    var savedSearchStore = JSON.parse(localStorage.getItem("country"));
    //if there is any saved country then
    if (savedSearchStore !== null) {
        savedSearch = savedSearchStore;
        //Recreate the list of countries in the container
        let country = getPrevious(savedSearchStore);
        //Also get the last country, if is not empty disply into the Main page
        if (country !== null) {
            countryInfo(country);
        }
    }
}

/**
 * Recive in parameter a name of a country, if is not null or not empty will capitalize first letter of each word
 * @param name
 * @returns {*|string}
 */
function capitalizeFirstLetter(name){
    if(name!== null && name!==""){
        let words = name.split(' ');
        let capitalizedStr = '';

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

            capitalizedStr += (i > 0 ? ' ' : '') + capitalizedWord;
        }

        return capitalizedStr;
    }
    else return name;
}



load();
