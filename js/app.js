var app = angular.module('app', []);

app.directive('changeEvent', ['$parse', function($parse) {
    return {
        compile: function($element, attr) {
            var fn = $parse(attr['changeEvent']);

            return function(scope, element, attr) {
                element.on('change', function(event) {
                    scope.$apply(function() {
                        fn(scope, {$event:event});
                    });
                });
            };
        }
    };
}]);

app.directive('numberValue', ['$parse', function($parse) {
    return {
        compile: function($element, attr) {
            var fn = $parse(attr['numberValue']);

            return function(scope, element, attr) {
                scope.$watch(function() {
                    element.val(fn(scope));
                });
            };
        }
    };
}]);

app.controller('PlacesController', ['$scope', function($scope) {

    $scope.places = [];
    $scope.baseTime = null;

    function initialize() {

        var input = document.getElementById('new-city-input');
        var map = document.querySelector('.map');

        autocompleter = new google.maps.places.Autocomplete(input, {
            types: ['(regions)']
        });

        google.maps.event.addListener(autocompleter, 'place_changed', onAutoCompleteSuccess);

        loadPlacesFromStorage();
    }

    function storePlaces() {
        localStorage.setItem('places', JSON.stringify($scope.places));
    }

    function loadPlacesFromStorage() {

        if (localStorage.getItem('places')) {
            $scope.places = JSON.parse(localStorage.getItem('places'));
        }

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
                timezoneId: response.timeZoneId.replace('Asia/Calcutta', 'Asia/Kolkata'),
                name: gPlace.name,
                lng: lng,
                lat: lat
            }

            $scope.places.push(place);
            $scope.$apply();

            storePlaces();

        });
    }

    // Event handlers
    function onAutoCompleteSuccess() {
        var place = autocompleter.getPlace();
        addNewPlace(place);
    }

    $scope.getActivityInfoClass = function(place) {
        var localTime = $scope.getPlaceLocalTime(place);
        return $scope.getActivityInfo(localTime).cssClass;
    }

    $scope.getActivityInfoText = function(place) {
        var localTime = $scope.getPlaceLocalTime(place);
        return $scope.getActivityInfo(localTime).text;
    }

    $scope.getPlaceLocalTime = function(place) {

        var localTime = moment().tz(place.timezoneId);

        if($scope.baseTime) {
            localTime = $scope.baseTime.tz(place.timezoneId);
        } 

        return localTime;

    }

    $scope.getPosition = function(place) {

        var localTime = $scope.getPlaceLocalTime(place);
        var secondsOfDay = localTime.seconds() + (60 * (localTime.minutes() + (60 * localTime.hours() ) ));

        var totalWidth = 4200;
        var secondsInDay = 86400;
        
        console.log('place', $scope.getPlaceLocalTime(place).format() );
        console.log('localTime', localTime);
        console.log('secondsOfDay', secondsOfDay);
        console.log('(secondsOfDay / secondsInDay)', (secondsOfDay / secondsInDay));

        var noget = ( -1 * ((secondsOfDay / secondsInDay) * totalWidth));

        console.log(noget);

        return noget;

    }

    $scope.getPlaceLocalTimeHour = function(place) {

        var time = $scope.getPlaceLocalTime(place);
        return parseInt(time.format('HH'), 10);
    }

    $scope.getActivityInfo = function(time) {

        var timeThere = parseInt(time.format("HH"), 10);
        var thisActivity = "";
        var cssClasses = ['activity'];

        if (timeThere >= 22) {
            thisActivity = "going to bed";
            cssClasses.push("state-bed");
        } else if (timeThere >= 20) {
            thisActivity = "out for a drink";
            cssClasses.push("state-drink");
        } else if (timeThere >= 17) {
            thisActivity = "having dinner";
            cssClasses.push("state-dinner");
        } else if (timeThere >= 14) {
            thisActivity = "at the office";
            cssClasses.push("state-office");
        } else if (timeThere >= 11) {
            thisActivity = "at lunch";
            cssClasses.push("state-lunch");
        } else if (timeThere >= 10) {
            thisActivity = "at the office";
            cssClasses.push("state-office");
        } else if (timeThere >= 6) {
            thisActivity = "having breakfast";
            cssClasses.push("state-breakfast");
        } else if (timeThere >= 0) {
            thisActivity = "sleeping";
            cssClasses.push("state-sleeping");            
        }

        return {
            text: 'is ' + thisActivity,
            cssClass: cssClasses.join(' ')
        };

    }

    $scope.removeItem = function(placeId) {

        $scope.places = $scope.places.filter(function(place) {
            return place.referenceId !== placeId;
        });

        storePlaces();        

    }

    $scope.onTimeChange = function(event, data) {
        var time = event.target.value;
        $scope.baseTime = moment().tz(this.place.timezoneId).hour(time);
    }

    initialize();

}]);


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
