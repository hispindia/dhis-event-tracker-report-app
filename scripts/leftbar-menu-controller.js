//Controller for column show/hide
msfReportsApp.controller('LeftBarMenuController',
    function ($scope,
        $location,
        $window) {
        $scope.showTodaySchedule = function () {
            $location.path('/schedule-today').search();
        };

        $scope.showEventReport = function(){
            $location.path('/event-report').search();
        };

        $scope.showTrackerReport = function () {
            $location.path('/tracker-report').search();
        };
        $scope.showPatientReferrelReport = function(){
            $window.open('http://172.105.47.158/hp/dhis-web-reporting/getReportParams.action?uid=vBVVuET6zwY&mode=report&type=HTML', '_self')
        };
        $scope.showNewEventReport = function(){
            $location.path('/event-reports').search();
        };
    });