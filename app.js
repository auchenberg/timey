var app = angular.module('app', [
    'ngRoute'
]);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        controller: 'AppController',
        templateUrl: 'views/home.html'
    });

    $routeProvider.when('/:zones*', {
        controller: 'AppController',
        templateUrl: 'views/home.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);

});

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

app.controller('AppController', function($scope, $http, $routeParams, $location) {

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
        parseUrlZones();


        setInterval(function() {
            drawHands();
        }, 1000)

    }

   var drawHands = function() {
        // Constants for hand's sizes.
        var SECONDS_HAND_SIZE = 0.65,
        MINUTES_HAND_SIZE = 0.55,
        HOURS_HAND_SIZE = 0.40;

        var circle = document.querySelector(".edge");

        // Clock Circle's Properties
        var r = circle.getAttribute('r'),
        cx = parseInt(circle.getAttribute('cx')),
        cy = parseInt(circle.getAttribute('cy'));

        // Current time.
        var currentTime = new Date();

        // Draw Hands
        drawHand(document.querySelector(".second"),
                 currentTime.getSeconds(),
                 SECONDS_HAND_SIZE,
                 6);
        drawHand(document.querySelector(".minute"),
                 currentTime.getMinutes(),
                 MINUTES_HAND_SIZE,
                 6);
        drawHand(document.querySelector(".hour"),
                 currentTime.getHours(),
                 HOURS_HAND_SIZE,
                 30);

        function drawHand(hand, value, size, degrees) {
            var deg = degrees * value;
            x2 = getX(deg, r, size, cx),
            y2 = getY(deg, r, size, cy);

            hand.setAttribute('x1', cx);
            hand.setAttribute('y1', cy);
            hand.setAttribute('x2', x2);
            hand.setAttribute('y2', y2);
        }
    };

    function getX(degrees, r, adjust, x) {
        var x = x || r,
        adj = adjust || 1;
        return x + r * adj * Math.cos(getRad(degrees));
    }
    function getY(degrees, r, adjust, y) {
        var y = y || r,
        adj = adjust || 1;
        return y + r * adj * Math.sin(getRad(degrees));
    }

    function getRad(degrees) {
        var adjust = Math.PI / 2;
        return (degrees * Math.PI / 180) - adjust;
    }

    function storeData() {
        localStorage.setItem('places', JSON.stringify($scope.places));
        localStorage.setItem('settings', JSON.stringify($scope.settings));
    }

    function sortPlaces(places) {

        places = removeDupes(places);

        return places.sort(function(a, b) {
            return a.name.localeCompare(b.name);

            // var localTime = $scope.getPlaceLocalTime(a);
            // if(moment().format() === localTime.format() ) {
            //     return -1; // Bump cities with localtime to the top
            // } else {
            //     return 1;
            // }
        });

    }

    function removeDupes(places) {
        var seen = {};
        return places.filter(function(item) {
            var key = [item.name, item.timezoneId].join('_');
            return seen.hasOwnProperty(key) ? false : (seen[key] = true);
        });
    }

    function parseUrlZones() {

        if(!$routeParams.zones) {
            return;
        }

        var zones = [].concat($routeParams.zones.split('/'));
        var map = document.querySelector('.map');

        zones.forEach(function(placeName) {

            service = new google.maps.places.PlacesService(map);
            service.textSearch({
                query: placeName
            }, function(places) {
                var place = places[0];
                if(place) {
                    addNewPlace(place, false);
                }
            });

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

    function addNewPlace(gPlace, updateUrl) {

        var request = {
            reference: gPlace.reference
        };

        var existingItem = $scope.places.filter(function(elem, pos) {
            return elem.referenceId === gPlace.reference;
        });

        if(existingItem.length) {
            return;
        }

        var lat = gPlace.geometry.location.lat();
        var lng = gPlace.geometry.location.lng();
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

            if(updateUrl) {
                $scope.updateUrl()
            }

        });
    }

    $scope.removeItem = function(placeId) {

        $scope.places = $scope.places.filter(function(place) {
            return place.referenceId !== placeId;
        });

        storeData();
        $scope.updateUrl();

    }

    // Event handlers
    function onAutoCompleteSuccess() {
        var place = autocompleter.getPlace();
        addNewPlace(place, true);

        setTimeout(function() {
            elmSearchInput.value = '';
        }, 1);

    }

    $scope.updateUrl = function() {

        var names = $scope.places.map(function(place) {
            return place.name.replace(' ', '+').toLowerCase();
        });

        var path = names.join('/');

        $location.path(path).replace();

    }

    $scope.onInputChange = function(event) {
        var value = event.target.value;

        if(!value.length) {
            return;
        }

        var val = parseInt(event.target.value, 10);
        var placeLocalTime = $scope.getPlaceLocalTime(this.place);

        if($scope.settings.is12Hour) {
            if(placeLocalTime.format('A') == 'PM' && val != 12) {
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

});
