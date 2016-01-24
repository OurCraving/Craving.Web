(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/themes/md/app.js":[function(require,module,exports){
// CORE
require('./main');

},{"./main":"D:\\Craving.Web\\src\\js\\themes\\md\\main.js"}],"D:\\Craving.Web\\src\\js\\themes\\md\\_appHelper.js":[function(require,module,exports){
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
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\_mapHelper.js":[function(require,module,exports){
function MapHelper() {
    var instance = this;

    instance.createUserMarker = createUserMarker;
    instance.createRestaurantMarker = createRestMarker;
    instance.createMap = createMap;
    instance.configMap = configMap;

    return instance;

    function configMap(mapProvider) {
        mapProvider.configure({
            key: 'AIzaSyCGyphXwy9W9zlMGVGsEgy5_iwr7qLFTMc',
            v: '3.2',
            libraries: 'geometry,visualization'
        });
    }

    function createMap(coords) {
        return {
            center: {
                latitude: coords.latitude,
                longitude: coords.longitude
            },
            zoom: 13,
            options: {
                streetViewControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                }
            },
            control: {} // this is IMPORTANT!
        };
    }

    function createUserMarker(coords, dragEvent) {
        return {
            id: 0,
            coords: {
                latitude: coords.latitude,
                longitude: coords.longitude
            },
            options: {
                draggable: true,
                icon: 'images/markers/user-10.png'
            },
            events: {
                dragend: dragEvent
            }
        };
    }

    function createRestMarker(obj, markerId, clickEvent, dragEvent) {
        var idx = obj.placeIndex;
        return {
            id: markerId,
            coords: {
                latitude: obj.latitude,
                longitude: obj.longitude
            },
            options: {
                draggable: (dragEvent !== null && dragEvent !== undefined) ? true : false,
                clickable: (clickEvent !== null && clickEvent !== undefined) ? true : false,
                opacity: 0.4,
                title: obj.name,
                icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + idx + "|FF0000|000000"
            },
            events: {
                dragend: dragEvent,
                click: clickEvent
            },
            factual_id: obj.factual_id,
            cuisine: obj.cuisine
        };
    }
}

if (!window.MapHelper) {
    window.MapHelper = new MapHelper();
}
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.activate.js":[function(require,module,exports){
(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('ActivateController', activateController);

    activateController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', "$sce", '$scope'];
    function activateController($location, $timeout, authService, $stateParams, $sce, $scope) {

        $scope.updatePageTitle('Account Activation');
        var vm = this;
        vm.activate = activateHandler;
        vm.message = "";
        vm.title = "Account Activation";
        vm.savedSuccessfully = false;
        vm.userId = $stateParams.id;
        vm.code = $stateParams.code;

        // initialize
        vm.activate();

        function activateHandler() {
            if (vm.userId && vm.code) {
                vm.showFaulty = false;
                authService.activate(vm.userId, vm.code).then(function (response) {
                    vm.message = $sce.trustAsHtml("User has been registered successfully. You can login now...Sending you to the login page");
                    vm.savedSuccessfully = true;
                    startTimer();
                }, function (response) {
                    window.helper.handleError(response, vm, "Failed to activate user due to:");
                });
            } else {
                vm.message = "Cannot activate you.";
                vm.showFaulty = true;
            }
        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('login');
            }, 2000);
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.js":[function(require,module,exports){
(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('AccountController', accountController);

    accountController.$inject = ['AuthService', 'DinerService', '$location', '$sce', '$timeout'];
    function accountController(authService, dinerService, $location, $sce, $timeout) {
        var vm = this;

        // properties
        vm.claims = "";
        vm.authentication = authService.authentication;
        vm.showLogin = true;
        vm.showSignup = true;

        // events
        vm.logout = logOutHandler;

        // this is the test method
        vm.loadClaims = loadClaimsHandler;

        activate();

        // event handlers
        function logOutHandler() {
            authService.logOut();
            dinerService.flush();
            window.helper.refreshing($timeout, 0);
        }

        function loadClaimsHandler() {
            authService.loadClaims().then(function (response) {
                if (response && response.data) {
                    vm.claims = "";
                    for (var idx in response.data) {
                        var claim = response.data[idx];
                        vm.claims = vm.claims + claim.Type + ": " + claim.Value + "<br />";
                    }

                    vm.claims = $sce.trustAsHtml(vm.claims);
                }
            });
        }

        function activate() {
            authService.fillAuthData();
            vm.showLogin = authService.authentication.isAuth === false;
            vm.showSignup = authService.authentication.isAuth === false;
            vm.showUser = authService.authentication.isAuth === true;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.login.js":[function(require,module,exports){
(function () {

    var app = angular.module('app');

    app
        .controller('AccountLoginController', accountLoginController);
    accountLoginController.$inject = ['AuthService', 'logger', '$timeout', 'ResumeService', 'NavigationService', 'ModalService', '$rootScope'];
    function accountLoginController(authService, logger, $timeout, resumeService, navigationService, modalService, $rootScope) {
        var vm = this;
        vm.loginData = {
            email: "",
            password: "",
            useRefreshTokens: true // always use refreshtoken unless we want to change it later
        };

        vm.forgetData = {
            email: ""
        };

        vm.title = "Login";

        vm.selectedIndex = "0";
        vm.savedSuccessfully = false;
        vm.message = "";

        // events
        vm.submit = submitHandler;
        vm.close = close;
        vm.loginWithFacebook = loginWithFacebook;
        vm.externalAuthCompleted = externalAuthCompleted;

        activate();

        function close() {
            modalService.closeModal();
        }

        function submitHandler() {
            vm.savedSuccessfully = false;
            vm.message = "";
            if (vm.selectedIndex === "0") {
                loginHandler();
            } else {
                findPasswordHanlder();
            }
        }

        function findPasswordHanlder() {
            if (vm.forgetData.email === "") {
                vm.message = "Please enter the email address of your account to reset password";
                return;
            }

            if (window.helper.isEmail(vm.forgetData.email) === false) {
                vm.message = "Your email address format is not correct";
                return;
            }

            authService.forgetpassword(vm.forgetData.email).then(function () {
                vm.isBusy = false;
                vm.message = "Password reset request is sent!";
                vm.savedSuccessfully = true;
                vm.submitted = true;
                logger.success('Reset password is requested successfully. Check your mail box. You should receive an email to reset your password in 30 minutes. ');

            }, function (response) {
                if (response.status === 404) {
                    vm.message = vm.forgetData.email + " is not registered";
                } else {
                    window.helper.handleError(response, vm, "Failed to request password reset due to:");
                }

                vm.isBusy = false;
            });

            vm.isBusy = true;
        }

        function loginHandler() {
            if (vm.loginData.email === "" || vm.loginData.password === "") {
                vm.message = "Please enter both of your email address and password";
                return;
            }

            if (window.helper.isEmail(vm.loginData.email) === false) {
                vm.message = "Your email address format is not correct";
                return;
            }

            authService.login(vm.loginData).then(
                function () {
                    vm.isBusy = false;
                    vm.submitted = true;
                    vm.message = "Login successfully.";
                    vm.savedSuccessfully = true;
                    logger.success('Login Successfully!');

                    if (resumeService.needResume()) {
                        resumeService.resume();
                    } else {
                        if ($rootScope.$state.is('login')) {
                            navigationService.go('profile.home');
                        } else {
                            window.helper.refreshing($timeout);
                        }
                    }
                },
                function (err) {
                    vm.isBusy = false;
                    window.helper.handleError(err, vm, "Login failed due to:");
                });

            vm.isBusy = true;
        }

        function loginWithFacebook() {
            authService.externalLogin("Facebook", vm);
        }

        function activate() {
            if (resumeService && resumeService.hasMessage && $rootScope.$state.is('login')) {
                vm.message = resumeService.message;
            }

            if ($rootScope.$stateParams.selected) {
                vm.selectedIndex = $rootScope.$stateParams.selected;
            }
        }

        function externalAuthCompleted(fragment) {
            close();

            //If the user does not have a local account set up send them to the profile association page.
            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    username: fragment.external_user_name,
                    email: fragment.email,
                    externalAccessToken: fragment.external_access_token
                };

                navigationService.go('profile.associate');
            }
            else {
                //Obtain access token and redirect to profile home page.
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.getAccessToken(externalData).then(function (response) {
                    navigationService.go('profile.home');
                },
                function (err) {
                    vm.message = err.error_description;
                });
            }
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.reset.js":[function(require,module,exports){
(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('ResetPasswordController', resetController);

    resetController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', '$scope'];
    function resetController($location, $timeout, authService, $stateParams, $scope) {

        $scope.updatePageTitle('Reset Password');

        var vm = this;
        vm.title = "Reset Password";
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.invalid = false;
        vm.resetData = {
            email: $stateParams.email,
            password: "",
            confirmPassword: "",
            code: $stateParams.code
        };

        vm.submit = resetHandler;

        activate();

        function activate() {
            if (!$stateParams.code || $stateParams.code === '') {
                vm.message = "Reset code is invalid, please copy the full URL from your email to your browser.";
                vm.invalid = true;
            } else {
                vm.invalid = false;
            }
        }

        function resetHandler() {
            if (vm.resetData.email === "") {
                vm.message = "Please enter your password";
                return;
            }

            if (vm.resetData.password === "" || vm.resetData.confirmPassword === "") {
                vm.message = "Password and confirm password cannot be empty";
                return;
            }

            if (vm.resetData.password !== vm.resetData.confirmPassword) {
                vm.message = "Password is not the same to confirm password";
                return;
            }

            if (vm.resetData.code === "" || vm.resetData.code === undefined) {
                vm.message = "Reset code is missing, can't update your password";
                return;
            }

            authService.resetpassword(vm.resetData).then(function (response) {
                vm.message = "Your password has been reset successfully. You can now login with your new password. Sending you to the login page.";
                vm.savedSuccessfully = true;
                startTimer();
            }, function (response) {
                window.helper.handleError(response, vm, "Failed to reset password due to:");
            });
        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('login');
            }, 2000);
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.signup.js":[function(require,module,exports){
(function () {

    var app = angular.module('app');

    app.controller('AccountSignupController', accountSignupController);

    accountSignupController.$inject = ['AuthService', 'logger', '$timeout', 'ModalService', 'NavigationService', '$scope'];

    function accountSignupController(authService, logger, $timeout, modalService, navigationService, $scope) {
        var vm = this;
        vm.title = "Sign up";
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.registration = {
            email: "",
            password: "",
            confirmPassword: ""
        };

        vm.showForm = true;
        vm.submit = signupHandler;
        vm.close = close;
        vm.loginWithFacebook = loginWithFacebook;
        vm.externalAuthCompleted = externalAuthCompleted;

        function close() {
            modalService.closeModal();
        }

        function signupHandler() {
            if ($scope.singupForm.$valid !== true) return;

            // all the validations here are redundant after using ng-messages
            if (failGuard()) {
                return;
            }

            authService.saveRegistration(vm.registration).then(function () {
                vm.isBusy = false;
                vm.message = "User is registered successfully! Please check your email box to activate your account.";
                vm.savedSuccessfully = true;
                vm.submitted = true;
                logger.info('Thanks for signing up.');
                vm.showForm = false;
            },
            function (response) {
                vm.isBusy = false;
                window.helper.handleError(response, vm, "Failed to register user due to:");
            });

            vm.isBusy = true;
        }

        function failGuard() {
            if (vm.registration.email === "") {
                vm.message = "Please enter the email address to register";
                return true;
            }

            if (window.helper.isEmail(vm.registration.email) === false) {
                vm.message = "Your email address format is not correct";
                return true;
            }

            if (vm.registration.password === "" || vm.registration.confirmPassword === "") {
                vm.message = "Please enter your password and confirm password to register";
                return true;
            }

            if (vm.registration.password !== vm.registration.confirmPassword) {
                vm.message = "Password doesn't match the confirm password";
                return true;
            }

            return false;
        }

        function loginWithFacebook() {
            authService.externalLogin("Facebook", vm);
        }

        function externalAuthCompleted(fragment) {
            close();

            //If the user does not have a local account set up send them to the profile association page.
            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    username: fragment.external_user_name,
                    email: fragment.email,
                    externalAccessToken: fragment.external_access_token
                };

                navigationService.go('profile.associate');
            }
            else {
                //Obtain access token and redirect to profile home page.
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.getAccessToken(externalData).then(function (response) {
                    navigationService.go('profile.home');
                },
                function (err) {
                    vm.message = err.error_description;
                });
            }
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.associate.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileAssociateController', profileAssociateController);

    profileAssociateController.$inject = ['AuthService', 'ModalService', 'NavigationService', 'logger'];
    function profileAssociateController(authService, modalService, navigationService, logger) {
        var vm = this;

        // properties
        vm.authData = authService.externalAuthData;
        
        vm.title = "You're almost done linking your " + vm.authData.provider + " account!";
        vm.savedSuccessfully = false;
        vm.message = '';       

        // methods
        init();

        // event handlers
        vm.cancel = cancel;
        vm.submit = submit;

        function init() {
            //In the event that we don't have auth data, redirect back to the home page
            //rather than showing a broken form.
            if (!vm.authData || !vm.authData.provider) {
                navigationService.go('app.home');
            }                
        }

        function cancel() {
            navigationService.go('app.home');
        }

        function submit() {

            if (!vm.authData.username || !vm.authData.email) {
                vm.savedSuccessfully = false;
                vm.message = "Whoops! Looks like you're missing some required information!";
                return;
            }

            if (!vm.authData.provider || !vm.authData.externalAccessToken) {
                vm.savedSuccessfully = false;
                vm.message = "Looks like we ran into a problem on our end. Please try linking your account again!";
                return;
            }

            var data = {
                'ExternalAccessToken': vm.authData.externalAccessToken,
                'Provider': vm.authData.provider,
                'Username': vm.authData.username,
                'Email': vm.authData.email
            }

            authService.registerExternalUser(vm.authData).then(
                function (response) {
                    vm.isBusy = false;
                    vm.submitted = true;
                    vm.message = "Login successfully.";
                    vm.savedSuccessfully = true;
                    logger.success('External User Registered Successfully!');

                    if (resumeService.needResume()) {
                        resumeService.resume();
                    } else {
                        if ($rootScope.$state.is('login')) {
                            navigationService.go('profile.home');
                        } else {
                            window.helper.refreshing($timeout);
                        }
                    }
                },
                function (err) {
                    vm.isBusy = false;
                    window.helper.handleError(err, vm, "Login failed due to:");
                }
            );
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.basic.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileBasicInformationController', profileBasicInformationController);

    profileBasicInformationController.$inject = ['AuthService', 'DinerService', 'ModalService', '$location', '$http', 'uploadUrl', 'fileService'];
    function profileBasicInformationController(authService, dinerService, modalService, $location, $http, uploadUrl, fileService) {
        var vm = this;

        // properties
        vm.title = "Basic Information";
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.data = dinerService.profile;
        vm.isBusy = false;
        vm.uploadingFile = "";
        vm.canDeleteAvatar = false;
        vm.isDirty = false;

        // methods
        vm.submit = submitHandler;
        vm.deleteAvatar = deleteHandler;
        vm.resetUpload = resetHandler;
        vm.toggleSidenav = toggleSidenav;
        vm.getDinerImage = getDinerImage;

        // initializer
        init();

        // event handlers 
        function init() {
            // must load the authentication data first
            authService.fillAuthData();
            dinerService.getMyProfile().then(function () {
                vm.data = dinerService.profile;
                if (vm.data.avatar !== "" && vm.data.avatar !== fileService.getSafeAvatarImage()) {
                    vm.canDeleteAvatar = true;
                }
            });
        }

        function submitHandler() {
            if (vm.uploadingFile && vm.uploadingFile !== "") {
                var file = vm.uploadingFile;

                // when we upload, don't specify the path, the uploader will figure it out by "type"
                var filename = authService.authentication.uid + "-" + file.name;

                var fd = new FormData();
                fd.append('filename', filename);
                fd.append('file', file);
                fd.append('type', 'user');

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        //do something on success
                        vm.data.avatar = data;
                        vm.uploadingFile = "";
                        vm.canDeleteAvatar = true;
                        saveProfile();
                    })
                    .error(function (err) {
                        window.helper.handleError(err, vm, "Failed to upload photos due to:");
                    });
            } else {
                saveProfile();
            }
        }

        function saveProfile() {
            dinerService.updateMyProfile().then(
               function () {
                   vm.isBusy = false;
                   vm.savedSuccessfully = true;
                   vm.message = "Your profile has been updated.";

                   if (vm.data.displayName !== authService.authentication.displayName) {
                       authService.authentication.displayName = vm.data.displayName;
                   }
               },
               function (err) {
                   window.helper.handleError(err, vm, "Failed to save profile due to:");
               });
        }

        function deleteHandler() {
            vm.data.avatar = fileService.getSafeAvatarImage();
            vm.canDeleteAvatar = false;
            vm.isDirty = true;
        }

        function resetHandler() {
            vm.uploadingFile = "";
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.cravinghistory.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileCravingHistoryController', profileCravingHistoryController);

    profileCravingHistoryController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileCravingHistoryController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Craving History";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function () {
                    dinerService.getRecentCravings(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve recent cravings due to:");
                        }
                        );
                });
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.dislikecravings.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileDislikeCravingController', profileDislikeCravingController);

    profileDislikeCravingController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileDislikeCravingController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Dislike Craving List";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.selected = [];

        // methods
        vm.submit = submitHandler;
        vm.toggleSidenav = toggleSidenav;

        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function() {
                    dinerService.getDislike(dinerService.profile.id).then(
                        function (response) {
                            vm.selected = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve the disliking cravings due to:");
                        }
                        );
                });
            }
        }

        function submitHandler() {
            authService.fillAuthData();
            if (authService.authentication.isAuth) {
                if (vm.selected !== null && vm.selected.length > 0) {

                    dinerService.getMyProfile().then(function () {
                        var cravingIds = vm.selected.map(function(element) { return element.CravingId; });
                        dinerService.updateDislike(dinerService.profile.id, cravingIds).then(
                            function () {
                                vm.isBusy = false;
                                vm.savedSuccessfully = true;
                                vm.message = "Your disliked cravings have been saved.";
                            },
                            function (err) {
                                window.helper.handleError(err, vm, "Failed to update the disliking cravings due to:");
                            });
                    });
                }
            } else {
                vm.message = "Oops, you are not authenticated..."; // TODO: this shouldn't happen, but if the user opens it from history, we need t auto re-authenticate
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.favorite.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileFavoriteController', profileFavoriteController);

    profileFavoriteController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileFavoriteController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "My Favorite Dishes";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function () {
                    dinerService.getRecentFavorites(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve recent favorites due to:");
                        }
                        );
                });
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('ProfileController', profileController);

    profileController.$inject = ['AuthService', 'DinerService', 'ResumeService', 'NavigationService', '$rootScope', '$scope'];
    function profileController(authService, dinerService, resumeService, navigationService, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Profile";
        vm.menu = buildMenu();
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "account/profile." + vm.selectedItem.key + ".html";

        activate();

        // methods
        vm.checkActive = checkActiveHandler;

        function activate() {
            authService.fillAuthData();
            if (authService.authentication.isAuth !== true) {
                resumeService.createResume(function () { }, "You need to login first to access your profile.");
                navigationService.go('login'); // simply just go there, it will comeback automatically
            }

            dinerService.getMyProfile().then(function () {
                vm.profile = dinerService.profile;
            });
        }

        // event handlers 
        function checkActiveHandler(item) {
            if (vm.selectedItem === item) return "active";
            return "";
        }

        function validateSelectedItem(selectedItem) {
            for (var idx = 0; idx < vm.menu.length; idx++) {
                if (vm.menu[idx].key === selectedItem) {
                    $scope.updatePageTitle('OurCraving -> Profile -> ' + vm.menu[idx].title);
                    return vm.menu[idx];
                }
            }

            return vm.menu[0];
        }

        function buildMenu() {
            return [
            {
                key: 'basic',
                link: "profile.home.detail({selected:'basic'})",
                title: 'Basic Information',
                icon: 'account_box'
            },
            {
                key: 'dislike',
                link: "profile.home.detail({selected:'dislike'})",
                title: 'Dislike Cravings',
                icon: 'favorite_outline'
            },
                {
                    key: 'favorite',
                    link: "profile.home.detail({selected:'favorite'})",
                    title: 'Favorite Dishes',
                    icon: 'favorite'
                },
                {
                    key: 'mydish',
                    link: "profile.home.detail({selected:'mydish'})",
                    title: 'My Added Dishes',
                    icon: 'restaurant_menu'
                },
                {
                    key: 'myreview',
                    link: "profile.home.detail({selected:'myreview'})",
                    title: 'My Reviews',
                    icon: 'rate_review'
                },
                {
                    key: 'settings',
                    link: "profile.home.detail({selected:'settings'})",
                    title: 'Settings',
                    icon: 'settings'
                },
                {
                    key: 'cravinghistory',
                    link: "profile.home.detail({selected:'cravinghistory'})",
                    title: 'Craving History',
                    icon: 'history'
                },
                {
                    key: 'updatepassword',
                    link: "profile.home.detail({selected:'updatepassword'})",
                    title: 'Update Password',
                    icon: 'security'
                }
            ];
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.mydish.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileMyDishController', profileMyDishController);

    profileMyDishController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileMyDishController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Added Dishes";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function () {
                    dinerService.getRecentAddedDishes(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve my dishes due to:");
                        }
                        );
                });
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.myreview.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileMyReviewController', profileMyReviewController);

    profileMyReviewController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileMyReviewController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Reviews";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function () {
                    dinerService.getRecentReviews(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve my reviews due to:");
                        }
                        );
                });
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.settings.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileSettingsController', profileSettingsController);

    profileSettingsController.$inject = ['AuthService', 'RecentDishService', 'ModalService'];
    function profileSettingsController(authService, recentDishService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Viewed Dishes";
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.recentDishTotal = 0;

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        vm.clearupRecentDishes = clearupRecentDishes;

        init();

        // event handlers
        function init() {
            recentDishService.loadRecent();
            vm.recentDishTotal = recentDishService.dishes.length;
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function clearupRecentDishes() {
            recentDishService.flush();
            vm.recentDishTotal = recentDishService.dishes.length;
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.updatepassword.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileUpdatePasswordController', profileUpdatePasswordController);

    profileUpdatePasswordController.$inject = ['AuthService', 'ModalService', '$location', '$timeout', '$scope'];
    function profileUpdatePasswordController(authService, modalService, $location, $timeout, $scope) {
        var vm = this;

        // properties
        vm.title = "Udpate Password";
        vm.data = {
            currentPassword: "",
            newPassword: "",
            newConfirmPassword: ""
        };
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.submit = updatePasswordHandler;
        vm.updatePassword = updatePasswordHandler;
        vm.toggleSidenav = toggleSidenav;

        // event handlers 
        function updatePasswordHandler() {

            authService.fillAuthData();

            if (authService.authentication.isAuth === false || authService.authentication.email === "") {
                vm.message = "You appear to have not been authenticated yet, you may need to log out first and try again";
                return;
            }

            if (vm.data.currentPassword === "") {
                vm.message = "Current Password cannot be empty";
                return;
            }

            if (vm.data.newPassword === "" || vm.data.newConfirmPassword === "") {
                vm.message = "New Password cannot be empty";
                return;
            }

            if (vm.data.newConfirmPassword !== vm.data.newPassword) {
                vm.message = "New password does not match the new confirm password";
                return;
            }

            var changeData = {
                Email: authService.authentication.email,
                CurrentPassword: vm.data.currentPassword,
                NewPassword: vm.data.newPassword,
                NewConfirmPassword: vm.data.newConfirmPassword
            };

            authService.changepassword(changeData).then(function (response) {
                vm.message = "Your password has been changed successfully. Logging you out now because you need to log in with your new password again.";
                vm.savedSuccessfully = true;
                startTimer();
            }, function (response) {
                window.helper.handleError(response, vm, "Failed to update password due to:");
            });

        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                authService.logOut();
                $location.path('/');
            }, 3000);
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }
    }

}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.cache.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminCacheController', adminCacheController);

    adminCacheController.$inject = ['AuthService', '$cacheFactory', 'ReferenceDataService'];
    function adminCacheController(authService, $cacheFactory, refDataService) {

        authService.fillAuthData();

        var vm = this;
        vm.data = $cacheFactory.get('$http');
        vm.message = '';
        vm.savedSuccessfully = false;
        vm.hasCache = vm.data.info().size > 0;
        vm.refDataKeys = [];

        // methods
        vm.removeAll = removeAll;
        vm.flushRefData = flushRefData;

        // init
        activate();

        // event handlers 
        function flushRefData(key) {
            refDataService.flush(key);
            loadRefDataKeys();
        }

        function removeAll() {
            vm.savedSuccessfully = false;
            vm.message = '';

            if (vm.data) {
                vm.data.removeAll();
                vm.data = $cacheFactory.get('$http');
                vm.hasCache = vm.data.info().size > 0;
                vm.savedSuccessfully = true;
                vm.message = 'All Caches are cleaned up';
            }
        }

        // helpers
        function activate() {
            loadRefDataKeys();
        }

        function loadRefDataKeys() {
            vm.refDataKeys = refDataService.getKeys();
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.cravingtags.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminCravingTagsController', adminCravingTagsController);

    adminCravingTagsController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService'];
    function adminCravingTagsController(authService, adminService, navigationService, modalService) {

        authService.fillAuthData();

        // properties
        var vm = this;
        vm.message = '';
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getCravingTags() {
            adminService.getAllCravingTags(vm.query.page, vm.query.limit).then(function (response) {
                vm.tags = response.data.Items;
                vm.total = response.data.PageSize * response.data.PageCount;
            });
        }

        // init
        activate();

        // event handlers 
        vm.onPaginationChange = onPaginationChange;
        vm.disableTag = disableTag;
        vm.enableTag = enableTag;

        // helpers
        function activate() {
            getCravingTags();
        }

        function onPaginationChange(page, limit) {
            vm.query.page = page;
            vm.query.limit = limit;
            getCravingTags();
        }

        function disableTag(tagId) {
            adminService.updateCravingTag(tagId, false).then(function () {
                getCravingTags();
            });
        }

        function enableTag(tagId) {
            adminService.updateCravingTag(tagId, true).then(function () {
                getCravingTags();
            });
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.dishes.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminDishController', adminDishController);

    adminDishController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService', 'fileService'];
    function adminDishController(authService, adminService, navigationService, modalService, fileService) {

        authService.fillAuthData();

        // properties
        var vm = this;
        vm.message = '';
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getRecentDishes() {
            adminService.getAllRecentDishes(vm.query.page, vm.query.limit).then(function (response) {
                vm.dishes = response.data.Items;
                vm.total = response.data.PageSize * response.data.PageCount;
            });
        }

        // init
        activate();

        // event handlers 
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.openDetail = openDetail;
        vm.onPaginationChange = onPaginationChange;
        vm.removeDish = removeDish;

        // helpers
        function activate() {
            getRecentDishes();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function openDetail(dish) {
            navigationService.go('dish.detail', { 'id': dish.DishId });
        }

        function onPaginationChange(page, limit) {
            vm.query.page = page;
            vm.query.limit = limit;
            getRecentDishes();
        }

        function removeDish(dishId) {
            modalService.openModal('admin/moderation_reason_modal.html', 'AdminModerationModalController').then(function (data) {
                if (data && data !== 'cancel' && data.reason) {
                    adminService.removeDish(dishId, data.reason).then(function () {
                        getRecentDishes();
                    });
                }
            });
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.files.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminFilesController', adminFilesController);

    adminFilesController.$inject = ['AuthService', 'AdminService', 'fileServer'];
    function adminFilesController(authService, adminService, fileServer) {

        authService.fillAuthData();

        var vm = this;
        vm.message = '';
        
        // methods
        
        // init
        activate();

        // event handlers 
        
        // helpers
        function activate() {
            
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminController', adminController);

    adminController.$inject = ['AuthService', 'ResumeService', 'NavigationService', '$rootScope', '$scope'];
    function adminController(authService, resumeService, navigationService, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Administration";
        vm.overlayTitle = "";
        vm.menu = buildMenu();
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "admin/admin." + vm.selectedItem.key + ".html";
        vm.hasAccess = true;

        // methods
        vm.checkActive = checkActiveHandler;

        // init
        activate();

        // event handlers 
        function checkActiveHandler(item) {
            if (vm.selectedItem === item) return "active";
            return "";
        }

        function validateSelectedItem(selectedItem) {
            for (var idx = 0; idx < vm.menu.length; idx++) {
                if (vm.menu[idx].key === selectedItem) {
                    $scope.updatePageTitle('OurCraving -> Administration -> ' + vm.menu[idx].title);
                    return vm.menu[idx];
                }
            }

            return vm.menu[0];
        }

        // helpers
        function activate() {
            authService.fillAuthData();
            if (authService.authentication.isAuth !== true) {
                resumeService.createResume(function () { }, "You need to login first to access the admin page.");
            }
        }

        function buildMenu() {
            return [
            {
                key: 'dishes',
                link: "admin.home.detail({selected:'dishes'})",
                title: 'Recent Dishes',
                icon: 'restaurant_menu'
            },
            {
                key: 'reviews',
                link: "admin.home.detail({selected:'reviews'})",
                title: 'Recent Reviews',
                icon: 'comment'
            },
                {
                    key: 'users',
                    link: "admin.home.detail({selected:'users'})",
                    title: 'Recent Users',
                    icon: 'people'
                },
                {
                    key: 'files',
                    link: "admin.home.detail({selected:'files'})",
                    title: 'Recent Files',
                    icon: 'photo'
                },
                {
                    key: 'cravingtags',
                    link: "admin.home.detail({selected:'cravingtags'})",
                    title: 'Craving Tags',
                    icon: 'flag'
                }
                ,
                {
                    key: 'cache',
                    link: "admin.home.detail({selected:'cache'})",
                    title: 'Cache Management',
                    icon: 'cached'
                }
            ];
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.moderation.modal.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminModerationModalController', modalAdminModerationController);

    modalAdminModerationController.$inject = ['ModalService', 'modalItem'];

    function modalAdminModerationController(modalService) {
        var vm = this;
        vm.message = '';
        vm.reasonData = { reason: '' };

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function (result) {
            if (!result.reason || result.reason.trim() === "") {
                vm.savedSuccessfully = false;
                vm.message = "Please enter a reason before submitting this moderation request.";
                return false;
            }

            modalService.submitModal(result);
        };
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.reviews.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminReviewController', adminReviewController);

    adminReviewController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService', 'fileService'];
    function adminReviewController(authService, adminService, navigationService, modalService, fileService) {

        authService.fillAuthData();

        var vm = this;
        vm.message = '';
        // properties
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getRecentReviews() {
            adminService.getAllRecentReviews(vm.query.page, vm.query.limit).then(function (response) {
                vm.reviews = response.data.Items;
                vm.total = response.data.Total;
            });
        }

        // init
        activate();

        // event handlers 
        vm.openDishDetail = openDishDetail;
        vm.getDinerImage = getDinerImage;
        vm.removeReview = removeReview;

        // helpers
        function activate() {
            getRecentReviews();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function openDishDetail(dishId) {
            navigationService.go('dish.detail', { 'id': dishId });
        }

        function removeReview(reviewId) {
            modalService.openModal('admin/moderation_reason_modal.html', 'AdminModerationModalController').then(function (data) {
                if (data && data !== 'cancel' && data.reason) {
                    adminService.removeReview(reviewId, data.reason).then(function () {
                        getRecentReviews();
                    });
                }
            });
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.users.js":[function(require,module,exports){
(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminUserController', adminReviewController);

    adminReviewController.$inject = ['AuthService', 'AdminService', 'fileService'];
    function adminReviewController(authService, adminService, fileService) {

        authService.fillAuthData();

        var vm = this;
        vm.message = '';
        // properties
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getRecentUsers() {
            adminService.getAllRecentUsers(vm.query.page, vm.query.limit).then(function (response) {
                vm.users = response.data.Items;
                vm.total = response.data.Total;
            });
        }

        // init
        activate();

        // event handlers 
        vm.getDinerImage = getDinerImage;

        // helpers
        function activate() {
            getRecentUsers();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\app.constant.js":[function(require,module,exports){
(function () {
    'use strict';

    // angular.module('oc.services', ['ngResource'])
    var app = angular.module('app');

    app
        .constant("ocService", 'localhost:40104')
        .constant("baseUrl", 'http://localhost:40104/api/v1/')
        .constant("baseUrl2", 'http://localhost:40104/api/v2/')
        .constant("authUrl", 'http://localhost:40104/api/v2/account')
        .constant("tokenUrl", 'http://localhost:40104/oauth/token')
        .constant('uploadUrl', "http://localhost:54991/Uploader/UploadHandler.ashx")
        .constant('fileServer', "http://localhost:54991")
        .constant('authSettings', { clientId: 'ocWeb' });
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\app.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app', [
      'ngResource',
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'ui.utils',
      'ui.event',
      'ui.jq',
      'ui.bootstrap',
      'ui.select',
      'LocalStorageModule',
      'ngAnimate',
      'ngplus',
      'md.data.table',
      'ngMaterial',
      'ngMdIcons',
      'ngMessages',
      'angular.filter',
      'uiGmapgoogle-maps'
    ]);

    var app = angular.module('app')
      .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
          function ($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
              app.controller = $controllerProvider.register;
              app.directive = $compileProvider.directive;
              app.filter = $filterProvider.register;
              app.factory = $provide.factory;
              app.service = $provide.service;
              app.constant = $provide.constant;
              app.value = $provide.value;

              $httpProvider.interceptors.push('authInterceptorService');

              //Enable cross domain calls
              $httpProvider.defaults.useXDomain = true;

              //Remove the header containing XMLHttpRequest used to identify ajax call 
              //that would prevent CORS from working
              delete $httpProvider.defaults.headers.common['X-Requested-With'];

              //$httpProvider.defaults.headers.post = {
              //    'Access-Control-Allow-Origin': '*',
              //    'Access-Control-Allow-Methods': 'POST',
              //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
              //};

              $httpProvider.defaults.headers.put = {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
                  'Content-Type': 'application/json'
              };
          }
        ])
    .config(function ($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ECEFF1',
            '200': '1976D2'
        });

        $mdThemingProvider.definePalette('customGreen', customBlueMap);
        $mdThemingProvider.theme('default')
          .primaryPalette('customGreen', {
              'default': '500',
              'hue-1': '50',
              'hue-2': '200'
          }).accentPalette('red');

        $mdThemingProvider.theme('input', 'default').primaryPalette('grey');
    });;

    app.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.account.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('login', { // this route is used to show the login form in the full page
            url: '/login?selected',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html'
                },
                'content@login': {
                    templateUrl: 'account/loginPage.html',
                    controller: 'AccountLoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile', {
            "abstract": true,
            url: '/profile',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html',
                    controller: 'AccountController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile.activate', {
            url: '/activate?email&id&code',
            views: {
                "content@profile": {
                    templateUrl: 'account/activate.html',
                    controller: 'ActivateController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile.reset', {
            url: '/reset?email&id&code',
            views: {
                "content@profile": {
                    templateUrl: 'account/reset.html',
                    controller: 'ResetPasswordController',
                    controllerAs: 'vm'
                }
            }
        })
    .state('profile.home', {
        url: '/home',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.home.detail', {
        url: '/:selected',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.associate', {
        url: '/associate',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.associate.html',
                controller: 'ProfileAssociateController',
                controllerAs: 'vm'
            }
        }
    })
    ;
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.admin.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider.state('admin',
        {
            "abstract": true,
            url: '/admin',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.pageTitle = 'Administrator';
                        }
                    ]
                }
            }
        })
        .state('admin.home', {
            url: '/home',
            views: {
                'content@admin': {
                    templateUrl: 'admin/home.html',
                    controller: 'AdminController',
                    controllerAs: 'vm'
                }
            }
        })
         .state('admin.home.detail', {
             url: '/:selected',
             views: {
                 'content@admin': {
                     templateUrl: 'admin/home.html',
                     controller: 'AdminController',
                     controllerAs: 'vm'
                 }
             }
         })
    ;
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.dish.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('dish', {
            "abstract": true,
            url: '/dish',
            views: {
                'app': {
                    templateUrl: 'layout/shell_with_left_sidebar.html'
                }
            }
        })
        .state('dish.add', {
            url: '/add?input',
            resolve: {
                loader: [
                    'LoaderFactory', function (loaderFactory) {
                        var instance = new loaderFactory();
                        var dish = {};
                        dish.type = "New"; // this is not used yet
                        instance.current = dish;
                        return instance;
                    }
                ]
            },
            views: {
                'sidebar@dish': {
                    templateUrl: 'dish/map.add.html',
                    controller: 'DishMapEditController',
                    controllerAs: 'vm'
                },
                'content@dish': {
                    templateUrl: 'dish/dish.add.html',
                    controller: 'DishFieldEditController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('dish.detail', {
            url: '/detail/:id',
            resolve: {
                restaurantLoader: ['LoaderFactory', function (loaderFactory) {
                    return new loaderFactory();
                }]
            },
            views: {
                'sidebar@dish': {
                    templateUrl: 'dish/map.viewer.html',
                    controller: 'RestaurantMapController',
                    controllerAs: 'vm'
                },
                'content@dish': {
                    templateUrl: 'dish/dish.detail.html',
                    controller: 'DishDetailController',
                    controllerAs: 'vm'
                }
            }
        });
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.home.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
           .state('app', {
               "abstract": true,
               url: '',
               views: {
                   'app': {
                       templateUrl: 'layout/shell.html'
                   }
               }
           })
           .state('app.home', {
               url: '/home',
               views: {
                   'content@app': {
                       templateUrl: 'craving/home.html',
                       controller: "CravingTagsController",
                       controllerAs: "vm"
                   }
               }
           })
       .state('app.home.search', {
           url: '^/search/:criteria',
           views: {
               'content@app': {
                   templateUrl: 'craving/search.html',
                   controller: "SearchCravingController",
                   controllerAs: "vm"
               }
           }
       })
           .state('app.help', {
               url: '^/help',
               views: {
                   'content@app': {
                       templateUrl: 'sys/help.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - Help & FAQ';
                       }]
                   }
               }
           })
           .state('app.about', {
               url: '^/aboutus',
               views: {
                   'content@app': {
                       templateUrl: 'sys/about.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - About Us';
                       }]
                   }
               }
           })
           .state('app.termsconditions', {
               url: '^/termsconditions',
               views: {
                   'content@app': {
                       templateUrl: 'sys/terms.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - Terms and Conditions';
                       }]
                   }
               }
           })
           .state('app.location', {
               url: '^/location',
               views: {
                   'content@app': {
                       templateUrl: 'sys/location.html',
                       controller: 'LocationController',
                       controllerAs: 'vm'
                   }
               }
           });
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.js":[function(require,module,exports){
(function () {
    'use strict';

    angular.module('app')
     .run(['$rootScope', '$state', '$stateParams', 'GeoService', '$timeout','$location', '$window',
            function ($rootScope, $state, $stateParams, geoService, $timeout, $location, $window) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                var defaultLocation = window.helper.getDefaultLocation();
                $rootScope.position = defaultLocation;
                loadGeoLocation();

                // google analytics
                $rootScope.$on('$stateChangeSuccess',
                    function (event) {
                        if (!$window.ga)
                            return;

                        $window.ga('send', 'pageview', { page: $location.path() });
                    });

                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    if ((defaultLocation.coords.latitude === $rootScope.position.coords.latitude && $rootScope.position.coords.longitude === defaultLocation.coords.longitude)
                    || ($rootScope.position === undefined || $rootScope.position.coords === undefined)) {
                        // hmm, let's try again, because it seems we failed to load a user location
                        loadGeoLocation();
                    }
                }, 6000);

                // TODO: this code doesn't seem to run properly, sometimes, not sure if it's only happening in the browserify environment
                function loadGeoLocation() {
                    var q = geoService.initialize();
                    q.then(function () {
                        $rootScope.position = geoService.position;
                    }).catch(function () {
                        $rootScope.position = defaultLocation;
                    });
                }

                $rootScope.constructor.prototype.$off = function (eventName, fn) {
                    if (this.$$listeners) {
                        var eventArr = this.$$listeners[eventName];
                        if (eventArr) {
                            for (var i = 0; i < eventArr.length; i++) {
                                if (eventArr[i] === fn) {
                                    eventArr.splice(i, 1);
                                }
                            }
                        }
                    }
                };
            }
     ])
      .config(
        ['$stateProvider', '$urlRouterProvider','$locationProvider',
          function ($stateProvider, $urlRouterProvider, $locationProvider) {

              $urlRouterProvider.otherwise('/home');

              configHomeRoutes($stateProvider);
              configDishRoutes($stateProvider);
              configAccountRoutes($stateProvider);
              configProposalRoutes($stateProvider);
              configAdminRoutes($stateProvider);
              configRestaurantRoutes($stateProvider);

              $locationProvider.html5Mode(false).hashPrefix('!');
          }
        ]
      );

    function configHomeRoutes($stateProvider) {
        var homeRoute = require("./config.router.home.js");
        homeRoute($stateProvider);
    }

    function configDishRoutes($stateProvider) {
        var dishRoute = require("./config.router.dish.js");
        dishRoute($stateProvider);
    }

    function configAccountRoutes($stateProvider) {
        var accountRoute = require("./config.router.account.js");
        accountRoute($stateProvider);
    }

    function configProposalRoutes($stateProvider) {
        var proposalRoute = require("./config.router.proposal.js");
        proposalRoute($stateProvider);
    }

    function configAdminRoutes($stateProvider) {
        var proposalRoute = require("./config.router.admin.js");
        proposalRoute($stateProvider);
    }

    function configRestaurantRoutes($stateProvider) {
        var restRoute = require("./config.router.restaurant.js");
        restRoute($stateProvider);
    }
})();

},{"./config.router.account.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.account.js","./config.router.admin.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.admin.js","./config.router.dish.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.dish.js","./config.router.home.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.home.js","./config.router.proposal.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.proposal.js","./config.router.restaurant.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.restaurant.js"}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.proposal.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider.state('proposal',
        {
            "abstract": true,
            url: '/proposal',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html'
                }
            }
        })
        .state('proposal.home', {
            url: '/craving',
            views: {
                'content@proposal': {
                    templateUrl: 'proposal/home.html',
                    controller: 'MyProposalController',
                    controllerAs: 'vm'
                }
            }
        })
         .state('proposal.home.detail', {
             url: '/:key',
             views: {
                 'content@proposal': {
                     templateUrl: 'proposal/home.html',
                     controller: 'MyProposalController',
                     controllerAs: 'vm'
                 }
             }
         })
        // this is used by other users to open the craving proposal
        // if the owner sends this link manually, email querystring is empty; 
        // if the owner uses our online form to send to a friend, the querystring should contain the value for each email entered in the box 
        .state('proposal.view', {
            url: '/view/:key?email&confirm',
            views: {
                'content@proposal': {
                    templateUrl: 'proposal/view.html',
                    controller: 'ViewProposalController',
                    controllerAs: 'vm'
                }
            }
        });
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.restaurant.js":[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider.state('restaurant',
        {
            "abstract": true,
            url: '/restaurant',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.pageTitle = 'Restaurant';
                        }
                    ]
                }
            }
        })
         .state('restaurant.home', {
             url: '/:id',
             views: {
                 'content@restaurant': {
                     templateUrl: 'restaurant/home.html',
                     controller: 'RestaurantController',
                     controllerAs: 'vm'
                 }
             }
         })
    ;
};
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\core\\main.js":[function(require,module,exports){
(function () {
    "use strict";

    angular.module('app')
        .controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {

            $scope.app = {
                settings: {
                    pageTitle: 'OurCraving - where you find your cravings',
                    htmlClass: ''
                }
            };

        $scope.updatePageTitle = function(title) {
            $scope.app.settings.pageTitle = title;
        };

    }]);

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\craving\\craving.search.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCravingController', searchCravingController);

    searchCravingController.$inject = ['CravingService', 'NavigationService', '$rootScope', '$scope', 'fileService'];

    function searchCravingController(cravingService, navigationService, $rootScope, $scope, fileService) {
        /* jshint validthis:true */
        var iconIdx = 0;
        var vm = this;
        vm.title = 'Search Cravings';
        vm.searchResults = [];
        vm.input = $rootScope.$stateParams.criteria;
        vm.searchText = "";
        vm.searching = false;
        vm.addDishIcons = ['add', 'restaurant_menu'];
        vm.addDishIcon = vm.addDishIcons[iconIdx];
        vm.currentPage = 1;
        vm.resultTotal = 1;
        vm.hasMore = false;

        // events
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.formateDate = formateDate;
        vm.openDetail = openDetail;
        vm.loadMore = loadMore;

        activate();
        var oldInput = "";

        function activate() {
            vm.position = $rootScope.position;
            vm.currentPage = 1;
            vm.resultTotal = 0;
            vm.loaded = 0;
            vm.hasMore = false;
            $scope.$watch('vm.input', function () {
                if (vm.input === undefined || vm.input.trim().length === 0) {
                    vm.searchResults = [];
                }
                else if (vm.input !== oldInput) {
                    vm.searchResults = [];
                    performSearch();
                }
            });

            setIcons();
            fixMaterialTemp();
        }

        function loadMore() {
            if (!vm.hasMore) return;
            vm.currentPage++;
            performSearch();
        }

        function performSearch() {
            vm.searching = true;
            var param = window.helper.replaceAll(vm.input, '+', ',');
            vm.searchText = param;

            var city = $rootScope.position.userLocation.city;
            var location = $rootScope.position.coords.latitude + "," + $rootScope.position.coords.longitude;
            cravingService.searchCraving(param, city, location, vm.currentPage).then(function (response) {
                vm.resultTotal = response.data.Total;
                if (vm.searchResults.length === 0) {
                    vm.searchResults = response.data.Items;
                } else {
                    vm.searchResults = vm.searchResults.concat(response.data.Items);
                }

                oldInput = vm.input;
                vm.searching = false;
                vm.hasMore = (vm.searchResults.length < vm.resultTotal);
            }, function(err) {
                vm.searching = false;
            });
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(url) {
            return fileService.getSafePreviewImage(url);
        }

        function openDetail(dish) {
            navigationService.go('dish.detail', { 'id': dish.DishId });
        }

        function formateDate(d) {
            if (d)
                return window.helper.getPostDateDescription(d);
            return "";
        }

        function setIcons() {
            setInterval(function () {
                if (iconIdx === 0) {
                    iconIdx = 1;
                } else {
                    iconIdx = 0;
                }
                vm.addDishIcon = vm.addDishIcons[iconIdx];
                $scope.$apply();
            }, 5000);
        }

        // material has a bug that once selecting more than 1 chip, a mask added to the page is not removed. 
        // it's reported to github already, but don't know who is fixing it. now this is a temp fix to make sure the app still function
        function fixMaterialTemp() {
            var result = document.getElementsByClassName("md-scroll-mask");
            var elements = angular.element(result);
            angular.forEach(elements, function (ele) {
                ele.remove();
            });
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\craving\\craving.tags.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CravingTagsController', cravingTagsController);

    cravingTagsController.$inject = ['CravingService', 'NavigationService', '$rootScope', '$scope'];

    function cravingTagsController(cravingService, navigationService, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var pageSize = 20;

        // properties 
        vm.offset = 0;
        vm.all = [];
        vm.cravings = [];
        vm.cravingStyles = [];
        vm.hasMore = false;
        
        // events
        vm.search = searchHandler;
        vm.loadMore = loadMore;

        activate();

        function activate() {
            vm.position = $rootScope.position;
            loadTrendingForLocation(vm.position.coords.latitude + "," + vm.position.coords.longitude);
            $scope.updatePageTitle('OurCraving - where you find your cravings');
        }

        function loadTrendingForLocation(location) {
            cravingService.getTrending(location).then(function (response) {
                // TODO: this array contains searchtimes, but now we are not using it, so just trim to string only
                vm.all = $.map(response.data.Items, function (val) { return val.CravingTag; });
                vm.offset = 0;
                loadMore();
            }, function (err) {
                vm.cravings = getDefaultCravings();
                getRandomCravingStyle();
            });
        }

        function loadMore() {
            var currentOffset = vm.offset + pageSize;
            vm.cravings = vm.all.slice(0, currentOffset);
            vm.offset = currentOffset;
            vm.hasMore = vm.offset < vm.all.length;
            getRandomCravingStyle();
        }

        // this is only here, if we failed to retrieve from service
        // but again, why bother, we should find a different approach to handle error
        function getDefaultCravings() {
            return ["Beef", "Pork", "Chicken", "Cheese", "Chocalate", "Sweet", "Fish", "Shrimp", "Ramen", "Beer", "Lamb", "Pork Belly",
                "Bacon", "Taco", "Coffee", "Spicy", "Sandwich", "Soup", "Noodle", "Nuts", "Ice Cream", "Pasta", "Seafood", "Udon",
                "Deep Fry", "Candy", "Cake", "Dessert", "Pho", "Rice", "Spaghetti", "Bean", "Mashed Potatoes", "Salami", "Tomatillo",
                "Lemon", "Green Tea", "Hummus", "Eggplant", "Cayenne Pepper"];
        }

        function getRandomCravingStyle() {
            vm.cravingStyles = [];
            for (var idx = 0; idx < vm.cravings.length; idx ++) {
                vm.cravingStyles.push(shouldPrimary() ? 'md-primary' : 'md-accent');
            }
        }

        function searchHandler(criteria) {
            var idx = getCriteriaIndex(criteria);
            var isSelected = idx >= 0;
            if (isSelected) {
                removeCriteria(criteria, idx);
            } else {
                addCriteria(criteria);
            }

            performSearch();
        }

        function removeCriteria(criteria, idx) {
            if (idx >= 0) {
                var currentCriteria = $rootScope.$stateParams.criteria;
                currentCriteria = currentCriteria.replace(criteria + "+", "");
                currentCriteria = currentCriteria.replace("+" + criteria, "");
                currentCriteria = currentCriteria.replace(criteria, "");
                $rootScope.$stateParams.criteria = currentCriteria;
            }
        }

        function addCriteria(criteria) {
            if ($rootScope.$stateParams.criteria && $rootScope.$stateParams.criteria.length > 0) {
                $rootScope.$stateParams.criteria = $rootScope.$stateParams.criteria + "+" + criteria;
            }
            else
                $rootScope.$stateParams.criteria = criteria;
        }

        function getCriteriaIndex(criteria) {
            if ($rootScope.$stateParams.criteria) {
                var currentCriteria = $rootScope.$stateParams.criteria;
                var idx = currentCriteria.indexOf(criteria);
                return idx;
            }

            return -1;
        }

        function performSearch() {
            var currentCriteria = $rootScope.$stateParams.criteria;
            if (currentCriteria.length < 1) {
                navigationService.go('app.home');
            } else {
                var param = buildCriteria(currentCriteria);
                navigationService.go('app.home.search', { 'criteria': param });
            }
        }

        function buildCriteria(currentCriteria) {
            return currentCriteria;
        }

        function shouldPrimary() {
            var should = window.helper.randomInt(20) === 10;
            return should;
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.add.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishFieldEditController', dishFieldEditController);

    dishFieldEditController.$inject = [
        'GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService',
        'ResumeService', 'AuthService', 'CravingService',
        'loader', 'uploadUrl',
        'ModalService',
        '$timeout', '$scope', '$rootScope', '$http'];

    function dishFieldEditController(
        geoService, restService, dinerService, refService,
        resumeService, authService, cravingService,
        dishLoader, uploadUrl,
        modalService,
        $timeout, $scope, $rootScope, $http) {
        /* jshint validthis:true */
        var vm = this;
        // properties 
        vm.dish = dishLoader.current;
        vm.dish.restaurant = {};
        vm.dish.selectedCravings = [];
        vm.dish.rating = 0;
        vm.dish.uploadImage = '';

        vm.overStar = false;
        vm.showReviewBox = false;
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.invalid = {};
        vm.invalid.city = false;
        vm.invalid.dishname = false;
        vm.showAddDish = true;
        vm.isBusy = false;
        vm.fileInvalid = false;

        vm.maxRating = 5;
        vm.ratingLabel = "";
        vm.percent = 0;

        // events
        vm.matchDish = matchDish;
        vm.hoveringOver = hoveringOver;
        vm.hoveringLeave = hoveringLeave;
        vm.resetUpload = resetUpload;
        vm.submit = submitHandler;
        vm.resetAddDish = resetAddDish;
        vm.openMap = openMap;
        vm.onFileRead = onFileRead;

        // initialize
        activate();

        // helpers
        function activate() {
            setUserLocation($rootScope.position);

            authService.fillAuthData();
            if (authService.authentication.isAuth === false) {
                resumeService.flush();
                resumeService.createResume(function () {
                    // we don't need to do anything, it will come back to this page after logging in
                }, "Must login to add a new dish");
            }

            $scope.updatePageTitle('OurCraving - suggest a new dish');
            dishLoader.addLoadedEventListener(function (restData) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    if (restData) {
                        vm.dish.restaurant.name = restData.name;
                        vm.dish.restaurant.address = restData.address;
                        vm.dish.restaurant.postalCode = restData.postcode;
                        vm.dish.restaurant.phoneNumber = restData.tel;
                        vm.dish.restaurant.latitude = restData.latitude;
                        vm.dish.restaurant.longitude = restData.longitude;
                        vm.dish.restaurant.placeId = restData.factual_id;
                    } else {
                        vm.dish.restaurant.Name = null;
                    }
                });
            });

            initializeSelectedCravings();
        }

        function openMap() {
            modalService.toggleSidenav("left").then(function () {
                $("#left").trigger('sidenav.' + (modalService.isSidenavOpen("left") === true ? 'open' : 'close'));
            });
        }

        function onFileRead(file, content) {
            if (file.size > 5000000) {
                vm.fileInvalid = true;
            } else {
                vm.fileInvalid = false;
            }
        }

        function resetUpload() {
            vm.dish.uploadImage = '';
        }

        function matchDish(query) {
            if (!query || !vm.userLocation) return;

            // the server has a  constraint that it only searches if the given name has 5 or more characters 
            if (query.length <= 5) return;

            restService.matchDish(query).then(function (response) {
                vm.matchingDishes = response.data.Items;
            });
        };

        function hoveringOver(value) {
            vm.overStar = value;
            vm.percent = 100 * (value / vm.maxRating);
            buildRatingLabel(value);
        };

        function hoveringLeave() {
            if (vm.overStar !== vm.rating) {
                vm.percent = 100 * (vm.dish.rating / vm.maxRating);
                buildRatingLabel(vm.dish.rating);
            }

            vm.overStar = null;
        };

        $scope.$watch('vm.dish.rating', function () {
            if (vm.dish.rating > 0)
                vm.showReviewBox = true;
            else
                vm.showReviewBox = false;
        });

        function submitHandler() {
            if ($scope.dishForm.$valid !== true) return;

            if (vm.fileInvalid) {
                vm.message = "Image size is too big... must be less than 5 MB.";
                return;
            }

            vm.message = "";

            dinerService.getMyProfile().then(function () {
                vm.isBusy = true;
                restService.addDish(vm.dish, dinerService.profile, vm.userLocation).then(function (response) {
                    vm.showAddDish = false;
                    var dishId = response.data;
                    vm.isBusy = false;
                    uploadImage(dishId);
                },
                function (err) {
                    window.helper.handleError(err, vm);
                    vm.isBusy = false;
                });
            });
        }

        function uploadImage(id) {
            vm.isBusy = true;
            vm.savedSuccessfully = true;
            if (vm.dish.uploadImage && vm.dish.uploadImage !== "") {
                var file = vm.dish.uploadImage;
                vm.savedSuccessfully = false;

                // when we upload, don't specify the path, the uploader will figure it out by "type"
                var fd = new FormData();
                fd.append('file', file);
                fd.append('id', id);
                fd.append('dinerId', dinerService.profile.id);

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        saveImage(data, id);
                        vm.isBusy = false;
                        vm.savedSuccessfully = true;
                    })
                    .error(function (err) {
                        window.helper.handleError(err, vm, "Failed to upload photos due to:");
                        vm.message = vm.message + "You cannot add image again from here. However, you can find this dish you just added and add the image again from there.";
                        // must disable the save button even uploading image fails 
                        vm.isBusy = true;
                    });
            }
        }

        function resetAddDish() {
            // don't reset vm.wizard.userlocation
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.showAddDish = true;

                vm.dish.rating = 0;
                vm.dish.review = "";
                vm.dish.selected = "";
                vm.dish.restaurant = {};
                vm.dish.name = "";
                vm.dish.description = "";
                vm.dish.selectedCravings = [];
                vm.step = 0;
                vm.dish.uploadImage = "";

                //$rootScope.$state.go("dish.add", {}, { reload: true });
            });
        }

        function buildRatingLabel(value) {
            vm.ratingLabel = window.helper.buildRatingLabel(value);
        }

        function setUserLocation(position) {
            vm.userLocation = {};
            vm.userLocation.city = position.userLocation.city;
            vm.userLocation.region = position.userLocation.region;
            vm.userLocation.country = position.userLocation.country;
            vm.userLocation.location = position.coords.latitude + "," + position.coords.longitude;
        }

        function initializeSelectedCravings() {
            var input = $rootScope.$stateParams.input;
            if (input && input.split) {
                input = window.helper.replaceAll(input, '+', ',');
                var inputArr = input.split(',');
                refService.getData("cravingtype").then(function (response) {
                    var cravings = response.Items.sort(function (a, b) {
                        return a.Name > b.Name;
                    });

                    var selected = [];
                    for (var idx = 0; idx < inputArr.length; idx++) {
                        for (var j = 0; j < cravings.length; j++) {
                            if (cravings[j].Name === inputArr[idx]) {
                                selected.push({ CravingId: cravings[j].Id });
                                break;
                            }
                        }
                    }
                    vm.dish.selectedCravings = selected;
                });

            }
        }

        function saveImage(filename, dishId) {
            return cravingService.addFile(dishId, filename).then(function (response) {
                // no need to do anything
            }, function (err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.addImage.js":[function(require,module,exports){
(function () {
    'use strict';

    // this controller is used in a modal window for uploading a new image to an existing dish
    angular
        .module('app')
        .controller('DishAddImageController', dishAddImageController);

    dishAddImageController.$inject = ['ModalService', '$http', 'uploadUrl', 'modalItem', 'DinerService'];

    function dishAddImageController(modalService, $http, uploadUrl, modalItem, dinerService) {
        var vm = this;
        vm.uploadImage = '';
        vm.dish = modalItem.Dish;
        vm.message = "";
        vm.onFileRead = onFileRead;

        vm.resetUpload = function () {
            vm.uploadImage = '';
            vm.message = '';
        };

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function () {
            if (vm.uploadImage && vm.uploadImage !== "") {
                uploadImage(vm.dish.DishId);
            } else {
                vm.message = "No image is selected to upload";
            }
        };

        function onFileRead(file, content) {
            guardImage(file);
        }

        function uploadImage(id) {

            var file = vm.uploadImage;

            if (!guardImage(file))
                return;

            // when we upload, don't specify the path, the uploader will figure it out by "type"
            var fd = new FormData();
            fd.append('file', file);
            fd.append('id', id);
            fd.append('dinerId', dinerService.profile.id);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (data) {
                    modalService.submitModal(data);
                })
                .error(function (err) {
                    window.helper.handleError(err, vm, "Failed to upload photos due to:");
                });
        }

        function guardImage(file) {
            if (file.size > 5000000) {
                vm.fileInvalid = true;
            } else {
                vm.fileInvalid = false;
            }

            if (vm.fileInvalid) {
                vm.message = "Image size is too big... must be less than 5 MB.";
            }

            return !vm.fileInvalid;
        }
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.addTags.js":[function(require,module,exports){
(function () {
    'use strict';

    // this controller is used in a modal window for adding craving tags to an existing dish
    angular
        .module('app')
        .controller('DishAddTagsController', dishAddTagsController);

    dishAddTagsController.$inject = ['ModalService', 'modalItem'];

    function dishAddTagsController(modalService, modalItem) {
        var vm = this;
        vm.dish = modalItem.Dish;
        vm.message = "";
        vm.selectedCravings = vm.dish.Cravings.map(function (c) { return c.CravingId; });

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function (result) {
            if (result.length === 0) {
                vm.message = "Cannot remove all craving tags, unless you are an administrator";
            } else {
                modalService.submitModal(result);
            }
        };
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.detail.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishDetailController', dishDetailController);

    dishDetailController.$inject = ['restaurantLoader', 'AuthService', 'CravingService', 'ProposalService', 'ResumeService',
        'NavigationService', 'ModalService', 'FactualService', 'RecentDishService', 'AdminService', '$rootScope', '$scope', '$q', 'fileService'];

    function dishDetailController(restaurantLoader, authService, cravingService, proposalService, resumeService,
        navigationService, modalService, factualService, recentDishService, adminService, $rootScope, $scope, $q, fileService) {

        var vm = this;
        vm.dish = undefined;

        vm.hasDescription = false;
        vm.showDescriptionEditor = false;
        vm.updatingDescription = "";

        vm.message = '';
        vm.savedSuccessfully = false;

        vm.myRating = 0;
        vm.myReview = undefined;
        vm.myReviewId = undefined;
        vm.hasMyReview = false;
        vm.myReviewIsChanged = false;
        vm.reviews = [];
        vm.totalReviews = 0;

        vm.numberOfCravingDiners = 0;
        vm.isMyFavorite = false;
        vm.myOriginalRating = 0;
        vm.overStar = false;
        vm.maxRating = 5;
        vm.percent = 0;
        vm.firstTimeVote = true;

        vm.restaurants = [];
        vm.proposals = [];
        vm.recentProposal = undefined;

        // events
        vm.openDiner = openDiner;
        vm.openMap = openMap;
        vm.getDinerImage = getDinerImage;
        vm.getDishImageSrc = getDishImageSrc;
        vm.hoveringLeave = hoveringLeave;
        vm.hoveringOver = hoveringOver;
        vm.addCravingTags = addCravingTags;
        vm.openImage = openImage;
        vm.addFile = addFile;
        vm.saveDescription = saveDescription;
        vm.saveMyReview = saveMyReview;
        vm.getReviewPostDate = getReviewPostDate;

        vm.getProposalName = getProposalName;
        vm.addToProposal = addToProposal;
        vm.addToNewProposal = addToNewProposal;
        vm.removeDish = removeDish;
        vm.craveForIt = craveForIt;

        // initialize
        activate();

        // event handlers
        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getDishImageSrc(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function openDiner(dinerId, ev) {
            modalService.openModal('user/diner.html', 'DinerDetailController', { 'dinerId': dinerId }, ev);
        }

        function openMap() {
            modalService.toggleSidenav("left").then(function () {
                $("#left").trigger('sidenav.' + (modalService.isSidenavOpen("left") === true ? 'open' : 'close'));
            });
        }

        function hoveringOver(value) {
            vm.overStar = value;
            vm.percent = 100 * (value / vm.maxRating);
            vm.ratingLabel = window.helper.buildRatingLabel(value);
        }

        function hoveringLeave() {
            if (vm.overStar !== vm.myRating) {
                vm.percent = 100 * (vm.myRating / vm.maxRating);
                vm.ratingLabel = window.helper.buildRatingLabel(vm.myRating);
            }

            vm.overStar = null;
        }

        $scope.$watch('vm.myRating', function () {
            vm.myReviewIsChanged = (vm.myRating !== vm.myOriginalRating);
        });

        function openImage(fileName, ev) {
            modalService.openModal('layout/image_modal.html', 'ImageModalController', { 'Name': vm.dish.Name, 'FileName': fileName }, ev);
        }

        function addFile(ev) {
            if (authService.authentication.isAuth === false) {
                resumeService.flush();
                resumeService.createResume(function () {
                    // we don't need to do anything, it will come back to this page after logging in
                }, "You need to log in first before adding new image to this dish.");
            }

            modalService.openModal('dish/add-image-modal.html', 'DishAddImageController', { Dish: vm.dish }, ev).then(function (data) {
                if (data && data !== 'cancel' && data.length > 0) {
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddImage(data); }, "You need to log in first before adding new image to this dish.");
                }
            });
        }

        function addCravingTags(ev) {
            modalService.openModal('dish/add-tag-modal.html', 'DishAddTagsController', { Dish: vm.dish }, ev).then(function (data) {
                if (data && data !== 'cancel' && data.length > 0) {
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareUpdatingCravings(data); }, "You need to log in first before adding new craving tags to this dish.");
                }
            });
        }

        function saveDescription() {
            resumeService.flush();
            resumeService.createResume(prepareSaveDescription, "You need to log in first before saving a new description.");
        }

        function saveMyReview() {
            resumeService.flush();
            resumeService.createResume(prepareSaveMyReview, "You need to log in first before saving your resview. ");
        }

        function getReviewPostDate(d) {
            if (d) return window.helper.getPostDateDescription(d);

            return "";
        }

        function getProposalName(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function addToProposal(proposal, $event) {
            if (!proposal) {
                addToNewProposal();
                return;
            }

            resumeService.flush();
            resumeService.createResume(function () { return prepareAddDishToProposal(proposal, $event); }, "You need to log in first before using the craving proposal.");
        }

        function addToNewProposal(ev) {
            modalService.openModal('proposal/new_proposal_modal.html', 'ProposalModalController', { Dish: vm.dish }, ev).then(function (data) {
                var name;
                if (data && data !== 'cancel' && data.name) {
                    name = data.name;
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddDishToNewProposal(name); }, "You need to log in first before using the craving proposal.");
                }
            });
        }

        function craveForIt() {
            resumeService.flush();
            resumeService.createResume(function () { return prepareCraveForIt(); }, "You need to log in first before adding a dish to your favorite list.");
        }

        // helpers
        function activate() {
            vm.dishId = $rootScope.$stateParams.id;

            if (vm.dishId) {
                authService.fillAuthData();
                cravingService.getDish(vm.dishId).then(function (response) {
                    vm.dish = response.data;
                    vm.hasDescription = vm.dish.Description !== null && vm.dish.Description !== "";
                    vm.updatingDescription = vm.dish.Description;
                    loadAdditionalData(vm.dish);

                    $scope.updatePageTitle(vm.dish.Name + " @ " + vm.dish.RestaurantName);
                }).catch(function (err, status) {
                    if (status === 404) {
                        window.helper.handleError(err, vm, "Dish is not found:");
                    } else {
                        window.helper.handleError(err, vm, "Failed to retrieve dish due to:");
                    }
                });
            }

            $scope.$on('onRepeatLast', function (scope, element, attrs) {
                $(".grid-tiles").freetile({
                    animate: true,
                    elementDelay: 30,
                    selector: ".grid-item",
                    callback: function () {

                    }
                });
            });
        }

        function loadAdditionalData(dish) {
            recentDishService.addToRecent(dish);
            loadCravingDiners();
            loadReviews();
            loadPosition();
            loadRestaurantInfo(dish);
            loadProposals();
        }

        function loadProposals() {
            vm.recentProposal = undefined;
            if (authService.authentication.isAuth) {
                proposalService.getByDiner(authService.authentication.dinerId).then(function (response) {
                    var all = response.data.Items;
                    vm.proposals = [];
                    for (var idx = 0; idx < all.length; idx++) {
                        if (all[idx].IsExpired !== true) {
                            vm.proposals.push(all[idx]);
                        }
                    }

                    if (vm.proposals.length > 0) {
                        vm.recentProposal = vm.proposals[0];
                    }
                });
            }
        }

        function loadCravingDiners() {
            cravingService.getCravingDiners(vm.dishId).then(function (response) {
                vm.cravingDiners = response.data.Items;
                vm.numberOfCravingDiners = vm.cravingDiners.length;
                for (var i = 0, len = vm.cravingDiners.length; i < len; i++) {
                    if (vm.cravingDiners[i].DinerId === authService.authentication.dinerId) {
                        vm.isMyFavorite = true;
                        break;
                    }
                }
            });
        }

        function loadReviews() {
            cravingService.getDishReview(vm.dishId).then(function (response) {
                if (response && response.data.Items) {
                    // first, take the average 
                    var total = 0;
                    var myReviewIdx = -1;
                    for (var idx = 0; idx < response.data.Items.length; idx++) {
                        total += response.data.Items[idx].Rating;

                        if (authService.authentication.isAuth && authService.authentication.dinerId === response.data.Items[idx].ReviewerId) {
                            vm.myRating = response.data.Items[idx].Rating;
                            vm.myOriginalRating = vm.myRating;
                            vm.myReview = response.data.Items[idx].Review;
                            vm.myReviewId = response.data.Items[idx].ReviewId;
                            vm.firstTimeVote = false;
                            myReviewIdx = idx;
                            vm.hasMyReview = true;
                        }
                    }

                    vm.averageRating = total / response.data.Items.length;
                    vm.totalReviews = response.data.Items.length; // we need to store this value, coz it's possible the only reviewer is the current user

                    vm.reviews = response.data.Items;
                    // we don't show my own review in the list, because it's showed in the top and editable 
                    if (myReviewIdx >= 0) {
                        vm.reviews.splice(myReviewIdx, 1);
                    }
                }
            });
        }

        function loadPosition() {
            if ($rootScope.position) {
                vm.position = $rootScope.position;
            } else {
                vm.position = window.helper.getDefaultLocation();
            }
        }

        function loadRestaurantInfo(dish) {
            factualService.getByName(dish.RestaurantName, vm.position.userLocation.city).then(
                function (data) {
                    vm.restaurants = [];
                    for (var idx = 0; idx < data.response.data.length; idx++) {
                        if (window.helper.hasDuplication(data.response.data[idx], vm.restaurants) === false) {
                            vm.restaurants.push(data.response.data[idx]);
                        }
                    }

                    restaurantLoader.load(vm.restaurants);
                });
        }

        function removeDish() {
            adminService.removeDish(vm.dishId, 0)
                .success(function () {
                    // TODO: there is no point to post a message, probably just go back to home page
                    postInfo("Dish has been removed");
                })
                .error(function (err) {
                    window.helper.handleError(err, vm, "Dish could not be removed");
                });
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        // this function will be called from resumeService
        function prepareCraveForIt() {
            return cravingService.craveForIt(vm.dishId).then(
                function () {
                    loadCravingDiners();
                });
        }

        function prepareAddDishToNewProposal(name) {
            var data = {
                Name: name,
                Items: []
            };

            data.Items.push({
                RestaurantId: vm.dish.RestaurantId,
                DishId: vm.dish.DishId
            });

            return proposalService.createProposal(data).then(function (response) {
                navigationService.go('proposal.home.detail', { key: response.data, confirm: true });
            }, function (err) {
                // TODO: for this one we should go to a dedicated page 
            });
        }

        function prepareUpdatingCravings(selectedCravings) {
            var cravingIds = selectedCravings.map(function (a) { return a.CravingId !== undefined ? a.CravingId : a; });
            return cravingService.updateCravings(vm.dish.DishId, cravingIds).then(function (response) {
                vm.dish.Cravings = response.data.Items;
            }, function (err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }

        function prepareAddImage(filename) {
            return cravingService.addFile(vm.dish.DishId, filename).then(function (response) {
                var newFile = response.data;
                vm.dish.DishImageFiles.push(newFile);
            }, function (err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }

        function prepareAddDishToProposal(proposal, ev) {
            // we will always reload all proposals before adding a dish to it, coz this could come from a resume
            authService.fillAuthData();
            var dinerId = authService.authentication.dinerId;
            return proposalService.getByDiner(dinerId).then(function (response) {
                var all = response.data.Items;
                vm.proposals = [];
                for (var idx = 0; idx < all.length; idx++) {
                    if (all[idx].IsExpired !== true) {
                        vm.proposals.push(all[idx]);
                    }
                }

                if (proposalService.proposals.length === 0) {
                    return prepareAddDishToNewProposal();
                } else {
                    if (!proposal) {
                        proposal = proposalService.proposals[0];
                    }

                    if (proposal.IsExpired) {
                        return prepareAddDishToNewProposal();
                    } else {
                        return proposalService.addItem(vm.dish, proposal).then(function () {
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', { Dish: vm.dish, Proposal: proposal }, ev);
                        }, function (err) {
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', { Dish: vm.dish, Proposal: proposal, AlreadyIn: true }, ev);
                        });
                    }
                }
            });
        }

        function prepareSaveMyReview() {
            if (vm.hasMyReview === true) {
                // update review
                return cravingService.updateReview(vm.dishId, vm.myReviewId, vm.myRating, vm.myReview, authService.authentication.dinerId).then(function () {
                    loadReviews();
                    vm.myReviewIsChanged = false;
                }, function (err) {
                    window.helper.handleError(err, vm, "Failed to save review due to:");
                });
            } else {
                // add a new review 
                return cravingService.addReview(vm.dishId, vm.myRating, vm.myReview, authService.authentication.dinerId).then(function () {
                    loadReviews();
                    vm.myReviewIsChanged = false;
                }, function (err) {
                    window.helper.handleError(err, vm, "Failed to save review due to:");
                });
            }
        }

        function prepareSaveDescription() {
            var deferred = $q.defer();
            if (vm.dish.Description !== vm.updatingDescription) {
                cravingService.updateDescription(vm.dishId, vm.updatingDescription).then(function () {
                    vm.dish.Description = vm.updatingDescription;
                    vm.showDescriptionEditor = false;
                    vm.hasDescription = vm.dish.Description !== null && vm.dish.Description !== "";
                    postInfo('');
                    deferred.resolve();
                }, function (err) {
                    deferred.reject();
                    window.helper.handleError(err, vm, "Failed to save dish description due to:");
                });
            } else {
                deferred.resolve(''); // nothing to save
            }

            return deferred.promise;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.recent.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecentDishController', recentDishController);

    recentDishController.$inject = ['RecentDishService', 'NavigationService', '$rootScope'];

    function recentDishController(recentService,navigationService, $rootScope) {
        var vm = this;
        vm.message = "";
        vm.dishes = [];

        // events
        vm.openDish = openDish;
        vm.isCurrent = isCurrent;
        vm.isOpen = false;

        // initialize
        activate();

        // helpers
        function activate() {
            loadRecent();

            recentService.onRefresh = function() {
                loadRecent();
            };
        }

        function isCurrent(dish) {
            var retval = $rootScope.$state.is('detail.dish', { 'id': dish.DishId }) || 
                $rootScope.$state.is('dish.detail', { 'id': dish.DishId }); // sigh... I used a different route in the MD theme
            return retval;
        }

        function openDish(dish) {
            navigationService.go('detail.dish', { 'id': dish.DishId });
        }

        function loadRecent() {
            recentService.loadRecent();
            vm.dishes = recentService.dishes;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\image.modal.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ImageModalController', imageModalController);

    imageModalController.$inject = ['ModalService', 'modalItem', 'fileService'];

    function imageModalController(modalService, modalItem, fileService) {
        var vm = this;
        vm.message = "";
        vm.entity = undefined;
        vm.getImageSrc = getImageSrc;
        vm.close = close;

        // initialize
        activate();

        // helpers
        function activate() {
            vm.entity = modalItem;
        }

        function getImageSrc(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function close() {
            modalService.closeModal();
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\map.add.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .config(['uiGmapGoogleMapApiProvider', function (mapProvider) {
            window.MapHelper.configMap(mapProvider);
        }])
        .controller('DishMapEditController', dishMapEditController);

    dishMapEditController.$inject = ['GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService', 'FactualService', 'ModalService',
        'loader', 'uiGmapGoogleMapApi',
        '$timeout', '$rootScope', '$scope'];

    function dishMapEditController(geoService, restService, dinerService, refDataService, factualService, modalService,
        dishLoader, mapApi,
        $timeout, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var pageLimit = 15;

        vm.userCoords = {}; // this stores the current user's marker 
        vm.dish = dishLoader.current;

        vm.selectedRestaurant = undefined;
        vm.availableRestaurants = [];

        vm.offset = 0; // factual service search offset
        vm.itemTitle = ""; // title of the item panel
        vm.hasNextPage = false; // indicate if there is next page;
        vm.hasPrevPage = false;
        vm.currentPage = 1;
        vm.pages = []; // for displaying pagination
        vm.pageSize = pageLimit;
        vm.showSearch = false;
        vm.cravings = [];
        vm.searchText = "";

        vm.position = window.helper.getDefaultLocation();
        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;
        vm.items = [];
        vm.total = 0; // store the total searched results 

        // events
        vm.locate = locate;
        vm.getCuisine = getCuisine;
        vm.searchRestaurant = searchRestaurant;
        vm.gotoPage = gotoPage;
        vm.gotoPrevPage = gotoPrevPage;
        vm.gotoNextPage = gotoNextPage;
        vm.close = close;

        // initialize
        activate();

        // helpers
        function activate() {
            mapApi.then(function (map) {
                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }

                updateCenter();

                $("#left").on('sidenav.open', function (ev) {
                    if (ev.target.id == 'left') {
                        vm.map.control.refresh();
                    }
                });
            });

            refDataService.getData("cravingtype").then(function (response) {
                vm.cravings = response.Items.map(function (c) { return c.Name; });
            });


        }

        // event handlers
        function close() {
            // this key is defined in shell_width_right_sidebar.html
            modalService.closeSidenav("left");
        }

        // it applies some intelligence to load the cuisine type of a restaurant 
        // Factual API only returns the real cuisine types from restaurant-XX dataset not from "places" dataset 
        // however, we can derive a rough cuisine type from the category_labels 
        function getCuisine(item) {
            var retval = [];
            var defaultCuisine = "Food and Dining";
            var genericCategory = "Restaurants";
            if (item.cuisine && item.cuisine.constructor === Array) {
                return item.cuisine.splice(0, 3);
            } else if (item.category_labels && item.category_labels.constructor === Array) {
                for (var idx = 0; idx < item.category_labels.length; idx++) {
                    var labels = item.category_labels[idx];
                    if (labels.constructor === Array) {
                        if (labels[labels.length - 1] !== genericCategory) {
                            retval.push(labels[labels.length - 1]);
                        }
                    }

                    if (retval.length === 3)
                        break;
                }

                if (retval.length === 0) {
                    retval.push(defaultCuisine);
                }
            } else {
                retval.push(defaultCuisine);
            }

            return retval;
        }

        function searchRestaurant() {
            if (!vm.position) return;

            // reset
            if (vm.searchText === "" || !vm.searchText) {
                updateCenter();
                return;
            }

            clearMarkers();

            factualService.getByName(vm.searchText, vm.position.userLocation.city).then(
                function (data) {
                    var items = data.response.data;
                    loadSearchedResults(items);

                }, function (err) {
                    window.helper.handleError(err, vm);
                    vm.hasError = true;
                });
        }

        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function gotoPrevPage() {
            if (vm.offset > 0) {
                vm.offset = vm.offset - pageLimit;
                reloadRestaurants();
            }
        }

        function gotoNextPage() {
            if (vm.offset + pageLimit < vm.total) {
                vm.offset = vm.offset + pageLimit;
                reloadRestaurants();
            }
        }

        function gotoPage(p) {
            if (p > vm.currentPage) {
                vm.offset = pageLimit * (p - 1);
            } else {
                if (p === 1)
                    vm.offset = 0;
                else
                    vm.offset = vm.offset - pageLimit * (p - 1);
            }

            reloadRestaurants();
        }

        // helpers
        function updateCenter() {
            vm.map = window.MapHelper.createMap(vm.position.coords);
            vm.userCoords = vm.position.coords;
            ensureUserMarker();
            reloadRestaurants();
        }

        function clearMarkers() {
            initializeMarkers();
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(null);
            };
        }

        function loadRestaurants() {
            factualService.searchNear(vm.userCoords.latitude, vm.userCoords.longitude, vm.offset, pageLimit).then(
                function (data) {
                    drawMarker(data);
                });
        }

        function reloadRestaurants() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                clearMarkers();
                loadRestaurants();
            });
        }

        function drawMarker(data) {
            var markerId = 1;

            if (!data || !data.response.data || data.response.data.length == 0) {
                vm.itemTitle = "Oops, it appears there is no restaurant near here.";

            } else {

                vm.total = data.response.total_row_count;
                vm.hasNextPage = vm.offset + pageLimit < vm.total;
                // we only show up-to 10 pages
                if (vm.total <= pageLimit * 10) {
                    vm.itemTitle = "We found " + vm.total + " restaurants near here.";
                } else {
                    vm.itemTitle = "There are more than 150 restaurants near here, try to search by typing the name";
                }

                var totalPage = getTotalPage(vm.total, pageLimit);
                vm.pages = [];
                for (var pageIndex = 1; pageIndex <= totalPage; pageIndex++) {
                    vm.pages.push(pageIndex);
                    if (pageIndex >= 10) {
                        break;
                    }
                }

                vm.currentPage = getCurrentPage(vm.total);
                vm.hasPrevPage = vm.currentPage > 1;
            }

            var markers = [];
            for (var idx = 0; idx < data.response.data.length; idx++) {
                var obj = data.response.data[idx];
                obj.isSelected = false;
                obj.placeIndex = vm.offset + idx + 1;
                var markerData = window.MapHelper.createRestaurantMarker(obj, markerId++, onMarkerSelected, null);
                markers.push(markerData);
                vm.items.push(obj);
            }

            $timeout(function () {
                vm.map.markers = markers;
            }, 250); // if I don't delay here, it doesn't show all the new markers 

            return vm.items;
        }

        // vm.markers has the data used to draw markers on the map
        function findMarker(factualId) {
            for (var idx = 0; idx < vm.map.markers.length; idx++) {
                if (vm.map.markers[idx].factual_id == factualId)
                    return vm.map.markers[idx];
            }

            return undefined;
        }

        // vm.items has the data used to display restaurant info in the lower part
        function findItem(factualId) {
            for (var idx = 0; idx < vm.items.length; idx++) {
                if (vm.items[idx].factual_id == factualId)
                    return vm.items[idx];
            }

            return undefined;
        }

        function initializeMarkers() {
            vm.items = [];
            vm.map.markers = [];
            vm.total = 0;
            vm.pages = [];
            vm.currentPage = 1;
            vm.hasNextPage = false;
            vm.hasPrevPage = false;
        }

        function getTotalPage(total, pageSize) {
            return window.helper.parseInt10((total + (pageSize - 1)) / pageSize);
        }

        function getCurrentPage() {
            return (vm.offset / pageLimit) + 1;
        }

        function loadSearchedResults(items) {
            vm.items = [];
            vm.map.markers = [];
            if (items.length > 0) {
                var counter = 1;
                for (var idx = 0; idx < items.length; idx++) {
                    if (window.helper.hasDuplication(items[idx], vm.items)) {
                        continue;
                    }

                    var item = items[idx];
                    item.placeIndex = counter++;
                    // the Item's properties are named differently, they are FindRestaurantResp DTO
                    var markerData = window.MapHelper.createRestaurantMarker(item, counter, onMarkerSelected, null);
                    vm.map.markers.push(markerData);
                    vm.items.push(item);
                }

                // the first one is the closet one, default is sorted by distance asc 
                vm.map.center = { latitude: items[0].latitude, longitude: items[0].longitude };

                // TODO: a better experience is to center using the user's location and connect to the closeset one 
            }

            vm.itemTitle = "We found " + vm.items.length + " restaurants matching [" + vm.searchText + "]";
        }

        function onMarkerSelected(sender) {
            if (sender.model && sender.model.factual_id) {
                selectMarker(sender.model);
            }
        }

        function selectMarker(marker) {
            if (vm.map.selectedMarker) {
                deSelectMarker(vm.map.selectedMarker);
            }

            var item = findItem(marker.factual_id);
            marker.options.opacity = 1.0;
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = true;
                    dishLoader.load(item);
                });

                vm.map.selectedMarker = marker;
                vm.map.center.latitude = marker.coords.latitude;
                vm.map.center.longitude = marker.coords.longitude;
            }
        }

        function deSelectMarker(marker) {
            var item = findItem(marker.factual_id);
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = false;
                    dishLoader.load(null);
                });
                marker.options.opacity = 0.4;
            }
        }

        function ensureUserMarker() {
            if (!vm.userMarker) {
                vm.map.userMarker = window.MapHelper.createUserMarker(vm.userCoords, onUserMarkerDragged);
            }
        }

        function onUserMarkerDragged(marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            var coords = { latitude: lat, longitude: lng };

            vm.userCoords = coords;
            reloadRestaurants();

            vm.map.center.latitude = lat;
            vm.map.center.longitude = lng;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\map.viewer.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .config(['uiGmapGoogleMapApiProvider', function (mapProvider) {
            window.MapHelper.configMap(mapProvider);
        }])
        .controller('RestaurantMapController', restaurantMapController);

    restaurantMapController.$inject = ['restaurantLoader', 'RestaurantService','ModalService',
        'uiGmapGoogleMapApi', '$timeout', '$rootScope', '$scope'];

    function restaurantMapController(restaurantLoader, restService, modalService,
        mapApi, $timeout, $rootScope, $scope) {
        var vm = this;
        vm.message = "";
        vm.hasError = false;
        vm.restaurants = [];
        vm.items = [];

        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;

        // events
        vm.locate = locate;
        vm.close = close;

        // initialize
        activate();

        // event handlers
        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function close() {
            modalService.closeSidenav("left");
        }

        // helpers
        function activate() {
            restaurantLoader.addLoadedEventListener(handleRestaurantLoaded);

            mapApi.then(function (map) {
                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }

                updateCenter();

                $("#left").on('sidenav.open', function (ev) {
                    if (ev.target.id === 'left') {
                        vm.map.control.refresh();
                    }
                });
            });
        }

        // for this loader, this event is fired when all restaurants are loaded
        function handleRestaurantLoaded(restaurants) {
            vm.hasError = false;
            // we need to wait for the map initialized after the dish is loaded 
            (function tick() {
                var timer = $timeout(tick, 500);
                $timeout.cancel(timer); // if the map is initialized, we don't have to wait
                clearMarkers();
                locateRestaurant(restaurants);
            })();
        }

        function clearMarkers() {
            initializeMarkers();
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(null);
            };
        }

        function initializeMarkers() {
            vm.restaurants = [];
            vm.map.markers = [];
        }

        function locateRestaurant(data) {
            if (data && data.length && data.length > 0) {
                var markers = [];
                for (var idx = 0; idx < data.length; idx++) {
                    var item = data[idx];
                    item.placeIndex = idx + 1;
                    item.isSelected = false;
                    vm.items.push(item);

                    var markerData = window.MapHelper.createRestaurantMarker(item, idx, onMarkerSelected, null);
                    markers.push(markerData);

                    vm.restaurants.push(item);
                }

                $timeout(function () {
                    vm.map.markers = markers;
                    vm.map.center = { latitude: vm.items[0].latitude, longitude: vm.items[0].longitude };
                }, 250); // if I don't delay here, it doesn't show all the new markers 
            }
        }

        function updateCenter() {
            vm.map = window.MapHelper.createMap(vm.position.coords);
            vm.userCoords = vm.position.coords;
            ensureUserMarker();
        }

        function ensureUserMarker() {
            if (!vm.userMarker) {
                vm.map.userMarker = window.MapHelper.createUserMarker(vm.userCoords, null);
            }
        }

        function onMarkerSelected(sender) {
            if (sender.model && sender.model.factual_id) {
                selectMarker(sender.model);
            }
        }

        function selectMarker(marker) {
            if (vm.map.selectedMarker) {
                deSelectMarker(vm.map.selectedMarker);
            }

            var item = findItem(marker.factual_id);
            marker.options.opacity = 1.0;
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = true;
                });

                vm.map.selectedMarker = marker;
                vm.map.center.latitude = marker.coords.latitude;
                vm.map.center.longitude = marker.coords.longitude;
            }
        }

        function deSelectMarker(marker) {
            var item = findItem(marker.factual_id);
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = false;
                });
                marker.options.opacity = 0.4;
            }
        }

        function findMarker(factualId) {
            for (var idx = 0; idx < vm.map.markers.length; idx++) {
                if (vm.map.markers[idx].factual_id === factualId)
                    return vm.map.markers[idx];
            }

            return undefined;
        }

        function findItem(factualId) {
            for (var idx = 0; idx < vm.items.length; idx++) {
                if (vm.items[idx].factual_id === factualId)
                    return vm.items[idx];
            }

            return undefined;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\header.commands.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderCommandController', headerCommandController);

    // this controller replaces the original one AccountController
    headerCommandController.$inject = ['AuthService', 'DinerService', 'NavigationService', 'ModalService', '$scope', '$timeout', 'fileService'];

    function headerCommandController(authService, dinerService, navigationService, modalService, $scope, $timeout, fileService) {
        /* jshint validthis:true */
        var vm = this;
        var iconIdx = 0;
        vm.addDishIcons = ['add', 'restaurant_menu'];
        vm.addDishIcon = vm.addDishIcons[iconIdx];
        vm.authentication = authService.authentication;
        vm.showLogin = true;
        vm.showSignup = true;
        vm.showUser = false;

        // events
        vm.showLoginModal = showLogin;
        vm.showSignupModal = showSignup;
        vm.logout = logOutHandler;
        vm.getDinerImage = getDinerImage;

        activate();
        function activate() {
            setInterval(function () {
                if (iconIdx === 0) {
                    iconIdx = 1;
                } else {
                    iconIdx = 0;
                }
                vm.addDishIcon = vm.addDishIcons[iconIdx];
                $scope.$apply();
            }, 5000);

            authService.fillAuthData();
            vm.authentication = authService.authentication;
            vm.showLogin = authService.authentication.isAuth === false;
            vm.showSignup = authService.authentication.isAuth === false;
            vm.showUser = authService.authentication.isAuth === true;
        }

        function logOutHandler() {
            authService.logOut();
            dinerService.flush();
            window.helper.refreshing($timeout, 0);
        }

        function showLogin(ev) {
            modalService.openModal('account/login.modal.html',"AccountLoginController", null, ev);
        }

        function showSignup(ev) {
            modalService.openModal('account/signup.modal.html', "AccountSignupController", null, ev);
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\header.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', headerController);

    headerController.$inject = [];

    function headerController() {
        

    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\navbar.location.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('NavbarLocationController', locationController);

    locationController.$inject = ['GeoService','$rootScope'];

    // this controller will be assigned to everything inside shell.html, unless a part has a specific controller 
    // this will be the first controller loaded in the whole system, so we can do some initialization here 
    function locationController(geoService, $rootScope) {
        var vm = this;
        vm.position = $rootScope.position;

        activate();

        function activate() {
            if (vm.position == undefined) {
                vm.position = window.helper.getDefaultLocation();
            }

            $rootScope.$on(geoService.GEO_UPDATE, function(event, data) {
                vm.position = data;
            });

        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\search.bar.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchBarController', searchBarController);

    searchBarController.$inject = ['CravingService', 'ReferenceDataService', 'NavigationService', '$rootScope', '$scope'];

    function searchBarController(cravingService, refService, navigationService, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Search Cravings';
        vm.input = $rootScope.$stateParams.criteria;
        vm.selectedCravings = [];
        vm.cravings = [];
        vm.searchText = null;
        vm.selectedItem = null;
        vm.showSearch = false;

        // events
        vm.querySearch = querySearch;

        activate();
        var oldInput = "";
        var stateChangedSubscribed;

        function activate() {
            vm.position = $rootScope.position;
            checkSearch();

            refService.getData("cravingtype").then(function (response) {
                vm.cravings = response.Items.map(function (c) { return c.Name; });
            });

            // this is important, coz the header has only one instance
            $scope.$on('$stateChangeSuccess', newSearch);

            $scope.$watchCollection('vm.selectedCravings', function (newVal, oldVal) {
                // we don't need to worry about the value, only the length is fine 
                if (angular.isArray(oldVal) && oldVal.length !== newVal.length) {
                    if (newVal.length === 0) {
                        navigationService.go('app.home');
                    } else {
                        var currentCriteria = vm.selectedCravings.join('+');
                        $rootScope.$stateParams.criteria = currentCriteria;
                        navigationService.go('app.home.search', { 'criteria': currentCriteria });
                    }
                }
            });
        }

        function newSearch() {
            stateChangedSubscribed = true;
            vm.input = $rootScope.$stateParams.criteria;
            checkSearch();
        }

        function checkSearch() {
            if (vm.input === undefined || vm.input.trim().length === 0) {
                vm.selectedCravings = [];
                vm.showSearch = false;
            }
            else if (vm.input !== oldInput) {
                vm.selectedCravings = vm.input.split("+");
                vm.showSearch = true;
            }

            // do not unsubscribe it, coz the header doesn't change
            //if (stateChangedSubscribed) {
            //    $scope.$off('$stateChangeSuccess', newSearch);
            //}
        }

        function querySearch(query) {
            var results = query ? vm.cravings.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(craving) {
                return (craving.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\main.js":[function(require,module,exports){
// this is an extra external module 
require('./widgets/ngplus-overlay.js');

// core
require('./core/app.js');
require('./core/app.constant.js');
require('./core/main.js');
require('./core/config.router.account.js');
require('./core/config.router.admin.js');
require('./core/config.router.dish.js');
require('./core/config.router.js');
require('./_appHelper.js');
require('./_mapHelper.js');

// layout
require('./layout/header.js');
require('./layout/header.commands.js');
require('./layout/search.bar.js'); // TODO: to be merged back to header
require('./layout/navbar.location.js');

// system
require('./sys/location.js');

// account
require('./account/account.js');
require('./account/account.login.js');
require('./account/account.signup.js');
require('./account/account.reset.js');
require('./account/account.activate.js');
require('./account/profile.js');
require('./account/profile.associate.js');
require('./account/profile.basic.js');
require('./account/profile.dislikecravings.js');
require('./account/profile.updatepassword.js');
require('./account/profile.cravinghistory.js');
require('./account/profile.favorite.js');
require('./account/profile.mydish.js');
require('./account/profile.myreview.js');
require('./account/profile.settings.js');

// cravings
require('./craving/craving.tags.js');
require('./craving/craving.search.js');

// admin
require('./admin/admin.js');
require('./admin/admin.dishes.js');
require('./admin/admin.reviews.js');
require('./admin/admin.users.js');
require('./admin/admin.files.js');
require('./admin/admin.cravingtags.js');
require('./admin/admin.cache.js');
require('./admin/admin.moderation.modal.js');

// dish
require('./dish/dish.add.js');
require('./dish/map.add.js');
require('./dish/map.viewer.js');
require('./dish/dish.detail.js');
require('./dish/dish.addImage.js');
require('./dish/dish.addTags.js');
require('./dish/image.modal.js');
require('./dish/dish.recent.js');

//proposal
require('./proposal/proposal.my.js');
require('./proposal/proposal.view.js');
require('./proposal/proposal.modal.js');

//restaurant
require('./restaurant/restaurant.js');
require('./restaurant/singleRandomRestaurant.js');

// diner 
require('./user/diner.detail.js'); // the opening logic is different 

// widgets
require('../ourcraving/widgets/onLastRepeat.js');
require('../ourcraving/widgets/ngConfirmClick.js');
require('../ourcraving/widgets/access.js');
require('../ourcraving/widgets/cravingSelect.js');
require('./widgets/compareTo.js'); // NEW for ng-message 
require('./widgets/dishDuplicationCheck.js');
require('./widgets/dirDisqus.js'); 
require('./widgets/fileField.js'); 

// services
require('../ourcraving/services/service.module.js');
require('../ourcraving/services/authService.js');
require('../ourcraving/services/referenceDataService.js');
require('../ourcraving/services/geoService.js');
require('../ourcraving/services/cravingService.js');
require('../ourcraving/services/restaurantService.js');
require('../ourcraving/services/dinerService.js');

require('./services/loggerService.js'); // NEW! coz we are using a different toast msg handler
require('./services/modalService.js'); // NEW! using MD dialog
require('./services/fileService.js');

require('../ourcraving/services/navigationService.js');
require('../ourcraving/services/factualService.js');
require('../ourcraving/services/recentDishService.js');
require('../ourcraving/services/proposalService.js');
require('../ourcraving/services/loaderFactory.js');
require('../ourcraving/services/resumeService.js');
require('../ourcraving/services/adminService.js');
},{"../ourcraving/services/adminService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\adminService.js","../ourcraving/services/authService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\authService.js","../ourcraving/services/cravingService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\cravingService.js","../ourcraving/services/dinerService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\dinerService.js","../ourcraving/services/factualService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\factualService.js","../ourcraving/services/geoService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\geoService.js","../ourcraving/services/loaderFactory.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\loaderFactory.js","../ourcraving/services/navigationService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\navigationService.js","../ourcraving/services/proposalService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\proposalService.js","../ourcraving/services/recentDishService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\recentDishService.js","../ourcraving/services/referenceDataService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\referenceDataService.js","../ourcraving/services/restaurantService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\restaurantService.js","../ourcraving/services/resumeService.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\resumeService.js","../ourcraving/services/service.module.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\service.module.js","../ourcraving/widgets/access.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\access.js","../ourcraving/widgets/cravingSelect.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\cravingSelect.js","../ourcraving/widgets/ngConfirmClick.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\ngConfirmClick.js","../ourcraving/widgets/onLastRepeat.js":"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\onLastRepeat.js","./_appHelper.js":"D:\\Craving.Web\\src\\js\\themes\\md\\_appHelper.js","./_mapHelper.js":"D:\\Craving.Web\\src\\js\\themes\\md\\_mapHelper.js","./account/account.activate.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.activate.js","./account/account.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.js","./account/account.login.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.login.js","./account/account.reset.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.reset.js","./account/account.signup.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\account.signup.js","./account/profile.associate.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.associate.js","./account/profile.basic.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.basic.js","./account/profile.cravinghistory.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.cravinghistory.js","./account/profile.dislikecravings.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.dislikecravings.js","./account/profile.favorite.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.favorite.js","./account/profile.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.js","./account/profile.mydish.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.mydish.js","./account/profile.myreview.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.myreview.js","./account/profile.settings.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.settings.js","./account/profile.updatepassword.js":"D:\\Craving.Web\\src\\js\\themes\\md\\account\\profile.updatepassword.js","./admin/admin.cache.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.cache.js","./admin/admin.cravingtags.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.cravingtags.js","./admin/admin.dishes.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.dishes.js","./admin/admin.files.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.files.js","./admin/admin.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.js","./admin/admin.moderation.modal.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.moderation.modal.js","./admin/admin.reviews.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.reviews.js","./admin/admin.users.js":"D:\\Craving.Web\\src\\js\\themes\\md\\admin\\admin.users.js","./core/app.constant.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\app.constant.js","./core/app.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\app.js","./core/config.router.account.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.account.js","./core/config.router.admin.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.admin.js","./core/config.router.dish.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.dish.js","./core/config.router.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\config.router.js","./core/main.js":"D:\\Craving.Web\\src\\js\\themes\\md\\core\\main.js","./craving/craving.search.js":"D:\\Craving.Web\\src\\js\\themes\\md\\craving\\craving.search.js","./craving/craving.tags.js":"D:\\Craving.Web\\src\\js\\themes\\md\\craving\\craving.tags.js","./dish/dish.add.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.add.js","./dish/dish.addImage.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.addImage.js","./dish/dish.addTags.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.addTags.js","./dish/dish.detail.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.detail.js","./dish/dish.recent.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\dish.recent.js","./dish/image.modal.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\image.modal.js","./dish/map.add.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\map.add.js","./dish/map.viewer.js":"D:\\Craving.Web\\src\\js\\themes\\md\\dish\\map.viewer.js","./layout/header.commands.js":"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\header.commands.js","./layout/header.js":"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\header.js","./layout/navbar.location.js":"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\navbar.location.js","./layout/search.bar.js":"D:\\Craving.Web\\src\\js\\themes\\md\\layout\\search.bar.js","./proposal/proposal.modal.js":"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.modal.js","./proposal/proposal.my.js":"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.my.js","./proposal/proposal.view.js":"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.view.js","./restaurant/restaurant.js":"D:\\Craving.Web\\src\\js\\themes\\md\\restaurant\\restaurant.js","./restaurant/singleRandomRestaurant.js":"D:\\Craving.Web\\src\\js\\themes\\md\\restaurant\\singleRandomRestaurant.js","./services/fileService.js":"D:\\Craving.Web\\src\\js\\themes\\md\\services\\fileService.js","./services/loggerService.js":"D:\\Craving.Web\\src\\js\\themes\\md\\services\\loggerService.js","./services/modalService.js":"D:\\Craving.Web\\src\\js\\themes\\md\\services\\modalService.js","./sys/location.js":"D:\\Craving.Web\\src\\js\\themes\\md\\sys\\location.js","./user/diner.detail.js":"D:\\Craving.Web\\src\\js\\themes\\md\\user\\diner.detail.js","./widgets/compareTo.js":"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\compareTo.js","./widgets/dirDisqus.js":"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\dirDisqus.js","./widgets/dishDuplicationCheck.js":"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\dishDuplicationCheck.js","./widgets/fileField.js":"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\fileField.js","./widgets/ngplus-overlay.js":"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\ngplus-overlay.js"}],"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.modal.js":[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProposalModalController', modalProposalController);

    modalProposalController.$inject = ['ModalService', 'modalItem'];

    function modalProposalController(modalService, modalItem) {
        var vm = this;
        vm.Dish = modalItem.Dish;
        vm.Proposal = modalItem.Proposal;
        vm.AlreadyIn = modalItem.AlreadyIn || false;
        vm.proposalData = { name: ''};
        vm.message = "";

        vm.close = function() {
            modalService.closeModal();
        };

        vm.submit = function(result) {
            modalService.submitModal(result);
        };

        vm.getProposalTitle = function (proposal) {
            // this is duplicate to the proposal.my.js
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        };
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.my.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MyProposalController', myProposalController);

    myProposalController.$inject = ['ProposalService', 'DinerService', 'RestaurantService', 'NavigationService',
        '$timeout', '$rootScope','$scope'];

    // TODO:  I don't like this controller at this point, because it and ProposalService are mixing some logic in both places 
    // ideally, the ProposalService should be dumb, and it simply hits the REST. 
    // however, the ProposalService must handle the logic of an unsaved proposal, which can be interacted with other controllers 
    // need to figure out a better way to manage these relationship
    function myProposalController(proposalService, dinerService, restService, navigationService,
        $timeout, $rootScope, $scope) {
        var vm = this;

        vm.diner = undefined;
        vm.overlayTitle = "Craving Proposal";
        vm.coverClass = "bg-craving-proposal";
        vm.profile = {};
        vm.proposals = [];
        vm.votes = [];
        vm.currentKey = undefined;
        vm.selectedProposal = undefined;
        vm.proposalUrl = undefined;
        vm.titleInEdit = false;
        vm.updatingProposalName = "";
        vm.hasAnyExpiredProposal = false;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.isLoaded = false;

        // events
        vm.getProposalTitle = getProposalTitle;
        vm.checkActive = checkActive;
        vm.extendProposal = extendProposal;
        vm.expireProposal = expireProposal;
        vm.isExpired = isExpired;
        vm.formateDate = formateDate;
        vm.copyUrl = copyUrl;
        vm.getIterations = getIterations;
        vm.voteItem = voteItem;
        vm.removeItem = removeItem;
        vm.removeProposal = removeProposal;
        vm.saveProposalName = saveProposalName;
        vm.filterByActive = filterByActive;
        vm.filterByExpiration = filterByExpiration;

        // initialize
        activate();

        // event handlers
        function getProposalTitle(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function saveProposalName() {
            if (vm.selectedProposal.Name !== vm.updatingProposalName) {
                proposalService.updateName(vm.selectedProposal.Id, vm.updatingProposalName).then(function (response) {
                    vm.selectedProposal.Name = vm.updatingProposalName;
                    vm.titleInEdit = false;
                    postInfo('');
                }, function (err) {
                    postError(err, vm);
                });
            }

        }

        function checkActive(proposal) {
            var retval = $rootScope.$state.is('proposal.home.detail', { 'key': proposal.Key }) ||
                (vm.proposals.length > 0 && vm.proposals[0].Key === proposal.Key && vm.currentKey === undefined);

            if (retval) return "active";
            return "";
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function isExpired(proposal) {
            if (proposal)
                return (proposal.IsExpired);

            return false;
        }

        function copyUrl() {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", vm.proposalUrl);
        }

        function filterByActive(proposal) {
            return proposal.IsExpired === true;
        }

        function filterByExpiration(proposal) {
            return proposal.IsExpired === false;
        }

        function extendProposal(proposal) {
            proposalService.extendProposal(proposal.Id).then(
                function () {
                    // for now I don't want to retrieve it again from the server side to refresh it, I know it could cause problem
                    // moreover, an unsaved proposal simply doesn't have a record in DB yet 
                    proposal.ExpirationDate = window.helper.getTodayPlus(30);
                    proposal.IsExpired = false;
                    checkHasAnyExpiredProposal();
                }, function (err) {
                    postError('Failed to expire proposal due to:' + err);
                });
        }

        function expireProposal(proposal) {
            proposalService.expireProposal(proposal.Id).then(
                function () {
                    proposal.ExpirationDate = window.helper.getTodayPlus(-1);
                    proposal.IsExpired = true;
                    vm.hasAnyExpiredProposal = true;
                }, function (err) {
                    postError('Failed to expire proposal due to:' + err);
                });
        }

        function voteItem(item) {
            if (proposalService.hasVoted(item, vm.profile.id)) {
                postInfo('');
                proposalService.removeVote(vm.selectedProposal, item).then(function (response) {
                    getProposalDetail();
                }, function(err) {
                    postError(err);
                });
            } else {
                // this is needed because a user might be able to vote more than 1 per proposal (in the future) 
                if (proposalService.canVote(vm.selectedProposal, vm.profile.id)) {
                    proposalService.castVote(vm.selectedProposal, item).then(function (response) {
                        if (response.status === 200) {
                            postInfo('');
                            // this is bad for performance, but it's the quickest way to refresh the data 
                            getProposalDetail();
                        }
                    }, function (err) {
                        vm.votes[item.RestaurantId] = false;
                        postError('Vote failed: it is likely that you have already voted');
                    });
                } else {
                    vm.votes[item.RestaurantId] = false;
                    postError('You have already voted! You can only vote once in each proposal.');
                }
            }
        }

        function removeItem(item) {
            // we still want to do a client-side check even the server side already checks
            if (vm.profile.id === vm.selectedProposal.CreatorId) {
                proposalService.removeItem(vm.selectedProposal, item).then(function (response) {
                    var findIdx = -1;
                    for (var idx = 0; idx < vm.selectedProposal.Items.length; idx++) {
                        if (vm.selectedProposal.Items[idx].DishId === item.DishId) {
                            findIdx = idx;
                            break;
                        }
                    }
                    if (findIdx > -1) {
                        vm.selectedProposal.Items.splice(findIdx);
                        syncTotalItems(vm.selectedProposal);
                    }
                    
                    postInfo('Removed successfully');
                }, function (err) {
                    postError('Only proposal owner can remove option.');
                });
            } else {
                postError('Only proposal owner can remove option.');
            }
        }

        function removeProposal(proposal) {
            if (vm.profile.id === vm.selectedProposal.CreatorId) {
                proposalService.removeCart(proposal.Id).then(function (response) {
                    navigationService.go('proposal.home', {}, { 'reload': true });
                }, function (err) {
                    postError('Trying to delete proposal failed, probably due to unthorized. If you think this is wrong, please contact us. ');
                });
            } else {
                postError('Only proposal owner can delete proposal.');
            }
        }

        function getIterations(counter) {
            var data = [];
            for (var i = 0; i < counter; i++) {
                data.push(i + 1);
            }
            return data;
        }

        // helpers
        function activate() {
            dinerService.getMyProfile().then(function () {
                vm.profile = dinerService.profile;

                proposalService.getByDiner(vm.profile.id).then(function (response) {
                    vm.proposals = response.data.Items;
                    if (vm.proposals.length > 0) {
                        vm.currentKey = $rootScope.$stateParams.key;
                        if (vm.currentKey) {
                            for (var idx = 0; idx < vm.proposals.length; idx++) {
                                if (vm.proposals[idx].Key === vm.currentKey) {
                                    vm.selectedProposal = vm.proposals[idx];
                                    break;
                                }
                            }
                        } else {
                            vm.selectedProposal = vm.proposals[0];
                        }
                    }

                    if (vm.selectedProposal) {
                        vm.proposalUrl = proposalService.getProposalUrl(vm.selectedProposal);
                        getProposalDetail();

                        $scope.updatePageTitle('Craving Proposal - ' + getProposalTitle(vm.selectedProposal));
                        vm.isLoaded = true;
                    }

                    checkHasAnyExpiredProposal();
                });
            }, function (err) {
                // this means this user is not authenticated yet, 
                // TODO: use the resumeService here 
            });
        }

        function getProposalDetail() {
            // this one gets the full detail, including items and votes 
            proposalService.getByKey(vm.selectedProposal.Key).then(
                function (resp) {
                    vm.selectedProposal = resp.data;
                    vm.updatingProposalName = vm.selectedProposal.Name;
                    if (vm.selectedProposal) {
                        updateVotes();
                    }
                });
        }

        function checkHasAnyExpiredProposal() {
            for (var idx = 0; idx < vm.proposals.length; idx++) {
                if (vm.proposals[idx].IsExpired === true) {
                    vm.hasAnyExpiredProposal = true;
                    break;
                }
            }
        }

        function updateVotes() {
            for (var x = 0 ; x < vm.selectedProposal.Items.length; x++) {
                var item = vm.selectedProposal.Items[x];
                if (item.Votes && item.Votes.length > 0) {
                    for (var y = 0; y < item.Votes.length; y++) {
                        if (vm.profile.id === item.Votes[y].DinerId) {
                            vm.votes[item.RestaurantId] = true;
                        }
                    }
                }
            }
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        function postError(message) {
            vm.savedSuccessfully = false;
            vm.message = message;
        }

        function syncTotalItems(proposal) {

            var timer = $timeout(function() {
                $timeout.cancel(timer);
                for (var idx = 0; idx < vm.proposals.length; idx++) {
                    if (vm.proposals[idx].Key === proposal.Key) {
                        vm.proposals[idx].TotalItems = vm.proposals[idx].TotalItems - 1;
                    }
                }

                proposal.TotalItems = proposal.TotalItems - 1;
            });

        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\proposal\\proposal.view.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ViewProposalController', viewProposalController);

    viewProposalController.$inject = ['ProposalService', 'DinerService', 'RestaurantService', 'NavigationService',
        '$timeout', '$rootScope', '$scope'];

    function viewProposalController(proposalService, dinerService, restService, navigationService,
        $timeout, $rootScope, $scope) {
        var vm = this;

        var confirm = $rootScope.$stateParams.confirm;

        vm.diner = undefined;
        vm.overlayTitle = "Craving Proposal";
        vm.coverClass = "bg-craving-proposal";

        vm.profile = {};
        vm.proposals = [];
        vm.votes = [];
        vm.currentKey = undefined;
        vm.selectedProposal = undefined;
        vm.proposalUrl = undefined;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.isLoaded = false;

        // events
        vm.getProposalTitle = getProposalTitle;
        vm.formateDate = formateDate;
        vm.voteItem = voteItem;
        vm.getIterations = getIterations;

        // initialize
        activate();

        // event handlers
        function getProposalTitle(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function voteItem(item) {
            if (proposalService.hasVoted(item, vm.profile.id)) {
                postInfo('');
                proposalService.removeVote(vm.selectedProposal, item).then(function (response) {
                    getProposalDetail();
                }, function (err) {
                    postError(err);
                });
            } else {
                // this is needed because a user might be able to vote more than 1 per proposal (in the future) 
                if (proposalService.canVote(vm.selectedProposal, vm.profile.id)) {
                    proposalService.castVote(vm.selectedProposal, item).then(function (response) {
                        if (response.status === 200) {
                            postInfo('');
                            // this is bad for performance, but it's the quickest way to refresh the data 
                            getProposalDetail();
                        }
                    }, function (err) {
                        vm.votes[item.RestaurantId] = false;
                        postError('Vote failed: it is likely that you have already voted');
                    });
                } else {
                    vm.votes[item.RestaurantId] = false;
                    postError('You have already voted! You can only vote once in each proposal.');
                }
            }
        }

        function getIterations(counter) {
            var data = [];
            for (var i = 0; i < counter; i++) {
                data.push(i + 1);
            }
            return data;
        }

        // helpers
        function activate() {
            vm.currentKey = $rootScope.$stateParams.key;
            if (vm.currentKey) {
                getProposalDetail();
                if (confirm) {
                    // TODO: should display the just-added dish name
                    postInfo('Dish has been added to the craving proposal');
                }
            } else {
                postError('ah, you need a Key to open a Craing Proposal. Or create your own one now.');
            }
        }

        function updateVotes() {
            for (var x = 0 ; x < vm.selectedProposal.Items.length; x++) {
                var item = vm.selectedProposal.Items[x];
                if (item.Votes && item.Votes.length > 0) {
                    for (var y = 0; y < item.Votes.length; y++) {
                        if (vm.profile.id === item.Votes[y].DinerId) {
                            vm.votes[item.RestaurantId] = true;
                        }
                    }
                }
            }
        }

        function getProposalDetail() {
            // this one gets the full detail, including items and votes 
            proposalService.getByKey(vm.currentKey).then(
                function (resp) {
                    if (resp.data)
                        vm.selectedProposal = resp.data;
                    else
                        vm.selectedProposal = resp;

                    if (vm.selectedProposal) {
                        if (vm.selectedProposal.IsExpired) {
                            postError('This craving proposal has expired. You are too late. They have gone for the food without you. ');
                        } else {
                            updateVotes();
                            postInfo('');
                        }

                        $scope.updatePageTitle('Craving Proposal - ' + getProposalTitle(vm.selectedProposal));
                        vm.proposalUrl = proposalService.getProposalUrl(vm.selectedProposal);
                        vm.isLoaded = true;
                    }
                }, function (err) {
                    postError('Snap! The Craving Proposal you are trying to open does not exist anymore. Check with your friend. ');
                });
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        function postError(message) {
            vm.savedSuccessfully = false;
            vm.message = message;
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\restaurant\\restaurant.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantController', restaurantController);

    restaurantController.$inject = ['RestaurantService', 'NavigationService', 'uiGmapGoogleMapApi', 'FactualService',
        '$rootScope', '$scope',
        'fileService', '$timeout'];

    function restaurantController(restaurantService, navigationService, mapApi, factualService,
        $rootScope, $scope,
        fileService, $timeout) {

        var vm = this;
        vm.cravings = [];
        vm.selectedCravings = [];
        vm.dishes = [];
        vm.message = "";
        vm.isValid = true;
        vm.RestaurantName = "";
        vm.restaurants = [];
        vm.items = [];
        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;

        // events
        vm.getPreviewImage = getPreviewImage;
        vm.isCravingSelected = isCravingSelected;
        vm.selectCraving = selectCraving;
        vm.filterDish = filterDish;
        vm.locate = locate;

        activate();

        function activate() {
            vm.restaurantId = $rootScope.$stateParams.id;
            if (vm.restaurantId) {

                mapApi.then(function (map) {
                    if ($rootScope.position) {
                        vm.position = $rootScope.position;
                    } else {
                        vm.position = window.helper.getDefaultLocation();
                    }

                    updateCenter();

                    loadCravings();
                    loadDishes();
                    
                });

            } else {
                vm.message = "Restaurant Id is missing. The URL is invalid. Redirecting you to the home page now...";
                vm.isValid = false;
                gohome();
            }
        }

        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function getPreviewImage(url) {
            return fileService.getSafePreviewImage(url);
        }

        function isCravingSelected(item) {
            return vm.selectedCravings.indexOf(item) > -1;
        }

        function selectCraving(item) {
            var idx = vm.selectedCravings.indexOf(item);
            if (idx > -1) vm.selectedCravings.splice(idx, 1);
            else vm.selectedCravings.push(item);

            applyFilter();
        }

        function loadCravings() {
            restaurantService.getCravings(vm.restaurantId).then(function (response) {
                vm.cravings = response.data.Cravings;
                vm.restaurantName = response.data.RestaurantName;

                $scope.updatePageTitle('Restaurant - ' + vm.restaurantName);

                loadRestaurantLocation();
            },
                function (err) {
                    window.helper.handleError(err, vm);
                });
        }

        function loadDishes() {
            restaurantService.getDishes(vm.restaurantId).then(function (response) {
                vm.dishes = response.data.Items;
            }, function (err) {
                window.helper.handleError(err, vm);
            });
        }

        function loadRestaurantLocation() {
            factualService.getByName(vm.restaurantName, vm.position.userLocation.city).then(
                function (data) {
                    var restaurants = [];
                    for (var idx = 0; idx < data.response.data.length; idx++) {
                        if (window.helper.hasDuplication(data.response.data[idx], restaurants) === false) {
                            restaurants.push(data.response.data[idx]);
                        }
                    }

                    locateRestaurant(restaurants);
                });
        }

        function filterDish(c) {
            return c.isFiltered === undefined || c.isFiltered === false;
        }

        function applyFilter() {
            var noFilter = false;
            if (vm.selectedCravings.length === 0 || vm.selectedCravings.length === vm.cravings.length) {
                noFilter = true;
            }

            var selectedTags = vm.selectedCravings.map(function (c) {
                return c.CravingTag;
            });

            for (var idx = 0; idx < vm.dishes.length; idx++) {
                var dish = vm.dishes[idx];
                if (noFilter) {
                    dish.isFiltered = false;
                } else {
                    dish.isFiltered = true; // assuming this dish is out, but if we found any tag is in the selected, we stop the loop
                    for (var j = 0; j < dish.Cravings.length; j++) {
                        var tag = dish.Cravings[j];
                        if (isCravingTagSelected(tag, selectedTags)) {
                            dish.isFiltered = false;
                            break;
                        }
                    }
                }
            }
        }

        function isCravingTagSelected(tag, list) {
            return list.indexOf(tag) > -1;
        }

        function gohome() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                navigationService.go("app.home");
            }, 2000);
        }

        function updateCenter() {
            vm.map = window.MapHelper.createMap(vm.position.coords);
            vm.userCoords = vm.position.coords;
            ensureUserMarker();
        }

        function ensureUserMarker() {
            if (!vm.userMarker) {
                vm.map.userMarker = window.MapHelper.createUserMarker(vm.userCoords, null);
            }
        }

        function locateRestaurant(data) {
            if (data && data.length && data.length > 0) {
                var markers = [];
                for (var idx = 0; idx < data.length; idx++) {
                    var item = data[idx];
                    item.placeIndex = idx + 1;
                    item.isSelected = false;
                    vm.items.push(item);

                    var markerData = window.MapHelper.createRestaurantMarker(item, idx, onMarkerSelected, null);
                    markers.push(markerData);

                    vm.restaurants.push(item);
                }

                $timeout(function () {
                    vm.map.markers = markers;
                    vm.map.center = { latitude: vm.items[0].latitude, longitude: vm.items[0].longitude };
                    vm.map.options.zoom = 11;
                    vm.map.options.zoomControlOptions = {
                        position: google.maps.ControlPosition.LEFT_TOP,
                        style: google.maps.ZoomControlStyle.LARGE
                    };
                    vm.map.options.scrollwheel = false;
                }, 250); // if I don't delay here, it doesn't show all the new markers 
            }
        }

        function onMarkerSelected(sender) {
            if (sender.model && sender.model.factual_id) {
                selectMarker(sender.model);
            }
        }

        function selectMarker(marker) {
            if (vm.map.selectedMarker) {
                deSelectMarker(vm.map.selectedMarker);
            }

            var item = findItem(marker.factual_id);
            marker.options.opacity = 1.0;
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = true;
                });

                vm.map.selectedMarker = marker;
                vm.map.center.latitude = marker.coords.latitude;
                vm.map.center.longitude = marker.coords.longitude;
            }
        }

        function deSelectMarker(marker) {
            var item = findItem(marker.factual_id);
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = false;
                });
                marker.options.opacity = 0.4;
            }
        }

        function findMarker(factualId) {
            for (var idx = 0; idx < vm.map.markers.length; idx++) {
                if (vm.map.markers[idx].factual_id === factualId)
                    return vm.map.markers[idx];
            }

            return undefined;
        }

        function findItem(factualId) {
            for (var idx = 0; idx < vm.items.length; idx++) {
                if (vm.items[idx].factual_id === factualId)
                    return vm.items[idx];
            }

            return undefined;
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\restaurant\\singleRandomRestaurant.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('SingleRandomRestaurantController', singleRandomRestaurantController);

    singleRandomRestaurantController.$inject = ['RestaurantService', '$rootScope'];

    function singleRandomRestaurantController(restService, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        
        // properties 
        vm.restaurant = undefined;

        // events
        
        activate();

        function activate() {
            vm.position = $rootScope.position;
            get(1);
        }

        function get(total) {
            restService.getRandomRestaurant(vm.position, total).success(function(data) {
                if (data.Items && data.Items.length > 0) {
                    vm.restaurant = data.Items[0];
                }
            }).error(function() {
                vm.restaurant = undefined;
            });
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\services\\fileService.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .service('fileService', fileService);

    fileService.$inject = ['fileServer'];

    // this service launches and closes a modal window 
    function fileService(fileServer) {

        var service = {
            getSafePreviewImage: getSafePreviewImage,
            getSafeAvatarImage: getSafeAvatarImage
        };

        return service;

        function getSafeAvatarImage(imgName) {
            // chance is the diner has no image, which will return "Mystery" 
            if (imgName === "Mystery" || imgName === "" || imgName === undefined || imgName === null) {
                return "images/generic/generic_user.png";
            } else if (!imgName.startsWith("http://")) {
                imgName = window.helper.replaceAll(imgName, "\\", "/");
                imgName = fileServer + "/" + imgName;
            }

            return imgName;
        }

        function getSafePreviewImage(imgName) {
            if (imgName) {
                if (!imgName.startsWith("http://")) {
                    imgName = fileServer + "/" + imgName;
                }
            } else {
                imgName = "images/generic/no_image_available.png";
            }
            return imgName;
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\services\\loggerService.js":[function(require,module,exports){
(function () {
    'use strict';

    var app = angular.module('app');
    app.factory('logger', logger);

    logger.$inject = ['$mdToast'];

    function logger($mdToast) {
        var service = {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,
        };

        return service;
        /////////////////////

        // TODO: mdToast supports custom template

        function error(message, data, title) {
            $mdToast.simple().content(message);
        }

        function info(message, data, title) {
            $mdToast.simple().content(message);
        }

        function success(message, data, title) {
            $mdToast.simple().content(message);
        }

        function warning(message, data, title) {
            $mdToast.simple().content(message);
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\services\\modalService.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .service('ModalService', modalService);

    modalService.$inject = ['$mdDialog','$mdSidenav', '$rootScope'];

    // this service launches and closes a modal window 
    function modalService($mdDialog,$mdSidenav, $rootScope) {

        var service = {
            // calling this must pass a template and a controller. this is used to open an ad-hoc modal
            openModal: openHandler,

            // this will close only modal dialogs 
            closeModal: closeModalHandler,

            // this submits the modal dialog and returns a result
            submitModal: submitModalHandler,

            toggleSidenav: toggleSidenav,
            isSidenavOpen: isSidenavOpen,
            closeSidenav: closeSidenav
    };

        return service;

        // the input: entity is something can be passed in and resolved into the modal controller if wish 
        // if skip, the modal controller can ignore this; otherwise it can load something directly without having a DB roundtrip 
        function openHandler(url, controller, entity, ev) {
            cleanupModal();
            var modalScope = $rootScope.$new(true); // creating an isolate scope
            $rootScope.modalScope = modalScope;

            modalScope.modalInstance = $mdDialog.show({
                controller: controller,
                controllerAs: 'vm',
                templateUrl: url,
                targetEvent: ev,
                locals: { modalItem: entity }
            });

            return modalScope.modalInstance;
        }

        function closeModalHandler(reason) {
            if ($rootScope.modalScope && $rootScope.modalScope.modalInstance) {
                $mdDialog.hide(reason || 'cancel');
                cleanupModal();
            }
        }

        function submitModalHandler(result) {
            if ($rootScope.modalScope && $rootScope.modalScope.modalInstance) {
                $mdDialog.hide(result || 'cancel');
                cleanupModal();
            }
        }

        function cleanupModal() {
            if ($rootScope.modalScope) {
                $rootScope.modalScope.$destroy();
                $rootScope.modalScope = null;
            }
        }

        function toggleSidenav(menuId) {
            return $mdSidenav(menuId).toggle();
        }

        function isSidenavOpen(id) {
            return $mdSidenav(id).isOpen();
        }

        function closeSidenav(menuId) {
            return $mdSidenav(menuId).close();
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\sys\\location.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LocationController', locationController);

    locationController.$inject = ['GeoService', 'RestaurantService', '$http', '$scope', '$rootScope'];

    function locationController(geoService, restService, $http, $scope, $rootScope) {
        var vm = this;
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.currentCity = "";
        vm.title = "Set Your Location";
        vm.supportedCities = [];

        vm.relocateMe = relocateMe;
        vm.chooseCity = chooseCity;

        activate();

        function activate() {
            $scope.updatePageTitle('OurCraving - Choose your location');

            restService.getCitySummaries().then(function (response) {
                vm.supportedCities = response.data.Items;
            });

            updateMe();
        }

        var repeatGuard = 0;
        function relocateMe() {
            geoService.position = undefined;
            vm.savedSuccessfully = false;

            var q = geoService.initialize();

            q.then(function () {
                if (geoService.position) {
                    $rootScope.position = geoService.position;
                    updateMe();
                    vm.message = "You have been relocated successfully.";
                } else {
                    if (repeatGuard >= 5) {
                        vm.message = "Relocation timeout... try to refresh the browser first";
                    } else {
                        repeatGuard++;
                        relocateMe();
                    }
                }
            }).catch(function (err) {
                window.helper.handleError(err, vm);
            });
        }

        function chooseCity(city, region) {
            vm.message = "";

            // TODO: I am not sure how to handle this better
            var endpoint = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ", " + region + "&key=AIzaSyAoubTfOXSYpqqEhMN6DvTLMwScyMuFu18";
            $http({
                url: endpoint,
                cache: true,
                method: 'GET'
            }).then(function (response) {
                if (response.data.results.length > 0) {
                    var location = getLocation(response.data.results[0]);
                    $rootScope.position = location;
                    geoService.updatePosition(location);
                    updateMe();
                }
            });
        }

        function updateMe() {
            vm.savedSuccessfully = true;
            vm.currentCity = $rootScope.position.userLocation.city + ", " + $rootScope.position.userLocation.region;
        }

        function getLocation(result) {
            return {
                coords: {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng
                },
                userLocation: {
                    city: result.address_components[0].long_name,
                    region: result.address_components[result.address_components.length - 2].long_name,
                    country: result.address_components[result.address_components.length - 1].long_name
                }

            };
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\user\\diner.detail.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .controller('DinerDetailController', dinerDetailController);

    dinerDetailController.$inject = ['DinerService', 'ModalService', '$timeout', '$scope', '$rootScope', 'modalItem', 'fileService'];

    function dinerDetailController(dinerService, modalService, $timeout, $scope, $rootScope, modalItem, fileService) {

        var vm = this;
        vm.message = "";
        vm.diner = undefined;
        vm.recentCravings = [];
        vm.recentDishes = [];
        vm.recentReviews = [];
        vm.dislikes = [];

        // events
        vm.close = close;
        vm.getMemberSince = getMemberSince;
        vm.formateDate = formateDate;
        vm.getDinerImage = getDinerImage;

        // initialize
        activate();

        // helpers
        function activate() {
            // a dishLoader is used when opening a dish detail page, the diner page is a sidebar, we need to loader to tell 
            // us which diner to open 
            if (modalItem && modalItem.dinerId) {
                onDinerIdLoaded(modalItem.dinerId);
            } else {
                // this allows this controller reused when we want to display a diner without a dishLoader, in that case, the 
                // diner id should appear in the url 
                var dinerId = $rootScope.$stateParams.id;
                onDinerIdLoaded(dinerId);
            }
        }

        function onDinerIdLoaded(dinerId) {
            if (!dinerId) {
                vm.message = "No diner can be loaded. The Id is missing.";
                return;
            }
            dinerService.get(dinerId).then(
                function (response) {
                    vm.diner = response.data;
                    vm.dislikes = vm.diner.Dislikes;
                    loadAdditionalData();
                },
                function (err, status) {
                    window.helper.handleError(err, vm, "Cannot load user: ", status);
                });
        }

        function close() {
            modalService.closeModal();
        }

        function getMemberSince(diner) {
            if (diner && diner.RegistrationDate) {
                var date = new Date(diner.RegistrationDate);
                return date.getFullYear() + "," + window.helper.getMonthName(date);
            } else {
                return "";
            }
        }

        function formateDate(d) {
            if (d)
                return window.helper.getPostDateDescription(d);

            return "";
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        // helpers
        function loadAdditionalData() {
            loadRecentCravings();
            loadRecentReviews();
            loadRecentAddedDishes();
        }

        function loadRecentCravings() {
            vm.recentCravings = [];
            dinerService.getRecentCravings(vm.diner.Id).then(
                function (response) {
                    vm.recentCravings = response.data.Items;
                });
        }

        function loadRecentReviews() {
            vm.recentReviews = [];
            dinerService.getRecentReviews(vm.diner.Id).then(
                function (response) {
                    vm.recentReviews = response.data.Items;
                });
        }

        function loadRecentAddedDishes() {
            vm.recentDishes = [];
            dinerService.getRecentAddedDishes(vm.diner.Id).then(
                function (response) {
                    vm.recentDishes = response.data.Items;
                });
        }
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\compareTo.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('compareTo', compareTo);

    compareTo.$inject = [];

    function compareTo() {
        // Usage:
        //     <input type="password" name="confirmPassword" ng-model="registration.user.confirmPassword" required compare-to="registration.user.password" />
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\dirDisqus.js":[function(require,module,exports){
/**
 * A directive to embed a Disqus comments widget on your AngularJS page.
 *
 * Created by Michael on 22/01/14.
 * Copyright Michael Bromley 2014
 * Available under the MIT license.
 */

(function () {

    /**
     * Config
     */
    var moduleName = 'app';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module.directive('dirDisqus', ['$window', function ($window) {
        return {
            restrict: 'E',
            scope: {
                disqus_shortname: '@disqusShortname',
                disqus_identifier: '@disqusIdentifier',
                disqus_title: '@disqusTitle',
                disqus_url: '@disqusUrl',
                disqus_category_id: '@disqusCategoryId',
                disqus_disable_mobile: '@disqusDisableMobile',
                disqus_config_language: '@disqusConfigLanguage',
                disqus_remote_auth_s3: '@disqusRemoteAuthS3',
                disqus_api_key: '@disqusApiKey',
                disqus_on_ready: "&disqusOnReady",
                readyToBind: "@"
            },
            template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',
            link: function (scope,element, attributes) {

                // ensure that the disqus_identifier and disqus_url are both set, otherwise we will run in to identifier conflicts when using URLs with "#" in them
                // see http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-
                if (typeof scope.disqus_identifier === 'undefined' || typeof scope.disqus_url === 'undefined') {
                    throw "Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";
                }

                scope.$watch("readyToBind", function (isReady) {

                    // If the directive has been called without the 'ready-to-bind' attribute, we
                    // set the default to "true" so that Disqus will be loaded straight away.
                    if (!angular.isDefined(isReady)) {
                        isReady = "true";
                    }
                    if (scope.$eval(isReady)) {
                        console.log('remote' + scope.disqus_remote_auth_s3);
                        // put the config variables into separate global vars so that the Disqus script can see them
                        $window.disqus_shortname = scope.disqus_shortname;
                        $window.disqus_identifier = scope.disqus_identifier;
                        $window.disqus_title = scope.disqus_title;
                        $window.disqus_url = scope.disqus_url;
                        $window.disqus_category_id = scope.disqus_category_id;
                        $window.disqus_disable_mobile = scope.disqus_disable_mobile;
                        $window.disqus_config = function () {
                            this.language = scope.disqus_config_language;
                            this.page.remote_auth_s3 = scope.disqus_remote_auth_s3;
                            this.page.api_key = scope.disqus_api_key;
                            if (scope.disqus_on_ready) {
                                this.callbacks.onReady = [function () {
                                    scope.disqus_on_ready();
                                }];
                            }
                        };
                        // get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
                        if (!$window.DISQUS) {
                            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                            dsq.src = '//' + scope.disqus_shortname + '.disqus.com/embed.js';
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                        } else {
                            $window.DISQUS.reset({
                                reload: true,
                                config: function () {
                                    this.page.identifier = scope.disqus_identifier;
                                    this.page.url = scope.disqus_url;
                                    this.page.title = scope.disqus_title;
                                    this.language = scope.disqus_config_language;
                                    this.page.remote_auth_s3 = scope.disqus_remote_auth_s3;
                                    this.page.api_key = scope.disqus_api_key;
                                }
                            });
                        }
                    }
                });
            }
        };
    }]);

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\dishDuplicationCheck.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('dishDuplicationCheck', duplicationCheck);

    duplicationCheck.$inject = ['RestaurantService'];

    function duplicationCheck(restService) {
        // Usage:
        //     <input dish-duplication-check="vm.dish.restaurantName" ng-model="vm.dish.name" />

        var running;
        return {
            require: "ngModel",
            scope: {
                restaurantName: "=dishDuplicationCheck"
            },
            link: function (scope, element, attributes, ngModel) {

                //ngModel.$validators.dishDuplicationCheck = function (modelValue) {
                //    runValidation(modelValue);
                //};

                element.on('blur', function() {
                    runValidation(ngModel.$modelValue);
                });

                scope.$watch("restaurantName", function () {
                    if (running) clearTimeout(running);
                    runValidation(ngModel.$modelValue);
                });

                function runValidation(modelValue) {
                    if (modelValue !== undefined && modelValue !== "" &&
                        scope.restaurantName !== undefined && scope.restaurantName != '') {
                        running = setTimeout(function () {
                            restService.getDishByName(scope.restaurantName, modelValue).success(function (data) {
                                ngModel.$setValidity('dishDuplicationCheck', data.Items.length == 0);
                            });
                        }, 200);
                    }

                }
            }
        };
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\fileField.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('fileField', fileField);

    fileField.$inject = ['$parse'];

    function fileField($parse) {
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                onFileRead: '&',
                preview: '='
            },
            link: function (scope, element, attrs, ngModel) {
                //set default bootstrap class
                //if (!attrs.class && !attrs.ngClass) {
                //    element.addClass('md-button md-raised');
                //}

                var field = element.find('input');

                field.bind('change', function (event) {
                    scope.$evalAsync(function () {
                        ngModel.$setViewValue(event.target.files[0]);
                        if (attrs.preview) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                scope.$evalAsync(function () {
                                    scope[attrs.preview] = e.target.result;
                                    scope.preview = e.target.result;
                                });

                                scope.$apply(function () {
                                    if (scope.onFileRead) {
                                        scope.onFileRead({
                                            file: event.target.files[0],
                                            content: e.target.result
                                        });
                                    }
                                });

                                //if (attrs.onFileRead) {
                                //    var callback = $parse(attrs.onFileRead);
                                //    callback(event.target.files[0], e.target.result);
                                //}

                            };
                            reader.readAsDataURL(event.target.files[0]);
                        }
                    });
                });

                field.bind('click', function (e) {
                    e.stopPropagation();
                });

                element.bind('click', function (e) {
                    e.preventDefault();
                    field[0].click();
                });
            },
            template: '<button class="md-button md-raised" type="button"><ng-transclude></ng-transclude><input type="file" style="display:none"></button>',
            replace: true,
            transclude: true
        };
    }

})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\md\\widgets\\ngplus-overlay.js":[function(require,module,exports){
/*
 * ngplus-overlay.js
 * Version 0.9.2
 * Copyright 2014 John Papa and Dan Wahlin
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: John Papa and Dan Wahlin
 * Project: https://github.com/AngularPlus
 */
(function () {
    'use strict';

    var overlayApp = angular.module('ngplus', []);

    //Empty factory to hook into $httpProvider.interceptors
    //Directive will hookup request, response, and responseError interceptors
    overlayApp.factory('ngplus.httpInterceptor', httpInterceptor);
    function httpInterceptor() { return {} }

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    overlayApp.config(['$httpProvider', httpProvider]);
    function httpProvider($httpProvider) {
        $httpProvider.interceptors.push('ngplus.httpInterceptor');
    }

    //Directive that uses the httpInterceptor factory above to monitor XHR calls
    //When a call is made it displays an overlay and a content area
    //No attempt has been made at this point to test on older browsers
    overlayApp.directive('ngplusOverlay', ['$q', '$timeout', '$window', 'ngplus.httpInterceptor', overlay]);

    function overlay($q, $timeout, $window, httpInterceptor) {
        var directive = {
            scope: {
                ngplusOverlayDelayIn: "@",
                ngplusOverlayDelayOut: "@",
                ngplusOverlayAnimation: "@"
            },
            restrict: 'EA',
            transclude: true,
            template: getTemplate(),
            link: link
        };
        return directive;

        function getTemplate() {
            return '<div id="ngplus-overlay-container" ' +
                'class="{{ngplusOverlayAnimation}}" data-ng-show="!!show">' +
                '<div class="ngplus-overlay-background"></div>' +
                '<div id="ngplus-overlay-content" class="ngplus-overlay-content" data-ng-transclude>' +
                '</div>' +
                '</div>';
        }

        function link(scope, element, attrs) {
            var defaults = {
                overlayDelayIn: 500,
                overlayDelayOut: 500
            };
            var delayIn = scope.ngplusOverlayDelayIn ? scope.ngplusOverlayDelayIn : defaults.overlayDelayIn;
            var delayOut = scope.ngplusOverlayDelayOut ? scope.ngplusOverlayDelayOut : defaults.overlayDelayOut;
            var overlayContainer = null;
            var queue = [];
            var timerPromise = null;
            var timerPromiseHide = null;

            init();

            function init() {
                wireUpHttpInterceptor();
                if (window.jQuery) wirejQueryInterceptor();
                overlayContainer = document.getElementById('ngplus-overlay-container');
            }

            //Hook into httpInterceptor factory request/response/responseError functions
            function wireUpHttpInterceptor() {

                httpInterceptor.request = function (config) {
                    if (!config.hideOverlay) {
                        processRequest();
                    }
                    return config || $q.when(config);
                };

                httpInterceptor.response = function (response) {
                    processResponse();
                    return response || $q.when(response);
                };

                httpInterceptor.responseError = function (rejection) {
                    processResponse();
                    return $q.reject(rejection);
                };
            }

            //Monitor jQuery Ajax calls in case it's used in an app
            function wirejQueryInterceptor() {
                $(document).ajaxStart(function () { processRequest(); });
                $(document).ajaxComplete(function () { processResponse(); });
                $(document).ajaxError(function () { processResponse(); });
            }

            function processRequest() {
                queue.push({});
                if (queue.length == 1) {
                    timerPromise = $timeout(function () {
                        if (queue.length) showOverlay();
                    }, delayIn); //Delay showing for 500 millis to avoid flicker
                }
            }

            function processResponse() {
                queue.pop();
                if (queue.length == 0) {
                    //Since we don't know if another XHR request will be made, pause before
                    //hiding the overlay. If another XHR request comes in then the overlay
                    //will stay visible which prevents a flicker
                    timerPromiseHide = $timeout(function () {
                        //Make sure queue is still 0 since a new XHR request may have come in
                        //while timer was running
                        if (queue.length == 0) {
                            hideOverlay();
                            if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                        }
                    }, delayOut);
                }
            }

            function showOverlay() {
                var w = 0;
                var h = 0;
                if (!$window.innerWidth) {
                    if (!(document.documentElement.clientWidth == 0)) {
                        w = document.documentElement.clientWidth;
                        h = document.documentElement.clientHeight;
                    }
                    else {
                        w = document.body.clientWidth;
                        h = document.body.clientHeight;
                    }
                }
                else {
                    w = $window.innerWidth;
                    h = $window.innerHeight;
                }
                var content = document.getElementById('ngplus-overlay-content');
                var contentWidth = parseInt(getComputedStyle(content, 'width').replace('px', ''));
                var contentHeight = parseInt(getComputedStyle(content, 'height').replace('px', ''));

                content.style.top = h / 2 - contentHeight / 2 + 'px';
                content.style.left = w / 2 - contentWidth / 2 + 'px';

                scope.show = true;
            }

            function hideOverlay() {
                if (timerPromise) $timeout.cancel(timerPromise);
                scope.show = false;
            }

            var getComputedStyle = function () {
                var func = null;
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    func = document.defaultView.getComputedStyle;
                } else if (typeof (document.body.currentStyle) !== "undefined") {
                    func = function (element, anything) {
                        return element["currentStyle"];
                    };
                }

                return function (element, style) {
                    return func(element, null)[style];
                }
            }();
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\adminService.js":[function(require,module,exports){
(function () {
    'use strict';
    var profileKey = "ProfileData";
    var app = angular.module('app');

    app
        .service('AdminService', adminService);

    adminService.$inject = ['$http', '$q', 'logger', 'localStorageService', 'baseUrl2'];

    function adminService($http, $q, logger, localStorageService, baseUrl2) {

        var adminServiceFactory = {
            removeDish: removeDish,
            removeReview: removeReview,
            getAllCravingTags: getAllCravingTags,
            getAllRecentDishes: getAllRecentDishes,
            getAllRecentReviews: getAllRecentReviews,
            getAllRecentUsers: getAllRecentUsers,
            updateCravingTag: updateCravingTag
        };

        return adminServiceFactory;

        function removeDish(dishId, reason) {
            var data = {
                Reason: reason
            };

            return $http({
                method: 'DELETE',
                url: baseUrl2 + "dishes/" + dishId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function removeReview(reviewId, reason) {
            var data = {
                Reason: reason
            };

            return $http({
                method: 'DELETE',
                url: baseUrl2 + "dishes/review/" + reviewId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function updateCravingTag(tagId, active)
        {
            var data = {
                Id: tagId,
                IsActive: active
            };

            return $http({
                method: 'PUT',
                url: baseUrl2 + "cravings/" + tagId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function getAllCravingTags(page, limit)
        {
            return $http.get(baseUrl2 + "cravings/" + "all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentDishes(page, limit) {
            return $http.get(baseUrl2 + "dishes/" + "admin/all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentReviews(page, limit) {
            return $http.get(baseUrl2 + "dishes/" + "admin/review/all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentUsers(page, limit) {
            return $http.get(baseUrl2 + "diners/" + "admin/all?pageNumber=" + page + "&pageSize=" + limit);
        }

    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\authService.js":[function(require,module,exports){
(function () {
    'use strict';

    var storageKey = "authorizationData";

    var app = angular.module('app');

    app.service('AuthService', authService)
        .factory('authInterceptorService', authInterceptorService);

    authService.$inject = ['$http', '$q', 'logger', 'localStorageService', 'authUrl', 'tokenUrl', 'authSettings'];

    function authService($http, $q, logger, localStorageService, authUrl, tokenUrl, authSettings) {
        var serviceBase = authUrl;
        // NOTE: before we let the service property return this variable, it doesn't work in the resume task scenario
        //var authentication = {
        //    isAuth: false,
        //    email: "",
        //    displayName: "",
        //    avatar: "",
        //    uid: "",
        //    dinerId: "",
        //    role: "",
        //    useRefreshTokens: false
        //};

        var roleCheckTypes = {
            all: "all",
            any: "any"
        };

        var service = {
            saveRegistration: saveRegistration,
            login: login,
            logOut: logOut,
            fillAuthData: fillAuthData,
            activate: activate,
            forgetpassword: forgetpassword,
            resetpassword: resetpassword, // request to reset password, need a code to update
            changepassword: changepassword, // these 2 methods are different. this one is required to enter the current password
            authentication: {},
            loadClaims: loadClaims,
            refreshToken: refreshToken,
            authorize: authorize,
            roleCheckTypes: roleCheckTypes,
            externalLogin: externalLogin,
            getAccessToken: getAccessToken,
            externalAuthData: {},
            registerExternalUser: registerExternalUser
        };

        return service;

        function loadClaims() {
            return $http.get(serviceBase + "/getClaims").then(function (response) {
                return response;
            });
        }


        function saveRegistration(registration) {
            logOut();
            return $http.post(serviceBase + '/register', registration).then(function (response) {
                return response;
            });
        }

        function forgetpassword(email) {
            var model = {
                'Email': email,
                'ResendConfirmationEmail': true
            };

            return $http.put(serviceBase + '/forgetpassword', model, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
                return response;
            });
        }

        function resetpassword(restData) {
            return $http.put(serviceBase + '/resetpassword', restData, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
                return response;
            });
        }

        function changepassword(changeData) {
            return $http.put(serviceBase + '/changepassword', changeData, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
                return response;
            });
        }

        function activate(id, code) {
            var model = {
                'UserId': id,
                'Code': code
            };

            return $http.put(serviceBase + '/activate', model, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
                return response;
            });
        }

        function login(loginData) {
            var data = "grant_type=password&username=" + loginData.email + "&password=" + loginData.password;
            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + authSettings.clientId;
            }

            var deferred = $q.defer();
            $http.post(tokenUrl, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                }
            }).success(function (response) {

                localStorageService.set(storageKey, buildAuthenticateStorageData(response));
                fillAuthData();
                deferred.resolve(response);

            }).error(function (err, status) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function externalLogin(provider, $scope) {
            var redirectUri = location.protocol + "//" + location.host + '/md/externalLogin.html';

            var externalProviderUrl = serviceBase + "/ExternalLogin?provider=" + provider
                                                  + "&response_type=token"
                                                  + "&client_id=" + authSettings.clientId
                                                  + "&redirect_uri=" + redirectUri;

            window.$windowScope = $scope;

            var oathWindow = window.open(externalProviderUrl, "Authenticate with " + provider, "location=0,status=0,width=600,height=750");                                            
        }

        function registerExternalUser(authData) {
            var deferred = $q.defer();

            $http.post(serviceBase + "/RegisterExternal", authData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getAccessToken(externalData) {

            var deferred = $q.defer();

            $http.get(serviceBase + '/ObtainLocalAccessToken', {
                params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken }
            }).success(function (response) {
                localStorageService.set(storageKey, buildAuthenticateStorageData(response));
                fillAuthData();
                deferred.resolve(response);
            }).error(function (err, status) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        function refreshToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get(storageKey);

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + authSettings.clientId;
                    localStorageService.remove(storageKey);

                    $http.post(tokenUrl, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        localStorageService.set(storageKey, buildAuthenticateStorageData(response));
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        }

        function buildAuthenticateStorageData(response) {
            return {
                token: response.access_token,
                email: response.userName, // this is the email value
                displayName: response.displayName,
                avatar: response.avatar,
                uid: response.uid,
                dinerId: window.helper.parseInt10(response.dinerId), // I can only write string back
                role: response.role,
                refreshToken: response.refresh_token,
                useRefreshTokens: response.refresh_token !== undefined && response.refresh_token !== ""
            };
        }

        function logOut() {
            localStorageService.remove(storageKey);
            service.authentication.isAuth = false;
            service.authentication.email = "";
        }

        function fillAuthData() {
            var authData = localStorageService.get(storageKey);
            if (authData) {
                service.authentication.isAuth = true;
                service.authentication.email = authData.email;
                service.authentication.displayName = authData.displayName;
                service.authentication.uid = authData.uid;
                service.authentication.dinerId = authData.dinerId;
                service.authentication.roles = [authData.role];
                service.authentication.avatar = authData.avatar;
            } else {
                service.authentication = {};
                service.authentication.isAuth = false;
            }
        }

        function authorize(requiredRoles, roleCheckType) {
            var numRolesFound = 0;

            if (!requiredRoles || requiredRoles.length === 0) {
                return true;
            }

            if (!roleCheckType) {
                roleCheckType = roleCheckTypes.all;
            }

            var numRolesRequired = roleCheckType === roleCheckTypes.any ? 1 : requiredRoles.length;

            fillAuthData();

            if (service.authentication && service.authentication.roles) {
                for (var i = 0; i < service.authentication.roles.length; i++) {

                    var hasThisPermission = $.inArray(service.authentication.roles[i].toLowerCase(), requiredRoles) >= 0;

                    if (hasThisPermission) {
                        numRolesFound++;
                    }
                }
            }

            return numRolesFound === numRolesRequired;
        }
    }

    authInterceptorService.$inject = ['$q', '$injector', 'NavigationService', 'localStorageService', 'ocService'];
    function authInterceptorService($q, $injector, navigationService, localStorageService, ocServiceEndPoint) {
        var interceptor = {
            request: requestHandler,
            responseError: responseHandler
        };

        return interceptor;

        function requestHandler(config) {
            config.headers = config.headers || {};

            // we should only intercept $httpProvider if we are requesting our own service
            if (config.url && config.url.indexOf(ocServiceEndPoint) >= 0) {
                var authData = localStorageService.get(storageKey);
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }
            }

            return config;
        }

        function responseHandler(rejection) {
            var deferred = $q.defer();

            if (rejection.status === 401) {
                attemptRefreshAndRetryHttpRequest(rejection, deferred);
            }
            else {
                deferred.reject(rejection);
            }

            return deferred.promise;
        }

        function attemptRefreshAndRetryHttpRequest(rejection, deferred) {

            var authorizationService = $injector.get('AuthService');
            var authData = localStorageService.get(storageKey);

            // TODO: a better UX should be :
            // - if this operation is rejected, it means the service op needs authentication
            // - we should popup the login form, and ask for authentication
            // - login the user, and then continue the operation
            if (authData && authData.useRefreshTokens) {
                authorizationService.refreshToken().then(
                    function () {
                        retryHttpRequest(rejection.config, deferred);
                    }).catch(
                    function () {
                        // This should never occur, unless the refresh token was explicitly revoked;
                        gotoUnauthorizedPage(authorizationService, rejection, deferred);
                    });

            } else {
                gotoUnauthorizedPage(authorizationService, rejection, deferred);
            }
        }

        function retryHttpRequest(config, deferred) {
            var httpService = $injector.get('$http');
            httpService(config)
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function (response) {
                    // if this happens, why?
                    deferred.reject(response);
                });
        }

        function gotoUnauthorizedPage(authorizationService, rejection, deferred) {
            authorizationService.logOut();
            deferred.reject(rejection);
            navigationService.go("login");
        }
    }
}());

},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\cravingService.js":[function(require,module,exports){
(function () {
    'use strict';

    var app = angular.module('app');

    app.service('CravingService', cravingService);

    cravingService.$inject = ['$http', '$q', 'baseUrl2'];

    function cravingService($http, $q, baseUrl2) {

        var service = {
            // properties

            // methods
            getTrending: getTrendingHandler,
            searchCraving: searchCravingHandler,
            getRecent: getRecentHandler,
            getDish: getDishHandler,
            getCravingDiners: getCravingDiners,
            getDishReview: getDishReview,

            craveForIt: craveForItHandler,
            updateCravings: updateCravings,
            updateDescription: updateDescription,
            addFile: addFile,
            addReview: addReview,
            updateReview: updateReview,
            addOpinion: addOpinion
        };

        return service;

        // used to vote if a review is useful 
        function addOpinion(dishId, reviewId, dinerId, isUseful) {
            var data = {
                "DishId": dishId,
                "ReviewId": reviewId,
                "DinerId": dinerId,
                "IsUseful": isUseful
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/rating/" + reviewId + "/opinion", data);
        }

        function updateReview(dishId, reviewId, rating, review, dinerId) {
            var data = {
                "DishId": dishId,
                "Rating": rating,
                "Review": review,
                "ReviewerId": dinerId
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/rating/" + reviewId, data);
        }

        function addReview(dishId, rating, review, dinerId) {
            var data = {
                "DishId": dishId,
                "Rating": rating,
                "Review": review,
                "ReviewerId": dinerId
            };

            return $http.post(baseUrl2 + "dishes/" + dishId + "/rating", data);
        }

        function updateDescription(dishId, description) {
            var data = {
                "DishId": dishId,
                "Description": description
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/description", data);
        }

        function getDishReview(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId + "/reviews");
        }

        function getCravingDiners(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId + "/cravingdiners");
        }

        function getDishHandler(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId);
        }

        // city - a string of city name
        // location - a geo location: it should be fomatted as "lat, lon", without quotation marks 
        function getTrendingHandler(location) {
            // this op can be paged, but I don't know if we need to, let's just simply get everything and cache it
            return $http(
                {
                    url: baseUrl2 + "cravings/trending?showAll=true&&location=" + location,
                    cache: true,
                    method: 'GET'
                });
        }

        // used when a user clicks the [Crave] icon of a dish 
        // "fire-and-forget" 
        function craveForItHandler(dishId) {
            // I am not sure what we need to do
            return $http.put(baseUrl2 + "cravings/dish/" + dishId);
        }

        function searchCravingHandler(cravings, city, location, pageNumber) {
            var pageSize = 20;
            return $http(
                {
                    url: baseUrl2 + "dishes/search/" + city + "?cravings=" + cravings + "&location=" + location + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize,
                    method: 'GET'
                }
                );
        }

        function getRecentHandler(city) {
            return $http.get(baseUrl2 + "dishes/" + city);
        }

        function updateCravings(dishId, cravings) {
            return $http.put(baseUrl2 + 'dishes/' + dishId + '/cravings', { 'Cravings': cravings });
        }

        function addFile(dishId, fileName) {
            return $http.post(baseUrl2 + 'dishes/' + dishId + '/file', {
                'DishId': dishId,
                'FileName': fileName
            });
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\dinerService.js":[function(require,module,exports){
(function () {
    'use strict';
    var profileKey = "ProfileData";
    var app = angular.module('app');

    app
        .service('DinerService', dinerService);

    dinerService.$inject = ['$http', '$q', 'logger', 'localStorageService', 'baseUrl2'];

    function dinerService($http, $q, logger, localStorageService, baseUrl2, genericAvatar) {
        var serviceBase = baseUrl2;

        // dinerSummary 
        var profile = {
            displayName: "",
            tagLine: "",
            avatar: "",
            birthday: "",
            email: "",
            id: ""
        };

        var dinerServiceFactory = {
            // properties
            profile: profile,
            // methods 
            get: getDiner,
            getMyProfile: getMyProfile,
            updateMyProfile: updateMyProfile,
            updateDislike: updateDislike,
            getDislike: getDislike,
            getRecentCravings: getRecentCravings,
            getRecentReviews: getRecentReviews,
            getRecentAddedDishes: getRecentAddedDishes,
            getRecentFavorites: getRecentFavorites,

            flush: cleanupCache
        };

        return dinerServiceFactory;

        function getDiner(id) {
            return $http.get(serviceBase + "diners/profile/" + id);
        }

        function getMyProfile() {
            return getCachedProfile();
        }

        function updateMyProfile() {
            return $http.put(serviceBase + "diners/" + profile.id + "/update", profile).then(
                function (response) {
                    setProfile(response.data);
                    cacheProfile();
                });
        }

        function getDislike(id) {
            return $http.get(serviceBase + "diners/" + id + "/dislikes");
        }

        function getRecentCravings(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/cravings";
            if (all) {
                url = url + "?all=true";
            }

            return $http.get(url);
        }

        function getRecentReviews(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/reviews";
            if (all) {
                url = url + "?all=true";
            }
            return $http.get(url);
        }

        function getRecentAddedDishes(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/dishes";
            if (all) {
                url = url + "?all=true";
            }

            return $http.get(url);
        }

        function getRecentFavorites(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/favorites";
            if (all) {
                url = url + "?all=true";
            }
            return $http.get(url);
        }

        function updateDislike(id, cravingIds) {
            var data = {
                "Cravings": cravingIds,
                "Id": id
            };

            return $http.put(serviceBase + "diners/" + id + "/dislikes", data);
        }

        function getCachedProfile() {
            var deferred = $q.defer();

            var profileData = localStorageService.get(profileKey);
            if (!profileData || !profileData.id || !profileData.displayName || !profileData.email) {
                $http.get(serviceBase + "diners/profile").then(
                        function (response) {
                            profile.displayName = response.data.DisplayName;
                            profile.tagLine = response.data.TagLine;
                            profile.avatar = response.data.Avatar;
                            profile.birthday = new Date(response.data.Birthday);
                            profile.email = response.data.Email;
                            profile.id = response.data.Id;
                            //profile.avatar = window.helper.getSafeAvatarImage(profile.avatar);
                            profile.isLoaded = true;
                            cacheProfile();

                            deferred.resolve(profile);
                        },
                        function (err) {
                            deferred.reject(err);
                        });
            } else {
                profile.displayName = profileData.displayName;
                profile.tagLine = profileData.tagLine;
                profile.avatar = profileData.avatar;
                profile.birthday = new Date(profileData.birthday);
                profile.email = profileData.email;
                profile.id = profileData.id;
                deferred.resolve(profile);
            }

            return deferred.promise;
        }

        function cleanupCache() {
            localStorageService.remove(profileKey);
        }

        function setProfile(response) {
            profile.displayName = response.DisplayName;
            profile.tagLine = response.TagLine;
            profile.avatar = response.Avatar;
            profile.birthday = new Date(response.Birthday);
            profile.email = response.Email || response.PrimaryEmail;
            profile.id = response.Id;
            // profile.avatar = window.helper.getSafeAvatarImage(profile.avatar);
            profile.isLoaded = true;
        }

        function cacheProfile() {
            if (profile !== null && profile.isLoaded) {
                localStorageService.set(profileKey,
                    {
                        displayName: profile.displayName,
                        tagLine: profile.tagLine,
                        avatar: profile.avatar,
                        birthday: profile.birthday,
                        email: profile.email,
                        id: profile.id
                    });
            }
        }
    }
}());
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\factualService.js":[function(require,module,exports){
(function () {
    'use strict';

    // we are using Factual API because it doesn't have the limitations that Google Places API has, 
    // https://developers.google.com/places/webservice/usage
    // Google constraints: 
    // 1) 1000 requests per 24 hours, can get 150, 000 requests per 24 hours if verified
    // 2) max 60 records, 20 each request, must wait 2 seconds for the next page 
    // 3) each text search is counted as 10 requests, which means if we want to support wildcard search of restaurant, it might be unpredictable 

    // FactualAPI supports 10K free requests per day 
    // no max record limit, no paging delay, can navigate next and previous, can support different search methods 

    angular
        .module('app')
        .service('FactualService', factualService);

    factualService.$inject = ['$http', 'logger'];

    // TODO: this service is not supposed to exist in this form, instead, it should call our own service, which internally call FactualAPI;
    // for 2 reasons: 1) we don't have to expose what external API and the API key we are using to the client side 
    // 2) if we ever need to change the dependency, we change in our server side, so the client side doesn't have any impact. 
    // it's here now because after I crafted the server side service, I actually need more data and an additional op, I endedup quickly adding them here instead 
    function factualService($http, logger) {
        var service = this;
        var factualKey = "KEY=qr3JDULKk91BtxWbZlnO3TEA6VrRieh1G1yyzlEP";
        var serviceBaseUrl = "http://api.v3.factual.com/t/places";

        var searchUrl = serviceBaseUrl + "?geo={\"$circle\":{\"$center\":[{0}, {1}],\"$meters\": 2000}}" +
            "&filters={\"category_ids\":{\"$includes_any\":[312,347]}}" +
            "&include_count=true&" + factualKey;

        var getByNameUrl = serviceBaseUrl + "?" +
            "filters={" +
                "\"$and\": [" +
                  "{" +
                      "\"category_ids\": {" +
                          "\"$includes_any\": [312,347]" +
                      "}" +
                  "}," +
                  "{" +
                      "\"name\": {" +
                          "\"$search\": \"{0}\"" +
                      "}" +
                  "}," +
                  "{" +
                      "\"locality\": {" +
                          "\"$eq\":\"{1}\"}}]}" +
    "&include_count=true&" + factualKey;

        var findInCityUrl = "http://api.v3.factual.com/t/places-us?q={2}&filters={\"$and\":[{\"locality\":\"{0}\"},{\"region\":\"{1}\"}]}&limit=1&select=name,address,postcode&" + factualKey;

        service.searchNear = getData;
        service.getPlace = getPlace;
        service.getByName = getByName;
        service.findInCity = findInCity;

        return service;

        // name is the name of a restaurant
        function findInCity(name, city, region) {
            var url = getByNameUrl.format(city, region, escape(name));
            return $http({ method: 'GET', url: url })
                .then(
                function (data, status, headers, config) {
                    return data.data;
                },
                function (error) {
                    logger.error(error);
                    return error;
                }
            );
        }

        function getByName(name, city) {
            var searchText = escape(name);
            var url = getByNameUrl.format(searchText, city);
            return $http({ method: 'GET', url: url })
                .then(
                function (data, status, headers, config) {
                    return data.data;
                },
                function (error) {
                    logger.error(error);
                    return error;
                }
            );
        }

        function getData(lat, lng, offset, limit) {
            var url = searchUrl.format(lat, lng);
            if (offset !== undefined) {
                url = url + "&offset=" + offset;
            }

            if (limit) {
                url = url + "&limit=" + limit;
            }

            return $http({
                method: 'GET',
                url: url,
                cache: true
            }).then(function (data, status, headers, config) {
                return data.data;
            },
            function (error) {
                logger.error(error);
                return error;
            }
            );
        }

        function getPlace(placeId) {
            var url = serviceBaseUrl + "/" + placeId + "?" + factualKey;
            return $http({
                method: 'GET',
                url: url,
                cache: true
            }).then(function (data, status, headers, config) {
                return data.data;
            },
            function (error) {
                logger.error(error);
                return error;
            }
            );
        }
    }

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\geoService.js":[function(require,module,exports){
(function () {
    'use strict';

    // part of this file come from a github open source project, but it was a factory. 
    // converted it to a service so only one instance will be created, and we don't have to request geolocation from the browser 
    // however, a draw back is: if the user has the browser open and then travel to another city (keep the browser opened), the geolocation won't refresh
    var app = angular.module('app');

    app
        .service('GeoService', geoService);

    geoService.$inject = ['$rootScope', '$window', '$q', '$http', 'baseUrl2'];

    function geoService($rootScope, $window, $q, $http, baseUrl2) {

        var service = {
            getCurrentPosition: getCurrentPosition,
            initialize: initialize,
            getPosition: getPosition,
            updatePosition: updatePosition,

            // properties 
            position: {},
            hasInitialized: false,
            GEO_UPDATE: 'geo_updated'
        };

        return service;

        function supported() {
            return 'geolocation' in $window.navigator;
        }

        function getPosition() {
            return service.position;
        }

        function initialize() {
            service.hasInitialized = false;
            var deferred = $q.defer();
            if (service.position && service.position.coords && service.position.userLocation && service.position.userLocation.city) {
                service.hasInitialized = true;
                deferred.resolve(service.position);
                return deferred.promise;
            } else {
                return loadGeo().then(loadPlace);
            }
        }

        function getCurrentPosition(options) {
            var deferred = $q.defer();
            if (supported()) {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        // this is a very strange issue. I encountered a few times the returned location is far off from where I am
                        // the accuracy is over 6000. did some research, it seems if keep calling this getCurrentPosition, it will 
                        // get better accurate value each time. someone even wrote a library to pass in a desired accuracy and return 
                        // only if the value is met, but I think that's overkilled, here calling it twice is probably enough 
                        if (position.coords.accuracy > 5000) {
                            $window.navigator.geolocation.getCurrentPosition(
                                function (secondPosition) {
                                    foundPosition(secondPosition, deferred);
                                }
                            );
                        } else {
                            foundPosition(position, deferred);
                        }

                    },
                    function (error) {
                        deferred.reject({ error: error });
                    }, options);
            } else {
                deferred.reject({
                    error: {
                        code: 2,
                        message: 'This web browser does not support HTML5 Geolocation'
                    }
                });
            }
            return deferred.promise;
        }

        function foundPosition(position, deferred) {
            service.position = {};
            service.position.coords = position.coords;
            service.position.timestamp = position.timestamp;
            deferred.resolve(position);
        }

        function loadGeo() {
            return getCurrentPosition({ timeout: 6000, enableHighAccuracy: false, maximumAge: 60000 });
        }

        function loadPlace(position) {
            return locateUserLocation(position.coords.latitude, position.coords.longitude).then(function (response) {
                service.position.userLocation = {};
                service.position.userLocation.city = response.data.City;
                service.position.userLocation.region = response.data.Region;
                service.position.userLocation.country = response.data.Country;
                service.hasInitialized = true;

                updatePosition(service.position);
            });
        }

        function updatePosition(position) {
            $rootScope.$emit(service.GEO_UPDATE, position);
        }

        function locateUserLocation(latitude, longitude) {
            var serviceBase = baseUrl2;
            var input = {
                "location": latitude + "," + longitude
            };

            return $http.get(serviceBase + "restaurants/location", { params: input });
        }

    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\loaderFactory.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoaderFactory', loaderFactory);

    loaderFactory.$inject = [];

    function loaderFactory() {
        return function (maxListeners) {
            var loader = this;

            // TODO: NOT USED
            loader.maxListeners = maxListeners || 100;

            loader.current = undefined;
            loader.loadedEvents = [];
            loader.load = loadEntity;
            loader.addLoadedEventListener = addEventListener;
            loader.removeLoadedEventListener = removeEventListener;

            return loader;

            function removeEventListener(eventHandler) {
                var foundIdx = -1;
                for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                    if (loader.loadedEvents[idx] === eventHandler) {
                        foundIdx = idx;
                        break;
                    }
                }

                if (foundIdx >= 0) {
                    loader.loadedEvents.splice(foundIdx, 1);
                }
            }

            function addEventListener(eventHandler) {
                var found = false;
                for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                    if (loader.loadedEvents[idx] === eventHandler) {
                        found = true;
                        break;
                    }
                }

                if (!found && isFunction(eventHandler)) {
                    loader.loadedEvents.push(eventHandler);
                }
            }

            function loadEntity(entity) {
                if (entity !== loader.current) {
                    loader.current = entity;
                    for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                        loader.loadedEvents[idx](loader.current);
                    }
                }
            }

            function isFunction(functionToCheck) {
                var getType = {};
                return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
            }
            
        };
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\navigationService.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .service('NavigationService', navigationService);

    navigationService.$inject = ['$rootScope'];

    function navigationService($rootScope) {

        var service = {
            // properties 
            params: getParams,
            go: goHandler,
        };

        return service;

        function getParams() {
            return $rootScope.$stateParams;
        }

        function goHandler(stateName, toParams, options) {
            $rootScope.$state.go(stateName, toParams, options);
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\proposalService.js":[function(require,module,exports){
(function () {
    'use strict';

    var defaultKey = "12345";
    angular
        .module('app')
        .service('ProposalService', proposalService);

    proposalService.$inject = ['RestaurantService', '$http', '$q', 'logger', 'baseUrl2', '$rootScope'];

    function proposalService(restService, $http, $q, logger, baseUrl2, $rootScope) {
        var serviceBase = baseUrl2;
        var service = {
            // events
            getByDiner: getByDiner,
            getByKey: getByKey,
            getProposalUrl: getProposalUrl,

            addItem: addItem,
            castVote: castVote,
            createProposal: createProposal,
            extendProposal: extendProposal,
            expireProposal: expireProposal,
            reactivate: reactivate,
            updateName: updateName,

            removeVote: removeVote,
            removeCart: removeCart,
            removeItem: removeItem,

            hasVoted: hasVoted,
            canVote: canVote,

            // properties
            proposals: []
    };

        return service;

        function getProposalUrl(proposal) {
            return $rootScope.$state.href('proposal.view', { key: proposal.Key }, { absolute: true });
        }

        function getByDiner(dinerId) {
            var deferred = $q.defer();
            $http.get(serviceBase + "cravingcart/diner/" + dinerId).then(function (response) {
                if (response.data) {
                    service.proposals = response.data.Items;
                }
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getByKey(key) {
            return $http.get(serviceBase + "cravingcart/" + key);
        }

        function reactivate(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/extend");
        }

        function removeItem(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;

            return $http.delete(serviceBase + "cravingcart/" + cartId + "/item/" + itemId);
        }

        function removeCart(cartId) {
            return $http.delete(serviceBase + "cravingcart/" + cartId);
        }

        function castVote(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;

            // I don't need to pass dinerId, because the service side will load it automatically if the user is logged in
            return $http.put(serviceBase + "cravingcart/" + cartId + "/vote/" + itemId);
        }

        function removeVote(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;
            return $http.delete(serviceBase + "cravingcart/" + cartId + "/vote/" + itemId);
        }

        function hasVoted(item, dinerId) {
            if (item.Votes) {
                for (var idx = 0; idx < item.Votes.length; idx++) {
                    if (item.Votes[idx].DinerId === dinerId)
                        return true;
                }
            }
            return false;
        }

        function canVote(proposal, dinerId) {
            // this method returns false as long as this dinerId has voted to any, however, the server side has a value that is configureable per proposal
            // currently we are not using that value, but we might think about it later 
            var curr = proposal;
            if (curr && curr.Items) {
                for (var idx = 0; idx < curr.Items.length; idx++) {
                    var votes = curr.Items[idx].Votes;
                    if (votes) {
                        for (var j = 0; j < votes.length; j++) {
                            if (votes[j].DinerId === dinerId) {
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }

        function extendProposal(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/extend");
        }

        function expireProposal(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/expire");
        }

        function updateName(cartId, name) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/name", '"' + name + '"').then(function() {
                for (var idx = 0; idx < service.proposals.length; idx++) {
                    if (service.proposals[idx].Id == cartId) {
                        service.proposals[idx].Name = name;
                    }
                }
            });
        }

        function createProposal(proposal) {
            return $http.post(serviceBase + "cravingcart", proposal);
        }

        // this service method is not responsible for what to do if there is no proposal or if the user is not authenticated 
        function addItem(dish, proposal) {
            return $http.put(serviceBase + "cravingcart/" + proposal.Id + "/item/", {
                "RestaurantId": dish.RestaurantId,
                "DishId": dish.DishId
            });
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\recentDishService.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .service('RecentDishService', recentDishService);

    recentDishService.$inject = ['localStorageService'];

    function recentDishService(localStorageService) {
        var service = {
            // events
            loadRecent: loadRecent,
            addToRecent: addToRecent,
            onRefresh: undefined,
            flush : flush,
            dishes: []
        };

        var storageKey = "recentDishData";

        return service;

        function loadRecent() {
            service.dishes = localStorageService.get(storageKey);
            if (!service.dishes) {
                service.dishes = [];
            }

            return service.dishes;
        }

        function addToRecent(dish) {
            service.dishes = localStorageService.get(storageKey);
            if (!service.dishes) {
                service.dishes = [];
            }

            var foundIdx = undefined;
            for (var idx = 0; idx < service.dishes.length; idx++) {
                if (service.dishes[idx].DishId === dish.DishId) {
                    foundIdx = idx;
                    break;
                }
            }

            if (foundIdx !== undefined) {
                service.dishes.splice(foundIdx, 1);
            } else {
                if (service.dishes.length >= 9) {
                    service.dishes.pop();
                }
            }

            service.dishes.unshift(dish);
            localStorageService.set(storageKey, service.dishes);
            if (service.onRefresh) {
                service.onRefresh();
            }
        }

        function flush() {
            service.dishes = [];
            localStorageService.set(storageKey, service.dishes);
            if (service.onRefresh) {
                service.onRefresh();
            }
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\referenceDataService.js":[function(require,module,exports){
(function () {
    'use strict';

    var app = angular.module('app');

    app
        .service('ReferenceDataService', referenceDataService);

    referenceDataService.$inject = ['$http', 'baseUrl', 'logger', '$q'];

    // indeed, we can use Angular built-in option cache: true to cache a get op for some of these data, but there is no a strangeforward way to flush.
    // to do that, I will have to write a cacheFactory first
    function referenceDataService($http, baseUrl, logger, $q) {
        var caches = [];
        var service = {
            getData: getData,
            getKeys: getKeys,
            flush: flush // it should be called if we want to remove a specified ref data from cache
        };

        return service;

        function getData(refTableName) {
            if (caches[refTableName] !== undefined) {
                var def = $q.defer();
                def.resolve(caches[refTableName]);
                return def.promise;
            } else {
                var dataUrl = baseUrl + refTableName;
                return $http({
                    method: 'GET',
                    url: dataUrl
                }).then(function (data, status, headers, config) {
                    caches[refTableName] = data.data;
                    return data.data;
                }, function (error) {
                    console.log(error);
                    logger.error(error);
                    return error;
                });
            }
        }

        function getKeys() {
            return Object.keys(caches);
        }

        function flush(refTableName) {
            if (refTableName in caches)
                caches.remove(refTableName);
        }
    }
})();

},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\restaurantService.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .service('RestaurantService', restaurantService);

    restaurantService.$inject = ['$http', '$q', 'logger', 'baseUrl2'];

    function restaurantService($http, $q, logger, baseUrl2) {
        var serviceBase = baseUrl2;
        var service = {

            // events
            find: findRestaurant,
            findExact: findRestaurantExact,
            matchDish: matchDish,
            addDish: addDish,
            getDishes: getDishes,
            getCravings: getCravings,
            getDishByName: getDishByName,
            getRandomRestaurant: getRandomRestaurant,
            getCitySummaries: getCitySummaries
        };

        return service;

        function matchDish(name) {
            return $http.get(serviceBase + "dishes/match/" + name);
        }

        function findRestaurantExact(userLocation, restaurantName) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "name": restaurantName,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country
            };
            return $http.get(serviceBase + "restaurants/findexact", { params: input });
        }

        function findRestaurant(userLocation, restaurantName) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "name": restaurantName,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country
            };
            return $http.get(serviceBase + "restaurants/find", { params: input });
        }

        function getCravings(restaurantId) {
            return $http.get(serviceBase + "restaurants/" + restaurantId + "/cravings");
        }

        function getDishes(restaurantId) {
            return $http.get(serviceBase + "restaurants/" + restaurantId + "/dishes");
        }

        function getDishByName(restaurantName, dishName) {
            var restName = window.helper.replaceAll(restaurantName, "&", "_");
            var dName = window.helper.replaceAll(dishName, "&", "_");
            return $http.get(serviceBase + "restaurants/" + escape(restName) + "/dish/" + escape(dName));
        }

        function getRandomRestaurant(userLocation, total) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country,
                "total": total
            };

            return $http.get(serviceBase + "restaurants/random", { params: input });
        }

        // the input comes from dish.add.js 
        function addDish(dish, dinerProfile, userLocation) {
            // this data needs to match AddDishReqV2 format 
            var data = {
                "RestaurantName": dish.restaurant.name,
                "City": dish.restaurant.city || userLocation.city,
                "Region": dish.restaurant.region || userLocation.region,
                "Country": dish.restaurant.country || userLocation.country,
                "Address": dish.restaurant.address,
                "Geo": {
                    "Latitude": dish.restaurant.latitude,
                    "Longitude": dish.restaurant.longitude
                },
                "PlaceId": dish.restaurant.placeId,
                "PostalCode": dish.restaurant.postalCode,
                "PhoneNumber": dish.restaurant.phoneNumber,
                "Name": dish.name,
                "Description": dish.description,
                "Rating": dish.rating,
                "Review": dish.review,
                "ImageFileName": dish.imageFileName,
                "DinerId": dinerProfile.id,
                "SelectedCravings": dish.selectedCravings.length > 0 ? dish.selectedCravings.map(function (element) { return element.CravingId; }) : []
            };

            return $http.post(serviceBase + 'dishes/add', data);
        }

        function getCitySummaries() {
            return $http.get(serviceBase + 'restaurants/citysummary');
        }
    }
})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\resumeService.js":[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('app')
        .service('ResumeService', resumeService);

    resumeService.$inject = ['AuthService','NavigationService','$q', '$timeout', '$rootScope'];

    // this is a simple stack that used for resume a task. 
    // the idea is: if a user is not authenticated, the caller controller push a function to this service, and then redirect to the login page
    // the login page will authenticate the user and the pop the funciton out to resume. the same logic can be applied to a modal window.
    // not sure if this is the best pratice but it should work in most scenarios. 
    function resumeService(authService, navigationService,$q, $timeout, $rootScope) {
        $rootScope.$on('$stateChangeSuccess', onStateChangedSuccess);
        var oldState, oldParams;
        var tasks = new Array();
        var service = {
            resume: resumeTask,
            push: addResume,
            needResume: hasTask,
            message: "",
            hasMessage: false,
            createResume: createResume,
            flush: flush
        };

        return service;

        function hasTask() {
            return tasks.length > 0;
        }

        // this method is used to ensure no ghost task remaining 
        // we should pay attention, if a user wants to do something but realize authentication is required, then he doesn't want to do it (login). 
        // the task will stay without being executed. next this user does a set of things, finally decides to log in, we don't want to execute
        // everything together, it will be very confusing and may even be incorrect; so it's the caller's responsibility to call this method before a new task
        function flush() {
            if (tasks.length > 0) {
                tasks.splice(0, tasks.length);
            }
        }

        function createResume(resumeCall, msg) {
            if (authService.authentication.isAuth) {
                resumeCall();
            } else {
                service.push(resumeCall, msg);
                navigationService.go('login');
            }
        }

        function resumeTask() {
            service.message = "";
            service.hasMessage = false;
            var latest = tasks.pop();
            var promise = latest();
            if (promise && promise.then) {
                promise.then(function () {
                    runNext();
                });
            } else {
                runNext();
            }

            // we want to delay this so the resume task can have a bit time to complete, unless we create a promise from latest 
            //var timer = $timeout(function () {
            //    $timeout.cancel(timer);

            //    if (oldState) {
            //        navigationService.go(oldState, oldParams, { reload: true });
            //    } else {
            //        navigationService.go('home');
            //    }
            //}, 800);

        }

        function addResume(task, msg) {
            tasks.push(task);
            service.message = msg;
            service.hasMessage = msg!=undefined && msg !== "";
        }

        function onStateChangedSuccess(event, toState, toParams, fromState, fromParams) {
            oldState = fromState;
            oldParams = fromParams;
        }

        function runNext() {
            if (hasTask()) {
                resumeTask();
            } else {
                completeTask();
            }
        }

        function completeTask() {
            if (oldState) {
                navigationService.go(oldState, oldParams, { reload: true });
            } else {
                navigationService.go('home');
            }
        }
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\services\\service.module.js":[function(require,module,exports){
(function() {
    'use strict';

    // angular.module('oc.services', ['ngResource'])
    var app = angular.module('app');

    app
        .config([
            '$httpProvider', function($httpProvider) {
                //$httpProvider.defaults.headers.post = {
                //    'Access-Control-Allow-Origin': 'http://localhost:3000',
                //    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
                //};

                //$httpProvider.defaults.headers.put = {
                //    'Access-Control-Allow-Origin': 'http://localhost:3000',
                //    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
                //    'Content-Type': 'application/json'
                //};
            }
        ]);

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\access.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('access', access);

    access.$inject = ['AuthService'];

    function access(authService) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link($scope, element, attrs) {

            var roles = attrs.access.toLowerCase().split(',').map(function (s) { return s.trim(); });
            var reverse = attrs.reverse || false;

            var showElement = function() {
                element.removeClass('hidden');
            };

            var hideElement = function() {
                element.addClass('hidden');
            };

            var determineAccess = function() {
                var hasAccess = authService.authorize(roles, attrs.roleCheckType);

                if (hasAccess) {
                    if (reverse) {
                        hideElement();
                    } else {
                        showElement();
                    }
                } else {
                    if (reverse) {
                        showElement();
                    } else {
                        hideElement();
                    }
                }
            };

            if (roles.length > 0) {
                determineAccess();
            }
        }        
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\cravingSelect.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('cravingSelect', cravingSelect);

    cravingSelect.$inject = ['ReferenceDataService', '$timeout'];

    function cravingSelect(refService, $timeout) {
        // Usage:
        //     <cravingSelect></cravingSelect>
        // Creates:
        var directive = {
            templateUrl: 'widgets/cravingSelect.tpl.html',
            restrict: 'E',
            replace: true,
            scope: {
                selectedCraving: "="
            },
            link: link
        };

        return directive;

        function link($scope, element, attrs) {
            $scope.cravings = [];
            $scope.local = {};

            refService.getData("cravingtype").then(function (response) {
                $scope.cravings = response.Items.sort(function (a, b) {
                    return a.Name > b.Name;
                });
                setLocalSelection();
            });

            // this is a hack, because this directive is loaded before the page is loaded
            // the selected is only loaded after the page is loaded, so the directive can't display the selected items 
            $scope.$watch("selectedCraving", function () {
                if ($scope.selectedCraving.length === 0) {
                    var timer1 = $timeout(function () {
                        $timeout.cancel(timer1);
                        $scope.local.selected = undefined;
                    });
                }
                else if ($scope.selectedCraving.length > 0 && $scope.local.selected === undefined ) {
                    var timer2 = $timeout(function () {
                        $timeout.cancel(timer2);
                        setLocalSelection();
                    });
                }
            });

            // I honestly don't know why I have to do this, I was expecting "=" is a 2-way binding and as long as I use ng-model (tried),
            // it should automatically update the creator. but I spent a few hours and couldn't get it work. 
            // so I have to manually update this variable
            $scope.selectCraving = function (item, model) {

                var idx = findItem(item.Id);
                if (idx < 0) {
                    $scope.selectedCraving.push({ CravingId: item.Id });
                }
            };

            $scope.removeCraving = function (item, model) {
                var idx = findItem(item.Id);
                if (idx >= 0) {
                    $scope.selectedCraving.splice(idx, 1);
                }
            };

            function findItem(id) {
                for (var idx = 0; idx < $scope.selectedCraving.length; idx++) {
                    if ($scope.selectedCraving[idx].CravingId === id) {
                        return idx;
                    }
                }
                return -1;
            }

            function setLocalSelection() {
                // can we do better in here?
                $scope.local.selected = [];
                if ($scope.selectedCraving.length > 0) {
                    for (var i = 0; i < $scope.selectedCraving.length; i++) {
                        for (var j = 0; j < $scope.cravings.length; j++) {
                            if ($scope.selectedCraving[i].CravingId === $scope.cravings[j].Id) {
                                $scope.local.selected.push($scope.cravings[j]);
                                break;
                            }
                        }
                    }
                }
            }
        } // end link
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\ngConfirmClick.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('ngConfirmClick', ngConfirmClick);

    function ngConfirmClick() {
        // Usage:
        //     <button nng-confirm-click="$event.stopPropagation();getExternalScopes().delete(row);">Delete</button>
        // Creates:
        //  pops up a confirmation dialog when clicking the button 
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attr) {
            var msg = attr.confirmMsg || "Are you sure?";
            var clickAction = attr.ngConfirmClick;
            element.bind('click', function (event) {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction);
                }
            });
        }
    }

})();
},{}],"D:\\Craving.Web\\src\\js\\themes\\ourcraving\\widgets\\onLastRepeat.js":[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('app')
        .directive('onLastRepeat', onLastRepeat);

    onLastRepeat.$inject = [];

    function onLastRepeat(refService) {
        // Usage:
        //     <any ng-repeat="" on-last-repeat> 
        //      in controller: $scope.$on('onRepeatLast', function(scope, elem,ent, attrs) {});
        // Creates:
        return function (scope, element, attrs) {
            if (scope.$last)
                setTimeout(function () {
                    scope.$emit('onRepeatLast', element, attrs);
                }, 1);
        };
    }

})();
},{}]},{},["./src/js/themes/md/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYXBwLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcX2FwcEhlbHBlci5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXF9tYXBIZWxwZXIuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxhY2NvdW50LmFjdGl2YXRlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWNjb3VudFxcYWNjb3VudC5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFjY291bnRcXGFjY291bnQubG9naW4uanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxhY2NvdW50LnJlc2V0LmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWNjb3VudFxcYWNjb3VudC5zaWdudXAuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxwcm9maWxlLmFzc29jaWF0ZS5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFjY291bnRcXHByb2ZpbGUuYmFzaWMuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxwcm9maWxlLmNyYXZpbmdoaXN0b3J5LmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWNjb3VudFxccHJvZmlsZS5kaXNsaWtlY3JhdmluZ3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxwcm9maWxlLmZhdm9yaXRlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWNjb3VudFxccHJvZmlsZS5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFjY291bnRcXHByb2ZpbGUubXlkaXNoLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWNjb3VudFxccHJvZmlsZS5teXJldmlldy5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFjY291bnRcXHByb2ZpbGUuc2V0dGluZ3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhY2NvdW50XFxwcm9maWxlLnVwZGF0ZXBhc3N3b3JkLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWRtaW5cXGFkbWluLmNhY2hlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWRtaW5cXGFkbWluLmNyYXZpbmd0YWdzLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWRtaW5cXGFkbWluLmRpc2hlcy5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFkbWluXFxhZG1pbi5maWxlcy5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFkbWluXFxhZG1pbi5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGFkbWluXFxhZG1pbi5tb2RlcmF0aW9uLm1vZGFsLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcYWRtaW5cXGFkbWluLnJldmlld3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxhZG1pblxcYWRtaW4udXNlcnMuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxhcHAuY29uc3RhbnQuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxhcHAuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxjb25maWcucm91dGVyLmFjY291bnQuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxjb25maWcucm91dGVyLmFkbWluLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcY29yZVxcY29uZmlnLnJvdXRlci5kaXNoLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcY29yZVxcY29uZmlnLnJvdXRlci5ob21lLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcY29yZVxcY29uZmlnLnJvdXRlci5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGNvcmVcXGNvbmZpZy5yb3V0ZXIucHJvcG9zYWwuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxjb25maWcucm91dGVyLnJlc3RhdXJhbnQuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjb3JlXFxtYWluLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcY3JhdmluZ1xcY3JhdmluZy5zZWFyY2guanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxjcmF2aW5nXFxjcmF2aW5nLnRhZ3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxkaXNoXFxkaXNoLmFkZC5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGRpc2hcXGRpc2guYWRkSW1hZ2UuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxkaXNoXFxkaXNoLmFkZFRhZ3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxkaXNoXFxkaXNoLmRldGFpbC5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGRpc2hcXGRpc2gucmVjZW50LmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcZGlzaFxcaW1hZ2UubW9kYWwuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxkaXNoXFxtYXAuYWRkLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcZGlzaFxcbWFwLnZpZXdlci5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGxheW91dFxcaGVhZGVyLmNvbW1hbmRzLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcbGF5b3V0XFxoZWFkZXIuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxsYXlvdXRcXG5hdmJhci5sb2NhdGlvbi5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXGxheW91dFxcc2VhcmNoLmJhci5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXG1haW4uanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxwcm9wb3NhbFxccHJvcG9zYWwubW9kYWwuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxwcm9wb3NhbFxccHJvcG9zYWwubXkuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxwcm9wb3NhbFxccHJvcG9zYWwudmlldy5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXHJlc3RhdXJhbnRcXHJlc3RhdXJhbnQuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxyZXN0YXVyYW50XFxzaW5nbGVSYW5kb21SZXN0YXVyYW50LmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcc2VydmljZXNcXGZpbGVTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcc2VydmljZXNcXGxvZ2dlclNlcnZpY2UuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG1kXFxzZXJ2aWNlc1xcbW9kYWxTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcc3lzXFxsb2NhdGlvbi5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXHVzZXJcXGRpbmVyLmRldGFpbC5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXHdpZGdldHNcXGNvbXBhcmVUby5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXHdpZGdldHNcXGRpckRpc3F1cy5qcyIsInNyY1xcanNcXHRoZW1lc1xcbWRcXHdpZGdldHNcXGRpc2hEdXBsaWNhdGlvbkNoZWNrLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcd2lkZ2V0c1xcZmlsZUZpZWxkLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxtZFxcd2lkZ2V0c1xcbmdwbHVzLW92ZXJsYXkuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHNlcnZpY2VzXFxhZG1pblNlcnZpY2UuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHNlcnZpY2VzXFxhdXRoU2VydmljZS5qcyIsInNyY1xcanNcXHRoZW1lc1xcb3VyY3JhdmluZ1xcc2VydmljZXNcXGNyYXZpbmdTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xcZGluZXJTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xcZmFjdHVhbFNlcnZpY2UuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHNlcnZpY2VzXFxnZW9TZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xcbG9hZGVyRmFjdG9yeS5qcyIsInNyY1xcanNcXHRoZW1lc1xcb3VyY3JhdmluZ1xcc2VydmljZXNcXG5hdmlnYXRpb25TZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xccHJvcG9zYWxTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xccmVjZW50RGlzaFNlcnZpY2UuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHNlcnZpY2VzXFxyZWZlcmVuY2VEYXRhU2VydmljZS5qcyIsInNyY1xcanNcXHRoZW1lc1xcb3VyY3JhdmluZ1xcc2VydmljZXNcXHJlc3RhdXJhbnRTZXJ2aWNlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFxzZXJ2aWNlc1xccmVzdW1lU2VydmljZS5qcyIsInNyY1xcanNcXHRoZW1lc1xcb3VyY3JhdmluZ1xcc2VydmljZXNcXHNlcnZpY2UubW9kdWxlLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFx3aWRnZXRzXFxhY2Nlc3MuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHdpZGdldHNcXGNyYXZpbmdTZWxlY3QuanMiLCJzcmNcXGpzXFx0aGVtZXNcXG91cmNyYXZpbmdcXHdpZGdldHNcXG5nQ29uZmlybUNsaWNrLmpzIiwic3JjXFxqc1xcdGhlbWVzXFxvdXJjcmF2aW5nXFx3aWRnZXRzXFxvbkxhc3RSZXBlYXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDT1JFXG5yZXF1aXJlKCcuL21haW4nKTtcbiIsIi8vIHNvbWUgamF2YXNjcmlwdCBoZWxwZXIgbWV0aG9kcyBmb3IgdGhpcyBhcHAgc3BlY2lmaWMgXHJcbi8vIEkgdGhpbmsgdGhpcyBzaG91bGQgYmUgYW4gYW5ndWxhciBzZXJ2aWNlIGluc3RlYWQuLi4gXHJcbmZ1bmN0aW9uIEFwcEhlbHBlcigpIHtcclxuXHJcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIGluc3RhbmNlLmhhbmRsZUVycm9yID0gaGFuZGxlRXJyb3I7XHJcbiAgICBpbnN0YW5jZS5idWlsZFJhdGluZ0xhYmVsID0gYnVpbGRSYXRpbmdMYWJlbDtcclxuICAgIGluc3RhbmNlLmZvcm1hdERhdGUgPSBmb3JtYXREYXRlO1xyXG4gICAgaW5zdGFuY2UuaXNFbWFpbCA9IGlzRW1haWw7XHJcbiAgICBpbnN0YW5jZS5wYXJzZUludDEwID0gcGFyc2VJbnQxMDtcclxuICAgIGluc3RhbmNlLnNwbGl0QXJyYXkgPSBzcGxpdEFycmF5O1xyXG4gICAgaW5zdGFuY2UucmVwbGFjZUFsbCA9IHJlcGxhY2VBbGw7XHJcbiAgICBpbnN0YW5jZS5nZXREZWZhdWx0TG9jYXRpb24gPSBnZXREZWZhdWx0TG9jYXRpb247XHJcbiAgICBpbnN0YW5jZS5kaWZmRGF0ZSA9IGRpZmZEYXRlO1xyXG4gICAgaW5zdGFuY2UuZ2V0RGF0ZVN0cmluZyA9IGdldERhdGVTdHJpbmc7XHJcbiAgICBpbnN0YW5jZS5nZXRUb2RheVBsdXMgPSBnZXRUb2RheVBsdXM7XHJcbiAgICBpbnN0YW5jZS5oYXNEdXBsaWNhdGlvbiA9IGhhc0R1cGxpY2F0aW9uO1xyXG4gICAgaW5zdGFuY2UuZ2V0TW9udGhOYW1lID0gZ2V0TW9udGhOYW1lO1xyXG4gICAgaW5zdGFuY2UuZ2V0UG9zdERhdGVEZXNjcmlwdGlvbiA9IGdldFBvc3REYXRlRGVzY3JpcHRpb247XHJcbiAgICBpbnN0YW5jZS5yZWZyZXNoaW5nID0gcmVmcmVzaGluZztcclxuICAgIGluc3RhbmNlLnJhbmRvbUludCA9IHJhbmRvbUludDtcclxuXHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcmFuZG9tSW50KG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogbWF4KSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzRW1haWwodmFsdWUpIHtcclxuICAgICAgICBpZiAoL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhlIGlucHV0IHNob3VsZCBiZSBhIGRhdGV0aW1lIG9mZnNldCBmb3JtYXRcclxuICAgIGZ1bmN0aW9uIGZvcm1hdERhdGUoaW5wdXQpIHtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGlucHV0KTtcclxuICAgICAgICB2YXIgcmV0dmFsID0gZGF0ZS50b0pTT04oKTtcclxuICAgICAgICByZXR2YWwgPSByZXR2YWwuc2xpY2UoMCwgMTApO1xyXG4gICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRSYXRpbmdMYWJlbCh2YWx1ZSkge1xyXG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiT25jZSBpbiBsaWZldGltZSBpcyBlbm91Z2hcIjtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiV29uJ3QgbWluZCB0cnlpbmcgaXQgYWdhaW4gaW4gYSBmZXcgbW9udGhzXCI7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRhc3R5ISBXaWxsIGVhdCBpdCBvbmNlIGEgbW9udGghXCI7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIll1bW15ISBJIGNhbiBoYXZlIGl0IG9uY2UgYSB3ZWVrIVwiO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiSGVhdmVubHkhIEkgY2FuIGVhdCB0aGlzIGV2ZXJ5ZGF5IVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBoZXJlIGlzIHRyeWluZyB0byBoYXZlIGEgZ2VuZXJpYyBlcnJvciBoYW5kbGVyIGZvciB0aGUgZW50aXJlIGFwcGxpY2F0aW9uXHJcbiAgICAvLyBlcnIgLSB0aGUgZXJyb3IgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmljZSwgcmVxdWlyZWQgXHJcbiAgICAvLyB2bSAtIHRoZSB2aWV3bW9kZWwsIHJlcXVpcmVkIFxyXG4gICAgLy8gbXNnUHJlZml4IC0gb3B0aW9uYWwsIHdlIHByZWZpeCB0aGUgZXJyb3IgbWVzc2FnZSB1c2luZyBpdFxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyLCB2bSwgbXNnUHJlZml4LCBzdGF0dXMpIHtcclxuXHJcbiAgICAgICAgaWYgKCF2bSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogZ28gdG8gYSBzcGVjaWZpYyBwYWdlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXJyICE9PSBudWxsICYmIGVyciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKGVyci5Nb2RlbFN0YXRlIHx8IChlcnIuZGF0YSAmJiBlcnIuZGF0YS5Nb2RlbFN0YXRlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gZXJyLk1vZGVsU3RhdGUgfHwgZXJyLmRhdGEuTW9kZWxTdGF0ZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVba2V5XS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChzdGF0ZVtrZXldW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IChtc2dQcmVmaXggfHwgJycpICsgZXJyb3JzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIuRXhjZXB0aW9uTWVzc2FnZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAobXNnUHJlZml4IHx8ICcnKSArIGVyci5FeGNlcHRpb25NZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyLmVycm9yX2Rlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IChtc2dQcmVmaXggfHwgJycpICsgZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyLmRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IChtc2dQcmVmaXggfHwgJycpICsgZXJyLmRhdGEuTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVyci5tZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVyci5zdWJzdHJpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IChtc2dQcmVmaXggfHwgJycpICsgZXJyO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAobXNnUHJlZml4IHx8ICcnKSArIFwidW5rbm93biBlcnJvciwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlNlcnZlciBpcyBub3QgcmVzcG9uZGluZywgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VJbnQxMCh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBzcGxpdCBhbiBhcnJheSBpbnRvIGVxdWFsIHNpemVcclxuICAgIC8vIC0gYTogYXJyYXlcclxuICAgIC8vIC0gbjogdGhlIHNpemUgXHJcbiAgICAvLyAtIHJldHVybjogYW4gYXJyYXkgb2YgYXJyYXlcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmdW5jdGlvbiBzcGxpdEFycmF5KGEsIG4pIHtcclxuICAgICAgICB2YXIgbGVuID0gYS5sZW5ndGgsXHJcbiAgICAgICAgICAgIG91dCA9IFtdLFxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB3aGlsZSAoaSA8IGxlbikge1xyXG4gICAgICAgICAgICB2YXIgc2l6ZSA9IE1hdGguY2VpbCgobGVuIC0gaSkgLyBuLS0pO1xyXG4gICAgICAgICAgICBvdXQucHVzaChhLnNsaWNlKGksIGkgKyBzaXplKSk7XHJcbiAgICAgICAgICAgIGkgKz0gc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlQWxsKHN0ciwgZmluZCwgcmVwbGFjZVN0ciwgaWdub3JlQ2FzZSkge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShuZXcgUmVnRXhwKGZpbmQucmVwbGFjZSgvKFtcXC9cXCxcXCFcXFxcXFxeXFwkXFx7XFx9XFxbXFxdXFwoXFwpXFwuXFwqXFwrXFw/XFx8XFw8XFw+XFwtXFwmXSkvZywgXCJcXFxcJCZcIiksXHJcbiAgICAgICAgICAgIChpZ25vcmVDYXNlID8gXCJnaVwiIDogXCJnXCIpKSwgKHR5cGVvZiAocmVwbGFjZVN0cikgPT0gXCJzdHJpbmdcIikgPyByZXBsYWNlU3RyLnJlcGxhY2UoL1xcJC9nLCBcIiQkJCRcIikgOiByZXBsYWNlU3RyKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0TG9jYXRpb24oKSB7XHJcbiAgICAgICAgLy8gdGhpcyBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciByZWplY3RzIHRvIGdpdmUgYXdheSBsb2NhdGlvblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvb3Jkczoge1xyXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDQ5Ljg5OTQsXHJcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IC05Ny4xMzkyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVzZXJMb2NhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgY2l0eTogXCJXaW5uaXBlZ1wiLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBcIk1hbml0b2JhXCIsXHJcbiAgICAgICAgICAgICAgICBjb3VudHJ5OiBcIkNhbmFkYVwiXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsZXZlbCBzaG91bGQgYmU6IG1pbiwgaHIsIGRheVxyXG4gICAgZnVuY3Rpb24gZGlmZkRhdGUoZGF0ZTEsIGRhdGUyLCBsZXZlbCkge1xyXG4gICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZShkYXRlMik7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBkMiAtIGQxO1xyXG4gICAgICAgIGlmIChpc05hTihkaWZmKSlcclxuICAgICAgICAgICAgcmV0dXJuIE5hTjtcclxuXHJcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSAxMDAwICogNjA7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICBpZiAobGV2ZWwgPT09IFwibWluXCIpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5yb3VuZChkaWZmIC8gbWludXRlcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gXCJoclwiKSB7XHJcbiAgICAgICAgICAgIHZhciBob3VycyA9IG1pbnV0ZXMgKiA2MDtcclxuICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5yb3VuZChkaWZmIC8gaG91cnMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBkYXlzID0gbWludXRlcyAqIDYwICogMjQ7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IE1hdGgucm91bmQoZGlmZiAvIGRheXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREYXRlU3RyaW5nKGRhdGUpIHtcclxuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIGlmIChpc05hTihkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB5eXl5ID0gZC5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIG1tID0gKGQuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCk7IC8vIGdldE1vbnRoKCkgaXMgemVyby1iYXNlZFxyXG4gICAgICAgIHZhciBkZCA9IGQuZ2V0RGF0ZSgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB5eXl5ICsgXCItXCIgKyAobW1bMV0gPyBtbSA6IFwiMFwiICsgbW1bMF0pICsgXCItXCIgKyAoZGRbMV0gPyBkZCA6IFwiMFwiICsgZGRbMF0pOyAvLyBwYWRkaW5nXHJcbiAgICB9XHJcblxyXG4gICAgLy8gb2Zmc2V0IGlzIHRoZSBkYXlzIGRpZmZlcmVuY2UsIGVnLiBpZiBnZXR0aW5nIHRvbW9ycm93LCBjYWxsIGdldFRvZGF5UGx1cygxKTsgXHJcbiAgICBmdW5jdGlvbiBnZXRUb2RheVBsdXMob2Zmc2V0LCBiYXNlRGF0ZSkge1xyXG4gICAgICAgIGlmICghYmFzZURhdGUpIHtcclxuICAgICAgICAgICAgYmFzZURhdGUgPSBuZXcgRGF0ZSgpOyAvLyB1c2luZyB0b2RheSBhcyB0aGUgYmFzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZURhdGUuc2V0VGltZShiYXNlRGF0ZS5nZXRUaW1lKCkgKyBvZmZzZXQgKiA4NjQwMDAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGJhc2VEYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhc0R1cGxpY2F0aW9uKGl0ZW0sIHJlc3RhdXJhbnRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcmVzdGF1cmFudHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAvLyBoZXJlIGlzIHByb2JsZW1hdGljLCBiZWNhdXNlIHdlIGFyZSBub3QgdXNpbmcgb25lIEZhY3R1YWxBUEkgKHNvbWUgY29tZXMgZnJvbSBvdXIgb3duKSwgdGhlIGNhc2UgaXMgZGlmZmVyZW50XHJcbiAgICAgICAgICAgIGlmIChyZXN0YXVyYW50c1tpZHhdLm5hbWUgPT09IGl0ZW0ubmFtZSB8fCByZXN0YXVyYW50c1tpZHhdLk5hbWUgPT09IGl0ZW0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3RhdXJhbnRzW2lkeF0uYWRkcmVzcyA9PT0gaXRlbS5hZGRyZXNzIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdGF1cmFudHNbaWR4XS5wb3N0Y29kZSA9PT0gaXRlbS5wb3N0Y29kZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3RhdXJhbnRzW2lkeF0uQWRkcmVzcyA9PT0gaXRlbS5hZGRyZXNzIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGFyZUNvb3JkKHJlc3RhdXJhbnRzW2lkeF0sIGl0ZW0pID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlQ29vcmQoaXRlbTEsIGl0ZW0yKSB7XHJcbiAgICAgICAgLy8gMiBkaWdpdHMgcHJlY2lzaW9uIHJlcHJlc2VudHMgMUsgZGlzdGFuY2UsIG5vIHJlc3RhdXJhbnRzIHdpdGggdGhlIHNhbWUgbmFtZSBjYW4gYmUgdGhhdCBjbG9zZSBcclxuICAgICAgICB2YXIgbGF0MSA9IGdldEZsb2F0V2l0aEZpeChpdGVtMS5sYXRpdHVkZSB8fCBpdGVtMS5MYXRpdHVkZSwgMik7XHJcbiAgICAgICAgdmFyIGxhdDIgPSBnZXRGbG9hdFdpdGhGaXgoaXRlbTIubGF0aXR1ZGUgfHwgaXRlbTIuTGF0aXR1ZGUsIDIpO1xyXG4gICAgICAgIHZhciBsbmcxID0gZ2V0RmxvYXRXaXRoRml4KGl0ZW0xLmxvbmdpdHVkZSB8fCBpdGVtMS5Mb25naXR1ZGUsIDIpO1xyXG4gICAgICAgIHZhciBsbmcyID0gZ2V0RmxvYXRXaXRoRml4KGl0ZW0yLmxvbmdpdHVkZSB8fCBpdGVtMi5Mb25naXR1ZGUsIDIpO1xyXG5cclxuICAgICAgICByZXR1cm4gKGxhdDEgPT09IGxhdDIgJiYgbG5nMSA9PT0gbG5nMik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RmxvYXRXaXRoRml4KG51bSwgZml4KSB7XHJcbiAgICAgICAgdmFyIHJldHZhbCA9IHBhcnNlRmxvYXQobnVtKS50b0ZpeGVkKGZpeCk7XHJcbiAgICAgICAgcmV0dXJuIHJldHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRNb250aE5hbWUoZGF0ZSkge1xyXG4gICAgICAgIHZhciBvYmpEYXRlID0gbmV3IERhdGUoZGF0ZSksXHJcbiAgICAgICAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcclxuXHJcbiAgICAgICAgaWYgKG9iakRhdGUudG9Mb2NhbFN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgbW9udGggPSBvYmpEYXRlLnRvTG9jYWxlU3RyaW5nKGxvY2FsZSwgeyBtb250aDogXCJsb25nXCIgfSk7XHJcbiAgICAgICAgICAgIGlmIChtb250aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb250aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtb250aE5hbWVzID0gW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl07XHJcbiAgICAgICAgcmV0dXJuIG1vbnRoTmFtZXNbb2JqRGF0ZS5nZXRNb250aCgpXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQb3N0RGF0ZURlc2NyaXB0aW9uKHBvc3REYXRlKSB7XHJcbiAgICAgICAgdmFyIGhvdXJEaWZmID0gZGlmZkRhdGUocG9zdERhdGUsIG5ldyBEYXRlKCksIFwiaHJcIik7XHJcbiAgICAgICAgaWYgKGhvdXJEaWZmIDwgMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJBZGRlZCBsZXNzIHRoYW4gYW4gaG91ciBhZ29cIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGhvdXJEaWZmIDwgMykge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJBZGRlZCBsZXNzIHRoYW4gXCIgKyBob3VyRGlmZiArIFwiIGhvdXJzIGFnb1wiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBkYXlEaWZmID0gZGlmZkRhdGUocG9zdERhdGUsIG5ldyBEYXRlKCksIFwiZGF5XCIpO1xyXG4gICAgICAgICAgICBpZiAoZGF5RGlmZiA8PSA3KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJBZGRlZCBcIiArIGRheURpZmYgKyBcIiBkYXlzIGFnb1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQWRkZWQgb24gXCIgKyBnZXREYXRlU3RyaW5nKHBvc3REYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWZyZXNoaW5nKCR0aW1lb3V0LCBkZWxheSkge1xyXG4gICAgICAgIGlmICghZGVsYXkgfHwgaXNOYU4oZGVsYXkpKVxyXG4gICAgICAgICAgICBkZWxheSA9IDIwMDA7XHJcblxyXG4gICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuICAgICAgICB9LCBkZWxheSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93LmhlbHBlcikge1xyXG4gICAgd2luZG93LmhlbHBlciA9IG5ldyBBcHBIZWxwZXIoKTtcclxufSIsImZ1bmN0aW9uIE1hcEhlbHBlcigpIHtcclxuICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgaW5zdGFuY2UuY3JlYXRlVXNlck1hcmtlciA9IGNyZWF0ZVVzZXJNYXJrZXI7XHJcbiAgICBpbnN0YW5jZS5jcmVhdGVSZXN0YXVyYW50TWFya2VyID0gY3JlYXRlUmVzdE1hcmtlcjtcclxuICAgIGluc3RhbmNlLmNyZWF0ZU1hcCA9IGNyZWF0ZU1hcDtcclxuICAgIGluc3RhbmNlLmNvbmZpZ01hcCA9IGNvbmZpZ01hcDtcclxuXHJcbiAgICByZXR1cm4gaW5zdGFuY2U7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnTWFwKG1hcFByb3ZpZGVyKSB7XHJcbiAgICAgICAgbWFwUHJvdmlkZXIuY29uZmlndXJlKHtcclxuICAgICAgICAgICAga2V5OiAnQUl6YVN5Q0d5cGhYd3k5Vzl6bE1HVkdzRWd5NV9pd3I3cUxGVE1jJyxcclxuICAgICAgICAgICAgdjogJzMuMicsXHJcbiAgICAgICAgICAgIGxpYnJhcmllczogJ2dlb21ldHJ5LHZpc3VhbGl6YXRpb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWFwKGNvb3Jkcykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNlbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogY29vcmRzLmxvbmdpdHVkZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB6b29tOiAxMyxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuREVGQVVMVCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLlJJR0hUX0JPVFRPTVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sOiB7fSAvLyB0aGlzIGlzIElNUE9SVEFOVCFcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVzZXJNYXJrZXIoY29vcmRzLCBkcmFnRXZlbnQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogMCxcclxuICAgICAgICAgICAgY29vcmRzOiB7XHJcbiAgICAgICAgICAgICAgICBsYXRpdHVkZTogY29vcmRzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBjb29yZHMubG9uZ2l0dWRlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGljb246ICdpbWFnZXMvbWFya2Vycy91c2VyLTEwLnBuZydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBkcmFnZW5kOiBkcmFnRXZlbnRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUmVzdE1hcmtlcihvYmosIG1hcmtlcklkLCBjbGlja0V2ZW50LCBkcmFnRXZlbnQpIHtcclxuICAgICAgICB2YXIgaWR4ID0gb2JqLnBsYWNlSW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaWQ6IG1hcmtlcklkLFxyXG4gICAgICAgICAgICBjb29yZHM6IHtcclxuICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBvYmoubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IG9iai5sb25naXR1ZGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiAoZHJhZ0V2ZW50ICE9PSBudWxsICYmIGRyYWdFdmVudCAhPT0gdW5kZWZpbmVkKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNsaWNrYWJsZTogKGNsaWNrRXZlbnQgIT09IG51bGwgJiYgY2xpY2tFdmVudCAhPT0gdW5kZWZpbmVkKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBvYmoubmFtZSxcclxuICAgICAgICAgICAgICAgIGljb246IFwiaHR0cDovL2NoYXJ0LmFwaXMuZ29vZ2xlLmNvbS9jaGFydD9jaHN0PWRfbWFwX3Bpbl9sZXR0ZXImY2hsZD1cIiArIGlkeCArIFwifEZGMDAwMHwwMDAwMDBcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgIGRyYWdlbmQ6IGRyYWdFdmVudCxcclxuICAgICAgICAgICAgICAgIGNsaWNrOiBjbGlja0V2ZW50XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhY3R1YWxfaWQ6IG9iai5mYWN0dWFsX2lkLFxyXG4gICAgICAgICAgICBjdWlzaW5lOiBvYmouY3Vpc2luZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93Lk1hcEhlbHBlcikge1xyXG4gICAgd2luZG93Lk1hcEhlbHBlciA9IG5ldyBNYXBIZWxwZXIoKTtcclxufSIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gdmFyIGFjY291bnRBcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2MuYXBwLmFjY291bnQnLCBbJ29jLnNlcnZpY2VzJ10pO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcignQWN0aXZhdGVDb250cm9sbGVyJywgYWN0aXZhdGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBhY3RpdmF0ZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgJ0F1dGhTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFwiJHNjZVwiLCAnJHNjb3BlJ107XHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZUNvbnRyb2xsZXIoJGxvY2F0aW9uLCAkdGltZW91dCwgYXV0aFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgJHNjZSwgJHNjb3BlKSB7XHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVQYWdlVGl0bGUoJ0FjY291bnQgQWN0aXZhdGlvbicpO1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uYWN0aXZhdGUgPSBhY3RpdmF0ZUhhbmRsZXI7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdm0udGl0bGUgPSBcIkFjY291bnQgQWN0aXZhdGlvblwiO1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0udXNlcklkID0gJHN0YXRlUGFyYW1zLmlkO1xyXG4gICAgICAgIHZtLmNvZGUgPSAkc3RhdGVQYXJhbXMuY29kZTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgIHZtLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlSGFuZGxlcigpIHtcclxuICAgICAgICAgICAgaWYgKHZtLnVzZXJJZCAmJiB2bS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zaG93RmF1bHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5hY3RpdmF0ZSh2bS51c2VySWQsIHZtLmNvZGUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICRzY2UudHJ1c3RBc0h0bWwoXCJVc2VyIGhhcyBiZWVuIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5LiBZb3UgY2FuIGxvZ2luIG5vdy4uLlNlbmRpbmcgeW91IHRvIHRoZSBsb2dpbiBwYWdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKHJlc3BvbnNlLCB2bSwgXCJGYWlsZWQgdG8gYWN0aXZhdGUgdXNlciBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJDYW5ub3QgYWN0aXZhdGUgeW91LlwiO1xyXG4gICAgICAgICAgICAgICAgdm0uc2hvd0ZhdWx0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gdmFyIGFjY291bnRBcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2MuYXBwLmFjY291bnQnLCBbJ29jLnNlcnZpY2VzJ10pO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcignQWNjb3VudENvbnRyb2xsZXInLCBhY2NvdW50Q29udHJvbGxlcik7XHJcblxyXG4gICAgYWNjb3VudENvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnRGluZXJTZXJ2aWNlJywgJyRsb2NhdGlvbicsICckc2NlJywgJyR0aW1lb3V0J107XHJcbiAgICBmdW5jdGlvbiBhY2NvdW50Q29udHJvbGxlcihhdXRoU2VydmljZSwgZGluZXJTZXJ2aWNlLCAkbG9jYXRpb24sICRzY2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZtLmNsYWltcyA9IFwiXCI7XHJcbiAgICAgICAgdm0uYXV0aGVudGljYXRpb24gPSBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbjtcclxuICAgICAgICB2bS5zaG93TG9naW4gPSB0cnVlO1xyXG4gICAgICAgIHZtLnNob3dTaWdudXAgPSB0cnVlO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5sb2dvdXQgPSBsb2dPdXRIYW5kbGVyO1xyXG5cclxuICAgICAgICAvLyB0aGlzIGlzIHRoZSB0ZXN0IG1ldGhvZFxyXG4gICAgICAgIHZtLmxvYWRDbGFpbXMgPSBsb2FkQ2xhaW1zSGFuZGxlcjtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBmdW5jdGlvbiBsb2dPdXRIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIucmVmcmVzaGluZygkdGltZW91dCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkQ2xhaW1zSGFuZGxlcigpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9hZENsYWltcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmNsYWltcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4IGluIHJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsYWltID0gcmVzcG9uc2UuZGF0YVtpZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jbGFpbXMgPSB2bS5jbGFpbXMgKyBjbGFpbS5UeXBlICsgXCI6IFwiICsgY2xhaW0uVmFsdWUgKyBcIjxiciAvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdm0uY2xhaW1zID0gJHNjZS50cnVzdEFzSHRtbCh2bS5jbGFpbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcclxuICAgICAgICAgICAgdm0uc2hvd0xvZ2luID0gYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoID09PSBmYWxzZTtcclxuICAgICAgICAgICAgdm0uc2hvd1NpZ251cCA9IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCA9PT0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLnNob3dVc2VyID0gYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoID09PSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuXHJcbiAgICBhcHBcclxuICAgICAgICAuY29udHJvbGxlcignQWNjb3VudExvZ2luQ29udHJvbGxlcicsIGFjY291bnRMb2dpbkNvbnRyb2xsZXIpO1xyXG4gICAgYWNjb3VudExvZ2luQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdsb2dnZXInLCAnJHRpbWVvdXQnLCAnUmVzdW1lU2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsICdNb2RhbFNlcnZpY2UnLCAnJHJvb3RTY29wZSddO1xyXG4gICAgZnVuY3Rpb24gYWNjb3VudExvZ2luQ29udHJvbGxlcihhdXRoU2VydmljZSwgbG9nZ2VyLCAkdGltZW91dCwgcmVzdW1lU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsIG1vZGFsU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubG9naW5EYXRhID0ge1xyXG4gICAgICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZSAvLyBhbHdheXMgdXNlIHJlZnJlc2h0b2tlbiB1bmxlc3Mgd2Ugd2FudCB0byBjaGFuZ2UgaXQgbGF0ZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5mb3JnZXREYXRhID0ge1xyXG4gICAgICAgICAgICBlbWFpbDogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnRpdGxlID0gXCJMb2dpblwiO1xyXG5cclxuICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gXCIwXCI7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0uc3VibWl0ID0gc3VibWl0SGFuZGxlcjtcclxuICAgICAgICB2bS5jbG9zZSA9IGNsb3NlO1xyXG4gICAgICAgIHZtLmxvZ2luV2l0aEZhY2Vib29rID0gbG9naW5XaXRoRmFjZWJvb2s7XHJcbiAgICAgICAgdm0uZXh0ZXJuYWxBdXRoQ29tcGxldGVkID0gZXh0ZXJuYWxBdXRoQ29tcGxldGVkO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWRJbmRleCA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luSGFuZGxlcigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmluZFBhc3N3b3JkSGFubGRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kUGFzc3dvcmRIYW5sZGVyKCkge1xyXG4gICAgICAgICAgICBpZiAodm0uZm9yZ2V0RGF0YS5lbWFpbCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUGxlYXNlIGVudGVyIHRoZSBlbWFpbCBhZGRyZXNzIG9mIHlvdXIgYWNjb3VudCB0byByZXNldCBwYXNzd29yZFwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LmhlbHBlci5pc0VtYWlsKHZtLmZvcmdldERhdGEuZW1haWwpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiWW91ciBlbWFpbCBhZGRyZXNzIGZvcm1hdCBpcyBub3QgY29ycmVjdFwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5mb3JnZXRwYXNzd29yZCh2bS5mb3JnZXREYXRhLmVtYWlsKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUGFzc3dvcmQgcmVzZXQgcmVxdWVzdCBpcyBzZW50IVwiO1xyXG4gICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5zdWNjZXNzKCdSZXNldCBwYXNzd29yZCBpcyByZXF1ZXN0ZWQgc3VjY2Vzc2Z1bGx5LiBDaGVjayB5b3VyIG1haWwgYm94LiBZb3Ugc2hvdWxkIHJlY2VpdmUgYW4gZW1haWwgdG8gcmVzZXQgeW91ciBwYXNzd29yZCBpbiAzMCBtaW51dGVzLiAnKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IHZtLmZvcmdldERhdGEuZW1haWwgKyBcIiBpcyBub3QgcmVnaXN0ZXJlZFwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKHJlc3BvbnNlLCB2bSwgXCJGYWlsZWQgdG8gcmVxdWVzdCBwYXNzd29yZCByZXNldCBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZtLmlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpbkhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5sb2dpbkRhdGEuZW1haWwgPT09IFwiXCIgfHwgdm0ubG9naW5EYXRhLnBhc3N3b3JkID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJQbGVhc2UgZW50ZXIgYm90aCBvZiB5b3VyIGVtYWlsIGFkZHJlc3MgYW5kIHBhc3N3b3JkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaGVscGVyLmlzRW1haWwodm0ubG9naW5EYXRhLmVtYWlsKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIllvdXIgZW1haWwgYWRkcmVzcyBmb3JtYXQgaXMgbm90IGNvcnJlY3RcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9naW4odm0ubG9naW5EYXRhKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiTG9naW4gc3VjY2Vzc2Z1bGx5LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuc3VjY2VzcygnTG9naW4gU3VjY2Vzc2Z1bGx5IScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdW1lU2VydmljZS5uZWVkUmVzdW1lKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdW1lU2VydmljZS5yZXN1bWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kc3RhdGUuaXMoJ2xvZ2luJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdwcm9maWxlLmhvbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIucmVmcmVzaGluZygkdGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJMb2dpbiBmYWlsZWQgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luV2l0aEZhY2Vib29rKCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5leHRlcm5hbExvZ2luKFwiRmFjZWJvb2tcIiwgdm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bWVTZXJ2aWNlICYmIHJlc3VtZVNlcnZpY2UuaGFzTWVzc2FnZSAmJiAkcm9vdFNjb3BlLiRzdGF0ZS5pcygnbG9naW4nKSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IHJlc3VtZVNlcnZpY2UubWVzc2FnZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuJHN0YXRlUGFyYW1zLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEluZGV4ID0gJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGV4dGVybmFsQXV0aENvbXBsZXRlZChmcmFnbWVudCkge1xyXG4gICAgICAgICAgICBjbG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgLy9JZiB0aGUgdXNlciBkb2VzIG5vdCBoYXZlIGEgbG9jYWwgYWNjb3VudCBzZXQgdXAgc2VuZCB0aGVtIHRvIHRoZSBwcm9maWxlIGFzc29jaWF0aW9uIHBhZ2UuXHJcbiAgICAgICAgICAgIGlmIChmcmFnbWVudC5oYXNsb2NhbGFjY291bnQgPT0gJ0ZhbHNlJykge1xyXG5cclxuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmV4dGVybmFsQXV0aERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBmcmFnbWVudC5leHRlcm5hbF91c2VyX25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGZyYWdtZW50LmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46IGZyYWdtZW50LmV4dGVybmFsX2FjY2Vzc190b2tlblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygncHJvZmlsZS5hc3NvY2lhdGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vT2J0YWluIGFjY2VzcyB0b2tlbiBhbmQgcmVkaXJlY3QgdG8gcHJvZmlsZSBob21lIHBhZ2UuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXh0ZXJuYWxEYXRhID0geyBwcm92aWRlcjogZnJhZ21lbnQucHJvdmlkZXIsIGV4dGVybmFsQWNjZXNzVG9rZW46IGZyYWdtZW50LmV4dGVybmFsX2FjY2Vzc190b2tlbiB9O1xyXG4gICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oZXh0ZXJuYWxEYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdwcm9maWxlLmhvbWUnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IGVyci5lcnJvcl9kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyB2YXIgYWNjb3VudEFwcCA9IGFuZ3VsYXIubW9kdWxlKCdjYy5hcHAuYWNjb3VudCcsIFsnb2Muc2VydmljZXMnXSk7XHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuICAgIGFwcC5jb250cm9sbGVyKCdSZXNldFBhc3N3b3JkQ29udHJvbGxlcicsIHJlc2V0Q29udHJvbGxlcik7XHJcblxyXG4gICAgcmVzZXRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbicsICckdGltZW91dCcsICdBdXRoU2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnJHNjb3BlJ107XHJcbiAgICBmdW5jdGlvbiByZXNldENvbnRyb2xsZXIoJGxvY2F0aW9uLCAkdGltZW91dCwgYXV0aFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgJHNjb3BlKSB7XHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVQYWdlVGl0bGUoJ1Jlc2V0IFBhc3N3b3JkJyk7XHJcblxyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0udGl0bGUgPSBcIlJlc2V0IFBhc3N3b3JkXCI7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdm0uaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnJlc2V0RGF0YSA9IHtcclxuICAgICAgICAgICAgZW1haWw6ICRzdGF0ZVBhcmFtcy5lbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGNvbmZpcm1QYXNzd29yZDogXCJcIixcclxuICAgICAgICAgICAgY29kZTogJHN0YXRlUGFyYW1zLmNvZGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5zdWJtaXQgPSByZXNldEhhbmRsZXI7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoISRzdGF0ZVBhcmFtcy5jb2RlIHx8ICRzdGF0ZVBhcmFtcy5jb2RlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUmVzZXQgY29kZSBpcyBpbnZhbGlkLCBwbGVhc2UgY29weSB0aGUgZnVsbCBVUkwgZnJvbSB5b3VyIGVtYWlsIHRvIHlvdXIgYnJvd3Nlci5cIjtcclxuICAgICAgICAgICAgICAgIHZtLmludmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0uaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXNldEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5yZXNldERhdGEuZW1haWwgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlBsZWFzZSBlbnRlciB5b3VyIHBhc3N3b3JkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5yZXNldERhdGEucGFzc3dvcmQgPT09IFwiXCIgfHwgdm0ucmVzZXREYXRhLmNvbmZpcm1QYXNzd29yZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUGFzc3dvcmQgYW5kIGNvbmZpcm0gcGFzc3dvcmQgY2Fubm90IGJlIGVtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5yZXNldERhdGEucGFzc3dvcmQgIT09IHZtLnJlc2V0RGF0YS5jb25maXJtUGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlBhc3N3b3JkIGlzIG5vdCB0aGUgc2FtZSB0byBjb25maXJtIHBhc3N3b3JkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5yZXNldERhdGEuY29kZSA9PT0gXCJcIiB8fCB2bS5yZXNldERhdGEuY29kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJSZXNldCBjb2RlIGlzIG1pc3NpbmcsIGNhbid0IHVwZGF0ZSB5b3VyIHBhc3N3b3JkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnJlc2V0cGFzc3dvcmQodm0ucmVzZXREYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiWW91ciBwYXNzd29yZCBoYXMgYmVlbiByZXNldCBzdWNjZXNzZnVsbHkuIFlvdSBjYW4gbm93IGxvZ2luIHdpdGggeW91ciBuZXcgcGFzc3dvcmQuIFNlbmRpbmcgeW91IHRvIHRoZSBsb2dpbiBwYWdlLlwiO1xyXG4gICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lcigpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IocmVzcG9uc2UsIHZtLCBcIkZhaWxlZCB0byByZXNldCBwYXNzd29yZCBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuICAgIGFwcC5jb250cm9sbGVyKCdBY2NvdW50U2lnbnVwQ29udHJvbGxlcicsIGFjY291bnRTaWdudXBDb250cm9sbGVyKTtcclxuXHJcbiAgICBhY2NvdW50U2lnbnVwQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdsb2dnZXInLCAnJHRpbWVvdXQnLCAnTW9kYWxTZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJyRzY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjY291bnRTaWdudXBDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBsb2dnZXIsICR0aW1lb3V0LCBtb2RhbFNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCAkc2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJTaWduIHVwXCI7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5yZWdpc3RyYXRpb24gPSB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBcIlwiLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgICAgICBjb25maXJtUGFzc3dvcmQ6IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5zaG93Rm9ybSA9IHRydWU7XHJcbiAgICAgICAgdm0uc3VibWl0ID0gc2lnbnVwSGFuZGxlcjtcclxuICAgICAgICB2bS5jbG9zZSA9IGNsb3NlO1xyXG4gICAgICAgIHZtLmxvZ2luV2l0aEZhY2Vib29rID0gbG9naW5XaXRoRmFjZWJvb2s7XHJcbiAgICAgICAgdm0uZXh0ZXJuYWxBdXRoQ29tcGxldGVkID0gZXh0ZXJuYWxBdXRoQ29tcGxldGVkO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuc2luZ3VwRm9ybS4kdmFsaWQgIT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vIGFsbCB0aGUgdmFsaWRhdGlvbnMgaGVyZSBhcmUgcmVkdW5kYW50IGFmdGVyIHVzaW5nIG5nLW1lc3NhZ2VzXHJcbiAgICAgICAgICAgIGlmIChmYWlsR3VhcmQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5zYXZlUmVnaXN0cmF0aW9uKHZtLnJlZ2lzdHJhdGlvbikudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJVc2VyIGlzIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5ISBQbGVhc2UgY2hlY2sgeW91ciBlbWFpbCBib3ggdG8gYWN0aXZhdGUgeW91ciBhY2NvdW50LlwiO1xyXG4gICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdUaGFua3MgZm9yIHNpZ25pbmcgdXAuJyk7XHJcbiAgICAgICAgICAgICAgICB2bS5zaG93Rm9ybSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5pc0J1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IocmVzcG9uc2UsIHZtLCBcIkZhaWxlZCB0byByZWdpc3RlciB1c2VyIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZhaWxHdWFyZCgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLnJlZ2lzdHJhdGlvbi5lbWFpbCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUGxlYXNlIGVudGVyIHRoZSBlbWFpbCBhZGRyZXNzIHRvIHJlZ2lzdGVyXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5oZWxwZXIuaXNFbWFpbCh2bS5yZWdpc3RyYXRpb24uZW1haWwpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiWW91ciBlbWFpbCBhZGRyZXNzIGZvcm1hdCBpcyBub3QgY29ycmVjdFwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5yZWdpc3RyYXRpb24ucGFzc3dvcmQgPT09IFwiXCIgfHwgdm0ucmVnaXN0cmF0aW9uLmNvbmZpcm1QYXNzd29yZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiUGxlYXNlIGVudGVyIHlvdXIgcGFzc3dvcmQgYW5kIGNvbmZpcm0gcGFzc3dvcmQgdG8gcmVnaXN0ZXJcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0ucmVnaXN0cmF0aW9uLnBhc3N3b3JkICE9PSB2bS5yZWdpc3RyYXRpb24uY29uZmlybVBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJQYXNzd29yZCBkb2Vzbid0IG1hdGNoIHRoZSBjb25maXJtIHBhc3N3b3JkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5XaXRoRmFjZWJvb2soKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmV4dGVybmFsTG9naW4oXCJGYWNlYm9va1wiLCB2bSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHRlcm5hbEF1dGhDb21wbGV0ZWQoZnJhZ21lbnQpIHtcclxuICAgICAgICAgICAgY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgdGhlIHVzZXIgZG9lcyBub3QgaGF2ZSBhIGxvY2FsIGFjY291bnQgc2V0IHVwIHNlbmQgdGhlbSB0byB0aGUgcHJvZmlsZSBhc3NvY2lhdGlvbiBwYWdlLlxyXG4gICAgICAgICAgICBpZiAoZnJhZ21lbnQuaGFzbG9jYWxhY2NvdW50ID09ICdGYWxzZScpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5leHRlcm5hbEF1dGhEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBmcmFnbWVudC5wcm92aWRlcixcclxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogZnJhZ21lbnQuZXh0ZXJuYWxfdXNlcl9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBmcmFnbWVudC5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UuZ28oJ3Byb2ZpbGUuYXNzb2NpYXRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL09idGFpbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZGlyZWN0IHRvIHByb2ZpbGUgaG9tZSBwYWdlLlxyXG4gICAgICAgICAgICAgICAgdmFyIGV4dGVybmFsRGF0YSA9IHsgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLCBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW4gfTtcclxuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKGV4dGVybmFsRGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygncHJvZmlsZS5ob21lJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUHJvZmlsZUFzc29jaWF0ZUNvbnRyb2xsZXInLCBwcm9maWxlQXNzb2NpYXRlQ29udHJvbGxlcik7XHJcblxyXG4gICAgcHJvZmlsZUFzc29jaWF0ZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJ2xvZ2dlciddO1xyXG4gICAgZnVuY3Rpb24gcHJvZmlsZUFzc29jaWF0ZUNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIG1vZGFsU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsIGxvZ2dlcikge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS5hdXRoRGF0YSA9IGF1dGhTZXJ2aWNlLmV4dGVybmFsQXV0aERhdGE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0udGl0bGUgPSBcIllvdSdyZSBhbG1vc3QgZG9uZSBsaW5raW5nIHlvdXIgXCIgKyB2bS5hdXRoRGF0YS5wcm92aWRlciArIFwiIGFjY291bnQhXCI7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7ICAgICAgIFxyXG5cclxuICAgICAgICAvLyBtZXRob2RzXHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIC8vSW4gdGhlIGV2ZW50IHRoYXQgd2UgZG9uJ3QgaGF2ZSBhdXRoIGRhdGEsIHJlZGlyZWN0IGJhY2sgdG8gdGhlIGhvbWUgcGFnZVxyXG4gICAgICAgICAgICAvL3JhdGhlciB0aGFuIHNob3dpbmcgYSBicm9rZW4gZm9ybS5cclxuICAgICAgICAgICAgaWYgKCF2bS5hdXRoRGF0YSB8fCAhdm0uYXV0aERhdGEucHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdhcHAuaG9tZScpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnYXBwLmhvbWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghdm0uYXV0aERhdGEudXNlcm5hbWUgfHwgIXZtLmF1dGhEYXRhLmVtYWlsKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiV2hvb3BzISBMb29rcyBsaWtlIHlvdSdyZSBtaXNzaW5nIHNvbWUgcmVxdWlyZWQgaW5mb3JtYXRpb24hXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdm0uYXV0aERhdGEucHJvdmlkZXIgfHwgIXZtLmF1dGhEYXRhLmV4dGVybmFsQWNjZXNzVG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJMb29rcyBsaWtlIHdlIHJhbiBpbnRvIGEgcHJvYmxlbSBvbiBvdXIgZW5kLiBQbGVhc2UgdHJ5IGxpbmtpbmcgeW91ciBhY2NvdW50IGFnYWluIVwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICdFeHRlcm5hbEFjY2Vzc1Rva2VuJzogdm0uYXV0aERhdGEuZXh0ZXJuYWxBY2Nlc3NUb2tlbixcclxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6IHZtLmF1dGhEYXRhLnByb3ZpZGVyLFxyXG4gICAgICAgICAgICAgICAgJ1VzZXJuYW1lJzogdm0uYXV0aERhdGEudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAnRW1haWwnOiB2bS5hdXRoRGF0YS5lbWFpbFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5yZWdpc3RlckV4dGVybmFsVXNlcih2bS5hdXRoRGF0YSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiTG9naW4gc3VjY2Vzc2Z1bGx5LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuc3VjY2VzcygnRXh0ZXJuYWwgVXNlciBSZWdpc3RlcmVkIFN1Y2Nlc3NmdWxseSEnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VtZVNlcnZpY2UubmVlZFJlc3VtZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UucmVzdW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuJHN0YXRlLmlzKCdsb2dpbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygncHJvZmlsZS5ob21lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLnJlZnJlc2hpbmcoJHRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pc0J1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiTG9naW4gZmFpbGVkIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9maWxlQmFzaWNJbmZvcm1hdGlvbkNvbnRyb2xsZXInLCBwcm9maWxlQmFzaWNJbmZvcm1hdGlvbkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIHByb2ZpbGVCYXNpY0luZm9ybWF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJywgJyRsb2NhdGlvbicsICckaHR0cCcsICd1cGxvYWRVcmwnLCAnZmlsZVNlcnZpY2UnXTtcclxuICAgIGZ1bmN0aW9uIHByb2ZpbGVCYXNpY0luZm9ybWF0aW9uQ29udHJvbGxlcihhdXRoU2VydmljZSwgZGluZXJTZXJ2aWNlLCBtb2RhbFNlcnZpY2UsICRsb2NhdGlvbiwgJGh0dHAsIHVwbG9hZFVybCwgZmlsZVNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdm0udGl0bGUgPSBcIkJhc2ljIEluZm9ybWF0aW9uXCI7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB2bS5kYXRhID0gZGluZXJTZXJ2aWNlLnByb2ZpbGU7XHJcbiAgICAgICAgdm0uaXNCdXN5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0udXBsb2FkaW5nRmlsZSA9IFwiXCI7XHJcbiAgICAgICAgdm0uY2FuRGVsZXRlQXZhdGFyID0gZmFsc2U7XHJcbiAgICAgICAgdm0uaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBtZXRob2RzXHJcbiAgICAgICAgdm0uc3VibWl0ID0gc3VibWl0SGFuZGxlcjtcclxuICAgICAgICB2bS5kZWxldGVBdmF0YXIgPSBkZWxldGVIYW5kbGVyO1xyXG4gICAgICAgIHZtLnJlc2V0VXBsb2FkID0gcmVzZXRIYW5kbGVyO1xyXG4gICAgICAgIHZtLnRvZ2dsZVNpZGVuYXYgPSB0b2dnbGVTaWRlbmF2O1xyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplclxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnMgXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgLy8gbXVzdCBsb2FkIHRoZSBhdXRoZW50aWNhdGlvbiBkYXRhIGZpcnN0XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0TXlQcm9maWxlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gZGluZXJTZXJ2aWNlLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodm0uZGF0YS5hdmF0YXIgIT09IFwiXCIgJiYgdm0uZGF0YS5hdmF0YXIgIT09IGZpbGVTZXJ2aWNlLmdldFNhZmVBdmF0YXJJbWFnZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uY2FuRGVsZXRlQXZhdGFyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzdWJtaXRIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICBpZiAodm0udXBsb2FkaW5nRmlsZSAmJiB2bS51cGxvYWRpbmdGaWxlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IHZtLnVwbG9hZGluZ0ZpbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB3ZSB1cGxvYWQsIGRvbid0IHNwZWNpZnkgdGhlIHBhdGgsIHRoZSB1cGxvYWRlciB3aWxsIGZpZ3VyZSBpdCBvdXQgYnkgXCJ0eXBlXCJcclxuICAgICAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVpZCArIFwiLVwiICsgZmlsZS5uYW1lO1xyXG5cbiAgICAgICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgICAgICBmZC5hcHBlbmQoJ2ZpbGVuYW1lJywgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIGZkLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgZmQuYXBwZW5kKCd0eXBlJywgJ3VzZXInKTtcblxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QodXBsb2FkVXJsLCBmZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9XHJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9kbyBzb21ldGhpbmcgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YS5hdmF0YXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51cGxvYWRpbmdGaWxlID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FuRGVsZXRlQXZhdGFyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVQcm9maWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byB1cGxvYWQgcGhvdG9zIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlUHJvZmlsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzYXZlUHJvZmlsZSgpIHtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLnVwZGF0ZU15UHJvZmlsZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiWW91ciBwcm9maWxlIGhhcyBiZWVuIHVwZGF0ZWQuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgaWYgKHZtLmRhdGEuZGlzcGxheU5hbWUgIT09IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmRpc3BsYXlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uZGlzcGxheU5hbWUgPSB2bS5kYXRhLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHNhdmUgcHJvZmlsZSBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIHZtLmRhdGEuYXZhdGFyID0gZmlsZVNlcnZpY2UuZ2V0U2FmZUF2YXRhckltYWdlKCk7XHJcbiAgICAgICAgICAgIHZtLmNhbkRlbGV0ZUF2YXRhciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc2V0SGFuZGxlcigpIHtcclxuICAgICAgICAgICAgdm0udXBsb2FkaW5nRmlsZSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTaWRlbmF2KG1lbnVJZCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UudG9nZ2xlU2lkZW5hdihtZW51SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGluZXJJbWFnZShpbWdOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlU2VydmljZS5nZXRTYWZlQXZhdGFySW1hZ2UoaW1nTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9maWxlQ3JhdmluZ0hpc3RvcnlDb250cm9sbGVyJywgcHJvZmlsZUNyYXZpbmdIaXN0b3J5Q29udHJvbGxlcik7XHJcblxyXG4gICAgcHJvZmlsZUNyYXZpbmdIaXN0b3J5Q29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJ107XHJcbiAgICBmdW5jdGlvbiBwcm9maWxlQ3JhdmluZ0hpc3RvcnlDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBkaW5lclNlcnZpY2UsIG1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS50aXRsZSA9IFwiQ3JhdmluZyBIaXN0b3J5XCI7XHJcbiAgICAgICAgdm0uZGF0YSA9IFtdO1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICB2bS50b2dnbGVTaWRlbmF2ID0gdG9nZ2xlU2lkZW5hdjtcclxuICAgICAgICB2bS5mb3JtYXRlRGF0ZSA9IGZvcm1hdGVEYXRlO1xyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0TXlQcm9maWxlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldFJlY2VudENyYXZpbmdzKGRpbmVyU2VydmljZS5wcm9maWxlLmlkLCB0cnVlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHJldHJpZXZlIHJlY2VudCBjcmF2aW5ncyBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlU2lkZW5hdihtZW51SWQpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLnRvZ2dsZVNpZGVuYXYobWVudUlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdGVEYXRlKGQpIHtcclxuICAgICAgICAgICAgaWYgKGQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmhlbHBlci5mb3JtYXREYXRlKGQpO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVEaXNsaWtlQ3JhdmluZ0NvbnRyb2xsZXInLCBwcm9maWxlRGlzbGlrZUNyYXZpbmdDb250cm9sbGVyKTtcclxuXHJcbiAgICBwcm9maWxlRGlzbGlrZUNyYXZpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ0RpbmVyU2VydmljZScsICdNb2RhbFNlcnZpY2UnXTtcclxuICAgIGZ1bmN0aW9uIHByb2ZpbGVEaXNsaWtlQ3JhdmluZ0NvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGRpbmVyU2VydmljZSwgbW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJEaXNsaWtlIENyYXZpbmcgTGlzdFwiO1xyXG4gICAgICAgIHZtLmRhdGEgPSBbXTtcclxuICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IGZhbHNlO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gW107XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXRIYW5kbGVyO1xyXG4gICAgICAgIHZtLnRvZ2dsZVNpZGVuYXYgPSB0b2dnbGVTaWRlbmF2O1xyXG5cclxuICAgICAgICBpbml0KCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCkge1xyXG4gICAgICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldE15UHJvZmlsZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldERpc2xpa2UoZGluZXJTZXJ2aWNlLnByb2ZpbGUuaWQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWQgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHJldHJpZXZlIHRoZSBkaXNsaWtpbmcgY3JhdmluZ3MgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWQgIT09IG51bGwgJiYgdm0uc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0TXlQcm9maWxlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjcmF2aW5nSWRzID0gdm0uc2VsZWN0ZWQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHsgcmV0dXJuIGVsZW1lbnQuQ3JhdmluZ0lkOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGluZXJTZXJ2aWNlLnVwZGF0ZURpc2xpa2UoZGluZXJTZXJ2aWNlLnByb2ZpbGUuaWQsIGNyYXZpbmdJZHMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNCdXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIllvdXIgZGlzbGlrZWQgY3JhdmluZ3MgaGF2ZSBiZWVuIHNhdmVkLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHVwZGF0ZSB0aGUgZGlzbGlraW5nIGNyYXZpbmdzIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIk9vcHMsIHlvdSBhcmUgbm90IGF1dGhlbnRpY2F0ZWQuLi5cIjsgLy8gVE9ETzogdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCBidXQgaWYgdGhlIHVzZXIgb3BlbnMgaXQgZnJvbSBoaXN0b3J5LCB3ZSBuZWVkIHQgYXV0byByZS1hdXRoZW50aWNhdGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlU2lkZW5hdihtZW51SWQpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLnRvZ2dsZVNpZGVuYXYobWVudUlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVGYXZvcml0ZUNvbnRyb2xsZXInLCBwcm9maWxlRmF2b3JpdGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBwcm9maWxlRmF2b3JpdGVDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ0RpbmVyU2VydmljZScsICdNb2RhbFNlcnZpY2UnXTtcclxuICAgIGZ1bmN0aW9uIHByb2ZpbGVGYXZvcml0ZUNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGRpbmVyU2VydmljZSwgbW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJNeSBGYXZvcml0ZSBEaXNoZXNcIjtcclxuICAgICAgICB2bS5kYXRhID0gW107XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIHZtLnRvZ2dsZVNpZGVuYXYgPSB0b2dnbGVTaWRlbmF2O1xyXG4gICAgICAgIHZtLmZvcm1hdGVEYXRlID0gZm9ybWF0ZURhdGU7XHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGgpIHtcclxuICAgICAgICAgICAgICAgIGRpbmVyU2VydmljZS5nZXRNeVByb2ZpbGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0UmVjZW50RmF2b3JpdGVzKGRpbmVyU2VydmljZS5wcm9maWxlLmlkLCB0cnVlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHJldHJpZXZlIHJlY2VudCBmYXZvcml0ZXMgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVNpZGVuYXYobWVudUlkKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS50b2dnbGVTaWRlbmF2KG1lbnVJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRlRGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5oZWxwZXIuZm9ybWF0RGF0ZShkKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuICAgIGFwcFxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9maWxlQ29udHJvbGxlcicsIHByb2ZpbGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBwcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnUmVzdW1lU2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsICckcm9vdFNjb3BlJywgJyRzY29wZSddO1xyXG4gICAgZnVuY3Rpb24gcHJvZmlsZUNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGRpbmVyU2VydmljZSwgcmVzdW1lU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsICRyb290U2NvcGUsICRzY29wZSkge1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcclxuXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAvLyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdm0udGl0bGUgPSBcIlByb2ZpbGVcIjtcclxuICAgICAgICB2bS5tZW51ID0gYnVpbGRNZW51KCk7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWRJdGVtID0gdmFsaWRhdGVTZWxlY3RlZEl0ZW0oJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkSXRlbVBhZ2UgPSBcImFjY291bnQvcHJvZmlsZS5cIiArIHZtLnNlbGVjdGVkSXRlbS5rZXkgKyBcIi5odG1sXCI7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICB2bS5jaGVja0FjdGl2ZSA9IGNoZWNrQWN0aXZlSGFuZGxlcjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7IH0sIFwiWW91IG5lZWQgdG8gbG9naW4gZmlyc3QgdG8gYWNjZXNzIHlvdXIgcHJvZmlsZS5cIik7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnbG9naW4nKTsgLy8gc2ltcGx5IGp1c3QgZ28gdGhlcmUsIGl0IHdpbGwgY29tZWJhY2sgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0TXlQcm9maWxlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9maWxlID0gZGluZXJTZXJ2aWNlLnByb2ZpbGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnMgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tBY3RpdmVIYW5kbGVyKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHZtLnNlbGVjdGVkSXRlbSA9PT0gaXRlbSkgcmV0dXJuIFwiYWN0aXZlXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVTZWxlY3RlZEl0ZW0oc2VsZWN0ZWRJdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLm1lbnUubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLm1lbnVbaWR4XS5rZXkgPT09IHNlbGVjdGVkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVQYWdlVGl0bGUoJ091ckNyYXZpbmcgLT4gUHJvZmlsZSAtPiAnICsgdm0ubWVudVtpZHhdLnRpdGxlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ubWVudVtpZHhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdm0ubWVudVswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkTWVudSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAga2V5OiAnYmFzaWMnLFxyXG4gICAgICAgICAgICAgICAgbGluazogXCJwcm9maWxlLmhvbWUuZGV0YWlsKHtzZWxlY3RlZDonYmFzaWMnfSlcIixcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQmFzaWMgSW5mb3JtYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogJ2FjY291bnRfYm94J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICdkaXNsaWtlJyxcclxuICAgICAgICAgICAgICAgIGxpbms6IFwicHJvZmlsZS5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J2Rpc2xpa2UnfSlcIixcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGlzbGlrZSBDcmF2aW5ncycsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZmF2b3JpdGVfb3V0bGluZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmYXZvcml0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogXCJwcm9maWxlLmhvbWUuZGV0YWlsKHtzZWxlY3RlZDonZmF2b3JpdGUnfSlcIixcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Zhdm9yaXRlIERpc2hlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2Zhdm9yaXRlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdteWRpc2gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwicHJvZmlsZS5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J215ZGlzaCd9KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTXkgQWRkZWQgRGlzaGVzJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAncmVzdGF1cmFudF9tZW51J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdteXJldmlldycsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogXCJwcm9maWxlLmhvbWUuZGV0YWlsKHtzZWxlY3RlZDonbXlyZXZpZXcnfSlcIixcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ015IFJldmlld3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdyYXRlX3JldmlldydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnc2V0dGluZ3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwicHJvZmlsZS5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J3NldHRpbmdzJ30pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTZXR0aW5ncycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3NldHRpbmdzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdjcmF2aW5naGlzdG9yeScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogXCJwcm9maWxlLmhvbWUuZGV0YWlsKHtzZWxlY3RlZDonY3JhdmluZ2hpc3RvcnknfSlcIixcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NyYXZpbmcgSGlzdG9yeScsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2hpc3RvcnknXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3VwZGF0ZXBhc3N3b3JkJyxcclxuICAgICAgICAgICAgICAgICAgICBsaW5rOiBcInByb2ZpbGUuaG9tZS5kZXRhaWwoe3NlbGVjdGVkOid1cGRhdGVwYXNzd29yZCd9KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXBkYXRlIFBhc3N3b3JkJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnc2VjdXJpdHknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVNeURpc2hDb250cm9sbGVyJywgcHJvZmlsZU15RGlzaENvbnRyb2xsZXIpO1xyXG5cclxuICAgIHByb2ZpbGVNeURpc2hDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ0RpbmVyU2VydmljZScsICdNb2RhbFNlcnZpY2UnXTtcclxuICAgIGZ1bmN0aW9uIHByb2ZpbGVNeURpc2hDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBkaW5lclNlcnZpY2UsIG1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS50aXRsZSA9IFwiUmVjZW50IEFkZGVkIERpc2hlc1wiO1xyXG4gICAgICAgIHZtLmRhdGEgPSBbXTtcclxuICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IGZhbHNlO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICAgICAgICAvLyBtZXRob2RzXHJcbiAgICAgICAgdm0udG9nZ2xlU2lkZW5hdiA9IHRvZ2dsZVNpZGVuYXY7XHJcbiAgICAgICAgdm0uZm9ybWF0ZURhdGUgPSBmb3JtYXRlRGF0ZTtcclxuICAgICAgICBpbml0KCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCkge1xyXG4gICAgICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldE15UHJvZmlsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpbmVyU2VydmljZS5nZXRSZWNlbnRBZGRlZERpc2hlcyhkaW5lclNlcnZpY2UucHJvZmlsZS5pZCwgdHJ1ZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byByZXRyaWV2ZSBteSBkaXNoZXMgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVNpZGVuYXYobWVudUlkKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS50b2dnbGVTaWRlbmF2KG1lbnVJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRlRGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5oZWxwZXIuZm9ybWF0RGF0ZShkKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9maWxlTXlSZXZpZXdDb250cm9sbGVyJywgcHJvZmlsZU15UmV2aWV3Q29udHJvbGxlcik7XHJcblxyXG4gICAgcHJvZmlsZU15UmV2aWV3Q29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJ107XHJcbiAgICBmdW5jdGlvbiBwcm9maWxlTXlSZXZpZXdDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBkaW5lclNlcnZpY2UsIG1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS50aXRsZSA9IFwiUmVjZW50IFJldmlld3NcIjtcclxuICAgICAgICB2bS5kYXRhID0gW107XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIHZtLnRvZ2dsZVNpZGVuYXYgPSB0b2dnbGVTaWRlbmF2O1xyXG4gICAgICAgIHZtLmZvcm1hdGVEYXRlID0gZm9ybWF0ZURhdGU7XHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGgpIHtcclxuICAgICAgICAgICAgICAgIGRpbmVyU2VydmljZS5nZXRNeVByb2ZpbGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0UmVjZW50UmV2aWV3cyhkaW5lclNlcnZpY2UucHJvZmlsZS5pZCwgdHJ1ZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byByZXRyaWV2ZSBteSByZXZpZXdzIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTaWRlbmF2KG1lbnVJZCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UudG9nZ2xlU2lkZW5hdihtZW51SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0ZURhdGUoZCkge1xyXG4gICAgICAgICAgICBpZiAoZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaGVscGVyLmZvcm1hdERhdGUoZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUHJvZmlsZVNldHRpbmdzQ29udHJvbGxlcicsIHByb2ZpbGVTZXR0aW5nc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIHByb2ZpbGVTZXR0aW5nc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnUmVjZW50RGlzaFNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJ107XHJcbiAgICBmdW5jdGlvbiBwcm9maWxlU2V0dGluZ3NDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCByZWNlbnREaXNoU2VydmljZSwgbW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJSZWNlbnQgVmlld2VkIERpc2hlc1wiO1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdm0ucmVjZW50RGlzaFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIHZtLnRvZ2dsZVNpZGVuYXYgPSB0b2dnbGVTaWRlbmF2O1xyXG4gICAgICAgIHZtLmZvcm1hdGVEYXRlID0gZm9ybWF0ZURhdGU7XHJcbiAgICAgICAgdm0uY2xlYXJ1cFJlY2VudERpc2hlcyA9IGNsZWFydXBSZWNlbnREaXNoZXM7XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICByZWNlbnREaXNoU2VydmljZS5sb2FkUmVjZW50KCk7XHJcbiAgICAgICAgICAgIHZtLnJlY2VudERpc2hUb3RhbCA9IHJlY2VudERpc2hTZXJ2aWNlLmRpc2hlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTaWRlbmF2KG1lbnVJZCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UudG9nZ2xlU2lkZW5hdihtZW51SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0ZURhdGUoZCkge1xyXG4gICAgICAgICAgICBpZiAoZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaGVscGVyLmZvcm1hdERhdGUoZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYXJ1cFJlY2VudERpc2hlcygpIHtcclxuICAgICAgICAgICAgcmVjZW50RGlzaFNlcnZpY2UuZmx1c2goKTtcclxuICAgICAgICAgICAgdm0ucmVjZW50RGlzaFRvdGFsID0gcmVjZW50RGlzaFNlcnZpY2UuZGlzaGVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVVcGRhdGVQYXNzd29yZENvbnRyb2xsZXInLCBwcm9maWxlVXBkYXRlUGFzc3dvcmRDb250cm9sbGVyKTtcclxuXHJcbiAgICBwcm9maWxlVXBkYXRlUGFzc3dvcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICckbG9jYXRpb24nLCAnJHRpbWVvdXQnLCAnJHNjb3BlJ107XHJcbiAgICBmdW5jdGlvbiBwcm9maWxlVXBkYXRlUGFzc3dvcmRDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBtb2RhbFNlcnZpY2UsICRsb2NhdGlvbiwgJHRpbWVvdXQsICRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS50aXRsZSA9IFwiVWRwYXRlIFBhc3N3b3JkXCI7XHJcbiAgICAgICAgdm0uZGF0YSA9IHtcclxuICAgICAgICAgICAgY3VycmVudFBhc3N3b3JkOiBcIlwiLFxuICAgICAgICAgICAgbmV3UGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgICAgICBuZXdDb25maXJtUGFzc3dvcmQ6IFwiXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICB2bS5zdWJtaXQgPSB1cGRhdGVQYXNzd29yZEhhbmRsZXI7XHJcbiAgICAgICAgdm0udXBkYXRlUGFzc3dvcmQgPSB1cGRhdGVQYXNzd29yZEhhbmRsZXI7XHJcbiAgICAgICAgdm0udG9nZ2xlU2lkZW5hdiA9IHRvZ2dsZVNpZGVuYXY7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzIFxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBhc3N3b3JkSGFuZGxlcigpIHtcclxuXHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCA9PT0gZmFsc2UgfHwgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uZW1haWwgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIllvdSBhcHBlYXIgdG8gaGF2ZSBub3QgYmVlbiBhdXRoZW50aWNhdGVkIHlldCwgeW91IG1heSBuZWVkIHRvIGxvZyBvdXQgZmlyc3QgYW5kIHRyeSBhZ2FpblwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0uZGF0YS5jdXJyZW50UGFzc3dvcmQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIkN1cnJlbnQgUGFzc3dvcmQgY2Fubm90IGJlIGVtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5kYXRhLm5ld1Bhc3N3b3JkID09PSBcIlwiIHx8IHZtLmRhdGEubmV3Q29uZmlybVBhc3N3b3JkID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJOZXcgUGFzc3dvcmQgY2Fubm90IGJlIGVtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5kYXRhLm5ld0NvbmZpcm1QYXNzd29yZCAhPT0gdm0uZGF0YS5uZXdQYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiTmV3IHBhc3N3b3JkIGRvZXMgbm90IG1hdGNoIHRoZSBuZXcgY29uZmlybSBwYXNzd29yZFwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hhbmdlRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIEVtYWlsOiBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5lbWFpbCxcclxuICAgICAgICAgICAgICAgIEN1cnJlbnRQYXNzd29yZDogdm0uZGF0YS5jdXJyZW50UGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICBOZXdQYXNzd29yZDogdm0uZGF0YS5uZXdQYXNzd29yZCxcclxuICAgICAgICAgICAgICAgIE5ld0NvbmZpcm1QYXNzd29yZDogdm0uZGF0YS5uZXdDb25maXJtUGFzc3dvcmRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmNoYW5nZXBhc3N3b3JkKGNoYW5nZURhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LiBMb2dnaW5nIHlvdSBvdXQgbm93IGJlY2F1c2UgeW91IG5lZWQgdG8gbG9nIGluIHdpdGggeW91ciBuZXcgcGFzc3dvcmQgYWdhaW4uXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyKCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihyZXNwb25zZSwgdm0sIFwiRmFpbGVkIHRvIHVwZGF0ZSBwYXNzd29yZCBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzdGFydFRpbWVyKCkge1xyXG4gICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTaWRlbmF2KG1lbnVJZCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UudG9nZ2xlU2lkZW5hdihtZW51SWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcbiAgICBhcHBcclxuICAgICAgICAuY29udHJvbGxlcignQWRtaW5DYWNoZUNvbnRyb2xsZXInLCBhZG1pbkNhY2hlQ29udHJvbGxlcik7XHJcblxyXG4gICAgYWRtaW5DYWNoZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnJGNhY2hlRmFjdG9yeScsICdSZWZlcmVuY2VEYXRhU2VydmljZSddO1xyXG4gICAgZnVuY3Rpb24gYWRtaW5DYWNoZUNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsICRjYWNoZUZhY3RvcnksIHJlZkRhdGFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG5cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmRhdGEgPSAkY2FjaGVGYWN0b3J5LmdldCgnJGh0dHAnKTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5oYXNDYWNoZSA9IHZtLmRhdGEuaW5mbygpLnNpemUgPiAwO1xyXG4gICAgICAgIHZtLnJlZkRhdGFLZXlzID0gW107XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICB2bS5yZW1vdmVBbGwgPSByZW1vdmVBbGw7XHJcbiAgICAgICAgdm0uZmx1c2hSZWZEYXRhID0gZmx1c2hSZWZEYXRhO1xyXG5cclxuICAgICAgICAvLyBpbml0XHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnMgXHJcbiAgICAgICAgZnVuY3Rpb24gZmx1c2hSZWZEYXRhKGtleSkge1xyXG4gICAgICAgICAgICByZWZEYXRhU2VydmljZS5mbHVzaChrZXkpO1xyXG4gICAgICAgICAgICBsb2FkUmVmRGF0YUtleXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUFsbCgpIHtcclxuICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZtLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZtLmRhdGEucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5kYXRhID0gJGNhY2hlRmFjdG9yeS5nZXQoJyRodHRwJyk7XHJcbiAgICAgICAgICAgICAgICB2bS5oYXNDYWNoZSA9IHZtLmRhdGEuaW5mbygpLnNpemUgPiAwO1xyXG4gICAgICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICdBbGwgQ2FjaGVzIGFyZSBjbGVhbmVkIHVwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaGVscGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBsb2FkUmVmRGF0YUtleXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRSZWZEYXRhS2V5cygpIHtcclxuICAgICAgICAgICAgdm0ucmVmRGF0YUtleXMgPSByZWZEYXRhU2VydmljZS5nZXRLZXlzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG4gICAgYXBwXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FkbWluQ3JhdmluZ1RhZ3NDb250cm9sbGVyJywgYWRtaW5DcmF2aW5nVGFnc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGFkbWluQ3JhdmluZ1RhZ3NDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ0FkbWluU2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsICdNb2RhbFNlcnZpY2UnXTtcclxuICAgIGZ1bmN0aW9uIGFkbWluQ3JhdmluZ1RhZ3NDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBhZG1pblNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBtb2RhbFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XHJcblxyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSAnJztcclxuICAgICAgICB2bS5xdWVyeSA9IHtcclxuICAgICAgICAgICAgZmlsdGVyOiAnJyxcclxuICAgICAgICAgICAgb3JkZXI6ICdkYXRlJyxcclxuICAgICAgICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICAgICAgICBwYWdlOiAxXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldENyYXZpbmdUYWdzKCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UuZ2V0QWxsQ3JhdmluZ1RhZ3Modm0ucXVlcnkucGFnZSwgdm0ucXVlcnkubGltaXQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS50YWdzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIHZtLnRvdGFsID0gcmVzcG9uc2UuZGF0YS5QYWdlU2l6ZSAqIHJlc3BvbnNlLmRhdGEuUGFnZUNvdW50O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluaXRcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVycyBcclxuICAgICAgICB2bS5vblBhZ2luYXRpb25DaGFuZ2UgPSBvblBhZ2luYXRpb25DaGFuZ2U7XHJcbiAgICAgICAgdm0uZGlzYWJsZVRhZyA9IGRpc2FibGVUYWc7XHJcbiAgICAgICAgdm0uZW5hYmxlVGFnID0gZW5hYmxlVGFnO1xyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGdldENyYXZpbmdUYWdzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvblBhZ2luYXRpb25DaGFuZ2UocGFnZSwgbGltaXQpIHtcclxuICAgICAgICAgICAgdm0ucXVlcnkucGFnZSA9IHBhZ2U7XHJcbiAgICAgICAgICAgIHZtLnF1ZXJ5LmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgICAgIGdldENyYXZpbmdUYWdzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkaXNhYmxlVGFnKHRhZ0lkKSB7XHJcbiAgICAgICAgICAgIGFkbWluU2VydmljZS51cGRhdGVDcmF2aW5nVGFnKHRhZ0lkLCBmYWxzZSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRDcmF2aW5nVGFncygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVuYWJsZVRhZyh0YWdJZCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UudXBkYXRlQ3JhdmluZ1RhZyh0YWdJZCwgdHJ1ZSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRDcmF2aW5nVGFncygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcbiAgICBhcHBcclxuICAgICAgICAuY29udHJvbGxlcignQWRtaW5EaXNoQ29udHJvbGxlcicsIGFkbWluRGlzaENvbnRyb2xsZXIpO1xyXG5cclxuICAgIGFkbWluRGlzaENvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnQWRtaW5TZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICdmaWxlU2VydmljZSddO1xyXG4gICAgZnVuY3Rpb24gYWRtaW5EaXNoQ29udHJvbGxlcihhdXRoU2VydmljZSwgYWRtaW5TZXJ2aWNlLCBuYXZpZ2F0aW9uU2VydmljZSwgbW9kYWxTZXJ2aWNlLCBmaWxlU2VydmljZSkge1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcclxuXHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIHZtLnF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgICBvcmRlcjogJ2RhdGUnLFxyXG4gICAgICAgICAgICBsaW1pdDogMjAsXHJcbiAgICAgICAgICAgIHBhZ2U6IDFcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBtZXRob2RzXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVjZW50RGlzaGVzKCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UuZ2V0QWxsUmVjZW50RGlzaGVzKHZtLnF1ZXJ5LnBhZ2UsIHZtLnF1ZXJ5LmxpbWl0KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uZGlzaGVzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIHZtLnRvdGFsID0gcmVzcG9uc2UuZGF0YS5QYWdlU2l6ZSAqIHJlc3BvbnNlLmRhdGEuUGFnZUNvdW50O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluaXRcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVycyBcclxuICAgICAgICB2bS5nZXREaW5lckltYWdlID0gZ2V0RGluZXJJbWFnZTtcclxuICAgICAgICB2bS5nZXRQcmV2aWV3SW1hZ2UgPSBnZXRQcmV2aWV3SW1hZ2U7XHJcbiAgICAgICAgdm0ub3BlbkRldGFpbCA9IG9wZW5EZXRhaWw7XHJcbiAgICAgICAgdm0ub25QYWdpbmF0aW9uQ2hhbmdlID0gb25QYWdpbmF0aW9uQ2hhbmdlO1xyXG4gICAgICAgIHZtLnJlbW92ZURpc2ggPSByZW1vdmVEaXNoO1xyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGdldFJlY2VudERpc2hlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGluZXJJbWFnZShpbWdOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlU2VydmljZS5nZXRTYWZlQXZhdGFySW1hZ2UoaW1nTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRQcmV2aWV3SW1hZ2UoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVNlcnZpY2UuZ2V0U2FmZVByZXZpZXdJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5EZXRhaWwoZGlzaCkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnZGlzaC5kZXRhaWwnLCB7ICdpZCc6IGRpc2guRGlzaElkIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25QYWdpbmF0aW9uQ2hhbmdlKHBhZ2UsIGxpbWl0KSB7XHJcbiAgICAgICAgICAgIHZtLnF1ZXJ5LnBhZ2UgPSBwYWdlO1xyXG4gICAgICAgICAgICB2bS5xdWVyeS5saW1pdCA9IGxpbWl0O1xyXG4gICAgICAgICAgICBnZXRSZWNlbnREaXNoZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZURpc2goZGlzaElkKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5vcGVuTW9kYWwoJ2FkbWluL21vZGVyYXRpb25fcmVhc29uX21vZGFsLmh0bWwnLCAnQWRtaW5Nb2RlcmF0aW9uTW9kYWxDb250cm9sbGVyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YSAhPT0gJ2NhbmNlbCcgJiYgZGF0YS5yZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBhZG1pblNlcnZpY2UucmVtb3ZlRGlzaChkaXNoSWQsIGRhdGEucmVhc29uKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UmVjZW50RGlzaGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuICAgIGFwcFxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBZG1pbkZpbGVzQ29udHJvbGxlcicsIGFkbWluRmlsZXNDb250cm9sbGVyKTtcclxuXHJcbiAgICBhZG1pbkZpbGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdBZG1pblNlcnZpY2UnLCAnZmlsZVNlcnZlciddO1xyXG4gICAgZnVuY3Rpb24gYWRtaW5GaWxlc0NvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGFkbWluU2VydmljZSwgZmlsZVNlcnZlcikge1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcclxuXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGluaXRcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVycyBcclxuICAgICAgICBcclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuICAgIGFwcFxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBhZG1pbkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGFkbWluQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICdSZXN1bWVTZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJHNjb3BlJ107XHJcbiAgICBmdW5jdGlvbiBhZG1pbkNvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIHJlc3VtZVNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCAkcm9vdFNjb3BlLCAkc2NvcGUpIHtcclxuXHJcbiAgICAgICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XHJcblxyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy8gcHJvcGVydGllc1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJBZG1pbmlzdHJhdGlvblwiO1xyXG4gICAgICAgIHZtLm92ZXJsYXlUaXRsZSA9IFwiXCI7XHJcbiAgICAgICAgdm0ubWVudSA9IGJ1aWxkTWVudSgpO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkSXRlbSA9IHZhbGlkYXRlU2VsZWN0ZWRJdGVtKCRyb290U2NvcGUuJHN0YXRlUGFyYW1zLnNlbGVjdGVkKTtcclxuICAgICAgICB2bS5zZWxlY3RlZEl0ZW1QYWdlID0gXCJhZG1pbi9hZG1pbi5cIiArIHZtLnNlbGVjdGVkSXRlbS5rZXkgKyBcIi5odG1sXCI7XHJcbiAgICAgICAgdm0uaGFzQWNjZXNzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIHZtLmNoZWNrQWN0aXZlID0gY2hlY2tBY3RpdmVIYW5kbGVyO1xyXG5cclxuICAgICAgICAvLyBpbml0XHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnMgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tBY3RpdmVIYW5kbGVyKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHZtLnNlbGVjdGVkSXRlbSA9PT0gaXRlbSkgcmV0dXJuIFwiYWN0aXZlXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVTZWxlY3RlZEl0ZW0oc2VsZWN0ZWRJdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLm1lbnUubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLm1lbnVbaWR4XS5rZXkgPT09IHNlbGVjdGVkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVQYWdlVGl0bGUoJ091ckNyYXZpbmcgLT4gQWRtaW5pc3RyYXRpb24gLT4gJyArIHZtLm1lbnVbaWR4XS50aXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLm1lbnVbaWR4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZtLm1lbnVbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7IH0sIFwiWW91IG5lZWQgdG8gbG9naW4gZmlyc3QgdG8gYWNjZXNzIHRoZSBhZG1pbiBwYWdlLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYnVpbGRNZW51KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICdkaXNoZXMnLFxyXG4gICAgICAgICAgICAgICAgbGluazogXCJhZG1pbi5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J2Rpc2hlcyd9KVwiLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZWNlbnQgRGlzaGVzJyxcclxuICAgICAgICAgICAgICAgIGljb246ICdyZXN0YXVyYW50X21lbnUnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3Jldmlld3MnLFxyXG4gICAgICAgICAgICAgICAgbGluazogXCJhZG1pbi5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J3Jldmlld3MnfSlcIixcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVjZW50IFJldmlld3MnLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogJ2NvbW1lbnQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwiYWRtaW4uaG9tZS5kZXRhaWwoe3NlbGVjdGVkOid1c2Vycyd9KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVjZW50IFVzZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAncGVvcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmaWxlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogXCJhZG1pbi5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J2ZpbGVzJ30pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWNlbnQgRmlsZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdwaG90bydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnY3JhdmluZ3RhZ3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwiYWRtaW4uaG9tZS5kZXRhaWwoe3NlbGVjdGVkOidjcmF2aW5ndGFncyd9KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ3JhdmluZyBUYWdzJyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmxhZydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdjYWNoZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogXCJhZG1pbi5ob21lLmRldGFpbCh7c2VsZWN0ZWQ6J2NhY2hlJ30pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDYWNoZSBNYW5hZ2VtZW50JyxcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnY2FjaGVkJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBZG1pbk1vZGVyYXRpb25Nb2RhbENvbnRyb2xsZXInLCBtb2RhbEFkbWluTW9kZXJhdGlvbkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIG1vZGFsQWRtaW5Nb2RlcmF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWydNb2RhbFNlcnZpY2UnLCAnbW9kYWxJdGVtJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbW9kYWxBZG1pbk1vZGVyYXRpb25Db250cm9sbGVyKG1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIHZtLnJlYXNvbkRhdGEgPSB7IHJlYXNvbjogJycgfTtcclxuXHJcbiAgICAgICAgdm0uY2xvc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5yZWFzb24gfHwgcmVzdWx0LnJlYXNvbi50cmltKCkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJQbGVhc2UgZW50ZXIgYSByZWFzb24gYmVmb3JlIHN1Ym1pdHRpbmcgdGhpcyBtb2RlcmF0aW9uIHJlcXVlc3QuXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5zdWJtaXRNb2RhbChyZXN1bHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcbiAgICBhcHBcclxuICAgICAgICAuY29udHJvbGxlcignQWRtaW5SZXZpZXdDb250cm9sbGVyJywgYWRtaW5SZXZpZXdDb250cm9sbGVyKTtcclxuXHJcbiAgICBhZG1pblJldmlld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnQWRtaW5TZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICdmaWxlU2VydmljZSddO1xyXG4gICAgZnVuY3Rpb24gYWRtaW5SZXZpZXdDb250cm9sbGVyKGF1dGhTZXJ2aWNlLCBhZG1pblNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBtb2RhbFNlcnZpY2UsIGZpbGVTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG5cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSAnJztcclxuICAgICAgICAvLyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdm0ucXVlcnkgPSB7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJycsXHJcbiAgICAgICAgICAgIG9yZGVyOiAnZGF0ZScsXHJcbiAgICAgICAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgICAgICAgcGFnZTogMVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICBmdW5jdGlvbiBnZXRSZWNlbnRSZXZpZXdzKCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UuZ2V0QWxsUmVjZW50UmV2aWV3cyh2bS5xdWVyeS5wYWdlLCB2bS5xdWVyeS5saW1pdCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLnJldmlld3MgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgdm0udG90YWwgPSByZXNwb25zZS5kYXRhLlRvdGFsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluaXRcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVycyBcclxuICAgICAgICB2bS5vcGVuRGlzaERldGFpbCA9IG9wZW5EaXNoRGV0YWlsO1xyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG4gICAgICAgIHZtLnJlbW92ZVJldmlldyA9IHJlbW92ZVJldmlldztcclxuXHJcbiAgICAgICAgLy8gaGVscGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBnZXRSZWNlbnRSZXZpZXdzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaW5lckltYWdlKGltZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVBdmF0YXJJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5EaXNoRGV0YWlsKGRpc2hJZCkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnZGlzaC5kZXRhaWwnLCB7ICdpZCc6IGRpc2hJZCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVJldmlldyhyZXZpZXdJZCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uub3Blbk1vZGFsKCdhZG1pbi9tb2RlcmF0aW9uX3JlYXNvbl9tb2RhbC5odG1sJywgJ0FkbWluTW9kZXJhdGlvbk1vZGFsQ29udHJvbGxlcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEgIT09ICdjYW5jZWwnICYmIGRhdGEucmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRtaW5TZXJ2aWNlLnJlbW92ZVJldmlldyhyZXZpZXdJZCwgZGF0YS5yZWFzb24pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRSZWNlbnRSZXZpZXdzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuICAgIGFwcFxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBZG1pblVzZXJDb250cm9sbGVyJywgYWRtaW5SZXZpZXdDb250cm9sbGVyKTtcclxuXHJcbiAgICBhZG1pblJldmlld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnQXV0aFNlcnZpY2UnLCAnQWRtaW5TZXJ2aWNlJywgJ2ZpbGVTZXJ2aWNlJ107XHJcbiAgICBmdW5jdGlvbiBhZG1pblJldmlld0NvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGFkbWluU2VydmljZSwgZmlsZVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XHJcblxyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICB2bS5xdWVyeSA9IHtcclxuICAgICAgICAgICAgZmlsdGVyOiAnJyxcclxuICAgICAgICAgICAgb3JkZXI6ICdkYXRlJyxcclxuICAgICAgICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICAgICAgICBwYWdlOiAxXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlY2VudFVzZXJzKCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UuZ2V0QWxsUmVjZW50VXNlcnModm0ucXVlcnkucGFnZSwgdm0ucXVlcnkubGltaXQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51c2VycyA9IHJlc3BvbnNlLmRhdGEuSXRlbXM7XHJcbiAgICAgICAgICAgICAgICB2bS50b3RhbCA9IHJlc3BvbnNlLmRhdGEuVG90YWw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaW5pdFxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzIFxyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIGdldFJlY2VudFVzZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaW5lckltYWdlKGltZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVBdmF0YXJJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyBhbmd1bGFyLm1vZHVsZSgnb2Muc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSlcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcblxyXG4gICAgYXBwXHJcbiAgICAgICAgLmNvbnN0YW50KFwib2NTZXJ2aWNlXCIsICdAQHNlcnZpY2VFbmRQb2ludCcpXHJcbiAgICAgICAgLmNvbnN0YW50KFwiYmFzZVVybFwiLCAnaHR0cDovL0BAc2VydmljZUVuZFBvaW50L2FwaS92MS8nKVxyXG4gICAgICAgIC5jb25zdGFudChcImJhc2VVcmwyXCIsICdodHRwOi8vQEBzZXJ2aWNlRW5kUG9pbnQvYXBpL3YyLycpXHJcbiAgICAgICAgLmNvbnN0YW50KFwiYXV0aFVybFwiLCAnaHR0cDovL0BAc2VydmljZUVuZFBvaW50L2FwaS92Mi9hY2NvdW50JylcclxuICAgICAgICAuY29uc3RhbnQoXCJ0b2tlblVybFwiLCAnaHR0cDovL0BAc2VydmljZUVuZFBvaW50L29hdXRoL3Rva2VuJylcclxuICAgICAgICAuY29uc3RhbnQoJ3VwbG9hZFVybCcsIFwiaHR0cDovL0BAZmlsZUVuZFBvaW50L1VwbG9hZGVyL1VwbG9hZEhhbmRsZXIuYXNoeFwiKVxuICAgICAgICAuY29uc3RhbnQoJ2ZpbGVTZXJ2ZXInLCBcImh0dHA6Ly9AQGZpbGVFbmRQb2ludFwiKVxuICAgICAgICAuY29uc3RhbnQoJ2F1dGhTZXR0aW5ncycsIHsgY2xpZW50SWQ6ICdvY1dlYicgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgICAnbmdSZXNvdXJjZScsXG4gICAgICAnbmdTYW5pdGl6ZScsXG4gICAgICAnbmdUb3VjaCcsXG4gICAgICAndWkucm91dGVyJyxcbiAgICAgICd1aS51dGlscycsXG4gICAgICAndWkuZXZlbnQnLFxuICAgICAgJ3VpLmpxJyxcbiAgICAgICd1aS5ib290c3RyYXAnLFxuICAgICAgJ3VpLnNlbGVjdCcsXG4gICAgICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbiAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgJ25ncGx1cycsXG4gICAgICAnbWQuZGF0YS50YWJsZScsXG4gICAgICAnbmdNYXRlcmlhbCcsXG4gICAgICAnbmdNZEljb25zJyxcbiAgICAgICduZ01lc3NhZ2VzJyxcbiAgICAgICdhbmd1bGFyLmZpbHRlcicsXG4gICAgICAndWlHbWFwZ29vZ2xlLW1hcHMnXG4gICAgXSk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAuY29uZmlnKFxuICAgICAgICBbJyRjb250cm9sbGVyUHJvdmlkZXInLCAnJGNvbXBpbGVQcm92aWRlcicsICckZmlsdGVyUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAnJGh0dHBQcm92aWRlcicsXG4gICAgICAgICAgZnVuY3Rpb24gKCRjb250cm9sbGVyUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsICRmaWx0ZXJQcm92aWRlciwgJHByb3ZpZGUsICRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgICBhcHAuY29udHJvbGxlciA9ICRjb250cm9sbGVyUHJvdmlkZXIucmVnaXN0ZXI7XG4gICAgICAgICAgICAgIGFwcC5kaXJlY3RpdmUgPSAkY29tcGlsZVByb3ZpZGVyLmRpcmVjdGl2ZTtcbiAgICAgICAgICAgICAgYXBwLmZpbHRlciA9ICRmaWx0ZXJQcm92aWRlci5yZWdpc3RlcjtcbiAgICAgICAgICAgICAgYXBwLmZhY3RvcnkgPSAkcHJvdmlkZS5mYWN0b3J5O1xuICAgICAgICAgICAgICBhcHAuc2VydmljZSA9ICRwcm92aWRlLnNlcnZpY2U7XG4gICAgICAgICAgICAgIGFwcC5jb25zdGFudCA9ICRwcm92aWRlLmNvbnN0YW50O1xuICAgICAgICAgICAgICBhcHAudmFsdWUgPSAkcHJvdmlkZS52YWx1ZTtcblxuICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJyk7XG5cbiAgICAgICAgICAgICAgLy9FbmFibGUgY3Jvc3MgZG9tYWluIGNhbGxzXHJcbiAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgLy9SZW1vdmUgdGhlIGhlYWRlciBjb250YWluaW5nIFhNTEh0dHBSZXF1ZXN0IHVzZWQgdG8gaWRlbnRpZnkgYWpheCBjYWxsIFxyXG4gICAgICAgICAgICAgIC8vdGhhdCB3b3VsZCBwcmV2ZW50IENPUlMgZnJvbSB3b3JraW5nXHJcbiAgICAgICAgICAgICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcclxuXHJcbiAgICAgICAgICAgICAgLy8kaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHtcclxuICAgICAgICAgICAgICAvLyAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxyXG4gICAgICAgICAgICAgIC8vICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgIC8vICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZSwgQWNjZXB0LCBYLVJlcXVlc3RlZC1XaXRoJ1xyXG4gICAgICAgICAgICAgIC8vfTtcclxuXHJcbiAgICAgICAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHtcclxuICAgICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcclxuICAgICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURScsXHJcbiAgICAgICAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZSwgQWNjZXB0LCBYLVJlcXVlc3RlZC1XaXRoJyxcclxuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XG4gICAgICAgIF0pXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgdmFyIGN1c3RvbUJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnbGlnaHQtYmx1ZScsIHtcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGVmYXVsdENvbG9yJzogJ2xpZ2h0JyxcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGFya0NvbG9ycyc6IFsnNTAnXSxcclxuICAgICAgICAgICAgJzUwJzogJ0VDRUZGMScsXHJcbiAgICAgICAgICAgICcyMDAnOiAnMTk3NkQyJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnY3VzdG9tR3JlZW4nLCBjdXN0b21CbHVlTWFwKTtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdjdXN0b21HcmVlbicsIHtcclxuICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc1MDAnLFxyXG4gICAgICAgICAgICAgICdodWUtMSc6ICc1MCcsXHJcbiAgICAgICAgICAgICAgJ2h1ZS0yJzogJzIwMCdcclxuICAgICAgICAgIH0pLmFjY2VudFBhbGV0dGUoJ3JlZCcpO1xyXG5cclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2lucHV0JywgJ2RlZmF1bHQnKS5wcmltYXJ5UGFsZXR0ZSgnZ3JleScpO1xyXG4gICAgfSk7O1xuXG4gICAgYXBwLmZpbHRlcigncHJvcHNGaWx0ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtcywgcHJvcHMpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGl0ZW1zKSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBwcm9wc1twcm9wXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1bcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIExldCB0aGUgb3V0cHV0IGJlIHRoZSBpbnB1dCB1bnRvdWNoZWRcbiAgICAgICAgICAgICAgICBvdXQgPSBpdGVtcztcclxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7IC8vIHRoaXMgcm91dGUgaXMgdXNlZCB0byBzaG93IHRoZSBsb2dpbiBmb3JtIGluIHRoZSBmdWxsIHBhZ2VcclxuICAgICAgICAgICAgdXJsOiAnL2xvZ2luP3NlbGVjdGVkJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQvc2hlbGwuaHRtbCdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY29udGVudEBsb2dpbic6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvbG9naW5QYWdlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY2NvdW50TG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdwcm9maWxlJywge1xyXG4gICAgICAgICAgICBcImFic3RyYWN0XCI6IHRydWUsXHJcbiAgICAgICAgICAgIHVybDogJy9wcm9maWxlJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQvc2hlbGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FjY291bnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdwcm9maWxlLmFjdGl2YXRlJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWN0aXZhdGU/ZW1haWwmaWQmY29kZScsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICBcImNvbnRlbnRAcHJvZmlsZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2FjdGl2YXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY3RpdmF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc3RhdGUoJ3Byb2ZpbGUucmVzZXQnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9yZXNldD9lbWFpbCZpZCZjb2RlJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgIFwiY29udGVudEBwcm9maWxlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvcmVzZXQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAuc3RhdGUoJ3Byb2ZpbGUuaG9tZScsIHtcclxuICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgXCJjb250ZW50QHByb2ZpbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L3Byb2ZpbGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnN0YXRlKCdwcm9maWxlLmhvbWUuZGV0YWlsJywge1xyXG4gICAgICAgIHVybDogJy86c2VsZWN0ZWQnLFxyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgIFwiY29udGVudEBwcm9maWxlXCI6IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWNjb3VudC9wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zdGF0ZSgncHJvZmlsZS5hc3NvY2lhdGUnLCB7XHJcbiAgICAgICAgdXJsOiAnL2Fzc29jaWF0ZScsXHJcbiAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgXCJjb250ZW50QHByb2ZpbGVcIjoge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L3Byb2ZpbGUuYXNzb2NpYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2ZpbGVBc3NvY2lhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIDtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWJzdHJhY3RcIjogdHJ1ZSxcclxuICAgICAgICAgICAgdXJsOiAnL2FkbWluJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQvc2hlbGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFwcC5zZXR0aW5ncy5wYWdlVGl0bGUgPSAnQWRtaW5pc3RyYXRvcic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnYWRtaW4uaG9tZScsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2hvbWUnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAYWRtaW4nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhZG1pbi9ob21lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgLnN0YXRlKCdhZG1pbi5ob21lLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgIHVybDogJy86c2VsZWN0ZWQnLFxyXG4gICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAnY29udGVudEBhZG1pbic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhZG1pbi9ob21lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KVxyXG4gICAgO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnZGlzaCcsIHtcclxuICAgICAgICAgICAgXCJhYnN0cmFjdFwiOiB0cnVlLFxyXG4gICAgICAgICAgICB1cmw6ICcvZGlzaCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGF5b3V0L3NoZWxsX3dpdGhfbGVmdF9zaWRlYmFyLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnZGlzaC5hZGQnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hZGQ/aW5wdXQnLFxyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXI6IFtcclxuICAgICAgICAgICAgICAgICAgICAnTG9hZGVyRmFjdG9yeScsIGZ1bmN0aW9uIChsb2FkZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBsb2FkZXJGYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXNoID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2gudHlwZSA9IFwiTmV3XCI7IC8vIHRoaXMgaXMgbm90IHVzZWQgeWV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmN1cnJlbnQgPSBkaXNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ3NpZGViYXJAZGlzaCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Rpc2gvbWFwLmFkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGlzaE1hcEVkaXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnY29udGVudEBkaXNoJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlzaC9kaXNoLmFkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGlzaEZpZWxkRWRpdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc3RhdGUoJ2Rpc2guZGV0YWlsJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzppZCcsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHJlc3RhdXJhbnRMb2FkZXI6IFsnTG9hZGVyRmFjdG9yeScsIGZ1bmN0aW9uIChsb2FkZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBsb2FkZXJGYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ3NpZGViYXJAZGlzaCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Rpc2gvbWFwLnZpZXdlci5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVzdGF1cmFudE1hcENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdjb250ZW50QGRpc2gnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdkaXNoL2Rpc2guZGV0YWlsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEaXNoRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgXCJhYnN0cmFjdFwiOiB0cnVlLFxyXG4gICAgICAgICAgICAgICB1cmw6ICcnLFxyXG4gICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgJ2FwcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xheW91dC9zaGVsbC5odG1sJ1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfSlcclxuICAgICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xyXG4gICAgICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjcmF2aW5nL2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDcmF2aW5nVGFnc0NvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwidm1cIlxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfSlcclxuICAgICAgIC5zdGF0ZSgnYXBwLmhvbWUuc2VhcmNoJywge1xyXG4gICAgICAgICAgIHVybDogJ14vc2VhcmNoLzpjcml0ZXJpYScsXHJcbiAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjcmF2aW5nL3NlYXJjaC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU2VhcmNoQ3JhdmluZ0NvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJ2bVwiXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gICAgICAgICAgIC5zdGF0ZSgnYXBwLmhlbHAnLCB7XHJcbiAgICAgICAgICAgICAgIHVybDogJ14vaGVscCcsXHJcbiAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAnY29udGVudEBhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzeXMvaGVscC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFwcC5zZXR0aW5ncy5wYWdlVGl0bGUgPSAnT3VyQ3JhdmluZyAtIEhlbHAgJiBGQVEnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9KVxyXG4gICAgICAgICAgIC5zdGF0ZSgnYXBwLmFib3V0Jywge1xyXG4gICAgICAgICAgICAgICB1cmw6ICdeL2Fib3V0dXMnLFxyXG4gICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3lzL2Fib3V0Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYXBwLnNldHRpbmdzLnBhZ2VUaXRsZSA9ICdPdXJDcmF2aW5nIC0gQWJvdXQgVXMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9KVxyXG4gICAgICAgICAgIC5zdGF0ZSgnYXBwLnRlcm1zY29uZGl0aW9ucycsIHtcclxuICAgICAgICAgICAgICAgdXJsOiAnXi90ZXJtc2NvbmRpdGlvbnMnLFxyXG4gICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3lzL3Rlcm1zLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYXBwLnNldHRpbmdzLnBhZ2VUaXRsZSA9ICdPdXJDcmF2aW5nIC0gVGVybXMgYW5kIENvbmRpdGlvbnMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9KVxyXG4gICAgICAgICAgIC5zdGF0ZSgnYXBwLmxvY2F0aW9uJywge1xyXG4gICAgICAgICAgICAgICB1cmw6ICdeL2xvY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICdjb250ZW50QGFwcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N5cy9sb2NhdGlvbi5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9jYXRpb25Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH0pO1xyXG59OyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgLnJ1bihbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICdHZW9TZXJ2aWNlJywgJyR0aW1lb3V0JywnJGxvY2F0aW9uJywgJyR3aW5kb3cnLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBnZW9TZXJ2aWNlLCAkdGltZW91dCwgJGxvY2F0aW9uLCAkd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcblxuICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0TG9jYXRpb24gPSB3aW5kb3cuaGVscGVyLmdldERlZmF1bHRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5wb3NpdGlvbiA9IGRlZmF1bHRMb2NhdGlvbjtcclxuICAgICAgICAgICAgICAgIGxvYWRHZW9Mb2NhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGdvb2dsZSBhbmFseXRpY3NcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkd2luZG93LmdhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5nYSgnc2VuZCcsICdwYWdldmlldycsIHsgcGFnZTogJGxvY2F0aW9uLnBhdGgoKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKGRlZmF1bHRMb2NhdGlvbi5jb29yZHMubGF0aXR1ZGUgPT09ICRyb290U2NvcGUucG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICYmICRyb290U2NvcGUucG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSA9PT0gZGVmYXVsdExvY2F0aW9uLmNvb3Jkcy5sb25naXR1ZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgKCRyb290U2NvcGUucG9zaXRpb24gPT09IHVuZGVmaW5lZCB8fCAkcm9vdFNjb3BlLnBvc2l0aW9uLmNvb3JkcyA9PT0gdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBobW0sIGxldCdzIHRyeSBhZ2FpbiwgYmVjYXVzZSBpdCBzZWVtcyB3ZSBmYWlsZWQgdG8gbG9hZCBhIHVzZXIgbG9jYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEdlb0xvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgNjAwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBjb2RlIGRvZXNuJ3Qgc2VlbSB0byBydW4gcHJvcGVybHksIHNvbWV0aW1lcywgbm90IHN1cmUgaWYgaXQncyBvbmx5IGhhcHBlbmluZyBpbiB0aGUgYnJvd3NlcmlmeSBlbnZpcm9ubWVudFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEdlb0xvY2F0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBxID0gZ2VvU2VydmljZS5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5wb3NpdGlvbiA9IGdlb1NlcnZpY2UucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnBvc2l0aW9uID0gZGVmYXVsdExvY2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY29uc3RydWN0b3IucHJvdG90eXBlLiRvZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiQkbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudEFyciA9IHRoaXMuJCRsaXN0ZW5lcnNbZXZlbnROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50QXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50QXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50QXJyW2ldID09PSBmbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEFyci5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxuICAgICBdKVxuICAgICAgLmNvbmZpZyhcbiAgICAgICAgWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxuICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuICAgICAgICAgICAgICBjb25maWdIb21lUm91dGVzKCRzdGF0ZVByb3ZpZGVyKTtcclxuICAgICAgICAgICAgICBjb25maWdEaXNoUm91dGVzKCRzdGF0ZVByb3ZpZGVyKTtcclxuICAgICAgICAgICAgICBjb25maWdBY2NvdW50Um91dGVzKCRzdGF0ZVByb3ZpZGVyKTtcclxuICAgICAgICAgICAgICBjb25maWdQcm9wb3NhbFJvdXRlcygkc3RhdGVQcm92aWRlcik7XHJcbiAgICAgICAgICAgICAgY29uZmlnQWRtaW5Sb3V0ZXMoJHN0YXRlUHJvdmlkZXIpO1xyXG4gICAgICAgICAgICAgIGNvbmZpZ1Jlc3RhdXJhbnRSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpO1xyXG5cclxuICAgICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoZmFsc2UpLmhhc2hQcmVmaXgoJyEnKTtcclxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWdIb21lUm91dGVzKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgdmFyIGhvbWVSb3V0ZSA9IHJlcXVpcmUoXCIuL2NvbmZpZy5yb3V0ZXIuaG9tZS5qc1wiKTtcclxuICAgICAgICBob21lUm91dGUoJHN0YXRlUHJvdmlkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Rpc2hSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgZGlzaFJvdXRlID0gcmVxdWlyZShcIi4vY29uZmlnLnJvdXRlci5kaXNoLmpzXCIpO1xyXG4gICAgICAgIGRpc2hSb3V0ZSgkc3RhdGVQcm92aWRlcik7XHJcbiAgICB9XHJcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0FjY291bnRSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgYWNjb3VudFJvdXRlID0gcmVxdWlyZShcIi4vY29uZmlnLnJvdXRlci5hY2NvdW50LmpzXCIpO1xyXG4gICAgICAgIGFjY291bnRSb3V0ZSgkc3RhdGVQcm92aWRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnUHJvcG9zYWxSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgcHJvcG9zYWxSb3V0ZSA9IHJlcXVpcmUoXCIuL2NvbmZpZy5yb3V0ZXIucHJvcG9zYWwuanNcIik7XHJcbiAgICAgICAgcHJvcG9zYWxSb3V0ZSgkc3RhdGVQcm92aWRlcik7XHJcbiAgICB9XHJcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0FkbWluUm91dGVzKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgdmFyIHByb3Bvc2FsUm91dGUgPSByZXF1aXJlKFwiLi9jb25maWcucm91dGVyLmFkbWluLmpzXCIpO1xyXG4gICAgICAgIHByb3Bvc2FsUm91dGUoJHN0YXRlUHJvdmlkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZ1Jlc3RhdXJhbnRSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgcmVzdFJvdXRlID0gcmVxdWlyZShcIi4vY29uZmlnLnJvdXRlci5yZXN0YXVyYW50LmpzXCIpO1xyXG4gICAgICAgIHJlc3RSb3V0ZSgkc3RhdGVQcm92aWRlcik7XHJcbiAgICB9XHJcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb3Bvc2FsJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWJzdHJhY3RcIjogdHJ1ZSxcclxuICAgICAgICAgICAgdXJsOiAnL3Byb3Bvc2FsJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQvc2hlbGwuaHRtbCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdwcm9wb3NhbC5ob21lJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvY3JhdmluZycsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudEBwcm9wb3NhbCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb3Bvc2FsL2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ015UHJvcG9zYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgIC5zdGF0ZSgncHJvcG9zYWwuaG9tZS5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICB1cmw6ICcvOmtleScsXHJcbiAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICdjb250ZW50QHByb3Bvc2FsJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Byb3Bvc2FsL2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNeVByb3Bvc2FsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSlcclxuICAgICAgICAvLyB0aGlzIGlzIHVzZWQgYnkgb3RoZXIgdXNlcnMgdG8gb3BlbiB0aGUgY3JhdmluZyBwcm9wb3NhbFxyXG4gICAgICAgIC8vIGlmIHRoZSBvd25lciBzZW5kcyB0aGlzIGxpbmsgbWFudWFsbHksIGVtYWlsIHF1ZXJ5c3RyaW5nIGlzIGVtcHR5OyBcclxuICAgICAgICAvLyBpZiB0aGUgb3duZXIgdXNlcyBvdXIgb25saW5lIGZvcm0gdG8gc2VuZCB0byBhIGZyaWVuZCwgdGhlIHF1ZXJ5c3RyaW5nIHNob3VsZCBjb250YWluIHRoZSB2YWx1ZSBmb3IgZWFjaCBlbWFpbCBlbnRlcmVkIGluIHRoZSBib3ggXHJcbiAgICAgICAgLnN0YXRlKCdwcm9wb3NhbC52aWV3Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvdmlldy86a2V5P2VtYWlsJmNvbmZpcm0nLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAcHJvcG9zYWwnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwcm9wb3NhbC92aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdWaWV3UHJvcG9zYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmVzdGF1cmFudCcsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcImFic3RyYWN0XCI6IHRydWUsXHJcbiAgICAgICAgICAgIHVybDogJy9yZXN0YXVyYW50JyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYXlvdXQvc2hlbGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFwcC5zZXR0aW5ncy5wYWdlVGl0bGUgPSAnUmVzdGF1cmFudCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAuc3RhdGUoJ3Jlc3RhdXJhbnQuaG9tZScsIHtcclxuICAgICAgICAgICAgIHVybDogJy86aWQnLFxyXG4gICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAnY29udGVudEByZXN0YXVyYW50Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3Jlc3RhdXJhbnQvaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Jlc3RhdXJhbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KVxyXG4gICAgO1xyXG59OyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYXBwID0ge1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlVGl0bGU6ICdPdXJDcmF2aW5nIC0gd2hlcmUgeW91IGZpbmQgeW91ciBjcmF2aW5ncycsXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbENsYXNzOiAnJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlUGFnZVRpdGxlID0gZnVuY3Rpb24odGl0bGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmFwcC5zZXR0aW5ncy5wYWdlVGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignU2VhcmNoQ3JhdmluZ0NvbnRyb2xsZXInLCBzZWFyY2hDcmF2aW5nQ29udHJvbGxlcik7XHJcblxyXG4gICAgc2VhcmNoQ3JhdmluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnQ3JhdmluZ1NlcnZpY2UnLCAnTmF2aWdhdGlvblNlcnZpY2UnLCAnJHJvb3RTY29wZScsICckc2NvcGUnLCAnZmlsZVNlcnZpY2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hDcmF2aW5nQ29udHJvbGxlcihjcmF2aW5nU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsICRyb290U2NvcGUsICRzY29wZSwgZmlsZVNlcnZpY2UpIHtcclxuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgICB2YXIgaWNvbklkeCA9IDA7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS50aXRsZSA9ICdTZWFyY2ggQ3JhdmluZ3MnO1xyXG4gICAgICAgIHZtLnNlYXJjaFJlc3VsdHMgPSBbXTtcclxuICAgICAgICB2bS5pbnB1dCA9ICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmNyaXRlcmlhO1xyXG4gICAgICAgIHZtLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIHZtLnNlYXJjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmFkZERpc2hJY29ucyA9IFsnYWRkJywgJ3Jlc3RhdXJhbnRfbWVudSddO1xyXG4gICAgICAgIHZtLmFkZERpc2hJY29uID0gdm0uYWRkRGlzaEljb25zW2ljb25JZHhdO1xyXG4gICAgICAgIHZtLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICB2bS5yZXN1bHRUb3RhbCA9IDE7XHJcbiAgICAgICAgdm0uaGFzTW9yZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5nZXREaW5lckltYWdlID0gZ2V0RGluZXJJbWFnZTtcclxuICAgICAgICB2bS5nZXRQcmV2aWV3SW1hZ2UgPSBnZXRQcmV2aWV3SW1hZ2U7XHJcbiAgICAgICAgdm0uZm9ybWF0ZURhdGUgPSBmb3JtYXRlRGF0ZTtcclxuICAgICAgICB2bS5vcGVuRGV0YWlsID0gb3BlbkRldGFpbDtcclxuICAgICAgICB2bS5sb2FkTW9yZSA9IGxvYWRNb3JlO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHZhciBvbGRJbnB1dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICB2bS5wb3NpdGlvbiA9ICRyb290U2NvcGUucG9zaXRpb247XHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdm0ucmVzdWx0VG90YWwgPSAwO1xyXG4gICAgICAgICAgICB2bS5sb2FkZWQgPSAwO1xyXG4gICAgICAgICAgICB2bS5oYXNNb3JlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmlucHV0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLmlucHV0ID09PSB1bmRlZmluZWQgfHwgdm0uaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNlYXJjaFJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZtLmlucHV0ICE9PSBvbGRJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNlYXJjaFJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBwZXJmb3JtU2VhcmNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2V0SWNvbnMoKTtcclxuICAgICAgICAgICAgZml4TWF0ZXJpYWxUZW1wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkTW9yZSgpIHtcclxuICAgICAgICAgICAgaWYgKCF2bS5oYXNNb3JlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRQYWdlKys7XHJcbiAgICAgICAgICAgIHBlcmZvcm1TZWFyY2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBlcmZvcm1TZWFyY2goKSB7XHJcbiAgICAgICAgICAgIHZtLnNlYXJjaGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbSA9IHdpbmRvdy5oZWxwZXIucmVwbGFjZUFsbCh2bS5pbnB1dCwgJysnLCAnLCcpO1xyXG4gICAgICAgICAgICB2bS5zZWFyY2hUZXh0ID0gcGFyYW07XHJcblxyXG4gICAgICAgICAgICB2YXIgY2l0eSA9ICRyb290U2NvcGUucG9zaXRpb24udXNlckxvY2F0aW9uLmNpdHk7XHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9ICRyb290U2NvcGUucG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsgXCIsXCIgKyAkcm9vdFNjb3BlLnBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgIGNyYXZpbmdTZXJ2aWNlLnNlYXJjaENyYXZpbmcocGFyYW0sIGNpdHksIGxvY2F0aW9uLCB2bS5jdXJyZW50UGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLnJlc3VsdFRvdGFsID0gcmVzcG9uc2UuZGF0YS5Ub3RhbDtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNlYXJjaFJlc3VsdHMgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5zZWFyY2hSZXN1bHRzID0gdm0uc2VhcmNoUmVzdWx0cy5jb25jYXQocmVzcG9uc2UuZGF0YS5JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb2xkSW5wdXQgPSB2bS5pbnB1dDtcclxuICAgICAgICAgICAgICAgIHZtLnNlYXJjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0uaGFzTW9yZSA9ICh2bS5zZWFyY2hSZXN1bHRzLmxlbmd0aCA8IHZtLnJlc3VsdFRvdGFsKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zZWFyY2hpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaW5lckltYWdlKGltZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVBdmF0YXJJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFByZXZpZXdJbWFnZSh1cmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVQcmV2aWV3SW1hZ2UodXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5EZXRhaWwoZGlzaCkge1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnZGlzaC5kZXRhaWwnLCB7ICdpZCc6IGRpc2guRGlzaElkIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0ZURhdGUoZCkge1xyXG4gICAgICAgICAgICBpZiAoZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaGVscGVyLmdldFBvc3REYXRlRGVzY3JpcHRpb24oZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0SWNvbnMoKSB7XHJcbiAgICAgICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpY29uSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbklkeCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGljb25JZHggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdm0uYWRkRGlzaEljb24gPSB2bS5hZGREaXNoSWNvbnNbaWNvbklkeF07XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH0sIDUwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWF0ZXJpYWwgaGFzIGEgYnVnIHRoYXQgb25jZSBzZWxlY3RpbmcgbW9yZSB0aGFuIDEgY2hpcCwgYSBtYXNrIGFkZGVkIHRvIHRoZSBwYWdlIGlzIG5vdCByZW1vdmVkLiBcclxuICAgICAgICAvLyBpdCdzIHJlcG9ydGVkIHRvIGdpdGh1YiBhbHJlYWR5LCBidXQgZG9uJ3Qga25vdyB3aG8gaXMgZml4aW5nIGl0LiBub3cgdGhpcyBpcyBhIHRlbXAgZml4IHRvIG1ha2Ugc3VyZSB0aGUgYXBwIHN0aWxsIGZ1bmN0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gZml4TWF0ZXJpYWxUZW1wKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1kLXNjcm9sbC1tYXNrXCIpO1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBhbmd1bGFyLmVsZW1lbnQocmVzdWx0KTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQ3JhdmluZ1RhZ3NDb250cm9sbGVyJywgY3JhdmluZ1RhZ3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBjcmF2aW5nVGFnc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnQ3JhdmluZ1NlcnZpY2UnLCAnTmF2aWdhdGlvblNlcnZpY2UnLCAnJHJvb3RTY29wZScsICckc2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmF2aW5nVGFnc0NvbnRyb2xsZXIoY3JhdmluZ1NlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCAkcm9vdFNjb3BlLCAkc2NvcGUpIHtcclxuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBwYWdlU2l6ZSA9IDIwO1xyXG5cclxuICAgICAgICAvLyBwcm9wZXJ0aWVzIFxyXG4gICAgICAgIHZtLm9mZnNldCA9IDA7XHJcbiAgICAgICAgdm0uYWxsID0gW107XHJcbiAgICAgICAgdm0uY3JhdmluZ3MgPSBbXTtcclxuICAgICAgICB2bS5jcmF2aW5nU3R5bGVzID0gW107XHJcbiAgICAgICAgdm0uaGFzTW9yZSA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGV2ZW50c1xyXG4gICAgICAgIHZtLnNlYXJjaCA9IHNlYXJjaEhhbmRsZXI7XHJcbiAgICAgICAgdm0ubG9hZE1vcmUgPSBsb2FkTW9yZTtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIHZtLnBvc2l0aW9uID0gJHJvb3RTY29wZS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgbG9hZFRyZW5kaW5nRm9yTG9jYXRpb24odm0ucG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsgXCIsXCIgKyB2bS5wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVBhZ2VUaXRsZSgnT3VyQ3JhdmluZyAtIHdoZXJlIHlvdSBmaW5kIHlvdXIgY3JhdmluZ3MnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRUcmVuZGluZ0ZvckxvY2F0aW9uKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGNyYXZpbmdTZXJ2aWNlLmdldFRyZW5kaW5nKGxvY2F0aW9uKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBhcnJheSBjb250YWlucyBzZWFyY2h0aW1lcywgYnV0IG5vdyB3ZSBhcmUgbm90IHVzaW5nIGl0LCBzbyBqdXN0IHRyaW0gdG8gc3RyaW5nIG9ubHlcclxuICAgICAgICAgICAgICAgIHZtLmFsbCA9ICQubWFwKHJlc3BvbnNlLmRhdGEuSXRlbXMsIGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbC5DcmF2aW5nVGFnOyB9KTtcclxuICAgICAgICAgICAgICAgIHZtLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsb2FkTW9yZSgpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jcmF2aW5ncyA9IGdldERlZmF1bHRDcmF2aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgZ2V0UmFuZG9tQ3JhdmluZ1N0eWxlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZE1vcmUoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gdm0ub2Zmc2V0ICsgcGFnZVNpemU7XHJcbiAgICAgICAgICAgIHZtLmNyYXZpbmdzID0gdm0uYWxsLnNsaWNlKDAsIGN1cnJlbnRPZmZzZXQpO1xyXG4gICAgICAgICAgICB2bS5vZmZzZXQgPSBjdXJyZW50T2Zmc2V0O1xyXG4gICAgICAgICAgICB2bS5oYXNNb3JlID0gdm0ub2Zmc2V0IDwgdm0uYWxsLmxlbmd0aDtcclxuICAgICAgICAgICAgZ2V0UmFuZG9tQ3JhdmluZ1N0eWxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgaGVyZSwgaWYgd2UgZmFpbGVkIHRvIHJldHJpZXZlIGZyb20gc2VydmljZVxyXG4gICAgICAgIC8vIGJ1dCBhZ2Fpbiwgd2h5IGJvdGhlciwgd2Ugc2hvdWxkIGZpbmQgYSBkaWZmZXJlbnQgYXBwcm9hY2ggdG8gaGFuZGxlIGVycm9yXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVmYXVsdENyYXZpbmdzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1wiQmVlZlwiLCBcIlBvcmtcIiwgXCJDaGlja2VuXCIsIFwiQ2hlZXNlXCIsIFwiQ2hvY2FsYXRlXCIsIFwiU3dlZXRcIiwgXCJGaXNoXCIsIFwiU2hyaW1wXCIsIFwiUmFtZW5cIiwgXCJCZWVyXCIsIFwiTGFtYlwiLCBcIlBvcmsgQmVsbHlcIixcclxuICAgICAgICAgICAgICAgIFwiQmFjb25cIiwgXCJUYWNvXCIsIFwiQ29mZmVlXCIsIFwiU3BpY3lcIiwgXCJTYW5kd2ljaFwiLCBcIlNvdXBcIiwgXCJOb29kbGVcIiwgXCJOdXRzXCIsIFwiSWNlIENyZWFtXCIsIFwiUGFzdGFcIiwgXCJTZWFmb29kXCIsIFwiVWRvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJEZWVwIEZyeVwiLCBcIkNhbmR5XCIsIFwiQ2FrZVwiLCBcIkRlc3NlcnRcIiwgXCJQaG9cIiwgXCJSaWNlXCIsIFwiU3BhZ2hldHRpXCIsIFwiQmVhblwiLCBcIk1hc2hlZCBQb3RhdG9lc1wiLCBcIlNhbGFtaVwiLCBcIlRvbWF0aWxsb1wiLFxyXG4gICAgICAgICAgICAgICAgXCJMZW1vblwiLCBcIkdyZWVuIFRlYVwiLCBcIkh1bW11c1wiLCBcIkVnZ3BsYW50XCIsIFwiQ2F5ZW5uZSBQZXBwZXJcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRSYW5kb21DcmF2aW5nU3R5bGUoKSB7XHJcbiAgICAgICAgICAgIHZtLmNyYXZpbmdTdHlsZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdm0uY3JhdmluZ3MubGVuZ3RoOyBpZHggKyspIHtcclxuICAgICAgICAgICAgICAgIHZtLmNyYXZpbmdTdHlsZXMucHVzaChzaG91bGRQcmltYXJ5KCkgPyAnbWQtcHJpbWFyeScgOiAnbWQtYWNjZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEhhbmRsZXIoY3JpdGVyaWEpIHtcclxuICAgICAgICAgICAgdmFyIGlkeCA9IGdldENyaXRlcmlhSW5kZXgoY3JpdGVyaWEpO1xyXG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IGlkeCA+PSAwO1xyXG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ3JpdGVyaWEoY3JpdGVyaWEsIGlkeCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhZGRDcml0ZXJpYShjcml0ZXJpYSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBlcmZvcm1TZWFyY2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUNyaXRlcmlhKGNyaXRlcmlhLCBpZHgpIHtcclxuICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENyaXRlcmlhID0gJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY3JpdGVyaWE7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q3JpdGVyaWEgPSBjdXJyZW50Q3JpdGVyaWEucmVwbGFjZShjcml0ZXJpYSArIFwiK1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDcml0ZXJpYSA9IGN1cnJlbnRDcml0ZXJpYS5yZXBsYWNlKFwiK1wiICsgY3JpdGVyaWEsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENyaXRlcmlhID0gY3VycmVudENyaXRlcmlhLnJlcGxhY2UoY3JpdGVyaWEsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY3JpdGVyaWEgPSBjdXJyZW50Q3JpdGVyaWE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZENyaXRlcmlhKGNyaXRlcmlhKSB7XHJcbiAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYSAmJiAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYSA9ICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmNyaXRlcmlhICsgXCIrXCIgKyBjcml0ZXJpYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYSA9IGNyaXRlcmlhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWFJbmRleChjcml0ZXJpYSkge1xyXG4gICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY3JpdGVyaWEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q3JpdGVyaWEgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYTtcclxuICAgICAgICAgICAgICAgIHZhciBpZHggPSBjdXJyZW50Q3JpdGVyaWEuaW5kZXhPZihjcml0ZXJpYSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwZXJmb3JtU2VhcmNoKCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudENyaXRlcmlhID0gJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY3JpdGVyaWE7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q3JpdGVyaWEubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UuZ28oJ2FwcC5ob21lJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW0gPSBidWlsZENyaXRlcmlhKGN1cnJlbnRDcml0ZXJpYSk7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnYXBwLmhvbWUuc2VhcmNoJywgeyAnY3JpdGVyaWEnOiBwYXJhbSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYnVpbGRDcml0ZXJpYShjdXJyZW50Q3JpdGVyaWEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRDcml0ZXJpYTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3VsZFByaW1hcnkoKSB7XHJcbiAgICAgICAgICAgIHZhciBzaG91bGQgPSB3aW5kb3cuaGVscGVyLnJhbmRvbUludCgyMCkgPT09IDEwO1xyXG4gICAgICAgICAgICByZXR1cm4gc2hvdWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignRGlzaEZpZWxkRWRpdENvbnRyb2xsZXInLCBkaXNoRmllbGRFZGl0Q29udHJvbGxlcik7XHJcblxyXG4gICAgZGlzaEZpZWxkRWRpdENvbnRyb2xsZXIuJGluamVjdCA9IFtcclxuICAgICAgICAnR2VvU2VydmljZScsICdSZXN0YXVyYW50U2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnUmVmZXJlbmNlRGF0YVNlcnZpY2UnLFxyXG4gICAgICAgICdSZXN1bWVTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJywgJ0NyYXZpbmdTZXJ2aWNlJyxcclxuICAgICAgICAnbG9hZGVyJywgJ3VwbG9hZFVybCcsXHJcbiAgICAgICAgJ01vZGFsU2VydmljZScsXHJcbiAgICAgICAgJyR0aW1lb3V0JywgJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRodHRwJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzaEZpZWxkRWRpdENvbnRyb2xsZXIoXHJcbiAgICAgICAgZ2VvU2VydmljZSwgcmVzdFNlcnZpY2UsIGRpbmVyU2VydmljZSwgcmVmU2VydmljZSxcclxuICAgICAgICByZXN1bWVTZXJ2aWNlLCBhdXRoU2VydmljZSwgY3JhdmluZ1NlcnZpY2UsXHJcbiAgICAgICAgZGlzaExvYWRlciwgdXBsb2FkVXJsLFxyXG4gICAgICAgIG1vZGFsU2VydmljZSxcclxuICAgICAgICAkdGltZW91dCwgJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCkge1xyXG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy8gcHJvcGVydGllcyBcclxuICAgICAgICB2bS5kaXNoID0gZGlzaExvYWRlci5jdXJyZW50O1xyXG4gICAgICAgIHZtLmRpc2gucmVzdGF1cmFudCA9IHt9O1xyXG4gICAgICAgIHZtLmRpc2guc2VsZWN0ZWRDcmF2aW5ncyA9IFtdO1xyXG4gICAgICAgIHZtLmRpc2gucmF0aW5nID0gMDtcclxuICAgICAgICB2bS5kaXNoLnVwbG9hZEltYWdlID0gJyc7XHJcblxyXG4gICAgICAgIHZtLm92ZXJTdGFyID0gZmFsc2U7XHJcbiAgICAgICAgdm0uc2hvd1Jldmlld0JveCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0uaW52YWxpZCA9IHt9O1xyXG4gICAgICAgIHZtLmludmFsaWQuY2l0eSA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmludmFsaWQuZGlzaG5hbWUgPSBmYWxzZTtcclxuICAgICAgICB2bS5zaG93QWRkRGlzaCA9IHRydWU7XHJcbiAgICAgICAgdm0uaXNCdXN5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0uZmlsZUludmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdm0ubWF4UmF0aW5nID0gNTtcclxuICAgICAgICB2bS5yYXRpbmdMYWJlbCA9IFwiXCI7XHJcbiAgICAgICAgdm0ucGVyY2VudCA9IDA7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50c1xyXG4gICAgICAgIHZtLm1hdGNoRGlzaCA9IG1hdGNoRGlzaDtcclxuICAgICAgICB2bS5ob3ZlcmluZ092ZXIgPSBob3ZlcmluZ092ZXI7XHJcbiAgICAgICAgdm0uaG92ZXJpbmdMZWF2ZSA9IGhvdmVyaW5nTGVhdmU7XHJcbiAgICAgICAgdm0ucmVzZXRVcGxvYWQgPSByZXNldFVwbG9hZDtcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXRIYW5kbGVyO1xyXG4gICAgICAgIHZtLnJlc2V0QWRkRGlzaCA9IHJlc2V0QWRkRGlzaDtcclxuICAgICAgICB2bS5vcGVuTWFwID0gb3Blbk1hcDtcclxuICAgICAgICB2bS5vbkZpbGVSZWFkID0gb25GaWxlUmVhZDtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgc2V0VXNlckxvY2F0aW9uKCRyb290U2NvcGUucG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XHJcbiAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZywgaXQgd2lsbCBjb21lIGJhY2sgdG8gdGhpcyBwYWdlIGFmdGVyIGxvZ2dpbmcgaW5cclxuICAgICAgICAgICAgICAgIH0sIFwiTXVzdCBsb2dpbiB0byBhZGQgYSBuZXcgZGlzaFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVBhZ2VUaXRsZSgnT3VyQ3JhdmluZyAtIHN1Z2dlc3QgYSBuZXcgZGlzaCcpO1xyXG4gICAgICAgICAgICBkaXNoTG9hZGVyLmFkZExvYWRlZEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKHJlc3REYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGlzaC5yZXN0YXVyYW50Lm5hbWUgPSByZXN0RGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kaXNoLnJlc3RhdXJhbnQuYWRkcmVzcyA9IHJlc3REYXRhLmFkZHJlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc2gucmVzdGF1cmFudC5wb3N0YWxDb2RlID0gcmVzdERhdGEucG9zdGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc2gucmVzdGF1cmFudC5waG9uZU51bWJlciA9IHJlc3REYXRhLnRlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGlzaC5yZXN0YXVyYW50LmxhdGl0dWRlID0gcmVzdERhdGEubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc2gucmVzdGF1cmFudC5sb25naXR1ZGUgPSByZXN0RGF0YS5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc2gucmVzdGF1cmFudC5wbGFjZUlkID0gcmVzdERhdGEuZmFjdHVhbF9pZDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kaXNoLnJlc3RhdXJhbnQuTmFtZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5pdGlhbGl6ZVNlbGVjdGVkQ3JhdmluZ3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS50b2dnbGVTaWRlbmF2KFwibGVmdFwiKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjbGVmdFwiKS50cmlnZ2VyKCdzaWRlbmF2LicgKyAobW9kYWxTZXJ2aWNlLmlzU2lkZW5hdk9wZW4oXCJsZWZ0XCIpID09PSB0cnVlID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uRmlsZVJlYWQoZmlsZSwgY29udGVudCkge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5zaXplID4gNTAwMDAwMCkge1xyXG4gICAgICAgICAgICAgICAgdm0uZmlsZUludmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0uZmlsZUludmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzZXRVcGxvYWQoKSB7XHJcbiAgICAgICAgICAgIHZtLmRpc2gudXBsb2FkSW1hZ2UgPSAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hdGNoRGlzaChxdWVyeSkge1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXJ5IHx8ICF2bS51c2VyTG9jYXRpb24pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZSBzZXJ2ZXIgaGFzIGEgIGNvbnN0cmFpbnQgdGhhdCBpdCBvbmx5IHNlYXJjaGVzIGlmIHRoZSBnaXZlbiBuYW1lIGhhcyA1IG9yIG1vcmUgY2hhcmFjdGVycyBcclxuICAgICAgICAgICAgaWYgKHF1ZXJ5Lmxlbmd0aCA8PSA1KSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICByZXN0U2VydmljZS5tYXRjaERpc2gocXVlcnkpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXRjaGluZ0Rpc2hlcyA9IHJlc3BvbnNlLmRhdGEuSXRlbXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhvdmVyaW5nT3Zlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICB2bS5vdmVyU3RhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2bS5wZXJjZW50ID0gMTAwICogKHZhbHVlIC8gdm0ubWF4UmF0aW5nKTtcclxuICAgICAgICAgICAgYnVpbGRSYXRpbmdMYWJlbCh2YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaG92ZXJpbmdMZWF2ZSgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm92ZXJTdGFyICE9PSB2bS5yYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHZtLnBlcmNlbnQgPSAxMDAgKiAodm0uZGlzaC5yYXRpbmcgLyB2bS5tYXhSYXRpbmcpO1xyXG4gICAgICAgICAgICAgICAgYnVpbGRSYXRpbmdMYWJlbCh2bS5kaXNoLnJhdGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLm92ZXJTdGFyID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd2bS5kaXNoLnJhdGluZycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmRpc2gucmF0aW5nID4gMClcclxuICAgICAgICAgICAgICAgIHZtLnNob3dSZXZpZXdCb3ggPSB0cnVlO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB2bS5zaG93UmV2aWV3Qm94ID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdEhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZGlzaEZvcm0uJHZhbGlkICE9PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAodm0uZmlsZUludmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIkltYWdlIHNpemUgaXMgdG9vIGJpZy4uLiBtdXN0IGJlIGxlc3MgdGhhbiA1IE1CLlwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGRpbmVyU2VydmljZS5nZXRNeVByb2ZpbGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXN0U2VydmljZS5hZGREaXNoKHZtLmRpc2gsIGRpbmVyU2VydmljZS5wcm9maWxlLCB2bS51c2VyTG9jYXRpb24pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd0FkZERpc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzaElkID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pc0J1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShkaXNoSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkSW1hZ2UoaWQpIHtcclxuICAgICAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodm0uZGlzaC51cGxvYWRJbWFnZSAmJiB2bS5kaXNoLnVwbG9hZEltYWdlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IHZtLmRpc2gudXBsb2FkSW1hZ2U7XHJcbiAgICAgICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gd2UgdXBsb2FkLCBkb24ndCBzcGVjaWZ5IHRoZSBwYXRoLCB0aGUgdXBsb2FkZXIgd2lsbCBmaWd1cmUgaXQgb3V0IGJ5IFwidHlwZVwiXHJcbiAgICAgICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgICAgICBmZC5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuICAgICAgICAgICAgICAgIGZkLmFwcGVuZCgnaWQnLCBpZCk7XHJcbiAgICAgICAgICAgICAgICBmZC5hcHBlbmQoJ2RpbmVySWQnLCBkaW5lclNlcnZpY2UucHJvZmlsZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCh1cGxvYWRVcmwsIGZkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkIH1cclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVJbWFnZShkYXRhLCBpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byB1cGxvYWQgcGhvdG9zIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSB2bS5tZXNzYWdlICsgXCJZb3UgY2Fubm90IGFkZCBpbWFnZSBhZ2FpbiBmcm9tIGhlcmUuIEhvd2V2ZXIsIHlvdSBjYW4gZmluZCB0aGlzIGRpc2ggeW91IGp1c3QgYWRkZWQgYW5kIGFkZCB0aGUgaW1hZ2UgYWdhaW4gZnJvbSB0aGVyZS5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXVzdCBkaXNhYmxlIHRoZSBzYXZlIGJ1dHRvbiBldmVuIHVwbG9hZGluZyBpbWFnZSBmYWlscyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzZXRBZGREaXNoKCkge1xyXG4gICAgICAgICAgICAvLyBkb24ndCByZXNldCB2bS53aXphcmQudXNlcmxvY2F0aW9uXHJcbiAgICAgICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XHJcbiAgICAgICAgICAgICAgICB2bS5zaG93QWRkRGlzaCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0uZGlzaC5yYXRpbmcgPSAwO1xyXG4gICAgICAgICAgICAgICAgdm0uZGlzaC5yZXZpZXcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdm0uZGlzaC5zZWxlY3RlZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNoLnJlc3RhdXJhbnQgPSB7fTtcclxuICAgICAgICAgICAgICAgIHZtLmRpc2gubmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNoLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZtLmRpc2guc2VsZWN0ZWRDcmF2aW5ncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdm0uc3RlcCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNoLnVwbG9hZEltYWdlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyRyb290U2NvcGUuJHN0YXRlLmdvKFwiZGlzaC5hZGRcIiwge30sIHsgcmVsb2FkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkUmF0aW5nTGFiZWwodmFsdWUpIHtcclxuICAgICAgICAgICAgdm0ucmF0aW5nTGFiZWwgPSB3aW5kb3cuaGVscGVyLmJ1aWxkUmF0aW5nTGFiZWwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0VXNlckxvY2F0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJMb2NhdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICB2bS51c2VyTG9jYXRpb24uY2l0eSA9IHBvc2l0aW9uLnVzZXJMb2NhdGlvbi5jaXR5O1xyXG4gICAgICAgICAgICB2bS51c2VyTG9jYXRpb24ucmVnaW9uID0gcG9zaXRpb24udXNlckxvY2F0aW9uLnJlZ2lvbjtcclxuICAgICAgICAgICAgdm0udXNlckxvY2F0aW9uLmNvdW50cnkgPSBwb3NpdGlvbi51c2VyTG9jYXRpb24uY291bnRyeTtcclxuICAgICAgICAgICAgdm0udXNlckxvY2F0aW9uLmxvY2F0aW9uID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsgXCIsXCIgKyBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNlbGVjdGVkQ3JhdmluZ3MoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9ICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmlucHV0O1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXQuc3BsaXQpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0ID0gd2luZG93LmhlbHBlci5yZXBsYWNlQWxsKGlucHV0LCAnKycsICcsJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgcmVmU2VydmljZS5nZXREYXRhKFwiY3JhdmluZ3R5cGVcIikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3JhdmluZ3MgPSByZXNwb25zZS5JdGVtcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLk5hbWUgPiBiLk5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGlucHV0QXJyLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjcmF2aW5ncy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyYXZpbmdzW2pdLk5hbWUgPT09IGlucHV0QXJyW2lkeF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHsgQ3JhdmluZ0lkOiBjcmF2aW5nc1tqXS5JZCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2bS5kaXNoLnNlbGVjdGVkQ3JhdmluZ3MgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZUltYWdlKGZpbGVuYW1lLCBkaXNoSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNyYXZpbmdTZXJ2aWNlLmFkZEZpbGUoZGlzaElkLCBmaWxlbmFtZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgdG8gZG8gYW55dGhpbmdcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byB1cGRhdGUgY3JhdmluZ3MgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyB0aGlzIGNvbnRyb2xsZXIgaXMgdXNlZCBpbiBhIG1vZGFsIHdpbmRvdyBmb3IgdXBsb2FkaW5nIGEgbmV3IGltYWdlIHRvIGFuIGV4aXN0aW5nIGRpc2hcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdEaXNoQWRkSW1hZ2VDb250cm9sbGVyJywgZGlzaEFkZEltYWdlQ29udHJvbGxlcik7XHJcblxyXG4gICAgZGlzaEFkZEltYWdlQ29udHJvbGxlci4kaW5qZWN0ID0gWydNb2RhbFNlcnZpY2UnLCAnJGh0dHAnLCAndXBsb2FkVXJsJywgJ21vZGFsSXRlbScsICdEaW5lclNlcnZpY2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBkaXNoQWRkSW1hZ2VDb250cm9sbGVyKG1vZGFsU2VydmljZSwgJGh0dHAsIHVwbG9hZFVybCwgbW9kYWxJdGVtLCBkaW5lclNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnVwbG9hZEltYWdlID0gJyc7XHJcbiAgICAgICAgdm0uZGlzaCA9IG1vZGFsSXRlbS5EaXNoO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLm9uRmlsZVJlYWQgPSBvbkZpbGVSZWFkO1xyXG5cclxuICAgICAgICB2bS5yZXNldFVwbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0udXBsb2FkSW1hZ2UgPSAnJztcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLnVwbG9hZEltYWdlICYmIHZtLnVwbG9hZEltYWdlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZSh2bS5kaXNoLkRpc2hJZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJObyBpbWFnZSBpcyBzZWxlY3RlZCB0byB1cGxvYWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uRmlsZVJlYWQoZmlsZSwgY29udGVudCkge1xyXG4gICAgICAgICAgICBndWFyZEltYWdlKGZpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkSW1hZ2UoaWQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBmaWxlID0gdm0udXBsb2FkSW1hZ2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWd1YXJkSW1hZ2UoZmlsZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyB3aGVuIHdlIHVwbG9hZCwgZG9uJ3Qgc3BlY2lmeSB0aGUgcGF0aCwgdGhlIHVwbG9hZGVyIHdpbGwgZmlndXJlIGl0IG91dCBieSBcInR5cGVcIlxyXG4gICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGZkLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG4gICAgICAgICAgICBmZC5hcHBlbmQoJ2lkJywgaWQpO1xyXG4gICAgICAgICAgICBmZC5hcHBlbmQoJ2RpbmVySWQnLCBkaW5lclNlcnZpY2UucHJvZmlsZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KHVwbG9hZFVybCwgZmQsIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkIH1cclxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2VydmljZS5zdWJtaXRNb2RhbChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHVwbG9hZCBwaG90b3MgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ3VhcmRJbWFnZShmaWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlLnNpemUgPiA1MDAwMDAwKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5maWxlSW52YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5maWxlSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0uZmlsZUludmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIkltYWdlIHNpemUgaXMgdG9vIGJpZy4uLiBtdXN0IGJlIGxlc3MgdGhhbiA1IE1CLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gIXZtLmZpbGVJbnZhbGlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyB0aGlzIGNvbnRyb2xsZXIgaXMgdXNlZCBpbiBhIG1vZGFsIHdpbmRvdyBmb3IgYWRkaW5nIGNyYXZpbmcgdGFncyB0byBhbiBleGlzdGluZyBkaXNoXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignRGlzaEFkZFRhZ3NDb250cm9sbGVyJywgZGlzaEFkZFRhZ3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBkaXNoQWRkVGFnc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnTW9kYWxTZXJ2aWNlJywgJ21vZGFsSXRlbSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRpc2hBZGRUYWdzQ29udHJvbGxlcihtb2RhbFNlcnZpY2UsIG1vZGFsSXRlbSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGlzaCA9IG1vZGFsSXRlbS5EaXNoO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkQ3JhdmluZ3MgPSB2bS5kaXNoLkNyYXZpbmdzLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5DcmF2aW5nSWQ7IH0pO1xyXG5cclxuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJDYW5ub3QgcmVtb3ZlIGFsbCBjcmF2aW5nIHRhZ3MsIHVubGVzcyB5b3UgYXJlIGFuIGFkbWluaXN0cmF0b3JcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1vZGFsU2VydmljZS5zdWJtaXRNb2RhbChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignRGlzaERldGFpbENvbnRyb2xsZXInLCBkaXNoRGV0YWlsQ29udHJvbGxlcik7XHJcblxyXG4gICAgZGlzaERldGFpbENvbnRyb2xsZXIuJGluamVjdCA9IFsncmVzdGF1cmFudExvYWRlcicsICdBdXRoU2VydmljZScsICdDcmF2aW5nU2VydmljZScsICdQcm9wb3NhbFNlcnZpY2UnLCAnUmVzdW1lU2VydmljZScsXHJcbiAgICAgICAgJ05hdmlnYXRpb25TZXJ2aWNlJywgJ01vZGFsU2VydmljZScsICdGYWN0dWFsU2VydmljZScsICdSZWNlbnREaXNoU2VydmljZScsICdBZG1pblNlcnZpY2UnLCAnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJHEnLCAnZmlsZVNlcnZpY2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBkaXNoRGV0YWlsQ29udHJvbGxlcihyZXN0YXVyYW50TG9hZGVyLCBhdXRoU2VydmljZSwgY3JhdmluZ1NlcnZpY2UsIHByb3Bvc2FsU2VydmljZSwgcmVzdW1lU2VydmljZSxcclxuICAgICAgICBuYXZpZ2F0aW9uU2VydmljZSwgbW9kYWxTZXJ2aWNlLCBmYWN0dWFsU2VydmljZSwgcmVjZW50RGlzaFNlcnZpY2UsIGFkbWluU2VydmljZSwgJHJvb3RTY29wZSwgJHNjb3BlLCAkcSwgZmlsZVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5kaXNoID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB2bS5oYXNEZXNjcmlwdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnNob3dEZXNjcmlwdGlvbkVkaXRvciA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnVwZGF0aW5nRGVzY3JpcHRpb24gPSBcIlwiO1xyXG5cclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdm0ubXlSYXRpbmcgPSAwO1xyXG4gICAgICAgIHZtLm15UmV2aWV3ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLm15UmV2aWV3SWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0uaGFzTXlSZXZpZXcgPSBmYWxzZTtcclxuICAgICAgICB2bS5teVJldmlld0lzQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnJldmlld3MgPSBbXTtcclxuICAgICAgICB2bS50b3RhbFJldmlld3MgPSAwO1xyXG5cclxuICAgICAgICB2bS5udW1iZXJPZkNyYXZpbmdEaW5lcnMgPSAwO1xyXG4gICAgICAgIHZtLmlzTXlGYXZvcml0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZtLm15T3JpZ2luYWxSYXRpbmcgPSAwO1xyXG4gICAgICAgIHZtLm92ZXJTdGFyID0gZmFsc2U7XHJcbiAgICAgICAgdm0ubWF4UmF0aW5nID0gNTtcclxuICAgICAgICB2bS5wZXJjZW50ID0gMDtcclxuICAgICAgICB2bS5maXJzdFRpbWVWb3RlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdm0ucmVzdGF1cmFudHMgPSBbXTtcclxuICAgICAgICB2bS5wcm9wb3NhbHMgPSBbXTtcclxuICAgICAgICB2bS5yZWNlbnRQcm9wb3NhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0ub3BlbkRpbmVyID0gb3BlbkRpbmVyO1xyXG4gICAgICAgIHZtLm9wZW5NYXAgPSBvcGVuTWFwO1xyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG4gICAgICAgIHZtLmdldERpc2hJbWFnZVNyYyA9IGdldERpc2hJbWFnZVNyYztcclxuICAgICAgICB2bS5ob3ZlcmluZ0xlYXZlID0gaG92ZXJpbmdMZWF2ZTtcclxuICAgICAgICB2bS5ob3ZlcmluZ092ZXIgPSBob3ZlcmluZ092ZXI7XHJcbiAgICAgICAgdm0uYWRkQ3JhdmluZ1RhZ3MgPSBhZGRDcmF2aW5nVGFncztcclxuICAgICAgICB2bS5vcGVuSW1hZ2UgPSBvcGVuSW1hZ2U7XHJcbiAgICAgICAgdm0uYWRkRmlsZSA9IGFkZEZpbGU7XHJcbiAgICAgICAgdm0uc2F2ZURlc2NyaXB0aW9uID0gc2F2ZURlc2NyaXB0aW9uO1xyXG4gICAgICAgIHZtLnNhdmVNeVJldmlldyA9IHNhdmVNeVJldmlldztcclxuICAgICAgICB2bS5nZXRSZXZpZXdQb3N0RGF0ZSA9IGdldFJldmlld1Bvc3REYXRlO1xyXG5cclxuICAgICAgICB2bS5nZXRQcm9wb3NhbE5hbWUgPSBnZXRQcm9wb3NhbE5hbWU7XHJcbiAgICAgICAgdm0uYWRkVG9Qcm9wb3NhbCA9IGFkZFRvUHJvcG9zYWw7XHJcbiAgICAgICAgdm0uYWRkVG9OZXdQcm9wb3NhbCA9IGFkZFRvTmV3UHJvcG9zYWw7XHJcbiAgICAgICAgdm0ucmVtb3ZlRGlzaCA9IHJlbW92ZURpc2g7XHJcbiAgICAgICAgdm0uY3JhdmVGb3JJdCA9IGNyYXZlRm9ySXQ7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpemVcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldERpbmVySW1hZ2UoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVNlcnZpY2UuZ2V0U2FmZUF2YXRhckltYWdlKGltZ05hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGlzaEltYWdlU3JjKGltZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVQcmV2aWV3SW1hZ2UoaW1nTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuRGluZXIoZGluZXJJZCwgZXYpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLm9wZW5Nb2RhbCgndXNlci9kaW5lci5odG1sJywgJ0RpbmVyRGV0YWlsQ29udHJvbGxlcicsIHsgJ2RpbmVySWQnOiBkaW5lcklkIH0sIGV2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5NYXAoKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS50b2dnbGVTaWRlbmF2KFwibGVmdFwiKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjbGVmdFwiKS50cmlnZ2VyKCdzaWRlbmF2LicgKyAobW9kYWxTZXJ2aWNlLmlzU2lkZW5hdk9wZW4oXCJsZWZ0XCIpID09PSB0cnVlID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhvdmVyaW5nT3Zlcih2YWx1ZSkge1xyXG4gICAgICAgICAgICB2bS5vdmVyU3RhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2bS5wZXJjZW50ID0gMTAwICogKHZhbHVlIC8gdm0ubWF4UmF0aW5nKTtcclxuICAgICAgICAgICAgdm0ucmF0aW5nTGFiZWwgPSB3aW5kb3cuaGVscGVyLmJ1aWxkUmF0aW5nTGFiZWwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaG92ZXJpbmdMZWF2ZSgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm92ZXJTdGFyICE9PSB2bS5teVJhdGluZykge1xyXG4gICAgICAgICAgICAgICAgdm0ucGVyY2VudCA9IDEwMCAqICh2bS5teVJhdGluZyAvIHZtLm1heFJhdGluZyk7XHJcbiAgICAgICAgICAgICAgICB2bS5yYXRpbmdMYWJlbCA9IHdpbmRvdy5oZWxwZXIuYnVpbGRSYXRpbmdMYWJlbCh2bS5teVJhdGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLm92ZXJTdGFyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLm15UmF0aW5nJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5teVJldmlld0lzQ2hhbmdlZCA9ICh2bS5teVJhdGluZyAhPT0gdm0ubXlPcmlnaW5hbFJhdGluZyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5JbWFnZShmaWxlTmFtZSwgZXYpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLm9wZW5Nb2RhbCgnbGF5b3V0L2ltYWdlX21vZGFsLmh0bWwnLCAnSW1hZ2VNb2RhbENvbnRyb2xsZXInLCB7ICdOYW1lJzogdm0uZGlzaC5OYW1lLCAnRmlsZU5hbWUnOiBmaWxlTmFtZSB9LCBldik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRGaWxlKGV2KSB7XHJcbiAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZywgaXQgd2lsbCBjb21lIGJhY2sgdG8gdGhpcyBwYWdlIGFmdGVyIGxvZ2dpbmcgaW5cclxuICAgICAgICAgICAgICAgIH0sIFwiWW91IG5lZWQgdG8gbG9nIGluIGZpcnN0IGJlZm9yZSBhZGRpbmcgbmV3IGltYWdlIHRvIHRoaXMgZGlzaC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5vcGVuTW9kYWwoJ2Rpc2gvYWRkLWltYWdlLW1vZGFsLmh0bWwnLCAnRGlzaEFkZEltYWdlQ29udHJvbGxlcicsIHsgRGlzaDogdm0uZGlzaCB9LCBldikudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YSAhPT0gJ2NhbmNlbCcgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdW1lU2VydmljZS5mbHVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuY3JlYXRlUmVzdW1lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHByZXBhcmVBZGRJbWFnZShkYXRhKTsgfSwgXCJZb3UgbmVlZCB0byBsb2cgaW4gZmlyc3QgYmVmb3JlIGFkZGluZyBuZXcgaW1hZ2UgdG8gdGhpcyBkaXNoLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRDcmF2aW5nVGFncyhldikge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uub3Blbk1vZGFsKCdkaXNoL2FkZC10YWctbW9kYWwuaHRtbCcsICdEaXNoQWRkVGFnc0NvbnRyb2xsZXInLCB7IERpc2g6IHZtLmRpc2ggfSwgZXYpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEgIT09ICdjYW5jZWwnICYmIGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7IHJldHVybiBwcmVwYXJlVXBkYXRpbmdDcmF2aW5ncyhkYXRhKTsgfSwgXCJZb3UgbmVlZCB0byBsb2cgaW4gZmlyc3QgYmVmb3JlIGFkZGluZyBuZXcgY3JhdmluZyB0YWdzIHRvIHRoaXMgZGlzaC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZURlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuY3JlYXRlUmVzdW1lKHByZXBhcmVTYXZlRGVzY3JpcHRpb24sIFwiWW91IG5lZWQgdG8gbG9nIGluIGZpcnN0IGJlZm9yZSBzYXZpbmcgYSBuZXcgZGVzY3JpcHRpb24uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZU15UmV2aWV3KCkge1xyXG4gICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuY3JlYXRlUmVzdW1lKHByZXBhcmVTYXZlTXlSZXZpZXcsIFwiWW91IG5lZWQgdG8gbG9nIGluIGZpcnN0IGJlZm9yZSBzYXZpbmcgeW91ciByZXN2aWV3LiBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRSZXZpZXdQb3N0RGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKSByZXR1cm4gd2luZG93LmhlbHBlci5nZXRQb3N0RGF0ZURlc2NyaXB0aW9uKGQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9wb3NhbE5hbWUocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gXCJVbm5hbWVkXCI7XHJcbiAgICAgICAgICAgIGlmIChwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEocHJvcG9zYWwuTmFtZSA9PT0gbnVsbCB8fCBwcm9wb3NhbC5OYW1lID09PSB1bmRlZmluZWQgfHwgcHJvcG9zYWwuTmFtZSA9PT0gXCJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBwcm9wb3NhbC5OYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvUHJvcG9zYWwocHJvcG9zYWwsICRldmVudCkge1xyXG4gICAgICAgICAgICBpZiAoIXByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRUb05ld1Byb3Bvc2FsKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuZmx1c2goKTtcclxuICAgICAgICAgICAgcmVzdW1lU2VydmljZS5jcmVhdGVSZXN1bWUoZnVuY3Rpb24gKCkgeyByZXR1cm4gcHJlcGFyZUFkZERpc2hUb1Byb3Bvc2FsKHByb3Bvc2FsLCAkZXZlbnQpOyB9LCBcIllvdSBuZWVkIHRvIGxvZyBpbiBmaXJzdCBiZWZvcmUgdXNpbmcgdGhlIGNyYXZpbmcgcHJvcG9zYWwuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkVG9OZXdQcm9wb3NhbChldikge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uub3Blbk1vZGFsKCdwcm9wb3NhbC9uZXdfcHJvcG9zYWxfbW9kYWwuaHRtbCcsICdQcm9wb3NhbE1vZGFsQ29udHJvbGxlcicsIHsgRGlzaDogdm0uZGlzaCB9LCBldikudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhICE9PSAnY2FuY2VsJyAmJiBkYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZVNlcnZpY2UuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7IHJldHVybiBwcmVwYXJlQWRkRGlzaFRvTmV3UHJvcG9zYWwobmFtZSk7IH0sIFwiWW91IG5lZWQgdG8gbG9nIGluIGZpcnN0IGJlZm9yZSB1c2luZyB0aGUgY3JhdmluZyBwcm9wb3NhbC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JhdmVGb3JJdCgpIHtcclxuICAgICAgICAgICAgcmVzdW1lU2VydmljZS5mbHVzaCgpO1xyXG4gICAgICAgICAgICByZXN1bWVTZXJ2aWNlLmNyZWF0ZVJlc3VtZShmdW5jdGlvbiAoKSB7IHJldHVybiBwcmVwYXJlQ3JhdmVGb3JJdCgpOyB9LCBcIllvdSBuZWVkIHRvIGxvZyBpbiBmaXJzdCBiZWZvcmUgYWRkaW5nIGEgZGlzaCB0byB5b3VyIGZhdm9yaXRlIGxpc3QuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaGVscGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICB2bS5kaXNoSWQgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5kaXNoSWQpIHtcclxuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgY3JhdmluZ1NlcnZpY2UuZ2V0RGlzaCh2bS5kaXNoSWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZGlzaCA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaGFzRGVzY3JpcHRpb24gPSB2bS5kaXNoLkRlc2NyaXB0aW9uICE9PSBudWxsICYmIHZtLmRpc2guRGVzY3JpcHRpb24gIT09IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXBkYXRpbmdEZXNjcmlwdGlvbiA9IHZtLmRpc2guRGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZEFkZGl0aW9uYWxEYXRhKHZtLmRpc2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlUGFnZVRpdGxlKHZtLmRpc2guTmFtZSArIFwiIEAgXCIgKyB2bS5kaXNoLlJlc3RhdXJhbnROYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRGlzaCBpcyBub3QgZm91bmQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJGYWlsZWQgdG8gcmV0cmlldmUgZGlzaCBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdvblJlcGVhdExhc3QnLCBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmdyaWQtdGlsZXNcIikuZnJlZXRpbGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudERlbGF5OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogXCIuZ3JpZC1pdGVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZEFkZGl0aW9uYWxEYXRhKGRpc2gpIHtcclxuICAgICAgICAgICAgcmVjZW50RGlzaFNlcnZpY2UuYWRkVG9SZWNlbnQoZGlzaCk7XHJcbiAgICAgICAgICAgIGxvYWRDcmF2aW5nRGluZXJzKCk7XHJcbiAgICAgICAgICAgIGxvYWRSZXZpZXdzKCk7XHJcbiAgICAgICAgICAgIGxvYWRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICBsb2FkUmVzdGF1cmFudEluZm8oZGlzaCk7XHJcbiAgICAgICAgICAgIGxvYWRQcm9wb3NhbHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQcm9wb3NhbHMoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlY2VudFByb3Bvc2FsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuZ2V0QnlEaW5lcihhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5kaW5lcklkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGwgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnByb3Bvc2FscyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFsbC5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxbaWR4XS5Jc0V4cGlyZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb3Bvc2Fscy5wdXNoKGFsbFtpZHhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnByb3Bvc2Fscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnJlY2VudFByb3Bvc2FsID0gdm0ucHJvcG9zYWxzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkQ3JhdmluZ0RpbmVycygpIHtcclxuICAgICAgICAgICAgY3JhdmluZ1NlcnZpY2UuZ2V0Q3JhdmluZ0RpbmVycyh2bS5kaXNoSWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jcmF2aW5nRGluZXJzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIHZtLm51bWJlck9mQ3JhdmluZ0RpbmVycyA9IHZtLmNyYXZpbmdEaW5lcnMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZtLmNyYXZpbmdEaW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uY3JhdmluZ0RpbmVyc1tpXS5EaW5lcklkID09PSBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5kaW5lcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzTXlGYXZvcml0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUmV2aWV3cygpIHtcclxuICAgICAgICAgICAgY3JhdmluZ1NlcnZpY2UuZ2V0RGlzaFJldmlldyh2bS5kaXNoSWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZGF0YS5JdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0LCB0YWtlIHRoZSBhdmVyYWdlIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15UmV2aWV3SWR4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcmVzcG9uc2UuZGF0YS5JdGVtcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHJlc3BvbnNlLmRhdGEuSXRlbXNbaWR4XS5SYXRpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoICYmIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmRpbmVySWQgPT09IHJlc3BvbnNlLmRhdGEuSXRlbXNbaWR4XS5SZXZpZXdlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5teVJhdGluZyA9IHJlc3BvbnNlLmRhdGEuSXRlbXNbaWR4XS5SYXRpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5teU9yaWdpbmFsUmF0aW5nID0gdm0ubXlSYXRpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5teVJldmlldyA9IHJlc3BvbnNlLmRhdGEuSXRlbXNbaWR4XS5SZXZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5teVJldmlld0lkID0gcmVzcG9uc2UuZGF0YS5JdGVtc1tpZHhdLlJldmlld0lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZmlyc3RUaW1lVm90ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlSZXZpZXdJZHggPSBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5oYXNNeVJldmlldyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmF2ZXJhZ2VSYXRpbmcgPSB0b3RhbCAvIHJlc3BvbnNlLmRhdGEuSXRlbXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnRvdGFsUmV2aWV3cyA9IHJlc3BvbnNlLmRhdGEuSXRlbXMubGVuZ3RoOyAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoaXMgdmFsdWUsIGNveiBpdCdzIHBvc3NpYmxlIHRoZSBvbmx5IHJldmlld2VyIGlzIHRoZSBjdXJyZW50IHVzZXJcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmV2aWV3cyA9IHJlc3BvbnNlLmRhdGEuSXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uJ3Qgc2hvdyBteSBvd24gcmV2aWV3IGluIHRoZSBsaXN0LCBiZWNhdXNlIGl0J3Mgc2hvd2VkIGluIHRoZSB0b3AgYW5kIGVkaXRhYmxlIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChteVJldmlld0lkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnJldmlld3Muc3BsaWNlKG15UmV2aWV3SWR4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZFBvc2l0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdm0ucG9zaXRpb24gPSAkcm9vdFNjb3BlLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0ucG9zaXRpb24gPSB3aW5kb3cuaGVscGVyLmdldERlZmF1bHRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUmVzdGF1cmFudEluZm8oZGlzaCkge1xyXG4gICAgICAgICAgICBmYWN0dWFsU2VydmljZS5nZXRCeU5hbWUoZGlzaC5SZXN0YXVyYW50TmFtZSwgdm0ucG9zaXRpb24udXNlckxvY2F0aW9uLmNpdHkpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3RhdXJhbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZGF0YS5yZXNwb25zZS5kYXRhLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5oZWxwZXIuaGFzRHVwbGljYXRpb24oZGF0YS5yZXNwb25zZS5kYXRhW2lkeF0sIHZtLnJlc3RhdXJhbnRzKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnJlc3RhdXJhbnRzLnB1c2goZGF0YS5yZXNwb25zZS5kYXRhW2lkeF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN0YXVyYW50TG9hZGVyLmxvYWQodm0ucmVzdGF1cmFudHMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVEaXNoKCkge1xyXG4gICAgICAgICAgICBhZG1pblNlcnZpY2UucmVtb3ZlRGlzaCh2bS5kaXNoSWQsIDApXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogdGhlcmUgaXMgbm8gcG9pbnQgdG8gcG9zdCBhIG1lc3NhZ2UsIHByb2JhYmx5IGp1c3QgZ28gYmFjayB0byBob21lIHBhZ2VcclxuICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbyhcIkRpc2ggaGFzIGJlZW4gcmVtb3ZlZFwiKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJEaXNoIGNvdWxkIG5vdCBiZSByZW1vdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3N0SW5mbyhtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGZyb20gcmVzdW1lU2VydmljZVxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXBhcmVDcmF2ZUZvckl0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3JhdmluZ1NlcnZpY2UuY3JhdmVGb3JJdCh2bS5kaXNoSWQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZENyYXZpbmdEaW5lcnMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlcGFyZUFkZERpc2hUb05ld1Byb3Bvc2FsKG5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBOYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgSXRlbXM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBkYXRhLkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgUmVzdGF1cmFudElkOiB2bS5kaXNoLlJlc3RhdXJhbnRJZCxcclxuICAgICAgICAgICAgICAgIERpc2hJZDogdm0uZGlzaC5EaXNoSWRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcG9zYWxTZXJ2aWNlLmNyZWF0ZVByb3Bvc2FsKGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygncHJvcG9zYWwuaG9tZS5kZXRhaWwnLCB7IGtleTogcmVzcG9uc2UuZGF0YSwgY29uZmlybTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogZm9yIHRoaXMgb25lIHdlIHNob3VsZCBnbyB0byBhIGRlZGljYXRlZCBwYWdlIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXBhcmVVcGRhdGluZ0NyYXZpbmdzKHNlbGVjdGVkQ3JhdmluZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGNyYXZpbmdJZHMgPSBzZWxlY3RlZENyYXZpbmdzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS5DcmF2aW5nSWQgIT09IHVuZGVmaW5lZCA/IGEuQ3JhdmluZ0lkIDogYTsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjcmF2aW5nU2VydmljZS51cGRhdGVDcmF2aW5ncyh2bS5kaXNoLkRpc2hJZCwgY3JhdmluZ0lkcykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLmRpc2guQ3JhdmluZ3MgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiRmFpbGVkIHRvIHVwZGF0ZSBjcmF2aW5ncyBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXBhcmVBZGRJbWFnZShmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3JhdmluZ1NlcnZpY2UuYWRkRmlsZSh2bS5kaXNoLkRpc2hJZCwgZmlsZW5hbWUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RmlsZSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNoLkRpc2hJbWFnZUZpbGVzLnB1c2gobmV3RmlsZSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJGYWlsZWQgdG8gdXBkYXRlIGNyYXZpbmdzIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlcGFyZUFkZERpc2hUb1Byb3Bvc2FsKHByb3Bvc2FsLCBldikge1xyXG4gICAgICAgICAgICAvLyB3ZSB3aWxsIGFsd2F5cyByZWxvYWQgYWxsIHByb3Bvc2FscyBiZWZvcmUgYWRkaW5nIGEgZGlzaCB0byBpdCwgY296IHRoaXMgY291bGQgY29tZSBmcm9tIGEgcmVzdW1lXHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICB2YXIgZGluZXJJZCA9IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmRpbmVySWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wb3NhbFNlcnZpY2UuZ2V0QnlEaW5lcihkaW5lcklkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFsbCA9IHJlc3BvbnNlLmRhdGEuSXRlbXM7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9wb3NhbHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFsbC5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbFtpZHhdLklzRXhwaXJlZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5wcm9wb3NhbHMucHVzaChhbGxbaWR4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wb3NhbFNlcnZpY2UucHJvcG9zYWxzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmVwYXJlQWRkRGlzaFRvTmV3UHJvcG9zYWwoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbCA9IHByb3Bvc2FsU2VydmljZS5wcm9wb3NhbHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcG9zYWwuSXNFeHBpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmVwYXJlQWRkRGlzaFRvTmV3UHJvcG9zYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcG9zYWxTZXJ2aWNlLmFkZEl0ZW0odm0uZGlzaCwgcHJvcG9zYWwpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLm9wZW5Nb2RhbCgncHJvcG9zYWwvcHJvcG9zYWxfbW9kYWwuaHRtbCcsICdQcm9wb3NhbE1vZGFsQ29udHJvbGxlcicsIHsgRGlzaDogdm0uZGlzaCwgUHJvcG9zYWw6IHByb3Bvc2FsIH0sIGV2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLm9wZW5Nb2RhbCgncHJvcG9zYWwvcHJvcG9zYWxfbW9kYWwuaHRtbCcsICdQcm9wb3NhbE1vZGFsQ29udHJvbGxlcicsIHsgRGlzaDogdm0uZGlzaCwgUHJvcG9zYWw6IHByb3Bvc2FsLCBBbHJlYWR5SW46IHRydWUgfSwgZXYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlcGFyZVNhdmVNeVJldmlldygpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmhhc015UmV2aWV3ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgcmV2aWV3XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JhdmluZ1NlcnZpY2UudXBkYXRlUmV2aWV3KHZtLmRpc2hJZCwgdm0ubXlSZXZpZXdJZCwgdm0ubXlSYXRpbmcsIHZtLm15UmV2aWV3LCBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5kaW5lcklkKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkUmV2aWV3cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLm15UmV2aWV3SXNDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmhlbHBlci5oYW5kbGVFcnJvcihlcnIsIHZtLCBcIkZhaWxlZCB0byBzYXZlIHJldmlldyBkdWUgdG86XCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBuZXcgcmV2aWV3IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyYXZpbmdTZXJ2aWNlLmFkZFJldmlldyh2bS5kaXNoSWQsIHZtLm15UmF0aW5nLCB2bS5teVJldmlldywgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uZGluZXJJZCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJldmlld3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5teVJldmlld0lzQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJGYWlsZWQgdG8gc2F2ZSByZXZpZXcgZHVlIHRvOlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmVwYXJlU2F2ZURlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBpZiAodm0uZGlzaC5EZXNjcmlwdGlvbiAhPT0gdm0udXBkYXRpbmdEZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY3JhdmluZ1NlcnZpY2UudXBkYXRlRGVzY3JpcHRpb24odm0uZGlzaElkLCB2bS51cGRhdGluZ0Rlc2NyaXB0aW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kaXNoLkRlc2NyaXB0aW9uID0gdm0udXBkYXRpbmdEZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB2bS5zaG93RGVzY3JpcHRpb25FZGl0b3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5oYXNEZXNjcmlwdGlvbiA9IHZtLmRpc2guRGVzY3JpcHRpb24gIT09IG51bGwgJiYgdm0uZGlzaC5EZXNjcmlwdGlvbiAhPT0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbygnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSwgXCJGYWlsZWQgdG8gc2F2ZSBkaXNoIGRlc2NyaXB0aW9uIGR1ZSB0bzpcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJycpOyAvLyBub3RoaW5nIHRvIHNhdmVcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUmVjZW50RGlzaENvbnRyb2xsZXInLCByZWNlbnREaXNoQ29udHJvbGxlcik7XHJcblxyXG4gICAgcmVjZW50RGlzaENvbnRyb2xsZXIuJGluamVjdCA9IFsnUmVjZW50RGlzaFNlcnZpY2UnLCAnTmF2aWdhdGlvblNlcnZpY2UnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlY2VudERpc2hDb250cm9sbGVyKHJlY2VudFNlcnZpY2UsbmF2aWdhdGlvblNlcnZpY2UsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLmRpc2hlcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5vcGVuRGlzaCA9IG9wZW5EaXNoO1xyXG4gICAgICAgIHZtLmlzQ3VycmVudCA9IGlzQ3VycmVudDtcclxuICAgICAgICB2bS5pc09wZW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgbG9hZFJlY2VudCgpO1xyXG5cclxuICAgICAgICAgICAgcmVjZW50U2VydmljZS5vblJlZnJlc2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxvYWRSZWNlbnQoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzQ3VycmVudChkaXNoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXR2YWwgPSAkcm9vdFNjb3BlLiRzdGF0ZS5pcygnZGV0YWlsLmRpc2gnLCB7ICdpZCc6IGRpc2guRGlzaElkIH0pIHx8IFxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGUuaXMoJ2Rpc2guZGV0YWlsJywgeyAnaWQnOiBkaXNoLkRpc2hJZCB9KTsgLy8gc2lnaC4uLiBJIHVzZWQgYSBkaWZmZXJlbnQgcm91dGUgaW4gdGhlIE1EIHRoZW1lXHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuRGlzaChkaXNoKSB7XHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdkZXRhaWwuZGlzaCcsIHsgJ2lkJzogZGlzaC5EaXNoSWQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUmVjZW50KCkge1xyXG4gICAgICAgICAgICByZWNlbnRTZXJ2aWNlLmxvYWRSZWNlbnQoKTtcclxuICAgICAgICAgICAgdm0uZGlzaGVzID0gcmVjZW50U2VydmljZS5kaXNoZXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSW1hZ2VNb2RhbENvbnRyb2xsZXInLCBpbWFnZU1vZGFsQ29udHJvbGxlcik7XHJcblxyXG4gICAgaW1hZ2VNb2RhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnTW9kYWxTZXJ2aWNlJywgJ21vZGFsSXRlbScsICdmaWxlU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGltYWdlTW9kYWxDb250cm9sbGVyKG1vZGFsU2VydmljZSwgbW9kYWxJdGVtLCBmaWxlU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdm0uZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLmdldEltYWdlU3JjID0gZ2V0SW1hZ2VTcmM7XHJcbiAgICAgICAgdm0uY2xvc2UgPSBjbG9zZTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgdm0uZW50aXR5ID0gbW9kYWxJdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SW1hZ2VTcmMoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVNlcnZpY2UuZ2V0U2FmZVByZXZpZXdJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbmZpZyhbJ3VpR21hcEdvb2dsZU1hcEFwaVByb3ZpZGVyJywgZnVuY3Rpb24gKG1hcFByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5NYXBIZWxwZXIuY29uZmlnTWFwKG1hcFByb3ZpZGVyKTtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignRGlzaE1hcEVkaXRDb250cm9sbGVyJywgZGlzaE1hcEVkaXRDb250cm9sbGVyKTtcclxuXHJcbiAgICBkaXNoTWFwRWRpdENvbnRyb2xsZXIuJGluamVjdCA9IFsnR2VvU2VydmljZScsICdSZXN0YXVyYW50U2VydmljZScsICdEaW5lclNlcnZpY2UnLCAnUmVmZXJlbmNlRGF0YVNlcnZpY2UnLCAnRmFjdHVhbFNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJyxcclxuICAgICAgICAnbG9hZGVyJywgJ3VpR21hcEdvb2dsZU1hcEFwaScsXHJcbiAgICAgICAgJyR0aW1lb3V0JywgJyRyb290U2NvcGUnLCAnJHNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzaE1hcEVkaXRDb250cm9sbGVyKGdlb1NlcnZpY2UsIHJlc3RTZXJ2aWNlLCBkaW5lclNlcnZpY2UsIHJlZkRhdGFTZXJ2aWNlLCBmYWN0dWFsU2VydmljZSwgbW9kYWxTZXJ2aWNlLFxyXG4gICAgICAgIGRpc2hMb2FkZXIsIG1hcEFwaSxcclxuICAgICAgICAkdGltZW91dCwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XHJcbiAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcGFnZUxpbWl0ID0gMTU7XHJcblxyXG4gICAgICAgIHZtLnVzZXJDb29yZHMgPSB7fTsgLy8gdGhpcyBzdG9yZXMgdGhlIGN1cnJlbnQgdXNlcidzIG1hcmtlciBcclxuICAgICAgICB2bS5kaXNoID0gZGlzaExvYWRlci5jdXJyZW50O1xyXG5cclxuICAgICAgICB2bS5zZWxlY3RlZFJlc3RhdXJhbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0uYXZhaWxhYmxlUmVzdGF1cmFudHMgPSBbXTtcclxuXHJcbiAgICAgICAgdm0ub2Zmc2V0ID0gMDsgLy8gZmFjdHVhbCBzZXJ2aWNlIHNlYXJjaCBvZmZzZXRcclxuICAgICAgICB2bS5pdGVtVGl0bGUgPSBcIlwiOyAvLyB0aXRsZSBvZiB0aGUgaXRlbSBwYW5lbFxyXG4gICAgICAgIHZtLmhhc05leHRQYWdlID0gZmFsc2U7IC8vIGluZGljYXRlIGlmIHRoZXJlIGlzIG5leHQgcGFnZTtcclxuICAgICAgICB2bS5oYXNQcmV2UGFnZSA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICB2bS5wYWdlcyA9IFtdOyAvLyBmb3IgZGlzcGxheWluZyBwYWdpbmF0aW9uXHJcbiAgICAgICAgdm0ucGFnZVNpemUgPSBwYWdlTGltaXQ7XHJcbiAgICAgICAgdm0uc2hvd1NlYXJjaCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmNyYXZpbmdzID0gW107XHJcbiAgICAgICAgdm0uc2VhcmNoVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHZtLnBvc2l0aW9uID0gd2luZG93LmhlbHBlci5nZXREZWZhdWx0TG9jYXRpb24oKTtcclxuICAgICAgICB2bS5tYXAgPSB7fTtcclxuICAgICAgICB2bS5tYXAubWFya2VycyA9IFtdO1xyXG4gICAgICAgIHZtLm1hcC51c2VyTWFya2VyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLm1hcC5zZWxlY3RlZE1hcmtlciA9IG51bGw7XHJcbiAgICAgICAgdm0uaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS50b3RhbCA9IDA7IC8vIHN0b3JlIHRoZSB0b3RhbCBzZWFyY2hlZCByZXN1bHRzIFxyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5sb2NhdGUgPSBsb2NhdGU7XHJcbiAgICAgICAgdm0uZ2V0Q3Vpc2luZSA9IGdldEN1aXNpbmU7XHJcbiAgICAgICAgdm0uc2VhcmNoUmVzdGF1cmFudCA9IHNlYXJjaFJlc3RhdXJhbnQ7XHJcbiAgICAgICAgdm0uZ290b1BhZ2UgPSBnb3RvUGFnZTtcclxuICAgICAgICB2bS5nb3RvUHJldlBhZ2UgPSBnb3RvUHJldlBhZ2U7XHJcbiAgICAgICAgdm0uZ290b05leHRQYWdlID0gZ290b05leHRQYWdlO1xyXG4gICAgICAgIHZtLmNsb3NlID0gY2xvc2U7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpemVcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIG1hcEFwaS50aGVuKGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9zaXRpb24gPSAkcm9vdFNjb3BlLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3NpdGlvbiA9IHdpbmRvdy5oZWxwZXIuZ2V0RGVmYXVsdExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ2VudGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNsZWZ0XCIpLm9uKCdzaWRlbmF2Lm9wZW4nLCBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmlkID09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tYXAuY29udHJvbC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVmRGF0YVNlcnZpY2UuZ2V0RGF0YShcImNyYXZpbmd0eXBlXCIpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jcmF2aW5ncyA9IHJlc3BvbnNlLkl0ZW1zLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5OYW1lOyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMga2V5IGlzIGRlZmluZWQgaW4gc2hlbGxfd2lkdGhfcmlnaHRfc2lkZWJhci5odG1sXHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5jbG9zZVNpZGVuYXYoXCJsZWZ0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaXQgYXBwbGllcyBzb21lIGludGVsbGlnZW5jZSB0byBsb2FkIHRoZSBjdWlzaW5lIHR5cGUgb2YgYSByZXN0YXVyYW50IFxyXG4gICAgICAgIC8vIEZhY3R1YWwgQVBJIG9ubHkgcmV0dXJucyB0aGUgcmVhbCBjdWlzaW5lIHR5cGVzIGZyb20gcmVzdGF1cmFudC1YWCBkYXRhc2V0IG5vdCBmcm9tIFwicGxhY2VzXCIgZGF0YXNldCBcclxuICAgICAgICAvLyBob3dldmVyLCB3ZSBjYW4gZGVyaXZlIGEgcm91Z2ggY3Vpc2luZSB0eXBlIGZyb20gdGhlIGNhdGVnb3J5X2xhYmVscyBcclxuICAgICAgICBmdW5jdGlvbiBnZXRDdWlzaW5lKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgZGVmYXVsdEN1aXNpbmUgPSBcIkZvb2QgYW5kIERpbmluZ1wiO1xyXG4gICAgICAgICAgICB2YXIgZ2VuZXJpY0NhdGVnb3J5ID0gXCJSZXN0YXVyYW50c1wiO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jdWlzaW5lICYmIGl0ZW0uY3Vpc2luZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmN1aXNpbmUuc3BsaWNlKDAsIDMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uY2F0ZWdvcnlfbGFiZWxzICYmIGl0ZW0uY2F0ZWdvcnlfbGFiZWxzLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgaXRlbS5jYXRlZ29yeV9sYWJlbHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbHMgPSBpdGVtLmNhdGVnb3J5X2xhYmVsc1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbHMuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbHNbbGFiZWxzLmxlbmd0aCAtIDFdICE9PSBnZW5lcmljQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKGxhYmVsc1tsYWJlbHMubGVuZ3RoIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmV0dmFsLmxlbmd0aCA9PT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJldHZhbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR2YWwucHVzaChkZWZhdWx0Q3Vpc2luZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR2YWwucHVzaChkZWZhdWx0Q3Vpc2luZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWFyY2hSZXN0YXVyYW50KCkge1xyXG4gICAgICAgICAgICBpZiAoIXZtLnBvc2l0aW9uKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyByZXNldFxyXG4gICAgICAgICAgICBpZiAodm0uc2VhcmNoVGV4dCA9PT0gXCJcIiB8fCAhdm0uc2VhcmNoVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ2VudGVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNsZWFyTWFya2VycygpO1xyXG5cclxuICAgICAgICAgICAgZmFjdHVhbFNlcnZpY2UuZ2V0QnlOYW1lKHZtLnNlYXJjaFRleHQsIHZtLnBvc2l0aW9uLnVzZXJMb2NhdGlvbi5jaXR5KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBkYXRhLnJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZFNlYXJjaGVkUmVzdWx0cyhpdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2NhdGUoaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gZmluZE1hcmtlcihpdGVtLmZhY3R1YWxfaWQpO1xyXG4gICAgICAgICAgICBpZiAobWFya2VyKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RNYXJrZXIobWFya2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ290b1ByZXZQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodm0ub2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdm0ub2Zmc2V0ID0gdm0ub2Zmc2V0IC0gcGFnZUxpbWl0O1xyXG4gICAgICAgICAgICAgICAgcmVsb2FkUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ290b05leHRQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodm0ub2Zmc2V0ICsgcGFnZUxpbWl0IDwgdm0udG90YWwpIHtcclxuICAgICAgICAgICAgICAgIHZtLm9mZnNldCA9IHZtLm9mZnNldCArIHBhZ2VMaW1pdDtcclxuICAgICAgICAgICAgICAgIHJlbG9hZFJlc3RhdXJhbnRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvdG9QYWdlKHApIHtcclxuICAgICAgICAgICAgaWYgKHAgPiB2bS5jdXJyZW50UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdm0ub2Zmc2V0ID0gcGFnZUxpbWl0ICogKHAgLSAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ub2Zmc2V0ID0gdm0ub2Zmc2V0IC0gcGFnZUxpbWl0ICogKHAgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVsb2FkUmVzdGF1cmFudHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDZW50ZXIoKSB7XHJcbiAgICAgICAgICAgIHZtLm1hcCA9IHdpbmRvdy5NYXBIZWxwZXIuY3JlYXRlTWFwKHZtLnBvc2l0aW9uLmNvb3Jkcyk7XHJcbiAgICAgICAgICAgIHZtLnVzZXJDb29yZHMgPSB2bS5wb3NpdGlvbi5jb29yZHM7XHJcbiAgICAgICAgICAgIGVuc3VyZVVzZXJNYXJrZXIoKTtcclxuICAgICAgICAgICAgcmVsb2FkUmVzdGF1cmFudHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFya2VycygpIHtcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZU1hcmtlcnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZtLm1hcC5tYXJrZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXAubWFya2Vyc1trZXldLnNldE1hcChudWxsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRSZXN0YXVyYW50cygpIHtcclxuICAgICAgICAgICAgZmFjdHVhbFNlcnZpY2Uuc2VhcmNoTmVhcih2bS51c2VyQ29vcmRzLmxhdGl0dWRlLCB2bS51c2VyQ29vcmRzLmxvbmdpdHVkZSwgdm0ub2Zmc2V0LCBwYWdlTGltaXQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdNYXJrZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbG9hZFJlc3RhdXJhbnRzKCkge1xyXG4gICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJNYXJrZXJzKCk7XHJcbiAgICAgICAgICAgICAgICBsb2FkUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkcmF3TWFya2VyKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIG1hcmtlcklkID0gMTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5yZXNwb25zZS5kYXRhIHx8IGRhdGEucmVzcG9uc2UuZGF0YS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdm0uaXRlbVRpdGxlID0gXCJPb3BzLCBpdCBhcHBlYXJzIHRoZXJlIGlzIG5vIHJlc3RhdXJhbnQgbmVhciBoZXJlLlwiO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS50b3RhbCA9IGRhdGEucmVzcG9uc2UudG90YWxfcm93X2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdm0uaGFzTmV4dFBhZ2UgPSB2bS5vZmZzZXQgKyBwYWdlTGltaXQgPCB2bS50b3RhbDtcclxuICAgICAgICAgICAgICAgIC8vIHdlIG9ubHkgc2hvdyB1cC10byAxMCBwYWdlc1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLnRvdGFsIDw9IHBhZ2VMaW1pdCAqIDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbVRpdGxlID0gXCJXZSBmb3VuZCBcIiArIHZtLnRvdGFsICsgXCIgcmVzdGF1cmFudHMgbmVhciBoZXJlLlwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtVGl0bGUgPSBcIlRoZXJlIGFyZSBtb3JlIHRoYW4gMTUwIHJlc3RhdXJhbnRzIG5lYXIgaGVyZSwgdHJ5IHRvIHNlYXJjaCBieSB0eXBpbmcgdGhlIG5hbWVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxQYWdlID0gZ2V0VG90YWxQYWdlKHZtLnRvdGFsLCBwYWdlTGltaXQpO1xyXG4gICAgICAgICAgICAgICAgdm0ucGFnZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHBhZ2VJbmRleCA9IDE7IHBhZ2VJbmRleCA8PSB0b3RhbFBhZ2U7IHBhZ2VJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucGFnZXMucHVzaChwYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWdlSW5kZXggPj0gMTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZtLmN1cnJlbnRQYWdlID0gZ2V0Q3VycmVudFBhZ2Uodm0udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgdm0uaGFzUHJldlBhZ2UgPSB2bS5jdXJyZW50UGFnZSA+IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXJzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGRhdGEucmVzcG9uc2UuZGF0YS5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gZGF0YS5yZXNwb25zZS5kYXRhW2lkeF07XHJcbiAgICAgICAgICAgICAgICBvYmouaXNTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLnBsYWNlSW5kZXggPSB2bS5vZmZzZXQgKyBpZHggKyAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlckRhdGEgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVJlc3RhdXJhbnRNYXJrZXIob2JqLCBtYXJrZXJJZCsrLCBvbk1hcmtlclNlbGVjdGVkLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIG1hcmtlcnMucHVzaChtYXJrZXJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHZtLml0ZW1zLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLm1hcmtlcnMgPSBtYXJrZXJzO1xyXG4gICAgICAgICAgICB9LCAyNTApOyAvLyBpZiBJIGRvbid0IGRlbGF5IGhlcmUsIGl0IGRvZXNuJ3Qgc2hvdyBhbGwgdGhlIG5ldyBtYXJrZXJzIFxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZtLml0ZW1zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdm0ubWFya2VycyBoYXMgdGhlIGRhdGEgdXNlZCB0byBkcmF3IG1hcmtlcnMgb24gdGhlIG1hcFxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRNYXJrZXIoZmFjdHVhbElkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLm1hcC5tYXJrZXJzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5tYXAubWFya2Vyc1tpZHhdLmZhY3R1YWxfaWQgPT0gZmFjdHVhbElkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5tYXAubWFya2Vyc1tpZHhdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdm0uaXRlbXMgaGFzIHRoZSBkYXRhIHVzZWQgdG8gZGlzcGxheSByZXN0YXVyYW50IGluZm8gaW4gdGhlIGxvd2VyIHBhcnRcclxuICAgICAgICBmdW5jdGlvbiBmaW5kSXRlbShmYWN0dWFsSWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdm0uaXRlbXMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLml0ZW1zW2lkeF0uZmFjdHVhbF9pZCA9PSBmYWN0dWFsSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLml0ZW1zW2lkeF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0aWFsaXplTWFya2VycygpIHtcclxuICAgICAgICAgICAgdm0uaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgdm0ubWFwLm1hcmtlcnMgPSBbXTtcclxuICAgICAgICAgICAgdm0udG90YWwgPSAwO1xyXG4gICAgICAgICAgICB2bS5wYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICB2bS5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgIHZtLmhhc05leHRQYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLmhhc1ByZXZQYWdlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRUb3RhbFBhZ2UodG90YWwsIHBhZ2VTaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaGVscGVyLnBhcnNlSW50MTAoKHRvdGFsICsgKHBhZ2VTaXplIC0gMSkpIC8gcGFnZVNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodm0ub2Zmc2V0IC8gcGFnZUxpbWl0KSArIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkU2VhcmNoZWRSZXN1bHRzKGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHZtLm1hcC5tYXJrZXJzID0gW107XHJcbiAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnRlciA9IDE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBpdGVtcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5oZWxwZXIuaGFzRHVwbGljYXRpb24oaXRlbXNbaWR4XSwgdm0uaXRlbXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucGxhY2VJbmRleCA9IGNvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgSXRlbSdzIHByb3BlcnRpZXMgYXJlIG5hbWVkIGRpZmZlcmVudGx5LCB0aGV5IGFyZSBGaW5kUmVzdGF1cmFudFJlc3AgRFRPXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlckRhdGEgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVJlc3RhdXJhbnRNYXJrZXIoaXRlbSwgY291bnRlciwgb25NYXJrZXJTZWxlY3RlZCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWFwLm1hcmtlcnMucHVzaChtYXJrZXJEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBmaXJzdCBvbmUgaXMgdGhlIGNsb3NldCBvbmUsIGRlZmF1bHQgaXMgc29ydGVkIGJ5IGRpc3RhbmNlIGFzYyBcclxuICAgICAgICAgICAgICAgIHZtLm1hcC5jZW50ZXIgPSB7IGxhdGl0dWRlOiBpdGVtc1swXS5sYXRpdHVkZSwgbG9uZ2l0dWRlOiBpdGVtc1swXS5sb25naXR1ZGUgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBhIGJldHRlciBleHBlcmllbmNlIGlzIHRvIGNlbnRlciB1c2luZyB0aGUgdXNlcidzIGxvY2F0aW9uIGFuZCBjb25uZWN0IHRvIHRoZSBjbG9zZXNldCBvbmUgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLml0ZW1UaXRsZSA9IFwiV2UgZm91bmQgXCIgKyB2bS5pdGVtcy5sZW5ndGggKyBcIiByZXN0YXVyYW50cyBtYXRjaGluZyBbXCIgKyB2bS5zZWFyY2hUZXh0ICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbk1hcmtlclNlbGVjdGVkKHNlbmRlcikge1xyXG4gICAgICAgICAgICBpZiAoc2VuZGVyLm1vZGVsICYmIHNlbmRlci5tb2RlbC5mYWN0dWFsX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RNYXJrZXIoc2VuZGVyLm1vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0TWFya2VyKG1hcmtlcikge1xyXG4gICAgICAgICAgICBpZiAodm0ubWFwLnNlbGVjdGVkTWFya2VyKSB7XHJcbiAgICAgICAgICAgICAgICBkZVNlbGVjdE1hcmtlcih2bS5tYXAuc2VsZWN0ZWRNYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGZpbmRJdGVtKG1hcmtlci5mYWN0dWFsX2lkKTtcclxuICAgICAgICAgICAgbWFya2VyLm9wdGlvbnMub3BhY2l0eSA9IDEuMDtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzaExvYWRlci5sb2FkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ubWFwLnNlbGVjdGVkTWFya2VyID0gbWFya2VyO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLmNlbnRlci5sYXRpdHVkZSA9IG1hcmtlci5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXAuY2VudGVyLmxvbmdpdHVkZSA9IG1hcmtlci5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZVNlbGVjdE1hcmtlcihtYXJrZXIpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaW5kSXRlbShtYXJrZXIuZmFjdHVhbF9pZCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNoTG9hZGVyLmxvYWQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1hcmtlci5vcHRpb25zLm9wYWNpdHkgPSAwLjQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVuc3VyZVVzZXJNYXJrZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICghdm0udXNlck1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLnVzZXJNYXJrZXIgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVVzZXJNYXJrZXIodm0udXNlckNvb3Jkcywgb25Vc2VyTWFya2VyRHJhZ2dlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uVXNlck1hcmtlckRyYWdnZWQobWFya2VyLCBldmVudE5hbWUsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGxhdCA9IG1hcmtlci5nZXRQb3NpdGlvbigpLmxhdCgpO1xuICAgICAgICAgICAgdmFyIGxuZyA9IG1hcmtlci5nZXRQb3NpdGlvbigpLmxuZygpO1xyXG4gICAgICAgICAgICB2YXIgY29vcmRzID0geyBsYXRpdHVkZTogbGF0LCBsb25naXR1ZGU6IGxuZyB9O1xyXG5cclxuICAgICAgICAgICAgdm0udXNlckNvb3JkcyA9IGNvb3JkcztcclxuICAgICAgICAgICAgcmVsb2FkUmVzdGF1cmFudHMoKTtcclxuXHJcbiAgICAgICAgICAgIHZtLm1hcC5jZW50ZXIubGF0aXR1ZGUgPSBsYXQ7XHJcbiAgICAgICAgICAgIHZtLm1hcC5jZW50ZXIubG9uZ2l0dWRlID0gbG5nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbmZpZyhbJ3VpR21hcEdvb2dsZU1hcEFwaVByb3ZpZGVyJywgZnVuY3Rpb24gKG1hcFByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5NYXBIZWxwZXIuY29uZmlnTWFwKG1hcFByb3ZpZGVyKTtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignUmVzdGF1cmFudE1hcENvbnRyb2xsZXInLCByZXN0YXVyYW50TWFwQ29udHJvbGxlcik7XHJcblxyXG4gICAgcmVzdGF1cmFudE1hcENvbnRyb2xsZXIuJGluamVjdCA9IFsncmVzdGF1cmFudExvYWRlcicsICdSZXN0YXVyYW50U2VydmljZScsJ01vZGFsU2VydmljZScsXHJcbiAgICAgICAgJ3VpR21hcEdvb2dsZU1hcEFwaScsICckdGltZW91dCcsICckcm9vdFNjb3BlJywgJyRzY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlc3RhdXJhbnRNYXBDb250cm9sbGVyKHJlc3RhdXJhbnRMb2FkZXIsIHJlc3RTZXJ2aWNlLCBtb2RhbFNlcnZpY2UsXHJcbiAgICAgICAgbWFwQXBpLCAkdGltZW91dCwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB2bS5oYXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnJlc3RhdXJhbnRzID0gW107XHJcbiAgICAgICAgdm0uaXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgdm0ubWFwID0ge307XHJcbiAgICAgICAgdm0ubWFwLm1hcmtlcnMgPSBbXTtcclxuICAgICAgICB2bS5tYXAudXNlck1hcmtlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2bS5tYXAuc2VsZWN0ZWRNYXJrZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5sb2NhdGUgPSBsb2NhdGU7XHJcbiAgICAgICAgdm0uY2xvc2UgPSBjbG9zZTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRlKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IGZpbmRNYXJrZXIoaXRlbS5mYWN0dWFsX2lkKTtcclxuICAgICAgICAgICAgaWYgKG1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0TWFya2VyKG1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UuY2xvc2VTaWRlbmF2KFwibGVmdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgcmVzdGF1cmFudExvYWRlci5hZGRMb2FkZWRFdmVudExpc3RlbmVyKGhhbmRsZVJlc3RhdXJhbnRMb2FkZWQpO1xyXG5cclxuICAgICAgICAgICAgbWFwQXBpLnRoZW4oZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3NpdGlvbiA9ICRyb290U2NvcGUucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvc2l0aW9uID0gd2luZG93LmhlbHBlci5nZXREZWZhdWx0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVDZW50ZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwiI2xlZnRcIikub24oJ3NpZGVuYXYub3BlbicsIGZ1bmN0aW9uIChldikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQuaWQgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tYXAuY29udHJvbC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZm9yIHRoaXMgbG9hZGVyLCB0aGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gYWxsIHJlc3RhdXJhbnRzIGFyZSBsb2FkZWRcclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXN0YXVyYW50TG9hZGVkKHJlc3RhdXJhbnRzKSB7XHJcbiAgICAgICAgICAgIHZtLmhhc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIG1hcCBpbml0aWFsaXplZCBhZnRlciB0aGUgZGlzaCBpcyBsb2FkZWQgXHJcbiAgICAgICAgICAgIChmdW5jdGlvbiB0aWNrKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQodGljaywgNTAwKTtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7IC8vIGlmIHRoZSBtYXAgaXMgaW5pdGlhbGl6ZWQsIHdlIGRvbid0IGhhdmUgdG8gd2FpdFxyXG4gICAgICAgICAgICAgICAgY2xlYXJNYXJrZXJzKCk7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGVSZXN0YXVyYW50KHJlc3RhdXJhbnRzKTtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyTWFya2VycygpIHtcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZU1hcmtlcnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZtLm1hcC5tYXJrZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXAubWFya2Vyc1trZXldLnNldE1hcChudWxsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVNYXJrZXJzKCkge1xyXG4gICAgICAgICAgICB2bS5yZXN0YXVyYW50cyA9IFtdO1xyXG4gICAgICAgICAgICB2bS5tYXAubWFya2VycyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRlUmVzdGF1cmFudChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoICYmIGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGRhdGEubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gZGF0YVtpZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucGxhY2VJbmRleCA9IGlkeCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXMucHVzaChpdGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlckRhdGEgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVJlc3RhdXJhbnRNYXJrZXIoaXRlbSwgaWR4LCBvbk1hcmtlclNlbGVjdGVkLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3RhdXJhbnRzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1hcC5tYXJrZXJzID0gbWFya2VycztcclxuICAgICAgICAgICAgICAgICAgICB2bS5tYXAuY2VudGVyID0geyBsYXRpdHVkZTogdm0uaXRlbXNbMF0ubGF0aXR1ZGUsIGxvbmdpdHVkZTogdm0uaXRlbXNbMF0ubG9uZ2l0dWRlIH07XHJcbiAgICAgICAgICAgICAgICB9LCAyNTApOyAvLyBpZiBJIGRvbid0IGRlbGF5IGhlcmUsIGl0IGRvZXNuJ3Qgc2hvdyBhbGwgdGhlIG5ldyBtYXJrZXJzIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDZW50ZXIoKSB7XHJcbiAgICAgICAgICAgIHZtLm1hcCA9IHdpbmRvdy5NYXBIZWxwZXIuY3JlYXRlTWFwKHZtLnBvc2l0aW9uLmNvb3Jkcyk7XHJcbiAgICAgICAgICAgIHZtLnVzZXJDb29yZHMgPSB2bS5wb3NpdGlvbi5jb29yZHM7XHJcbiAgICAgICAgICAgIGVuc3VyZVVzZXJNYXJrZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVuc3VyZVVzZXJNYXJrZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICghdm0udXNlck1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLnVzZXJNYXJrZXIgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVVzZXJNYXJrZXIodm0udXNlckNvb3JkcywgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uTWFya2VyU2VsZWN0ZWQoc2VuZGVyKSB7XHJcbiAgICAgICAgICAgIGlmIChzZW5kZXIubW9kZWwgJiYgc2VuZGVyLm1vZGVsLmZhY3R1YWxfaWQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdE1hcmtlcihzZW5kZXIubW9kZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RNYXJrZXIobWFya2VyKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5tYXAuc2VsZWN0ZWRNYXJrZXIpIHtcclxuICAgICAgICAgICAgICAgIGRlU2VsZWN0TWFya2VyKHZtLm1hcC5zZWxlY3RlZE1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gZmluZEl0ZW0obWFya2VyLmZhY3R1YWxfaWQpO1xyXG4gICAgICAgICAgICBtYXJrZXIub3B0aW9ucy5vcGFjaXR5ID0gMS4wO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZtLm1hcC5zZWxlY3RlZE1hcmtlciA9IG1hcmtlcjtcclxuICAgICAgICAgICAgICAgIHZtLm1hcC5jZW50ZXIubGF0aXR1ZGUgPSBtYXJrZXIuY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLmNlbnRlci5sb25naXR1ZGUgPSBtYXJrZXIuY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVTZWxlY3RNYXJrZXIobWFya2VyKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gZmluZEl0ZW0obWFya2VyLmZhY3R1YWxfaWQpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1hcmtlci5vcHRpb25zLm9wYWNpdHkgPSAwLjQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRNYXJrZXIoZmFjdHVhbElkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLm1hcC5tYXJrZXJzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5tYXAubWFya2Vyc1tpZHhdLmZhY3R1YWxfaWQgPT09IGZhY3R1YWxJZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ubWFwLm1hcmtlcnNbaWR4XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRJdGVtKGZhY3R1YWxJZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB2bS5pdGVtcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodm0uaXRlbXNbaWR4XS5mYWN0dWFsX2lkID09PSBmYWN0dWFsSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLml0ZW1zW2lkeF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSGVhZGVyQ29tbWFuZENvbnRyb2xsZXInLCBoZWFkZXJDb21tYW5kQ29udHJvbGxlcik7XHJcblxyXG4gICAgLy8gdGhpcyBjb250cm9sbGVyIHJlcGxhY2VzIHRoZSBvcmlnaW5hbCBvbmUgQWNjb3VudENvbnRyb2xsZXJcclxuICAgIGhlYWRlckNvbW1hbmRDb250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJ0RpbmVyU2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsICdNb2RhbFNlcnZpY2UnLCAnJHNjb3BlJywgJyR0aW1lb3V0JywgJ2ZpbGVTZXJ2aWNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gaGVhZGVyQ29tbWFuZENvbnRyb2xsZXIoYXV0aFNlcnZpY2UsIGRpbmVyU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsIG1vZGFsU2VydmljZSwgJHNjb3BlLCAkdGltZW91dCwgZmlsZVNlcnZpY2UpIHtcclxuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBpY29uSWR4ID0gMDtcclxuICAgICAgICB2bS5hZGREaXNoSWNvbnMgPSBbJ2FkZCcsICdyZXN0YXVyYW50X21lbnUnXTtcclxuICAgICAgICB2bS5hZGREaXNoSWNvbiA9IHZtLmFkZERpc2hJY29uc1tpY29uSWR4XTtcclxuICAgICAgICB2bS5hdXRoZW50aWNhdGlvbiA9IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uO1xyXG4gICAgICAgIHZtLnNob3dMb2dpbiA9IHRydWU7XHJcbiAgICAgICAgdm0uc2hvd1NpZ251cCA9IHRydWU7XHJcbiAgICAgICAgdm0uc2hvd1VzZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0uc2hvd0xvZ2luTW9kYWwgPSBzaG93TG9naW47XHJcbiAgICAgICAgdm0uc2hvd1NpZ251cE1vZGFsID0gc2hvd1NpZ251cDtcclxuICAgICAgICB2bS5sb2dvdXQgPSBsb2dPdXRIYW5kbGVyO1xyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWNvbklkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGljb25JZHggPSAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uSWR4ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZtLmFkZERpc2hJY29uID0gdm0uYWRkRGlzaEljb25zW2ljb25JZHhdO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9LCA1MDAwKTtcclxuXHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5hdXRoZW50aWNhdGlvbiA9IGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uO1xyXG4gICAgICAgICAgICB2bS5zaG93TG9naW4gPSBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGggPT09IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS5zaG93U2lnbnVwID0gYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoID09PSBmYWxzZTtcclxuICAgICAgICAgICAgdm0uc2hvd1VzZXIgPSBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi5pc0F1dGggPT09IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dPdXRIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIucmVmcmVzaGluZygkdGltZW91dCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93TG9naW4oZXYpIHtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLm9wZW5Nb2RhbCgnYWNjb3VudC9sb2dpbi5tb2RhbC5odG1sJyxcIkFjY291bnRMb2dpbkNvbnRyb2xsZXJcIiwgbnVsbCwgZXYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NpZ251cChldikge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uub3Blbk1vZGFsKCdhY2NvdW50L3NpZ251cC5tb2RhbC5odG1sJywgXCJBY2NvdW50U2lnbnVwQ29udHJvbGxlclwiLCBudWxsLCBldik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaW5lckltYWdlKGltZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVBdmF0YXJJbWFnZShpbWdOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBoZWFkZXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBoZWFkZXJDb250cm9sbGVyLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBoZWFkZXJDb250cm9sbGVyKCkge1xyXG4gICAgICAgIFxyXG5cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2YmFyTG9jYXRpb25Db250cm9sbGVyJywgbG9jYXRpb25Db250cm9sbGVyKTtcclxuXHJcbiAgICBsb2NhdGlvbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnR2VvU2VydmljZScsJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICAvLyB0aGlzIGNvbnRyb2xsZXIgd2lsbCBiZSBhc3NpZ25lZCB0byBldmVyeXRoaW5nIGluc2lkZSBzaGVsbC5odG1sLCB1bmxlc3MgYSBwYXJ0IGhhcyBhIHNwZWNpZmljIGNvbnRyb2xsZXIgXHJcbiAgICAvLyB0aGlzIHdpbGwgYmUgdGhlIGZpcnN0IGNvbnRyb2xsZXIgbG9hZGVkIGluIHRoZSB3aG9sZSBzeXN0ZW0sIHNvIHdlIGNhbiBkbyBzb21lIGluaXRpYWxpemF0aW9uIGhlcmUgXHJcbiAgICBmdW5jdGlvbiBsb2NhdGlvbkNvbnRyb2xsZXIoZ2VvU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ucG9zaXRpb24gPSAkcm9vdFNjb3BlLnBvc2l0aW9uO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgaWYgKHZtLnBvc2l0aW9uID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucG9zaXRpb24gPSB3aW5kb3cuaGVscGVyLmdldERlZmF1bHRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihnZW9TZXJ2aWNlLkdFT19VUERBVEUsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wb3NpdGlvbiA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlYXJjaEJhckNvbnRyb2xsZXInLCBzZWFyY2hCYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBzZWFyY2hCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJ0NyYXZpbmdTZXJ2aWNlJywgJ1JlZmVyZW5jZURhdGFTZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJHNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gc2VhcmNoQmFyQ29udHJvbGxlcihjcmF2aW5nU2VydmljZSwgcmVmU2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsICRyb290U2NvcGUsICRzY29wZSkge1xyXG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0udGl0bGUgPSAnU2VhcmNoIENyYXZpbmdzJztcclxuICAgICAgICB2bS5pbnB1dCA9ICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmNyaXRlcmlhO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkQ3JhdmluZ3MgPSBbXTtcclxuICAgICAgICB2bS5jcmF2aW5ncyA9IFtdO1xyXG4gICAgICAgIHZtLnNlYXJjaFRleHQgPSBudWxsO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkSXRlbSA9IG51bGw7XHJcbiAgICAgICAgdm0uc2hvd1NlYXJjaCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICB2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG4gICAgICAgIHZhciBvbGRJbnB1dCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHN0YXRlQ2hhbmdlZFN1YnNjcmliZWQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICB2bS5wb3NpdGlvbiA9ICRyb290U2NvcGUucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNoZWNrU2VhcmNoKCk7XHJcblxyXG4gICAgICAgICAgICByZWZTZXJ2aWNlLmdldERhdGEoXCJjcmF2aW5ndHlwZVwiKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uY3JhdmluZ3MgPSByZXNwb25zZS5JdGVtcy5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuTmFtZTsgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyBpcyBpbXBvcnRhbnQsIGNveiB0aGUgaGVhZGVyIGhhcyBvbmx5IG9uZSBpbnN0YW5jZVxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgbmV3U2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCd2bS5zZWxlY3RlZENyYXZpbmdzJywgZnVuY3Rpb24gKG5ld1ZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIHdvcnJ5IGFib3V0IHRoZSB2YWx1ZSwgb25seSB0aGUgbGVuZ3RoIGlzIGZpbmUgXHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG9sZFZhbCkgJiYgb2xkVmFsLmxlbmd0aCAhPT0gbmV3VmFsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdhcHAuaG9tZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q3JpdGVyaWEgPSB2bS5zZWxlY3RlZENyYXZpbmdzLmpvaW4oJysnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY3JpdGVyaWEgPSBjdXJyZW50Q3JpdGVyaWE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdhcHAuaG9tZS5zZWFyY2gnLCB7ICdjcml0ZXJpYSc6IGN1cnJlbnRDcml0ZXJpYSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbmV3U2VhcmNoKCkge1xyXG4gICAgICAgICAgICBzdGF0ZUNoYW5nZWRTdWJzY3JpYmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0uaW5wdXQgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jcml0ZXJpYTtcclxuICAgICAgICAgICAgY2hlY2tTZWFyY2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrU2VhcmNoKCkge1xyXG4gICAgICAgICAgICBpZiAodm0uaW5wdXQgPT09IHVuZGVmaW5lZCB8fCB2bS5pbnB1dC50cmltKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZENyYXZpbmdzID0gW107XHJcbiAgICAgICAgICAgICAgICB2bS5zaG93U2VhcmNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodm0uaW5wdXQgIT09IG9sZElucHV0KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZENyYXZpbmdzID0gdm0uaW5wdXQuc3BsaXQoXCIrXCIpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2hvd1NlYXJjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRvIG5vdCB1bnN1YnNjcmliZSBpdCwgY296IHRoZSBoZWFkZXIgZG9lc24ndCBjaGFuZ2VcclxuICAgICAgICAgICAgLy9pZiAoc3RhdGVDaGFuZ2VkU3Vic2NyaWJlZCkge1xyXG4gICAgICAgICAgICAvLyAgICAkc2NvcGUuJG9mZignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIG5ld1NlYXJjaCk7XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcXVlcnlTZWFyY2gocXVlcnkpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeSA/IHZtLmNyYXZpbmdzLmZpbHRlcihjcmVhdGVGaWx0ZXJGb3IocXVlcnkpKSA6IFtdO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUZpbHRlckZvcihxdWVyeSkge1xyXG4gICAgICAgICAgICB2YXIgbG93ZXJjYXNlUXVlcnkgPSBhbmd1bGFyLmxvd2VyY2FzZShxdWVyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmaWx0ZXJGbihjcmF2aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNyYXZpbmcudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIvLyB0aGlzIGlzIGFuIGV4dHJhIGV4dGVybmFsIG1vZHVsZSBcbnJlcXVpcmUoJy4vd2lkZ2V0cy9uZ3BsdXMtb3ZlcmxheS5qcycpO1xuXG4vLyBjb3JlXG5yZXF1aXJlKCcuL2NvcmUvYXBwLmpzJyk7XG5yZXF1aXJlKCcuL2NvcmUvYXBwLmNvbnN0YW50LmpzJyk7XG5yZXF1aXJlKCcuL2NvcmUvbWFpbi5qcycpO1xucmVxdWlyZSgnLi9jb3JlL2NvbmZpZy5yb3V0ZXIuYWNjb3VudC5qcycpO1xucmVxdWlyZSgnLi9jb3JlL2NvbmZpZy5yb3V0ZXIuYWRtaW4uanMnKTtcbnJlcXVpcmUoJy4vY29yZS9jb25maWcucm91dGVyLmRpc2guanMnKTtcbnJlcXVpcmUoJy4vY29yZS9jb25maWcucm91dGVyLmpzJyk7XG5yZXF1aXJlKCcuL19hcHBIZWxwZXIuanMnKTtcbnJlcXVpcmUoJy4vX21hcEhlbHBlci5qcycpO1xuXG4vLyBsYXlvdXRcbnJlcXVpcmUoJy4vbGF5b3V0L2hlYWRlci5qcycpO1xucmVxdWlyZSgnLi9sYXlvdXQvaGVhZGVyLmNvbW1hbmRzLmpzJyk7XG5yZXF1aXJlKCcuL2xheW91dC9zZWFyY2guYmFyLmpzJyk7IC8vIFRPRE86IHRvIGJlIG1lcmdlZCBiYWNrIHRvIGhlYWRlclxucmVxdWlyZSgnLi9sYXlvdXQvbmF2YmFyLmxvY2F0aW9uLmpzJyk7XG5cbi8vIHN5c3RlbVxucmVxdWlyZSgnLi9zeXMvbG9jYXRpb24uanMnKTtcblxuLy8gYWNjb3VudFxucmVxdWlyZSgnLi9hY2NvdW50L2FjY291bnQuanMnKTtcbnJlcXVpcmUoJy4vYWNjb3VudC9hY2NvdW50LmxvZ2luLmpzJyk7XG5yZXF1aXJlKCcuL2FjY291bnQvYWNjb3VudC5zaWdudXAuanMnKTtcbnJlcXVpcmUoJy4vYWNjb3VudC9hY2NvdW50LnJlc2V0LmpzJyk7XG5yZXF1aXJlKCcuL2FjY291bnQvYWNjb3VudC5hY3RpdmF0ZS5qcycpO1xucmVxdWlyZSgnLi9hY2NvdW50L3Byb2ZpbGUuanMnKTtcbnJlcXVpcmUoJy4vYWNjb3VudC9wcm9maWxlLmFzc29jaWF0ZS5qcycpO1xucmVxdWlyZSgnLi9hY2NvdW50L3Byb2ZpbGUuYmFzaWMuanMnKTtcbnJlcXVpcmUoJy4vYWNjb3VudC9wcm9maWxlLmRpc2xpa2VjcmF2aW5ncy5qcycpO1xucmVxdWlyZSgnLi9hY2NvdW50L3Byb2ZpbGUudXBkYXRlcGFzc3dvcmQuanMnKTtcbnJlcXVpcmUoJy4vYWNjb3VudC9wcm9maWxlLmNyYXZpbmdoaXN0b3J5LmpzJyk7XG5yZXF1aXJlKCcuL2FjY291bnQvcHJvZmlsZS5mYXZvcml0ZS5qcycpO1xucmVxdWlyZSgnLi9hY2NvdW50L3Byb2ZpbGUubXlkaXNoLmpzJyk7XG5yZXF1aXJlKCcuL2FjY291bnQvcHJvZmlsZS5teXJldmlldy5qcycpO1xucmVxdWlyZSgnLi9hY2NvdW50L3Byb2ZpbGUuc2V0dGluZ3MuanMnKTtcblxuLy8gY3JhdmluZ3NcbnJlcXVpcmUoJy4vY3JhdmluZy9jcmF2aW5nLnRhZ3MuanMnKTtcbnJlcXVpcmUoJy4vY3JhdmluZy9jcmF2aW5nLnNlYXJjaC5qcycpO1xuXG4vLyBhZG1pblxucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi5qcycpO1xucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi5kaXNoZXMuanMnKTtcbnJlcXVpcmUoJy4vYWRtaW4vYWRtaW4ucmV2aWV3cy5qcycpO1xucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi51c2Vycy5qcycpO1xucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi5maWxlcy5qcycpO1xucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi5jcmF2aW5ndGFncy5qcycpO1xucmVxdWlyZSgnLi9hZG1pbi9hZG1pbi5jYWNoZS5qcycpO1xyXG5yZXF1aXJlKCcuL2FkbWluL2FkbWluLm1vZGVyYXRpb24ubW9kYWwuanMnKTtcblxuLy8gZGlzaFxucmVxdWlyZSgnLi9kaXNoL2Rpc2guYWRkLmpzJyk7XG5yZXF1aXJlKCcuL2Rpc2gvbWFwLmFkZC5qcycpO1xucmVxdWlyZSgnLi9kaXNoL21hcC52aWV3ZXIuanMnKTtcbnJlcXVpcmUoJy4vZGlzaC9kaXNoLmRldGFpbC5qcycpO1xucmVxdWlyZSgnLi9kaXNoL2Rpc2guYWRkSW1hZ2UuanMnKTtcbnJlcXVpcmUoJy4vZGlzaC9kaXNoLmFkZFRhZ3MuanMnKTtcbnJlcXVpcmUoJy4vZGlzaC9pbWFnZS5tb2RhbC5qcycpO1xucmVxdWlyZSgnLi9kaXNoL2Rpc2gucmVjZW50LmpzJyk7XG5cbi8vcHJvcG9zYWxcbnJlcXVpcmUoJy4vcHJvcG9zYWwvcHJvcG9zYWwubXkuanMnKTtcbnJlcXVpcmUoJy4vcHJvcG9zYWwvcHJvcG9zYWwudmlldy5qcycpO1xucmVxdWlyZSgnLi9wcm9wb3NhbC9wcm9wb3NhbC5tb2RhbC5qcycpO1xuXG4vL3Jlc3RhdXJhbnRcbnJlcXVpcmUoJy4vcmVzdGF1cmFudC9yZXN0YXVyYW50LmpzJyk7XG5yZXF1aXJlKCcuL3Jlc3RhdXJhbnQvc2luZ2xlUmFuZG9tUmVzdGF1cmFudC5qcycpO1xuXG4vLyBkaW5lciBcbnJlcXVpcmUoJy4vdXNlci9kaW5lci5kZXRhaWwuanMnKTsgLy8gdGhlIG9wZW5pbmcgbG9naWMgaXMgZGlmZmVyZW50IFxuXG4vLyB3aWRnZXRzXG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3dpZGdldHMvb25MYXN0UmVwZWF0LmpzJyk7XG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3dpZGdldHMvbmdDb25maXJtQ2xpY2suanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvd2lkZ2V0cy9hY2Nlc3MuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvd2lkZ2V0cy9jcmF2aW5nU2VsZWN0LmpzJyk7XG5yZXF1aXJlKCcuL3dpZGdldHMvY29tcGFyZVRvLmpzJyk7IC8vIE5FVyBmb3IgbmctbWVzc2FnZSBcbnJlcXVpcmUoJy4vd2lkZ2V0cy9kaXNoRHVwbGljYXRpb25DaGVjay5qcycpO1xucmVxdWlyZSgnLi93aWRnZXRzL2RpckRpc3F1cy5qcycpOyBcbnJlcXVpcmUoJy4vd2lkZ2V0cy9maWxlRmllbGQuanMnKTsgXG5cbi8vIHNlcnZpY2VzXG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3NlcnZpY2VzL3NlcnZpY2UubW9kdWxlLmpzJyk7XG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3NlcnZpY2VzL2F1dGhTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3NlcnZpY2VzL3JlZmVyZW5jZURhdGFTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3NlcnZpY2VzL2dlb1NlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvY3JhdmluZ1NlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvcmVzdGF1cmFudFNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvZGluZXJTZXJ2aWNlLmpzJyk7XG5cbnJlcXVpcmUoJy4vc2VydmljZXMvbG9nZ2VyU2VydmljZS5qcycpOyAvLyBORVchIGNveiB3ZSBhcmUgdXNpbmcgYSBkaWZmZXJlbnQgdG9hc3QgbXNnIGhhbmRsZXJcbnJlcXVpcmUoJy4vc2VydmljZXMvbW9kYWxTZXJ2aWNlLmpzJyk7IC8vIE5FVyEgdXNpbmcgTUQgZGlhbG9nXG5yZXF1aXJlKCcuL3NlcnZpY2VzL2ZpbGVTZXJ2aWNlLmpzJyk7XG5cbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvbmF2aWdhdGlvblNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvZmFjdHVhbFNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvcmVjZW50RGlzaFNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvcHJvcG9zYWxTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuLi9vdXJjcmF2aW5nL3NlcnZpY2VzL2xvYWRlckZhY3RvcnkuanMnKTtcbnJlcXVpcmUoJy4uL291cmNyYXZpbmcvc2VydmljZXMvcmVzdW1lU2VydmljZS5qcycpO1xucmVxdWlyZSgnLi4vb3VyY3JhdmluZy9zZXJ2aWNlcy9hZG1pblNlcnZpY2UuanMnKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb3Bvc2FsTW9kYWxDb250cm9sbGVyJywgbW9kYWxQcm9wb3NhbENvbnRyb2xsZXIpO1xyXG5cclxuICAgIG1vZGFsUHJvcG9zYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJ01vZGFsU2VydmljZScsICdtb2RhbEl0ZW0nXTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2RhbFByb3Bvc2FsQ29udHJvbGxlcihtb2RhbFNlcnZpY2UsIG1vZGFsSXRlbSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uRGlzaCA9IG1vZGFsSXRlbS5EaXNoO1xyXG4gICAgICAgIHZtLlByb3Bvc2FsID0gbW9kYWxJdGVtLlByb3Bvc2FsO1xyXG4gICAgICAgIHZtLkFscmVhZHlJbiA9IG1vZGFsSXRlbS5BbHJlYWR5SW4gfHwgZmFsc2U7XHJcbiAgICAgICAgdm0ucHJvcG9zYWxEYXRhID0geyBuYW1lOiAnJ307XHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5zdWJtaXRNb2RhbChyZXN1bHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLmdldFByb3Bvc2FsVGl0bGUgPSBmdW5jdGlvbiAocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgLy8gdGhpcyBpcyBkdXBsaWNhdGUgdG8gdGhlIHByb3Bvc2FsLm15LmpzXHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IFwiVW5uYW1lZFwiO1xyXG4gICAgICAgICAgICBpZiAocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICghKHByb3Bvc2FsLk5hbWUgPT09IG51bGwgfHwgcHJvcG9zYWwuTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHByb3Bvc2FsLk5hbWUgPT09IFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gcHJvcG9zYWwuTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignTXlQcm9wb3NhbENvbnRyb2xsZXInLCBteVByb3Bvc2FsQ29udHJvbGxlcik7XHJcblxyXG4gICAgbXlQcm9wb3NhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnUHJvcG9zYWxTZXJ2aWNlJywgJ0RpbmVyU2VydmljZScsICdSZXN0YXVyYW50U2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsXHJcbiAgICAgICAgJyR0aW1lb3V0JywgJyRyb290U2NvcGUnLCckc2NvcGUnXTtcclxuXHJcbiAgICAvLyBUT0RPOiAgSSBkb24ndCBsaWtlIHRoaXMgY29udHJvbGxlciBhdCB0aGlzIHBvaW50LCBiZWNhdXNlIGl0IGFuZCBQcm9wb3NhbFNlcnZpY2UgYXJlIG1peGluZyBzb21lIGxvZ2ljIGluIGJvdGggcGxhY2VzIFxyXG4gICAgLy8gaWRlYWxseSwgdGhlIFByb3Bvc2FsU2VydmljZSBzaG91bGQgYmUgZHVtYiwgYW5kIGl0IHNpbXBseSBoaXRzIHRoZSBSRVNULiBcclxuICAgIC8vIGhvd2V2ZXIsIHRoZSBQcm9wb3NhbFNlcnZpY2UgbXVzdCBoYW5kbGUgdGhlIGxvZ2ljIG9mIGFuIHVuc2F2ZWQgcHJvcG9zYWwsIHdoaWNoIGNhbiBiZSBpbnRlcmFjdGVkIHdpdGggb3RoZXIgY29udHJvbGxlcnMgXHJcbiAgICAvLyBuZWVkIHRvIGZpZ3VyZSBvdXQgYSBiZXR0ZXIgd2F5IHRvIG1hbmFnZSB0aGVzZSByZWxhdGlvbnNoaXBcclxuICAgIGZ1bmN0aW9uIG15UHJvcG9zYWxDb250cm9sbGVyKHByb3Bvc2FsU2VydmljZSwgZGluZXJTZXJ2aWNlLCByZXN0U2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgJHRpbWVvdXQsICRyb290U2NvcGUsICRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmRpbmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLm92ZXJsYXlUaXRsZSA9IFwiQ3JhdmluZyBQcm9wb3NhbFwiO1xyXG4gICAgICAgIHZtLmNvdmVyQ2xhc3MgPSBcImJnLWNyYXZpbmctcHJvcG9zYWxcIjtcclxuICAgICAgICB2bS5wcm9maWxlID0ge307XHJcbiAgICAgICAgdm0ucHJvcG9zYWxzID0gW107XHJcbiAgICAgICAgdm0udm90ZXMgPSBbXTtcclxuICAgICAgICB2bS5jdXJyZW50S2V5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0ucHJvcG9zYWxVcmwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0udGl0bGVJbkVkaXQgPSBmYWxzZTtcclxuICAgICAgICB2bS51cGRhdGluZ1Byb3Bvc2FsTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdm0uaGFzQW55RXhwaXJlZFByb3Bvc2FsID0gZmFsc2U7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdm0uaXNMb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0uZ2V0UHJvcG9zYWxUaXRsZSA9IGdldFByb3Bvc2FsVGl0bGU7XHJcbiAgICAgICAgdm0uY2hlY2tBY3RpdmUgPSBjaGVja0FjdGl2ZTtcclxuICAgICAgICB2bS5leHRlbmRQcm9wb3NhbCA9IGV4dGVuZFByb3Bvc2FsO1xyXG4gICAgICAgIHZtLmV4cGlyZVByb3Bvc2FsID0gZXhwaXJlUHJvcG9zYWw7XHJcbiAgICAgICAgdm0uaXNFeHBpcmVkID0gaXNFeHBpcmVkO1xyXG4gICAgICAgIHZtLmZvcm1hdGVEYXRlID0gZm9ybWF0ZURhdGU7XHJcbiAgICAgICAgdm0uY29weVVybCA9IGNvcHlVcmw7XHJcbiAgICAgICAgdm0uZ2V0SXRlcmF0aW9ucyA9IGdldEl0ZXJhdGlvbnM7XHJcbiAgICAgICAgdm0udm90ZUl0ZW0gPSB2b3RlSXRlbTtcclxuICAgICAgICB2bS5yZW1vdmVJdGVtID0gcmVtb3ZlSXRlbTtcclxuICAgICAgICB2bS5yZW1vdmVQcm9wb3NhbCA9IHJlbW92ZVByb3Bvc2FsO1xyXG4gICAgICAgIHZtLnNhdmVQcm9wb3NhbE5hbWUgPSBzYXZlUHJvcG9zYWxOYW1lO1xyXG4gICAgICAgIHZtLmZpbHRlckJ5QWN0aXZlID0gZmlsdGVyQnlBY3RpdmU7XHJcbiAgICAgICAgdm0uZmlsdGVyQnlFeHBpcmF0aW9uID0gZmlsdGVyQnlFeHBpcmF0aW9uO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9wb3NhbFRpdGxlKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IFwiVW5uYW1lZFwiO1xyXG4gICAgICAgICAgICBpZiAocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICghKHByb3Bvc2FsLk5hbWUgPT09IG51bGwgfHwgcHJvcG9zYWwuTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHByb3Bvc2FsLk5hbWUgPT09IFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gcHJvcG9zYWwuTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzYXZlUHJvcG9zYWxOYW1lKCkge1xyXG4gICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWRQcm9wb3NhbC5OYW1lICE9PSB2bS51cGRhdGluZ1Byb3Bvc2FsTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcG9zYWxTZXJ2aWNlLnVwZGF0ZU5hbWUodm0uc2VsZWN0ZWRQcm9wb3NhbC5JZCwgdm0udXBkYXRpbmdQcm9wb3NhbE5hbWUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRQcm9wb3NhbC5OYW1lID0gdm0udXBkYXRpbmdQcm9wb3NhbE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udGl0bGVJbkVkaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbygnJyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVycm9yKGVyciwgdm0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGVja0FjdGl2ZShwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICB2YXIgcmV0dmFsID0gJHJvb3RTY29wZS4kc3RhdGUuaXMoJ3Byb3Bvc2FsLmhvbWUuZGV0YWlsJywgeyAna2V5JzogcHJvcG9zYWwuS2V5IH0pIHx8XHJcbiAgICAgICAgICAgICAgICAodm0ucHJvcG9zYWxzLmxlbmd0aCA+IDAgJiYgdm0ucHJvcG9zYWxzWzBdLktleSA9PT0gcHJvcG9zYWwuS2V5ICYmIHZtLmN1cnJlbnRLZXkgPT09IHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmV0dmFsKSByZXR1cm4gXCJhY3RpdmVcIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRlRGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5oZWxwZXIuZm9ybWF0RGF0ZShkKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc0V4cGlyZWQocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgaWYgKHByb3Bvc2FsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChwcm9wb3NhbC5Jc0V4cGlyZWQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29weVVybCgpIHtcclxuICAgICAgICAgICAgd2luZG93LnByb21wdChcIkNvcHkgdG8gY2xpcGJvYXJkOiBDdHJsK0MsIEVudGVyXCIsIHZtLnByb3Bvc2FsVXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckJ5QWN0aXZlKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wb3NhbC5Jc0V4cGlyZWQgPT09IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaWx0ZXJCeUV4cGlyYXRpb24ocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3Bvc2FsLklzRXhwaXJlZCA9PT0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHRlbmRQcm9wb3NhbChwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuZXh0ZW5kUHJvcG9zYWwocHJvcG9zYWwuSWQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIG5vdyBJIGRvbid0IHdhbnQgdG8gcmV0cmlldmUgaXQgYWdhaW4gZnJvbSB0aGUgc2VydmVyIHNpZGUgdG8gcmVmcmVzaCBpdCwgSSBrbm93IGl0IGNvdWxkIGNhdXNlIHByb2JsZW1cclxuICAgICAgICAgICAgICAgICAgICAvLyBtb3Jlb3ZlciwgYW4gdW5zYXZlZCBwcm9wb3NhbCBzaW1wbHkgZG9lc24ndCBoYXZlIGEgcmVjb3JkIGluIERCIHlldCBcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbC5FeHBpcmF0aW9uRGF0ZSA9IHdpbmRvdy5oZWxwZXIuZ2V0VG9kYXlQbHVzKDMwKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbC5Jc0V4cGlyZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0hhc0FueUV4cGlyZWRQcm9wb3NhbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc3RFcnJvcignRmFpbGVkIHRvIGV4cGlyZSBwcm9wb3NhbCBkdWUgdG86JyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGV4cGlyZVByb3Bvc2FsKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIHByb3Bvc2FsU2VydmljZS5leHBpcmVQcm9wb3NhbChwcm9wb3NhbC5JZCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbC5FeHBpcmF0aW9uRGF0ZSA9IHdpbmRvdy5oZWxwZXIuZ2V0VG9kYXlQbHVzKC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbC5Jc0V4cGlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmhhc0FueUV4cGlyZWRQcm9wb3NhbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVycm9yKCdGYWlsZWQgdG8gZXhwaXJlIHByb3Bvc2FsIGR1ZSB0bzonICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdm90ZUl0ZW0oaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAocHJvcG9zYWxTZXJ2aWNlLmhhc1ZvdGVkKGl0ZW0sIHZtLnByb2ZpbGUuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBwb3N0SW5mbygnJyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UucmVtb3ZlVm90ZSh2bS5zZWxlY3RlZFByb3Bvc2FsLCBpdGVtKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldFByb3Bvc2FsRGV0YWlsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBhIHVzZXIgbWlnaHQgYmUgYWJsZSB0byB2b3RlIG1vcmUgdGhhbiAxIHBlciBwcm9wb3NhbCAoaW4gdGhlIGZ1dHVyZSkgXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcG9zYWxTZXJ2aWNlLmNhblZvdGUodm0uc2VsZWN0ZWRQcm9wb3NhbCwgdm0ucHJvZmlsZS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuY2FzdFZvdGUodm0uc2VsZWN0ZWRQcm9wb3NhbCwgaXRlbSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbygnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGJhZCBmb3IgcGVyZm9ybWFuY2UsIGJ1dCBpdCdzIHRoZSBxdWlja2VzdCB3YXkgdG8gcmVmcmVzaCB0aGUgZGF0YSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb3Bvc2FsRGV0YWlsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnZvdGVzW2l0ZW0uUmVzdGF1cmFudElkXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0RXJyb3IoJ1ZvdGUgZmFpbGVkOiBpdCBpcyBsaWtlbHkgdGhhdCB5b3UgaGF2ZSBhbHJlYWR5IHZvdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnZvdGVzW2l0ZW0uUmVzdGF1cmFudElkXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc3RFcnJvcignWW91IGhhdmUgYWxyZWFkeSB2b3RlZCEgWW91IGNhbiBvbmx5IHZvdGUgb25jZSBpbiBlYWNoIHByb3Bvc2FsLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0pIHtcclxuICAgICAgICAgICAgLy8gd2Ugc3RpbGwgd2FudCB0byBkbyBhIGNsaWVudC1zaWRlIGNoZWNrIGV2ZW4gdGhlIHNlcnZlciBzaWRlIGFscmVhZHkgY2hlY2tzXHJcbiAgICAgICAgICAgIGlmICh2bS5wcm9maWxlLmlkID09PSB2bS5zZWxlY3RlZFByb3Bvc2FsLkNyZWF0b3JJZCkge1xyXG4gICAgICAgICAgICAgICAgcHJvcG9zYWxTZXJ2aWNlLnJlbW92ZUl0ZW0odm0uc2VsZWN0ZWRQcm9wb3NhbCwgaXRlbSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmluZElkeCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLnNlbGVjdGVkUHJvcG9zYWwuSXRlbXMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWRQcm9wb3NhbC5JdGVtc1tpZHhdLkRpc2hJZCA9PT0gaXRlbS5EaXNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRJZHggPSBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmluZElkeCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwuSXRlbXMuc3BsaWNlKGZpbmRJZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzeW5jVG90YWxJdGVtcyh2bS5zZWxlY3RlZFByb3Bvc2FsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zdEluZm8oJ1JlbW92ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVycm9yKCdPbmx5IHByb3Bvc2FsIG93bmVyIGNhbiByZW1vdmUgb3B0aW9uLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwb3N0RXJyb3IoJ09ubHkgcHJvcG9zYWwgb3duZXIgY2FuIHJlbW92ZSBvcHRpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVByb3Bvc2FsKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5wcm9maWxlLmlkID09PSB2bS5zZWxlY3RlZFByb3Bvc2FsLkNyZWF0b3JJZCkge1xyXG4gICAgICAgICAgICAgICAgcHJvcG9zYWxTZXJ2aWNlLnJlbW92ZUNhcnQocHJvcG9zYWwuSWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UuZ28oJ3Byb3Bvc2FsLmhvbWUnLCB7fSwgeyAncmVsb2FkJzogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0RXJyb3IoJ1RyeWluZyB0byBkZWxldGUgcHJvcG9zYWwgZmFpbGVkLCBwcm9iYWJseSBkdWUgdG8gdW50aG9yaXplZC4gSWYgeW91IHRoaW5rIHRoaXMgaXMgd3JvbmcsIHBsZWFzZSBjb250YWN0IHVzLiAnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9zdEVycm9yKCdPbmx5IHByb3Bvc2FsIG93bmVyIGNhbiBkZWxldGUgcHJvcG9zYWwuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEl0ZXJhdGlvbnMoY291bnRlcikge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50ZXI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKGkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGhlbHBlcnNcclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldE15UHJvZmlsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZmlsZSA9IGRpbmVyU2VydmljZS5wcm9maWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIHByb3Bvc2FsU2VydmljZS5nZXRCeURpbmVyKHZtLnByb2ZpbGUuaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvcG9zYWxzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodm0ucHJvcG9zYWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VycmVudEtleSA9ICRyb290U2NvcGUuJHN0YXRlUGFyYW1zLmtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmN1cnJlbnRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLnByb3Bvc2Fscy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnByb3Bvc2Fsc1tpZHhdLktleSA9PT0gdm0uY3VycmVudEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZFByb3Bvc2FsID0gdm0ucHJvcG9zYWxzW2lkeF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwgPSB2bS5wcm9wb3NhbHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5zZWxlY3RlZFByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb3Bvc2FsVXJsID0gcHJvcG9zYWxTZXJ2aWNlLmdldFByb3Bvc2FsVXJsKHZtLnNlbGVjdGVkUHJvcG9zYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9wb3NhbERldGFpbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVBhZ2VUaXRsZSgnQ3JhdmluZyBQcm9wb3NhbCAtICcgKyBnZXRQcm9wb3NhbFRpdGxlKHZtLnNlbGVjdGVkUHJvcG9zYWwpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tIYXNBbnlFeHBpcmVkUHJvcG9zYWwoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIG1lYW5zIHRoaXMgdXNlciBpcyBub3QgYXV0aGVudGljYXRlZCB5ZXQsIFxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogdXNlIHRoZSByZXN1bWVTZXJ2aWNlIGhlcmUgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvcG9zYWxEZXRhaWwoKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgb25lIGdldHMgdGhlIGZ1bGwgZGV0YWlsLCBpbmNsdWRpbmcgaXRlbXMgYW5kIHZvdGVzIFxyXG4gICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuZ2V0QnlLZXkodm0uc2VsZWN0ZWRQcm9wb3NhbC5LZXkpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwgPSByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXBkYXRpbmdQcm9wb3NhbE5hbWUgPSB2bS5zZWxlY3RlZFByb3Bvc2FsLk5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnNlbGVjdGVkUHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVm90ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrSGFzQW55RXhwaXJlZFByb3Bvc2FsKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB2bS5wcm9wb3NhbHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLnByb3Bvc2Fsc1tpZHhdLklzRXhwaXJlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmhhc0FueUV4cGlyZWRQcm9wb3NhbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZvdGVzKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMCA7IHggPCB2bS5zZWxlY3RlZFByb3Bvc2FsLkl0ZW1zLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZtLnNlbGVjdGVkUHJvcG9zYWwuSXRlbXNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5Wb3RlcyAmJiBpdGVtLlZvdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGl0ZW0uVm90ZXMubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnByb2ZpbGUuaWQgPT09IGl0ZW0uVm90ZXNbeV0uRGluZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udm90ZXNbaXRlbS5SZXN0YXVyYW50SWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9zdEluZm8obWVzc2FnZSkge1xyXG4gICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9zdEVycm9yKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzeW5jVG90YWxJdGVtcyhwcm9wb3NhbCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdm0ucHJvcG9zYWxzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodm0ucHJvcG9zYWxzW2lkeF0uS2V5ID09PSBwcm9wb3NhbC5LZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ucHJvcG9zYWxzW2lkeF0uVG90YWxJdGVtcyA9IHZtLnByb3Bvc2Fsc1tpZHhdLlRvdGFsSXRlbXMgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwcm9wb3NhbC5Ub3RhbEl0ZW1zID0gcHJvcG9zYWwuVG90YWxJdGVtcyAtIDE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdWaWV3UHJvcG9zYWxDb250cm9sbGVyJywgdmlld1Byb3Bvc2FsQ29udHJvbGxlcik7XHJcblxyXG4gICAgdmlld1Byb3Bvc2FsQ29udHJvbGxlci4kaW5qZWN0ID0gWydQcm9wb3NhbFNlcnZpY2UnLCAnRGluZXJTZXJ2aWNlJywgJ1Jlc3RhdXJhbnRTZXJ2aWNlJywgJ05hdmlnYXRpb25TZXJ2aWNlJyxcclxuICAgICAgICAnJHRpbWVvdXQnLCAnJHJvb3RTY29wZScsICckc2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3UHJvcG9zYWxDb250cm9sbGVyKHByb3Bvc2FsU2VydmljZSwgZGluZXJTZXJ2aWNlLCByZXN0U2VydmljZSwgbmF2aWdhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgJHRpbWVvdXQsICRyb290U2NvcGUsICRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBjb25maXJtID0gJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuY29uZmlybTtcclxuXHJcbiAgICAgICAgdm0uZGluZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0ub3ZlcmxheVRpdGxlID0gXCJDcmF2aW5nIFByb3Bvc2FsXCI7XHJcbiAgICAgICAgdm0uY292ZXJDbGFzcyA9IFwiYmctY3JhdmluZy1wcm9wb3NhbFwiO1xyXG5cclxuICAgICAgICB2bS5wcm9maWxlID0ge307XHJcbiAgICAgICAgdm0ucHJvcG9zYWxzID0gW107XHJcbiAgICAgICAgdm0udm90ZXMgPSBbXTtcclxuICAgICAgICB2bS5jdXJyZW50S2V5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0ucHJvcG9zYWxVcmwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0uc2F2ZWRTdWNjZXNzZnVsbHkgPSBmYWxzZTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdm0uaXNMb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0uZ2V0UHJvcG9zYWxUaXRsZSA9IGdldFByb3Bvc2FsVGl0bGU7XHJcbiAgICAgICAgdm0uZm9ybWF0ZURhdGUgPSBmb3JtYXRlRGF0ZTtcclxuICAgICAgICB2bS52b3RlSXRlbSA9IHZvdGVJdGVtO1xyXG4gICAgICAgIHZtLmdldEl0ZXJhdGlvbnMgPSBnZXRJdGVyYXRpb25zO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9wb3NhbFRpdGxlKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IFwiVW5uYW1lZFwiO1xyXG4gICAgICAgICAgICBpZiAocHJvcG9zYWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICghKHByb3Bvc2FsLk5hbWUgPT09IG51bGwgfHwgcHJvcG9zYWwuTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHByb3Bvc2FsLk5hbWUgPT09IFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gcHJvcG9zYWwuTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRlRGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5oZWxwZXIuZm9ybWF0RGF0ZShkKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB2b3RlSXRlbShpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wb3NhbFNlcnZpY2UuaGFzVm90ZWQoaXRlbSwgdm0ucHJvZmlsZS5pZCkpIHtcclxuICAgICAgICAgICAgICAgIHBvc3RJbmZvKCcnKTtcclxuICAgICAgICAgICAgICAgIHByb3Bvc2FsU2VydmljZS5yZW1vdmVWb3RlKHZtLnNlbGVjdGVkUHJvcG9zYWwsIGl0ZW0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0UHJvcG9zYWxEZXRhaWwoKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBhIHVzZXIgbWlnaHQgYmUgYWJsZSB0byB2b3RlIG1vcmUgdGhhbiAxIHBlciBwcm9wb3NhbCAoaW4gdGhlIGZ1dHVyZSkgXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcG9zYWxTZXJ2aWNlLmNhblZvdGUodm0uc2VsZWN0ZWRQcm9wb3NhbCwgdm0ucHJvZmlsZS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuY2FzdFZvdGUodm0uc2VsZWN0ZWRQcm9wb3NhbCwgaXRlbSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbygnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGJhZCBmb3IgcGVyZm9ybWFuY2UsIGJ1dCBpdCdzIHRoZSBxdWlja2VzdCB3YXkgdG8gcmVmcmVzaCB0aGUgZGF0YSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb3Bvc2FsRGV0YWlsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnZvdGVzW2l0ZW0uUmVzdGF1cmFudElkXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0RXJyb3IoJ1ZvdGUgZmFpbGVkOiBpdCBpcyBsaWtlbHkgdGhhdCB5b3UgaGF2ZSBhbHJlYWR5IHZvdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnZvdGVzW2l0ZW0uUmVzdGF1cmFudElkXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc3RFcnJvcignWW91IGhhdmUgYWxyZWFkeSB2b3RlZCEgWW91IGNhbiBvbmx5IHZvdGUgb25jZSBpbiBlYWNoIHByb3Bvc2FsLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRJdGVyYXRpb25zKGNvdW50ZXIpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudGVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGRhdGEucHVzaChpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRLZXkgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5rZXk7XHJcbiAgICAgICAgICAgIGlmICh2bS5jdXJyZW50S2V5KSB7XHJcbiAgICAgICAgICAgICAgICBnZXRQcm9wb3NhbERldGFpbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBzaG91bGQgZGlzcGxheSB0aGUganVzdC1hZGRlZCBkaXNoIG5hbWVcclxuICAgICAgICAgICAgICAgICAgICBwb3N0SW5mbygnRGlzaCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgY3JhdmluZyBwcm9wb3NhbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9zdEVycm9yKCdhaCwgeW91IG5lZWQgYSBLZXkgdG8gb3BlbiBhIENyYWluZyBQcm9wb3NhbC4gT3IgY3JlYXRlIHlvdXIgb3duIG9uZSBub3cuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZvdGVzKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMCA7IHggPCB2bS5zZWxlY3RlZFByb3Bvc2FsLkl0ZW1zLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZtLnNlbGVjdGVkUHJvcG9zYWwuSXRlbXNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5Wb3RlcyAmJiBpdGVtLlZvdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGl0ZW0uVm90ZXMubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnByb2ZpbGUuaWQgPT09IGl0ZW0uVm90ZXNbeV0uRGluZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udm90ZXNbaXRlbS5SZXN0YXVyYW50SWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvcG9zYWxEZXRhaWwoKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgb25lIGdldHMgdGhlIGZ1bGwgZGV0YWlsLCBpbmNsdWRpbmcgaXRlbXMgYW5kIHZvdGVzIFxyXG4gICAgICAgICAgICBwcm9wb3NhbFNlcnZpY2UuZ2V0QnlLZXkodm0uY3VycmVudEtleSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRQcm9wb3NhbCA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkUHJvcG9zYWwgPSByZXNwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWRQcm9wb3NhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uc2VsZWN0ZWRQcm9wb3NhbC5Jc0V4cGlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RFcnJvcignVGhpcyBjcmF2aW5nIHByb3Bvc2FsIGhhcyBleHBpcmVkLiBZb3UgYXJlIHRvbyBsYXRlLiBUaGV5IGhhdmUgZ29uZSBmb3IgdGhlIGZvb2Qgd2l0aG91dCB5b3UuICcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVm90ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RJbmZvKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVBhZ2VUaXRsZSgnQ3JhdmluZyBQcm9wb3NhbCAtICcgKyBnZXRQcm9wb3NhbFRpdGxlKHZtLnNlbGVjdGVkUHJvcG9zYWwpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ucHJvcG9zYWxVcmwgPSBwcm9wb3NhbFNlcnZpY2UuZ2V0UHJvcG9zYWxVcmwodm0uc2VsZWN0ZWRQcm9wb3NhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVycm9yKCdTbmFwISBUaGUgQ3JhdmluZyBQcm9wb3NhbCB5b3UgYXJlIHRyeWluZyB0byBvcGVuIGRvZXMgbm90IGV4aXN0IGFueW1vcmUuIENoZWNrIHdpdGggeW91ciBmcmllbmQuICcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3N0SW5mbyhtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3N0RXJyb3IobWVzc2FnZSkge1xyXG4gICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdSZXN0YXVyYW50Q29udHJvbGxlcicsIHJlc3RhdXJhbnRDb250cm9sbGVyKTtcclxuXHJcbiAgICByZXN0YXVyYW50Q29udHJvbGxlci4kaW5qZWN0ID0gWydSZXN0YXVyYW50U2VydmljZScsICdOYXZpZ2F0aW9uU2VydmljZScsICd1aUdtYXBHb29nbGVNYXBBcGknLCAnRmFjdHVhbFNlcnZpY2UnLFxyXG4gICAgICAgICckcm9vdFNjb3BlJywgJyRzY29wZScsXHJcbiAgICAgICAgJ2ZpbGVTZXJ2aWNlJywgJyR0aW1lb3V0J107XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzdGF1cmFudENvbnRyb2xsZXIocmVzdGF1cmFudFNlcnZpY2UsIG5hdmlnYXRpb25TZXJ2aWNlLCBtYXBBcGksIGZhY3R1YWxTZXJ2aWNlLFxyXG4gICAgICAgICRyb290U2NvcGUsICRzY29wZSxcclxuICAgICAgICBmaWxlU2VydmljZSwgJHRpbWVvdXQpIHtcclxuXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5jcmF2aW5ncyA9IFtdO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkQ3JhdmluZ3MgPSBbXTtcclxuICAgICAgICB2bS5kaXNoZXMgPSBbXTtcclxuICAgICAgICB2bS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB2bS5pc1ZhbGlkID0gdHJ1ZTtcclxuICAgICAgICB2bS5SZXN0YXVyYW50TmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdm0ucmVzdGF1cmFudHMgPSBbXTtcclxuICAgICAgICB2bS5pdGVtcyA9IFtdO1xyXG4gICAgICAgIHZtLm1hcCA9IHt9O1xyXG4gICAgICAgIHZtLm1hcC5tYXJrZXJzID0gW107XHJcbiAgICAgICAgdm0ubWFwLnVzZXJNYXJrZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdm0ubWFwLnNlbGVjdGVkTWFya2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgdm0uZ2V0UHJldmlld0ltYWdlID0gZ2V0UHJldmlld0ltYWdlO1xyXG4gICAgICAgIHZtLmlzQ3JhdmluZ1NlbGVjdGVkID0gaXNDcmF2aW5nU2VsZWN0ZWQ7XHJcbiAgICAgICAgdm0uc2VsZWN0Q3JhdmluZyA9IHNlbGVjdENyYXZpbmc7XHJcbiAgICAgICAgdm0uZmlsdGVyRGlzaCA9IGZpbHRlckRpc2g7XHJcbiAgICAgICAgdm0ubG9jYXRlID0gbG9jYXRlO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgdm0ucmVzdGF1cmFudElkID0gJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMuaWQ7XHJcbiAgICAgICAgICAgIGlmICh2bS5yZXN0YXVyYW50SWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBtYXBBcGkudGhlbihmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ucG9zaXRpb24gPSAkcm9vdFNjb3BlLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnBvc2l0aW9uID0gd2luZG93LmhlbHBlci5nZXREZWZhdWx0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUNlbnRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkQ3JhdmluZ3MoKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkRGlzaGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJSZXN0YXVyYW50IElkIGlzIG1pc3NpbmcuIFRoZSBVUkwgaXMgaW52YWxpZC4gUmVkaXJlY3RpbmcgeW91IHRvIHRoZSBob21lIHBhZ2Ugbm93Li4uXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5pc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBnb2hvbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRlKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IGZpbmRNYXJrZXIoaXRlbS5mYWN0dWFsX2lkKTtcclxuICAgICAgICAgICAgaWYgKG1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0TWFya2VyKG1hcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFByZXZpZXdJbWFnZSh1cmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlLmdldFNhZmVQcmV2aWV3SW1hZ2UodXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzQ3JhdmluZ1NlbGVjdGVkKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZtLnNlbGVjdGVkQ3JhdmluZ3MuaW5kZXhPZihpdGVtKSA+IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0Q3JhdmluZyhpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBpZHggPSB2bS5zZWxlY3RlZENyYXZpbmdzLmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmIChpZHggPiAtMSkgdm0uc2VsZWN0ZWRDcmF2aW5ncy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgZWxzZSB2bS5zZWxlY3RlZENyYXZpbmdzLnB1c2goaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBhcHBseUZpbHRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZENyYXZpbmdzKCkge1xyXG4gICAgICAgICAgICByZXN0YXVyYW50U2VydmljZS5nZXRDcmF2aW5ncyh2bS5yZXN0YXVyYW50SWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jcmF2aW5ncyA9IHJlc3BvbnNlLmRhdGEuQ3JhdmluZ3M7XHJcbiAgICAgICAgICAgICAgICB2bS5yZXN0YXVyYW50TmFtZSA9IHJlc3BvbnNlLmRhdGEuUmVzdGF1cmFudE5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVBhZ2VUaXRsZSgnUmVzdGF1cmFudCAtICcgKyB2bS5yZXN0YXVyYW50TmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9hZFJlc3RhdXJhbnRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWREaXNoZXMoKSB7XHJcbiAgICAgICAgICAgIHJlc3RhdXJhbnRTZXJ2aWNlLmdldERpc2hlcyh2bS5yZXN0YXVyYW50SWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNoZXMgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRSZXN0YXVyYW50TG9jYXRpb24oKSB7XHJcbiAgICAgICAgICAgIGZhY3R1YWxTZXJ2aWNlLmdldEJ5TmFtZSh2bS5yZXN0YXVyYW50TmFtZSwgdm0ucG9zaXRpb24udXNlckxvY2F0aW9uLmNpdHkpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN0YXVyYW50cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGRhdGEucmVzcG9uc2UuZGF0YS5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuaGVscGVyLmhhc0R1cGxpY2F0aW9uKGRhdGEucmVzcG9uc2UuZGF0YVtpZHhdLCByZXN0YXVyYW50cykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0YXVyYW50cy5wdXNoKGRhdGEucmVzcG9uc2UuZGF0YVtpZHhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRlUmVzdGF1cmFudChyZXN0YXVyYW50cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckRpc2goYykge1xyXG4gICAgICAgICAgICByZXR1cm4gYy5pc0ZpbHRlcmVkID09PSB1bmRlZmluZWQgfHwgYy5pc0ZpbHRlcmVkID09PSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5RmlsdGVyKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9GaWx0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHZtLnNlbGVjdGVkQ3JhdmluZ3MubGVuZ3RoID09PSAwIHx8IHZtLnNlbGVjdGVkQ3JhdmluZ3MubGVuZ3RoID09PSB2bS5jcmF2aW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIG5vRmlsdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkVGFncyA9IHZtLnNlbGVjdGVkQ3JhdmluZ3MubWFwKGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5DcmF2aW5nVGFnO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLmRpc2hlcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzaCA9IHZtLmRpc2hlc1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vRmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzaC5pc0ZpbHRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2guaXNGaWx0ZXJlZCA9IHRydWU7IC8vIGFzc3VtaW5nIHRoaXMgZGlzaCBpcyBvdXQsIGJ1dCBpZiB3ZSBmb3VuZCBhbnkgdGFnIGlzIGluIHRoZSBzZWxlY3RlZCwgd2Ugc3RvcCB0aGUgbG9vcFxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGlzaC5DcmF2aW5ncy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFnID0gZGlzaC5DcmF2aW5nc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ3JhdmluZ1RhZ1NlbGVjdGVkKHRhZywgc2VsZWN0ZWRUYWdzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzaC5pc0ZpbHRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNDcmF2aW5nVGFnU2VsZWN0ZWQodGFnLCBsaXN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0LmluZGV4T2YodGFnKSA+IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ29ob21lKCkge1xyXG4gICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UuZ28oXCJhcHAuaG9tZVwiKTtcclxuICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDZW50ZXIoKSB7XHJcbiAgICAgICAgICAgIHZtLm1hcCA9IHdpbmRvdy5NYXBIZWxwZXIuY3JlYXRlTWFwKHZtLnBvc2l0aW9uLmNvb3Jkcyk7XHJcbiAgICAgICAgICAgIHZtLnVzZXJDb29yZHMgPSB2bS5wb3NpdGlvbi5jb29yZHM7XHJcbiAgICAgICAgICAgIGVuc3VyZVVzZXJNYXJrZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVuc3VyZVVzZXJNYXJrZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICghdm0udXNlck1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLnVzZXJNYXJrZXIgPSB3aW5kb3cuTWFwSGVscGVyLmNyZWF0ZVVzZXJNYXJrZXIodm0udXNlckNvb3JkcywgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvY2F0ZVJlc3RhdXJhbnQoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBkYXRhLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGFbaWR4XTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnBsYWNlSW5kZXggPSBpZHggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zLnB1c2goaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXJEYXRhID0gd2luZG93Lk1hcEhlbHBlci5jcmVhdGVSZXN0YXVyYW50TWFya2VyKGl0ZW0sIGlkeCwgb25NYXJrZXJTZWxlY3RlZCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFya2Vycy5wdXNoKG1hcmtlckRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2bS5yZXN0YXVyYW50cy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5tYXAubWFya2VycyA9IG1hcmtlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWFwLmNlbnRlciA9IHsgbGF0aXR1ZGU6IHZtLml0ZW1zWzBdLmxhdGl0dWRlLCBsb25naXR1ZGU6IHZtLml0ZW1zWzBdLmxvbmdpdHVkZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLm1hcC5vcHRpb25zLnpvb20gPSAxMTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5tYXAub3B0aW9ucy56b29tQ29udHJvbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9UT1AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBnb29nbGUubWFwcy5ab29tQ29udHJvbFN0eWxlLkxBUkdFXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5tYXAub3B0aW9ucy5zY3JvbGx3aGVlbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgMjUwKTsgLy8gaWYgSSBkb24ndCBkZWxheSBoZXJlLCBpdCBkb2Vzbid0IHNob3cgYWxsIHRoZSBuZXcgbWFya2VycyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25NYXJrZXJTZWxlY3RlZChzZW5kZXIpIHtcclxuICAgICAgICAgICAgaWYgKHNlbmRlci5tb2RlbCAmJiBzZW5kZXIubW9kZWwuZmFjdHVhbF9pZCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0TWFya2VyKHNlbmRlci5tb2RlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdE1hcmtlcihtYXJrZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZtLm1hcC5zZWxlY3RlZE1hcmtlcikge1xyXG4gICAgICAgICAgICAgICAgZGVTZWxlY3RNYXJrZXIodm0ubWFwLnNlbGVjdGVkTWFya2VyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaW5kSXRlbShtYXJrZXIuZmFjdHVhbF9pZCk7XHJcbiAgICAgICAgICAgIG1hcmtlci5vcHRpb25zLm9wYWNpdHkgPSAxLjA7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzU2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ubWFwLnNlbGVjdGVkTWFya2VyID0gbWFya2VyO1xyXG4gICAgICAgICAgICAgICAgdm0ubWFwLmNlbnRlci5sYXRpdHVkZSA9IG1hcmtlci5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICB2bS5tYXAuY2VudGVyLmxvbmdpdHVkZSA9IG1hcmtlci5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZVNlbGVjdE1hcmtlcihtYXJrZXIpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaW5kSXRlbShtYXJrZXIuZmFjdHVhbF9pZCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbWFya2VyLm9wdGlvbnMub3BhY2l0eSA9IDAuNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZE1hcmtlcihmYWN0dWFsSWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdm0ubWFwLm1hcmtlcnMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLm1hcC5tYXJrZXJzW2lkeF0uZmFjdHVhbF9pZCA9PT0gZmFjdHVhbElkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5tYXAubWFya2Vyc1tpZHhdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZEl0ZW0oZmFjdHVhbElkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHZtLml0ZW1zLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5pdGVtc1tpZHhdLmZhY3R1YWxfaWQgPT09IGZhY3R1YWxJZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0uaXRlbXNbaWR4XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NpbmdsZVJhbmRvbVJlc3RhdXJhbnRDb250cm9sbGVyJywgc2luZ2xlUmFuZG9tUmVzdGF1cmFudENvbnRyb2xsZXIpO1xyXG5cclxuICAgIHNpbmdsZVJhbmRvbVJlc3RhdXJhbnRDb250cm9sbGVyLiRpbmplY3QgPSBbJ1Jlc3RhdXJhbnRTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzaW5nbGVSYW5kb21SZXN0YXVyYW50Q29udHJvbGxlcihyZXN0U2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gcHJvcGVydGllcyBcclxuICAgICAgICB2bS5yZXN0YXVyYW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAvLyBldmVudHNcclxuICAgICAgICBcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgdm0ucG9zaXRpb24gPSAkcm9vdFNjb3BlLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBnZXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXQodG90YWwpIHtcclxuICAgICAgICAgICAgcmVzdFNlcnZpY2UuZ2V0UmFuZG9tUmVzdGF1cmFudCh2bS5wb3NpdGlvbiwgdG90YWwpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuSXRlbXMgJiYgZGF0YS5JdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVzdGF1cmFudCA9IGRhdGEuSXRlbXNbMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucmVzdGF1cmFudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdmaWxlU2VydmljZScsIGZpbGVTZXJ2aWNlKTtcclxuXHJcbiAgICBmaWxlU2VydmljZS4kaW5qZWN0ID0gWydmaWxlU2VydmVyJ107XHJcblxyXG4gICAgLy8gdGhpcyBzZXJ2aWNlIGxhdW5jaGVzIGFuZCBjbG9zZXMgYSBtb2RhbCB3aW5kb3cgXHJcbiAgICBmdW5jdGlvbiBmaWxlU2VydmljZShmaWxlU2VydmVyKSB7XHJcblxyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBnZXRTYWZlUHJldmlld0ltYWdlOiBnZXRTYWZlUHJldmlld0ltYWdlLFxyXG4gICAgICAgICAgICBnZXRTYWZlQXZhdGFySW1hZ2U6IGdldFNhZmVBdmF0YXJJbWFnZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRTYWZlQXZhdGFySW1hZ2UoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICAvLyBjaGFuY2UgaXMgdGhlIGRpbmVyIGhhcyBubyBpbWFnZSwgd2hpY2ggd2lsbCByZXR1cm4gXCJNeXN0ZXJ5XCIgXHJcbiAgICAgICAgICAgIGlmIChpbWdOYW1lID09PSBcIk15c3RlcnlcIiB8fCBpbWdOYW1lID09PSBcIlwiIHx8IGltZ05hbWUgPT09IHVuZGVmaW5lZCB8fCBpbWdOYW1lID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJpbWFnZXMvZ2VuZXJpYy9nZW5lcmljX3VzZXIucG5nXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWltZ05hbWUuc3RhcnRzV2l0aChcImh0dHA6Ly9cIikpIHtcclxuICAgICAgICAgICAgICAgIGltZ05hbWUgPSB3aW5kb3cuaGVscGVyLnJlcGxhY2VBbGwoaW1nTmFtZSwgXCJcXFxcXCIsIFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGltZ05hbWUgPSBmaWxlU2VydmVyICsgXCIvXCIgKyBpbWdOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW1nTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNhZmVQcmV2aWV3SW1hZ2UoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoaW1nTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbWdOYW1lLnN0YXJ0c1dpdGgoXCJodHRwOi8vXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nTmFtZSA9IGZpbGVTZXJ2ZXIgKyBcIi9cIiArIGltZ05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbWdOYW1lID0gXCJpbWFnZXMvZ2VuZXJpYy9ub19pbWFnZV9hdmFpbGFibGUucG5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGltZ05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG4gICAgYXBwLmZhY3RvcnkoJ2xvZ2dlcicsIGxvZ2dlcik7XG5cbiAgICBsb2dnZXIuJGluamVjdCA9IFsnJG1kVG9hc3QnXTtcblxuICAgIGZ1bmN0aW9uIGxvZ2dlcigkbWRUb2FzdCkge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBzaG93VG9hc3RzOiB0cnVlLFxuXG4gICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICBpbmZvOiBpbmZvLFxuICAgICAgICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgICAgICAgIHdhcm5pbmc6IHdhcm5pbmcsXHJcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gVE9ETzogbWRUb2FzdCBzdXBwb3J0cyBjdXN0b20gdGVtcGxhdGVcblxuICAgICAgICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlLCBkYXRhLCB0aXRsZSkge1xyXG4gICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbmZvKG1lc3NhZ2UsIGRhdGEsIHRpdGxlKSB7XHJcbiAgICAgICAgICAgICRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MobWVzc2FnZSwgZGF0YSwgdGl0bGUpIHtcclxuICAgICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChtZXNzYWdlKTtcclxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd2FybmluZyhtZXNzYWdlLCBkYXRhLCB0aXRsZSkge1xyXG4gICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdNb2RhbFNlcnZpY2UnLCBtb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIG1vZGFsU2VydmljZS4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCckbWRTaWRlbmF2JywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICAvLyB0aGlzIHNlcnZpY2UgbGF1bmNoZXMgYW5kIGNsb3NlcyBhIG1vZGFsIHdpbmRvdyBcclxuICAgIGZ1bmN0aW9uIG1vZGFsU2VydmljZSgkbWREaWFsb2csJG1kU2lkZW5hdiwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgLy8gY2FsbGluZyB0aGlzIG11c3QgcGFzcyBhIHRlbXBsYXRlIGFuZCBhIGNvbnRyb2xsZXIuIHRoaXMgaXMgdXNlZCB0byBvcGVuIGFuIGFkLWhvYyBtb2RhbFxyXG4gICAgICAgICAgICBvcGVuTW9kYWw6IG9wZW5IYW5kbGVyLFxyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIGNsb3NlIG9ubHkgbW9kYWwgZGlhbG9ncyBcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogY2xvc2VNb2RhbEhhbmRsZXIsXHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIHN1Ym1pdHMgdGhlIG1vZGFsIGRpYWxvZyBhbmQgcmV0dXJucyBhIHJlc3VsdFxyXG4gICAgICAgICAgICBzdWJtaXRNb2RhbDogc3VibWl0TW9kYWxIYW5kbGVyLFxyXG5cclxuICAgICAgICAgICAgdG9nZ2xlU2lkZW5hdjogdG9nZ2xlU2lkZW5hdixcclxuICAgICAgICAgICAgaXNTaWRlbmF2T3BlbjogaXNTaWRlbmF2T3BlbixcclxuICAgICAgICAgICAgY2xvc2VTaWRlbmF2OiBjbG9zZVNpZGVuYXZcclxuICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICAvLyB0aGUgaW5wdXQ6IGVudGl0eSBpcyBzb21ldGhpbmcgY2FuIGJlIHBhc3NlZCBpbiBhbmQgcmVzb2x2ZWQgaW50byB0aGUgbW9kYWwgY29udHJvbGxlciBpZiB3aXNoIFxyXG4gICAgICAgIC8vIGlmIHNraXAsIHRoZSBtb2RhbCBjb250cm9sbGVyIGNhbiBpZ25vcmUgdGhpczsgb3RoZXJ3aXNlIGl0IGNhbiBsb2FkIHNvbWV0aGluZyBkaXJlY3RseSB3aXRob3V0IGhhdmluZyBhIERCIHJvdW5kdHJpcCBcclxuICAgICAgICBmdW5jdGlvbiBvcGVuSGFuZGxlcih1cmwsIGNvbnRyb2xsZXIsIGVudGl0eSwgZXYpIHtcclxuICAgICAgICAgICAgY2xlYW51cE1vZGFsKCk7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpOyAvLyBjcmVhdGluZyBhbiBpc29sYXRlIHNjb3BlXHJcbiAgICAgICAgICAgICRyb290U2NvcGUubW9kYWxTY29wZSA9IG1vZGFsU2NvcGU7XHJcblxyXG4gICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsSW5zdGFuY2UgPSAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcclxuICAgICAgICAgICAgICAgIGxvY2FsczogeyBtb2RhbEl0ZW06IGVudGl0eSB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1vZGFsU2NvcGUubW9kYWxJbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWxIYW5kbGVyKHJlYXNvbikge1xyXG4gICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5tb2RhbFNjb3BlICYmICRyb290U2NvcGUubW9kYWxTY29wZS5tb2RhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZShyZWFzb24gfHwgJ2NhbmNlbCcpO1xyXG4gICAgICAgICAgICAgICAgY2xlYW51cE1vZGFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdE1vZGFsSGFuZGxlcihyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKCRyb290U2NvcGUubW9kYWxTY29wZSAmJiAkcm9vdFNjb3BlLm1vZGFsU2NvcGUubW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUocmVzdWx0IHx8ICdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgIGNsZWFudXBNb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwTW9kYWwoKSB7XHJcbiAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLm1vZGFsU2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUubW9kYWxTY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5tb2RhbFNjb3BlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlU2lkZW5hdihtZW51SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzU2lkZW5hdk9wZW4oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRtZFNpZGVuYXYoaWQpLmlzT3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2VTaWRlbmF2KG1lbnVJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJG1kU2lkZW5hdihtZW51SWQpLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvY2F0aW9uQ29udHJvbGxlcicsIGxvY2F0aW9uQ29udHJvbGxlcik7XHJcblxyXG4gICAgbG9jYXRpb25Db250cm9sbGVyLiRpbmplY3QgPSBbJ0dlb1NlcnZpY2UnLCAnUmVzdGF1cmFudFNlcnZpY2UnLCAnJGh0dHAnLCAnJHNjb3BlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2NhdGlvbkNvbnRyb2xsZXIoZ2VvU2VydmljZSwgcmVzdFNlcnZpY2UsICRodHRwLCAkc2NvcGUsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcbiAgICAgICAgdm0uY3VycmVudENpdHkgPSBcIlwiO1xyXG4gICAgICAgIHZtLnRpdGxlID0gXCJTZXQgWW91ciBMb2NhdGlvblwiO1xyXG4gICAgICAgIHZtLnN1cHBvcnRlZENpdGllcyA9IFtdO1xyXG5cclxuICAgICAgICB2bS5yZWxvY2F0ZU1lID0gcmVsb2NhdGVNZTtcclxuICAgICAgICB2bS5jaG9vc2VDaXR5ID0gY2hvb3NlQ2l0eTtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVQYWdlVGl0bGUoJ091ckNyYXZpbmcgLSBDaG9vc2UgeW91ciBsb2NhdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgcmVzdFNlcnZpY2UuZ2V0Q2l0eVN1bW1hcmllcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zdXBwb3J0ZWRDaXRpZXMgPSByZXNwb25zZS5kYXRhLkl0ZW1zO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVwZWF0R3VhcmQgPSAwO1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlbG9jYXRlTWUoKSB7XHJcbiAgICAgICAgICAgIGdlb1NlcnZpY2UucG9zaXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHZtLnNhdmVkU3VjY2Vzc2Z1bGx5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgcSA9IGdlb1NlcnZpY2UuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICAgICAgcS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnZW9TZXJ2aWNlLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5wb3NpdGlvbiA9IGdlb1NlcnZpY2UucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJZb3UgaGF2ZSBiZWVuIHJlbG9jYXRlZCBzdWNjZXNzZnVsbHkuXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXBlYXRHdWFyZCA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlJlbG9jYXRpb24gdGltZW91dC4uLiB0cnkgdG8gcmVmcmVzaCB0aGUgYnJvd3NlciBmaXJzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdEd1YXJkKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbG9jYXRlTWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oZWxwZXIuaGFuZGxlRXJyb3IoZXJyLCB2bSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hvb3NlQ2l0eShjaXR5LCByZWdpb24pIHtcclxuICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBJIGFtIG5vdCBzdXJlIGhvdyB0byBoYW5kbGUgdGhpcyBiZXR0ZXJcclxuICAgICAgICAgICAgdmFyIGVuZHBvaW50ID0gXCJodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2FkZHJlc3M9XCIgKyBjaXR5ICsgXCIsIFwiICsgcmVnaW9uICsgXCIma2V5PUFJemFTeUFvdWJUZk9YU1lwcXFFaE1ONkR2VExNd1NjeU11RnUxOFwiO1xyXG4gICAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnXHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBnZXRMb2NhdGlvbihyZXNwb25zZS5kYXRhLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUucG9zaXRpb24gPSBsb2NhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBnZW9TZXJ2aWNlLnVwZGF0ZVBvc2l0aW9uKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1lKCkge1xyXG4gICAgICAgICAgICB2bS5zYXZlZFN1Y2Nlc3NmdWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnRDaXR5ID0gJHJvb3RTY29wZS5wb3NpdGlvbi51c2VyTG9jYXRpb24uY2l0eSArIFwiLCBcIiArICRyb290U2NvcGUucG9zaXRpb24udXNlckxvY2F0aW9uLnJlZ2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY29vcmRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubG5nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdXNlckxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2l0eTogcmVzdWx0LmFkZHJlc3NfY29tcG9uZW50c1swXS5sb25nX25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzW3Jlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHMubGVuZ3RoIC0gMl0ubG9uZ19uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50cnk6IHJlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHNbcmVzdWx0LmFkZHJlc3NfY29tcG9uZW50cy5sZW5ndGggLSAxXS5sb25nX25hbWVcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdEaW5lckRldGFpbENvbnRyb2xsZXInLCBkaW5lckRldGFpbENvbnRyb2xsZXIpO1xyXG5cclxuICAgIGRpbmVyRGV0YWlsQ29udHJvbGxlci4kaW5qZWN0ID0gWydEaW5lclNlcnZpY2UnLCAnTW9kYWxTZXJ2aWNlJywgJyR0aW1lb3V0JywgJyRzY29wZScsICckcm9vdFNjb3BlJywgJ21vZGFsSXRlbScsICdmaWxlU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRpbmVyRGV0YWlsQ29udHJvbGxlcihkaW5lclNlcnZpY2UsIG1vZGFsU2VydmljZSwgJHRpbWVvdXQsICRzY29wZSwgJHJvb3RTY29wZSwgbW9kYWxJdGVtLCBmaWxlU2VydmljZSkge1xyXG5cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHZtLmRpbmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZtLnJlY2VudENyYXZpbmdzID0gW107XHJcbiAgICAgICAgdm0ucmVjZW50RGlzaGVzID0gW107XHJcbiAgICAgICAgdm0ucmVjZW50UmV2aWV3cyA9IFtdO1xyXG4gICAgICAgIHZtLmRpc2xpa2VzID0gW107XHJcblxyXG4gICAgICAgIC8vIGV2ZW50c1xyXG4gICAgICAgIHZtLmNsb3NlID0gY2xvc2U7XHJcbiAgICAgICAgdm0uZ2V0TWVtYmVyU2luY2UgPSBnZXRNZW1iZXJTaW5jZTtcclxuICAgICAgICB2bS5mb3JtYXRlRGF0ZSA9IGZvcm1hdGVEYXRlO1xyXG4gICAgICAgIHZtLmdldERpbmVySW1hZ2UgPSBnZXREaW5lckltYWdlO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8gaGVscGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICAvLyBhIGRpc2hMb2FkZXIgaXMgdXNlZCB3aGVuIG9wZW5pbmcgYSBkaXNoIGRldGFpbCBwYWdlLCB0aGUgZGluZXIgcGFnZSBpcyBhIHNpZGViYXIsIHdlIG5lZWQgdG8gbG9hZGVyIHRvIHRlbGwgXHJcbiAgICAgICAgICAgIC8vIHVzIHdoaWNoIGRpbmVyIHRvIG9wZW4gXHJcbiAgICAgICAgICAgIGlmIChtb2RhbEl0ZW0gJiYgbW9kYWxJdGVtLmRpbmVySWQpIHtcclxuICAgICAgICAgICAgICAgIG9uRGluZXJJZExvYWRlZChtb2RhbEl0ZW0uZGluZXJJZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGFsbG93cyB0aGlzIGNvbnRyb2xsZXIgcmV1c2VkIHdoZW4gd2Ugd2FudCB0byBkaXNwbGF5IGEgZGluZXIgd2l0aG91dCBhIGRpc2hMb2FkZXIsIGluIHRoYXQgY2FzZSwgdGhlIFxyXG4gICAgICAgICAgICAgICAgLy8gZGluZXIgaWQgc2hvdWxkIGFwcGVhciBpbiB0aGUgdXJsIFxyXG4gICAgICAgICAgICAgICAgdmFyIGRpbmVySWQgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5pZDtcclxuICAgICAgICAgICAgICAgIG9uRGluZXJJZExvYWRlZChkaW5lcklkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25EaW5lcklkTG9hZGVkKGRpbmVySWQpIHtcclxuICAgICAgICAgICAgaWYgKCFkaW5lcklkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJObyBkaW5lciBjYW4gYmUgbG9hZGVkLiBUaGUgSWQgaXMgbWlzc2luZy5cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkaW5lclNlcnZpY2UuZ2V0KGRpbmVySWQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5kaW5lciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZGlzbGlrZXMgPSB2bS5kaW5lci5EaXNsaWtlcztcclxuICAgICAgICAgICAgICAgICAgICBsb2FkQWRkaXRpb25hbERhdGEoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGVscGVyLmhhbmRsZUVycm9yKGVyciwgdm0sIFwiQ2Fubm90IGxvYWQgdXNlcjogXCIsIHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2UuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TWVtYmVyU2luY2UoZGluZXIpIHtcclxuICAgICAgICAgICAgaWYgKGRpbmVyICYmIGRpbmVyLlJlZ2lzdHJhdGlvbkRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGluZXIuUmVnaXN0cmF0aW9uRGF0ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpICsgXCIsXCIgKyB3aW5kb3cuaGVscGVyLmdldE1vbnRoTmFtZShkYXRlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRlRGF0ZShkKSB7XHJcbiAgICAgICAgICAgIGlmIChkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5oZWxwZXIuZ2V0UG9zdERhdGVEZXNjcmlwdGlvbihkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGluZXJJbWFnZShpbWdOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlU2VydmljZS5nZXRTYWZlQXZhdGFySW1hZ2UoaW1nTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBoZWxwZXJzXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZEFkZGl0aW9uYWxEYXRhKCkge1xyXG4gICAgICAgICAgICBsb2FkUmVjZW50Q3JhdmluZ3MoKTtcclxuICAgICAgICAgICAgbG9hZFJlY2VudFJldmlld3MoKTtcclxuICAgICAgICAgICAgbG9hZFJlY2VudEFkZGVkRGlzaGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUmVjZW50Q3JhdmluZ3MoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlY2VudENyYXZpbmdzID0gW107XHJcbiAgICAgICAgICAgIGRpbmVyU2VydmljZS5nZXRSZWNlbnRDcmF2aW5ncyh2bS5kaW5lci5JZCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnJlY2VudENyYXZpbmdzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZFJlY2VudFJldmlld3MoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlY2VudFJldmlld3MgPSBbXTtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldFJlY2VudFJldmlld3Modm0uZGluZXIuSWQpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5yZWNlbnRSZXZpZXdzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZFJlY2VudEFkZGVkRGlzaGVzKCkge1xyXG4gICAgICAgICAgICB2bS5yZWNlbnREaXNoZXMgPSBbXTtcclxuICAgICAgICAgICAgZGluZXJTZXJ2aWNlLmdldFJlY2VudEFkZGVkRGlzaGVzKHZtLmRpbmVyLklkKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVjZW50RGlzaGVzID0gcmVzcG9uc2UuZGF0YS5JdGVtcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFyZVRvJywgY29tcGFyZVRvKTtcclxuXHJcbiAgICBjb21wYXJlVG8uJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmVUbygpIHtcclxuICAgICAgICAvLyBVc2FnZTpcclxuICAgICAgICAvLyAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJjb25maXJtUGFzc3dvcmRcIiBuZy1tb2RlbD1cInJlZ2lzdHJhdGlvbi51c2VyLmNvbmZpcm1QYXNzd29yZFwiIHJlcXVpcmVkIGNvbXBhcmUtdG89XCJyZWdpc3RyYXRpb24udXNlci5wYXNzd29yZFwiIC8+XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBvdGhlck1vZGVsVmFsdWU6IFwiPWNvbXBhcmVUb1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgICAgIG5nTW9kZWwuJHZhbGlkYXRvcnMuY29tcGFyZVRvID0gZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWxWYWx1ZSA9PSBzY29wZS5vdGhlck1vZGVsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChcIm90aGVyTW9kZWxWYWx1ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kdmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEEgZGlyZWN0aXZlIHRvIGVtYmVkIGEgRGlzcXVzIGNvbW1lbnRzIHdpZGdldCBvbiB5b3VyIEFuZ3VsYXJKUyBwYWdlLlxyXG4gKlxyXG4gKiBDcmVhdGVkIGJ5IE1pY2hhZWwgb24gMjIvMDEvMTQuXHJcbiAqIENvcHlyaWdodCBNaWNoYWVsIEJyb21sZXkgMjAxNFxyXG4gKiBBdmFpbGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25maWdcclxuICAgICAqL1xyXG4gICAgdmFyIG1vZHVsZU5hbWUgPSAnYXBwJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vZHVsZVxyXG4gICAgICovXHJcbiAgICB2YXIgbW9kdWxlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShtb2R1bGVOYW1lKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIC8vIG5hbWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCwgc28gY3JlYXRlIG9uZVxyXG4gICAgICAgIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtdKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZGlyZWN0aXZlKCdkaXJEaXNxdXMnLCBbJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfc2hvcnRuYW1lOiAnQGRpc3F1c1Nob3J0bmFtZScsXHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfaWRlbnRpZmllcjogJ0BkaXNxdXNJZGVudGlmaWVyJyxcclxuICAgICAgICAgICAgICAgIGRpc3F1c190aXRsZTogJ0BkaXNxdXNUaXRsZScsXHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfdXJsOiAnQGRpc3F1c1VybCcsXHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfY2F0ZWdvcnlfaWQ6ICdAZGlzcXVzQ2F0ZWdvcnlJZCcsXHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfZGlzYWJsZV9tb2JpbGU6ICdAZGlzcXVzRGlzYWJsZU1vYmlsZScsXHJcbiAgICAgICAgICAgICAgICBkaXNxdXNfY29uZmlnX2xhbmd1YWdlOiAnQGRpc3F1c0NvbmZpZ0xhbmd1YWdlJyxcclxuICAgICAgICAgICAgICAgIGRpc3F1c19yZW1vdGVfYXV0aF9zMzogJ0BkaXNxdXNSZW1vdGVBdXRoUzMnLFxyXG4gICAgICAgICAgICAgICAgZGlzcXVzX2FwaV9rZXk6ICdAZGlzcXVzQXBpS2V5JyxcclxuICAgICAgICAgICAgICAgIGRpc3F1c19vbl9yZWFkeTogXCImZGlzcXVzT25SZWFkeVwiLFxyXG4gICAgICAgICAgICAgICAgcmVhZHlUb0JpbmQ6IFwiQFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cImRpc3F1c190aHJlYWRcIj48L2Rpdj48YSBocmVmPVwiaHR0cDovL2Rpc3F1cy5jb21cIiBjbGFzcz1cImRzcS1icmxpbmtcIj5jb21tZW50cyBwb3dlcmVkIGJ5IDxzcGFuIGNsYXNzPVwibG9nby1kaXNxdXNcIj5EaXNxdXM8L3NwYW4+PC9hPicsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSxlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlIGRpc3F1c19pZGVudGlmaWVyIGFuZCBkaXNxdXNfdXJsIGFyZSBib3RoIHNldCwgb3RoZXJ3aXNlIHdlIHdpbGwgcnVuIGluIHRvIGlkZW50aWZpZXIgY29uZmxpY3RzIHdoZW4gdXNpbmcgVVJMcyB3aXRoIFwiI1wiIGluIHRoZW1cclxuICAgICAgICAgICAgICAgIC8vIHNlZSBodHRwOi8vaGVscC5kaXNxdXMuY29tL2N1c3RvbWVyL3BvcnRhbC9hcnRpY2xlcy82NjI1NDctd2h5LWFyZS10aGUtc2FtZS1jb21tZW50cy1zaG93aW5nLXVwLW9uLW11bHRpcGxlLXBhZ2VzLVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5kaXNxdXNfaWRlbnRpZmllciA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHNjb3BlLmRpc3F1c191cmwgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJQbGVhc2UgZW5zdXJlIHRoYXQgdGhlIGBkaXNxdXMtaWRlbnRpZmllcmAgYW5kIGBkaXNxdXMtdXJsYCBhdHRyaWJ1dGVzIGFyZSBib3RoIHNldC5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goXCJyZWFkeVRvQmluZFwiLCBmdW5jdGlvbiAoaXNSZWFkeSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZGlyZWN0aXZlIGhhcyBiZWVuIGNhbGxlZCB3aXRob3V0IHRoZSAncmVhZHktdG8tYmluZCcgYXR0cmlidXRlLCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgZGVmYXVsdCB0byBcInRydWVcIiBzbyB0aGF0IERpc3F1cyB3aWxsIGJlIGxvYWRlZCBzdHJhaWdodCBhd2F5LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYW5ndWxhci5pc0RlZmluZWQoaXNSZWFkeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWFkeSA9IFwidHJ1ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuJGV2YWwoaXNSZWFkeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlbW90ZScgKyBzY29wZS5kaXNxdXNfcmVtb3RlX2F1dGhfczMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwdXQgdGhlIGNvbmZpZyB2YXJpYWJsZXMgaW50byBzZXBhcmF0ZSBnbG9iYWwgdmFycyBzbyB0aGF0IHRoZSBEaXNxdXMgc2NyaXB0IGNhbiBzZWUgdGhlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmRpc3F1c19zaG9ydG5hbWUgPSBzY29wZS5kaXNxdXNfc2hvcnRuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmRpc3F1c19pZGVudGlmaWVyID0gc2NvcGUuZGlzcXVzX2lkZW50aWZpZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cuZGlzcXVzX3RpdGxlID0gc2NvcGUuZGlzcXVzX3RpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmRpc3F1c191cmwgPSBzY29wZS5kaXNxdXNfdXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmRpc3F1c19jYXRlZ29yeV9pZCA9IHNjb3BlLmRpc3F1c19jYXRlZ29yeV9pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5kaXNxdXNfZGlzYWJsZV9tb2JpbGUgPSBzY29wZS5kaXNxdXNfZGlzYWJsZV9tb2JpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cuZGlzcXVzX2NvbmZpZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2UgPSBzY29wZS5kaXNxdXNfY29uZmlnX2xhbmd1YWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlLnJlbW90ZV9hdXRoX3MzID0gc2NvcGUuZGlzcXVzX3JlbW90ZV9hdXRoX3MzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlLmFwaV9rZXkgPSBzY29wZS5kaXNxdXNfYXBpX2tleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5kaXNxdXNfb25fcmVhZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5vblJlYWR5ID0gW2Z1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGlzcXVzX29uX3JlYWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgcmVtb3RlIERpc3F1cyBzY3JpcHQgYW5kIGluc2VydCBpdCBpbnRvIHRoZSBET00sIGJ1dCBvbmx5IGlmIGl0IG5vdCBhbHJlYWR5IGxvYWRlZCAoYXMgdGhhdCB3aWxsIGNhdXNlIHdhcm5pbmdzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISR3aW5kb3cuRElTUVVTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHNxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IGRzcS50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IGRzcS5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkc3Euc3JjID0gJy8vJyArIHNjb3BlLmRpc3F1c19zaG9ydG5hbWUgKyAnLmRpc3F1cy5jb20vZW1iZWQuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0gfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXSkuYXBwZW5kQ2hpbGQoZHNxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cuRElTUVVTLnJlc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxvYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZS5pZGVudGlmaWVyID0gc2NvcGUuZGlzcXVzX2lkZW50aWZpZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZS51cmwgPSBzY29wZS5kaXNxdXNfdXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UudGl0bGUgPSBzY29wZS5kaXNxdXNfdGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2UgPSBzY29wZS5kaXNxdXNfY29uZmlnX2xhbmd1YWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2UucmVtb3RlX2F1dGhfczMgPSBzY29wZS5kaXNxdXNfcmVtb3RlX2F1dGhfczM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZS5hcGlfa2V5ID0gc2NvcGUuZGlzcXVzX2FwaV9rZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZGlzaER1cGxpY2F0aW9uQ2hlY2snLCBkdXBsaWNhdGlvbkNoZWNrKTtcclxuXHJcbiAgICBkdXBsaWNhdGlvbkNoZWNrLiRpbmplY3QgPSBbJ1Jlc3RhdXJhbnRTZXJ2aWNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZHVwbGljYXRpb25DaGVjayhyZXN0U2VydmljZSkge1xyXG4gICAgICAgIC8vIFVzYWdlOlxyXG4gICAgICAgIC8vICAgICA8aW5wdXQgZGlzaC1kdXBsaWNhdGlvbi1jaGVjaz1cInZtLmRpc2gucmVzdGF1cmFudE5hbWVcIiBuZy1tb2RlbD1cInZtLmRpc2gubmFtZVwiIC8+XHJcblxyXG4gICAgICAgIHZhciBydW5uaW5nO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6IFwibmdNb2RlbFwiLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgcmVzdGF1cmFudE5hbWU6IFwiPWRpc2hEdXBsaWNhdGlvbkNoZWNrXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9uZ01vZGVsLiR2YWxpZGF0b3JzLmRpc2hEdXBsaWNhdGlvbkNoZWNrID0gZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIHJ1blZhbGlkYXRpb24obW9kZWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAvL307XHJcblxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1blZhbGlkYXRpb24obmdNb2RlbC4kbW9kZWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goXCJyZXN0YXVyYW50TmFtZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIGNsZWFyVGltZW91dChydW5uaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBydW5WYWxpZGF0aW9uKG5nTW9kZWwuJG1vZGVsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcnVuVmFsaWRhdGlvbihtb2RlbFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgIT09IHVuZGVmaW5lZCAmJiBtb2RlbFZhbHVlICE9PSBcIlwiICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnJlc3RhdXJhbnROYW1lICE9PSB1bmRlZmluZWQgJiYgc2NvcGUucmVzdGF1cmFudE5hbWUgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZyA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdFNlcnZpY2UuZ2V0RGlzaEJ5TmFtZShzY29wZS5yZXN0YXVyYW50TmFtZSwgbW9kZWxWYWx1ZSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdkaXNoRHVwbGljYXRpb25DaGVjaycsIGRhdGEuSXRlbXMubGVuZ3RoID09IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZmlsZUZpZWxkJywgZmlsZUZpZWxkKTtcclxuXHJcbiAgICBmaWxlRmllbGQuJGluamVjdCA9IFsnJHBhcnNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZmlsZUZpZWxkKCRwYXJzZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIG9uRmlsZVJlYWQ6ICcmJyxcclxuICAgICAgICAgICAgICAgIHByZXZpZXc6ICc9J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAvL3NldCBkZWZhdWx0IGJvb3RzdHJhcCBjbGFzc1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoIWF0dHJzLmNsYXNzICYmICFhdHRycy5uZ0NsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBlbGVtZW50LmFkZENsYXNzKCdtZC1idXR0b24gbWQtcmFpc2VkJyk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShldmVudC50YXJnZXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cnMucHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVbYXR0cnMucHJldmlld10gPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByZXZpZXcgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5vbkZpbGVSZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5vbkZpbGVSZWFkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBldmVudC50YXJnZXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIChhdHRycy5vbkZpbGVSZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdmFyIGNhbGxiYWNrID0gJHBhcnNlKGF0dHJzLm9uRmlsZVJlYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIGNhbGxiYWNrKGV2ZW50LnRhcmdldC5maWxlc1swXSwgZS50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGRbMF0uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxidXR0b24gY2xhc3M9XCJtZC1idXR0b24gbWQtcmFpc2VkXCIgdHlwZT1cImJ1dHRvblwiPjxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT48aW5wdXQgdHlwZT1cImZpbGVcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLypcclxuICogbmdwbHVzLW92ZXJsYXkuanNcclxuICogVmVyc2lvbiAwLjkuMlxyXG4gKiBDb3B5cmlnaHQgMjAxNCBKb2huIFBhcGEgYW5kIERhbiBXYWhsaW5cclxuICogQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogVXNlLCByZXByb2R1Y3Rpb24sIGRpc3RyaWJ1dGlvbiwgYW5kIG1vZGlmaWNhdGlvbiBvZiB0aGlzIGNvZGUgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYW5kXHJcbiAqIGNvbmRpdGlvbnMgb2YgdGhlIE1JVCBsaWNlbnNlLCBhdmFpbGFibGUgYXQgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuICpcclxuICogQXV0aG9yOiBKb2huIFBhcGEgYW5kIERhbiBXYWhsaW5cclxuICogUHJvamVjdDogaHR0cHM6Ly9naXRodWIuY29tL0FuZ3VsYXJQbHVzXHJcbiAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBvdmVybGF5QXBwID0gYW5ndWxhci5tb2R1bGUoJ25ncGx1cycsIFtdKTtcclxuXHJcbiAgICAvL0VtcHR5IGZhY3RvcnkgdG8gaG9vayBpbnRvICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzXHJcbiAgICAvL0RpcmVjdGl2ZSB3aWxsIGhvb2t1cCByZXF1ZXN0LCByZXNwb25zZSwgYW5kIHJlc3BvbnNlRXJyb3IgaW50ZXJjZXB0b3JzXHJcbiAgICBvdmVybGF5QXBwLmZhY3RvcnkoJ25ncGx1cy5odHRwSW50ZXJjZXB0b3InLCBodHRwSW50ZXJjZXB0b3IpO1xyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yKCkgeyByZXR1cm4ge30gfVxyXG5cclxuICAgIC8vSG9vayBodHRwSW50ZXJjZXB0b3IgZmFjdG9yeSBpbnRvIHRoZSAkaHR0cFByb3ZpZGVyIGludGVyY2VwdG9ycyBzbyB0aGF0IHdlIGNhbiBtb25pdG9yIFhIUiBjYWxsc1xyXG4gICAgb3ZlcmxheUFwcC5jb25maWcoWyckaHR0cFByb3ZpZGVyJywgaHR0cFByb3ZpZGVyXSk7XHJcbiAgICBmdW5jdGlvbiBodHRwUHJvdmlkZXIoJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ25ncGx1cy5odHRwSW50ZXJjZXB0b3InKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0RpcmVjdGl2ZSB0aGF0IHVzZXMgdGhlIGh0dHBJbnRlcmNlcHRvciBmYWN0b3J5IGFib3ZlIHRvIG1vbml0b3IgWEhSIGNhbGxzXHJcbiAgICAvL1doZW4gYSBjYWxsIGlzIG1hZGUgaXQgZGlzcGxheXMgYW4gb3ZlcmxheSBhbmQgYSBjb250ZW50IGFyZWFcclxuICAgIC8vTm8gYXR0ZW1wdCBoYXMgYmVlbiBtYWRlIGF0IHRoaXMgcG9pbnQgdG8gdGVzdCBvbiBvbGRlciBicm93c2Vyc1xyXG4gICAgb3ZlcmxheUFwcC5kaXJlY3RpdmUoJ25ncGx1c092ZXJsYXknLCBbJyRxJywgJyR0aW1lb3V0JywgJyR3aW5kb3cnLCAnbmdwbHVzLmh0dHBJbnRlcmNlcHRvcicsIG92ZXJsYXldKTtcclxuXHJcbiAgICBmdW5jdGlvbiBvdmVybGF5KCRxLCAkdGltZW91dCwgJHdpbmRvdywgaHR0cEludGVyY2VwdG9yKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIG5ncGx1c092ZXJsYXlEZWxheUluOiBcIkBcIixcclxuICAgICAgICAgICAgICAgIG5ncGx1c092ZXJsYXlEZWxheU91dDogXCJAXCIsXHJcbiAgICAgICAgICAgICAgICBuZ3BsdXNPdmVybGF5QW5pbWF0aW9uOiBcIkBcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IGdldFRlbXBsYXRlKCksXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJzxkaXYgaWQ9XCJuZ3BsdXMtb3ZlcmxheS1jb250YWluZXJcIiAnICtcclxuICAgICAgICAgICAgICAgICdjbGFzcz1cInt7bmdwbHVzT3ZlcmxheUFuaW1hdGlvbn19XCIgZGF0YS1uZy1zaG93PVwiISFzaG93XCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm5ncGx1cy1vdmVybGF5LWJhY2tncm91bmRcIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwibmdwbHVzLW92ZXJsYXktY29udGVudFwiIGNsYXNzPVwibmdwbHVzLW92ZXJsYXktY29udGVudFwiIGRhdGEtbmctdHJhbnNjbHVkZT4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheURlbGF5SW46IDUwMCxcclxuICAgICAgICAgICAgICAgIG92ZXJsYXlEZWxheU91dDogNTAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBkZWxheUluID0gc2NvcGUubmdwbHVzT3ZlcmxheURlbGF5SW4gPyBzY29wZS5uZ3BsdXNPdmVybGF5RGVsYXlJbiA6IGRlZmF1bHRzLm92ZXJsYXlEZWxheUluO1xyXG4gICAgICAgICAgICB2YXIgZGVsYXlPdXQgPSBzY29wZS5uZ3BsdXNPdmVybGF5RGVsYXlPdXQgPyBzY29wZS5uZ3BsdXNPdmVybGF5RGVsYXlPdXQgOiBkZWZhdWx0cy5vdmVybGF5RGVsYXlPdXQ7XHJcbiAgICAgICAgICAgIHZhciBvdmVybGF5Q29udGFpbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHF1ZXVlID0gW107XHJcbiAgICAgICAgICAgIHZhciB0aW1lclByb21pc2UgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgdGltZXJQcm9taXNlSGlkZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpbml0KCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAgICAgd2lyZVVwSHR0cEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmpRdWVyeSkgd2lyZWpRdWVyeUludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ncGx1cy1vdmVybGF5LWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0hvb2sgaW50byBodHRwSW50ZXJjZXB0b3IgZmFjdG9yeSByZXF1ZXN0L3Jlc3BvbnNlL3Jlc3BvbnNlRXJyb3IgZnVuY3Rpb25zXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdpcmVVcEh0dHBJbnRlcmNlcHRvcigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBodHRwSW50ZXJjZXB0b3IucmVxdWVzdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZy5oaWRlT3ZlcmxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnIHx8ICRxLndoZW4oY29uZmlnKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaHR0cEludGVyY2VwdG9yLnJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc1Jlc3BvbnNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8ICRxLndoZW4ocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBodHRwSW50ZXJjZXB0b3IucmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzUmVzcG9uc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL01vbml0b3IgalF1ZXJ5IEFqYXggY2FsbHMgaW4gY2FzZSBpdCdzIHVzZWQgaW4gYW4gYXBwXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdpcmVqUXVlcnlJbnRlcmNlcHRvcigpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLmFqYXhTdGFydChmdW5jdGlvbiAoKSB7IHByb2Nlc3NSZXF1ZXN0KCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uICgpIHsgcHJvY2Vzc1Jlc3BvbnNlKCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYWpheEVycm9yKGZ1bmN0aW9uICgpIHsgcHJvY2Vzc1Jlc3BvbnNlKCk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzUmVxdWVzdCgpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goe30pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJQcm9taXNlID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoKSBzaG93T3ZlcmxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGRlbGF5SW4pOyAvL0RlbGF5IHNob3dpbmcgZm9yIDUwMCBtaWxsaXMgdG8gYXZvaWQgZmxpY2tlclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzUmVzcG9uc2UoKSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vU2luY2Ugd2UgZG9uJ3Qga25vdyBpZiBhbm90aGVyIFhIUiByZXF1ZXN0IHdpbGwgYmUgbWFkZSwgcGF1c2UgYmVmb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgLy9oaWRpbmcgdGhlIG92ZXJsYXkuIElmIGFub3RoZXIgWEhSIHJlcXVlc3QgY29tZXMgaW4gdGhlbiB0aGUgb3ZlcmxheVxyXG4gICAgICAgICAgICAgICAgICAgIC8vd2lsbCBzdGF5IHZpc2libGUgd2hpY2ggcHJldmVudHMgYSBmbGlja2VyXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXJQcm9taXNlSGlkZSA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9NYWtlIHN1cmUgcXVldWUgaXMgc3RpbGwgMCBzaW5jZSBhIG5ldyBYSFIgcmVxdWVzdCBtYXkgaGF2ZSBjb21lIGluXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vd2hpbGUgdGltZXIgd2FzIHJ1bm5pbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlT3ZlcmxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVyUHJvbWlzZUhpZGUpICR0aW1lb3V0LmNhbmNlbCh0aW1lclByb21pc2VIaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGRlbGF5T3V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvd092ZXJsYXkoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgaCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoISR3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA9PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdyA9ICR3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBoID0gJHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ncGx1cy1vdmVybGF5LWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50V2lkdGggPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsICd3aWR0aCcpLnJlcGxhY2UoJ3B4JywgJycpKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50SGVpZ2h0ID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50LCAnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuc3R5bGUudG9wID0gaCAvIDIgLSBjb250ZW50SGVpZ2h0IC8gMiArICdweCc7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnN0eWxlLmxlZnQgPSB3IC8gMiAtIGNvbnRlbnRXaWR0aCAvIDIgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBoaWRlT3ZlcmxheSgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lclByb21pc2UpICR0aW1lb3V0LmNhbmNlbCh0aW1lclByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuc2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmdW5jID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiAoZG9jdW1lbnQuYm9keS5jdXJyZW50U3R5bGUpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChlbGVtZW50LCBhbnl0aGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFtcImN1cnJlbnRTdHlsZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCwgc3R5bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhlbGVtZW50LCBudWxsKVtzdHlsZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBwcm9maWxlS2V5ID0gXCJQcm9maWxlRGF0YVwiO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuXHJcbiAgICBhcHBcclxuICAgICAgICAuc2VydmljZSgnQWRtaW5TZXJ2aWNlJywgYWRtaW5TZXJ2aWNlKTtcclxuXHJcbiAgICBhZG1pblNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnLCAnbG9nZ2VyJywgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnYmFzZVVybDInXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZG1pblNlcnZpY2UoJGh0dHAsICRxLCBsb2dnZXIsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIGJhc2VVcmwyKSB7XHJcblxyXG4gICAgICAgIHZhciBhZG1pblNlcnZpY2VGYWN0b3J5ID0ge1xyXG4gICAgICAgICAgICByZW1vdmVEaXNoOiByZW1vdmVEaXNoLFxyXG4gICAgICAgICAgICByZW1vdmVSZXZpZXc6IHJlbW92ZVJldmlldyxcclxuICAgICAgICAgICAgZ2V0QWxsQ3JhdmluZ1RhZ3M6IGdldEFsbENyYXZpbmdUYWdzLFxyXG4gICAgICAgICAgICBnZXRBbGxSZWNlbnREaXNoZXM6IGdldEFsbFJlY2VudERpc2hlcyxcclxuICAgICAgICAgICAgZ2V0QWxsUmVjZW50UmV2aWV3czogZ2V0QWxsUmVjZW50UmV2aWV3cyxcclxuICAgICAgICAgICAgZ2V0QWxsUmVjZW50VXNlcnM6IGdldEFsbFJlY2VudFVzZXJzLFxyXG4gICAgICAgICAgICB1cGRhdGVDcmF2aW5nVGFnOiB1cGRhdGVDcmF2aW5nVGFnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFkbWluU2VydmljZUZhY3Rvcnk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZURpc2goZGlzaElkLCByZWFzb24pIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBSZWFzb246IHJlYXNvblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGJhc2VVcmwyICsgXCJkaXNoZXMvXCIgKyBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVJldmlldyhyZXZpZXdJZCwgcmVhc29uKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgUmVhc29uOiByZWFzb25cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBiYXNlVXJsMiArIFwiZGlzaGVzL3Jldmlldy9cIiArIHJldmlld0lkLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDcmF2aW5nVGFnKHRhZ0lkLCBhY3RpdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIElkOiB0YWdJZCxcclxuICAgICAgICAgICAgICAgIElzQWN0aXZlOiBhY3RpdmVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBiYXNlVXJsMiArIFwiY3JhdmluZ3MvXCIgKyB0YWdJZCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QWxsQ3JhdmluZ1RhZ3MocGFnZSwgbGltaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VVcmwyICsgXCJjcmF2aW5ncy9cIiArIFwiYWxsP3BhZ2VOdW1iZXI9XCIgKyBwYWdlICsgXCImcGFnZVNpemU9XCIgKyBsaW1pdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBbGxSZWNlbnREaXNoZXMocGFnZSwgbGltaXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlVXJsMiArIFwiZGlzaGVzL1wiICsgXCJhZG1pbi9hbGw/cGFnZU51bWJlcj1cIiArIHBhZ2UgKyBcIiZwYWdlU2l6ZT1cIiArIGxpbWl0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbFJlY2VudFJldmlld3MocGFnZSwgbGltaXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlVXJsMiArIFwiZGlzaGVzL1wiICsgXCJhZG1pbi9yZXZpZXcvYWxsP3BhZ2VOdW1iZXI9XCIgKyBwYWdlICsgXCImcGFnZVNpemU9XCIgKyBsaW1pdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBbGxSZWNlbnRVc2VycyhwYWdlLCBsaW1pdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VVcmwyICsgXCJkaW5lcnMvXCIgKyBcImFkbWluL2FsbD9wYWdlTnVtYmVyPVwiICsgcGFnZSArIFwiJnBhZ2VTaXplPVwiICsgbGltaXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgc3RvcmFnZUtleSA9IFwiYXV0aG9yaXphdGlvbkRhdGFcIjtcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJywgYXV0aEludGVyY2VwdG9yU2VydmljZSk7XHJcblxyXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnLCAnbG9nZ2VyJywgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnYXV0aFVybCcsICd0b2tlblVybCcsICdhdXRoU2V0dGluZ3MnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkaHR0cCwgJHEsIGxvZ2dlciwgbG9jYWxTdG9yYWdlU2VydmljZSwgYXV0aFVybCwgdG9rZW5VcmwsIGF1dGhTZXR0aW5ncykge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlQmFzZSA9IGF1dGhVcmw7XHJcbiAgICAgICAgLy8gTk9URTogYmVmb3JlIHdlIGxldCB0aGUgc2VydmljZSBwcm9wZXJ0eSByZXR1cm4gdGhpcyB2YXJpYWJsZSwgaXQgZG9lc24ndCB3b3JrIGluIHRoZSByZXN1bWUgdGFzayBzY2VuYXJpb1xyXG4gICAgICAgIC8vdmFyIGF1dGhlbnRpY2F0aW9uID0ge1xyXG4gICAgICAgIC8vICAgIGlzQXV0aDogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgZW1haWw6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgYXZhdGFyOiBcIlwiLFxyXG4gICAgICAgIC8vICAgIHVpZDogXCJcIixcclxuICAgICAgICAvLyAgICBkaW5lcklkOiBcIlwiLFxyXG4gICAgICAgIC8vICAgIHJvbGU6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcclxuICAgICAgICAvL307XHJcblxyXG4gICAgICAgIHZhciByb2xlQ2hlY2tUeXBlcyA9IHtcclxuICAgICAgICAgICAgYWxsOiBcImFsbFwiLFxyXG4gICAgICAgICAgICBhbnk6IFwiYW55XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgc2F2ZVJlZ2lzdHJhdGlvbjogc2F2ZVJlZ2lzdHJhdGlvbixcclxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICAgICAgICBsb2dPdXQ6IGxvZ091dCxcclxuICAgICAgICAgICAgZmlsbEF1dGhEYXRhOiBmaWxsQXV0aERhdGEsXHJcbiAgICAgICAgICAgIGFjdGl2YXRlOiBhY3RpdmF0ZSxcclxuICAgICAgICAgICAgZm9yZ2V0cGFzc3dvcmQ6IGZvcmdldHBhc3N3b3JkLFxyXG4gICAgICAgICAgICByZXNldHBhc3N3b3JkOiByZXNldHBhc3N3b3JkLCAvLyByZXF1ZXN0IHRvIHJlc2V0IHBhc3N3b3JkLCBuZWVkIGEgY29kZSB0byB1cGRhdGVcclxuICAgICAgICAgICAgY2hhbmdlcGFzc3dvcmQ6IGNoYW5nZXBhc3N3b3JkLCAvLyB0aGVzZSAyIG1ldGhvZHMgYXJlIGRpZmZlcmVudC4gdGhpcyBvbmUgaXMgcmVxdWlyZWQgdG8gZW50ZXIgdGhlIGN1cnJlbnQgcGFzc3dvcmRcclxuICAgICAgICAgICAgYXV0aGVudGljYXRpb246IHt9LFxyXG4gICAgICAgICAgICBsb2FkQ2xhaW1zOiBsb2FkQ2xhaW1zLFxyXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlZnJlc2hUb2tlbixcclxuICAgICAgICAgICAgYXV0aG9yaXplOiBhdXRob3JpemUsXHJcbiAgICAgICAgICAgIHJvbGVDaGVja1R5cGVzOiByb2xlQ2hlY2tUeXBlcyxcclxuICAgICAgICAgICAgZXh0ZXJuYWxMb2dpbjogZXh0ZXJuYWxMb2dpbixcclxuICAgICAgICAgICAgZ2V0QWNjZXNzVG9rZW46IGdldEFjY2Vzc1Rva2VuLFxyXG4gICAgICAgICAgICBleHRlcm5hbEF1dGhEYXRhOiB7fSxcclxuICAgICAgICAgICAgcmVnaXN0ZXJFeHRlcm5hbFVzZXI6IHJlZ2lzdGVyRXh0ZXJuYWxVc2VyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRDbGFpbXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyBcIi9nZXRDbGFpbXNcIikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZVJlZ2lzdHJhdGlvbihyZWdpc3RyYXRpb24pIHtcclxuICAgICAgICAgICAgbG9nT3V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJy9yZWdpc3RlcicsIHJlZ2lzdHJhdGlvbikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JnZXRwYXNzd29yZChlbWFpbCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICAnRW1haWwnOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICdSZXNlbmRDb25maXJtYXRpb25FbWFpbCc6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoc2VydmljZUJhc2UgKyAnL2ZvcmdldHBhc3N3b3JkJywgbW9kZWwsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0gfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXNldHBhc3N3b3JkKHJlc3REYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoc2VydmljZUJhc2UgKyAnL3Jlc2V0cGFzc3dvcmQnLCByZXN0RGF0YSwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZXBhc3N3b3JkKGNoYW5nZURhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArICcvY2hhbmdlcGFzc3dvcmQnLCBjaGFuZ2VEYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoaWQsIGNvZGUpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGVsID0ge1xyXG4gICAgICAgICAgICAgICAgJ1VzZXJJZCc6IGlkLFxyXG4gICAgICAgICAgICAgICAgJ0NvZGUnOiBjb2RlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHNlcnZpY2VCYXNlICsgJy9hY3RpdmF0ZScsIG1vZGVsLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4obG9naW5EYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gXCJncmFudF90eXBlPXBhc3N3b3JkJnVzZXJuYW1lPVwiICsgbG9naW5EYXRhLmVtYWlsICsgXCImcGFzc3dvcmQ9XCIgKyBsb2dpbkRhdGEucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgIGlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEgKyBcIiZjbGllbnRfaWQ9XCIgKyBhdXRoU2V0dGluZ3MuY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLnBvc3QodG9rZW5VcmwsIGRhdGEsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KHN0b3JhZ2VLZXksIGJ1aWxkQXV0aGVudGljYXRlU3RvcmFnZURhdGEocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIGZpbGxBdXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGxvZ091dCgpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHRlcm5hbExvZ2luKHByb3ZpZGVyLCAkc2NvcGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlZGlyZWN0VXJpID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0ICsgJy9tZC9leHRlcm5hbExvZ2luLmh0bWwnO1xyXG5cclxuICAgICAgICAgICAgdmFyIGV4dGVybmFsUHJvdmlkZXJVcmwgPSBzZXJ2aWNlQmFzZSArIFwiL0V4dGVybmFsTG9naW4/cHJvdmlkZXI9XCIgKyBwcm92aWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCImcmVzcG9uc2VfdHlwZT10b2tlblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiZjbGllbnRfaWQ9XCIgKyBhdXRoU2V0dGluZ3MuY2xpZW50SWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiJnJlZGlyZWN0X3VyaT1cIiArIHJlZGlyZWN0VXJpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LiR3aW5kb3dTY29wZSA9ICRzY29wZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvYXRoV2luZG93ID0gd2luZG93Lm9wZW4oZXh0ZXJuYWxQcm92aWRlclVybCwgXCJBdXRoZW50aWNhdGUgd2l0aCBcIiArIHByb3ZpZGVyLCBcImxvY2F0aW9uPTAsc3RhdHVzPTAsd2lkdGg9NjAwLGhlaWdodD03NTBcIik7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZXJuYWxVc2VyKGF1dGhEYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgXCIvUmVnaXN0ZXJFeHRlcm5hbFwiLCBhdXRoRGF0YSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGxvZ091dCgpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBY2Nlc3NUb2tlbihleHRlcm5hbERhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyAnL09idGFpbkxvY2FsQWNjZXNzVG9rZW4nLCB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHsgcHJvdmlkZXI6IGV4dGVybmFsRGF0YS5wcm92aWRlciwgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZXh0ZXJuYWxEYXRhLmV4dGVybmFsQWNjZXNzVG9rZW4gfVxyXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoc3RvcmFnZUtleSwgYnVpbGRBdXRoZW50aWNhdGVTdG9yYWdlRGF0YShyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgZmlsbEF1dGhEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dPdXQoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2hUb2tlbigpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoc3RvcmFnZUtleSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXV0aERhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0aERhdGEudXNlUmVmcmVzaFRva2Vucykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFwiZ3JhbnRfdHlwZT1yZWZyZXNoX3Rva2VuJnJlZnJlc2hfdG9rZW49XCIgKyBhdXRoRGF0YS5yZWZyZXNoVG9rZW4gKyBcIiZjbGllbnRfaWQ9XCIgKyBhdXRoU2V0dGluZ3MuY2xpZW50SWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoc3RvcmFnZUtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLnBvc3QodG9rZW5VcmwsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChzdG9yYWdlS2V5LCBidWlsZEF1dGhlbnRpY2F0ZVN0b3JhZ2VEYXRhKHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dPdXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkQXV0aGVudGljYXRlU3RvcmFnZURhdGEocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogcmVzcG9uc2UudXNlck5hbWUsIC8vIHRoaXMgaXMgdGhlIGVtYWlsIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcmVzcG9uc2UuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICBhdmF0YXI6IHJlc3BvbnNlLmF2YXRhcixcclxuICAgICAgICAgICAgICAgIHVpZDogcmVzcG9uc2UudWlkLFxyXG4gICAgICAgICAgICAgICAgZGluZXJJZDogd2luZG93LmhlbHBlci5wYXJzZUludDEwKHJlc3BvbnNlLmRpbmVySWQpLCAvLyBJIGNhbiBvbmx5IHdyaXRlIHN0cmluZyBiYWNrXHJcbiAgICAgICAgICAgICAgICByb2xlOiByZXNwb25zZS5yb2xlLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZS5yZWZyZXNoX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogcmVzcG9uc2UucmVmcmVzaF90b2tlbiAhPT0gdW5kZWZpbmVkICYmIHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4gIT09IFwiXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ091dCgpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoc3RvcmFnZUtleSk7XHJcbiAgICAgICAgICAgIHNlcnZpY2UuYXV0aGVudGljYXRpb24uaXNBdXRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlcnZpY2UuYXV0aGVudGljYXRpb24uZW1haWwgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsbEF1dGhEYXRhKCkge1xyXG4gICAgICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChzdG9yYWdlS2V5KTtcclxuICAgICAgICAgICAgaWYgKGF1dGhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmVtYWlsID0gYXV0aERhdGEuZW1haWw7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmRpc3BsYXlOYW1lID0gYXV0aERhdGEuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVpZCA9IGF1dGhEYXRhLnVpZDtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuYXV0aGVudGljYXRpb24uZGluZXJJZCA9IGF1dGhEYXRhLmRpbmVySWQ7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnJvbGVzID0gW2F1dGhEYXRhLnJvbGVdO1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5hdXRoZW50aWNhdGlvbi5hdmF0YXIgPSBhdXRoRGF0YS5hdmF0YXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRob3JpemUocmVxdWlyZWRSb2xlcywgcm9sZUNoZWNrVHlwZSkge1xyXG4gICAgICAgICAgICB2YXIgbnVtUm9sZXNGb3VuZCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlcXVpcmVkUm9sZXMgfHwgcmVxdWlyZWRSb2xlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJvbGVDaGVja1R5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJvbGVDaGVja1R5cGUgPSByb2xlQ2hlY2tUeXBlcy5hbGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBudW1Sb2xlc1JlcXVpcmVkID0gcm9sZUNoZWNrVHlwZSA9PT0gcm9sZUNoZWNrVHlwZXMuYW55ID8gMSA6IHJlcXVpcmVkUm9sZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgZmlsbEF1dGhEYXRhKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VydmljZS5hdXRoZW50aWNhdGlvbiAmJiBzZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcnZpY2UuYXV0aGVudGljYXRpb24ucm9sZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1RoaXNQZXJtaXNzaW9uID0gJC5pbkFycmF5KHNlcnZpY2UuYXV0aGVudGljYXRpb24ucm9sZXNbaV0udG9Mb3dlckNhc2UoKSwgcmVxdWlyZWRSb2xlcykgPj0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1RoaXNQZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bVJvbGVzRm91bmQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudW1Sb2xlc0ZvdW5kID09PSBudW1Sb2xlc1JlcXVpcmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlLiRpbmplY3QgPSBbJyRxJywgJyRpbmplY3RvcicsICdOYXZpZ2F0aW9uU2VydmljZScsICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ29jU2VydmljZSddO1xyXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2VwdG9yU2VydmljZSgkcSwgJGluamVjdG9yLCBuYXZpZ2F0aW9uU2VydmljZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgb2NTZXJ2aWNlRW5kUG9pbnQpIHtcclxuICAgICAgICB2YXIgaW50ZXJjZXB0b3IgPSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RIYW5kbGVyLFxyXG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiByZXNwb25zZUhhbmRsZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gaW50ZXJjZXB0b3I7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVlc3RIYW5kbGVyKGNvbmZpZykge1xyXG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gICAgICAgICAgICAvLyB3ZSBzaG91bGQgb25seSBpbnRlcmNlcHQgJGh0dHBQcm92aWRlciBpZiB3ZSBhcmUgcmVxdWVzdGluZyBvdXIgb3duIHNlcnZpY2VcclxuICAgICAgICAgICAgaWYgKGNvbmZpZy51cmwgJiYgY29uZmlnLnVybC5pbmRleE9mKG9jU2VydmljZUVuZFBvaW50KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChzdG9yYWdlS2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRoRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihyZWplY3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGF0dGVtcHRSZWZyZXNoQW5kUmV0cnlIdHRwUmVxdWVzdChyZWplY3Rpb24sIGRlZmVycmVkKTtcclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVqZWN0aW9uKTtcclxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF0dGVtcHRSZWZyZXNoQW5kUmV0cnlIdHRwUmVxdWVzdChyZWplY3Rpb24sIGRlZmVycmVkKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXV0aG9yaXphdGlvblNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdBdXRoU2VydmljZScpO1xyXG4gICAgICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChzdG9yYWdlS2V5KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IGEgYmV0dGVyIFVYIHNob3VsZCBiZSA6XHJcbiAgICAgICAgICAgIC8vIC0gaWYgdGhpcyBvcGVyYXRpb24gaXMgcmVqZWN0ZWQsIGl0IG1lYW5zIHRoZSBzZXJ2aWNlIG9wIG5lZWRzIGF1dGhlbnRpY2F0aW9uXHJcbiAgICAgICAgICAgIC8vIC0gd2Ugc2hvdWxkIHBvcHVwIHRoZSBsb2dpbiBmb3JtLCBhbmQgYXNrIGZvciBhdXRoZW50aWNhdGlvblxyXG4gICAgICAgICAgICAvLyAtIGxvZ2luIHRoZSB1c2VyLCBhbmQgdGhlbiBjb250aW51ZSB0aGUgb3BlcmF0aW9uXHJcbiAgICAgICAgICAgIGlmIChhdXRoRGF0YSAmJiBhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XHJcbiAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uU2VydmljZS5yZWZyZXNoVG9rZW4oKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0cnlIdHRwUmVxdWVzdChyZWplY3Rpb24uY29uZmlnLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBuZXZlciBvY2N1ciwgdW5sZXNzIHRoZSByZWZyZXNoIHRva2VuIHdhcyBleHBsaWNpdGx5IHJldm9rZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdG9VbmF1dGhvcml6ZWRQYWdlKGF1dGhvcml6YXRpb25TZXJ2aWNlLCByZWplY3Rpb24sIGRlZmVycmVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnb3RvVW5hdXRob3JpemVkUGFnZShhdXRob3JpemF0aW9uU2VydmljZSwgcmVqZWN0aW9uLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJldHJ5SHR0cFJlcXVlc3QoY29uZmlnLCBkZWZlcnJlZCkge1xyXG4gICAgICAgICAgICB2YXIgaHR0cFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cCcpO1xyXG4gICAgICAgICAgICBodHRwU2VydmljZShjb25maWcpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBoYXBwZW5zLCB3aHk/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ290b1VuYXV0aG9yaXplZFBhZ2UoYXV0aG9yaXphdGlvblNlcnZpY2UsIHJlamVjdGlvbiwgZGVmZXJyZWQpIHtcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvblNlcnZpY2UubG9nT3V0KCk7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZWplY3Rpb24pO1xyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbyhcImxvZ2luXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuICAgIGFwcC5zZXJ2aWNlKCdDcmF2aW5nU2VydmljZScsIGNyYXZpbmdTZXJ2aWNlKTtcclxuXHJcbiAgICBjcmF2aW5nU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcScsICdiYXNlVXJsMiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyYXZpbmdTZXJ2aWNlKCRodHRwLCAkcSwgYmFzZVVybDIpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXNcclxuXHJcbiAgICAgICAgICAgIC8vIG1ldGhvZHNcclxuICAgICAgICAgICAgZ2V0VHJlbmRpbmc6IGdldFRyZW5kaW5nSGFuZGxlcixcclxuICAgICAgICAgICAgc2VhcmNoQ3JhdmluZzogc2VhcmNoQ3JhdmluZ0hhbmRsZXIsXHJcbiAgICAgICAgICAgIGdldFJlY2VudDogZ2V0UmVjZW50SGFuZGxlcixcclxuICAgICAgICAgICAgZ2V0RGlzaDogZ2V0RGlzaEhhbmRsZXIsXHJcbiAgICAgICAgICAgIGdldENyYXZpbmdEaW5lcnM6IGdldENyYXZpbmdEaW5lcnMsXHJcbiAgICAgICAgICAgIGdldERpc2hSZXZpZXc6IGdldERpc2hSZXZpZXcsXHJcblxyXG4gICAgICAgICAgICBjcmF2ZUZvckl0OiBjcmF2ZUZvckl0SGFuZGxlcixcclxuICAgICAgICAgICAgdXBkYXRlQ3JhdmluZ3M6IHVwZGF0ZUNyYXZpbmdzLFxyXG4gICAgICAgICAgICB1cGRhdGVEZXNjcmlwdGlvbjogdXBkYXRlRGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIGFkZEZpbGU6IGFkZEZpbGUsXHJcbiAgICAgICAgICAgIGFkZFJldmlldzogYWRkUmV2aWV3LFxyXG4gICAgICAgICAgICB1cGRhdGVSZXZpZXc6IHVwZGF0ZVJldmlldyxcclxuICAgICAgICAgICAgYWRkT3BpbmlvbjogYWRkT3BpbmlvblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICAvLyB1c2VkIHRvIHZvdGUgaWYgYSByZXZpZXcgaXMgdXNlZnVsIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE9waW5pb24oZGlzaElkLCByZXZpZXdJZCwgZGluZXJJZCwgaXNVc2VmdWwpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBcIkRpc2hJZFwiOiBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld0lkXCI6IHJldmlld0lkLFxyXG4gICAgICAgICAgICAgICAgXCJEaW5lcklkXCI6IGRpbmVySWQsXHJcbiAgICAgICAgICAgICAgICBcIklzVXNlZnVsXCI6IGlzVXNlZnVsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VVcmwyICsgXCJkaXNoZXMvXCIgKyBkaXNoSWQgKyBcIi9yYXRpbmcvXCIgKyByZXZpZXdJZCArIFwiL29waW5pb25cIiwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVSZXZpZXcoZGlzaElkLCByZXZpZXdJZCwgcmF0aW5nLCByZXZpZXcsIGRpbmVySWQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBcIkRpc2hJZFwiOiBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICBcIlJhdGluZ1wiOiByYXRpbmcsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld1wiOiByZXZpZXcsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld2VySWRcIjogZGluZXJJZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlVXJsMiArIFwiZGlzaGVzL1wiICsgZGlzaElkICsgXCIvcmF0aW5nL1wiICsgcmV2aWV3SWQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkUmV2aWV3KGRpc2hJZCwgcmF0aW5nLCByZXZpZXcsIGRpbmVySWQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBcIkRpc2hJZFwiOiBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICBcIlJhdGluZ1wiOiByYXRpbmcsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld1wiOiByZXZpZXcsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld2VySWRcIjogZGluZXJJZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZVVybDIgKyBcImRpc2hlcy9cIiArIGRpc2hJZCArIFwiL3JhdGluZ1wiLCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZURlc2NyaXB0aW9uKGRpc2hJZCwgZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBcIkRpc2hJZFwiOiBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VVcmwyICsgXCJkaXNoZXMvXCIgKyBkaXNoSWQgKyBcIi9kZXNjcmlwdGlvblwiLCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERpc2hSZXZpZXcoZGlzaElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZVVybDIgKyBcImRpc2hlcy9cIiArIGRpc2hJZCArIFwiL3Jldmlld3NcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRDcmF2aW5nRGluZXJzKGRpc2hJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VVcmwyICsgXCJkaXNoZXMvXCIgKyBkaXNoSWQgKyBcIi9jcmF2aW5nZGluZXJzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGlzaEhhbmRsZXIoZGlzaElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZVVybDIgKyBcImRpc2hlcy9cIiArIGRpc2hJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaXR5IC0gYSBzdHJpbmcgb2YgY2l0eSBuYW1lXHJcbiAgICAgICAgLy8gbG9jYXRpb24gLSBhIGdlbyBsb2NhdGlvbjogaXQgc2hvdWxkIGJlIGZvbWF0dGVkIGFzIFwibGF0LCBsb25cIiwgd2l0aG91dCBxdW90YXRpb24gbWFya3MgXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VHJlbmRpbmdIYW5kbGVyKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgb3AgY2FuIGJlIHBhZ2VkLCBidXQgSSBkb24ndCBrbm93IGlmIHdlIG5lZWQgdG8sIGxldCdzIGp1c3Qgc2ltcGx5IGdldCBldmVyeXRoaW5nIGFuZCBjYWNoZSBpdFxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBiYXNlVXJsMiArIFwiY3JhdmluZ3MvdHJlbmRpbmc/c2hvd0FsbD10cnVlJiZsb2NhdGlvbj1cIiArIGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNlZCB3aGVuIGEgdXNlciBjbGlja3MgdGhlIFtDcmF2ZV0gaWNvbiBvZiBhIGRpc2ggXHJcbiAgICAgICAgLy8gXCJmaXJlLWFuZC1mb3JnZXRcIiBcclxuICAgICAgICBmdW5jdGlvbiBjcmF2ZUZvckl0SGFuZGxlcihkaXNoSWQpIHtcclxuICAgICAgICAgICAgLy8gSSBhbSBub3Qgc3VyZSB3aGF0IHdlIG5lZWQgdG8gZG9cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlVXJsMiArIFwiY3JhdmluZ3MvZGlzaC9cIiArIGRpc2hJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWFyY2hDcmF2aW5nSGFuZGxlcihjcmF2aW5ncywgY2l0eSwgbG9jYXRpb24sIHBhZ2VOdW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2VTaXplID0gMjA7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VVcmwyICsgXCJkaXNoZXMvc2VhcmNoL1wiICsgY2l0eSArIFwiP2NyYXZpbmdzPVwiICsgY3JhdmluZ3MgKyBcIiZsb2NhdGlvbj1cIiArIGxvY2F0aW9uICsgXCImcGFnZU51bWJlcj1cIiArIHBhZ2VOdW1iZXIgKyBcIiZwYWdlU2l6ZT1cIiArIHBhZ2VTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRSZWNlbnRIYW5kbGVyKGNpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlVXJsMiArIFwiZGlzaGVzL1wiICsgY2l0eSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDcmF2aW5ncyhkaXNoSWQsIGNyYXZpbmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZVVybDIgKyAnZGlzaGVzLycgKyBkaXNoSWQgKyAnL2NyYXZpbmdzJywgeyAnQ3JhdmluZ3MnOiBjcmF2aW5ncyB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEZpbGUoZGlzaElkLCBmaWxlTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlVXJsMiArICdkaXNoZXMvJyArIGRpc2hJZCArICcvZmlsZScsIHtcclxuICAgICAgICAgICAgICAgICdEaXNoSWQnOiBkaXNoSWQsXHJcbiAgICAgICAgICAgICAgICAnRmlsZU5hbWUnOiBmaWxlTmFtZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBwcm9maWxlS2V5ID0gXCJQcm9maWxlRGF0YVwiO1xyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnKTtcclxuXHJcbiAgICBhcHBcclxuICAgICAgICAuc2VydmljZSgnRGluZXJTZXJ2aWNlJywgZGluZXJTZXJ2aWNlKTtcclxuXHJcbiAgICBkaW5lclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnLCAnbG9nZ2VyJywgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnYmFzZVVybDInXTtcclxuXHJcbiAgICBmdW5jdGlvbiBkaW5lclNlcnZpY2UoJGh0dHAsICRxLCBsb2dnZXIsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIGJhc2VVcmwyLCBnZW5lcmljQXZhdGFyKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2VCYXNlID0gYmFzZVVybDI7XHJcblxyXG4gICAgICAgIC8vIGRpbmVyU3VtbWFyeSBcclxuICAgICAgICB2YXIgcHJvZmlsZSA9IHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHRhZ0xpbmU6IFwiXCIsXHJcbiAgICAgICAgICAgIGF2YXRhcjogXCJcIixcclxuICAgICAgICAgICAgYmlydGhkYXk6IFwiXCIsXHJcbiAgICAgICAgICAgIGVtYWlsOiBcIlwiLFxyXG4gICAgICAgICAgICBpZDogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBkaW5lclNlcnZpY2VGYWN0b3J5ID0ge1xyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIHByb2ZpbGU6IHByb2ZpbGUsXHJcbiAgICAgICAgICAgIC8vIG1ldGhvZHMgXHJcbiAgICAgICAgICAgIGdldDogZ2V0RGluZXIsXHJcbiAgICAgICAgICAgIGdldE15UHJvZmlsZTogZ2V0TXlQcm9maWxlLFxyXG4gICAgICAgICAgICB1cGRhdGVNeVByb2ZpbGU6IHVwZGF0ZU15UHJvZmlsZSxcclxuICAgICAgICAgICAgdXBkYXRlRGlzbGlrZTogdXBkYXRlRGlzbGlrZSxcclxuICAgICAgICAgICAgZ2V0RGlzbGlrZTogZ2V0RGlzbGlrZSxcclxuICAgICAgICAgICAgZ2V0UmVjZW50Q3JhdmluZ3M6IGdldFJlY2VudENyYXZpbmdzLFxyXG4gICAgICAgICAgICBnZXRSZWNlbnRSZXZpZXdzOiBnZXRSZWNlbnRSZXZpZXdzLFxyXG4gICAgICAgICAgICBnZXRSZWNlbnRBZGRlZERpc2hlczogZ2V0UmVjZW50QWRkZWREaXNoZXMsXHJcbiAgICAgICAgICAgIGdldFJlY2VudEZhdm9yaXRlczogZ2V0UmVjZW50RmF2b3JpdGVzLFxyXG5cclxuICAgICAgICAgICAgZmx1c2g6IGNsZWFudXBDYWNoZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBkaW5lclNlcnZpY2VGYWN0b3J5O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaW5lcihpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNlcnZpY2VCYXNlICsgXCJkaW5lcnMvcHJvZmlsZS9cIiArIGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE15UHJvZmlsZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldENhY2hlZFByb2ZpbGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU15UHJvZmlsZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArIFwiZGluZXJzL1wiICsgcHJvZmlsZS5pZCArIFwiL3VwZGF0ZVwiLCBwcm9maWxlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UHJvZmlsZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZVByb2ZpbGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGlzbGlrZShpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNlcnZpY2VCYXNlICsgXCJkaW5lcnMvXCIgKyBpZCArIFwiL2Rpc2xpa2VzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVjZW50Q3JhdmluZ3MoaWQsIGFsbCkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gc2VydmljZUJhc2UgKyBcImRpbmVycy9cIiArIGlkICsgXCIvcmVjZW50L2NyYXZpbmdzXCI7XHJcbiAgICAgICAgICAgIGlmIChhbGwpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHVybCArIFwiP2FsbD10cnVlXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlY2VudFJldmlld3MoaWQsIGFsbCkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gc2VydmljZUJhc2UgKyBcImRpbmVycy9cIiArIGlkICsgXCIvcmVjZW50L3Jldmlld3NcIjtcclxuICAgICAgICAgICAgaWYgKGFsbCkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsICsgXCI/YWxsPXRydWVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRSZWNlbnRBZGRlZERpc2hlcyhpZCwgYWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlQmFzZSArIFwiZGluZXJzL1wiICsgaWQgKyBcIi9yZWNlbnQvZGlzaGVzXCI7XHJcbiAgICAgICAgICAgIGlmIChhbGwpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHVybCArIFwiP2FsbD10cnVlXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlY2VudEZhdm9yaXRlcyhpZCwgYWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlQmFzZSArIFwiZGluZXJzL1wiICsgaWQgKyBcIi9yZWNlbnQvZmF2b3JpdGVzXCI7XHJcbiAgICAgICAgICAgIGlmIChhbGwpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHVybCArIFwiP2FsbD10cnVlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlRGlzbGlrZShpZCwgY3JhdmluZ0lkcykge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIFwiQ3JhdmluZ3NcIjogY3JhdmluZ0lkcyxcclxuICAgICAgICAgICAgICAgIFwiSWRcIjogaWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoc2VydmljZUJhc2UgKyBcImRpbmVycy9cIiArIGlkICsgXCIvZGlzbGlrZXNcIiwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRDYWNoZWRQcm9maWxlKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByb2ZpbGVEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQocHJvZmlsZUtleSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvZmlsZURhdGEgfHwgIXByb2ZpbGVEYXRhLmlkIHx8ICFwcm9maWxlRGF0YS5kaXNwbGF5TmFtZSB8fCAhcHJvZmlsZURhdGEuZW1haWwpIHtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwiZGluZXJzL3Byb2ZpbGVcIikudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmRpc3BsYXlOYW1lID0gcmVzcG9uc2UuZGF0YS5EaXNwbGF5TmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUudGFnTGluZSA9IHJlc3BvbnNlLmRhdGEuVGFnTGluZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuYXZhdGFyID0gcmVzcG9uc2UuZGF0YS5BdmF0YXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmJpcnRoZGF5ID0gbmV3IERhdGUocmVzcG9uc2UuZGF0YS5CaXJ0aGRheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmVtYWlsID0gcmVzcG9uc2UuZGF0YS5FbWFpbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuaWQgPSByZXNwb25zZS5kYXRhLklkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9maWxlLmF2YXRhciA9IHdpbmRvdy5oZWxwZXIuZ2V0U2FmZUF2YXRhckltYWdlKHByb2ZpbGUuYXZhdGFyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVQcm9maWxlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZS5kaXNwbGF5TmFtZSA9IHByb2ZpbGVEYXRhLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZS50YWdMaW5lID0gcHJvZmlsZURhdGEudGFnTGluZTtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGUuYXZhdGFyID0gcHJvZmlsZURhdGEuYXZhdGFyO1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZS5iaXJ0aGRheSA9IG5ldyBEYXRlKHByb2ZpbGVEYXRhLmJpcnRoZGF5KTtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGUuZW1haWwgPSBwcm9maWxlRGF0YS5lbWFpbDtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGUuaWQgPSBwcm9maWxlRGF0YS5pZDtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJvZmlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cENhY2hlKCkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZShwcm9maWxlS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFByb2ZpbGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgcHJvZmlsZS5kaXNwbGF5TmFtZSA9IHJlc3BvbnNlLkRpc3BsYXlOYW1lO1xyXG4gICAgICAgICAgICBwcm9maWxlLnRhZ0xpbmUgPSByZXNwb25zZS5UYWdMaW5lO1xyXG4gICAgICAgICAgICBwcm9maWxlLmF2YXRhciA9IHJlc3BvbnNlLkF2YXRhcjtcclxuICAgICAgICAgICAgcHJvZmlsZS5iaXJ0aGRheSA9IG5ldyBEYXRlKHJlc3BvbnNlLkJpcnRoZGF5KTtcclxuICAgICAgICAgICAgcHJvZmlsZS5lbWFpbCA9IHJlc3BvbnNlLkVtYWlsIHx8IHJlc3BvbnNlLlByaW1hcnlFbWFpbDtcclxuICAgICAgICAgICAgcHJvZmlsZS5pZCA9IHJlc3BvbnNlLklkO1xyXG4gICAgICAgICAgICAvLyBwcm9maWxlLmF2YXRhciA9IHdpbmRvdy5oZWxwZXIuZ2V0U2FmZUF2YXRhckltYWdlKHByb2ZpbGUuYXZhdGFyKTtcclxuICAgICAgICAgICAgcHJvZmlsZS5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYWNoZVByb2ZpbGUoKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9maWxlICE9PSBudWxsICYmIHByb2ZpbGUuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KHByb2ZpbGVLZXksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcHJvZmlsZS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnTGluZTogcHJvZmlsZS50YWdMaW5lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXI6IHByb2ZpbGUuYXZhdGFyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaXJ0aGRheTogcHJvZmlsZS5iaXJ0aGRheSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHByb2ZpbGUuZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9maWxlLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyB3ZSBhcmUgdXNpbmcgRmFjdHVhbCBBUEkgYmVjYXVzZSBpdCBkb2Vzbid0IGhhdmUgdGhlIGxpbWl0YXRpb25zIHRoYXQgR29vZ2xlIFBsYWNlcyBBUEkgaGFzLCBcclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3BsYWNlcy93ZWJzZXJ2aWNlL3VzYWdlXHJcbiAgICAvLyBHb29nbGUgY29uc3RyYWludHM6IFxyXG4gICAgLy8gMSkgMTAwMCByZXF1ZXN0cyBwZXIgMjQgaG91cnMsIGNhbiBnZXQgMTUwLCAwMDAgcmVxdWVzdHMgcGVyIDI0IGhvdXJzIGlmIHZlcmlmaWVkXHJcbiAgICAvLyAyKSBtYXggNjAgcmVjb3JkcywgMjAgZWFjaCByZXF1ZXN0LCBtdXN0IHdhaXQgMiBzZWNvbmRzIGZvciB0aGUgbmV4dCBwYWdlIFxyXG4gICAgLy8gMykgZWFjaCB0ZXh0IHNlYXJjaCBpcyBjb3VudGVkIGFzIDEwIHJlcXVlc3RzLCB3aGljaCBtZWFucyBpZiB3ZSB3YW50IHRvIHN1cHBvcnQgd2lsZGNhcmQgc2VhcmNoIG9mIHJlc3RhdXJhbnQsIGl0IG1pZ2h0IGJlIHVucHJlZGljdGFibGUgXHJcblxyXG4gICAgLy8gRmFjdHVhbEFQSSBzdXBwb3J0cyAxMEsgZnJlZSByZXF1ZXN0cyBwZXIgZGF5IFxyXG4gICAgLy8gbm8gbWF4IHJlY29yZCBsaW1pdCwgbm8gcGFnaW5nIGRlbGF5LCBjYW4gbmF2aWdhdGUgbmV4dCBhbmQgcHJldmlvdXMsIGNhbiBzdXBwb3J0IGRpZmZlcmVudCBzZWFyY2ggbWV0aG9kcyBcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuc2VydmljZSgnRmFjdHVhbFNlcnZpY2UnLCBmYWN0dWFsU2VydmljZSk7XHJcblxyXG4gICAgZmFjdHVhbFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnbG9nZ2VyJ107XHJcblxyXG4gICAgLy8gVE9ETzogdGhpcyBzZXJ2aWNlIGlzIG5vdCBzdXBwb3NlZCB0byBleGlzdCBpbiB0aGlzIGZvcm0sIGluc3RlYWQsIGl0IHNob3VsZCBjYWxsIG91ciBvd24gc2VydmljZSwgd2hpY2ggaW50ZXJuYWxseSBjYWxsIEZhY3R1YWxBUEk7XHJcbiAgICAvLyBmb3IgMiByZWFzb25zOiAxKSB3ZSBkb24ndCBoYXZlIHRvIGV4cG9zZSB3aGF0IGV4dGVybmFsIEFQSSBhbmQgdGhlIEFQSSBrZXkgd2UgYXJlIHVzaW5nIHRvIHRoZSBjbGllbnQgc2lkZSBcclxuICAgIC8vIDIpIGlmIHdlIGV2ZXIgbmVlZCB0byBjaGFuZ2UgdGhlIGRlcGVuZGVuY3ksIHdlIGNoYW5nZSBpbiBvdXIgc2VydmVyIHNpZGUsIHNvIHRoZSBjbGllbnQgc2lkZSBkb2Vzbid0IGhhdmUgYW55IGltcGFjdC4gXHJcbiAgICAvLyBpdCdzIGhlcmUgbm93IGJlY2F1c2UgYWZ0ZXIgSSBjcmFmdGVkIHRoZSBzZXJ2ZXIgc2lkZSBzZXJ2aWNlLCBJIGFjdHVhbGx5IG5lZWQgbW9yZSBkYXRhIGFuZCBhbiBhZGRpdGlvbmFsIG9wLCBJIGVuZGVkdXAgcXVpY2tseSBhZGRpbmcgdGhlbSBoZXJlIGluc3RlYWQgXHJcbiAgICBmdW5jdGlvbiBmYWN0dWFsU2VydmljZSgkaHR0cCwgbG9nZ2VyKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzO1xyXG4gICAgICAgIHZhciBmYWN0dWFsS2V5ID0gXCJLRVk9cXIzSkRVTEtrOTFCdHhXYlpsbk8zVEVBNlZyUmllaDFHMXl5emxFUFwiO1xyXG4gICAgICAgIHZhciBzZXJ2aWNlQmFzZVVybCA9IFwiaHR0cDovL2FwaS52My5mYWN0dWFsLmNvbS90L3BsYWNlc1wiO1xyXG5cclxuICAgICAgICB2YXIgc2VhcmNoVXJsID0gc2VydmljZUJhc2VVcmwgKyBcIj9nZW89e1xcXCIkY2lyY2xlXFxcIjp7XFxcIiRjZW50ZXJcXFwiOlt7MH0sIHsxfV0sXFxcIiRtZXRlcnNcXFwiOiAyMDAwfX1cIiArXHJcbiAgICAgICAgICAgIFwiJmZpbHRlcnM9e1xcXCJjYXRlZ29yeV9pZHNcXFwiOntcXFwiJGluY2x1ZGVzX2FueVxcXCI6WzMxMiwzNDddfX1cIiArXHJcbiAgICAgICAgICAgIFwiJmluY2x1ZGVfY291bnQ9dHJ1ZSZcIiArIGZhY3R1YWxLZXk7XHJcblxyXG4gICAgICAgIHZhciBnZXRCeU5hbWVVcmwgPSBzZXJ2aWNlQmFzZVVybCArIFwiP1wiICtcclxuICAgICAgICAgICAgXCJmaWx0ZXJzPXtcIiArXHJcbiAgICAgICAgICAgICAgICBcIlxcXCIkYW5kXFxcIjogW1wiICtcclxuICAgICAgICAgICAgICAgICAgXCJ7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgXCJcXFwiY2F0ZWdvcnlfaWRzXFxcIjoge1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcXCIkaW5jbHVkZXNfYW55XFxcIjogWzMxMiwzNDddXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgXCJ9XCIgK1xyXG4gICAgICAgICAgICAgICAgICBcIn0sXCIgK1xyXG4gICAgICAgICAgICAgICAgICBcIntcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICBcIlxcXCJuYW1lXFxcIjoge1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcXCIkc2VhcmNoXFxcIjogXFxcInswfVxcXCJcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICBcIn1cIiArXHJcbiAgICAgICAgICAgICAgICAgIFwifSxcIiArXHJcbiAgICAgICAgICAgICAgICAgIFwie1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgIFwiXFxcImxvY2FsaXR5XFxcIjoge1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcXCIkZXFcXFwiOlxcXCJ7MX1cXFwifX1dfVwiICtcclxuICAgIFwiJmluY2x1ZGVfY291bnQ9dHJ1ZSZcIiArIGZhY3R1YWxLZXk7XHJcblxyXG4gICAgICAgIHZhciBmaW5kSW5DaXR5VXJsID0gXCJodHRwOi8vYXBpLnYzLmZhY3R1YWwuY29tL3QvcGxhY2VzLXVzP3E9ezJ9JmZpbHRlcnM9e1xcXCIkYW5kXFxcIjpbe1xcXCJsb2NhbGl0eVxcXCI6XFxcInswfVxcXCJ9LHtcXFwicmVnaW9uXFxcIjpcXFwiezF9XFxcIn1dfSZsaW1pdD0xJnNlbGVjdD1uYW1lLGFkZHJlc3MscG9zdGNvZGUmXCIgKyBmYWN0dWFsS2V5O1xyXG5cclxuICAgICAgICBzZXJ2aWNlLnNlYXJjaE5lYXIgPSBnZXREYXRhO1xyXG4gICAgICAgIHNlcnZpY2UuZ2V0UGxhY2UgPSBnZXRQbGFjZTtcclxuICAgICAgICBzZXJ2aWNlLmdldEJ5TmFtZSA9IGdldEJ5TmFtZTtcclxuICAgICAgICBzZXJ2aWNlLmZpbmRJbkNpdHkgPSBmaW5kSW5DaXR5O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLy8gbmFtZSBpcyB0aGUgbmFtZSBvZiBhIHJlc3RhdXJhbnRcclxuICAgICAgICBmdW5jdGlvbiBmaW5kSW5DaXR5KG5hbWUsIGNpdHksIHJlZ2lvbikge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gZ2V0QnlOYW1lVXJsLmZvcm1hdChjaXR5LCByZWdpb24sIGVzY2FwZShuYW1lKSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogdXJsIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRCeU5hbWUobmFtZSwgY2l0eSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IGVzY2FwZShuYW1lKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IGdldEJ5TmFtZVVybC5mb3JtYXQoc2VhcmNoVGV4dCwgY2l0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogdXJsIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRhKGxhdCwgbG5nLCBvZmZzZXQsIGxpbWl0KSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBzZWFyY2hVcmwuZm9ybWF0KGxhdCwgbG5nKTtcclxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwgKyBcIiZvZmZzZXQ9XCIgKyBvZmZzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsICsgXCImbGltaXQ9XCIgKyBsaW1pdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBsYWNlKHBsYWNlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9IHNlcnZpY2VCYXNlVXJsICsgXCIvXCIgKyBwbGFjZUlkICsgXCI/XCIgKyBmYWN0dWFsS2V5O1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIVN0cmluZy5wcm90b3R5cGUuZm9ybWF0KSB7XHJcbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCcgPyBhcmdzW251bWJlcl0gOiBtYXRjaDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIHBhcnQgb2YgdGhpcyBmaWxlIGNvbWUgZnJvbSBhIGdpdGh1YiBvcGVuIHNvdXJjZSBwcm9qZWN0LCBidXQgaXQgd2FzIGEgZmFjdG9yeS4gXHJcbiAgICAvLyBjb252ZXJ0ZWQgaXQgdG8gYSBzZXJ2aWNlIHNvIG9ubHkgb25lIGluc3RhbmNlIHdpbGwgYmUgY3JlYXRlZCwgYW5kIHdlIGRvbid0IGhhdmUgdG8gcmVxdWVzdCBnZW9sb2NhdGlvbiBmcm9tIHRoZSBicm93c2VyIFxyXG4gICAgLy8gaG93ZXZlciwgYSBkcmF3IGJhY2sgaXM6IGlmIHRoZSB1c2VyIGhhcyB0aGUgYnJvd3NlciBvcGVuIGFuZCB0aGVuIHRyYXZlbCB0byBhbm90aGVyIGNpdHkgKGtlZXAgdGhlIGJyb3dzZXIgb3BlbmVkKSwgdGhlIGdlb2xvY2F0aW9uIHdvbid0IHJlZnJlc2hcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcblxyXG4gICAgYXBwXHJcbiAgICAgICAgLnNlcnZpY2UoJ0dlb1NlcnZpY2UnLCBnZW9TZXJ2aWNlKTtcclxuXHJcbiAgICBnZW9TZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHdpbmRvdycsICckcScsICckaHR0cCcsICdiYXNlVXJsMiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdlb1NlcnZpY2UoJHJvb3RTY29wZSwgJHdpbmRvdywgJHEsICRodHRwLCBiYXNlVXJsMikge1xyXG5cclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFBvc2l0aW9uOiBnZXRDdXJyZW50UG9zaXRpb24sXHJcbiAgICAgICAgICAgIGluaXRpYWxpemU6IGluaXRpYWxpemUsXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBnZXRQb3NpdGlvbixcclxuICAgICAgICAgICAgdXBkYXRlUG9zaXRpb246IHVwZGF0ZVBvc2l0aW9uLFxyXG5cclxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyBcclxuICAgICAgICAgICAgcG9zaXRpb246IHt9LFxyXG4gICAgICAgICAgICBoYXNJbml0aWFsaXplZDogZmFsc2UsXHJcbiAgICAgICAgICAgIEdFT19VUERBVEU6ICdnZW9fdXBkYXRlZCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydGVkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2dlb2xvY2F0aW9uJyBpbiAkd2luZG93Lm5hdmlnYXRvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBvc2l0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VydmljZS5wb3NpdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2UuaGFzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgaWYgKHNlcnZpY2UucG9zaXRpb24gJiYgc2VydmljZS5wb3NpdGlvbi5jb29yZHMgJiYgc2VydmljZS5wb3NpdGlvbi51c2VyTG9jYXRpb24gJiYgc2VydmljZS5wb3NpdGlvbi51c2VyTG9jYXRpb24uY2l0eSkge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5oYXNJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHNlcnZpY2UucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9hZEdlbygpLnRoZW4obG9hZFBsYWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgaWYgKHN1cHBvcnRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93Lm5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgYSB2ZXJ5IHN0cmFuZ2UgaXNzdWUuIEkgZW5jb3VudGVyZWQgYSBmZXcgdGltZXMgdGhlIHJldHVybmVkIGxvY2F0aW9uIGlzIGZhciBvZmYgZnJvbSB3aGVyZSBJIGFtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY2N1cmFjeSBpcyBvdmVyIDYwMDAuIGRpZCBzb21lIHJlc2VhcmNoLCBpdCBzZWVtcyBpZiBrZWVwIGNhbGxpbmcgdGhpcyBnZXRDdXJyZW50UG9zaXRpb24sIGl0IHdpbGwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBiZXR0ZXIgYWNjdXJhdGUgdmFsdWUgZWFjaCB0aW1lLiBzb21lb25lIGV2ZW4gd3JvdGUgYSBsaWJyYXJ5IHRvIHBhc3MgaW4gYSBkZXNpcmVkIGFjY3VyYWN5IGFuZCByZXR1cm4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaWYgdGhlIHZhbHVlIGlzIG1ldCwgYnV0IEkgdGhpbmsgdGhhdCdzIG92ZXJraWxsZWQsIGhlcmUgY2FsbGluZyBpdCB0d2ljZSBpcyBwcm9iYWJseSBlbm91Z2ggXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3kgPiA1MDAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93Lm5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHNlY29uZFBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kUG9zaXRpb24oc2Vjb25kUG9zaXRpb24sIGRlZmVycmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRQb3NpdGlvbihwb3NpdGlvbiwgZGVmZXJyZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7IGVycm9yOiBlcnJvciB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1RoaXMgd2ViIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBIVE1MNSBHZW9sb2NhdGlvbidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvdW5kUG9zaXRpb24ocG9zaXRpb24sIGRlZmVycmVkKSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2UucG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgc2VydmljZS5wb3NpdGlvbi5jb29yZHMgPSBwb3NpdGlvbi5jb29yZHM7XHJcbiAgICAgICAgICAgIHNlcnZpY2UucG9zaXRpb24udGltZXN0YW1wID0gcG9zaXRpb24udGltZXN0YW1wO1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRHZW8oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRDdXJyZW50UG9zaXRpb24oeyB0aW1lb3V0OiA2MDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IGZhbHNlLCBtYXhpbXVtQWdlOiA2MDAwMCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQbGFjZShwb3NpdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gbG9jYXRlVXNlckxvY2F0aW9uKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UucG9zaXRpb24udXNlckxvY2F0aW9uID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnBvc2l0aW9uLnVzZXJMb2NhdGlvbi5jaXR5ID0gcmVzcG9uc2UuZGF0YS5DaXR5O1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5wb3NpdGlvbi51c2VyTG9jYXRpb24ucmVnaW9uID0gcmVzcG9uc2UuZGF0YS5SZWdpb247XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLnBvc2l0aW9uLnVzZXJMb2NhdGlvbi5jb3VudHJ5ID0gcmVzcG9uc2UuZGF0YS5Db3VudHJ5O1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5oYXNJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlUG9zaXRpb24oc2VydmljZS5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChzZXJ2aWNlLkdFT19VUERBVEUsIHBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvY2F0ZVVzZXJMb2NhdGlvbihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlQmFzZSA9IGJhc2VVcmwyO1xyXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB7XHJcbiAgICAgICAgICAgICAgICBcImxvY2F0aW9uXCI6IGxhdGl0dWRlICsgXCIsXCIgKyBsb25naXR1ZGVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyBcInJlc3RhdXJhbnRzL2xvY2F0aW9uXCIsIHsgcGFyYW1zOiBpbnB1dCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdMb2FkZXJGYWN0b3J5JywgbG9hZGVyRmFjdG9yeSk7XHJcblxyXG4gICAgbG9hZGVyRmFjdG9yeS4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZGVyRmFjdG9yeSgpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1heExpc3RlbmVycykge1xyXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IE5PVCBVU0VEXHJcbiAgICAgICAgICAgIGxvYWRlci5tYXhMaXN0ZW5lcnMgPSBtYXhMaXN0ZW5lcnMgfHwgMTAwO1xyXG5cclxuICAgICAgICAgICAgbG9hZGVyLmN1cnJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGxvYWRlci5sb2FkZWRFdmVudHMgPSBbXTtcclxuICAgICAgICAgICAgbG9hZGVyLmxvYWQgPSBsb2FkRW50aXR5O1xyXG4gICAgICAgICAgICBsb2FkZXIuYWRkTG9hZGVkRXZlbnRMaXN0ZW5lciA9IGFkZEV2ZW50TGlzdGVuZXI7XHJcbiAgICAgICAgICAgIGxvYWRlci5yZW1vdmVMb2FkZWRFdmVudExpc3RlbmVyID0gcmVtb3ZlRXZlbnRMaXN0ZW5lcjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsb2FkZXI7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kSWR4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsb2FkZXIubG9hZGVkRXZlbnRzLmxlbmd0aDsgaWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVyLmxvYWRlZEV2ZW50c1tpZHhdID09PSBldmVudEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJZHggPSBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZm91bmRJZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRlci5sb2FkZWRFdmVudHMuc3BsaWNlKGZvdW5kSWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihldmVudEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbG9hZGVyLmxvYWRlZEV2ZW50cy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlci5sb2FkZWRFdmVudHNbaWR4XSA9PT0gZXZlbnRIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZm91bmQgJiYgaXNGdW5jdGlvbihldmVudEhhbmRsZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVyLmxvYWRlZEV2ZW50cy5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFbnRpdHkoZW50aXR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9PSBsb2FkZXIuY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRlci5jdXJyZW50ID0gZW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxvYWRlci5sb2FkZWRFdmVudHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXIubG9hZGVkRXZlbnRzW2lkeF0obG9hZGVyLmN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIHZhciBnZXRUeXBlID0ge307XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuc2VydmljZSgnTmF2aWdhdGlvblNlcnZpY2UnLCBuYXZpZ2F0aW9uU2VydmljZSk7XHJcblxyXG4gICAgbmF2aWdhdGlvblNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdmlnYXRpb25TZXJ2aWNlKCRyb290U2NvcGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgXHJcbiAgICAgICAgICAgIHBhcmFtczogZ2V0UGFyYW1zLFxyXG4gICAgICAgICAgICBnbzogZ29IYW5kbGVyLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRQYXJhbXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvSGFuZGxlcihzdGF0ZU5hbWUsIHRvUGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJHN0YXRlLmdvKHN0YXRlTmFtZSwgdG9QYXJhbXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBkZWZhdWx0S2V5ID0gXCIxMjM0NVwiO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ1Byb3Bvc2FsU2VydmljZScsIHByb3Bvc2FsU2VydmljZSk7XHJcblxyXG4gICAgcHJvcG9zYWxTZXJ2aWNlLiRpbmplY3QgPSBbJ1Jlc3RhdXJhbnRTZXJ2aWNlJywgJyRodHRwJywgJyRxJywgJ2xvZ2dlcicsICdiYXNlVXJsMicsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvcG9zYWxTZXJ2aWNlKHJlc3RTZXJ2aWNlLCAkaHR0cCwgJHEsIGxvZ2dlciwgYmFzZVVybDIsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgc2VydmljZUJhc2UgPSBiYXNlVXJsMjtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgICAgIGdldEJ5RGluZXI6IGdldEJ5RGluZXIsXHJcbiAgICAgICAgICAgIGdldEJ5S2V5OiBnZXRCeUtleSxcclxuICAgICAgICAgICAgZ2V0UHJvcG9zYWxVcmw6IGdldFByb3Bvc2FsVXJsLFxyXG5cclxuICAgICAgICAgICAgYWRkSXRlbTogYWRkSXRlbSxcclxuICAgICAgICAgICAgY2FzdFZvdGU6IGNhc3RWb3RlLFxyXG4gICAgICAgICAgICBjcmVhdGVQcm9wb3NhbDogY3JlYXRlUHJvcG9zYWwsXHJcbiAgICAgICAgICAgIGV4dGVuZFByb3Bvc2FsOiBleHRlbmRQcm9wb3NhbCxcclxuICAgICAgICAgICAgZXhwaXJlUHJvcG9zYWw6IGV4cGlyZVByb3Bvc2FsLFxyXG4gICAgICAgICAgICByZWFjdGl2YXRlOiByZWFjdGl2YXRlLFxyXG4gICAgICAgICAgICB1cGRhdGVOYW1lOiB1cGRhdGVOYW1lLFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZlVm90ZTogcmVtb3ZlVm90ZSxcclxuICAgICAgICAgICAgcmVtb3ZlQ2FydDogcmVtb3ZlQ2FydCxcclxuICAgICAgICAgICAgcmVtb3ZlSXRlbTogcmVtb3ZlSXRlbSxcclxuXHJcbiAgICAgICAgICAgIGhhc1ZvdGVkOiBoYXNWb3RlZCxcclxuICAgICAgICAgICAgY2FuVm90ZTogY2FuVm90ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgcHJvcG9zYWxzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFByb3Bvc2FsVXJsKHByb3Bvc2FsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLiRzdGF0ZS5ocmVmKCdwcm9wb3NhbC52aWV3JywgeyBrZXk6IHByb3Bvc2FsLktleSB9LCB7IGFic29sdXRlOiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlEaW5lcihkaW5lcklkKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvZGluZXIvXCIgKyBkaW5lcklkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLnByb3Bvc2FscyA9IHJlc3BvbnNlLmRhdGEuSXRlbXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRCeUtleShrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVhY3RpdmF0ZShjYXJ0SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQgKyBcIi9leHRlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVJdGVtKHByb3Bvc2FsLCBpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXJ0SWQgPSBwcm9wb3NhbC5JZDtcclxuICAgICAgICAgICAgdmFyIGl0ZW1JZCA9IGl0ZW0uSWQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHNlcnZpY2VCYXNlICsgXCJjcmF2aW5nY2FydC9cIiArIGNhcnRJZCArIFwiL2l0ZW0vXCIgKyBpdGVtSWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlQ2FydChjYXJ0SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FzdFZvdGUocHJvcG9zYWwsIGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIGNhcnRJZCA9IHByb3Bvc2FsLklkO1xyXG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gaXRlbS5JZDtcclxuXHJcbiAgICAgICAgICAgIC8vIEkgZG9uJ3QgbmVlZCB0byBwYXNzIGRpbmVySWQsIGJlY2F1c2UgdGhlIHNlcnZpY2Ugc2lkZSB3aWxsIGxvYWQgaXQgYXV0b21hdGljYWxseSBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQgKyBcIi92b3RlL1wiICsgaXRlbUlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVZvdGUocHJvcG9zYWwsIGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIGNhcnRJZCA9IHByb3Bvc2FsLklkO1xyXG4gICAgICAgICAgICB2YXIgaXRlbUlkID0gaXRlbS5JZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQgKyBcIi92b3RlL1wiICsgaXRlbUlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhc1ZvdGVkKGl0ZW0sIGRpbmVySWQpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uVm90ZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGl0ZW0uVm90ZXMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLlZvdGVzW2lkeF0uRGluZXJJZCA9PT0gZGluZXJJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuVm90ZShwcm9wb3NhbCwgZGluZXJJZCkge1xyXG4gICAgICAgICAgICAvLyB0aGlzIG1ldGhvZCByZXR1cm5zIGZhbHNlIGFzIGxvbmcgYXMgdGhpcyBkaW5lcklkIGhhcyB2b3RlZCB0byBhbnksIGhvd2V2ZXIsIHRoZSBzZXJ2ZXIgc2lkZSBoYXMgYSB2YWx1ZSB0aGF0IGlzIGNvbmZpZ3VyZWFibGUgcGVyIHByb3Bvc2FsXHJcbiAgICAgICAgICAgIC8vIGN1cnJlbnRseSB3ZSBhcmUgbm90IHVzaW5nIHRoYXQgdmFsdWUsIGJ1dCB3ZSBtaWdodCB0aGluayBhYm91dCBpdCBsYXRlciBcclxuICAgICAgICAgICAgdmFyIGN1cnIgPSBwcm9wb3NhbDtcclxuICAgICAgICAgICAgaWYgKGN1cnIgJiYgY3Vyci5JdGVtcykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY3Vyci5JdGVtcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZvdGVzID0gY3Vyci5JdGVtc1tpZHhdLlZvdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2b3Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZvdGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodm90ZXNbal0uRGluZXJJZCA9PT0gZGluZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHRlbmRQcm9wb3NhbChjYXJ0SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQgKyBcIi9leHRlbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBleHBpcmVQcm9wb3NhbChjYXJ0SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnQvXCIgKyBjYXJ0SWQgKyBcIi9leHBpcmVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVOYW1lKGNhcnRJZCwgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHNlcnZpY2VCYXNlICsgXCJjcmF2aW5nY2FydC9cIiArIGNhcnRJZCArIFwiL25hbWVcIiwgJ1wiJyArIG5hbWUgKyAnXCInKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgc2VydmljZS5wcm9wb3NhbHMubGVuZ3RoOyBpZHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2aWNlLnByb3Bvc2Fsc1tpZHhdLklkID09IGNhcnRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLnByb3Bvc2Fsc1tpZHhdLk5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVQcm9wb3NhbChwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArIFwiY3JhdmluZ2NhcnRcIiwgcHJvcG9zYWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcyBzZXJ2aWNlIG1ldGhvZCBpcyBub3QgcmVzcG9uc2libGUgZm9yIHdoYXQgdG8gZG8gaWYgdGhlcmUgaXMgbm8gcHJvcG9zYWwgb3IgaWYgdGhlIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWQgXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSXRlbShkaXNoLCBwcm9wb3NhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHNlcnZpY2VCYXNlICsgXCJjcmF2aW5nY2FydC9cIiArIHByb3Bvc2FsLklkICsgXCIvaXRlbS9cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJSZXN0YXVyYW50SWRcIjogZGlzaC5SZXN0YXVyYW50SWQsXHJcbiAgICAgICAgICAgICAgICBcIkRpc2hJZFwiOiBkaXNoLkRpc2hJZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuc2VydmljZSgnUmVjZW50RGlzaFNlcnZpY2UnLCByZWNlbnREaXNoU2VydmljZSk7XHJcblxyXG4gICAgcmVjZW50RGlzaFNlcnZpY2UuJGluamVjdCA9IFsnbG9jYWxTdG9yYWdlU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlY2VudERpc2hTZXJ2aWNlKGxvY2FsU3RvcmFnZVNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgLy8gZXZlbnRzXHJcbiAgICAgICAgICAgIGxvYWRSZWNlbnQ6IGxvYWRSZWNlbnQsXHJcbiAgICAgICAgICAgIGFkZFRvUmVjZW50OiBhZGRUb1JlY2VudCxcclxuICAgICAgICAgICAgb25SZWZyZXNoOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGZsdXNoIDogZmx1c2gsXHJcbiAgICAgICAgICAgIGRpc2hlczogW11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc3RvcmFnZUtleSA9IFwicmVjZW50RGlzaERhdGFcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRSZWNlbnQoKSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2UuZGlzaGVzID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoc3RvcmFnZUtleSk7XHJcbiAgICAgICAgICAgIGlmICghc2VydmljZS5kaXNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuZGlzaGVzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlLmRpc2hlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvUmVjZW50KGRpc2gpIHtcclxuICAgICAgICAgICAgc2VydmljZS5kaXNoZXMgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChzdG9yYWdlS2V5KTtcclxuICAgICAgICAgICAgaWYgKCFzZXJ2aWNlLmRpc2hlcykge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5kaXNoZXMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGZvdW5kSWR4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzZXJ2aWNlLmRpc2hlcy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VydmljZS5kaXNoZXNbaWR4XS5EaXNoSWQgPT09IGRpc2guRGlzaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRJZHggPSBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmb3VuZElkeCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmRpc2hlcy5zcGxpY2UoZm91bmRJZHgsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlcnZpY2UuZGlzaGVzLmxlbmd0aCA+PSA5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZS5kaXNoZXMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlcnZpY2UuZGlzaGVzLnVuc2hpZnQoZGlzaCk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KHN0b3JhZ2VLZXksIHNlcnZpY2UuZGlzaGVzKTtcclxuICAgICAgICAgICAgaWYgKHNlcnZpY2Uub25SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLm9uUmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmbHVzaCgpIHtcclxuICAgICAgICAgICAgc2VydmljZS5kaXNoZXMgPSBbXTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoc3RvcmFnZUtleSwgc2VydmljZS5kaXNoZXMpO1xyXG4gICAgICAgICAgICBpZiAoc2VydmljZS5vblJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2Uub25SZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuICAgIGFwcFxyXG4gICAgICAgIC5zZXJ2aWNlKCdSZWZlcmVuY2VEYXRhU2VydmljZScsIHJlZmVyZW5jZURhdGFTZXJ2aWNlKTtcclxuXHJcbiAgICByZWZlcmVuY2VEYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICdiYXNlVXJsJywgJ2xvZ2dlcicsICckcSddO1xyXG5cclxuICAgIC8vIGluZGVlZCwgd2UgY2FuIHVzZSBBbmd1bGFyIGJ1aWx0LWluIG9wdGlvbiBjYWNoZTogdHJ1ZSB0byBjYWNoZSBhIGdldCBvcCBmb3Igc29tZSBvZiB0aGVzZSBkYXRhLCBidXQgdGhlcmUgaXMgbm8gYSBzdHJhbmdlZm9yd2FyZCB3YXkgdG8gZmx1c2guXHJcbiAgICAvLyB0byBkbyB0aGF0LCBJIHdpbGwgaGF2ZSB0byB3cml0ZSBhIGNhY2hlRmFjdG9yeSBmaXJzdFxyXG4gICAgZnVuY3Rpb24gcmVmZXJlbmNlRGF0YVNlcnZpY2UoJGh0dHAsIGJhc2VVcmwsIGxvZ2dlciwgJHEpIHtcclxuICAgICAgICB2YXIgY2FjaGVzID0gW107XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIGdldERhdGE6IGdldERhdGEsXHJcbiAgICAgICAgICAgIGdldEtleXM6IGdldEtleXMsXHJcbiAgICAgICAgICAgIGZsdXNoOiBmbHVzaCAvLyBpdCBzaG91bGQgYmUgY2FsbGVkIGlmIHdlIHdhbnQgdG8gcmVtb3ZlIGEgc3BlY2lmaWVkIHJlZiBkYXRhIGZyb20gY2FjaGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YShyZWZUYWJsZU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlc1tyZWZUYWJsZU5hbWVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoY2FjaGVzW3JlZlRhYmxlTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFVcmwgPSBiYXNlVXJsICsgcmVmVGFibGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogZGF0YVVybFxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZXNbcmVmVGFibGVOYW1lXSA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEtleXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjYWNoZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmx1c2gocmVmVGFibGVOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWZUYWJsZU5hbWUgaW4gY2FjaGVzKVxyXG4gICAgICAgICAgICAgICAgY2FjaGVzLnJlbW92ZShyZWZUYWJsZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuc2VydmljZSgnUmVzdGF1cmFudFNlcnZpY2UnLCByZXN0YXVyYW50U2VydmljZSk7XHJcblxyXG4gICAgcmVzdGF1cmFudFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnLCAnbG9nZ2VyJywgJ2Jhc2VVcmwyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzdGF1cmFudFNlcnZpY2UoJGh0dHAsICRxLCBsb2dnZXIsIGJhc2VVcmwyKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2VCYXNlID0gYmFzZVVybDI7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcblxyXG4gICAgICAgICAgICAvLyBldmVudHNcclxuICAgICAgICAgICAgZmluZDogZmluZFJlc3RhdXJhbnQsXHJcbiAgICAgICAgICAgIGZpbmRFeGFjdDogZmluZFJlc3RhdXJhbnRFeGFjdCxcclxuICAgICAgICAgICAgbWF0Y2hEaXNoOiBtYXRjaERpc2gsXHJcbiAgICAgICAgICAgIGFkZERpc2g6IGFkZERpc2gsXHJcbiAgICAgICAgICAgIGdldERpc2hlczogZ2V0RGlzaGVzLFxyXG4gICAgICAgICAgICBnZXRDcmF2aW5nczogZ2V0Q3JhdmluZ3MsXHJcbiAgICAgICAgICAgIGdldERpc2hCeU5hbWU6IGdldERpc2hCeU5hbWUsXHJcbiAgICAgICAgICAgIGdldFJhbmRvbVJlc3RhdXJhbnQ6IGdldFJhbmRvbVJlc3RhdXJhbnQsXHJcbiAgICAgICAgICAgIGdldENpdHlTdW1tYXJpZXM6IGdldENpdHlTdW1tYXJpZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWF0Y2hEaXNoKG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwiZGlzaGVzL21hdGNoL1wiICsgbmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kUmVzdGF1cmFudEV4YWN0KHVzZXJMb2NhdGlvbiwgcmVzdGF1cmFudE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJsb2NhdGlvblwiOiB1c2VyTG9jYXRpb24uY29vcmRzLmxhdGl0dWRlICsgXCIsXCIgKyB1c2VyTG9jYXRpb24uY29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiByZXN0YXVyYW50TmFtZSxcclxuICAgICAgICAgICAgICAgIFwiY2l0eVwiOiB1c2VyTG9jYXRpb24uY2l0eSxcclxuICAgICAgICAgICAgICAgIFwicmVnaW9uXCI6IHVzZXJMb2NhdGlvbi5yZWdpb24sXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjogdXNlckxvY2F0aW9uLmNvdW50cnlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvZmluZGV4YWN0XCIsIHsgcGFyYW1zOiBpbnB1dCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRSZXN0YXVyYW50KHVzZXJMb2NhdGlvbiwgcmVzdGF1cmFudE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJsb2NhdGlvblwiOiB1c2VyTG9jYXRpb24uY29vcmRzLmxhdGl0dWRlICsgXCIsXCIgKyB1c2VyTG9jYXRpb24uY29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiByZXN0YXVyYW50TmFtZSxcclxuICAgICAgICAgICAgICAgIFwiY2l0eVwiOiB1c2VyTG9jYXRpb24uY2l0eSxcclxuICAgICAgICAgICAgICAgIFwicmVnaW9uXCI6IHVzZXJMb2NhdGlvbi5yZWdpb24sXHJcbiAgICAgICAgICAgICAgICBcImNvdW50cnlcIjogdXNlckxvY2F0aW9uLmNvdW50cnlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvZmluZFwiLCB7IHBhcmFtczogaW5wdXQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRDcmF2aW5ncyhyZXN0YXVyYW50SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvXCIgKyByZXN0YXVyYW50SWQgKyBcIi9jcmF2aW5nc1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERpc2hlcyhyZXN0YXVyYW50SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvXCIgKyByZXN0YXVyYW50SWQgKyBcIi9kaXNoZXNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREaXNoQnlOYW1lKHJlc3RhdXJhbnROYW1lLCBkaXNoTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdE5hbWUgPSB3aW5kb3cuaGVscGVyLnJlcGxhY2VBbGwocmVzdGF1cmFudE5hbWUsIFwiJlwiLCBcIl9cIik7XHJcbiAgICAgICAgICAgIHZhciBkTmFtZSA9IHdpbmRvdy5oZWxwZXIucmVwbGFjZUFsbChkaXNoTmFtZSwgXCImXCIsIFwiX1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvXCIgKyBlc2NhcGUocmVzdE5hbWUpICsgXCIvZGlzaC9cIiArIGVzY2FwZShkTmFtZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tUmVzdGF1cmFudCh1c2VyTG9jYXRpb24sIHRvdGFsKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHtcclxuICAgICAgICAgICAgICAgIFwibG9jYXRpb25cIjogdXNlckxvY2F0aW9uLmNvb3Jkcy5sYXRpdHVkZSArIFwiLFwiICsgdXNlckxvY2F0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICBcImNpdHlcIjogdXNlckxvY2F0aW9uLmNpdHksXHJcbiAgICAgICAgICAgICAgICBcInJlZ2lvblwiOiB1c2VyTG9jYXRpb24ucmVnaW9uLFxyXG4gICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6IHVzZXJMb2NhdGlvbi5jb3VudHJ5LFxyXG4gICAgICAgICAgICAgICAgXCJ0b3RhbFwiOiB0b3RhbFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXJ2aWNlQmFzZSArIFwicmVzdGF1cmFudHMvcmFuZG9tXCIsIHsgcGFyYW1zOiBpbnB1dCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoZSBpbnB1dCBjb21lcyBmcm9tIGRpc2guYWRkLmpzIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZERpc2goZGlzaCwgZGluZXJQcm9maWxlLCB1c2VyTG9jYXRpb24pIHtcclxuICAgICAgICAgICAgLy8gdGhpcyBkYXRhIG5lZWRzIHRvIG1hdGNoIEFkZERpc2hSZXFWMiBmb3JtYXQgXHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgXCJSZXN0YXVyYW50TmFtZVwiOiBkaXNoLnJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIFwiQ2l0eVwiOiBkaXNoLnJlc3RhdXJhbnQuY2l0eSB8fCB1c2VyTG9jYXRpb24uY2l0eSxcclxuICAgICAgICAgICAgICAgIFwiUmVnaW9uXCI6IGRpc2gucmVzdGF1cmFudC5yZWdpb24gfHwgdXNlckxvY2F0aW9uLnJlZ2lvbixcclxuICAgICAgICAgICAgICAgIFwiQ291bnRyeVwiOiBkaXNoLnJlc3RhdXJhbnQuY291bnRyeSB8fCB1c2VyTG9jYXRpb24uY291bnRyeSxcclxuICAgICAgICAgICAgICAgIFwiQWRkcmVzc1wiOiBkaXNoLnJlc3RhdXJhbnQuYWRkcmVzcyxcclxuICAgICAgICAgICAgICAgIFwiR2VvXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkxhdGl0dWRlXCI6IGRpc2gucmVzdGF1cmFudC5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBcIkxvbmdpdHVkZVwiOiBkaXNoLnJlc3RhdXJhbnQubG9uZ2l0dWRlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJQbGFjZUlkXCI6IGRpc2gucmVzdGF1cmFudC5wbGFjZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJQb3N0YWxDb2RlXCI6IGRpc2gucmVzdGF1cmFudC5wb3N0YWxDb2RlLFxyXG4gICAgICAgICAgICAgICAgXCJQaG9uZU51bWJlclwiOiBkaXNoLnJlc3RhdXJhbnQucGhvbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICBcIk5hbWVcIjogZGlzaC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBkaXNoLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgXCJSYXRpbmdcIjogZGlzaC5yYXRpbmcsXHJcbiAgICAgICAgICAgICAgICBcIlJldmlld1wiOiBkaXNoLnJldmlldyxcclxuICAgICAgICAgICAgICAgIFwiSW1hZ2VGaWxlTmFtZVwiOiBkaXNoLmltYWdlRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBcIkRpbmVySWRcIjogZGluZXJQcm9maWxlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJTZWxlY3RlZENyYXZpbmdzXCI6IGRpc2guc2VsZWN0ZWRDcmF2aW5ncy5sZW5ndGggPiAwID8gZGlzaC5zZWxlY3RlZENyYXZpbmdzLm1hcChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5DcmF2aW5nSWQ7IH0pIDogW11cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ2Rpc2hlcy9hZGQnLCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldENpdHlTdW1tYXJpZXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyAncmVzdGF1cmFudHMvY2l0eXN1bW1hcnknKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdSZXN1bWVTZXJ2aWNlJywgcmVzdW1lU2VydmljZSk7XHJcblxyXG4gICAgcmVzdW1lU2VydmljZS4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsJ05hdmlnYXRpb25TZXJ2aWNlJywnJHEnLCAnJHRpbWVvdXQnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIC8vIHRoaXMgaXMgYSBzaW1wbGUgc3RhY2sgdGhhdCB1c2VkIGZvciByZXN1bWUgYSB0YXNrLiBcclxuICAgIC8vIHRoZSBpZGVhIGlzOiBpZiBhIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWQsIHRoZSBjYWxsZXIgY29udHJvbGxlciBwdXNoIGEgZnVuY3Rpb24gdG8gdGhpcyBzZXJ2aWNlLCBhbmQgdGhlbiByZWRpcmVjdCB0byB0aGUgbG9naW4gcGFnZVxyXG4gICAgLy8gdGhlIGxvZ2luIHBhZ2Ugd2lsbCBhdXRoZW50aWNhdGUgdGhlIHVzZXIgYW5kIHRoZSBwb3AgdGhlIGZ1bmNpdG9uIG91dCB0byByZXN1bWUuIHRoZSBzYW1lIGxvZ2ljIGNhbiBiZSBhcHBsaWVkIHRvIGEgbW9kYWwgd2luZG93LlxyXG4gICAgLy8gbm90IHN1cmUgaWYgdGhpcyBpcyB0aGUgYmVzdCBwcmF0aWNlIGJ1dCBpdCBzaG91bGQgd29yayBpbiBtb3N0IHNjZW5hcmlvcy4gXHJcbiAgICBmdW5jdGlvbiByZXN1bWVTZXJ2aWNlKGF1dGhTZXJ2aWNlLCBuYXZpZ2F0aW9uU2VydmljZSwkcSwgJHRpbWVvdXQsICRyb290U2NvcGUpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIG9uU3RhdGVDaGFuZ2VkU3VjY2Vzcyk7XHJcbiAgICAgICAgdmFyIG9sZFN0YXRlLCBvbGRQYXJhbXM7XHJcbiAgICAgICAgdmFyIHRhc2tzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIHJlc3VtZTogcmVzdW1lVGFzayxcclxuICAgICAgICAgICAgcHVzaDogYWRkUmVzdW1lLFxyXG4gICAgICAgICAgICBuZWVkUmVzdW1lOiBoYXNUYXNrLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlwiLFxyXG4gICAgICAgICAgICBoYXNNZXNzYWdlOiBmYWxzZSxcclxuICAgICAgICAgICAgY3JlYXRlUmVzdW1lOiBjcmVhdGVSZXN1bWUsXHJcbiAgICAgICAgICAgIGZsdXNoOiBmbHVzaFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYXNUYXNrKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFza3MubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gZW5zdXJlIG5vIGdob3N0IHRhc2sgcmVtYWluaW5nIFxyXG4gICAgICAgIC8vIHdlIHNob3VsZCBwYXkgYXR0ZW50aW9uLCBpZiBhIHVzZXIgd2FudHMgdG8gZG8gc29tZXRoaW5nIGJ1dCByZWFsaXplIGF1dGhlbnRpY2F0aW9uIGlzIHJlcXVpcmVkLCB0aGVuIGhlIGRvZXNuJ3Qgd2FudCB0byBkbyBpdCAobG9naW4pLiBcclxuICAgICAgICAvLyB0aGUgdGFzayB3aWxsIHN0YXkgd2l0aG91dCBiZWluZyBleGVjdXRlZC4gbmV4dCB0aGlzIHVzZXIgZG9lcyBhIHNldCBvZiB0aGluZ3MsIGZpbmFsbHkgZGVjaWRlcyB0byBsb2cgaW4sIHdlIGRvbid0IHdhbnQgdG8gZXhlY3V0ZVxyXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgdG9nZXRoZXIsIGl0IHdpbGwgYmUgdmVyeSBjb25mdXNpbmcgYW5kIG1heSBldmVuIGJlIGluY29ycmVjdDsgc28gaXQncyB0aGUgY2FsbGVyJ3MgcmVzcG9uc2liaWxpdHkgdG8gY2FsbCB0aGlzIG1ldGhvZCBiZWZvcmUgYSBuZXcgdGFza1xyXG4gICAgICAgIGZ1bmN0aW9uIGZsdXNoKCkge1xyXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGFza3Muc3BsaWNlKDAsIHRhc2tzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJlc3VtZShyZXN1bWVDYWxsLCBtc2cpIHtcclxuICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLmlzQXV0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdW1lQ2FsbCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5wdXNoKHJlc3VtZUNhbGwsIG1zZyk7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnbG9naW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzdW1lVGFzaygpIHtcclxuICAgICAgICAgICAgc2VydmljZS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgc2VydmljZS5oYXNNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBsYXRlc3QgPSB0YXNrcy5wb3AoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBsYXRlc3QoKTtcclxuICAgICAgICAgICAgaWYgKHByb21pc2UgJiYgcHJvbWlzZS50aGVuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1bk5leHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcnVuTmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB3ZSB3YW50IHRvIGRlbGF5IHRoaXMgc28gdGhlIHJlc3VtZSB0YXNrIGNhbiBoYXZlIGEgYml0IHRpbWUgdG8gY29tcGxldGUsIHVubGVzcyB3ZSBjcmVhdGUgYSBwcm9taXNlIGZyb20gbGF0ZXN0IFxyXG4gICAgICAgICAgICAvL3ZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vICAgIGlmIChvbGRTdGF0ZSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgbmF2aWdhdGlvblNlcnZpY2UuZ28ob2xkU3RhdGUsIG9sZFBhcmFtcywgeyByZWxvYWQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIC8vICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbygnaG9tZScpO1xyXG4gICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgIC8vfSwgODAwKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRSZXN1bWUodGFzaywgbXNnKSB7XHJcbiAgICAgICAgICAgIHRhc2tzLnB1c2godGFzayk7XHJcbiAgICAgICAgICAgIHNlcnZpY2UubWVzc2FnZSA9IG1zZztcclxuICAgICAgICAgICAgc2VydmljZS5oYXNNZXNzYWdlID0gbXNnIT11bmRlZmluZWQgJiYgbXNnICE9PSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25TdGF0ZUNoYW5nZWRTdWNjZXNzKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgIG9sZFN0YXRlID0gZnJvbVN0YXRlO1xyXG4gICAgICAgICAgICBvbGRQYXJhbXMgPSBmcm9tUGFyYW1zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcnVuTmV4dCgpIHtcclxuICAgICAgICAgICAgaWYgKGhhc1Rhc2soKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdW1lVGFzaygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVUYXNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNvbXBsZXRlVGFzaygpIHtcclxuICAgICAgICAgICAgaWYgKG9sZFN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uU2VydmljZS5nbyhvbGRTdGF0ZSwgb2xkUGFyYW1zLCB7IHJlbG9hZDogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRpb25TZXJ2aWNlLmdvKCdob21lJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyBhbmd1bGFyLm1vZHVsZSgnb2Muc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSlcclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcblxyXG4gICAgYXBwXHJcbiAgICAgICAgLmNvbmZpZyhbXHJcbiAgICAgICAgICAgICckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgICAgICAgICAgLy8kaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlLCBBY2NlcHQsIFgtUmVxdWVzdGVkLVdpdGgnXHJcbiAgICAgICAgICAgICAgICAvL307XHJcblxyXG4gICAgICAgICAgICAgICAgLy8kaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucHV0ID0ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEFjY2VwdCwgWC1SZXF1ZXN0ZWQtV2l0aCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICAvL307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdhY2Nlc3MnLCBhY2Nlc3MpO1xyXG5cclxuICAgIGFjY2Vzcy4kaW5qZWN0ID0gWydBdXRoU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjY2VzcyhhdXRoU2VydmljZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciByb2xlcyA9IGF0dHJzLmFjY2Vzcy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLnRyaW0oKTsgfSk7XHJcbiAgICAgICAgICAgIHZhciByZXZlcnNlID0gYXR0cnMucmV2ZXJzZSB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaG93RWxlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgaGlkZUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGRldGVybWluZUFjY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhc0FjY2VzcyA9IGF1dGhTZXJ2aWNlLmF1dGhvcml6ZShyb2xlcywgYXR0cnMucm9sZUNoZWNrVHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhhc0FjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAocm9sZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lQWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdjcmF2aW5nU2VsZWN0JywgY3JhdmluZ1NlbGVjdCk7XHJcblxyXG4gICAgY3JhdmluZ1NlbGVjdC4kaW5qZWN0ID0gWydSZWZlcmVuY2VEYXRhU2VydmljZScsICckdGltZW91dCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyYXZpbmdTZWxlY3QocmVmU2VydmljZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICAvLyBVc2FnZTpcclxuICAgICAgICAvLyAgICAgPGNyYXZpbmdTZWxlY3Q+PC9jcmF2aW5nU2VsZWN0PlxyXG4gICAgICAgIC8vIENyZWF0ZXM6XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd3aWRnZXRzL2NyYXZpbmdTZWxlY3QudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDcmF2aW5nOiBcIj1cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jcmF2aW5ncyA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9jYWwgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHJlZlNlcnZpY2UuZ2V0RGF0YShcImNyYXZpbmd0eXBlXCIpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JhdmluZ3MgPSByZXNwb25zZS5JdGVtcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuTmFtZSA+IGIuTmFtZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0TG9jYWxTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGEgaGFjaywgYmVjYXVzZSB0aGlzIGRpcmVjdGl2ZSBpcyBsb2FkZWQgYmVmb3JlIHRoZSBwYWdlIGlzIGxvYWRlZFxyXG4gICAgICAgICAgICAvLyB0aGUgc2VsZWN0ZWQgaXMgb25seSBsb2FkZWQgYWZ0ZXIgdGhlIHBhZ2UgaXMgbG9hZGVkLCBzbyB0aGUgZGlyZWN0aXZlIGNhbid0IGRpc3BsYXkgdGhlIHNlbGVjdGVkIGl0ZW1zIFxyXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKFwic2VsZWN0ZWRDcmF2aW5nXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuc2VsZWN0ZWRDcmF2aW5nLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lcjEgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcjEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9jYWwuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgkc2NvcGUuc2VsZWN0ZWRDcmF2aW5nLmxlbmd0aCA+IDAgJiYgJHNjb3BlLmxvY2FsLnNlbGVjdGVkID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVyMiA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldExvY2FsU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gSSBob25lc3RseSBkb24ndCBrbm93IHdoeSBJIGhhdmUgdG8gZG8gdGhpcywgSSB3YXMgZXhwZWN0aW5nIFwiPVwiIGlzIGEgMi13YXkgYmluZGluZyBhbmQgYXMgbG9uZyBhcyBJIHVzZSBuZy1tb2RlbCAodHJpZWQpLFxyXG4gICAgICAgICAgICAvLyBpdCBzaG91bGQgYXV0b21hdGljYWxseSB1cGRhdGUgdGhlIGNyZWF0b3IuIGJ1dCBJIHNwZW50IGEgZmV3IGhvdXJzIGFuZCBjb3VsZG4ndCBnZXQgaXQgd29yay4gXHJcbiAgICAgICAgICAgIC8vIHNvIEkgaGF2ZSB0byBtYW51YWxseSB1cGRhdGUgdGhpcyB2YXJpYWJsZVxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Q3JhdmluZyA9IGZ1bmN0aW9uIChpdGVtLCBtb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpZHggPSBmaW5kSXRlbShpdGVtLklkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQ3JhdmluZy5wdXNoKHsgQ3JhdmluZ0lkOiBpdGVtLklkIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUNyYXZpbmcgPSBmdW5jdGlvbiAoaXRlbSwgbW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpZHggPSBmaW5kSXRlbShpdGVtLklkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZENyYXZpbmcuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kSXRlbShpZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgJHNjb3BlLnNlbGVjdGVkQ3JhdmluZy5sZW5ndGg7IGlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5zZWxlY3RlZENyYXZpbmdbaWR4XS5DcmF2aW5nSWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRMb2NhbFNlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNhbiB3ZSBkbyBiZXR0ZXIgaW4gaGVyZT9cclxuICAgICAgICAgICAgICAgICRzY29wZS5sb2NhbC5zZWxlY3RlZCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5zZWxlY3RlZENyYXZpbmcubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnNlbGVjdGVkQ3JhdmluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8ICRzY29wZS5jcmF2aW5ncy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5zZWxlY3RlZENyYXZpbmdbaV0uQ3JhdmluZ0lkID09PSAkc2NvcGUuY3JhdmluZ3Nbal0uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9jYWwuc2VsZWN0ZWQucHVzaCgkc2NvcGUuY3JhdmluZ3Nbal0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBlbmQgbGlua1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ25nQ29uZmlybUNsaWNrJywgbmdDb25maXJtQ2xpY2spO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5nQ29uZmlybUNsaWNrKCkge1xyXG4gICAgICAgIC8vIFVzYWdlOlxyXG4gICAgICAgIC8vICAgICA8YnV0dG9uIG5uZy1jb25maXJtLWNsaWNrPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO2dldEV4dGVybmFsU2NvcGVzKCkuZGVsZXRlKHJvdyk7XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgLy8gQ3JlYXRlczpcclxuICAgICAgICAvLyAgcG9wcyB1cCBhIGNvbmZpcm1hdGlvbiBkaWFsb2cgd2hlbiBjbGlja2luZyB0aGUgYnV0dG9uIFxyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBhdHRyLmNvbmZpcm1Nc2cgfHwgXCJBcmUgeW91IHN1cmU/XCI7XHJcbiAgICAgICAgICAgIHZhciBjbGlja0FjdGlvbiA9IGF0dHIubmdDb25maXJtQ2xpY2s7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShtc2cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGV2YWwoY2xpY2tBY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnb25MYXN0UmVwZWF0Jywgb25MYXN0UmVwZWF0KTtcclxuXHJcbiAgICBvbkxhc3RSZXBlYXQuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uTGFzdFJlcGVhdChyZWZTZXJ2aWNlKSB7XHJcbiAgICAgICAgLy8gVXNhZ2U6XHJcbiAgICAgICAgLy8gICAgIDxhbnkgbmctcmVwZWF0PVwiXCIgb24tbGFzdC1yZXBlYXQ+IFxyXG4gICAgICAgIC8vICAgICAgaW4gY29udHJvbGxlcjogJHNjb3BlLiRvbignb25SZXBlYXRMYXN0JywgZnVuY3Rpb24oc2NvcGUsIGVsZW0sZW50LCBhdHRycykge30pO1xyXG4gICAgICAgIC8vIENyZWF0ZXM6XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLiRsYXN0KVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoJ29uUmVwZWF0TGFzdCcsIGVsZW1lbnQsIGF0dHJzKTtcclxuICAgICAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpOyJdfQ==
