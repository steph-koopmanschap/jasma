// This function transforms a date object to a string format.
// date is a Date object. 
// To format today's date, input (new Date()) as the first parameter
// seperator specifies the character to seperate the dates.
// if seperator = "" then no seperator will be used: example YYYYMMDD
// format can either be 3 formats and will specify in which format the date string will be returned
// "YYYY-MM-DD"
// "DD-MM-YYYY"
// "MM-DD-YYYY"
// YYYY-MM-DD is the default format for the ISO 8601 standard in PostGreSQL date datatype
function formatDateToStr(date, format="YYYY-MM-DD", seperator="-") {
    switch(format) {
        case "YYYY-MM-DD":
            return (date.getFullYear() + seperator + (date.getMonth()+1) + seperator + date.getDate());
        case "DD-MM-YYYY":
            return (date.getDate() + seperator + (date.getMonth()+1) + seperator + date.getFullYear());
        case "MM-DD-YYYY":
            return ((date.getMonth()+1) + seperator + date.getDate() + seperator + date.getFullYear());
        default: 
            return new Error("Error: Date format not correct.");
    }
}

module.exports = formatDateToStr;
