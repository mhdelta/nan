app = angular.module("LecterApp");

app.controller("CompraController", CompraController);
function CompraController($scope){
    var vm = this;
    console.log("Compra controller working...");
}

// $scope.$on("$destroy", function () {
//     vm = null;
//     delete $scope.vm;
// });

