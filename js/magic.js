var app = angular.module('bunky', ['ngRoute', 'ngAnimate', 'firebase', 'ngStorage']);

var development = false;

/*CONFIG
 *************************************************************************************/

app.run(function ($http) {
    console.log("RUN Ran!");

});

var l = function(string){
    console.log("LOGS -> " + string);
}

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/', {
                templateUrl: 'views/login.html',               
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
  }]);

// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// Authentication
app.service('Auth', function ($http, $localStorage) {
    var logged = false;
    var data = {};
    console.log("Auth Service ran");


    this.getUserData = function () {
        return data;
    }
    
    // save user data on Browser/Machine
    this.isLoged = function () {
        l("Local Data : "+$localStorage.isLoggedOnThis);
        if ($localStorage.isLoggedOnThis){
            data = $localStorage.userData;
            return 1;
        }else{
            return 0;
        }
    }

    this.saveUser = function (user) {
        //storing data on local storage
        $localStorage.userData = user;

        // remembering user is logged on this Machine
        if (!$localStorage.isLoggedOnThis)
            $localStorage.isLoggedOnThis = true;
        
        logged = true;
        // to share across service
        data = user;
    }

    this.logout = function () {
        // reset all varials        
        data = {};
        logged = false;
        $localStorage.isLoggedOnThis = false;
        l("user Auth logged out");
        l("isLoggedOnThis "+$localStorage.isLoggedOnThis);
        return 1;
    }
});

// **********************************************************************
// **********************************************************************
// **********************************************************************
// **********************************************************************
// **********************************************************************




/*CONTROLLER
 ***********************************************************************************/
app.controller('LoginCtrl', function ($scope, $http, Auth, $location) {
    //$scope.username = 1315957;
    //$scope.magicword = 94517053;
    $scope.logging = false;
    $scope.errorMsg = false;
    
    //check if user is already logged in the app
    if(Auth.isLoged()){
        console.log("User is Logged");
        $location.path('/home');
    }else{
        console.log("User is Not Logged!");
    }
    
    $scope.submit = function () {
        console.log("login()");

        $scope.logging = true;

        var url = 'http://bunky-midnightlabs.rhcloud.com/christ_university?username=' + $scope.username + '&password=' + $scope.magicword;
        $http.get(url).then(function (res) {
            //login successful, storing the data on globe                     
            if (res.data.result === "failure") {
                console.log("Userid or password invalid");
                $scope.errorMsg = "Invalid Username or Password";
            } else {
                console.log("User exits");
                console.log(res);

                // adding user to session
                Auth.saveUser(res);
                // redirecting -> home
                $location.path('/home');

            }
            $scope.logging = false;
        });
    };
});



app.controller('HomeCtrl', ['$scope', 'Attendance', 'Auth', '$location', '$http', function ($scope, Attendance, Auth, $location, $http) {

    // init setting UI Toggles
    $scope.dropdown = false;
    $scope.menu = false;
    $scope.modalShown = false;
    $scope.tab = [true, false, false];    
    $scope.sidemenu = [true, false, false];    
    /*overview by default*/
    $scope.extraMarks = 0;
    $scope.activeNav = 'home';
    $scope.d = {};
    $scope.sidebar = [
        {
            item: 'Dashboard',
            icon: 'home',
            url: 'home'
            
    }, {
            item: 'Can I bunk',
            icon: 'question',
            url: 'canIBunk'
        
    }, {
            item: 'Plan a Holiday',
            icon: 'calendar',
            url: 'plan-a-holiday'
    }]
    
 
    
    // triming the names

    //REMOVE DEVELOPMENT CODE IN PRODUCTION    
    //check if user is logged in
    if (!Auth.isLoged() && !development) {
        // user is NOT logged it -> redirect to login view
        $location.path('/');
    } else {
        //else fetch the data from Auth

        
    }
    
    if (development) {
            $http.get('js/data.json').success(function (res) {
                console.log("Using JSON Data");
                console.log(res);
                $scope.d = res;
            }).error(function (why) {
                console.log(why);
            });
        } else {
            console.log("Live Data");
            var savedData = Auth.getUserData();
            $scope.d = savedData.data;
            
            // triming the names
            $scope.present = $scope.d.attendance[$scope.d.attendance.length - 1][1];
            $scope.conducted = $scope.d.attendance[$scope.d.attendance.length - 1][0];
            $scope.absent = $scope.d.attendance[$scope.d.attendance.length - 1][2];
            $scope.percentage = $scope.d.attendance[$scope.d.attendance.length - 1][3];

            
            
            console.log($scope.d);
        }
    //REMOVE DEVELOPMENT CODE IN PRODUCTION    

    // if user logged in then load data from localstorage
    
    $scope.logout = function(){
        l("logout btn clikced");
        var result = Auth.logout();
        if(result){
            l(result);
            $location.path('/');
        }else{
            alert("Error while logging user");
        }
    }


    // sidebar data
    $scope.menuToggle = function () {
        // check the size of the window and load it
        $scope.isMobile();
        if ($scope.mobile == true) {
            console.log("Mobile Toggle Called!");
            $scope.menu = !$scope.menu;
        } else {
            // desktop then do this
            $scope.menu = false;
        }
    }

    // check if window is mobile
    $scope.isMobile = function () {
        $scope.mobile = window.innerWidth;
        if ($scope.mobile > 767) {
            $scope.mobile = false;
        } else {
            $scope.mobile = true;
        }
    }

    // subject dialog box toggler
    $scope.toggleModal = function (data) {
        $scope.modalShown = !$scope.modalShown;
        // init modal scope data
        $scope.subDetails = data;
    };

    // sidebar .active class logic
    $scope.sidebarActive = function (url) {
        $scope.activeNav = url;
        $scope.menuToggle();
    }
    
    
    $scope.sidebarActiveToggle = function(index){
        $scope.sidemenu[$scope.sidemenu.lastIndexOf(true)] = false;
        $scope.sidemenu[index] = true;
        $scope.menuToggle();
    }
    
    
     $scope.sidenav = function (url) {
        $scope.activemMenu = url;
        $scope.menuToggle();
    }

    //controlling the Tabs Logic
    $scope.tabHandler = function (i) {
        //find the tab with true and 
        //setting it false
        $scope.tab[$scope.tab.lastIndexOf(true)] = false;
        $scope.tab[i] = true;

    }

}]);

app.controller('PAHCtrl', function ($scope) {

});

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



/* FILTERS
 ***********************************************************************************/

app.filter('trim', function () {
    return function (text) {
        return String(text).replace(/ /mg, "-").toLowerCase();
    };
});

app.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
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
        var per = attrs.appColorify;

        var colorify = function () {
            //getting the color based on attendance
            if (per <= 100 && per > 90) {
                element.addClass('a90-100');
            } else if (per > 85) {
                element.addClass('a85-90');
            } else if (per > 80) {
                element.addClass('a80-85');
            } else if (per > 75) {
                element.addClass('a75-80');
            } else if (per > 70) {
                element.addClass('a70-75');
            } else if (per > 40) {
                element.addClass('a40-70');
            } else if (per > 10) {
                element.addClass('a10-40');
            } else if (per >= 0) {
                element.addClass('a0-10');
            } else {
                return 'black';
            }
        }
        $(this).on('click', colorify);
    };
    return {
        restrict: 'A',
        link: linker,
        scope: {
            tag: '='
        }

    }
});

app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    }
});

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                scope.show = false;
            };
        },
        templateUrl: 'views/modal.html'
    };
});