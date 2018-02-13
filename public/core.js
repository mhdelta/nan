var app = angular.module('usersApp', []);

app.controller("usersController", function ($scope, $http) {

    $scope.viewAll = function () {
        try {
            $http.get("/user_profiles")
                .then(function (response) {
                    $scope.response = response.data;
                });
        } catch (error) {
            console.log(error);
        }
    }

    $scope.vars = "helaa";
});
