// some javascript helper methods for this app specific 
// I think this should be an angular service instead... 
function AppHelper() {

    var instance = this;

    instance.handleError = handleError;
    instance.buildRatingLabel = buildRatingLabel;
    instance.formatDate = formatDate;
    instance.isEmail = isEmail;
    instance.parseInt10 = parseInt10;
    instance.splitArray = splitArray;
    instance.replaceAll = replaceAll;
    instance.getDefaultLocation = getDefaultLocation;
    instance.diffDate = diffDate;
    instance.getDateString = getDateString;
    instance.getTodayPlus = getTodayPlus;
    instance.hasDuplication = hasDuplication;
    instance.getMonthName = getMonthName;
    instance.getPostDateDescription = getPostDateDescription;
    instance.refreshing = refreshing;
    instance.randomInt = randomInt;

    return instance;

    function randomInt(max) {
        return Math.floor((Math.random() * max) + 1);
    }

    function isEmail(value) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            return (true);
        }

        return (false);
    }

    // the input should be a datetime offset format
    function formatDate(input) {
        var date = new Date(input);
        var retval = date.toJSON();
        retval = retval.slice(0, 10);
        return retval;
    }

    function buildRatingLabel(value) {
        switch (value) {
            case 1:
                return "Once in lifetime is enough";
            case 2:
                return "Won't mind trying it again in a few months";
            case 3:
                return "Tasty! Will eat it once a month!";
            case 4:
                return "Yummy! I can have it once a week!";
            default:
                return "Heavenly! I can eat this everyday!";
        }
    }

    // here is trying to have a generic error handler for the entire application
    // err - the error response from the service, required 
    // vm - the viewmodel, required 
    // msgPrefix - optional, we prefix the error message using it
    function handleError(err, vm, msgPrefix, status) {

        if (!vm) return;

        if (status === 404) {
            // TODO: go to a specific page
        }

        if (err !== null && err !== undefined) {
            var errors = [];
            if (err.ModelState || (err.data && err.data.ModelState)) {
                var state = err.ModelState || err.data.ModelState;
                for (var key in state) {
                    for (var i = 0; i < state[key].length; i++) {
                        errors.push(state[key][i]);
                    }
                }

                vm.message = (msgPrefix || '') + errors.join(' ');
            } else {
                if (err.ExceptionMessage !== undefined)
                    vm.message = (msgPrefix || '') + err.ExceptionMessage;
                else if (err.error_description !== undefined)
                    vm.message = (msgPrefix || '') + err.error_description;
                else if (err.data)
                    vm.message = (msgPrefix || '') + err.data.Message;
                else if (err.message)
                    vm.message = err.message;
                else if (err.substring)
                    vm.message = (msgPrefix || '') + err;
                else
                    vm.message = (msgPrefix || '') + "unknown error, please try again later.";
            }
        } else {
            vm.message = "Server is not responding, please try again later.";
        }
    }

    function parseInt10(value) {
        return parseInt(value, 10);
    }

    // -----------------------------------------------------------
    // split an array into equal size
    // - a: array
    // - n: the size 
    // - return: an array of array
    // -----------------------------------------------------------
    function splitArray(a, n) {
        var len = a.length,
            out = [],
            i = 0;
        while (i < len) {
            var size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i + size));
            i += size;
        }
        return out;
    }

    function replaceAll(str, find, replaceStr, ignoreCase) {
        return str.replace(new RegExp(find.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
            (ignoreCase ? "gi" : "g")), (typeof (replaceStr) == "string") ? replaceStr.replace(/\$/g, "$$$$") : replaceStr);
    }

    function getDefaultLocation() {
        // this should only be called when the user rejects to give away location
        return {
            coords: {
                latitude: 49.8994,
                longitude: -97.1392
            },
            userLocation: {
                city: "Winnipeg",
                region: "Manitoba",
                country: "Canada"
            }

        };
    }

    // level should be: min, hr, day
    function diffDate(date1, date2, level) {
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        var diff = d2 - d1;
        if (isNaN(diff))
            return NaN;

        var minutes = 1000 * 60;
        var result;
        if (level === "min") {
            result = Math.round(diff / minutes);
        } else if (level === "hr") {
            var hours = minutes * 60;
            result = Math.round(diff / hours);
        } else {
            var days = minutes * 60 * 24;
            result = Math.round(diff / days);
        }

        return result;
    }

    function getDateString(date) {
        var d = new Date(date);
        if (isNaN(d)) {
            return "";
        }

        var yyyy = d.getFullYear().toString();
        var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = d.getDate().toString();

        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
    }

    // offset is the days difference, eg. if getting tomorrow, call getTodayPlus(1); 
    function getTodayPlus(offset, baseDate) {
        if (!baseDate) {
            baseDate = new Date(); // using today as the base
        }

        baseDate.setTime(baseDate.getTime() + offset * 86400000);
        return baseDate;
    }

    function hasDuplication(item, restaurants) {
        for (var idx = 0; idx < restaurants.length; idx++) {
            // here is problematic, because we are not using one FactualAPI (some comes from our own), the case is different
            if (restaurants[idx].name === item.name || restaurants[idx].Name === item.name) {
                if (
                    restaurants[idx].address === item.address ||
                    restaurants[idx].postcode === item.postcode ||
                    restaurants[idx].Address === item.address ||
                    compareCoord(restaurants[idx], item) === true) {
                    return true;
                }
            }
        }

        return false;
    }

    function compareCoord(item1, item2) {
        // 2 digits precision represents 1K distance, no restaurants with the same name can be that close 
        var lat1 = getFloatWithFix(item1.latitude || item1.Latitude, 2);
        var lat2 = getFloatWithFix(item2.latitude || item2.Latitude, 2);
        var lng1 = getFloatWithFix(item1.longitude || item1.Longitude, 2);
        var lng2 = getFloatWithFix(item2.longitude || item2.Longitude, 2);

        return (lat1 === lat2 && lng1 === lng2);
    }

    function getFloatWithFix(num, fix) {
        var retval = parseFloat(num).toFixed(fix);
        return retval;
    }

    function getMonthName(date) {
        var objDate = new Date(date),
            locale = "en-us";

        if (objDate.toLocalString) {
            var month = objDate.toLocaleString(locale, { month: "long" });
            if (month)
                return month;
        }

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[objDate.getMonth()];
    }

    function getPostDateDescription(postDate) {
        var hourDiff = diffDate(postDate, new Date(), "hr");
        if (hourDiff < 1) {
            return "Added less than an hour ago";
        } else if (hourDiff < 3) {
            return "Added less than " + hourDiff + " hours ago";
        } else {
            var dayDiff = diffDate(postDate, new Date(), "day");
            if (dayDiff <= 7) {
                return "Added " + dayDiff + " days ago";
            } else {
                return "Added on " + getDateString(postDate);
            }
        }
    }

    function refreshing($timeout, delay) {
        if (!delay || isNaN(delay))
            delay = 2000;

        var timer = $timeout(function () {
            $timeout.cancel(timer);
            window.location.reload(true);
        }, delay);
    }
}

if (!window.helper) {
    window.helper = new AppHelper();
}