function MapHelper() {
    var instance = this;

    instance.createUserMarker = createUserMarker;
    instance.createRestaurantMarker = createRestMarker;

    return instance;

    function createUserMarker(coords, open) {
       return {
            "open": open || true,
            "template": "map-infobox-icon",
            "icon": "user-10",
            "latitude": coords.latitude,
            "longitude": coords.longitude,
            "description": "Hello World", // TODO: change this 
            "name": "I am Here!",
            "tag": "user"
        };
    }

    // obj MUST be an object returned from Factual
    function createRestaurantMarker(obj, markerId) {

        // @markerId: 
        //  is used to open the infobox of the corresponidng marker
        //  this value should be mapped to the sequence index of the marker being added to the map     
        var idx = obj.placeIndex || 0;
        return {
            "open": false,
            "template": "map-infobox-restaurant",
            "icon": "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + idx + "|FF0000|000000",
            "latitude": obj.latitude,
            "longitude": obj.longitude,
            "address": obj.address,
            "postalCode": obj.postcode,
            "name": obj.name,
            "factual_id": obj.factual_id,
            "opacity": 0.4,
            "cuisine": obj.cuisine,
            "idx": markerId
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