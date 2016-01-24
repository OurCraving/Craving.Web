﻿(function () {
    'use strict';

    angular
        .module('app')
        .directive('sticky', sticky);

    // Shiv: matchMedia
    //
    window.matchMedia || (window.matchMedia = function () {
        window.console && console.warn && console.warn('angular-sticky: This browser does not support matchMedia, ' +
			'therefore the minWidth option will not work on this browser. ' +
			'Polyfill matchMedia to fix this issue.');
        return function () {
            return {
                matches: true
            };
        };
    }());

    sticky.$inject = [];

    // this directive doesn't work in angular material!!! the logic here is good, but MD framework has a lot of things conflicting this logic here
    function sticky() {
        var linkFn = function (scope, elem, attrs) {
            var mediaQuery = scope.mediaQuery || null,
                stickyClass = scope.stickyClass || '',
                bodyClass = scope.bodyClass || '',

                $elem = elem,
                elem = $elem[0],
                $window = angular.element(window),
                $body = angular.element(document.body),
                doc = document.documentElement,
                parentId = scope.stickToId,
                $parent,
				initial = {
				    top: $elem.css('top'),
				    width: $elem.css('width'),
				    position: $elem.css('position'),
				    marginTop: $elem.css('margin-top'),
				},

				isPositionFixed = false,
				isSticking = false,
				stickyLine;


            if (parentId) {
                $parent = document.getElementById(parentId);
                if (!$parent)
                    $parent = $window;
                else {
                    doc = $parent;
                    $parent = angular.element($parent);
                }
            } else {
                $parent = $window;
            }

            var offset = typeof scope.offset === 'string'
				? parseInt(scope.offset.replace(/px;?/, ''))
				: 0;

            // Watchers
            //
            var prevOffset = _getTopOffset(elem);

            scope.$watch(function () {
                if (isSticking) return prevOffset;

                prevOffset = _getTopOffset(elem);
                return prevOffset;

            }, function (newVal, oldVal) {
                if (newVal !== oldVal || typeof stickyLine === 'undefined') {
                    stickyLine = newVal - offset;
                    checkIfShouldStick();
                }
            });

            // checks if the window has passed the sticky line
            function checkIfShouldStick() {
                if (mediaQuery && !matchMedia('(' + mediaQuery + ')').matches) return;

                var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                var shouldStick = scrollTop >= stickyLine;

                // Switch the sticky modes if the element has crossed the sticky line
                if (shouldStick && !isSticking)
                    stickElement();

                else if (!shouldStick && isSticking)
                    unstickElement();
            }

            function stickElement() {
                initial.offsetWidth = elem.offsetWidth;
                isSticking = true;
                bodyClass && $body.addClass(bodyClass);
                stickyClass && $elem.addClass(stickyClass);

                $elem
					.css('width', elem.offsetWidth + 'px')
					.css('position', 'fixed')
					.css('top', offset + 'px')
					.css('margin-top', 0);

            };

            function unstickElement() {
                isSticking = false;
                bodyClass && $body.removeClass(bodyClass);
                stickyClass && $elem.removeClass(stickyClass);

                $elem
					.css('width', initial.offsetWidth + 'px')
					.css('top', initial.top)
					.css('position', initial.position)
					.css('margin-top', initial.marginTop);
            };

            function _getTopOffset(element) {
                var pixels = 0;

                if (element.offsetParent) {
                    do {
                        pixels += element.offsetTop;
                        element = element.offsetParent;
                    } while (element);
                }

                return pixels;
            }


            // Listeners
            //

            $parent.on('scroll', checkIfShouldStick);
            $window.on('resize', scope.$apply.bind(scope, onResize));
            scope.$on('$destroy', onDestroy);

            function onResize() {
                initial.offsetWidth = elem.offsetWidth;
            };

            function onDestroy() {
                $window.off('scroll', checkIfShouldStick);
                $window.off('resize', onResize);
            };
        };


        // Directive definition
        //
        return {
            scope: {
                stickToId: '@', // the id of the parent element
                offset: '@',      // top offset
                mediaQuery: '@',  // minimum width required for sticky to come in
                stickyClass: '@', // class to be applied to the element on sticky
                bodyClass: '@'    // class to be applied to the body on sticky
            },
            restrict: 'A',        // sticky can only be used as an ('A') attribute.
            link: linkFn
        };
    }

})();