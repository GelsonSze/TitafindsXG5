/**
 * Returns true if str is empty or has spaces
 * @param  {string} str
 */
function isEmptyOrSpaces(str) {
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
function truncate(str, n, useWordBoundary = 1) {
    if (str.length <= n) {
        return str;
    }
    const subString = str.substr(0, n - 1); // the original check
    return (
        (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;"
    );
}

var successTimeout,
    errorTimeout,
    tempFields = [];

/**
 * Shows the error message and highlights all the
 * inputs in elements array for 5 seconds.
 * @param  {HTMLElement} error - the element to display the error message
 * @param  {string} message - the error message
 * @param  {HTMLElement[]} inputs - the fields to display red border
 */
function showError(error, message, inputs) {
    clearTimeout(errorTimeout);
    for (const oldInput of tempFields) {
        oldInput.classList.remove("error");
    }
    tempFields = inputs.slice();

    if (error) {
        error.innerHTML = message;
        error.classList.add("active");
    }
    for (const input of inputs) {
        input.classList.add("error");
    }
    errorTimeout = setTimeout(() => {
        if (error) error.classList.remove("active");
        for (const input of inputs) {
            input.classList.remove("error");
        }
    }, 5000);
}

/**
 * Shows the success message for 5 seconds.
 * @param {HTMLElement} success
 * @param {string} message
 */

function showSuccess(success, message) {
    clearTimeout(successTimeout);
    if (success) {
        success.innerHTML = message;
        success.classList.add("active");
    }
    successTimeout = setTimeout(() => {
        if (success) success.classList.remove("active");
    }, 5000);
}

/**
 * Clears content/innerHTML of the given element
 * @param  {HTMLElement} element
 */
function clear(element) {
    element.innerHTML = "";
}

/**
 * Toggles element's visibility if display is not defined,
 * otherwise toggles the display style.
 *
 * Note that if the element has a transition property,
 * Visibility property allows transition
 * Display property doesnt allow transition
 * @param  {HTMLElement} element
 * @param  {boolean} [show=undefined] - if 1, show the element; else, hide the element
 * @param  {boolean} [display=undefined] - if 1, uses display property; else, uses visibility property
 */
function toggle(element, show = undefined, display = undefined) {
    if (display === undefined) {
        element.style.transition = "all 0.3s ease";
        if (show === undefined) {
            element.style.visibility =
                element.style.visibility == "visible" || !element.style.visibility
                    ? "hidden"
                    : "visible";
            element.style.opacity =
                element.style.opacity == "1" || !element.style.opacity ? "0" : "1";
        } else {
            element.style.visibility = !show ? "hidden" : "visible";
            element.style.opacity = !show ? "0" : "1";
        }
    } else {
        if (show === undefined)
            element.style.display =
                element.style.display != "none" || !element.style.display ? "none" : "block";
        else element.style.display = !show ? "none" : "block";
    }
}

/**
 * This calculates the time difference between the actual date posted and today
 * @param  {Date} datePosted
 */
function calcDate(datePosted) {
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
function formatDate(d) {
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
 * Returns formatted date 'yyyy-MM-dd'
 * @param  {Date} d - the date to be formatted
 */
function birthdayInput(d) {
    d = new Date(d);
    let MM = d.getMonth() + 1;
    MM = MM < 10 ? "0" + MM : MM;
    return `${d.getFullYear()}-${MM}-${d.getDate()}`;
}

/**
 * Returns a clean string replacing newlines with spaces
 * @returns {string} - the string with newlines replaced with spaces
 */
String.prototype.removeNewlinesAndTags = function () {
    return this.replace(/(\r\n|\n|\r)/gm, "").replace(/(<([^>]+)>)/gi, "");
};

/**
 * This function pushes the transaction of the item in the transaction array
 * @param {Array} Transactions - Transactions global variable array
 * @param {Object} trans - transaction object   
 */
function pushTransaction(Transactions, trans) {
    $.ajax({
        url: `/getItemById=${trans.description}`,
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (item) {
            // console.log("transactions inside");
            // console.log(trans);
            trans.date = formatDate(new Date(trans.date));
            Transactions.push(
                new transaction(
                    trans.date,
                    trans.type,
                    `Item ${trans.type} - ${item.name} (${item.code})`,
                    trans.quantity,
                    trans.sellingPrice,
                    trans.transactedBy
                )
            );
        },
    });
}

