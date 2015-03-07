var app = angular.module('app', []);

app.directive('inputEvent', ['$parse', function($parse) {
     return {
         compile: function($element, attr) {
             var fn = $parse(attr['inputEvent']);

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
    $scope.settings = {};

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

        loadDataFromStorage();
    }

    function storeData() {
        localStorage.setItem('places', JSON.stringify($scope.places));
        localStorage.setItem('settings', JSON.stringify($scope.settings));
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

    function loadDataFromStorage() {

        if (localStorage.getItem('settings')) {
            $scope.settings = JSON.parse(localStorage.getItem('settings'));
        }

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
        var lng = gPlace.geometry.location.D;
        var timestamp = Math.round(new Date().getTime() / 1000.0);
        var key = 'AIzaSyDfMh4cBrnNFsbKm4VXqunqCTTbQmk3eNI';

        var req = $http.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=' + timestamp + '&key=' + key);

        req.then(function(response) {

            var rawOffset = response.data.rawOffset;
            var dstOffset = response.data.dstOffset;

            var place = {
                referenceId: gPlace.reference,
                timezoneId: response.data.timeZoneId,
                name: gPlace.name,
                lng: lng,
                lat: lat
            }

            $scope.places.push(place);
            $scope.places = sortPlaces($scope.places);

            storeData();

            // Force reflow in Chrome until flexbox render issue is fixed
            // var elmList = document.querySelector('.places');
            // elmList.style.display='none';
            // elmList.style.display='block';

        });
    }

    $scope.removeItem = function(placeId) {

        $scope.places = $scope.places.filter(function(place) {
            return place.referenceId !== placeId;
        });

        storeData();

    }

    // Event handlers
    function onAutoCompleteSuccess() {
        var place = autocompleter.getPlace();
        addNewPlace(place);

        setTimeout(function() {
            elmSearchInput.value = '';
        }, 1);
    }

    $scope.onInputChange = function(event) {
        var value = event.target.value;

        if(!value.length) {
            return;
        }

        var val = parseInt(event.target.value, 10);

        var placeLocalTime = $scope.getPlaceLocalTime(this.place);

        if($scope.settings.is12Hour) {
            if(placeLocalTime.format('A') == 'PM' && val != 12.) {
                val = val + 12;
            }
        }

        $scope.baseTime = moment().tz(this.place.timezoneId).hour(val);

    }

    $scope.onTimeDoubleClick = function(event){
        $scope.settings.is12Hour = !$scope.settings.is12Hour;

        storeData();
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
        return $scope.settings.is12Hour ? time.format('hh') : time.format('HH');
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