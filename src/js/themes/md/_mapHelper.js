function MapHelper() {
    var instance = this;

    instance.createUserMarker = createUserMarker;
    instance.createRestaurantMarker = createRestMarker;
    instance.createMap = createMap;
    instance.configMap = configMap;

    return instance;

    function configMap(mapProvider) {
        mapProvider.configure({
            key: '[EnterYourKeyHere]',
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