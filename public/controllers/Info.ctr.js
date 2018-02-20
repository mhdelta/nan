app = angular.module("LecterApp");

app.controller("InfoController", InfoController);
function InfoController($scope){
    var vm = this;
    console.log("Info controller working...");
}

