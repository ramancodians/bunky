var app = angular.module('app',[]);

app.controller('MainCtrl',function($scope){
//code here.
    $scope.done = false;

    $scope.questions = [
        { "text" : 'Sponsors of which event?',
          "img" : 'spn.png'
        },
         { "text" : 'What does the ID stand for?',
          "img" : '2.jpg'
        },
         { "text" : 'When asked for the fastest way to become a millionaire, X cheekily said Become a billionaire, then start an airline?',
          "img" : ''
        },
         { "text" : 'ID?',
          "img" : '4.jpg'
        },
         { "text" : 'Cheque written by which famous personality?',
          "img" : '5.jpg'
        },
         { "text" : 'This is a Question',
          "img" : '2.jpg'
        },
         { "text" : 'This is a Question',
          "img" : ''
        },
         { "text" : 'This is a Question This is a Question This is a Question vThis is a Question',
          "img" : '5.jpg'
        },
         { "text" : 'This is a Question',
          "img" : ''
        }
    
    ]
    
    console.log($scope.questions);
    
    $scope.test = function(){
        console.log("working");
    };
  
        
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});