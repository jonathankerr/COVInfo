'use strict';

class Model{
    dateNumToName = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "June",
        7: "July",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    };

    constructor() {
        //Most data is given as an array of the last 7 days data
        this.nationalNewCases = this.setNationalData("newCasesByPublishDate");
        this.nationalNewDeaths = this.setNationalData("newDeaths28DaysByPublishDate");
        this.firstDoseVaccinated = this.setNationalData("cumPeopleVaccinatedFirstDoseByPublishDate");
        //USER INPUT WILL BE ADDED
        this.userDefinedLocationNewCases = this.setData("Glasgow City", "newCasesByPublishDate")  //SET GLASGOW CITY TEMP WILL EVENTUALLY BE USERS DECSION
        this.userDefinedLocationNewDeaths = this.setData("Glasgow City", "newDeaths28DaysByPublishDate")
    };


    //National Data and specific location data uses a different api call to get so use correct function.
    //setNationalData is only for returning uk wide data
    //setData is used to return data for a specific area in the uk e.g. 'Glasgow City', 'Stirling'

    setNationalData(typeOfData) { // VALID INPUTS: newCasesByPublishDate, newDeaths28DaysByPublishDate, cumPeopleVaccinatedFirstDoseByPublishDate
        let returnData; // data to be returned
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview&structure={%22date%22:%22date%22,%22"+typeOfData+"%22:%22"+typeOfData+"%22}",
            async: false, //MUST BE ASYNC FALSE
            success: function(data){
                let tempArr = data.data;
                tempArr.length = 6; //only want last 7 days
                returnData = tempArr;
            }
        });
        if(typeOfData == "newCasesByPublishDate"){
            this.nationalNewCases = returnData;
        }
        else if(typeOfData == "newCasesByPublishDate"){
            this.nationalNewDeaths = returnData;
        }
        else if(typeOfData == "cumPeopleVaccinatedFirstDoseByPublishDate"){
            this.firstDoseVaccinated = returnData;
        }
        return returnData;
    };


    setData(location, typeOfData) { 
        let returnData;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://api.coronavirus.data.gov.uk/v1/data?filters=areaName="+location+"&structure={%22date%22:%22date%22,%22"+typeOfData+"%22:%22"+typeOfData+"%22}",
            async: false, //MUST BE ASYNC FALSE
            success: function(data){
                let tempArr = data.data;
                tempArr.length = 6; //only want last 7 days
                returnData = tempArr;
            }
        });
        if(typeOfData == "newCasesByPublishDate"){
            this.userDefinedLocationNewCases = returnData;
        }
        else if(typeOfData == "newCasesByPublishDate"){
            this.userDefinedLocationNewDeaths = returnData;
        }
        return returnData;
    };

    displayDates(dates) {
        if (localStorage.getItem("statsLastUpdated")) {
            for (let d of dates) {
                d.textContent = this.getDate();
            }
        }
    };

    showDiv(element) {
        element.style.display = "block";
    };

    hideDiv(element) {
        element.style.display = "none";
    }

    toggleNationwide(nationwideButton, worldwideButton) {
        nationwideButton.classList.add("selected-btn");
        worldwideButton.classList.remove("selected-btn");
    };

    toggleWorldwide(nationwideButton, worldwideButton) {
        worldwideButton.classList.add("selected-btn");
        nationwideButton.classList.remove("selected-btn");
    };

    storeUpdatedStats() {
        localStorage.setItem("userDefinedLocationNewCases", this.getUserDefinedLocationNewCases()[0].newCasesByPublishDate);
        localStorage.setItem("userDefinedLocationNewDeaths", this.getUserDefinedLocationNewDeaths()[0].newDeaths28DaysByPublishDate);
        localStorage.setItem("nationalNewCases", this.getNationalNewCases()[0].newCasesByPublishDate);
        localStorage.setItem("nationalNewDeaths", this.getNationalNewDeaths()[0].newDeaths28DaysByPublishDate);
        localStorage.setItem("firstDoseVaccinated", this.getFirstDoseVaccinated()[0].cumPeopleVaccinatedFirstDoseByPublishDate);
        localStorage.setItem("statsLastUpdated", this.getDate());
        console.log("Stats updated!");
    };

    getUserDefinedLocationNewCases(){
        return this.userDefinedLocationNewCases;
    };

    getUserDefinedLocationNewDeaths(){
        return this.userDefinedLocationNewDeaths;
    };

    getNationalNewCases(){
        return this.nationalNewCases;
    };

    getNationalNewDeaths(){
        return this.nationalNewDeaths;
    };

    getFirstDoseVaccinated(){
        return this.firstDoseVaccinated;
    };

    getDate(){
        let day = new Date().getDate();
        let monthNum = new Date().getMonth() + 1;
        let monthName = this.dateNumToName[monthNum];
        return (day + " " + monthName);
    };
    
    // adds commas to numbers & formats
    formatNumber(num){
        return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
}

