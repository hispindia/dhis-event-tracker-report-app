//Controller for column show/hide
msfReportsApp.controller('LeftBarMenuController',
        function($scope,
                $location) {
                $scope.showTodaySchedule = function(){
                $location.path('/event-report').search();
            };


        });