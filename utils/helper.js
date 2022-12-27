"use strict";
/**
 * Returns true if both objects's keys have the same values
 * @param  {Object} obj1
 * @param  {Object} obj2
 */
export function isEqual(obj1, obj2) {
    try {
        for (var key in obj1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Returns true if str is empty or has spaces
 * @param  {string} str
 */
export function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

/**
 * Returns the string with length n with ellipsis on
 * the end  * By default, it returns the string without
 * cutting the word.
 * @param  {string} str
 * @param  {int} n
 * @param  {boolean} useWordBoundary=1
 */
export function truncate(str, n = 170, useWordBoundary = 1) {
    if (str.length <= n) {
        return str;
    }
    const subString = str.substring(0, n - 1); // the original check
    return (
        (useWordBoundary ? subString.substring(0, subString.lastIndexOf(" ")) : subString) +
        "&hellip;"
    );
}

/**
 * This calculates the time difference between the actual date posted and today
 * @param  {Date} datePosted
 */
export function calcDate(datePosted) {
    const dateToday = new Date();
    const year = dateToday.getFullYear() - datePosted.getFullYear();
    const month = monthDiff(datePosted, dateToday);
    const day = dayDiff(datePosted, dateToday);
    const hour = hourDiff(datePosted, dateToday);
    const minute = minuteDiff(datePosted, dateToday);
    const second = secondDiff(datePosted, dateToday);
    //console.log(`${dateToday.toISOString().slice(0, 10)} - ${datePosted.toISOString().slice(0, 10)}:\n ${year} ${month} ${day} ${hour} ${minute} ${second} `);

    if (year != 0) return `${year} year${year > 1 ? "s" : ""} ago`;
    if (month != 0) return `${month} month${month > 1 ? "s" : ""} ago`;
    if (day != 0) return `${day} day${day > 1 ? "s" : ""} ago`;
    if (hour != 0) return `${hour} hour${hour > 1 ? "s" : ""} ago`;
    if (minute != 0) return `${minute} minute${minute > 1 ? "s" : ""} ago`;

    return `${second} second${year > 1 ? "s" : ""} ago`;
}
/**
 * Returns the month difference
 * @param  {Date} date1 - the date before date 2
 * @param  {Date} date2 - the latest/recent date
 */
function monthDiff(date1, date2) {
    var months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
}

/**
 * Returns the day difference between two dates
 * @param  {Date} date1 - the date before date 2
 * @param  {Date} date2 - the latest/recent date
 */
function dayDiff(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns the hour difference between two dates
 * @param  {Date} date1 - the date before date 2
 * @param  {Date} date2 - the latest/recent date
 */
function hourDiff(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / (1000 * 60 * 60));
}

/**
 * Returns the minute difference between two dates
 * @param  {Date} date1 - the date before date 2
 * @param  {Date} date2 - the latest/recent date
 */
function minuteDiff(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / (1000 * 60));
}

/**
 * Returns the seconds difference between two dates
 * @param  {Date} date1 - the date before date 2
 * @param  {Date} date2 - the latest/recent date
 */
function secondDiff(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / 1000);
}

/**
 * Returns formatted date 'Day Mon dd yyyy, hh:mm {am|pm}'
 * @param  {Date} d - the date to be formatted
 */
export function formatDate(d) {
    var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        days[d.getDay()] +
        " " +
        months[d.getMonth()] +
        " " +
        d.getDate() +
        " " +
        d.getFullYear() +
        ", " +
        formatAMPM(d)
    );
}

/**
 * Returns formatted 12 hour time 'hh:mm {am|pm}'
 * @param  {Date} date - the date to be formatted
 */
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

/**
 * Returns formatted date 'Month dd, yyyy''
 * @param  {Date} d - the date to be formatted
 */
export function birthday(d) {
    d = new Date(d);
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

/**
 * Returns formatted date 'yyyy-MM-dd'
 * @param  {Date} d - the date to be formatted
 */
export function birthdayInput(d) {
    d = new Date(d);
    let MM = d.getMonth() + 1;
    MM = MM < 10 ? "0" + MM : MM;
    return `${d.getFullYear()}-${MM}-${d.getDate()}`;
}

/**
 * Returns a clean string replacing newlines with spaces
 * removes all HTML tags
 * @returns {string} s - the string cleaned
 */
export function removeNewlinesAndTags(s) {
    return s.replace(/(\r\n|\n|\r)/gm, "").replace(/(<([^>]+)>)/gi, "");
}

/**
 * This generates a random integer and concatenates it with the itemCode that was passed to the function.
 * This function guarantees that the total length of the itemCode + randomly generated integer string is 9.
 *
 * Returns the item code concatenated with the randomly generated number (integer)
 * @param {string} itemCode - the string code for the specific item type
 * @returns {string} - the string with the item code concatenated with the randomly generated number (integer)
 */
function generateRandomInt(itemCode) {
    // get desired number of digits given the item code
    var digits = 8 - itemCode.length;
    // get a random number from 0 to 10 ^ number of desired digits
    var number = Math.floor(Math.random() * (9 * Math.pow(10, digits)));
    // pad 0s at the start of the number if the number of digits is below desired digits
    number.toString().padStart(digits + 1, "0");

    return itemCode + number;
}

/**
 * This function generates the item code based on the specific item type that was passed in the parameters.
 *
 * Returns the item code concatenated with the randomly generated number (integer)
 * @param {string} type - the string for the item's type
 * @returns {string} - the string with the item code concatenated with the randomly generated number (integer)
 */
export function generateItemCode(type) {
    var itemCode;

    switch (type) {
        case "Bracelet":
            itemCode = "B";
            break;
        case "Chain":
            itemCode = "C";
            break;
        case "Earrings":
            itemCode = "ER";
            break;
        case "Necklace":
            itemCode = "NL";
            break;
        case "Pendant":
            itemCode = "P";
            break;
        case "Ring":
            itemCode = "R";
            break;
        case "Watch":
            itemCode = "W";
            break;
        default:
            itemCode = "NULL";
    }
    if (itemCode === "NULL") return itemCode;
    else {
        itemCode = generateRandomInt(itemCode);
    }

    return itemCode;
}

/**
 * Validates item object
 * @param {object} item - the item object to be validated
 * @returns {Object} - the object with the validation result
 */
export function validateItem(item) {
    var error = "";
    var errorFields = [];

    if (item.code.length > 100) {
        error = "Item code exceeds maximum character limit";
        errorFields = ["code"];
    } else if (item.code.includes("/") || item.code.includes("\\") || item.code.includes(" ")) {
        error = "Item code contains  invalid characters (/, \\, or space)";
        errorFields = ["code"];
    } else if (item.name.length > 255) {
        error = "Name exceeds maximum character limit";
        errorFields = ["name"];
    }
    // Check if number inputs are not numbers
    else if (item.size != null && isNaN(item.size)) {
        error = "Size is not a number";
        errorFields = ["size"];
    } else if (item.weight != null && isNaN(item.weight)) {
        error = "Weight is not a number";
        errorFields = ["weight"];
    } else if (item.sellingPrice != null && isNaN(item.sellingPrice)) {
        error = "Selling price is not a number";
        errorFields = ["selling-price"];
    } else if (item.purchasePrice != null && isNaN(item.purchasePrice)) {
        error = "Purchase price is not a number";
        errorFields = ["purchase-price"];
    } else if (item.available != null && isNaN(item.available)) {
        error = "Available quantity is not a number";
        errorFields = ["available"];
    } else if (item.sold != null && isNaN(item.sold)) {
        error = "Sold quantity is not a number";
        errorFields = ["sold"];
    } else if (item.damaged != null && isNaN(item.damaged)) {
        error = "Damaged quantity is not a number";
        errorFields = ["damaged"];
    }
    // Check if number inputs are below 0
    else if (item.size < 0) {
        error = "Size is below 0";
        errorFields = ["size"];
    } else if (item.weight < 0) {
        error = "Weight is below 0";
        errorFields = ["weight"];
    } else if (item.sellingPrice < 0) {
        error = "Selling price is below 0";
        errorFields = ["selling-price"];
    } else if (item.purchasePrice < 0) {
        error = "Purchase price is below 0";
        errorFields = ["purchase-price"];
    } else if (item.available < 0) {
        error = "Available quantity is below 0";
        errorFields = ["available"];
    } else if (item.sold < 0) {
        error = "Sold quantity is below 0";
        errorFields = ["sold"];
    } else if (item.damaged < 0) {
        error = "Damaged quantity is below 0";
        errorFields = ["damaged"];
    }
    // Check if quantities are not whole numbers
    else if (!isNaN(item.available) && item.available % 1 != 0) {
        error = "Available quantity is not a whole number";
        errorFields = ["available"];
    } else if (!isNaN(item.sold) && item.sold % 1 != 0) {
        error = "Sold quantity is not a whole number";
        errorFields = ["sold"];
    } else if (!isNaN(item.damaged) && item.damaged % 1 != 0) {
        error = "Damaged quantity is not a whole number";
        errorFields = ["damaged"];
    }

    // Return object with validation result
    return {
        error: error,
        errorFields: errorFields,
        passed: error === "" && errorFields.length === 0,
    };
}
