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
