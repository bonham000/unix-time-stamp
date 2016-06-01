var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();


// Add route for index CSS file:
app.get('/client/css/style.css', function(req, res){
  res.sendFile(__dirname + '/client/css/style.css');
});

// Add route for index JS file:
app.get('/client/js/index.js', function(req, res){
  res.sendFile(__dirname + '/client/js/index.js');
});

// Return homepage on request:
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

// Parse all other input to either UnixTime & Natural Date or Null:
// Formats Accepted: 

//   Unix Timestamp, or:
//   Natural Date written out, provided:
//     Order must be Month-Day-Year
//     Month is written in full or first 3 characters;
//     2 numbers are used for each day; 4 numbers for each year;
  
//Input must be a valid date
//Spaces may be included or excluded

app.get('/:id', function(req, res) {
   
    var dateObj = {
        "unix" : null,
        "natural" : null
    };
    
    var query = req.params.id;
    process(query);
    
    // formats: UNIX ; Sep NN NNNN, SepNNNNNN, SeptemberNNNNNN — spaces/no spaces, at least 3 letters in month;
    function process(input) {
        
        parseDate(input);
    
        var timeStamp;
        var date;
    
        // Parse original input:
        function parseDate(string) {
    
            if (unix(string)) {
                
            }
    
            else if (natural(string)) {
                string = string.replace(/ /g, '');
                parseNatural(string);
            }
    
        }
    
        // Test input for unix format:
        function unix(string) {  
            date = new Date(string * 1000);
    
            if (date != "Invalid Date") {
                
                date = JSON.stringify(date);
                
                var toParse = date.substr(6,2) + date.substr(9,2) + date.substr(1,4);
                
                parseFromUnix(toParse);
                return;
            }
            else {
                return false;
            }
        }
    
        // Test input for natural format:
        function natural(string) {
            for (var i = 0; i < 4; i++) {
                if (isNaN(string.charAt(i))) {
                    return true;
                }
            }
            return false;
        }
        
        function parseFromUnix(unixStr) {
            
            var month;
            var monthUnix = unixStr.substr(0,2);
            var dayYear   = unixStr.substr(2,6);
            
            if (monthUnix === "01") { month = "January"; }
            else if (monthUnix === "02") { month = "February"; }
            else if (monthUnix === "03") { month = "March"; }
            else if (monthUnix === "04") { month = "April"; }
            else if (monthUnix === "05") { month = "May"; }
            else if (monthUnix === "06") { month = "June"; }
            else if (monthUnix === "07") { month = "July"; }
            else if (monthUnix === "08") { month = "August"; }
            else if (monthUnix === "09") { month = "September"; }
            else if (monthUnix === "10") { month = "October"; }
            else if (monthUnix === "11") { month = "November"; }                                        
            else if (monthUnix === "12") { month = "December"; }         
            
            parseNaturalDate(month, dayYear);
            
        }
    
        // If natural, parse date — // if cannot parse, return "Invalid Date"
        function parseNatural(string) {
    
            var dayYear;
            var month;
            
            for (var a = 0; a < string.length; a++) {
    
                if ( !isNaN(string.charAt(a)) ) {
                    dayYear = string.substr(a, string.length-a);
                    month   = string.substr(0, a);
                    break;
                }
                
            }
    
            parseNaturalDate(month, dayYear);
    
        }
    
        function parseNaturalDate(month, dayYear) {
    
            // Parse Month:
            
            if (month === undefined || dayYear === undefined) {
                return false;
            }
            
            var short = month.substr(0, 3);
            var naturalMonth;
    
            short = short.charAt(0).toUpperCase() + short.slice(1);
            month = month.charAt(0).toUpperCase() + month.slice(1);
    
            if ((short === "Jan") && (month.length === 3)) { naturalMonth = "January"; }
            else if ((short === "Feb") && (month.length === 3)) { naturalMonth = "February"; }
            else if ((short === "Mar") && (month.length === 3)) { naturalMonth = "March"; }
            else if ((short === "Apr") && (month.length === 3)) { naturalMonth = "April"; }
            else if ((short === "May") && (month.length === 3)) { naturalMonth = "May"; }
            else if ((short === "Jun") && (month.length === 3)) { naturalMonth = "June"; }
            else if ((short === "Jul") && (month.length === 3)) { naturalMonth = "July"; }
            else if ((short === "Aug") && (month.length === 3)) { naturalMonth = "August"; }
            else if ((short === "Sep") && (month.length === 3)) { naturalMonth = "September"; }
            else if ((short === "Oct") && (month.length === 3)) { naturalMonth = "October"; }
            else if ((short === "Nov") && (month.length === 3)) { naturalMonth = "November"; }
            else if ((short === "Dec") && (month.length === 3)) { naturalMonth = "December"; }
    
            else if (month === "January")   { naturalMonth = "January"; }
            else if (month === "February")  { naturalMonth = "February"; }
            else if (month === "March")     { naturalMonth = "March"; }
            else if (month === "April")     { naturalMonth = "April"; }
            else if (month === "May")       { naturalMonth = "May"; }
            else if (month === "June")      { naturalMonth = "June"; }
            else if (month === "July")      { naturalMonth = "July"; }
            else if (month === "August")    { naturalMonth = "August"; }
            else if (month === "September") { naturalMonth = "September"; }
            else if (month === "October")   { naturalMonth = "October"; }
            else if (month === "November")  { naturalMonth = "November"; }
            else if (month === "December")  { naturalMonth = "December"; }
    
            else  { console.log("Invalid Month Format"); return false; }
    
            // Parse Day and Year:
            var naturalDay  = dayYear.substr(0, 2);
            var naturalYear = dayYear.substr(2, 6);
    
            if ( (naturalDay > 31) || (naturalDay < 1) ) { console.log("Day Format is Invalid"); return false; }
            if ( dayYear.length !== 6 ) { console.log("Day and Year Format is Invalid"); return false; }
    
    
            var naturalDate = naturalMonth + " " + naturalDay + ", " + naturalYear;
            
            dateObj["natural"] = naturalDate;
            
            convertUnix(naturalDate);
            
            return;
    
        }
    
        function convertUnix(naturalDate) {
    
            var unixTime = (new Date(naturalDate).getTime() / 1000).toFixed(0);
    
            dateObj["unix"] = unixTime;
            console.log(dateObj);
            return dateObj;
            
        }
    
    }
    
    console.log("Responding with JSON Object");
    res.json(dateObj);
    
});

// Begin server:
app.listen(process.env.PORT);
console.log("Server is listening...");