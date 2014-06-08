var app = angular.module('app', []);

app.directive('valueFunc', ['$parse', function($parse) {
    return {
        compile: function($element, attr) {
            var value = $parse(attr['valueFunc']);

            return function(scope, element, attr) {
                scope.$watch(function() {
                    element.val(value(scope));
                });
            };
        }
    };
}]);

app.controller('PlacesController', ['$scope', '$http', function($scope, $http) {

    var rainbow, elmSearchInput;
    $scope.places = [];
    $scope.baseTime = null;

    function initialize() {

        rainbow = new Rainbow(); 
        rainbow.setSpectrum('#00000C', '#ffd895', '#ffffff', '#487a9f', '#000c32');
        rainbow.setNumberRange(0, 100);

        elmSearchInput = document.querySelector('.new-city-input');
        var map = document.querySelector('.map');

        autocompleter = new google.maps.places.Autocomplete(elmSearchInput, {
            types: ['(regions)']
        });

        google.maps.event.addListener(autocompleter, 'place_changed', onAutoCompleteSuccess);

        // Timer for rendering every minute
        setInterval(function() {
            $scope.$apply();
        }, 60 * 1000);

        loadPlacesFromStorage();
    }

    function storePlaces() {
        localStorage.setItem('places', JSON.stringify($scope.places));
    }

    function sortPlaces(places) {
        return places.sort(function(a, b) {
            var localTime = $scope.getPlaceLocalTime(a);

            if(moment().format() === localTime.format() ) {
                return -1; // Bump cities with localtime to the top
            } else {
                return 1;
            }
        });        
    }

    function loadPlacesFromStorage() {

        if (localStorage.getItem('places')) {
            var data = JSON.parse(localStorage.getItem('places'));
            $scope.places = sortPlaces(data);
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

        var req = $http.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=' + timestamp + '&key=' + key);

        req.then(function(response) {

            var rawOffset = response.data.rawOffset;
            var dstOffset = response.data.dstOffset;

            var place = {
                referenceId: gPlace.reference,
                timezoneId: response.data.timeZoneId.replace('Asia/Calcutta', 'Asia/Kolkata'),
                name: gPlace.name,
                lng: lng,
                lat: lat
            }

            $scope.places.push(place);
            $scope.places = sortPlaces($scope.places);

            storePlaces();

        });
    }

    $scope.removeItem = function(placeId) {

        $scope.places = $scope.places.filter(function(place) {
            return place.referenceId !== placeId;
        });

        storePlaces();        

    }


    // Event handlers
    function onAutoCompleteSuccess() {
        var place = autocompleter.getPlace();
        addNewPlace(place);

        setTimeout(function() {
            elmSearchInput.value = '';
        }, 1);
    }
 
    $scope.onInputKeydown = function(event) {

        var val = parseInt(event.target.value, 10);

        if(event.which === 38) {
            val = val + 1;
            event.preventDefault();
        } else if(event.which === 40) {
            val = val - 1;
            event.preventDefault();
        }

        $scope.baseTime = moment().tz(this.place.timezoneId).hour(val);

    }
 

    $scope.getPlaceLocalTime = function(place) {

        var localTime = moment().tz(place.timezoneId);

        if($scope.baseTime) {
            localTime = $scope.baseTime.tz(place.timezoneId);
        } 

        return localTime;

    }

    $scope.getPlaceLocalTimeHour = function(place) {
        var time = $scope.getPlaceLocalTime(place);
        return time.format('HH');
    }

    $scope.getGradient = function(place) {

        var localTime = $scope.getPlaceLocalTime(place);
        var secondsOfDay = localTime.seconds() + (60 * (localTime.minutes() + (60 * localTime.hours() ) ));
        var secondsInDay = 86400;
        var procentageOfDay = 100* ((secondsOfDay / secondsInDay));

        var color1 = '#' + rainbow.colourAt(-8 + procentageOfDay);
        var color2 = '#' + rainbow.colourAt(8 + procentageOfDay);

        return "linear-gradient(to right, "+color1+" 0%, "+color2+" 100%)";

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

    $scope.getActivityInfoClass = function(place) {
        var localTime = $scope.getPlaceLocalTime(place);
        return $scope.getActivityInfo(localTime).cssClass;
    }

    $scope.getActivityInfoText = function(place) {
        var localTime = $scope.getPlaceLocalTime(place);
        return $scope.getActivityInfo(localTime).text;
    }

    initialize();

}]);