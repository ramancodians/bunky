var app = angular.module('bunky',['ngRoute']);

/*CONFIG
*************************************************************************************/

app .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
        .when('/subject/:subjectID',{
            templateUrl : 'views/subject.html',
            controller : 'SubjectCtrl'
        })
    .when('/login',{
            templateUrl : 'views/login.html',
            controller : 'LoginCtrl'
        })
      .otherwise({
        redirectTo: '/home'
      });
  }]);

/*CONTROLLER
***********************************************************************************/

app.controller('HomeCtrl',['$scope','Attendance',function($scope,Attendance){
    
    $scope.dropdown = false;
    
       Attendance.fetch().then(function(data) {
           $scope.d = data;
           console.log(data);
       });
    
    $scope.toggle = function(){
        
        
        console.log($scope.dropdown);
        if($scope.dropdown == false){
            $scope.dropdown = true;
        }else if($scope.dropdown == true){
            $scope.dropdown = false;
        }
    }
    
    
}]);

app.controller('HeaderCtrl',['$scope','Attendance',function($scope,Attendance){
    
    Attendance.fetch().then(function(data) {
        $scope.d = data;
        $scope.d.percentage = data.attendance.percentage;
        console.log($scope.d.percentage);
    });
    
}]);


app.controller('LoginCtrl',function($scope){
    $scope.hello = "Hello!!";
    
    

});

app.controller('SubjectCtrl',['$routeParams','$scope','Attendance',function($routeParams, $scope,Attendance){
   
    $scope.dropdown = false;
    
   $scope.toggle = function(){
        console.log($scope.dropdown);
        if($scope.dropdown == false){
            $scope.dropdown = true;
        }else if($scope.dropdown == true){
            $scope.dropdown = false;
        }
    }
    
    //fetcging the Data from service
    Attendance.fetch().then(function(data) {
        $scope.d = data.attendance.subjects[$routeParams.subjectID];
        console.log($scope.d);
    });
     $scope.whichSub = $routeParams.subjectID;
    
}]);



/* FILTERS
***********************************************************************************/

app.filter('trim', function() {
  return function(text) {
    return String(text).replace(/ /mg, "-").toLowerCase();
  };
});

/* Factories
***********************************************************************************/
app.factory('Attendance', function($q, $timeout, $http) {
    var data = {
        fetch: function() {
            var deferred = $q.defer();
            $timeout(function() {
                $http.get('js/data.json').success(function(data) {
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
