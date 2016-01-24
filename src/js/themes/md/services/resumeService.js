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