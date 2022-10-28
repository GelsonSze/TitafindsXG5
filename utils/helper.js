/**
 * Returns true if both objects's keys have the same values
 * @param  {Object} obj1
 * @param  {Object} obj2
 */
export function isEqual(obj1, obj2) {
    try{
        for (var key in obj1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

/**
 * Returns true if str is empty or has spaces
 * @param  {string} str
 */
export function isEmptyOrSpaces(str){
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
export function truncate( str, n=170, useWordBoundary = 1 ){
    if (str.length <= n) { return str; }
    const subString = str.substring(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.substring(0, subString.lastIndexOf(" ")) 
      : subString) + "&hellip;";
};

/**
 * This calculates the time difference between the actual date posted and today
 * @param  {Date} datePosted
 */
export function calcDate(datePosted){
    const dateToday = new Date();
    const year = dateToday.getFullYear() - datePosted.getFullYear()
    const month = monthDiff(datePosted, dateToday);
    const day = dayDiff(datePosted, dateToday);
    const hour = hourDiff(datePosted, dateToday);
    const minute = minuteDiff(datePosted, dateToday);
    const second = secondDiff(datePosted, dateToday);
    //console.log(`${dateToday.toISOString().slice(0, 10)} - ${datePosted.toISOString().slice(0, 10)}:\n ${year} ${month} ${day} ${hour} ${minute} ${second} `);


    if(year != 0)
        return `${year} year${year > 1 ? 's': ''} ago`;
    if(month != 0)
        return `${month} month${month > 1 ? 's': ''} ago`;
    if(day != 0)
        return `${day} day${day > 1 ? 's': ''} ago`;
    if(hour != 0)
        return `${hour} hour${hour > 1 ? 's': ''} ago`;
    if(minute != 0)
        return `${minute} minute${minute > 1 ? 's': ''} ago`;
    
    return `${second} second${year > 1 ? 's': ''} ago`;
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
export function formatDate(d){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+', '+formatAMPM(d);
}

/**
 * Returns formatted 12 hour time 'hh:mm {am|pm}'
 * @param  {Date} date - the date to be formatted
 */
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

/**
 * Returns formatted date 'Month dd, yyyy''
 * @param  {Date} d - the date to be formatted
 */
export function birthday(d){
    d = new Date(d);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
}

/**
 * Returns formatted date 'yyyy-MM-dd'
 * @param  {Date} d - the date to be formatted
 */
export function birthdayInput(d){
    d = new Date(d);
    let MM = d.getMonth() + 1;
    MM = (MM < 10) ? '0' + MM : MM;
    return `${d.getFullYear()}-${MM}-${d.getDate()}`;
}

/**
 * Returns a clean string replacing newlines with spaces
 * removes all HTML tags
 * @returns {string} s - the string cleaned
 */
export function removeNewlinesAndTags(s){
    return s.replace(/(\r\n|\n|\r)/gm, "").replace(/(<([^>]+)>)/gi, "");
}
