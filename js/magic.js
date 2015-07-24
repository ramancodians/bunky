var app = angular.module('bunky', ['ngRoute','ui.rCalendar']);

/*CONFIG
 *************************************************************************************/

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/plan-a-holiday', {
                templateUrl: 'views/plan-a-holiday.html',
                controller: 'PAHCtrl'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/canIBunk', {
                templateUrl: 'views/can-i-bunk.html',
                controller: 'CIBCtrl'
            })
            .when('/join-us', {
                templateUrl: 'views/join-us.html',
                controller: 'JoinUsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
  }]);

/*CONTROLLER
 ***********************************************************************************/

app.controller('HomeCtrl', ['$scope', 'Attendance','Christ', function ($scope, Attendance,Christ) {

    $scope.dropdown = false;
    $scope.menu = false;
    
     $scope.menuToggle = function () {
         $scope.isMobile();
         
         
         if($scope.mobile == true){
             console.log("Mobile Toggle Called!");
             $scope.menu = !$scope.menu;
         }else{
            // desktop then do this
           console.log("Desktop Toggled called!");

            $scope.menu = false;
         }
         console.log($scope.menu);
              
    }
     
     
     $scope.isMobile = function(){
        $scope.mobile = window.innerWidth;
         
        if($scope.mobile > 767){
          // console.log("Desktop Version of Site activated");
           $scope.mobile = false;
           // console.log($scope.mobile);
        }else{
          //  console.log("Mobile Version of Site activated");
            $scope.mobile =  true;
          //  $scope.menu = true;
           // console.log($scope.mobile);
        }
     }
    
      $scope.modalShown = false;
    
    $scope.toggleModal = function(data) {
        $scope.modalShown = !$scope.modalShown;
        $scope.subDetails = data;
        console.log($scope.subDetails);
    };
    
    

    // sidebar data
    $scope.sidebar = [{
        item : 'Dashboard',
        icon : 'home',
        url: 'home'
    },{
        item : 'Can I bunk',
        icon : 'question',
        url: 'canIBunk'
    },{
        item : 'Plan a Holiday',
        icon : 'calendar',
        url: 'plan-a-holiday'
    },{
        item : 'Bunk Stats',
        icon : 'line-chart',
        url: 'stats'
    }];
    
    // activating the home sidebar
    $scope.activeNav = 'home';
    
    // sidebar .active class logic
    $scope.sidebarActive = function(url){
        $scope.activeNav = url;
        $scope.menuToggle();
    }
    
    
    // bunk and attend UI logic 
    // basically when to show gain
    // or loose property
  
    
    //controlling the Tabs Logic
    $scope.tab = [true, false, false];

    $scope.tabHandler = function (i) {
        //find the tab with true and 
        //setting it false
        $scope.tab[$scope.tab.lastIndexOf(true)] = false;
        $scope.tab[i] = true;
    
    }


    $scope.makeSubjectBunkChart = function(){
         
    }
    
    // calling
    $scope.makeSubjectBunkChart();

    $scope.extraMarks = 0;
        
    // fetching data from json
    Attendance.fetch().then(function (data) {
        $scope.d = data;
        console.log($scope.d);
        
    }).then(function(){
        var marks = 0;
        var allsubs = $scope.d.attendance.subjects;
        allsubs.forEach(function(i){
            // adding marks based on all the subjects
            if(i.percentage > 95){
                marks = marks + 5;
            }else if(i.percentage < 90 && i.percentage > 95){
                marks = marks + 4;
            }else if(i.percentage > 85 && i.percentage < 90){
                marks = marks + 3;
            }else if(i.percentage > 80 && i.percentage < 85){
                marks = marks + 2;
            }else if(i.percentage > 75 && i.percentage < 80){
                marks = marks + 1;
            }else{
                marks = marks + 0;
            }
        });
        $scope.extraMarks = marks;
    });


}]);

app.controller('PAHCtrl',function($scope){
    $scope.hello = "Hello Angular";
    
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

app.factory('Christ',function($http,$timeout,$q){
    var data = { 
        get : function(){
            var deferred = $q.defer();
            $timeout(function(){ $http.post('http://111.93.136.228/KnowledgePro/StudentLoginAction.do',{userName : 1315957, password : 94517053
            }).success(function(data){
            console.log(data);
            })
            },30);
        }
    }
    return data;
});


/*DIRECTIVES
 ****************************************************************************/
app.directive('appColorify', function () {
    var linker = function (scope, element, attrs) {
        var per = attrs.appColorify;
        
        var colorify = function(){
           //getting the color based on attendance
           if(per <= 100 && per >90){             
               element.addClass('a90-100');
           }else if(per > 85){               
               element.addClass('a85-90');
           }else if(per > 80){              
               element.addClass('a80-85');
           }else if(per > 75){             
               element.addClass('a75-80');
           }else if(per > 70){              
               element.addClass('a70-75');
           }else if(per > 40){              
               element.addClass('a40-70');
           }else if(per > 10){              
               element.addClass('a10-40');
           }else if(per >= 0){             
               element.addClass('a0-10');
           }else{
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

app.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val){
        return '' + val;
      });
    }
  }
});

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: 'views/modal.html'
  };
});