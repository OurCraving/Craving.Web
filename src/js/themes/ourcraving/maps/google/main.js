function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
        'callback=initGoogleMaps' +
        '&key=AIzaSyCGyphXwy9W9zlMGVGsEgy5_iwr7qLFTMc'; // TODO: this is the Api key from my persona gmail account 

    document.body.appendChild(script);
}

window.onload = loadScript;

function initScripts() {
    var $scripts = [
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.extensions.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.services.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.microdata.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.microformat.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.overlays.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.rdfa.js",
        "js/vendor/maps/google/jquery-ui-map/addons/infobox.js",
        "js/vendor/maps/google/jquery-ui-map/addons/markerclusterer.min.js"
    ];

    $.each($scripts, function (k, v) {
        if ($('[src="' + v + '"]').length) return true;
        var scriptNode = document.createElement('script');

        scriptNode.src = v;
        $('head').prepend($(scriptNode));
        return true;
    });
}

var library = require('./_library.js')();

// Holds google maps styles
var styles = {
    "light-grey": require('./styles/_light-grey.js'),
    "light-monochrome": require('./styles/_light-monochrome.js'),
    "cool-grey": require('./styles/_cool-grey.js'),
    "blue-gray": require('./styles/_blue-gray.js'),
    "paper": require('./styles/_paper.js'),
    "apple": require('./styles/_apple.js'),
    "light-green": require('./styles/_light-green.js'),
    "lemon-tree": require('./styles/_lemon-tree.js'),
    "clean-cut": require('./styles/_clean-cut.js'),
    "nature": require('./styles/_nature.js')
};

var iconBase = 'images/markers/';

// Process the infoWindow content via Handlebars templates
var infoWindowContent = function (marker) {
    var source = $("#" + marker.template).html();
    var template = Handlebars.compile(source);
    return template(marker);
};

/**
 * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
 */
$.fn.tkGoogleMap = function () {

    if (!this.length) return;

    var container = this;

    if (typeof google == 'undefined' || typeof InfoBox == 'undefined') {
        setTimeout(function () {
            container.tkGoogleMap();
        }, 200);

        return;
    }

    var options = {
        mapZoomPosition: container.data('zoomPosition') || "TOP_LEFT",
        mapZoomStyle: container.data('zoomStyle') || "DEFAULT",
        mapZoom: container.data('zoom') || 16,
        mapStyle: container.data('style') || "light-grey",
        mapType: container.data('type') || "ROADMAP",
        file: container.data('file'),
        center: container.data('center') ? container.data('center').split(",") : false,
        pagination: container.data('pagination') || false,
        paginationPosition: container.data('paginationPosition') || 'TOP_LEFT',
        draggable: container.data('draggable') !== false,
        scrollwheel: container.data('scrollwheel') || false
    };

    var mapData;

    // provide a default object for data collected from the currently opened infoWindow
    var infoWindowData = {
        lat: false,
        lng: false
    };

    var currentOpen = -1;
    var infoWindowOpen = function (i, marker) {
        if (i === currentOpen && infoWindow.isOpen) {
            infoWindowClose(i);
            resetMarkerIcon();
            currentOpen = -1;
            return;
        }

        var markers = container.gmap('get', 'markers');
        if (markers.length <= 0)
            return;

        var markerInst = markers[i];

        // very IMPORTANT, should always deselect before select
        if (currentOpen > -1) {
            resetMarkerIcon();
        }
        currentOpen = i;

        selectMarker(markerInst, markers.length);

        infoWindow.setContent(infoWindowContent(marker));
        infoWindow.open(map, markerInst);
        infoWindow.isOpen = i;
        infoWindow.markerId = markerInst.id;

        if (marker.latitude && marker.longitude) {
            infoWindowData = {
                lat: marker.latitude,
                lng: marker.longitude
            };
        } else if (marker.latLng) {
            infoWindowData = {
                lat: marker.latLng.A,
                lng: marker.latLng.F
            };
        } else {
            infoWindowData = {
                lat: markerInst.position.latLng.A,
                lng: markerInst.position.latLng.F
            };
        }
    };

    var infoWindowClose = function (i) {
        if (typeof i == 'undefined') {
            infoWindow.close();
            infoWindow.isOpen = false;
            return true;
        }
        if (typeof infoWindow.isOpen != 'undefined' && infoWindow.isOpen === i) {
            infoWindow.close();
            infoWindow.isOpen = false;
            return true;
        }
        return false;
    };

    /* InfoBox */
    var infoWindow = new InfoBox({
        maxWidth: 240,
        alignBottom: true
    });

    google.maps.event.addListener(infoWindow, "closeclick", function () {
        if (currentOpen > -1) {
            resetMarkerIcon();
            currentOpen = -1;
        }
    });

    var closeCurrent  = function() {
        resetMarkerIcon();
        currentOpen = -1;
    };

    function resetMarkerIcon() {
        var currMarkerInst = container.gmap('get', 'markers')[currentOpen];
        if (currMarkerInst) {
            currMarkerInst.setOpacity(currMarkerInst.originalOpacity || 1.0);

            if (currMarkerInst.originalIcon) {
                currMarkerInst.setIcon(currMarkerInst.originalIcon);
                if (currMarkerInst.originalZIndex) {
                    currMarkerInst.setZIndex(currMarkerInst.originalZIndex);
                }
            }

            if (currMarkerInst.onMarkerDeselected) {
                currMarkerInst.onMarkerDeselected(currMarkerInst);
            }
        }
    }

    function selectMarker(markerInst, total) {
        markerInst.setOpacity(1.0);

        // we want to select a different icon if it's a restaurant
        var icon = markerInst.getIcon();
        if (icon.indexOf("restaurant") > 0) {
            markerInst.originalIcon = markerInst.getIcon();
            markerInst.setIcon(iconBase + "restaurant-03.png");
            if (total) {
                markerInst.originalZIndex = markerInst.getZIndex();
                markerInst.setZIndex(total + 100);
            }
        }

        if (markerInst.onMarkerSelected) {
            markerInst.onMarkerSelected(markerInst);
        }
    }

    function getMarkerIcon(icon) {
        if (icon.startsWith("http://")) {
            return icon;
        } else {
            return iconBase + icon + ".png";
        }
    }

    var addMarker = function (i, marker, options) {

        var position = typeof marker.latLng !== 'undefined' ? marker.latLng : false;
        if (!position && typeof marker.latitude !== 'undefined' && typeof marker.longitude !== 'undefined') position = new google.maps.LatLng(marker.latitude, marker.longitude);
        if (!position) return false;

        var markerOptions = {
            "id": i,
            "position": position,
            "draggable": options.draggable || true,
            "opacity": options.opacity || 1.0,
            "icon": getMarkerIcon(marker.icon),
            "zIndex": 1
        };

        if (typeof options == 'object') markerOptions = $.extend({}, markerOptions, options);

        var open = typeof marker.open !== 'undefined' && marker.open === true;

        container.gmap('addMarker', markerOptions);

        var markerInst = container.gmap('get', 'markers')[i];
        markerInst.originalOpacity = options.opacity;
        markerInst.setTitle(marker.title);

        google.maps.event.addListener(markerInst, 'click', function () {
            if (!infoWindowClose(i)) {
                infoWindowOpen(i, marker);
                library.centerWindow(container, map, infoWindowData);
            }
        });

        var markerData = $.extend({}, marker, {
            "id": i,
            "latLng": new google.maps.LatLng(marker.latitude, marker.longitude)
        });

        markerInst.set('content', markerData);

        if (open) infoWindowOpen(i, marker);

        return markerInst;
    };

    var removeMarker = function (markerInst) {
        if (markerInst) {
            google.maps.event.clearInstanceListeners(markerInst);
            markerInst.setMap(null);
        }
    };

    var removeMarkers = function(startIdx, endIdx) {
        if ((!isNaN(startIdx) && startIdx >=0 && isNaN(endIdx)) || startIdx < endIdx && startIdx >= 0 && endIdx >= 0) {
            var markers = container.gmap('get', 'markers');
            var end = markers.length;
            if (!isNaN(endIdx)) end = endIdx;

            for (var i = startIdx; i < end; i++) {
                var m = markers[i];
                removeMarker(m);
            }

            markers.splice(startIdx, end - 1);
            container.gmap('set', markers);
        }
    };

    container.gmap(
        {
            'zoomControl': true,
            'zoomControlOptions': {
                'style': google.maps.ZoomControlStyle[options.mapZoomStyle],
                'position': google.maps.ControlPosition[options.mapZoomPosition]
            },
            'panControl': false,
            'streetViewControl': false,
            'mapTypeControl': false,
            'overviewMapControl': false,
            'scrollwheel': options.scrollwheel,
            'draggable': options.draggable,
            'mapTypeId': google.maps.MapTypeId[options.mapType],
            'zoom': options.mapZoom,
            'styles': styles[options.mapStyle]
        })
        .bind('init', function () {

            mapData = {
                container: container,
                map: map,
                options: options,
                addMarker: addMarker,
                removeMarker: removeMarker,
                removeMarkers: removeMarkers, // this method permentantly removes marker from start to end
                library: library,
                iw: {
                    data: infoWindowData,
                    window: infoWindow,
                    content: infoWindowContent,
                    open: infoWindowOpen,
                    close: infoWindowClose,
                    closeCurrent: closeCurrent
                }
            };

            if (options.file) {

                $.getJSON(options.file, function (data) {

                    $.each(data.markers, function (i, marker) {
                        var o = typeof marker.options !== 'undefined' ? marker.options : {};
                        addMarker(i, marker, o);
                    });

                    google.maps.event.addListenerOnce(map, 'idle', function () {
                        library.resize(container, map, infoWindowData, options.center);

                        if (options.pagination) {
                            container.gmap('pagination', 'title', mapData);
                        }
                    });
                });

            }
            else {
                library.centerMap(container, options.center);
            }

            google.maps.event.addListenerOnce(map, 'idle', function () {

                $(document).trigger('map.init', mapData);

            });

            google.maps.event.addListener(infoWindow, 'domready', function () {
                var iw = $('.infoBox');
                infoWindow.setOptions({
                    pixelOffset: new google.maps.Size(-Math.abs(iw.width() / 2), -45)
                });
                setTimeout(function () {
                    $('.cover', iw).each(function () {
                        $(this).tkCover();
                    });
                }, 200);
            });
        });

    var map = container.gmap('get', 'map');

    var t;
    $(window).on('debouncedresize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            library.resize(container, map, infoWindowData, options.center);
        }, 100);
    });

    // handle maps in collapsibles
    $('.collapse').on('shown.bs.collapse', function () {
        if ($(container, this).length) {
            library.resize(container, map, infoWindowData, options.center);
        }
    });

};

module.exports = function () {
    initScripts();
};

(function ($) {
    "use strict";

    $(document).on('map.init', function (event, data) {

        var styleTpl = $('#map-style-switch'),
            toggleStyleWrapper = $('[data-toggle="map-style-switch"]');

        if (styleTpl.length && toggleStyleWrapper.length) {

            var target = $(toggleStyleWrapper.data('target'));

            if (!target) return;

            if (data.container.is(target)) {

                var s = styleTpl.html();
                var t = Handlebars.compile(s);

                toggleStyleWrapper.html(t({
                    styles: styles
                }));

                $('select', toggleStyleWrapper).val(data.options.mapStyle);

                if (typeof $.fn.selectpicker != 'undefined') {

                    $('.selectpicker', toggleStyleWrapper).each(function () {
                        $(this).selectpicker({
                            width: $(this).data('width') || '100%'
                        });
                    });

                }

                var skin = require('../_skin.js')();

                $('[data-scrollable]', toggleStyleWrapper).niceScroll({
                    cursorborder: 0,
                    cursorcolor: config.skins[skin]['primary-color'],
                    horizrailenabled: false
                });

                $('select', toggleStyleWrapper).on('change', function () {
                    var style = typeof styles[$(this).val()] ? styles[$(this).val()] : false;
                    if (!style) return;

                    target.gmap('option', 'styles', style);
                });

            }

        }

    });

    $('[data-toggle="google-maps"]').each(function () {

        $(this).tkGoogleMap();

    });

})(jQuery);

require('./_edit');
require('./_filters');