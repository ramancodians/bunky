var app = angular.module('bunky', ['ngRoute']);

/*CONFIG
 *************************************************************************************/

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/subject/:subjectID', {
                templateUrl: 'views/subject.html',
                controller: 'SubjectCtrl'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/canIBunk', {
                templateUrl: 'views/can-i-bunk.html',
                controller: 'CIBCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
  }]);

/*CONTROLLER
 ***********************************************************************************/


app.controller('HomeCtrl', ['$scope', 'Attendance', function ($scope, Attendance) {

    $scope.dropdown = false;
    $scope.ba = 1;

    //controlling the Tabs Logic
    $scope.tab = [true, false, false];

    $scope.tabHandler = function (i) {
        //find the tab with true and setting it false
        $scope.tab[$scope.tab.lastIndexOf(true)] = false;
        $scope.tab[i] = true;
    }

    console.log($scope.tab[0]);



    Attendance.fetch().then(function (data) {
        $scope.d = data;
        console.log(data);
    });

    $scope.toggle = function () {


        console.log($scope.dropdown);
        if ($scope.dropdown == false) {
            $scope.dropdown = true;
        } else if ($scope.dropdown == true) {
            $scope.dropdown = false;
        }
    }

}]);

app.controller('CIBCtrl', ['$scope', 'Attendance', function ($scope, Attendance) {

    $scope.dropdown = false;

    Attendance.fetch().then(function (data) {
        $scope.d = data;
        console.log(data);
    });

    $scope.toggle = function () {


        console.log($scope.dropdown);
        if ($scope.dropdown == false) {
            $scope.dropdown = true;
        } else if ($scope.dropdown == true) {
            $scope.dropdown = false;
        }
    }

}]);




app.controller('LoginCtrl', function ($scope) {
    $scope.loginBox = false;
    $scope.hello = "Hello!!";

    $scope.toggle = function () {
        if ($scope.loginBox == false) {
            $scope.loginBox = true;
        } else if ($scope.loginBox == true) {
            $scope.loginBox = false;
        }
    }



});




/* FILTERS
 ***********************************************************************************/

app.filter('trim', function () {
    return function (text) {
        return String(text).replace(/ /mg, "-").toLowerCase();
    };
});

/* Factories
 ***********************************************************************************/
app.factory('Attendance', function ($q, $timeout, $http) {
    var data = {
        fetch: function () {
            var deferred = $q.defer();
            $timeout(function () {
                $http.get('js/data.json').success(function (data) {
                    deferred.resolve(data);
                });
            }, 30);
            return deferred.promise;
        }
    }
    return data;
});


/*DIRECTIVES
 ****************************************************************************/
app.directive('appColorify', function () {
    var linker = function (scope, element, attrs) {
        var showOut = function () {
            console.log(element[0].innerHTML);
            console.log('Attrs = ' + attrs[0]);
        }
        $(this).on('click', showOut);
    };



    return {
        restrict: 'A',
        link: linker,
        scope: {
            tag: '='
        }

    }
});