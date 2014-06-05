(function() {

    var places = [];
    var autocompleter;
    var baseTime = null;

    function initialize() {

        var input = document.getElementById('new-city-input');
        var map = document.querySelector('.map');

        autocompleter = new google.maps.places.Autocomplete(input, {
            types: ['(regions)']
        });

        google.maps.event.addListener(autocompleter, 'place_changed', onAutoCompleteSuccess);

        loadPlacesFromStorage();
        renderPlaces();
    }

    function addNewPlace(gPlace) {

        var request = {
            reference: gPlace.reference
        };

        var lat = gPlace.geometry.location.k;
        var lng = gPlace.geometry.location.A;
        var timestamp = Math.round(new Date().getTime() / 1000.0);
        var key = 'AIzaSyDfMh4cBrnNFsbKm4VXqunqCTTbQmk3eNI';

        var req = getJSON('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=' + timestamp + '&key=' + key);

        req.then(function(response) {

            var rawOffset = response.rawOffset;
            var dstOffset = response.dstOffset;

            var place = {
                referenceId: gPlace.reference,
                name: gPlace.name,
                timezoneId: response.timeZoneId,
                lng: lng,
                lat: lat
            }

            places.push(place);

            storePlaces();
            renderPlaces();

        });
    }

    function renderPlaces() {

        var html = [];

        places.forEach(function(place) {

        	var localTime = moment().tz(place.timezoneId);

        	if(baseTime) {
				localTime = baseTime.tz(place.timezoneId);
        	} 

            var localTimeHour = parseInt(localTime.format("HH"), 10);
            var activity = getActivityText(localTimeHour);

            html.push('<li class="zone" data-id="' + place.referenceId + '">');
            html.push('<div class="time">');
            html.push('<input type="number" class="hour" value="' + localTime.format('HH') + '" />');
            html.push('<input type="text" tabindex="-1" class="minute" value="' + localTime.format('mm') + '" />');
            html.push('</div>');
            html.push('<div class="body">');
            html.push('<span class="name">' + place.name + '</span>');
            html.push('<span class="activity">' + activity + '</span>');
            html.push('</div>');
            html.push('<button tabindex="-1" class="remove">x</button>');
            html.push('</li>');
            html.push('\n');

        });

        var elmPlaces = document.querySelector('.places');

        elmPlaces.innerHTML = html.join('');
        elmPlaces.addEventListener('click', onPlacesClicked, false);
        elmPlaces.addEventListener('change', onPlacesInputChanged, false);

    }

    function storePlaces() {
        localStorage.setItem('places', JSON.stringify(places));
    }

    function loadPlacesFromStorage() {

        if (localStorage.getItem('places')) {
            places = JSON.parse(localStorage.getItem('places'));
        }

    }

    function removeItem(placeId) {

        places = places.filter(function(place) {
            return place.referenceId !== placeId;
        });

        storePlaces();

    }

    // Event handlers
    function onAutoCompleteSuccess() {
        var place = autocompleter.getPlace();
        addNewPlace(place);
    }

    function onPlacesClicked(e) {

        if (e.target.tagName.toLowerCase() === 'button') { // Delete button clicked
            e.stopPropagation();
            e.preventDefault();

            var placeId = e.target.parentNode.attributes['data-id'].value;
            removeItem(placeId);
            renderPlaces();
        }

    }

    function onPlacesInputChanged(e) {

    	var value = e.target.value;
    	var placeId = e.target.parentNode.parentNode.attributes['data-id'].value;

    	var place = places.filter(function(place) {
            return place.referenceId === placeId;
        })[0];

    	// Calculate new base time
    	baseTime = moment().tz(place.timezoneId).hour(value);

    	renderPlaces();

    	document.querySelector('li[data-id=' + placeId + '] input.hour').focus();


    };

    // Helper methods
    function getJSON(url) {

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(status);
                }
            };

            xhr.send();
        });

    };

    function getActivityText(timeThere) {

        thisActivity = "";

        if (timeThere >= 0) {
            thisActivity = "sleeping";
        }

        if (timeThere >= 6) {
            thisActivity = "having breakfast";
        }

        if (timeThere >= 10) {
            thisActivity = "at the office";
        }

        if (timeThere >= 11) {
            thisActivity = "at lunch";
        }

        if (timeThere >= 14) {
            thisActivity = "at the office";
        }

        if (timeThere >= 17) {
            thisActivity = "having dinner";
        }

        if (timeThere >= 20) {
            thisActivity = "out for a drink";
        }

        if (timeThere >= 22) {
            thisActivity = "going to bed";
        }

        return 'is ' + thisActivity;

    }

    initialize();

})();